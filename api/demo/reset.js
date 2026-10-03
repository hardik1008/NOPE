import { db } from "hatchable";
export const access = "public";
export const methods = ["POST"];
export default async function(req,res){
  const userId=String(req.body?.user_id || "demo-user");
  await db.query("DELETE FROM nope_events WHERE user_id=$1",[userId]);
  await db.query("DELETE FROM nope_orders WHERE user_id=$1",[userId]);
  await db.query("DELETE FROM nope_preferences WHERE user_id=$1",[userId]);
  await db.query("DELETE FROM nope_shipments WHERE order_id LIKE 'NOPE-%'");
  res.json({success:true,message:"Demo state reset. Long-term memory and orders were cleared for this demo user."});
}