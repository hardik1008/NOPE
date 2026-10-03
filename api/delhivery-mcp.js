import { db } from "hatchable";

export const access = "public";

const tools = [
  {
    name: "check_serviceability",
    description: "Mock Delhivery Pincode Serviceability API. Check whether a destination pincode is serviceable for prepaid delivery.",
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
    name: "create_shipment",
    description: "Mock Delhivery B2C Package Shipment Creation API. Accepts the documented shipment object fields and returns an AWB/waybill.",
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
    name: "track_shipment",
    description: "Mock Delhivery Shipment Tracking API. Track a shipment by waybill/AWB.",
    inputSchema: {
      type: "object",
      properties: { waybill: { type: "string" } },
      required: ["waybill"]
    }
  }
];

function rpc(id, result) {
  return { jsonrpc: "2.0", id, result };
}

export default async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, MCP-Protocol-Version, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method === "GET") return res.json({
    name: "NØPE Delhivery Mock MCP",
    version: "1.0.0",
    protocol: "2025-06-18",
    status: "ok"
  });

  const body = req.body || {};
  const id = body.id ?? null;
  const method = body.method;

  if (method === "initialize") {
    return res.json(rpc(id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "nope-delhivery-mock", version: "1.0.0" }
    }));
  }

  if (method === "notifications/initialized") return res.status(202).send("");
  if (method === "tools/list") return res.json(rpc(id, { tools }));
  if (method === "ping") return res.json(rpc(id, {}));

  if (method === "tools/call") {
    const name = body.params?.name;
    const args = body.params?.arguments || {};

    if (name === "check_serviceability") {
      const pin = String(args.pincode || "");
      if (pin === "000000" || pin === "110008") {
        return res.json(rpc(id, {
          content: [{ type:"text", text: JSON.stringify({
            delivery_codes: [{
              postal_code: {
                pin: Number(pin), pre_paid: "N", cod: "N", pickup: "N",
                repl: "N", remarks: "Embargo"
              }
            }]
          }) }],
          isError: false
        }));
      }
      return res.json(rpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          delivery_codes: [{
            postal_code: {
              pin: Number(pin), pre_paid: args.payment_mode === "COD" ? "N" : "Y",
              cod: "Y", pickup: "Y", repl: "Y", remarks: ""
            }
          }]
        }) }],
        isError: false
      }));
    }

    if (name === "create_shipment") {
      const mode = args.test_mode || "success";
      if (mode === "no_rider") {
        return res.json(rpc(id, {
          content: [{ type:"text", text: JSON.stringify({
            success: false, error: "NO_RIDER_AVAILABLE",
            message: "No delivery rider is currently available for this pincode."
          }) }],
          isError: true
        }));
      }
      if (mode === "timeout") {
        await new Promise(r => setTimeout(r, 11000));
        return res.json(rpc(id, {
          content: [{ type:"text", text: JSON.stringify({ success:false, error:"UPSTREAM_TIMEOUT" }) }],
          isError: true
        }));
      }
      if (mode === "malformed") {
        return res.json(rpc(id, {
          content: [{ type:"text", text:"{broken-delhivery-response" }],
          isError: false
        }));
      }

      const shipments = Array.isArray(args.shipments) ? args.shipments : [];
      const s = shipments[0] || {};
      const waybill = "NOPEAWB" + Date.now();
      return res.json(rpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          success: true,
          packages: [{
            waybill,
            order: s.order || "",
            status: "Manifested",
            serviceable: true,
            payment_mode: s.payment_mode || "Prepaid"
          }],
          waybill,
          status: "Manifested",
          message: "Shipment manifested successfully"
        }) }],
        isError: false
      }));
    }

    if (name === "track_shipment") {
      return res.json(rpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          ShipmentData: [{
            Shipment: [{
              AWB: String(args.waybill),
              Status: { Status: "In Transit", StatusType: "UD", StatusDateTime: new Date().toISOString() },
              Scans: []
            }]
          }]
        }) }],
        isError: false
      }));
    }

    return res.status(404).json({
      jsonrpc:"2.0", id,
      error:{ code:-32601, message:"Unknown tool" }
    });
  }

  return res.status(400).json({
    jsonrpc:"2.0", id,
    error:{ code:-32601, message:"Unsupported MCP method" }
  });
}