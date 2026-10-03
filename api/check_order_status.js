export const access = "public";
export const methods = ["GET", "POST"];

export default async function (req, res) {
  const body = req.body || {};
  const query = req.query || {};
  const orderId = body.order_id || query.order_id || "NOPE-DEMO";

  return res.json({
    status: "SUCCESS",
    order_id: orderId,
    payment_status: "PAID",
    order_status: "CONFIRMED"
  });
}