export const access = "public";

export default async function(req,res){
  res.setHeader("Content-Type","text/html; charset=utf-8");
  res.send(`<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NØPE Memory · Decision Analytics</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f6f7f9;color:#111;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
a{text-decoration:none;color:inherit}.wrap{max-width:1220px;margin:auto;padding:28px 22px 60px}
.top{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:26px}.brand{font-weight:950;letter-spacing:.02em}.topRight{display:flex;gap:8px;align-items:center}.btn{border:1px solid #e1e4e8;background:#fff;border-radius:999px;padding:9px 13px;font-size:11px;font-weight:850;cursor:pointer}.btn.dark{background:#111;color:#fff;border-color:#111}
.eyebrow{font-size:9px;font-weight:950;letter-spacing:.14em;color:#98a2b3;text-transform:uppercase}.hero{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:22px}.hero h1{font-size:34px;line-height:1.02;letter-spacing:-.045em;margin:7px 0}.hero p{max-width:650px;color:#667085;font-size:13px;line-height:1.55;margin:0}.live{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:850;padding:7px 10px;border:1px solid #ccebd9;background:#f4fff8;color:#087443;border-radius:999px}.dot{width:7px;height:7px;border-radius:50%;background:#087443}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}.stat{background:#fff;border:1px solid #e4e7ec;border-radius:18px;padding:15px}.stat b{display:block;font-size:25px;letter-spacing:-.03em}.stat span{display:block;font-size:9px;color:#98a2b3;text-transform:uppercase;letter-spacing:.1em;margin-top:4px}
.grid{display:grid;grid-template-columns:1.15fr .85fr;gap:12px}.card{background:#fff;border:1px solid #e4e7ec;border-radius:20px;padding:17px}.cardTitle{font-size:12px;font-weight:950;letter-spacing:.01em}.cardSub{font-size:10px;color:#667085;margin-top:3px}.section{margin-top:15px}.sectionHead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}.sectionLabel{font-size:8px;font-weight:950;letter-spacing:.12em;color:#98a2b3;text-transform:uppercase}.tag{font-size:8px;font-weight:850;color:#667085;background:#f6f7f9;border-radius:999px;padding:5px 7px}
.signal{border-top:1px solid #eef0f3;padding:9px 0;display:grid;grid-template-columns:120px 1fr 72px;gap:10px;align-items:start;font-size:10px}.signal:first-child{border-top:0}.signal b{font-size:9px}.value{font-weight:800}.reason{font-size:9px;color:#667085;margin-top:3px;line-height:1.35}.meta{font-size:8px;color:#98a2b3;text-align:right;line-height:1.5}.kindLike{color:#087443}.kindAvoid{color:#b42318}.kindNeutral{color:#667085}
.flow{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;align-items:center;margin-top:16px}.flowItem{padding:10px;border:1px solid #e7e9ee;border-radius:13px;background:#fbfcfd}.flowNum{font-size:8px;color:#98a2b3;font-weight:900}.flowTitle{font-size:10px;font-weight:900;margin-top:3px}.arrow{text-align:center;color:#b0b7c2;font-size:12px}
.evidence{border:1px solid #e7e9ee;border-radius:15px;padding:12px;background:#fbfcfd}.evidenceLine{display:flex;align-items:center;gap:8px;font-size:10px;padding:7px 0}.check{width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:#111;color:#fff;font-size:10px;font-weight:950}.green{background:#087443}.red{background:#b42318}.evidence strong{font-size:11px}.evidence small{display:block;color:#667085;font-size:9px;margin-top:2px}
.sourceGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.source{border:1px solid #e7e9ee;border-radius:14px;padding:11px}.source b{font-size:18px}.source span{display:block;font-size:8px;color:#98a2b3;text-transform:uppercase;letter-spacing:.08em;margin-top:2px}
.timeline{display:grid;gap:8px;max-height:415px;overflow:auto;padding-right:3px}.event{display:grid;grid-template-columns:10px 1fr;gap:8px}.eventDot{width:7px;height:7px;border-radius:50%;background:#111;margin-top:5px}.eventType{font-size:9px;font-weight:900}.eventBody{font-size:9px;color:#667085;line-height:1.35}.eventTime{font-size:8px;color:#98a2b3;margin-top:2px}
.note{margin-top:12px;border:1px dashed #d5d9df;border-radius:15px;padding:11px 12px;font-size:9px;color:#667085;line-height:1.5;background:#fafbfc}.back{font-size:10px}
.empty{color:#98a2b3;font-size:10px;padding:12px 0}.footer{margin-top:18px;color:#98a2b3;font-size:9px;text-align:center}
@media(max-width:900px){.stats{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.flow{grid-template-columns:1fr}.arrow{transform:rotate(90deg)}.hero{align-items:flex-start;flex-direction:column}.signal{grid-template-columns:95px 1fr 60px}}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <a class="brand" href="/">NØPE</a>
    <div class="topRight"><span id="live" class="live"><span class="dot"></span> LIVE MEMORY</span><button id="refresh" class="btn">Refresh</button><a href="/" class="btn">← Store</a></div>
  </div>

  <div class="hero">
    <div>
      <div class="eyebrow">Decision intelligence · persistent memory</div>
      <h1>What NØPE remembers — and why.</h1>
      <p>This page is intentionally separate from the storefront. It turns the underlying Postgres state into a human-readable evidence layer: what the shopper did, what NØPE stored, how confident it is, and what should influence the next recommendation.</p>
    </div>
    <div class="tag" id="sessionTag">Session loading…</div>
  </div>

  <div class="stats">
    <div class="stat"><b id="sessions">—</b><span>sessions stored</span></div>
    <div class="stat"><b id="prefs">—</b><span>preference signals</span></div>
    <div class="stat"><b id="events">—</b><span>events stored</span></div>
    <div class="stat"><b id="current">—</b><span>signals this session</span></div>
  </div>

  <div class="card" style="margin-bottom:12px">
    <div class="cardTitle">NØPE's memory loop</div>
    <div class="cardSub">Every meaningful action becomes evidence before it becomes a recommendation rule.</div>
    <div class="flow">
      <div class="flowItem"><div class="flowNum">01</div><div class="flowTitle">Observe</div><div class="cardSub">voice · text · click · hover</div></div>
      <div class="arrow">→</div>
      <div class="flowItem"><div class="flowNum">02</div><div class="flowTitle">Store</div><div class="cardSub">Postgres memory</div></div>
      <div class="arrow">→</div>
      <div class="flowItem"><div class="flowNum">03</div><div class="flowTitle">Interpret</div><div class="cardSub">preference + confidence</div></div>
      <div class="arrow">→</div>
      <div class="flowItem"><div class="flowNum">04</div><div class="flowTitle">Rank</div><div class="cardSub">more like what you liked</div></div>
      <div class="arrow">→</div>
      <div class="flowItem"><div class="flowNum">05</div><div class="flowTitle">Adapt</div><div class="cardSub">next shortlist changes</div></div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="card">
        <div class="cardTitle">Current session</div>
        <div class="cardSub">The active decision context NØPE uses right now.</div>
        <div class="section"><div class="sectionHead"><div class="sectionLabel">Positive / affinity</div><span class="tag" id="likeCount">0</span></div><div id="likes"></div></div>
        <div class="section"><div class="sectionHead"><div class="sectionLabel">Avoid / rejection</div><span class="tag" id="avoidCount">0</span></div><div id="avoids"></div></div>
        <div class="section"><div class="sectionHead"><div class="sectionLabel">Constraints / preferences</div><span class="tag" id="constraintCount">0</span></div><div id="constraints"></div></div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="cardTitle">Decision evidence</div>
        <div class="cardSub">The most useful part to show the evaluator: why the next recommendation should change.</div>
        <div class="section" id="evidence"></div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="cardTitle">Signals by source</div>
        <div class="cardSub">NØPE can learn from natural behavior instead of a profile questionnaire.</div>
        <div class="section sourceGrid" id="sources"></div>
      </div>
    </div>

    <div>
      <div class="card">
        <div class="cardTitle">Persistent profile memory</div>
        <div class="cardSub">Latest stored signals across the same demo user, including previous sessions.</div>
        <div class="section" id="profile"></div>
        <div class="note"><b>Important:</b> session memory and profile history are both persisted in Postgres. The demo's Reset action is intentionally available because this is a repeatable test environment; it clears demo-user data.</div>
      </div>

      <div class="card" style="margin-top:12px">
        <div class="cardTitle">Agent event stream</div>
        <div class="cardSub">Raw events are translated into a readable decision trace here.</div>
        <div class="section timeline" id="timeline"></div>
      </div>
    </div>
  </div>

  <div class="footer">NØPE · Persistent decision memory · powered by the project's Postgres database</div>
</div>

<script>
const sidKey="nope_session_id";
let sessionId=localStorage.getItem(sidKey);
if(!sessionId){sessionId="sess_"+crypto.randomUUID();localStorage.setItem(sidKey,sessionId)}
const $=id=>document.getElementById(id);

function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}
function kind(p){
  const s=((p.preference||"")+" "+(p.value||"")+" "+(p.reason||"")).toLowerCase();
  if(/reject|avoid|not right|too expensive|dislike|hate/.test(s))return "avoid";
  if(/affinity|add_to_bag|save|purchase|prefer|like/.test(s))return "like";
  return "neutral";
}
function signalRow(p){
  return '<div class="signal"><div><b class="'+(kind(p)==="avoid"?"kindAvoid":kind(p)==="like"?"kindLike":"kindNeutral")+'">'+esc(p.signal_type||p.preference||"signal")+'</b></div><div><div class="value">'+esc(p.value||p.preference)+'</div><div class="reason">'+esc(p.reason||"")+'</div></div><div class="meta">'+esc(p.confidence||"medium")+'<br>'+esc(p.source||"agent")+'</div></div>';
}
function evidenceHTML(prefs){
  const positives=prefs.filter(p=>/add_to_bag|save|purchase|product affinity|save affinity/.test((p.signal_type||"")+" "+(p.preference||"")));
  const rejects=prefs.filter(p=>/rejection|too expensive|not right/.test(((p.signal_type||"")+" "+(p.value||"")+" "+(p.reason||"")).toLowerCase()));
  const neckline=prefs.find(p=>/neckline/.test((p.preference||"").toLowerCase()));
  let out="";
  if(positives[0])out+='<div class="evidenceLine"><span class="check green">✓</span><div><strong>Positive anchor</strong><small>'+esc(positives[0].value)+' → use its attributes to find more like it.</small></div></div>';
  if(rejects[0])out+='<div class="evidenceLine"><span class="check red">×</span><div><strong>Negative evidence</strong><small>'+esc(rejects[0].value)+' → exact rejected product stays excluded.</small></div></div>';
  if(neckline)out+='<div class="evidenceLine"><span class="check">↗</span><div><strong>Stable preference</strong><small>'+esc(neckline.value)+' → preserve this dimension while other trade-offs change.</small></div></div>';
  if(!out)out='<div class="empty">No high-value decision evidence in this session yet. Use the storefront and come back here.</div>';
  return out;
}
function sourceCounts(prefs){
  const c={voice:0,text:0,ui:0,agent:0};
  prefs.forEach(p=>{const s=(p.source||"agent").toLowerCase();if(c[s]!==undefined)c[s]++;else c.agent++});
  return [['🎙 Voice',c.voice],['⌨ Text',c.text],['👆 UI',c.ui]];
}
function render(d){
  $("sessions").textContent=d.total_sessions??0;
  $("prefs").textContent=d.total_preferences??0;
  $("events").textContent=d.total_events??0;
  const prefs=d.session_preferences||[], profile=d.profile_preferences||[];
  $("current").textContent=prefs.length;
  $("sessionTag").textContent="Active · "+String(d.session_id||sessionId).slice(0,20)+"…";
  const likes=prefs.filter(p=>kind(p)==="like").slice(0,8);
  const avoids=prefs.filter(p=>kind(p)==="avoid").slice(0,8);
  const constraints=prefs.filter(p=>kind(p)==="neutral").slice(0,8);
  $("likes").innerHTML=likes.length?likes.map(signalRow).join(""):'<div class="empty">Nothing high-value yet.</div>';
  $("avoids").innerHTML=avoids.length?avoids.map(signalRow).join(""):'<div class="empty">Nothing rejected yet.</div>';
  $("constraints").innerHTML=constraints.length?constraints.map(signalRow).join(""):'<div class="empty">No additional constraints yet.</div>';
  $("likeCount").textContent=likes.length;$("avoidCount").textContent=avoids.length;$("constraintCount").textContent=constraints.length;
  $("evidence").innerHTML=evidenceHTML(prefs);
  $("sources").innerHTML=sourceCounts(prefs).map(x=>'<div class="source"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join("");
  $("profile").innerHTML=profile.length?profile.slice(0,18).map(signalRow).join(""):'<div class="empty">No historical memory yet.</div>';
  const ev=d.events||[];
  $("timeline").innerHTML=ev.length?ev.slice(0,24).map(e=>'<div class="event"><span class="eventDot"></span><div><div class="eventType">'+esc(e.event_type||"EVENT")+'</div><div class="eventBody">'+esc(typeof e.payload==="string"?e.payload:JSON.stringify(e.payload||{}))+'</div><div class="eventTime">'+esc(e.created_at||"")+'</div></div></div>').join(""):'<div class="empty">No events yet.</div>';
}
async function load(){
  $("live").innerHTML='<span class="dot"></span> LOADING MEMORY';
  try{
    const r=await fetch("/api/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:sessionId,user_id:"demo-user"})});
    const d=await r.json();render(d);
    $("live").innerHTML='<span class="dot"></span> LIVE MEMORY';
  }catch(e){
    $("live").innerHTML='<span class="dot" style="background:#b42318"></span> MEMORY ERROR';
  }
}
$("refresh").onclick=load;
load();
setInterval(load,5000);
</script>
</body></html>`);
}