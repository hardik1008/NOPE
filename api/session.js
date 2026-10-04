import { db } from "hatchable";

export const access = "public";

export default async function(req,res){
  const body=req.body||{};
  const sessionId=String(body.session_id||"").trim();
  const userId=String(body.user_id||"demo-user");
  if(!sessionId)return res.status(400).json({error:"session_id is required"});

  await db.query(
    "INSERT INTO nope_sessions (session_id,user_id) VALUES ($1,$2) ON CONFLICT (session_id) DO UPDATE SET last_seen_at=now()",
    [sessionId,userId]
  );

  const prefs=await db.query(
    "SELECT preference,value,reason,confidence,created_at FROM nope_preferences WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30",
    [userId]
  );
  const events=await db.query(
    "SELECT event_type,payload,created_at FROM nope_events WHERE user_id=$1 ORDER BY created_at DESC LIMIT 40",
    [userId]
  );

  return res.json({
    session_id:sessionId,
    user_id:userId,
    preferences:prefs.rows,
    events:events.rows,
    preference_count:prefs.rows.length
  });
}