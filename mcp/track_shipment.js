export const access = "public";

export default {
  name: "track_shipment",
  description: "Mock Delhivery shipment tracking by AWB/waybill.",
  inputSchema: {
    type: "object",
    properties: { waybill: { type: "string" } },
    required: ["waybill"]
  },
  async handler(args) {
    return {
      ShipmentData: [{
        Shipment: [{
          AWB: String(args.waybill),
          Status: { Status: "In Transit", StatusType: "UD", StatusDateTime: new Date().toISOString() },
          Scans: []
        }]
      }]
    };
  }
};