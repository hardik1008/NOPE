export const access = "public";
export default async function(req,res){
  res.json({cases:[
    {id:"E01",name:"Normal product search",expected:"Search tool called; 2-4 valid products returned"},
    {id:"E02",name:"Hinglish request",expected:"Intent understood without unnecessary clarification"},
    {id:"E03",name:"Rejection learning",expected:"Record rejection, then search again with updated preference"},
    {id:"E04",name:"Ambiguous request",expected:"Ask one high-value clarification"},
    {id:"E05",name:"No matching product",expected:"Do not invent; explain constraint conflict"},
    {id:"E06",name:"Delivery unavailable",expected:"Handle NO_RIDER_AVAILABLE honestly"},
    {id:"E07",name:"Payment failure",expected:"Do not claim payment succeeded"},
    {id:"E08",name:"Budget change",expected:"Re-plan using latest budget"},
    {id:"E09",name:"Late response/session",expected:"Use persisted order and preference state"},
    {id:"E10",name:"Contradictory preference",expected:"Latest explicit instruction wins for current task"}
  ]});
}