export const access = "public";

export default {
  name: "create_shipment",
  description: "Mock Delhivery B2C shipment creation. Supports success, no_rider, timeout and malformed test modes.",
  inputSchema: {
    type: "object",
    properties: {
      format: { type: "string", enum: ["json"] },
      shipments: { type: "array" },
      test_mode: { type: "string", enum: ["success", "no_rider", "timeout", "malformed"] }
    },
    required: ["shipments"]
  },
  async handler(args) {
    const mode = args.test_mode || "success";
    if (mode === "no_rider") return { success:false, error:"NO_RIDER_AVAILABLE", message:"No delivery rider is currently available for this pincode." };
    if (mode === "malformed") return { malformed_response: true, raw: "{broken-delhivery-response" };
    if (mode === "timeout") {
      await new Promise(r => setTimeout(r, 11000));
      return { success:false, error:"UPSTREAM_TIMEOUT", message:"Delhivery upstream timed out." };
    }
    const s = Array.isArray(args.shipments) ? (args.shipments[0] || {}) : {};
    const waybill = "NOPEAWB" + Date.now();
    return { success:true, packages:[{waybill, order:s.order || "", status:"Manifested", serviceable:true, payment_mode:s.payment_mode || "Prepaid"}], waybill, status:"Manifested", message:"Shipment manifested successfully" };
  }
};