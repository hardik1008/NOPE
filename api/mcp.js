export const access = "public";

const tools = [
  {
    name: "create_order",
    description: "Create a mock Pine Labs order. Supports test_mode values: balance_low, timeout, malformed.",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number", description: "Order amount in INR" },
        currency: { type: "string", default: "INR" },
        product_id: { type: "string" },
        test_mode: { type: "string", enum: ["success", "balance_low", "timeout", "malformed"] }
      },
      required: ["amount", "product_id"]
    }
  },
  {
    name: "check_order_status",
    description: "Check the status of a mock Pine Labs order.",
    inputSchema: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"]
    }
  }
];

function jsonRpc(id, result) {
  return { jsonrpc: "2.0", id, result };
}

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, MCP-Protocol-Version, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method === "GET") {
    return res.json({
      name: "NØPE Pine Labs Mock MCP",
      version: "1.0.0",
      protocol: "2025-06-18",
      status: "ok"
    });
  }

  const body = req.body || {};
  const id = body.id ?? null;
  const method = body.method;

  if (method === "initialize") {
    return res.json(jsonRpc(id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "nope-pine-labs-mock", version: "1.0.0" }
    }));
  }

  if (method === "notifications/initialized") {
    return res.status(202).send("");
  }

  if (method === "tools/list") {
    return res.json(jsonRpc(id, { tools }));
  }

  if (method === "tools/call") {
    const name = body.params?.name;
    const args = body.params?.arguments || {};

    if (name === "create_order") {
      const mode = args.test_mode || "success";

      if (mode === "balance_low" || mode === "insufficient_balance") {
        return res.json(jsonRpc(id, {
          content: [{ type: "text", text: JSON.stringify({
            status: "BALANCE_TOO_LOW",
            message: "Merchant balance is insufficient to create the order."
          }) }],
          isError: true
        }));
      }

      if (mode === "timeout") {
        await new Promise(resolve => setTimeout(resolve, 11000));
        return res.json(jsonRpc(id, {
          content: [{ type: "text", text: JSON.stringify({
            status: "TIMEOUT",
            message: "Upstream payment service timed out."
          }) }],
          isError: true
        }));
      }

      if (mode === "malformed") {
        return res.json(jsonRpc(id, {
          content: [{ type: "text", text: "{malformed-response" }],
          isError: false
        }));
      }

      const orderId = "NOPE-" + Date.now();
      return res.json(jsonRpc(id, {
        content: [{ type: "text", text: JSON.stringify({
          status: "SUCCESS",
          order_id: orderId,
          payment_status: "PAID",
          amount: args.amount,
          currency: args.currency || "INR",
          product_id: args.product_id,
          message: "Order created successfully"
        }) }],
        isError: false
      }));
    }

    if (name === "check_order_status") {
      return res.json(jsonRpc(id, {
        content: [{ type: "text", text: JSON.stringify({
          order_id: args.order_id,
          status: "CONFIRMED",
          payment_status: "PAID",
          message: "Order confirmed"
        }) }],
        isError: false
      }));
    }

    return res.status(404).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Unknown tool" }
    });
  }

  if (method === "ping") {
    return res.json(jsonRpc(id, {}));
  }

  return res.status(400).json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Unsupported MCP method" }
  });
}