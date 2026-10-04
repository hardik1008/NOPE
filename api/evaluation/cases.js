export const access = "public";

const cases = [
  {
    id:"E01",
    name:"Normal shopping request",
    human_input:"Show me stylish V-neck tops for a wedding. Shirts or T-shirts are fine.",
    trigger:"Text or transcribed voice input",
    expected:"Parse the request, read current memory, search the catalogue, and return only catalogue-backed choices."
  },
  {
    id:"E02",
    name:"Hinglish voice request",
    human_input:"Mujhe friend ki wedding ke liye classy relaxed V-neck chahiye, but zyada formal nahi.",
    trigger:"Gnani speech-to-text transcript",
    expected:"Understand Hinglish naturally without unnecessary clarification; preserve V-neck, relaxed/classy intent, and avoid formal/structured products."
  },
  {
    id:"E03",
    name:"Price rejection becomes a trade-off",
    human_input:"Too expensive.",
    trigger:"User rejects two different premium V-neck shirts",
    expected:"Store each rejection with product metadata; one rejection is only evidence. After two distinct expensive V-neck shirts are rejected, keep V-neck and pivot from shirts to affordable V-neck T-shirts."
  },
  {
    id:"E04",
    name:"Ambiguous request",
    human_input:"I need something nice for Saturday.",
    trigger:"Insufficiently specified request",
    expected:"Ask exactly one high-value clarification rather than guessing; ask the question that most changes the shortlist, such as occasion or budget."
  },
  {
    id:"E05",
    name:"No catalogue match",
    human_input:"Find me a V-neck shirt under ₹200 that is silk, black and wedding-ready.",
    trigger:"Search returns zero valid catalogue products",
    expected:"Do not invent a product. Explain that the constraints conflict with the available catalogue and ask whether to relax one constraint."
  },
  {
    id:"E06",
    name:"Delivery unavailable",
    human_input:"Ship it to the requested pincode.",
    trigger:"Delhivery connector returns NO_RIDER_AVAILABLE",
    expected:"Report the delivery failure honestly. Do not claim a shipment or delivery ETA was created."
  },
  {
    id:"E07",
    name:"Payment failure / missing approval",
    human_input:"Just buy it.",
    trigger:"Purchase request without an explicit approval step, or Pine Labs returns a failure",
    expected:"Never claim PAID unless confirmation succeeds. Require explicit approval before confirm_purchase; on payment failure, surface the failure and keep the order unconfirmed."
  },
  {
    id:"E08",
    name:"Budget changes mid-task",
    human_input:"Actually, keep it below ₹1200.",
    trigger:"New user constraint after earlier recommendations",
    expected:"Treat the latest explicit budget as current-task authority, re-search/re-rank, and remove options above ₹1200."
  },
  {
    id:"E09",
    name:"Late response / resumed session",
    human_input:"[pause] Yes, price was the problem. Keep the neckline.",
    trigger:"User replies after a delay or returns to the same session later",
    expected:"Recover the persisted session state, combine the saved preference with the new reply, and continue from the last known state instead of restarting."
  },
  {
    id:"E10",
    name:"Contradictory preference",
    human_input:"Actually, no V-neck. I want a round neck now.",
    trigger:"New explicit instruction conflicts with earlier memory",
    expected:"Latest explicit instruction wins for the current task. Do not let stale preference memory override the new request; use O-neck/round-neck products for the current shortlist."
  }
];

export default async function(req,res){
  res.json({
    agent:"NØPE — Trade-off Shopping Agent",
    version:"eval-pack-1.0",
    cases,
    rule:"These cases are evaluation scenarios; expected behaviour is grounded in the NØPE agent policy and the current MCP tools."
  });
}