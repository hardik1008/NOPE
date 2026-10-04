(() => {
"use strict";
const $=id=>document.getElementById(id);
const API="/api/mcp";
// NØPE permanent voice configuration.
const NOPE_VOICE="Nalini";
const NOPE_LANGUAGE="hi-IN";
const NOPE_SPEED=1.0;

function injectIntelligenceUI(){
  const store=document.querySelector(".store");
  if(!store||document.getElementById("nopeIntel"))return;
  const s=document.createElement("style");
  s.textContent=`
  #nopeIntel{display:grid;grid-template-columns:1.1fr .9fr;gap:12px;margin-top:18px}
  .intelCard{border:1px solid #e4e7ec;border-radius:18px;background:#fbfcfe;padding:16px}
  .intelHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .intelTitle{font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
  .intelLive{font-size:10px;font-weight:850;padding:5px 8px;border-radius:999px;background:#111;color:#fff}
  .understood{display:flex;flex-wrap:wrap;gap:7px}
  .signal{padding:7px 9px;border-radius:999px;border:1px solid #e5e7eb;background:#fff;font-size:11px;font-weight:750}
  .signal.hard{border-color:#f0c7c7;background:#fff7f7}
  .signal.good{border-color:#ccebd9;background:#f4fff8}
  .metricRow{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .metric{background:#fff;border:1px solid #eaecf0;border-radius:12px;padding:10px}
  .metric b{display:block;font-size:18px}.metric span{font-size:10px;color:#667085}
  .memoryLine{font-size:12px;line-height:1.6;color:#475467}
  .memoryLine b{color:#111}
  .decisionBar{margin-top:12px;border-radius:14px;background:#111;color:#fff;padding:12px;font-size:12px}
  .decisionBar span{opacity:.72}
  .nopeReject{margin-top:7px;width:100%;border:1px solid #f1caca;background:#fff7f7;color:#a61b1b;border-radius:10px;padding:8px;font-size:11px;font-weight:800;cursor:pointer}
  .whyBtn{margin-top:7px;width:100%;border:1px solid #e4e7ec;background:#fff;color:#111;border-radius:10px;padding:8px;font-size:11px;font-weight:800;cursor:pointer}
  .whyBox{display:none;margin-top:8px;padding:9px;border-radius:10px;background:#f8fafc;font-size:10px;color:#475467;line-height:1.45}
  .demoBtn{background:#111!important;color:#fff!important;border-color:#111!important}
  .sessionMemory{margin-top:12px;padding:11px;border:1px solid #eaecf0;border-radius:12px;background:#fff}
  .prefGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .prefLabel{font-size:9px;font-weight:900;letter-spacing:.08em;color:#98a2b3;margin-bottom:6px}
  .prefItem{padding:7px 0;border-bottom:1px solid #f0f1f3}
  .prefMain{font-size:11px;font-weight:800;display:block}
  .prefMeta{font-size:9px;color:#98a2b3}
  .prefReason{font-size:9px;color:#667085;margin-top:2px}
  .emptyMemory{font-size:10px;color:#98a2b3;line-height:1.4}
  .sessionFoot{font-size:9px;color:#98a2b3;margin-top:8px}
  .learningHint{font-size:10px;color:#667085;margin-top:8px;line-height:1.4}
  @media(max-width:900px){.prefGrid{grid-template-columns:1fr}}
  @media(max-width:900px){#nopeIntel{grid-template-columns:1fr}.metricRow{grid-template-columns:repeat(3,1fr)}}
  `;
  document.head.appendChild(s);
  const intel=document.createElement("div");
  intel.id="nopeIntel";
  intel.innerHTML=`
    <div class="intelCard">
      <div class="intelHead"><div class="intelTitle">🧠 NØPE intelligence</div><div class="intelLive">LIVE DECISION LAYER</div></div>
      <div class="label">I understood</div>
      <div id="understood" class="understood">
        <span class="signal">Waiting for intent…</span>
      </div>
      <div class="metricRow" style="margin-top:12px">
        <div class="metric"><b id="searchedMetric">—</b><span>catalogue considered</span></div>
        <div class="metric"><b id="eliminatedMetric">—</b><span>eliminated</span></div>
        <div class="metric"><b id="shortlistedMetric">—</b><span>shortlisted</span></div>
      </div>
      <div id="decisionBar" class="decisionBar"><b>Waiting.</b> <span>NØPE will show its decision path here.</span></div>
    </div>
    <div class="intelCard">
      <div class="intelHead"><div class="intelTitle">🧬 Preference memory</div><div id="memoryConfidence" class="signal">No new signal</div></div>
      <div id="memoryLive" class="memoryLine">NØPE will show what it learned and why.</div>
      <div id="sessionMemory" class="sessionMemory"><div class="emptyMemory">No preference signals yet. NØPE will learn from what you say and what you choose.</div></div>
      <div class="learningHint">NØPE learns from voice, text and lightweight choices — not just questionnaires.</div>
      <button id="demoRun" class="shopBtn demoBtn" type="button">▶ Run guided NØPE demo</button>
    </div>`;
  store.appendChild(intel);
}
function sessionId(){let s=localStorage.getItem("nope_session_id");if(!s){s="sess_"+crypto.randomUUID();localStorage.setItem("nope_session_id",s)}return s}
async function recordSignal(preference,value,reason,source,signal_type="inferred",confidence="medium"){
  try{
    const saved=await mcp("record_preference",{user_id:"demo-user",preference,value,reason,confidence,session_id:sessionId(),source,signal_type});
    if(saved?.status==="SAVED") refreshSessionView();
    return saved;
  }catch(e){console.warn("Preference signal not saved",e);return null}
}
async function refreshSessionView(){
  try{
    const r=await fetch("/api/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:sessionId(),user_id:"demo-user"})});
    const d=await r.json();
    const root=document.getElementById("sessionMemory"); if(!root)return;
    const prefs=d.session_preferences||[];
    const profile=d.profile_preferences||[];
    if(!prefs.length&&!profile.length){root.innerHTML='<div class="emptyMemory">No preference signals yet. NØPE will learn from what you say and what you choose.</div>';return}
    const groups={hard:[],like:[],avoid:[],signals:[]};
    prefs.slice(0,12).forEach(p=>{
      const text=(p.preference+" "+p.value+" "+(p.reason||"")).toLowerCase();
      const item='<div class="prefItem"><span class="prefMain">'+(p.value||p.preference)+'</span><span class="prefMeta">'+(p.source||"agent")+' · '+(p.confidence||"medium")+'</span>'+(p.reason?'<div class="prefReason">'+p.reason+'</div>':'')+'</div>';
      if(/avoid|hate|dislike|no |not |formal|shiny/.test(text))groups.avoid.push(item);
      else if(/budget|occasion|fit|material|color/.test(text))groups.hard.push(item);
      else groups.like.push(item);
    });
    root.innerHTML='<div class="prefGrid"><div><div class="prefLabel">WHAT I SHOULD AVOID</div>'+(groups.avoid.join("")||'<div class="emptyMemory">Nothing learned yet</div>')+'</div><div><div class="prefLabel">WHAT YOU SEEM TO LIKE</div>'+(groups.like.join("")||'<div class="emptyMemory">Nothing learned yet</div>')+'</div></div><div class="sessionFoot">Session memory · '+prefs.length+' signals · source-aware</div>';
  }catch(e){console.warn(e)}
}
function captureIntentSignals(text,source){
  const q=String(text||"").toLowerCase();
  const sid=sessionId();
  if(/shiny|chamak|flashy|glitter|satin|silk finish/.test(q)) recordSignal("finish","avoid shiny/flashy","User explicitly rejected shiny or flashy finishes",source,"explicit","high");
  if(/formal|uncle/.test(q)) recordSignal("formality","avoid overly formal","User said they do not want a formal/uncle-type look",source,"explicit","high");
  if(/relaxed|casual|comfortable|comfy/.test(q)) recordSignal("fit/style","prefer relaxed and comfortable","Current request indicates a relaxed/comfortable preference",source,"inferred","medium");
  if(/classy|elegant/.test(q)) recordSignal("style","prefer classy/elegant","Current request indicates a classy/elegant preference",source,"inferred","medium");
  if(/youthful|young/.test(q)) recordSignal("style","prefer youthful","Current request indicates a youthful preference",source,"inferred","medium");
  const bm=q.match(/(?:₹|rs\.?|rupees?\s*)([0-9,]+)/i); if(bm) recordSignal("budget","up to ₹"+bm[1],"Budget stated in current request",source,"explicit","high");
}
function updateIntelligence(q,found,picks){
  const text=String(q||"").toLowerCase();
  const budget=(text.match(/(?:₹|rs\\.?|rupees?\\s*)([0-9,]+)/i)||[])[1];
  const chips=[
    /wedding|shaadi|marriage/.test(text)?"Wedding":null,
    /shirt|clothing|top/.test(text)?"Shirt":null,
    budget?"Budget ≤ ₹"+budget:null,
    /classy/.test(text)?"Classy":null,
    /relaxed|casual|chill|youthful/.test(text)?"Relaxed":null,
    /shiny|chamak/.test(text)?"✕ Shiny":null,
    /formal|uncle/.test(text)?"✕ Too formal":null
  ].filter(Boolean);
  const u=document.getElementById("understood"); if(u)u.innerHTML=(chips.length?chips:["Intent understood"]).map(x=>'<span class="signal '+(x.startsWith("✕")?"hard":"good")+'">'+x+'</span>').join("");
  const total=Math.max(found?.count||found?.results?.length||0,0), selected=(picks||[]).length;
  const sm=document.getElementById("searchedMetric"), em=document.getElementById("eliminatedMetric"), ss=document.getElementById("shortlistedMetric");
  if(sm)sm.textContent=total||"0"; if(em)em.textContent=Math.max(0,total-selected); if(ss)ss.textContent=selected;
  const bar=document.getElementById("decisionBar"); if(bar)bar.innerHTML='<b>Decision:</b> NØPE filtered the catalogue for your constraints and kept '+selected+' strongest options. <span>It will learn from your rejection.</span>';
}
function showLearnedMemory(pref,reason){
  const m=document.getElementById("memoryLive"), c=document.getElementById("memoryConfidence");
  if(m)m.innerHTML='<b>LEARNED TODAY</b><br>Dislike: '+pref+'<br>Reason: “'+reason+'”<br><span style="color:#667085">Temporary context · medium confidence</span>';
  if(c){c.textContent="NEW SIGNAL · MEDIUM";c.className="signal good"}
}
function explainProduct(p){
  const box=document.createElement("div");
  box.style.cssText="position:fixed;inset:0;background:#0008;z-index:9999;display:grid;place-items:center;padding:20px";
  box.innerHTML='<div style="max-width:430px;background:#fff;border-radius:20px;padding:22px;box-shadow:0 20px 60px #0004"><div style="font-size:11px;font-weight:900;letter-spacing:.08em">WHY NØPE PICKED THIS</div><h2 style="margin:8px 0 6px">'+p.name+'</h2><div style="font-weight:850">₹'+p.price+'</div><p style="font-size:13px;line-height:1.55;color:#475467">✓ Within your current budget<br>✓ Fits the requested occasion and style<br>✓ Avoids your explicit exclusions<br>✓ Compared against the available catalogue</p><button id="closeWhy" class="shopBtn">Got it</button></div>';
  document.body.appendChild(box);document.getElementById("closeWhy").onclick=()=>box.remove();
}
function installRecommendationActions(items){
  document.querySelectorAll("[data-why]").forEach(b=>b.onclick=()=>explainProduct(items[Number(b.dataset.why)]||items[0]));
  document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=async()=>{
    const p=items[Number(b.dataset.reject)]||items[0];
    const reason=b.dataset.reason||"too formal";
    try{
      stage("Rejection received","NØPE is turning your “Nope” into a preference signal.","nMemory");
      const saved=await mcp("record_preference",{user_id:"demo-user",preference:"formality",value:"avoid overly formal",reason,confidence:"medium",session_id:sessionId(),source:"ui",signal_type:"rejection"});
      if(saved.status!=="SAVED")throw Error("Preference was not saved");
      showLearnedMemory("avoid overly formal",reason);
      stage("Memory updated","Formality negative signal saved. Searching again with the new constraint.","nCatalog");
      const found=await mcp("search_products",{category:"clothing",max_price:3000,occasion:"wedding",style:"classy relaxed",avoid:"shiny formal"});
      const products=found.results||[];
      const ranked=products.length?(await mcp("rank_products",{products,preferences:[{preference:"formality",value:"avoid overly formal"}],intent:transcript})).results||products:products;
      renderShopMatches(ranked);
      updateIntelligence(transcript,{count:products.length},ranked.slice(0,3));
      stage("NØPE re-ranked","New shortlist reflects your rejection — not just your original search.","nAgent");
      setStatus("✓ Learned from rejection and changed the shortlist","ok");
    }catch(e){setStatus("Learning error: "+e.message,"err")}
  });
}
function installGuidedDemo(){
  const b=document.getElementById("demoRun");if(!b||b.dataset.ready)return;b.dataset.ready="1";
  b.onclick=async()=>{
    b.disabled=true;b.textContent="● Running NØPE journey…";
    const q="Mujhe next Saturday friend ki wedding ke liye classy relaxed shirt chahiye, ₹3000 ke andar. Shiny bilkul nahi, zyada formal nahi.";
    await processTranscript(q);
    setTimeout(()=>{const r=document.querySelector("[data-reject]");if(r)r.click()},1800);
    setTimeout(()=>{b.disabled=false;b.textContent="▶ Run guided NØPE demo"},5200);
  };
}
injectIntelligenceUI();
const SHOP_PRODUCTS=[
{id:"linen-resort",name:"Linen Blend Resort Shirt",price:2499,emoji:"👕",meta:"NØPE Atelier · Linen blend · Relaxed · Wedding"},
{id:"textured-oxford",name:"Textured Oxford Casual Shirt",price:2299,emoji:"👔",meta:"Textured cotton · Smart casual"},
{id:"cuban-collar",name:"Cotton Cuban Collar Shirt",price:1999,emoji:"🧥",meta:"Cotton · Relaxed · Easy"},
{id:"relaxed-linen",name:"Relaxed Linen Shirt",price:2399,emoji:"👕",meta:"Linen · Airy · Classy"},
{id:"navy-oxford",name:"Navy Oxford Shirt",price:2199,emoji:"👔",meta:"Oxford · Clean · Versatile"},
{id:"sand-cuban",name:"Sand Cuban Collar",price:1899,emoji:"🧥",meta:"Cotton · Casual · Youthful"}
];
SHOP_PRODUCTS.push({id:"camp-collar",name:"Camp Collar Resort Shirt",price:1899,emoji:"👕",meta:"Sunday Club · Printed · Relaxed"}); SHOP_PRODUCTS.push({id:"sage-linen",name:"Sage Linen Cuban Shirt",price:2499,emoji:"👕",meta:"Casa Linen · Linen · Wedding"}); SHOP_PRODUCTS.push({id:"navy-check",name:"Navy Micro-Check Shirt",price:2199,emoji:"👔",meta:"NØPE Atelier · Clean · Smart casual"}); SHOP_PRODUCTS.push({id:"black-camp",name:"Black Textured Camp Shirt",price:2099,emoji:"👕",meta:"Urban Loom · Textured · Stylish"}); SHOP_PRODUCTS.push({id:"ivory-mandarin",name:"Ivory Mandarin Collar Shirt",price:2399,emoji:"👔",meta:"Monarch · Minimal · Festive"}); SHOP_PRODUCTS.push({id:"rust-overshirt",name:"Rust Corduroy Overshirt",price:2799,emoji:"🧥",meta:"Sunday Club · Corduroy · Layering"}); SHOP_PRODUCTS.push({id:"performance-polo",name:"Charcoal Performance Polo",price:1599,emoji:"👕",meta:"NØPE Sport · Stretch · Breathable"}); SHOP_PRODUCTS.push({id:"minimal-tee",name:"White Minimal Oversized Tee",price:999,emoji:"👕",meta:"NØPE Basics · Oversized · Minimal"});
let cart=[], recorder=null, chunks=[], recording=false, transcript="";
const mic=$("mic"), hint=$("hint"), transcriptEl=$("transcript"), statusEl=$("status"), audio=$("audio");

function setStatus(t,c){if(statusEl){statusEl.textContent=t;statusEl.className="status "+(c||"")}}
function stage(t,d,n){$("stageTitle").textContent=t;$("stageDetail").textContent=d;["nGnani","nAgent","nMemory","nCatalog","nTts"].forEach(x=>$(x)?.classList.remove("live"));if(n)$(n)?.classList.add("live");const e=document.createElement("div");e.className="event";e.innerHTML='<span class="dot on"></span><span><b>'+t+"</b> — "+d+"</span>";$("timeline").prepend(e)}
function addToCart(p,button){if(!cart.some(x=>x.id===p.id)){cart.push(p);recordSignal("product affinity",p.name,"User added this recommendation to bag","ui","add_to_bag","medium");if(button){button.textContent="✓ Added";button.classList.add("added")}$("cartCount").textContent=cart.length;setStatus(p.name+" added to your bag.","ok")}}
function renderShop(filter){
 const root=$("shopProducts");let items=SHOP_PRODUCTS;
 if(filter&&filter!=="all")items=items.filter(p=>filter==="shirts"||p.meta.toLowerCase().includes(filter==="wedding"?"wedding":"casual"));
 root.innerHTML=items.map(p=>'<div class="shopProduct"><div class="photo">'+p.emoji+'</div><h3>'+p.name+'</h3><div class="shopPrice">₹'+p.price+'</div><div class="shopMeta">'+p.meta+'</div><button class="shopBtn" data-add="'+p.id+'">Add to bag</button></div>').join("");
 root.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(SHOP_PRODUCTS.find(x=>x.id===b.dataset.add),b));
}
function renderShopMatches(items){
 const root=$("shopProducts");
 const tones=["#243447","#d9c3a5","#365b75","#202124","#eee5d0","#8b4b35","#38454b","#f4f4f1"];
 const brands=["NØPE Atelier","Casa Linen","Urban Loom","Sunday Club","Monarch","NØPE Basics"];
 root.innerHTML=items.slice(0,4).map((p,i)=>{const tone=tones[i%tones.length];const score=Math.round(p.fit_score||p.score||94-i*3);const local=SHOP_PRODUCTS.find(x=>x.name===p.name)||SHOP_PRODUCTS.find(x=>x.name.toLowerCase().includes(String(p.name||"").toLowerCase().split(" ")[0]));const brand=(local?.meta||"").split("·")[0].trim()||brands[i%brands.length];const reason=p.reason|| (i===0?"Strong fit for your current brief":i===1?"Matches your style + budget":"Fits the brief with fewer trade-offs");return '<div class="shopProduct"><div class="photo" style="--shirt:'+tone+'"><span class="tone"></span></div><div class="shopMeta" style="margin-top:10px;font-weight:800">'+brand+'</div><h3>'+p.name+'</h3><div class="shopPrice">₹'+p.price+'</div><div class="matchBadge">✦ '+score+'% NØPE match</div><div class="reason">'+reason+'</div><button class="whyBtn" data-why="'+i+'">Why this?</button><button class="nopeReject" data-reject="'+i+'" data-reason="Too formal">✕ Nope — too formal</button><button class="shopBtn" data-match="'+i+'">Add to bag</button></div>'}).join("");
 root.querySelectorAll("[data-match]").forEach((b,i)=>{b.onclick=()=>{const p=SHOP_PRODUCTS.find(x=>x.name===items[i]?.name)||items[i];addToCart(p,b)}});installRecommendationActions(items);
}
async function mcp(name,args){
 setStatus("Calling "+name+"…");
 const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({jsonrpc:"2.0",id:Date.now(),method:"tools/call",params:{name,arguments:args}})});
 const j=await r.json();if(j.error)throw Error(j.error.message||"MCP error");
 const t=j.result?.content?.find(x=>x.type==="text")?.text;return t?JSON.parse(t):j.result;
}
function audioBufferToWav(b){
 const n=b.length,o=new ArrayBuffer(44+n*2),v=new DataView(o),rate=b.sampleRate;
 const w=(p,s)=>{for(let i=0;i<s.length;i++)v.setUint8(p+i,s.charCodeAt(i))};
 w(0,"RIFF");v.setUint32(4,36+n*2,true);w(8,"WAVE");w(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,"data");v.setUint32(40,n*2,true);
 const c=b.getChannelData(0);for(let i=0,p=44;i<n;i++,p+=2){const s=Math.max(-1,Math.min(1,c[i]));v.setInt16(p,s<0?s*32768:s*32767,true)}return new Blob([o],{type:"audio/wav"})
}
function b64(blob){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result.split(",")[1]);r.onerror=no;r.readAsDataURL(blob)})}
async function runNopeVoice(){
 stage("NØPE is interpreting intent","Extracting category, occasion, budget and exclusions.","nAgent");
 const q=transcript.toLowerCase(), bm=q.match(/(?:₹|rs\.?|rupees?\s*)([0-9,]+)/i), budget=bm?Number(bm[1].replace(/,/g,"")):3000;
 const category=/shirt|clothing|top/.test(q)?"clothing":"shirt", occasion=/wedding|shaadi|marriage/.test(q)?"wedding":null;
 const avoid=[/shiny|chamak|silk/.test(q)?"shiny":null,/formal|uncle/.test(q)?"formal":null].filter(Boolean).join(",");
 const style=/relaxed|casual|chill|youthful|stylish/.test(q)?"classy relaxed":(/classy/.test(q)?"classy":null);
 stage("Reading preference memory","Retrieving learned likes, dislikes and rejection signals.","nMemory");
 const prefs=await mcp("get_preferences",{user_id:"demo-user",session_id:sessionId()});
 $("memoryText").textContent=(prefs.preferences||[]).slice(0,4).map(p=>(p.preference||"signal")+": "+(p.value||"")).join(" · ")||"No stored preference signal yet.";
 stage("Searching product catalogue","Filtering the mock catalogue against the current intent.","nCatalog");
 const found=await mcp("search_products",{category,max_price:budget,occasion,style,avoid}), products=found.results||[];
 $("catalogue").innerHTML=products.slice(0,4).map(p=>'<div class="product"><div class="pname">'+p.name+'</div><div class="price">₹'+p.price+'</div><span class="tag">'+(p.category||"shirt")+" · returned</span></div>").join("")||'<div class="product"><div class="pname">No matching products</div></div>';
 let ranked=products;
 if(products.length){const rr=await mcp("rank_products",{products,preferences:prefs.preferences||[],intent:transcript});ranked=rr.results||products}
 if(ranked.length)renderShopMatches(ranked);
 const picks=ranked.slice(0,3);
 updateIntelligence(transcript,found,picks);
 const reply=picks.length?"Yay... aapke liye kuch really lovely options mil gaye hain. Mainne "+picks.length+" options shortlist kiye hain. "+picks.map((p,i)=>(i+1)+". "+p.name+" — rupees "+p.price).join(". ")+" . Inmein se pehla option mujhe especially aapki current style, occasion aur budget ke liye achchha lag raha hai. Aap aaraam se dekhiye. Aur agar koi option bilkul aapke type ka na lage, mujhe bas bata dena ki kya pasand nahi aaya. Main us feedback ko samajh kar next options aur better kar dungi.":"Hmm... abhi mujhe aapke liye exact match nahi mila. But no worries at all. Aap bas mujhe bata dijiye ki budget ya style mein kya change karna hai... main calmly dobara search karke aapke liye better options dhoondhungi.";
 transcriptEl.textContent=transcript;stage("Generating NØPE voice response","Sending the final decision to Gnani TTS.","nTts");
 const t=await mcp("gnani_text_to_speech",{text:reply,language:NOPE_LANGUAGE,voice:NOPE_VOICE,speed:NOPE_SPEED});
 if(!t.success)throw Error(t.error||"TTS failed");
 const bin=atob(t.audio_base64||""),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
 if(audio._objectUrl)URL.revokeObjectURL(audio._objectUrl);audio._objectUrl=URL.createObjectURL(new Blob([arr],{type:t.audio_content_type||"audio/wav"}));audio.src=audio._objectUrl;audio.hidden=false;audio.load();
 try{await audio.play()}catch(e){console.warn("Autoplay blocked; audio controls remain available.",e)}
 hint.textContent="NØPE replied — click 🎙️ to speak again";setStatus("✓ Full voice loop complete","ok");
}
async function processTranscript(text,source="text"){transcript=String(text||"").trim();if(!transcript){setStatus("I didn't catch that. Please try again.","err");return}captureIntentSignals(transcript,source);transcriptEl.textContent=transcript;hint.textContent="NØPE is thinking…";setStatus("✓ Voice/text received","ok");try{await runNopeVoice()}catch(e){console.error(e);setStatus("NØPE error: "+e.message,"err");hint.textContent="Try again or use the text box."}}
async function start(){
 setStatus("🎙 Click registered — requesting microphone…","ok");
 if(!navigator.mediaDevices?.getUserMedia)throw Error("Microphone API unavailable. Use Chrome or Edge over HTTPS.");
 const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
 const mime=["audio/webm;codecs=opus","audio/webm","audio/ogg"].find(x=>MediaRecorder.isTypeSupported?.(x))||"";
 recorder=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream);
 chunks=[];recording=true;mic.classList.add("recording");mic.textContent="⏹";hint.textContent="Listening… speak now, then click again";setStatus("● Microphone ON — listening","ok");
 recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
 recorder.onerror=e=>{console.error(e);stream.getTracks().forEach(t=>t.stop());recording=false;mic.classList.remove("recording");mic.textContent="🎙";setStatus("Recording error. Check microphone permission.","err")};
 recorder.onstop=async()=>{
  stream.getTracks().forEach(t=>t.stop());mic.classList.remove("recording");mic.textContent="🎙";hint.textContent="Processing voice with Gnani…";stage("Gnani is transcribing","Converting your voice into text.","nGnani");
  try{
   if(!chunks.length)throw Error("No audio captured. Please speak for at least one second.");
   setStatus("Uploading captured audio to Gnani…","ok");
   const blob=new Blob(chunks,{type:recorder.mimeType||"audio/webm"}),ctx=new (window.AudioContext||window.webkitAudioContext)();
   const decoded=await ctx.decodeAudioData(await blob.arrayBuffer()),wav=audioBufferToWav(decoded);await ctx.close();
   const r=await mcp("gnani_speech_to_text",{audio_base64:await b64(wav),language_code:"hi-IN",preferred_language:"hi-IN",format:"transcribe"});
   if(!r.success)throw Error(r.error||("Gnani STT failed: "+r.status_code));
   await processTranscript(typeof r.transcript==="string"?r.transcript:JSON.stringify(r.transcript),"voice");
  }catch(e){console.error(e);hint.textContent="Voice failed — type below if needed";setStatus("Voice error: "+e.message,"err")}
 };
 recorder.start(250);
}
mic.addEventListener("click",async e=>{
 e.preventDefault();
 try{if(!recording)await start();else{setStatus("Stopping recording…","ok");recording=false;recorder.stop()}}
 catch(e){recording=false;mic.classList.remove("recording");mic.textContent="🎙";console.error(e);setStatus("Microphone error: "+e.name+" — "+e.message,"err");hint.textContent="Click again after allowing microphone access."}
});
$("sendText").onclick=()=>processTranscript($("textInput").value,"text");
$("textInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("sendText").click()});
document.querySelectorAll(".chip[data-cat]").forEach(c=>c.onclick=()=>{document.querySelectorAll(".chip[data-cat]").forEach(x=>x.classList.remove("active"));c.classList.add("active");renderShop(c.dataset.cat)});
$("surprise").onclick=()=>processTranscript("Find me a classy relaxed shirt under ₹3000");
$("copy").onclick=async()=>{if(!transcript)return setStatus("Nothing to copy yet.","err");try{await navigator.clipboard.writeText(transcript);setStatus("✓ Transcript copied.","ok")}catch(e){setStatus("Clipboard blocked — select the transcript manually.","err")}};
$("open").onclick=()=>{window.open("https://agenticorg.hackathon.pinelabs.com/dashboard/agents","_blank");setStatus("✓ AgenticOrg opened.","ok")};
$("speak").onclick=async()=>{if(!transcript)return setStatus("Speak or type first.","err");try{setStatus("Generating Gnani TTS…");const r=await mcp("gnani_text_to_speech",{text:transcript,language:NOPE_LANGUAGE,voice:NOPE_VOICE,speed:NOPE_SPEED});if(!r.success)throw Error(r.error||"TTS failed");audio.src=r.audio_url;audio.hidden=false;await audio.play();setStatus("✓ Gnani TTS worked","ok")}catch(e){setStatus("TTS error: "+e.message,"err")}};
$("cartBtn").onclick=async()=>{
 if(!cart.length)return setStatus("Your bag is empty. Ask NØPE to find something for you.","ok");
 const p=cart[0];if(!window.confirm("Proceed with a TEST purchase of "+p.name+" for ₹"+p.price+"? No real money will be charged."))return;
 try{
  stage("Checkout approved","Explicit user approval received. Creating Pine Labs test order.","nAgent");
  const r=await mcp("create_order",{amount:p.price,currency:"INR",product_id:p.id,test_mode:"success"}),data=r.order||r,orderId=data.order_id||data.id;
  stage("Pine Labs payment rail","Test order created — "+orderId+".","nAgent");
  await mcp("confirm_purchase",{order_id:orderId,approval:true});
  const ship=await mcp("delhivery_create_shipment",{format:"json",test_mode:"success",shipments:[{order:orderId,user_id:"demo-user",payment_mode:"Prepaid",name:"Demo User",add:"Demo Address",city:"Gurugram",state:"Haryana",pin:"122001",phone:"9999999999",products:[{product_name:p.name,quantity:1,price:p.price}],total_amount:p.price}]});
  const waybill=ship.waybill||ship.packages?.[0]?.waybill||"pending";stage("Delhivery shipment created","AWB "+waybill+" · Manifested.","nCatalog");
  const tracked=await mcp("delhivery_track_latest_shipment",{});stage("Shipment tracked","Delhivery status: "+(tracked.ShipmentData?.[0]?.Shipment?.[0]?.Status?.Status||"In Transit"),"nCatalog");setStatus("✓ Full journey complete: discovery → decision → payment → delivery → tracking","ok");
 }catch(e){setStatus("Checkout error: "+e.message,"err")}
};
renderShop("all");
refreshSessionView();
installGuidedDemo();
if(!navigator.mediaDevices?.getUserMedia)hint.textContent="Mic unavailable — use the text box below.";
else hint.textContent="Click 🎙️ → Allow microphone → speak → click again to send";
window.addEventListener("error",e=>{console.error(e.error||e.message);setStatus("Page error: "+e.message,"err")});
console.log("NØPE v33 frontend initialized");
})();