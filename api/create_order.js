export const access = "public";
export const methods = ["POST"];

export default async function (req, res) {
  const body = req.body || {};
  const testMode = String(body.test_mode || body.mode || "success").toLowerCase();
  const amount = Number(body.amount || 2999);
  const productId = body.product_id || "NOPE-SHIRT-001";

  if (testMode === "timeout") {
    await new Promise(resolve => setTimeout(resolve, 11000));
    return res.status(504).json({
      status: "TIMEOUT",
      message: "Pine Labs payment rail timed out"
    });
  }

  if (testMode === "balance_low" || testMode === "insufficient_balance") {
    return res.status(402).json({
      status: "FAILED",
      error_code: "BALANCE_TOO_LOW",
      message: "Insufficient balance"
    });
  }

  if (testMode === "malformed") {
    return res.json({
      payment: {
        unexpected_field: true
      }
    });
  }

  const orderId = "NOPE-" + Date.now();

  return res.json({
    status: "SUCCESS",
    order_id: orderId,
    payment_status: "PAID",
    amount,
    currency: "INR",
    product_id: productId,
    message: "Order created successfully"
  });
}