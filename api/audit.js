import { db } from "hatchable";
export const access = "public";
export default async function(req,res){
  const userId=String(req.query?.user_id || "demo-user");
  const {rows}=await db.query("SELECT id,event_type,order_id,payload,created_at FROM nope_events WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100",[userId]);
  res.json({user_id:userId,events:rows});
}