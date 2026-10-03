export const access = "public";

export default {
  name: "check_serviceability",
  description: "Mock Delhivery pincode serviceability check.",
  inputSchema: {
    type: "object",
    properties: {
      pincode: { type: "string" },
      payment_mode: { type: "string", enum: ["Prepaid", "COD"] }
    },
    required: ["pincode"]
  },
  async handler(args) {
    const pin = String(args.pincode || "");
    if (pin === "000000" || pin === "110008") {
      return {
        delivery_codes: [{
          postal_code: { pin: Number(pin), pre_paid: "N", cod: "N", pickup: "N", repl: "N", remarks: "Embargo" }
        }]
      };
    }
    return {
      delivery_codes: [{
        postal_code: {
          pin: Number(pin), pre_paid: args.payment_mode === "COD" ? "N" : "Y",
          cod: "Y", pickup: "Y", repl: "Y", remarks: ""
        }
      }]
    };
  }
};