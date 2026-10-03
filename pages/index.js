export const access = "public";

export default async function (req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>NØPE — Voice</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:#f7f7f5;color:#111}.wrap{max-width:720px;margin:auto;padding:48px 22px}.brand{font-weight:800}.card{margin-top:28px;background:#fff;border:1px solid #e7e7e2;border-radius:24px;padding:28px;box-shadow:0 12px 40px #0000000a}h1{font-size:36px;margin:8px 0}.sub{color:#666;line-height:1.5}.mic{width:118px;height:118px;border-radius:50%;border:0;background:#111;color:#fff;font-size:42px;cursor:pointer;display:block;margin:28px auto 12px}.mic.recording{background:#d92d20;animation:pulse 1.2s infinite}.hint{text-align:center;color:#777;font-size:14px}@keyframes pulse{50%{transform:scale(1.06)}}.box{margin-top:24px;background:#fafafa;border-radius:16px;padding:16px;min-height:72px}.label{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888}.transcript{font-size:18px;margin-top:6px}.actions{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}.btn{border:1px solid #ddd;background:#fff;border-radius:12px;padding:12px 16px;font-weight:700;cursor:pointer}.primary{background:#111;color:#fff;border-color:#111}.status{margin-top:16px;font-size:14px;color:#666}.ok{color:#087443}.err{color:#b42318}audio{width:100%;margin-top:14px}.note{margin-top:22px;padding:14px;border-radius:14px;background:#f1f1ed;color:#666;font-size:13px;line-height:1.5}
</style></head><body><div class="wrap"><div class="brand">NØPE · VOICE BRIDGE</div><div class="card">
<div class="label">Gnani voice input</div><h1>Talk to NØPE.</h1><div class="sub">Speak naturally in Hindi, English or Hinglish. Your voice is converted to text by Gnani STT.</div>
<button id="mic" class="mic">🎙</button><div id="hint" class="hint">Click to start speaking</div>
<div class="box"><div class="label">Transcript</div><div id="transcript" class="transcript">—</div></div>
<div class="actions"><button id="copy" class="btn">Copy transcript</button><button id="open" class="btn primary">Open NØPE in AgenticOrg</button><button id="speak" class="btn">🔊 Test Gnani TTS</button></div>
<div id="status" class="status"></div><audio id="audio" controls hidden></audio>
<div class="note"><b>Live voice loop:</b> Microphone → Gnani STT → NØPE decision layer → product search + preference memory → Gnani TTS → 🔊 NØPE speaks back. AgenticOrg remains the configured NØPE agent; this browser bridge provides the missing voice I/O surface.</div>
</div></div>
<script>
const mic=document.getElementById("mic"),hint=document.getElementById("hint"),transcriptEl=document.getElementById("transcript"),statusEl=document.getElementById("status"),audio=document.getElementById("audio");let recorder,chunks=[],recording=false,transcript="";
function setStatus(t,c){statusEl.textContent=t;statusEl.className="status "+(c||"")}
function audioBufferToWav(b){const r=b.sampleRate,n=b.length,o=new ArrayBuffer(44+n*2),v=new DataView(o),w=(p,s)=>{for(let i=0;i<s.length;i++)v.setUint8(p+i,s.charCodeAt(i))};w(0,"RIFF");v.setUint32(4,36+n*2,true);w(8,"WAVE");w(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,r,true);v.setUint32(28,r*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,"data");v.setUint32(40,n*2,true);const c=b.getChannelData(0);let p=44;for(let i=0;i<n;i++){let s=Math.max(-1,Math.min(1,c[i]));v.setInt16(p,s<0?s*32768:s*32767,true);p+=2}return new Blob([o],{type:"audio/wav"})}
function b64(blob){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(",")[1]);r.onerror=no;r.readAsDataURL(blob)})}
async function gnani(name,args){const r=await fetch("/api/mcp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:Date.now(),method:"tools/call",params:{name,arguments:args}})});const j=await r.json();if(j.error)throw Error(j.error.message||"MCP error");const t=j.result?.content?.find(x=>x.type==="text")?.text;return t?JSON.parse(t):j.result}
async function runNopeVoice(){
  setStatus("NØPE is thinking…");
  const q=transcript.toLowerCase();
  const budgetMatch=q.match(/(?:₹|rs\.?|rupees?\s*)([0-9,]+)/i);
  const budget=budgetMatch?Number(budgetMatch[1].replace(/,/g,"")):3000;
  const category=/shirt|clothing|top/.test(q)?"clothing":"shirt";
  const occasion=/wedding|shaadi|marriage/.test(q)?"wedding":null;
  const avoid=[/shiny|chamak|silk/.test(q)?"shiny":null,/formal|uncle/.test(q)?"formal":null].filter(Boolean).join(",");
  const style=/relaxed|casual|chill|youthful|stylish/.test(q)?"classy relaxed":(/classy/.test(q)?"classy":null);
  const prefs=await gnani("get_preferences",{user_id:"demo-user"});
  const found=await gnani("search_products",{category,max_price:budget,occasion,style,avoid});
  const products=found.results||[];
  let ranked=products;
  if(products.length) {
    const rr=await gnani("rank_products",{products,preferences:prefs.preferences||[],intent:transcript});
    ranked=rr.results||products;
  }
  if(!ranked.length){
    var reply="Mujhe abhi aapki requirements ke saath koi suitable option nahi mila. Aap budget ya style mein kya change karna chahenge?";
  } else {
    const picks=ranked.slice(0,3);
    reply="Bilkul. Maine aapke liye "+picks.length+" options shortlist kiye. "+picks.map((p,i)=>(i+1)+". "+p.name+" — ₹"+p.price).join(". ")+" . Ye options aapki current requirements ke closest hain.";
  }
  transcriptEl.textContent=transcript;
  setStatus("NØPE found the options. Speaking…","ok");
  const t=await gnani("gnani_text_to_speech",{text:reply,language:"hi-en",voice:"Poorvi",speed:1});
  if(!t.success) throw Error(t.error||"TTS failed");
  audio.src=t.audio_url;audio.hidden=false;await audio.play();
  hint.textContent="NØPE replied — click 🎙️ to speak again";
  setStatus("✓ Full voice loop complete","ok");
}
async function start(){const stream=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(stream);chunks=[];recording=true;mic.classList.add("recording");hint.textContent="Listening… click again to stop";recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());mic.classList.remove("recording");hint.textContent="Processing with Gnani…";try{const blob=new Blob(chunks,{type:recorder.mimeType}),ctx=new AudioContext(),decoded=await ctx.decodeAudioData(await blob.arrayBuffer()),wav=audioBufferToWav(decoded);await ctx.close();const r=await gnani("gnani_speech_to_text",{audio_base64:await b64(wav),language_code:"hi-IN",preferred_language:"hi-IN",format:"transcribe"});if(!r.success)throw Error(r.error||("Gnani STT failed: "+r.status_code));transcript=typeof r.transcript==="string"?r.transcript:JSON.stringify(r.transcript);transcriptEl.textContent=transcript||"No speech detected";hint.textContent="Transcript received — NØPE is thinking";setStatus("✓ Gnani STT worked","ok");await runNopeVoice()}catch(e){hint.textContent="Try again";setStatus("STT error: "+e.message,"err")}};recorder.start()}
mic.onclick=async()=>{try{if(!recording)await start();else{recording=false;recorder.stop()}}catch(e){recording=false;mic.classList.remove("recording");setStatus(e.message,"err")}};
document.getElementById("copy").onclick=async()=>{if(transcript){await navigator.clipboard.writeText(transcript);setStatus("✓ Transcript copied.","ok")}};
document.getElementById("open").onclick=async()=>{if(transcript)await navigator.clipboard.writeText(transcript);window.open("https://agenticorg.hackathon.pinelabs.com/dashboard/agents","_blank");setStatus("✓ Transcript copied. Paste into NØPE Chat.","ok")};
document.getElementById("speak").onclick=async()=>{if(!transcript){setStatus("Speak first.","err");return}try{setStatus("Generating Gnani TTS…");const r=await gnani("gnani_text_to_speech",{text:transcript,language:"hi-en",voice:"Poorvi",speed:1});if(!r.success)throw Error(r.error||"TTS failed");audio.src=r.audio_url;audio.hidden=false;await audio.play();setStatus("✓ Gnani TTS worked","ok")}catch(e){setStatus("TTS error: "+e.message,"err")}};
</script></body></html>`);
}