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
  #nopeIntel{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9990;display:block;width:min(430px,calc(100vw - 28px));margin:0;pointer-events:none}.intelCard{display:none!important}.intelCard:last-child{display:flex!important;align-items:center;justify-content:center;gap:10px;padding:9px 12px;border:1px solid #e7e9ee;border-radius:999px;background:#fffffff5;box-shadow:0 12px 35px #1112;backdrop-filter:blur(12px);pointer-events:auto}.intelHead,#memoryLive,#sessionMemory,#demoRun{display:none!important}.learningHint{margin:0!important;font-size:10px!important;color:#667085!important}.shopSection{margin-top:34px}
  .intelCard{border:1px solid #e4e7ec;border-radius:18px;background:#fff;padding:15px}
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
  .nopeReject{position:absolute;right:12px;bottom:58px;width:34px;height:34px;border:1px solid #ffffffaa;background:#ffffffdd;color:#111;border-radius:50%;padding:0;font-size:0;cursor:pointer;opacity:0;transition:opacity .2s}.nopeReject:after{content:'×';font-size:18px}.shopProduct:hover .nopeReject{opacity:1}
  .whyBtn{margin-top:7px;width:100%;border:1px solid #e4e7ec;background:#fff;color:#111;border-radius:10px;padding:8px;font-size:11px;font-weight:800;cursor:pointer}
  .whyBox{display:none;margin-top:8px;padding:9px;border-radius:10px;background:#f8fafc;font-size:10px;color:#475467;line-height:1.45}
  .demoBtn{background:#111!important;color:#fff!important;border-color:#111!important}
  .sessionMemory{margin-top:12px;padding:11px;border:1px solid #eaecf0;border-radius:12px;background:#fff}
  .prefGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .prefLabel{font-size:9px;font-weight:900;letter-spacing:.08em;color:#98a2b3;margin-bottom:6px}
  .prefItem{padding:8px 0;border-bottom:1px solid #f0f1f3}
  .prefMain{font-size:11px;font-weight:800;display:block}
  .prefMeta{font-size:9px;color:#98a2b3}
  .prefReason{font-size:9px;color:#667085;margin-top:2px}
  .sourceBadge{display:inline-block;margin-left:5px;padding:2px 5px;border-radius:999px;background:#f2f4f7;color:#667085;font-size:8px;font-weight:800}
  .memoryHeader{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .sessionIdMini{font-size:8px;color:#98a2b3}
  .memorySection{margin-top:9px}
  .memorySectionTitle{font-size:9px;font-weight:900;letter-spacing:.07em;color:#98a2b3}
  .learningToast{position:fixed;right:18px;bottom:18px;z-index:9998;background:#111;color:#fff;border-radius:12px;padding:11px 14px;font-size:11px;font-weight:750;box-shadow:0 12px 35px #0003}
  .emptyMemory{font-size:10px;color:#98a2b3;line-height:1.4}
  .sessionFoot{font-size:9px;color:#98a2b3;margin-top:8px}
  .learningHint{font-size:10px;color:#667085;margin-top:8px;line-height:1.4}
  .shopSection{margin-top:24px}
  .shopIntro{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:16px}.shopEyebrow{font-size:9px;font-weight:900;letter-spacing:.12em;color:#98a2b3;text-transform:uppercase}.shopHeadline{font-size:29px;line-height:1.02;font-weight:900;letter-spacing:-.055em;margin:3px 0}.shopSub{font-size:11px;color:#667085;max-width:460px;line-height:1.45}.shopPulse{font-size:10px;color:#98a2b3;white-space:nowrap}
  .shopEyebrow{font-size:9px;font-weight:900;letter-spacing:.12em;color:#98a2b3;text-transform:uppercase}
  .shopHeadline{font-size:25px;line-height:1.08;font-weight:900;letter-spacing:-.04em;margin:4px 0}
  .shopSub{font-size:11px;color:#667085;max-width:520px;line-height:1.5}
  .shopPulse{font-size:10px;color:#667085;white-space:nowrap}
  #shopProducts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.shopProduct{position:relative;border:0;border-radius:22px;background:transparent;padding:0;overflow:visible;transition:transform .25s ease}.shopProduct:hover{transform:translateY(-5px)}
  .shopProduct{position:relative;border:0;border-radius:22px;background:transparent;padding:0;overflow:visible;transition:transform .25s ease}.shopProduct:hover{transform:translateY(-5px)}
  .shopProduct:hover{transform:translateY(-4px);box-shadow:0 18px 45px #11111112;border-color:#d8dce3}
  .visualProduct{height:390px;border-radius:20px;position:relative;overflow:hidden;background:linear-gradient(145deg,var(--bg1),var(--bg2));display:grid;place-items:center;cursor:pointer;transition:filter .25s ease,transform .25s ease}.shopProduct:hover .visualProduct{filter:saturate(1.08)}
  .visualProduct:before{content:"";position:absolute;width:155px;height:205px;border-radius:58% 58% 24% 24%;background:linear-gradient(135deg,var(--cloth1),var(--cloth2));box-shadow:inset -18px -10px 25px #0002, inset 13px 10px 18px #fff3;transform:rotate(-1deg);top:27px}
  .visualProduct:after{content:"";position:absolute;width:58px;height:48px;border-radius:0 0 28px 28px;border-bottom:7px solid #0002;top:24px;background:linear-gradient(90deg,transparent 40%,#fff4 41%,#fff4 44%,transparent 45%);z-index:2}
  .productShadow{position:absolute;width:145px;height:18px;border-radius:50%;background:#0002;filter:blur(8px);bottom:18px}
  .productBadge{position:absolute;top:10px;left:10px;background:#ffffffe8;border:1px solid #fff;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:900;z-index:4}
  .heartBtn{position:absolute;top:10px;right:10px;width:32px;height:32px;border:0;border-radius:50%;background:#ffffffe8;font-size:15px;cursor:pointer;z-index:4}
  .swatches{display:flex;gap:7px;margin:10px 2px 0}
  .swatch{width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #d0d5dd;cursor:pointer}
  .swatch.active{box-shadow:0 0 0 2px #111}
  .productMetaRow{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:9px}
  .productKicker{font-size:9px;color:#667085;font-weight:800}
  .productMatch{font-size:9px;font-weight:900}
  .productName{font-size:15px;font-weight:900;letter-spacing:-.025em;margin:4px 0 1px}.productPrice{font-size:11px;color:#667085;font-weight:800}
  .productDesc,.productFacts,.quietChoice,.productActions,.productKicker,.productMatch{display:none!important}
  .productFacts{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0}
  .fact{font-size:9px;padding:5px 7px;border-radius:999px;background:#f6f7f9;color:#475467}
  .productActions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
  .quickBtn{border:1px solid #e4e7ec;background:#fff;border-radius:10px;padding:9px;font-size:10px;font-weight:850;cursor:pointer}
  .quickBtn.primary{background:#111;color:#fff;border-color:#111}
  .quietChoice{font-size:9px;color:#98a2b3;text-align:center;margin-top:7px}
  .variationHint{font-size:9px;color:#667085;margin-top:2px}
  .choiceModal{position:fixed;inset:0;background:#0006;z-index:10000;display:grid;place-items:center;padding:18px}
  .choiceSheet{width:min(760px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:24px;padding:18px;box-shadow:0 30px 100px #0005}
  .choiceGrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .detailVisual{height:330px;border-radius:18px;background:linear-gradient(145deg,var(--bg1),var(--bg2));position:relative;display:grid;place-items:center}
  .detailVisual:before{content:"";width:210px;height:280px;border-radius:58% 58% 24% 24%;background:linear-gradient(135deg,var(--cloth1),var(--cloth2));box-shadow:inset -25px -15px 35px #0002,inset 18px 14px 22px #fff3}
  .detailTitle{font-size:24px;font-weight:900;letter-spacing:-.04em;margin:5px 0}
  .choiceLabel{font-size:9px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#98a2b3;margin:16px 0 7px}
  .sizeChoices,.colorChoices{display:flex;gap:7px;flex-wrap:wrap}
  .sizeChoice{padding:8px 13px;border:1px solid #dfe3e8;background:#fff;border-radius:10px;font-size:10px;font-weight:850;cursor:pointer}
  .sizeChoice.active{background:#111;color:#fff;border-color:#111}
  .modalFoot{display:flex;gap:8px;margin-top:18px}
  @media(max-width:1200px){#shopProducts{grid-template-columns:repeat(3,minmax(0,1fr))}} @media(max-width:1050px){#shopProducts{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:600px){#shopProducts{grid-template-columns:1fr}.choiceGrid{grid-template-columns:1fr}.visualProduct{height:330px}}
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
    const sourceCounts={voice:0,text:0,ui:0}; prefs.forEach(p=>{const s=String(p.source||"agent").toLowerCase(); if(s==="voice")sourceCounts.voice++; else if(s==="text")sourceCounts.text++; else if(s==="ui")sourceCounts.ui++;}); root.innerHTML='<div class="memoryHeader"><div><div class="prefLabel">THIS SESSION</div><div style="font-size:12px;font-weight:850">NØPE is building a decision profile</div></div><div class="sessionIdMini">'+sessionId().slice(0,15)+'…</div></div><div class="prefGrid"><div><div class="prefLabel">AVOID / REJECTED</div>'+(groups.avoid.join("")||'<div class="emptyMemory">Nothing rejected yet</div>')+'</div><div><div class="prefLabel">LIKES / CONSTRAINTS</div>'+(groups.like.join("")||'<div class="emptyMemory">Nothing learned yet</div>')+'</div></div><div class="memorySection"><div class="memorySectionTitle">SIGNALS BY SOURCE</div><div class="understood" style="margin-top:6px"><span class="signal">🎙 Voice · '+sourceCounts.voice+'</span><span class="signal">⌨ Text · '+sourceCounts.text+'</span><span class="signal">👆 UI · '+sourceCounts.ui+'</span></div></div><div class="sessionFoot">Stored for this session · '+prefs.length+' signals · used in ranking</div>';
  }catch(e){console.warn(e)}
}
function captureIntentSignals(text,source){
  const q=String(text||"").toLowerCase();
  if(/shiny|chamak|flashy|glitter|satin|silk finish/.test(q)) recordSignal("finish","avoid shiny/flashy","User explicitly rejected shiny or flashy finishes",source,"explicit","high");
  if(/formal|uncle|office-like|corporate/.test(q)) recordSignal("formality","avoid overly formal","User indicated they do not want a formal or office-like look",source,"explicit","high");
  if(/relaxed|casual|comfortable|comfy|easy/.test(q)) recordSignal("fit/style","prefer relaxed and comfortable","Current request indicates a relaxed/comfortable preference",source,"inferred","medium");
  if(/classy|elegant|clean|minimal|understated/.test(q)) recordSignal("style","prefer clean and understated","Current request indicates a clean, understated style",source,"inferred","medium");
  if(/youthful|young|trendy|cool/.test(q)) recordSignal("style","prefer youthful","Current request indicates a youthful/trendy preference",source,"inferred","medium");
  if(/linen|cotton|denim|corduroy/.test(q)){const m=q.match(/linen|cotton|denim|corduroy/);recordSignal("material","prefer "+m[0],"Material mentioned in current request",source,"explicit","high")}
  if(/black|navy|blue|white|ivory|beige|sand|sage|rust/.test(q)){const m=q.match(/black|navy|blue|white|ivory|beige|sand|sage|rust/);recordSignal("colour","prefer "+m[0],"Colour mentioned in current request",source,"explicit","high")}
  if(/slim|fitted|tailored/.test(q)) recordSignal("fit","prefer fitted","Fit mentioned in current request",source,"explicit","high");
  if(/oversized|loose|baggy/.test(q)) recordSignal("fit","prefer loose/oversized","Fit mentioned in current request",source,"explicit","high");
  if(/breathable|summer|heat|garmi/.test(q)) recordSignal("comfort","prefer breathable","Comfort requirement detected",source,"inferred","medium");
  if(/party|club|night out/.test(q)) recordSignal("occasion","prefer party/night-out","Occasion detected in current request",source,"explicit","high");
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
  const old=document.querySelector(".learningToast");if(old)old.remove();
  const toast=document.createElement("div");toast.className="learningToast";toast.textContent="Preference updated · NØPE will use this next";document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),2600);
}
function explainProduct(p){
  const box=document.createElement("div");
  box.style.cssText="position:fixed;inset:0;background:#0008;z-index:9999;display:grid;place-items:center;padding:20px";
  box.innerHTML='<div style="max-width:430px;background:#fff;border-radius:20px;padding:22px;box-shadow:0 20px 60px #0004"><div style="font-size:11px;font-weight:900;letter-spacing:.08em">WHY NØPE PICKED THIS</div><h2 style="margin:8px 0 6px">'+p.name+'</h2><div style="font-weight:850">₹'+p.price+'</div><p style="font-size:13px;line-height:1.55;color:#475467">✓ Within your current budget<br>✓ Fits the requested occasion and style<br>✓ Avoids your explicit exclusions<br>✓ Compared against the available catalogue</p><button id="closeWhy" class="shopBtn">Got it</button></div>';
  document.body.appendChild(box);document.getElementById("closeWhy").onclick=()=>box.remove();
}
function recordBehaviorSignal(preference,value,reason,signal_type="implicit",confidence="low"){
  // Capture useful shopping intent only; never raw keystrokes, mouse coordinates, or unrelated browsing.
  return recordSignal(preference,value,reason,"ui",signal_type,confidence);
}
function installBehavioralLearning(items){
  document.querySelectorAll(".shopProduct").forEach((card,i)=>{
    const p=items[i];if(!p)return;let timer=null,entered=0,viewed=false;
    card.addEventListener("mouseenter",()=>{entered=Date.now();if(timer)clearTimeout(timer);timer=setTimeout(()=>{viewed=true;recordBehaviorSignal("hover intent",p.name,"User lingered on this product","hover_dwell","low");learnTaste(p,.18,"hover")},900)});
    card.addEventListener("mouseleave",()=>{if(timer)clearTimeout(timer);if(entered&&Date.now()-entered>500)recordBehaviorSignal("product consideration",p.name,"User explored this product visually","hover","low");entered=0});
    card.addEventListener("focusin",()=>{if(!viewed){viewed=true;recordBehaviorSignal("product consideration",p.name,"User focused on this product","focus","low");learnTaste(p,.2,"focus")}});
    card.addEventListener("click",e=>{if(e.target.closest("button"))return;recordBehaviorSignal("product click",p.name,"User intentionally interacted with this product","product_click","low");learnTaste(p,.35,"click");openProductDetail(p)});
    const visual=card.querySelector(".visualProduct");if(visual)visual.onclick=e=>{e.stopPropagation();recordBehaviorSignal("visual interest",p.name,"User clicked the product visual","visual_click","low");learnTaste(p,.45,"visual click");openProductDetail(p)};
  });
}
function installRecommendationActions(items){
  document.querySelectorAll("[data-why]").forEach(b=>b.onclick=()=>{
  const p=items[Number(b.dataset.why)]||items[0];
  recordBehaviorSignal("explanation interest",p.name,"User asked why this recommendation fits","why_this","low");
  explainProduct(p);
});
  document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=async()=>{
    const p=items[Number(b.dataset.reject)]||items[0];
    const local=SHOP_PRODUCTS.find(x=>x.name===p.name);
    const raw=((p.style||"")+" "+(p.meta||"")+" "+(p.tags||[]).join(" ")+" "+(local?.meta||"")).toLowerCase();
    const inferred=raw.includes("formal")||raw.includes("structured")||raw.includes("elegant")
      ? {preference:"formality",value:"avoid overly formal / structured",reason:"Implicit UI rejection of a formal-looking recommendation"}
      : raw.includes("shiny")||raw.includes("party")
      ? {preference:"finish",value:"avoid shiny / party finishes",reason:"Implicit UI rejection of a shiny or party-style recommendation"}
      : {preference:"style",value:"avoid this style direction",reason:"Implicit UI rejection — NØPE inferred a negative style signal from the skipped recommendation"};
    try{
      stage("Preference signal detected","You skipped an option. NØPE inferred what to avoid without asking another question.","nMemory");
      const saved=await mcp("record_preference",{user_id:"demo-user",preference:inferred.preference,value:inferred.value,reason:inferred.reason,confidence:"medium",session_id:sessionId(),source:"ui",signal_type:"rejection"});
      if(saved.status!=="SAVED")throw Error("Preference was not saved");
      showLearnedMemory(inferred.value,inferred.reason);
      learnTaste(p,-1.8,"skip");
      stage("Memory updated","NØPE is testing a different direction.","nCatalog");
      const avoidTerms=inferred.preference==="formality"?"formal":inferred.preference==="finish"?"shiny":"formal,shiny";
      const found=await mcp("search_products",{category:"clothing",max_price:3000,occasion:"wedding",style:"classy relaxed",avoid:avoidTerms});
      const products=found.results||[];
      const ranked=products.length?(await mcp("rank_products",{products,preferences:[{preference:inferred.preference,value:inferred.value}],intent:transcript})).results||products:products;
      const candidates=[...ranked,...SHOP_PRODUCTS].filter((x,i,a)=>x&&a.findIndex(y=>y.name===x.name)===i).sort((a,b)=>productScore(b,0)-productScore(a,0));
      renderShopCore(candidates.slice(0,8));
      updateIntelligence(transcript,{count:products.length},candidates.slice(0,3));
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
SHOP_PRODUCTS.push(
{id:"black-satin",name:"Black Satin Night Shirt",price:2199,meta:"After Dark · Satin · Shiny",visual:["#efe9e7","#cfc5c1","#161616","#050505"]},
{id:"neon-lime",name:"Lime Statement Camp Shirt",price:1799,meta:"After Dark · Neon · Loud",visual:["#e8f3d0","#cce8a2","#b6df22","#6d8d08"]},
{id:"floral-punch",name:"Tropical Floral Shirt",price:1999,meta:"Sunday Club · Floral · Loud",visual:["#f4d8dc","#f6e6b8","#d33b56","#7b1f42"]},
{id:"office-blue",name:"Executive Blue Formal Shirt",price:2299,meta:"Monarch · Formal · Structured",visual:["#e5ebf3","#d4dce8","#49617c","#26384e"]},
{id:"skinny-white",name:"Sharp Slim White Shirt",price:1899,meta:"Monarch · Fitted · Formal",visual:["#f5f5f1","#e2e2dc","#f6f4ed","#b9b6ac"]},
{id:"purple-satin",name:"Purple Gloss Party Shirt",price:2399,meta:"After Dark · Gloss · Party",visual:["#eadcf2","#d5c2e1","#8d4bb2","#4a185f"]},
{id:"orange-pop",name:"Orange Pop Cuban Shirt",price:1699,meta:"Weekend · Orange · Bold",visual:["#f5ded0","#f0c4aa","#ef6c2f","#a93c16"]},
{id:"grey-basic",name:"Grey Basic Button Shirt",price:1399,meta:"NØPE Basics · Plain · Everyday",visual:["#ececeb","#d9d9d7","#8b8d8c","#5f6262"]},
{id:"baggy-denim",name:"Washed Denim Overshirt",price:2499,meta:"Urban Loom · Denim · Oversized",visual:["#dce8ee","#c4d8e3","#668fa8","#385e76"]},
{id:"yellow-check",name:"Yellow Micro Check Shirt",price:1899,meta:"Weekend · Check · Bright",visual:["#f6edc8","#e8dda6","#d7b93f","#89721a"]},
{id:"maroon-mandarin",name:"Maroon Mandarin Shirt",price:2399,meta:"Monarch · Festive · Bold",visual:["#ead9d8","#dcc0c0","#8b3035","#4d161d"]},
{id:"olive-linen",name:"Olive Linen Relaxed Shirt",price:2299,meta:"Casa Linen · Linen · Relaxed",visual:["#e1e8d7","#cbd7bd","#7c8d54","#46542f"]}
);
let cart=[], recorder=null, chunks=[], recording=false, transcript="";
const mic=$("mic"), hint=$("hint"), transcriptEl=$("transcript"), statusEl=$("status"), audio=$("audio");

function setStatus(t,c){if(statusEl){statusEl.textContent=t;statusEl.className="status "+(c||"")}}
function stage(t,d,n){$("stageTitle").textContent=t;$("stageDetail").textContent=d;["nGnani","nAgent","nMemory","nCatalog","nTts"].forEach(x=>$(x)?.classList.remove("live"));if(n)$(n)?.classList.add("live");const e=document.createElement("div");e.className="event";e.innerHTML='<span class="dot on"></span><span><b>'+t+"</b> — "+d+"</span>";$("timeline").prepend(e)}
function inferProductAffinity(p){
  const raw=((p?.name||"")+" "+(p?.style||"")+" "+(p?.meta||"")+" "+(p?.tags||[]).join(" ")).toLowerCase();
  const signals=[];
  if(/linen/.test(raw))signals.push(["material","linen"]);
  if(/relaxed|oversized|easy|airy/.test(raw))signals.push(["fit/style","relaxed and comfortable"]);
  if(/classy|minimal|clean|elegant/.test(raw))signals.push(["style","clean and understated"]);
  if(/casual|cuban|camp|resort/.test(raw))signals.push(["style","casual resort"]);
  if(/youthful|stylish/.test(raw))signals.push(["style","youthful"]);
  signals.slice(0,3).forEach(([k,v])=>recordSignal(k,v,"User chose a product carrying this attribute","ui","positive_choice","medium"));
}
function addToCart(p,button){if(!cart.some(x=>x.id===p.id)){cart.push(p);recordSignal("product affinity",p.name,"User added this recommendation to bag","ui","add_to_bag","medium");inferProductAffinity(p);if(button){button.textContent="✓ Added";button.classList.add("added")}$("cartCount").textContent=cart.length;setStatus(p.name+" added to your bag.","ok")}}
const tasteKey="nope_taste_"+sessionId();
let tasteModel={};try{tasteModel=JSON.parse(localStorage.getItem(tasteKey)||"{}")}catch(e){tasteModel={}}
function traitsOf(p){
  const raw=((p?.name||"")+" "+(p?.meta||"")+" "+(p?.tags||[]).join(" ")).toLowerCase(),t=[];
  if(/linen/.test(raw))t.push("linen");if(/cotton|oxford/.test(raw))t.push("cotton");if(/corduroy/.test(raw))t.push("corduroy");
  if(/relaxed|oversized|easy|airy|camp|cuban|resort/.test(raw))t.push("relaxed");if(/slim|fitted|tailored|formal|structured/.test(raw))t.push("fitted");
  if(/minimal|clean|understated|plain|solid/.test(raw))t.push("minimal");if(/print|floral|loud|graphic|check/.test(raw))t.push("expressive");
  if(/shiny|satin|gloss|metallic/.test(raw))t.push("shiny");if(/neon|lime|orange|pink|purple|yellow/.test(raw))t.push("bold-color");
  if(/navy|black|white|ivory|beige|sand|sage|olive|charcoal|rust|blue/.test(raw))t.push("muted-color");
  if(/wedding|festive|mandarin|elegant/.test(raw))t.push("occasion");if(/tee|polo|sport|performance/.test(raw))t.push("everyday");
  return [...new Set(t)];
}
function learnTaste(p,delta,reason){
  traitsOf(p).forEach(k=>{tasteModel[k]=(tasteModel[k]||0)+delta});localStorage.setItem(tasteKey,JSON.stringify(tasteModel));
  const lead=Object.entries(tasteModel).sort((a,b)=>b[1]-a[1])[0];if(lead&&Math.abs(lead[1])>1.5)showTastePulse(lead[0],lead[1],reason);
}
function productScore(p,index){let s=(p.baseScore||60)-index*.15;traitsOf(p).forEach(k=>s+=(tasteModel[k]||0)*7);return s}
function showTastePulse(trait,weight,reason){
  const dock=document.querySelector("#nopeIntel .learningHint");if(!dock)return;
  const labels={relaxed:"easy, relaxed pieces",fitted:"sharper fits",minimal:"cleaner looks",expressive:"more expressive pieces",shiny:"high-shine finishes","bold-color":"bolder colour","muted-color":"quieter colour",linen:"linen",occasion:"occasion-ready pieces",everyday:"everyday pieces",cotton:"cotton",corduroy:"texture"};
  dock.textContent=(weight<0?"NØPE is moving away from ":"NØPE is getting warmer on ")+(labels[trait]||trait)+" · testing the next few choices";
}
function visualFor(p){const x=p.visual||["#eceff1","#d9dde2","#52606b","#252d32"];return {bg1:x[0],bg2:x[1],c1:x[2],c2:x[3]}}
function openProductDetail(p){
 const v=visualFor(p),box=document.createElement("div");box.className="choiceModal";
 box.innerHTML='<div class="choiceSheet"><div class="choiceGrid"><div class="detailVisual" style="--bg1:'+v.bg1+';--bg2:'+v.bg2+';--cloth1:'+v.c1+';--cloth2:'+v.c2+'"></div><div><div class="shopEyebrow">NØPE quick look</div><div class="detailTitle">'+p.name+'</div><div style="font-size:18px;font-weight:900">₹'+p.price+'</div><div style="font-size:11px;color:#667085;line-height:1.5;margin-top:7px">A considered option with an easy, wearable feel.</div><div class="choiceLabel">Colour</div><div class="colorChoices"><button class="swatch active" style="background:'+v.c1+'" data-var="colour"></button><button class="swatch" style="background:'+v.c2+'" data-var="colour"></button><button class="swatch" style="background:#d2ad73" data-var="colour"></button></div><div class="choiceLabel">Feel</div><div class="sizeChoices"><button class="sizeChoice active" data-fit="relaxed">Relaxed</button><button class="sizeChoice" data-fit="regular">Regular</button><button class="sizeChoice" data-fit="fitted">Fitted</button></div><div class="choiceLabel">Size</div><div class="sizeChoices"><button class="sizeChoice" data-size="S">S</button><button class="sizeChoice active" data-size="M">M</button><button class="sizeChoice" data-size="L">L</button><button class="sizeChoice" data-size="XL">XL</button></div><div class="modalFoot"><button class="quickBtn" id="closeChoice">Maybe later</button><button class="quickBtn primary" id="addChoice">Add to bag</button></div></div></div></div>';
 document.body.appendChild(box);box.querySelector("#closeChoice").onclick=()=>{recordBehaviorSignal("detail exit",p.name,"User closed the detail view without adding","detail_exit","low");box.remove()};box.querySelector("#addChoice").onclick=()=>{addToCart(p);learnTaste(p,2.2,"detail add");recordBehaviorSignal("product detail preference",p.name,"User configured a product and kept exploring it","customize","medium");box.remove()};
 box.querySelectorAll("[data-var]").forEach(b=>b.onclick=()=>{box.querySelectorAll("[data-var]").forEach(x=>x.classList.remove("active"));b.classList.add("active");recordBehaviorSignal("colour interest",p.name,"User explored a colour variation","variation","low");learnTaste(p,.5,"variation")});
 box.querySelectorAll("[data-fit]").forEach(b=>b.onclick=()=>{box.querySelectorAll("[data-fit]").forEach(x=>x.classList.remove("active"));b.classList.add("active");recordBehaviorSignal("fit interest",b.dataset.fit,"User explored a fit variation","variation","low");learnTaste(p,.45,"fit")});
 box.querySelectorAll("[data-size]").forEach(b=>b.onclick=()=>{box.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("active"));b.classList.add("active");recordBehaviorSignal("size interest",b.dataset.size,"User selected a size while exploring","variation","low");learnTaste(p,.25,"size")});
}
function productCard(p,i){
 const v=visualFor(p),score=Math.round(productScore(p,i)),badge=i===0?"NØPE is testing this":"";
 return '<div class="shopProduct" data-product="'+p.id+'"><div class="visualProduct" style="--bg1:'+v.bg1+';--bg2:'+v.bg2+';--cloth1:'+v.c1+';--cloth2:'+v.c2+'" data-visual="'+i+'"><span class="productBadge">'+badge+'</span><button class="heartBtn" data-save="'+i+'" aria-label="Save">♡</button><span class="productShadow"></span></div><div class="swatches"><button class="swatch active" style="background:'+v.c1+'" data-colour="'+i+'"></button><button class="swatch" style="background:'+v.c2+'" data-colour="'+i+'"></button><button class="swatch" style="background:#d2ad73" data-colour="'+i+'"></button></div><div class="productMetaRow"><span class="productName">'+p.name+'</span><span class="productPrice">₹'+p.price+'</span></div><button class="quickBtn" data-detail="'+i+'">Quick look</button><button class="quickBtn primary" data-match="'+i+'">Add to bag</button><button class="nopeReject" data-reject="'+i+'" aria-label="Skip">Skip this</button></div>';
}
function adaptShop(items){
 const ranked=[...items].sort((a,b)=>productScore(b,0)-productScore(a,0));
 renderShopCore(ranked);
}
function renderShopCore(items){
 const root=$("shopProducts");root.innerHTML=items.map(productCard).join("");
 root.querySelectorAll("[data-match]").forEach((b,i)=>b.onclick=()=>{const p=items[i];recordBehaviorSignal("add intent",p.name,"User chose to move this product toward purchase","add_click","medium");learnTaste(p,2,"add to bag");addToCart(p,b);});
 root.querySelectorAll("[data-detail]").forEach((b,i)=>b.onclick=()=>{const p=items[i];recordBehaviorSignal("quick look",p.name,"User asked for a closer product view","quick_look","low");learnTaste(p,.7,"quick look");openProductDetail(p)});
 root.querySelectorAll("[data-save]").forEach((b,i)=>b.onclick=()=>{b.textContent="♥";const p=items[i];recordBehaviorSignal("save affinity",p.name,"User saved this product","save","medium");learnTaste(p,1.4,"save")});
 root.querySelectorAll("[data-colour]").forEach(b=>b.onclick=()=>{const p=items[Number(b.dataset.colour)],card=b.closest(".shopProduct"),visual=card?.querySelector(".visualProduct");card?.querySelectorAll("[data-colour]").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(visual){const c=b.style.background;visual.style.setProperty("--cloth1",c);visual.style.setProperty("--cloth2",c)}recordBehaviorSignal("colour exploration",p.name,"User explored a visible colour variation","variation","low");learnTaste(p,.45,"colour")});
 installRecommendationActions(items);installBehavioralLearning(items);
}
function renderShop(filter){
 let items=SHOP_PRODUCTS;
 if(filter&&filter!=="all")items=items.filter(p=>filter==="shirts"||p.meta.toLowerCase().includes(filter==="wedding"?"wedding":"casual"));
 renderShopCore(items);
}
function renderShopMatches(items){
 const enriched=items.slice(0,8).map(p=>SHOP_PRODUCTS.find(x=>x.name===p.name)||p);
 renderShopCore(enriched);
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
$("sendText").onclick=()=>{recordBehaviorSignal("ask action","text","User chose to ask NØPE for help","ask_click","low");processTranscript($("textInput").value,"text")};
$("textInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("sendText").click()});
document.querySelectorAll(".chip[data-cat]").forEach(c=>c.onclick=()=>{
  document.querySelectorAll(".chip[data-cat]").forEach(x=>x.classList.remove("active"));c.classList.add("active");renderShop(c.dataset.cat);
  recordBehaviorSignal("category interest",c.dataset.cat,"User chose this shopping category","category_select","low");
});
$("surprise").onclick=()=>{
  recordBehaviorSignal("discovery openness","open to NØPE suggestions","User chose discovery instead of specifying a product","surprise_me","low");
  processTranscript("Find me a classy relaxed shirt under ₹3000");
};
$("copy").onclick=async()=>{if(!transcript)return setStatus("Nothing to copy yet.","err");try{await navigator.clipboard.writeText(transcript);setStatus("✓ Transcript copied.","ok")}catch(e){setStatus("Clipboard blocked — select the transcript manually.","err")}};
$("open").onclick=()=>{window.open("https://agenticorg.hackathon.pinelabs.com/dashboard/agents","_blank");setStatus("✓ AgenticOrg opened.","ok")};
$("speak").onclick=async()=>{if(!transcript)return setStatus("Speak or type first.","err");try{setStatus("Generating Gnani TTS…");const r=await mcp("gnani_text_to_speech",{text:transcript,language:NOPE_LANGUAGE,voice:NOPE_VOICE,speed:NOPE_SPEED});if(!r.success)throw Error(r.error||"TTS failed");audio.src=r.audio_url;audio.hidden=false;await audio.play();setStatus("✓ Gnani TTS worked","ok")}catch(e){setStatus("TTS error: "+e.message,"err")}};
$("cartBtn").onclick=async()=>{recordBehaviorSignal("bag action","open bag","User chose to inspect the bag","bag_click","low");
 if(!cart.length)return setStatus("Your bag is empty. Ask NØPE to find something for you.","ok");
 const p=cart[0];if(!window.confirm("Proceed with a TEST purchase of "+p.name+" for ₹"+p.price+"? No real money will be charged."))return;
 try{
  stage("Checkout approved","Explicit user approval received. Creating Pine Labs test order.","nAgent");
  const r=await mcp("create_order",{amount:p.price,currency:"INR",product_id:p.id,test_mode:"success"}),data=r.order||r,orderId=data.order_id||data.id;
  stage("Pine Labs payment rail","Test order created — "+orderId+".","nAgent");
  await mcp("confirm_purchase",{order_id:orderId,approval:true});
  recordSignal("purchase affinity",p.name,"User explicitly approved this product for purchase","ui","purchase","high");
  inferProductAffinity(p);
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