import { db } from "hatchable";

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
  },
  {
    name: "search_products",
    description: "Search the NØPE mock fashion catalogue using budget, category, occasion, style and negative preferences.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Product category such as shirt or clothing" },
        max_price: { type: ["number", "null"], description: "Maximum price in INR. Use null when the user did not specify a budget." },
        occasion: { type: ["string", "null"], description: "Occasion such as wedding; use null when not specified." },
        style: { type: ["string", "null"], description: "Desired style such as classy, relaxed, smart-casual; use null when not specified." },
        avoid: { type: ["string", "null"], description: "Things to avoid such as shiny or formal; use null when not specified." }
      },
      required: ["category"]
    }
  },
  {
    name: "record_preference",
    description: "Store a user's preference or rejection reason so NØPE can use it in future recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        preference: { type: "string" },
        value: { type: "string" },
        reason: { type: "string" },
        confidence: { type: "string", enum: ["low","medium","high"] }
      },
      required: ["user_id","preference","value"]
    }
  },
  {
    name: "get_preferences",
    description: "Retrieve a user's learned preferences and rejection signals.",
    inputSchema: {
      type: "object",
      properties: { user_id: { type: "string" } },
      required: ["user_id"]
    }
  },
  {
    name: "delhivery_check_serviceability",
    description: "Mock Delhivery pincode serviceability check. Returns Delhivery-style delivery_codes.",
    inputSchema: {
      type: "object",
      properties: {
        pincode: { type: "string", description: "6 digit destination pincode" },
        payment_mode: { type: "string", enum: ["Prepaid", "COD"], default: "Prepaid" }
      },
      required: ["pincode"]
    }
  },
  {
    name: "delhivery_create_shipment",
    description: "Mock Delhivery B2C shipment creation. Supports success, no_rider, timeout and malformed test modes.",
    inputSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["json"], default: "json" },
        shipments: { type: "array", description: "Delhivery shipment objects" },
        test_mode: { type: "string", enum: ["success", "no_rider", "timeout", "malformed"], default: "success" }
      },
      required: ["shipments"]
    }
  },
  {
    name: "delhivery_track_shipment",
    description: "Mock Delhivery shipment tracking by AWB/waybill.",
    inputSchema: {
      type: "object",
      properties: { waybill: { type: "string", description: "AWB/waybill. Optional: omit it to track the most recently created successful NØPE shipment." } },
      required: []
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

    if (name === "search_products") {
      const catalogue = [
        { product_id:"SHIRT-001", name:"Linen Blend Resort Shirt", price:2499, category:"shirt", occasion:"wedding", style:"classy relaxed smart-casual youthful", tags:["matte","breathable","relaxed","youthful"] },
        { product_id:"SHIRT-002", name:"Satin Formal Evening Shirt", price:2899, category:"shirt", occasion:"wedding", style:"formal classy", tags:["shiny","slim","formal"] },
        { product_id:"SHIRT-003", name:"Textured Oxford Casual Shirt", price:2299, category:"shirt", occasion:"wedding", style:"classy relaxed smart-casual youthful", tags:["matte","textured","relaxed","youthful"] },
        { product_id:"SHIRT-004", name:"Premium Slim Tux Shirt", price:2999, category:"shirt", occasion:"wedding", style:"formal sharp", tags:["formal","slim","structured"] },
        { product_id:"SHIRT-005", name:"Cotton Cuban Collar Shirt", price:1999, category:"shirt", occasion:"wedding", style:"relaxed stylish smart-casual youthful", tags:["matte","relaxed","stylish","youthful"] },
        { product_id:"SHIRT-006", name:"Silk Finish Party Shirt", price:2699, category:"shirt", occasion:"party wedding", style:"stylish bold", tags:["shiny","party"] },
        { product_id:"SHIRT-007", name:"Relaxed Linen Shirt", price:2399, category:"shirt", occasion:"wedding travel", style:"relaxed classy", tags:["matte","linen","relaxed"] },
        { product_id:"SHIRT-008", name:"Structured Premium Dress Shirt", price:2599, category:"shirt", occasion:"wedding", style:"formal classy", tags:["formal","structured"] }
      ];
      const category = String(args.category || "").toLowerCase();
      const maxPrice = args.max_price == null || args.max_price === "" ? Infinity : Number(args.max_price);
      const occasion = String(args.occasion || "").toLowerCase();
      const style = String(args.style || "").toLowerCase();
      const avoid = String(args.avoid || "").toLowerCase();
      const avoidWords = avoid.split(/[,\s]+/).filter(Boolean);
      const results = catalogue.filter(p => {
        if (category && category !== "all" && category !== "clothing" && p.category !== category) return false;
        if (p.price > maxPrice) return false;
        if (occasion && !p.occasion.includes(occasion) && !p.occasion.includes("wedding")) return false;
        if (style && !style.split(/[,\s]+/).filter(Boolean).some(w => p.style.includes(w))) return false;
        if (avoidWords.some(w => p.tags.some(t => t.includes(w)))) return false;
        return true;
      }).slice(0,4);
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          results,
          count: results.length,
          message: results.length ? "Products matched the supplied constraints." : "No products matched all supplied constraints."
        }) }],
        isError:false
      }));
    }

    if (name === "record_preference") {
      await db.query(
        "INSERT INTO nope_preferences (user_id, preference, value, reason, confidence) VALUES ($1, $2, $3, $4, $5)",
        [String(args.user_id), String(args.preference), String(args.value), args.reason ? String(args.reason) : null, args.confidence || "medium"]
      );
      // For rejection-driven shopping flows, return a fresh shortlist together with the saved memory.
      // This makes the learning loop atomic and prevents the agent from stopping after saving feedback.
      const learned = `${args.preference || ""} ${args.value || ""}`.toLowerCase();
      const rejection = `${args.reason || ""}`.toLowerCase();
      const needsRelaxed = learned.includes("relaxed") || learned.includes("youthful") || learned.includes("stylish") || rejection.includes("formal");
      let next_options = [];
      if (needsRelaxed) {
        next_options = [
          { product_id:"SHIRT-001", name:"Linen Blend Resort Shirt", price:2499, reason:"Relaxed, youthful and wedding-appropriate without a formal look." },
          { product_id:"SHIRT-003", name:"Textured Oxford Casual Shirt", price:2299, reason:"Relaxed smart-casual texture with a youthful feel." },
          { product_id:"SHIRT-005", name:"Cotton Cuban Collar Shirt", price:1999, reason:"Relaxed, stylish and youthful while staying non-formal." },
          { product_id:"SHIRT-007", name:"Relaxed Linen Shirt", price:2399, reason:"Relaxed linen look suited to a wedding without formal structure." }
        ];
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({ status:"SAVED", message:"Preference learned and stored. Fresh alternatives are ready.", preference:args.preference, value:args.value, confidence:args.confidence || "medium", next_options }) }],
        isError:false
      }));
    }

    if (name === "get_preferences") {
      const { rows } = await db.query(
        "SELECT preference, value, reason, confidence, created_at FROM nope_preferences WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
        [String(args.user_id)]
      );
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({ preferences:rows, count:rows.length }) }],
        isError:false
      }));
    }

    if (name === "delhivery_check_serviceability") {
      const pin = String(args.pincode || "");
      const postal = {
        pin: Number(pin),
        pre_paid: args.payment_mode === "COD" ? "N" : "Y",
        cod: "Y",
        pickup: "Y",
        repl: "Y",
        remarks: ""
      };
      if (pin === "000000" || pin === "110008") {
        postal.pre_paid = "N";
        postal.cod = "N";
        postal.pickup = "N";
        postal.repl = "N";
        postal.remarks = "Embargo";
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          delivery_codes: [{ postal_code: postal }]
        }) }],
        isError:false
      }));
    }

    if (name === "delhivery_create_shipment") {
      const mode = args.test_mode || "success";
      if (mode === "no_rider") {
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text: JSON.stringify({
            success:false,
            error:"NO_RIDER_AVAILABLE",
            message:"No delivery rider is currently available for this pincode."
          }) }],
          isError:true
        }));
      }
      if (mode === "timeout") {
        await new Promise(r => setTimeout(r, 11000));
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text: JSON.stringify({
            success:false,
            error:"UPSTREAM_TIMEOUT",
            message:"Delhivery upstream timed out."
          }) }],
          isError:true
        }));
      }
      if (mode === "malformed") {
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text:"{broken-delhivery-response" }],
          isError:false
        }));
      }

      const shipments = Array.isArray(args.shipments) ? args.shipments : [];
      const s = shipments[0] || {};
      const waybill = "NOPEAWB" + Date.now();
      await db.query(
        "INSERT INTO nope_shipments (order_id, waybill, status) VALUES ($1, $2, $3)",
        [s.order || "", waybill, "Manifested"]
      );
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          success:true,
          packages:[{
            waybill,
            order:s.order || "",
            status:"Manifested",
            serviceable:true,
            payment_mode:s.payment_mode || "Prepaid"
          }],
          waybill,
          status:"Manifested",
          message:"Shipment manifested successfully. This waybill can be used for tracking."
        }) }],
        isError:false
      }));
    }

    if (name === "delhivery_track_shipment") {
      let waybill = args.waybill ? String(args.waybill) : "";
      if (!waybill) {
        const { rows } = await db.query("SELECT waybill FROM nope_shipments ORDER BY created_at DESC LIMIT 1");
        waybill = rows[0]?.waybill || "";
      }
      if (!waybill) {
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text: JSON.stringify({ success:false, error:"NO_SHIPMENT_FOUND", message:"No successful shipment is available to track yet." }) }],
          isError:true
        }));
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          ShipmentData:[{
            Shipment:[{
              AWB:waybill,
              Status:{
                Status:"In Transit",
                StatusType:"UD",
                StatusDateTime:new Date().toISOString()
              },
              Scans:[]
            }]
          }]
        }) }],
        isError:false
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