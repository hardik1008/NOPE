(() => {
"use strict";
const $=id=>document.getElementById(id);
const API="/api/mcp";
let currentInputSource="text";
// Gnani is input-only: NØPE never uses outbound TTS.
const NOPE_VOICE="Nalini";
const NOPE_LANGUAGE="hi-IN";
const NOPE_SPEED=1.0;

function injectIntelligenceUI(){
  const store=document.querySelector(".store");
  if(!store||document.getElementById("nopeIntel"))return;
  const s=document.createElement("style");
  s.textContent=`
  #nopeIntel{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9990;display:block;width:min(760px,calc(100vw - 28px));margin:0;pointer-events:none}.intelCard{display:none!important}.intelCard:last-child{display:flex!important;align-items:center;justify-content:center;gap:10px;padding:9px 12px;border:1px solid #e7e9ee;border-radius:999px;background:#fffffff5;box-shadow:0 12px 35px #1112;backdrop-filter:blur(12px);pointer-events:auto}.intelHead,#memoryLive,#sessionMemory,#demoRun{display:none!important}.learningHint{margin:0!important;font-size:10px!important;color:#667085!important}.proofRail{display:flex;align-items:center;gap:6px;padding:10px 12px;border:1px solid #e4e7ec;border-radius:16px;background:#fffffff7;box-shadow:0 12px 35px #1112;backdrop-filter:blur(12px);pointer-events:auto}.proofStep{font-size:9px;font-weight:850;color:#98a2b3;padding:6px 8px;border-radius:999px;background:#f6f7f9;white-space:nowrap}.proofStep.active{background:#111;color:#fff}.proofStep.done{background:#eefbf4;color:#087443}.proofArrow{color:#b0b7c2;font-size:10px}.proofDetail{margin-left:4px;font-size:10px;color:#475467;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px}.proofReset{border:1px solid #e4e7ec;background:#fff;border-radius:999px;padding:5px 8px;font-size:8px;font-weight:850;cursor:pointer}.microNudge{position:fixed;right:20px;top:86px;width:min(330px,calc(100vw - 40px));z-index:9997;transform:translateY(-10px) scale(.98);opacity:0;transition:.22s ease;pointer-events:none}.microNudge.show{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}.microBubble{position:relative;background:#fff;border:1px solid #e8e9ee;border-radius:18px;padding:13px 14px 12px;box-shadow:0 18px 45px #1112;backdrop-filter:blur(14px)}.microBubble:after{content:"";position:absolute;right:22px;top:-7px;width:13px;height:13px;background:#fff;border-left:1px solid #e8e9ee;border-top:1px solid #e8e9ee;transform:rotate(45deg)}.microTop{display:flex;align-items:center;gap:8px}.microDot{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#f5f0ff;font-size:13px;flex:none}.microKicker{font-size:8px;font-weight:950;letter-spacing:.12em;color:#98a2b3;text-transform:uppercase}.microClose{margin-left:auto;border:0;background:none;font-size:16px;color:#98a2b3;cursor:pointer}.microQuestion{font-size:13px;font-weight:850;line-height:1.35;margin:8px 0 10px;color:#111}.microOptions{display:flex;gap:6px;flex-wrap:wrap}.microOption{border:1px solid #e3e6eb;background:#fff;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:850;cursor:pointer}.microOption:hover{border-color:#111;transform:translateY(-1px)}.microTimer{height:2px;background:#f1f2f4;border-radius:99px;overflow:hidden;margin-top:10px}.microTimer i{display:block;height:100%;width:100%;background:#111;transform-origin:left;animation:microCount 4.2s linear forwards}@keyframes microCount{to{transform:scaleX(0)}}@media(max-width:600px){.microNudge{right:12px;top:70px;width:calc(100vw - 24px)}}.demoExperiment{margin:14px 0 2px;padding:11px 13px;border:1px solid #e7e9ee;border-radius:14px;background:#fbfcfd;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center}.demoExperimentLabel{font-size:8px;font-weight:950;letter-spacing:.11em;color:#98a2b3;white-space:nowrap}.demoHypothesis{font-size:11px;font-weight:850;color:#111;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.demoOutcome{font-size:10px;color:#667085;text-align:right;white-space:nowrap}.demoOutcome strong{color:#087443}.learningProof{grid-column:1/-1;display:flex;align-items:center;gap:8px;margin-top:2px;padding-top:8px;border-top:1px solid #eef0f3;font-size:9px;color:#667085}.learningProof b{font-size:9px;color:#111}.evidenceTrack{width:82px;height:5px;background:#eef0f3;border-radius:99px;overflow:hidden}.evidenceTrack i{display:block;height:100%;width:0;background:#111;border-radius:99px;transition:width .35s ease}@media(max-width:700px){.demoExperiment{grid-template-columns:1fr;gap:4px}.demoOutcome{text-align:left}.learningProof{flex-wrap:wrap}}@media(max-width:650px){.proofDetail{display:none}.proofStep{font-size:8px;padding:5px 6px}}.shopSection{margin-top:34px}
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
  .shopIntro{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:12px}.shopEyebrow{font-size:9px;font-weight:900;letter-spacing:.12em;color:#98a2b3;text-transform:uppercase}.shopHeadline{font-size:29px;line-height:1.02;font-weight:900;letter-spacing:-.055em;margin:3px 0}.shopSub{font-size:11px;color:#667085;max-width:460px;line-height:1.45}.shopPulse{font-size:10px;color:#98a2b3;white-space:nowrap}
  .tasteLab{display:flex;gap:9px;align-items:center;flex-wrap:wrap;padding:9px 10px;margin:0 0 14px;border:1px solid #eceef2;border-radius:14px;background:#fbfcfd}.tasteLabLabel{font-size:9px;font-weight:950;color:#98a2b3;letter-spacing:.08em;text-transform:uppercase}.tasteLabQuestion{font-size:10px;font-weight:850;color:#111}.tasteChip{border:1px solid #e2e5ea;background:#fff;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:850;cursor:pointer}.tasteChip:hover{border-color:#111}.tastePair{display:flex;align-items:center;gap:6px;margin-left:auto}.tastePair button{border:1px solid #e2e5ea;background:#fff;border-radius:10px;padding:6px 9px;font-size:9px;font-weight:850;cursor:pointer;max-width:170px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tastePair button:hover{border-color:#111}.tasteVs{font-size:8px;color:#98a2b3;font-weight:900}
  .microNudge.rejectionNudge .microBubble{border-color:#e5dff7}.microNudge.rejectionNudge .microDot{background:#fff5f3}.microNudge.rejectionNudge .microKicker{color:#7c3aed}
  .profileReveal,.deliveryLab{margin-top:12px;padding:13px;border:1px solid #e7e9ee;border-radius:16px;background:#fff}.profileReveal.hidden{display:none}.profileTitle,.deliveryTitle{font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;color:#111}.profileSub,.deliverySub{font-size:10px;color:#667085;margin-top:4px;line-height:1.45}.profileCombo{font-size:16px;font-weight:950;letter-spacing:-.03em;margin:9px 0 4px}.profileEvidence{font-size:9px;color:#98a2b3}.profileBadges{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.profileBadge{font-size:9px;padding:5px 7px;border:1px solid #e4e7ec;border-radius:999px;background:#fbfcfd}.tasteEvidence{display:flex;align-items:center;gap:7px;margin-left:auto;font-size:8px;color:#98a2b3;font-weight:850}.tasteEvidenceTrack{width:55px;height:4px;background:#eef0f3;border-radius:99px;overflow:hidden}.tasteEvidenceTrack i{display:block;height:100%;width:0;background:#111;border-radius:99px;transition:width .3s ease}.deliveryGrid{display:grid;grid-template-columns:1fr auto auto;gap:7px;margin-top:10px}.deliveryInput{border:1px solid #e4e7ec;border-radius:10px;padding:9px 10px;font-size:10px;min-width:0}.deliveryBtn{border:1px solid #e4e7ec;background:#fff;border-radius:10px;padding:9px 10px;font-size:9px;font-weight:850;cursor:pointer}.deliveryBtn.primary{background:#111;color:#fff;border-color:#111}.deliveryStatus{margin-top:8px;padding:8px 9px;border-radius:10px;background:#f8fafc;font-size:10px;color:#475467}.deliveryStatus.good{background:#f2fbf5;color:#087443}.deliveryStatus.bad{background:#fff6f5;color:#b42318}@media(max-width:700px){.deliveryGrid{grid-template-columns:1fr 1fr}.deliveryInput{grid-column:1/-1}}
  .shopEyebrow{font-size:9px;font-weight:900;letter-spacing:.12em;color:#98a2b3;text-transform:uppercase}
  .shopHeadline{font-size:25px;line-height:1.08;font-weight:900;letter-spacing:-.04em;margin:4px 0}
  .shopSub{font-size:11px;color:#667085;max-width:520px;line-height:1.5}
  .shopPulse{font-size:10px;color:#667085;white-space:nowrap}
  #shopProducts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.shopProduct{position:relative;border:0;border-radius:22px;background:transparent;padding:0;overflow:visible;transition:transform .25s ease}.shopProduct:hover{transform:translateY(-5px)}
  .shopProduct{position:relative;border:0;border-radius:22px;background:transparent;padding:0;overflow:visible;transition:transform .25s ease}.shopProduct:hover{transform:translateY(-5px)}
  .shopProduct:hover{transform:translateY(-4px);box-shadow:0 18px 45px #11111112;border-color:#d8dce3}
  .visualProduct{height:390px;border-radius:20px;position:relative;overflow:hidden;background:linear-gradient(145deg,var(--bg1),var(--bg2));display:grid;place-items:center;cursor:pointer;transition:filter .25s ease,transform .25s ease}.shopProduct:hover .visualProduct{filter:saturate(1.08)}
  .visualProduct:before,.visualProduct:after{display:none}
  .garmentSvg{width:76%;height:88%;display:block;filter:drop-shadow(0 22px 18px #1114);transition:transform .25s ease,filter .25s ease}
  .shopProduct:hover .garmentSvg{transform:translateY(-5px) rotate(-1deg);filter:drop-shadow(0 28px 22px #1115)}
  .productOpen{border:0;background:none;padding:0;text-align:left;cursor:pointer}
  .cardActions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
  .productName.productOpen:hover{text-decoration:underline;text-underline-offset:3px}
  .modalClose{position:absolute;right:14px;top:14px;width:36px;height:36px;border:0;border-radius:50%;background:#f4f5f7;font-size:22px;line-height:1;cursor:pointer;z-index:3}
  .detailVisual{overflow:hidden}.detailVisual .garmentSvg{height:92%;width:82%}
  .detailCopy{font-size:11px;color:#667085;line-height:1.5;margin-top:7px}
  .choiceSheet{position:relative}
  .productShadow{position:absolute;width:145px;height:18px;border-radius:50%;background:#0002;filter:blur(8px);bottom:18px}
  .productBadge{position:absolute;top:10px;left:10px;background:#ffffffe8;border:1px solid #fff;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:900;z-index:4}
  .heartBtn{position:absolute;top:10px;right:10px;width:32px;height:32px;border:0;border-radius:50%;background:#ffffffe8;font-size:15px;cursor:pointer;z-index:4;transition:transform .15s ease,background .15s ease}.heartBtn:hover{transform:scale(1.08)}.heartBtn.saved{background:#111;color:#fff}
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
    <div class="proofRail"><span id="proofUI" class="proofStep active">1 · UI action</span><span class="proofArrow">→</span><span id="proofDB" class="proofStep">2 · Postgres memory</span><span class="proofArrow">→</span><span id="proofBackend" class="proofStep">3 · NØPE reads memory</span><span class="proofArrow">→</span><span id="proofUIUpdate" class="proofStep">4 · UI adapts</span><span id="proofDetail" class="proofDetail">Live proof: waiting for your first signal…</span><button id="agenticOpen" class="proofReset" type="button">AgenticOrg ↗</button><button id="resetDemo" class="proofReset" type="button">↺ Reset</button></div>
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
  const experiment=document.createElement("div");
  experiment.id="demoExperiment";
  experiment.className="demoExperiment";
  experiment.innerHTML='<div class="demoExperimentLabel">TRADE-OFF LAB</div><div id="demoHypothesis" class="demoHypothesis">Try it: choose a V-neck T-shirt first. Then reject two expensive V-neck shirts.</div><div id="demoOutcome" class="demoOutcome">NØPE should keep the neckline and switch the garment.</div><div id="learningProof" class="learningProof"><b>🧠 NØPE wisdom</b><span id="evidenceText">Observing · 0 / 3 supporting signals</span><span class="evidenceTrack"><i id="evidenceFill"></i></span></div>';
  const shopSection=store.querySelector(".shopSection");
  if(shopSection)shopSection.parentNode.insertBefore(experiment,shopSection);
  else store.appendChild(experiment);
  const profileReveal=document.createElement("div");profileReveal.id="nopeProfileReveal";profileReveal.className="profileReveal hidden";profileReveal.innerHTML='<div class="profileTitle">🧠 NØPE has seen enough to say something</div><div id="profileCombo" class="profileCombo">Still learning…</div><div id="profileEvidence" class="profileEvidence">NØPE waits for repeated choices before making a strong claim.</div><div id="profileBadges" class="profileBadges"></div><div id="profileResults" class="profileBadges"></div>';
  const deliveryLab=document.createElement("div");deliveryLab.id="nopeDeliveryLab";deliveryLab.className="deliveryLab";deliveryLab.innerHTML='<div class="deliveryTitle">▣ NØPE → Delhivery</div><div class="deliverySub">Use this tiny test rail to show NØPE checking delivery, creating a mock shipment, and tracking it — no real parcel is sent.</div><div class="deliveryGrid"><input id="deliveryPin" class="deliveryInput" inputmode="numeric" maxlength="6" value="122001" placeholder="Pincode"><button id="deliveryCheck" class="deliveryBtn">Check delivery</button><button id="deliveryCreate" class="deliveryBtn primary">Create mock shipment</button></div><button id="deliveryTrack" class="deliveryBtn" style="width:100%;margin-top:7px">Track latest shipment</button><div id="deliveryStatus" class="deliveryStatus">Ready — NØPE can hand the delivery step to the Delhivery mock.</div>';
  if(shopSection){shopSection.appendChild(profileReveal);shopSection.appendChild(deliveryLab)}
  else store.appendChild(deliveryLab);
  store.appendChild(intel);
}
function sessionId(){let s=localStorage.getItem("nope_session_id");if(!s){s="sess_"+crypto.randomUUID();localStorage.setItem("nope_session_id",s)}return s}
const nudgeState={shown:0,answered:0,lastAt:0,startedAt:Date.now(),busy:false};
function smartNudgePlan(){return [10000,20000,30000,40000,50000,60000]}
function currentVisibleProducts(){return [...document.querySelectorAll("#shopProducts .shopProduct")].map(el=>SHOP_PRODUCTS.find(p=>p.id===el.dataset.product)).filter(Boolean).slice(0,6)}
function microProductOptions(){
  const visible=currentVisibleProducts();
  if(visible.length<2)return null;
  const a=visible[0],b=visible[1];
  const aRaw=productWords(a),bRaw=productWords(b);
  const aLabel=(a.name||"Option A").replace(/(?:shirt|tee|polo)/gi,"").trim().slice(0,24)||"This one";
  const bLabel=(b.name||"Option B").replace(/(?:shirt|tee|polo)/gi,"").trim().slice(0,24)||"That one";
  const softer=/relaxed|casual|linen|cuban|camp|resort/.test(aRaw)&&/formal|structured|slim|fitted|shiny|satin|gloss|loud|neon|floral|bold/.test(bRaw);
  return [
    {icon:"✦",q:"Which one feels more like you?",opts:[[aLabel,["pairwise choice",a.name]],[bLabel,["pairwise choice",b.name]]]},
    {icon:"☁",q:"Should NØPE show you more like this?",product:a,opts:[["More like this",["product direction","more like "+a.name]],["Less like this",["product direction","less like "+a.name]]]},
    {icon:"◌",q:softer?"Which look should NØPE lean toward?":"Which one would you open first?",opts:[[aLabel,["pairwise choice",a.name]],[bLabel,["pairwise choice",b.name]]]},
    {icon:"♡",q:"Would you like more options like one of these?",opts:[["Yes — "+aLabel,["product direction","more like "+a.name]],["Yes — "+bLabel,["product direction","more like "+b.name]]]},
    {icon:"✧",q:"Quick choice: keep showing this kind of thing?",opts:[["Yes, this one",["product direction","keep showing products like "+a.name]],["No, not this",["product direction","show fewer products like "+a.name]]]}
  ];
}
function maybeShowNudge(trigger="time",context={}){
  if(nudgeState.busy||nudgeState.shown>=6)return;
  if(document.hidden)return;
  if(document.querySelector(".choiceModal"))return;
  const elapsed=Date.now()-nudgeState.startedAt,next=nudgeState.shown*10000+10000;
  if(elapsed<next)return;
  const questions=microProductOptions();if(!questions)return;
  const q=questions[Math.min(nudgeState.shown,questions.length-1)];if(!q)return;
  nudgeState.busy=true;nudgeState.shown++;
  const el=document.createElement("div");el.className="microNudge";el.innerHTML='<div class="microBubble"><div class="microTop"><span class="microDot">'+q.icon+'</span><span class="microKicker">NØPE is curious · 4 sec</span><button class="microClose" aria-label="Dismiss">×</button></div><div class="microQuestion">'+q.q+'</div><div class="microOptions">'+q.opts.map((o,i)=>'<button class="microOption" data-opt="'+i+'">'+o[0]+'</button>').join("")+'</div><div class="microTimer"><i></i></div></div>';
  document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("show"));
  let timer=setTimeout(()=>dismiss(),4200);
  function dismiss(){clearTimeout(timer);el.classList.remove("show");setTimeout(()=>el.remove(),220);nudgeState.busy=false;}
  el.querySelector(".microClose").onclick=()=>{recordBehaviorSignal("micro-question dismissal",q.q,"User chose not to answer a lightweight preference question","micro_nudge_dismiss","low");dismiss()};
  el.querySelectorAll("[data-opt]").forEach(btn=>btn.onclick=async()=>{const chosen=q.opts[Number(btn.dataset.opt)],k=chosen[1][0],v=chosen[1][1];nudgeState.answered++;const reason="User voluntarily answered a product-grounded NØPE question about products visible in the store";await recordSignal(k,v,reason,"ui","micro_nudge","medium");const picked=SHOP_PRODUCTS.find(p=>p.name===v)||SHOP_PRODUCTS.find(p=>v.includes(p.name));if(k==="pairwise choice"&&picked){registerPositiveEvidence(picked,"pairwise_choice");inferProductAffinity(picked);learnTaste(picked,.8,"pairwise micro question")}if(k==="product direction"&&picked){registerPositiveEvidence(picked,"product_direction");inferProductAffinity(picked);learnTaste(picked,.6,"product direction question")}await refreshSessionView();showLearnedMemory(v,"User chose from products currently shown");if(k==="product direction"||k==="pairwise choice")await rerankFromMemory(k==="pairwise choice"?v:"");dismiss()});
}
function startMicroNudges(){
  if(!window.__nopeNudgeTimer)window.__nopeNudgeTimer=setInterval(()=>maybeShowNudge("time"),1000);
}
function proofStep(name,detail){
  const ids={ui:"proofUI",db:"proofDB",backend:"proofBackend",update:"proofUIUpdate"},order=["ui","db","backend","update"],idx=order.indexOf(name);
  order.forEach((k,i)=>{const el=document.getElementById(ids[k]);if(el){el.classList.toggle("active",i===idx);el.classList.toggle("done",i<idx)}});
  const d=document.getElementById("proofDetail");if(d)d.textContent=detail||"";
}
function updateLearningProof(inferred,learning){
  const key=inferred?.preference;
  const e=learning?.[key];
  const score=Number(e?.score||0),products=Number(e?.distinct_products||0),confirmed=Boolean(e?.confirmed);
  const text=document.getElementById("evidenceText"),fill=document.getElementById("evidenceFill"),h=document.getElementById("demoHypothesis"),o=document.getElementById("demoOutcome");
  if(fill)fill.style.width=Math.min(100,(products/3)*100)+"%";
  if(text)text.textContent=products+" / 3 different products · evidence score "+score.toFixed(1);
  if(h)h.textContent=confirmed?"Pattern confirmed → "+inferred.value:"Hypothesis only → "+inferred.value;
  if(o)o.innerHTML=confirmed?"<strong>Enough evidence</strong> · NØPE can now suppress this product family.":"<strong>Still observing</strong> · NØPE will keep similar products visible until 3 different products support the same pattern.";
}
async function recordSignal(preference,value,reason,source,signal_type="inferred",confidence="medium"){
  try{
    if(confidence!=="low")proofStep("ui","Captured: "+(value||preference)+" · source="+source);
    const saved=await mcp("record_preference",{user_id:"demo-user",preference,value,reason,confidence,session_id:sessionId(),source,signal_type});
    if(saved?.status==="SAVED"&&confidence!=="low"){
      proofStep("db","Stored in Postgres · "+preference+" = "+value);
      await refreshSessionView();
    }
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
    const meaningful=prefs.filter(p=>String(p.confidence||"").toLowerCase()!=="low" || String(p.signal_type||"").toLowerCase()==="rejection");
    if(!meaningful.length){root.innerHTML='<div class="emptyMemory">No high-value preference signal yet. NØPE is quietly observing.</div><div class="sessionFoot">'+prefs.length+' low-confidence interaction signal(s) observed</div>';return}
    const groups={hard:[],like:[],avoid:[],signals:[]};
    meaningful.slice(0,12).forEach(p=>{
      const text=(p.preference+" "+p.value+" "+(p.reason||"")).toLowerCase();
      const item='<div class="prefItem"><span class="prefMain">'+(p.value||p.preference)+'</span><span class="prefMeta">'+(p.source||"agent")+' · '+(p.confidence||"medium")+'</span>'+(p.reason?'<div class="prefReason">'+p.reason+'</div>':'')+'</div>';
      if(/avoid|hate|dislike|no |not |formal|shiny/.test(text))groups.avoid.push(item);
      else if(/budget|occasion|fit|material|color/.test(text))groups.hard.push(item);
      else groups.like.push(item);
    });
    const sourceCounts={voice:0,text:0,ui:0}; prefs.forEach(p=>{const s=String(p.source||"agent").toLowerCase(); if(s==="voice")sourceCounts.voice++; else if(s==="text")sourceCounts.text++; else if(s==="ui")sourceCounts.ui++;}); root.innerHTML='<div class="memoryHeader"><div><div class="prefLabel">THIS SESSION</div><div style="font-size:12px;font-weight:850">NØPE is building a decision profile</div></div><div class="sessionIdMini">'+sessionId().slice(0,15)+'…</div></div><div class="prefGrid"><div><div class="prefLabel">AVOID / REJECTED</div>'+(groups.avoid.join("")||'<div class="emptyMemory">Nothing rejected yet</div>')+'</div><div><div class="prefLabel">LIKES / CONSTRAINTS</div>'+(groups.like.join("")||'<div class="emptyMemory">Nothing learned yet</div>')+'</div></div><div class="memorySection"><div class="memorySectionTitle">SIGNALS BY SOURCE</div><div class="understood" style="margin-top:6px"><span class="signal">🎙 Voice · '+sourceCounts.voice+'</span><span class="signal">⌨ Text · '+sourceCounts.text+'</span><span class="signal">👆 UI · '+sourceCounts.ui+'</span></div></div><div class="sessionFoot">Stored for this session · '+prefs.length+' signals · used in ranking</div>';
  }catch(e){console.warn(e)}
}
async function captureIntentSignals(text,source){
  const q=String(text||"").toLowerCase(), jobs=[];
  if(/shiny|chamak|flashy|glitter|satin|silk finish/.test(q)) jobs.push(recordSignal("finish","avoid shiny/flashy","User explicitly rejected shiny or flashy finishes",source,"explicit","high"));
  if(/v[- ]?neck|v neck/.test(q)) jobs.push(recordSignal("neckline","prefer V-neck","User explicitly mentioned a V-neck neckline",source,"explicit","high"));
  if(/o[- ]?neck|round[- ]?neck|crew[- ]?neck/.test(q)) jobs.push(recordSignal("neckline","prefer O-neck","User explicitly mentioned an O-neck / round neckline",source,"explicit","high"));
  if(/formal|uncle|office-like|corporate/.test(q)) jobs.push(recordSignal("formality","avoid overly formal","User indicated they do not want a formal or office-like look",source,"explicit","high"));
  if(/relaxed|casual|comfortable|comfy|easy/.test(q)) jobs.push(recordSignal("fit/style","prefer relaxed and comfortable","Current request indicates a relaxed/comfortable preference",source,"inferred","medium"));
  if(/classy|elegant|clean|minimal|understated/.test(q)) jobs.push(recordSignal("style","prefer clean and understated","Current request indicates a clean, understated style",source,"inferred","medium"));
  if(/youthful|young|trendy|cool/.test(q)) jobs.push(recordSignal("style","prefer youthful","Current request indicates a youthful/trendy preference",source,"inferred","medium"));
  if(/linen|cotton|denim|corduroy/.test(q)){const m=q.match(/linen|cotton|denim|corduroy/);jobs.push(recordSignal("material","prefer "+m[0],"Material mentioned in current request",source,"explicit","high"))}
  if(/black|navy|blue|white|ivory|beige|sand|sage|rust/.test(q)){const m=q.match(/black|navy|blue|white|ivory|beige|sand|sage|rust/);jobs.push(recordSignal("colour","prefer "+m[0],"Colour mentioned in current request",source,"explicit","high"))}
  if(/slim|fitted|tailored/.test(q)) jobs.push(recordSignal("fit","prefer fitted","Fit mentioned in current request",source,"explicit","high"));
  if(/oversized|loose|baggy/.test(q)) jobs.push(recordSignal("fit","prefer loose/oversized","Fit mentioned in current request",source,"explicit","high"));
  if(/breathable|summer|heat|garmi/.test(q)) jobs.push(recordSignal("comfort","prefer breathable","Comfort requirement detected",source,"inferred","medium"));
  if(/party|club|night out/.test(q)) jobs.push(recordSignal("occasion","prefer party/night-out","Occasion detected in current request",source,"explicit","high"));
  const bm=q.match(/(?:₹|rs\.?|rupees?\s*)([0-9,]+)/i); if(bm) jobs.push(recordSignal("budget","up to ₹"+bm[1],"Budget stated in current request",source,"explicit","high"));
  await Promise.all(jobs);
}
function updateIntelligence(q,found,picks){
  const text=String(q||"").toLowerCase();
  const budget=(text.match(/(?:₹|rs\\.?|rupees?\\s*)([0-9,]+)/i)||[])[1];
  const chips=[
    /wedding|shaadi|marriage/.test(text)?"Wedding":null,
    /v[- ]?neck/.test(text)?"V-Neck":null,
    /o[- ]?neck|round[- ]?neck/.test(text)?"O-Neck":null,
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
function productWords(p){return (((p?.name||"")+" "+(p?.meta||"")+" "+(p?.style||"")+" "+(p?.tags||[]).join(" "))).toLowerCase()}
function showRejectionQuestion(p,inferred){
  if(nudgeState.busy||document.hidden)return;
  const raw=productWords(p),opts=[];
  if(/formal|structured|slim|fitted|tailored/.test(raw))opts.push(["Too formal",["formality","avoid overly formal / structured"]],["Too fitted",["fit","avoid very fitted cuts"]]);
  if(p.neck&&(p.garment||"").toLowerCase()==="shirt"&&Number(p.price||0)>=3000)opts.push(["Too expensive",["price","prefer a lower-priced "+(p.neck==="v"?"V-neck":"O-neck")+" T-shirt instead"]]);
  if(/shiny|satin|gloss|silk|party/.test(raw))opts.push(["Too shiny",["finish","avoid shiny / glossy finishes"]],["Too party",["occasion","prefer less party-like pieces"]]);
  if(/neon|loud|floral|bold|check/.test(raw))opts.push(["Too loud",["expression","avoid loud / expressive pieces"]],["Too colourful",["colour direction","prefer quieter colours"]]);
  if(/linen|cotton|denim|corduroy/.test(raw))opts.push(["Not this fabric",["material","explore a different fabric"]]);
  opts.push(["Just not this one",null]);
  const unique=opts.filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i).slice(0,3);
  nudgeState.busy=true;
  const el=document.createElement("div");el.className="microNudge rejectionNudge";el.innerHTML='<div class="microBubble"><div class="microTop"><span class="microDot">↩</span><span class="microKicker">NØPE noticed · 4 sec</span><button class="microClose" aria-label="Dismiss">×</button></div><div class="microQuestion">You skipped “'+p.name+'”. What was off?</div><div class="microOptions">'+unique.map((o,i)=>'<button class="microOption" data-rej="'+i+'">'+o[0]+'</button>').join("")+'</div><div class="microTimer"><i></i></div></div>';
  document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("show"));
  let timer=setTimeout(()=>dismiss(),4200);
  function dismiss(){clearTimeout(timer);el.classList.remove("show");setTimeout(()=>el.remove(),220);nudgeState.busy=false}
  el.querySelector(".microClose").onclick=()=>{recordBehaviorSignal("rejection question skipped",p.name,"User skipped a product-grounded follow-up question","rejection_question_dismiss","low");dismiss()};
  el.querySelectorAll("[data-rej]").forEach(btn=>btn.onclick=async()=>{const chosen=unique[Number(btn.dataset.rej)];if(chosen[1]){const extra="product_id="+p.id+" — neck="+(p.neck||"unknown")+" — garment="+(p.garment||"unknown")+" — price="+p.price+" — User answered a product-grounded rejection question about "+p.name;await recordSignal(chosen[1][0],chosen[1][1],extra,"ui","rejection_feedback","high");showLearnedMemory(chosen[1][1],"User explained what felt wrong about "+p.name);learnTaste(p,-2.4,"rejection feedback");if(chosen[1][0]==="price")await rerankFromMemory("preserve "+(p.neck==="v"?"V-neck":"O-neck")+" but favor affordability")}else{recordBehaviorSignal("product rejection",p.name,"product_id="+p.id+" — neck="+(p.neck||"unknown")+" — garment="+(p.garment||"unknown")+" — User said this specific product was simply not right","rejection_feedback","low")}setStatus("✓ NØPE got the reason and can choose better next time","ok");dismiss()});
}
function renderTasteLab(items){
  const host=document.querySelector(".shopSection");if(!host)return;
  let bar=document.getElementById("nopeTasteLab");if(!bar){bar=document.createElement("div");bar.id="nopeTasteLab";host.insertBefore(bar,document.getElementById("shopProducts"));}
  const visible=items.slice(0,8);const words=visible.map(productWords).join(" ");const choices=[];
  if(/relaxed|easy|casual|resort|cuban|camp/.test(words))choices.push(["More relaxed","style","prefer more relaxed pieces"]);
  if(/minimal|clean|understated/.test(words))choices.push(["More minimal","style","prefer cleaner and more minimal pieces"]);
  if(/linen/.test(words))choices.push(["More linen","material","prefer linen pieces"]);
  if(/shiny|satin|gloss/.test(words))choices.push(["Less shiny","finish","prefer matte / low-shine finishes"]);
  if(/bold|neon|floral|colour|bright/.test(words))choices.push(["More colour","colour direction","prefer bolder colours"]);
  const selected=choices.slice(0,4);
  const a=visible[0],b=visible[1];
  bar.innerHTML='<span class="tasteLabLabel">TEACH NØPE</span><span class="tasteLabQuestion">Tiny choices help NØPE learn:</span>'+selected.map((x,i)=>'<button class="tasteChip" data-teach="'+i+'">'+x[0]+'</button>').join("")+(a&&b?'<span class="tastePair"><span class="tasteVs">THIS?</span><button data-pair="0" title="'+a.name+'">'+a.name+'</button><span class="tasteVs">or</span><button data-pair="1" title="'+b.name+'">'+b.name+'</button></span>':"")+'<span class="tasteEvidence"><span id="tasteEvidenceCount">'+evidenceProductCount()+' / 6 meaningful product choices</span><span class="tasteEvidenceTrack"><i id="tasteEvidenceFill" style="width:'+Math.min(100,(evidenceProductCount()/6)*100)+'%"></i></span></span>';
  bar.querySelectorAll("[data-teach]").forEach(btn=>btn.onclick=async()=>{const c=selected[Number(btn.dataset.teach)];if(!c)return;await recordSignal(c[1],c[2],"User used the one-tap Teach NØPE control","ui","teach_nudge","medium");learnTasteByValue(c[1],c[2]);await rerankFromMemory(c[2]);setStatus("✓ NØPE updated from one tap: "+c[0],"ok")});
  bar.querySelectorAll("[data-pair]").forEach(btn=>btn.onclick=async()=>{const chosen=Number(btn.dataset.pair)===0?a:b;if(!chosen)return;await recordSignal("pairwise choice",chosen.name,"User picked this product when comparing two available products","ui","pairwise_choice","medium");inferProductAffinity(chosen);learnTaste(chosen,1.3,"pairwise choice");await rerankFromMemory("prefer the attributes of "+chosen.name);setStatus("✓ NØPE learned from your choice between two real products","ok")});
}
function learnTasteByValue(preference,value){const v=String(value||"").toLowerCase();if(v.includes("relaxed"))tasteModel.relaxed=(tasteModel.relaxed||0)+1.3;if(v.includes("minimal")||v.includes("cleaner"))tasteModel.minimal=(tasteModel.minimal||0)+1.1;if(v.includes("linen"))tasteModel.linen=(tasteModel.linen||0)+1.1;if(v.includes("matte"))tasteModel.shiny=(tasteModel.shiny||0)-1.4;if(v.includes("bolder"))tasteModel["bold-color"]=(tasteModel["bold-color"]||0)+1.1;localStorage.setItem(tasteKey,JSON.stringify(tasteModel))}
async function rerankFromMemory(extraIntent=""){try{const mem=await mcp("get_preferences",{user_id:"demo-user",session_id:sessionId()});const ranked=await mcp("rank_products",{products:SHOP_PRODUCTS,preferences:mem.preferences||[],intent:extraIntent||""});const names=(ranked.results||[]).map(x=>x.name);const lead=names.map(n=>SHOP_PRODUCTS.find(x=>x.name===n)).filter(Boolean);const rest=SHOP_PRODUCTS.filter(x=>!lead.some(y=>y.id===x.id));const pivot=ranked.learning?.pricePivot;const neck=ranked.learning?.neckPreference;const neckItems=neck?SHOP_PRODUCTS.filter(x=>String(x.neck||"").toLowerCase()===neck):[];const prePivot=neck?[...lead.filter(x=>String(x.neck||"").toLowerCase()===neck),...neckItems,...lead,...rest].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i):[...lead,...rest];renderShopCore(pivot?.confirmed?lead.slice(0,8):prePivot.slice(0,8));if(pivot?.confirmed){const neckLabel=pivot.neck==="v"?"V-neck":"O-neck";proofStep("update","Price bias detected · keep "+neckLabel+" · switch shirts → T-shirts");const pulse=document.querySelector(".shopPulse");if(pulse)pulse.textContent="human bias · neckline kept · price wins";const outcome=document.getElementById("demoOutcome");if(outcome)outcome.innerHTML="<strong>Human bias detected</strong> · neckline preference survived, but repeated price rejection switched the garment category.";const hypothesis=document.getElementById("demoHypothesis");if(hypothesis)hypothesis.textContent="Stable preference → "+neckLabel+" · price rejection → category pivot → affordable T-shirts";stage("NØPE adapted","Same neckline preserved; only lower-priced "+neckLabel+" T-shirts remain.","nCatalog")}else if(ranked.learning?.formality||ranked.learning?.finish||ranked.learning?.expression){const key=Object.keys(ranked.learning).find(k=>["formality","finish","expression"].includes(k)&&ranked.learning[k]?.score>0);if(key)updateLearningProof({preference:key,value:"learned pattern"},ranked.learning)}}catch(e){console.warn("Could not re-rank after taste input",e)}}
function installBehavioralLearning(items){
  document.querySelectorAll(".shopProduct").forEach((card,i)=>{
    const p=items[i];if(!p)return;let timer=null,entered=0,viewed=false;
    card.addEventListener("mouseenter",()=>{entered=Date.now();if(timer)clearTimeout(timer);timer=setTimeout(()=>{viewed=true;recordBehaviorSignal("hover intent",p.name,"User lingered on this product","hover_dwell","low");learnTaste(p,.18,"hover")},900)});
    card.addEventListener("mouseleave",()=>{if(timer)clearTimeout(timer);if(entered&&Date.now()-entered>500)recordBehaviorSignal("product consideration",p.name,"User explored this product visually","hover","low");entered=0});
    card.addEventListener("focusin",()=>{if(!viewed){viewed=true;recordBehaviorSignal("product consideration",p.name,"User focused on this product","focus","low");learnTaste(p,.2,"focus")}});
    card.addEventListener("click",e=>{if(e.target.closest("button"))return;registerPositiveEvidence(p,"product_click");recordBehaviorSignal("product click",p.name,"User intentionally interacted with this product","product_click","low");learnTaste(p,.35,"click");openProductDetail(p)});
    const visual=card.querySelector(".visualProduct");if(visual)visual.onclick=e=>{e.stopPropagation();registerPositiveEvidence(p,"visual_click");recordBehaviorSignal("visual interest",p.name,"User clicked the product visual","visual_click","low");learnTaste(p,.45,"visual click");openProductDetail(p)};
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
      ? {preference:"formality",value:"avoid overly formal / structured",reason:"product_id="+p.id+" — User rejected a formal-looking recommendation"}
      : raw.includes("shiny")||raw.includes("satin")||raw.includes("gloss")||raw.includes("party")
      ? {preference:"finish",value:"avoid shiny / party finishes",reason:"product_id="+p.id+" — User rejected a shiny or party-style recommendation"}
      : raw.includes("neon")||raw.includes("loud")||raw.includes("floral")||raw.includes("bold")||raw.includes("check")
      ? {preference:"expression",value:"avoid loud / expressive pieces",reason:"product_id="+p.id+" — User rejected a loud or highly expressive recommendation"}
      : {preference:"style",value:"avoid this style direction",reason:"product_id="+p.id+" — NØPE inferred a negative style signal from the skipped recommendation"};
    try{
      proofStep("ui","UI rejection captured · NØPE is inferring what to avoid");
      const h=document.getElementById("demoHypothesis"),o=document.getElementById("demoOutcome");
      if(h)h.textContent="Hypothesis → "+inferred.value;
      if(o)o.innerHTML="<strong>Testing now</strong> · Will this rejection change the next shortlist?";
      stage("Preference signal detected","You skipped an option. NØPE made a first guess — now it can ask a tiny, product-specific question to make that guess smarter.","nMemory");
      const saved=await mcp("record_preference",{user_id:"demo-user",preference:inferred.preference,value:inferred.value,reason:inferred.reason,confidence:"medium",session_id:sessionId(),source:"ui",signal_type:"rejection"});
      if(saved.status!=="SAVED")throw Error("Preference was not saved");
      proofStep("db","Rejection stored in Postgres · "+inferred.preference+" = "+inferred.value);
      await refreshSessionView();
      showLearnedMemory(inferred.value,inferred.reason);
      const openNudge=document.querySelector(".microNudge");if(openNudge)openNudge.remove();nudgeState.busy=false;
      showRejectionQuestion(p,inferred);
      learnTaste(p,-1.8,"skip");
      stage("Memory updated","NØPE is testing a different direction.","nCatalog");
      const freshMemory=await mcp("get_preferences",{user_id:"demo-user",session_id:sessionId()});
      proofStep("backend","Backend re-read "+(freshMemory.count||freshMemory.preferences?.length||0)+" stored signal(s) before ranking");
      const found=await mcp("search_products",{category:"clothing",max_price:3000,occasion:"wedding",style:"classy relaxed",avoid:null});
      const products=found.results||[];
      const adaptiveIntent=(transcript||"").replace(/(?:not|no|nothing|don't|dont|without|bilkul nahi|bilkul no)[^.?!,;]{0,30}(?:formal|structured|shiny|satin|gloss|loud|neon|floral|bold|flashy)/gi," ").replace(/(?:formal|structured|shiny|satin|gloss|loud|neon|floral|bold|flashy)[^.?!,;]{0,18}(?:not|no|nothing|don't|dont|bilkul nahi)/gi," ").trim();
      const ranked=await mcp("rank_products",{products:SHOP_PRODUCTS,preferences:freshMemory.preferences||[],intent:adaptiveIntent});
      const rankedNames=(ranked.results||[]).map(x=>x.name);
      const candidates=rankedNames.map(name=>SHOP_PRODUCTS.find(x=>x.name===name)).filter(Boolean);
      const learning=ranked.learning?.[inferred.preference]||null;
      const confirmed=Boolean(learning?.confirmed);
      const pricePivot=ranked.learning?.pricePivot;
      const clusterFor=pref=>pref==="formality"?/formal|structured|executive|slim|fitted/i:pref==="finish"?/shiny|satin|gloss|party/i:pref==="expression"?/loud|floral|neon|bold|check|graphic/i:/^$/;
      const cluster=clusterFor(inferred.preference);
      const similar=SHOP_PRODUCTS.filter(x=>cluster.test(productWords(x))&&!candidates.some(y=>y.id===x.id));
      const nextChoices=confirmed?[...candidates,...SHOP_PRODUCTS.filter(x=>!candidates.some(y=>y.id===x.id))].slice(0,8):[...candidates.slice(0,5),...similar.slice(0,3)].slice(0,8);
      renderShopCore(nextChoices);
      updateLearningProof(inferred,ranked.learning);
      if(pricePivot?.confirmed){
        const neckLabel=pricePivot.neck==="v"?"V-neck":"O-neck";
        proofStep("update","Price bias detected · keep "+neckLabel+" · switch shirts → T-shirts");
        const pulse=document.querySelector(".shopPulse");if(pulse)pulse.textContent="human bias · neckline kept · price wins";
        const outcome=document.getElementById("demoOutcome");if(outcome)outcome.innerHTML="<strong>Human bias detected</strong> · you kept loving the neckline, but rejected premium shirts on price. NØPE kept the neckline and switched garment.";
        const hypothesis=document.getElementById("demoHypothesis");if(hypothesis)hypothesis.textContent="Stable preference → "+neckLabel+" · constraint emerged → price · compromise → affordable T-shirts";
        updateIntelligence(transcript,{count:SHOP_PRODUCTS.length},nextChoices.slice(0,3));
        stage("NØPE found the compromise","The preferred neckline stayed stable. Price rejection changed the garment category, so only cheaper "+neckLabel+" T-shirts remain.","nCatalog");
      }else{
        proofStep("update",confirmed?"Pattern confirmed · similar products can now be suppressed":"Learning only · similar products deliberately remain visible");
        const pulse=document.querySelector(".shopPulse");if(pulse)pulse.textContent=confirmed?"adapted · pattern confirmed":"observing · no premature filtering";
        const outcome=document.getElementById("demoOutcome");if(outcome)outcome.innerHTML=confirmed?"<strong>Confirmed</strong> · 3 different products support the same rejection, so NØPE can now suppress this family.":"<strong>Still observing</strong> · the rejected family stays visible because one signal is not enough.";
        const hypothesis=document.getElementById("demoHypothesis");if(hypothesis)hypothesis.textContent=confirmed?"Pattern confirmed → "+inferred.value:"Hypothesis only → "+inferred.value;
        updateIntelligence(transcript,{count:SHOP_PRODUCTS.length},nextChoices.slice(0,3));
        stage("NØPE re-ranked","New shortlist reflects your rejection — not just your original search.","nAgent");
      }
      setStatus("✓ NØPE updated the shortlist using a multi-factor decision","ok");
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
const resetDemoBtn=document.getElementById("resetDemo");
if(resetDemoBtn)resetDemoBtn.onclick=async()=>{
  resetDemoBtn.disabled=true;resetDemoBtn.textContent="Resetting…";
  try{const oldSession=sessionId();await fetch("/api/demo/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:"demo-user"})});localStorage.removeItem("nope_session_id");localStorage.removeItem("nope_saved_products");sessionStorage.removeItem("nope_open_signal");sessionStorage.removeItem("nope_demo_waybill");sessionStorage.removeItem(positiveEvidenceKey);localStorage.removeItem("nope_taste_"+oldSession);location.reload();}
  catch(e){resetDemoBtn.disabled=false;resetDemoBtn.textContent="↺ Reset";setStatus("Reset failed: "+e.message,"err")}
};
const C={
linen:["#efe2c7","#d7c09a","#879f82","#496d64","#c76f52","#354b5c"],
blue:["#dce8f2","#93b6cf","#466f91","#223b57","#d19a68","#6e7d89"],
earth:["#ead9c5","#c69b70","#8b684d","#4f4036","#a95f42","#75835a"],
pastel:["#f1dfe2","#c8d8e8","#d9b8ce","#a7c8a1","#e6c889","#8994bd"],
dark:["#e4e0dd","#7d8789","#394449","#14191c","#7a4b46","#b68b54"],
bright:["#f4e2c4","#e8c84a","#ee713f","#d74668","#5fae9d","#5d73c7"],
neutral:["#f2f0ea","#d3d0c8","#a5aaa8","#6d7374","#4d5961","#b9a28a"]
};
const savedProducts=new Set();
try{JSON.parse(localStorage.getItem("nope_saved_products")||"[]").forEach(id=>savedProducts.add(id))}catch(e){}
function persistSavedProducts(){localStorage.setItem("nope_saved_products",JSON.stringify([...savedProducts]))}
const SHOP_PRODUCTS=[
{id:"office-blue",name:"Executive Blue Formal Shirt",price:2299,meta:"Monarch · Formal · Structured",shape:"executive",colors:C.blue},
{id:"classic-white-formal",name:"Classic White Formal Shirt",price:2099,meta:"Monarch · Formal · Structured",shape:"formal",colors:C.neutral},
{id:"tailored-navy",name:"Tailored Navy Office Shirt",price:2399,meta:"Monarch · Formal · Fitted",shape:"slim",colors:C.blue},
{id:"structured-sand",name:"Structured Sand Shirt",price:2199,meta:"Monarch · Formal · Structured",shape:"formal",colors:C.earth},
{id:"linen-resort",name:"Linen Blend Resort Shirt",price:2499,meta:"NØPE Atelier · Linen blend · Relaxed · Wedding",shape:"resort",colors:C.linen},
{id:"black-satin",name:"Black Satin Night Shirt",price:2199,meta:"After Dark · Satin · Shiny",shape:"satin",colors:C.dark},
{id:"neon-lime",name:"Lime Statement Camp Shirt",price:1799,meta:"After Dark · Neon · Loud",shape:"neon",colors:C.bright},
{id:"textured-oxford",name:"Textured Oxford Casual Shirt",price:2299,meta:"Textured cotton · Smart casual",shape:"oxford",colors:C.blue},
{id:"cuban-collar",name:"Cotton Cuban Collar Shirt",price:1999,meta:"Cotton · Relaxed · Easy",shape:"cuban",colors:C.earth},
{id:"camp-collar",name:"Camp Collar Resort Shirt",price:1899,meta:"Sunday Club · Printed · Relaxed",shape:"camp",colors:C.bright},
{id:"sage-linen",name:"Sage Linen Cuban Shirt",price:2499,meta:"Casa Linen · Linen · Wedding",shape:"mandarin",colors:C.linen},
{id:"navy-check",name:"Navy Micro-Check Shirt",price:2199,meta:"NØPE Atelier · Clean · Smart casual",shape:"check",colors:C.blue},
{id:"black-camp",name:"Black Textured Camp Shirt",price:2099,meta:"Urban Loom · Textured · Stylish",shape:"texture",colors:C.dark},
{id:"ivory-mandarin",name:"Ivory Mandarin Collar Shirt",price:2399,meta:"Monarch · Minimal · Festive",shape:"band",colors:C.neutral},
{id:"rust-overshirt",name:"Rust Corduroy Overshirt",price:2799,meta:"Sunday Club · Corduroy · Layering",shape:"overshirt",colors:C.earth},
{id:"performance-polo",name:"Charcoal Performance Polo",price:1599,meta:"NØPE Sport · Stretch · Breathable",shape:"polo",colors:C.dark},
{id:"minimal-tee",name:"White Minimal Oversized Tee",price:999,meta:"NØPE Basics · Oversized · Minimal",shape:"tee",colors:C.neutral},
{id:"floral-punch",name:"Tropical Floral Shirt",price:1999,meta:"Sunday Club · Floral · Loud",shape:"floral",colors:C.bright},
{id:"skinny-white",name:"Sharp Slim White Shirt",price:1899,meta:"Monarch · Fitted · Formal",shape:"slim",colors:C.neutral},
{id:"purple-satin",name:"Purple Gloss Party Shirt",price:2399,meta:"After Dark · Gloss · Party",shape:"gloss",colors:C.pastel},
{id:"orange-pop",name:"Orange Pop Cuban Shirt",price:1699,meta:"Weekend · Orange · Bold",shape:"orange",colors:C.bright},
{id:"grey-basic",name:"Grey Basic Button Shirt",price:1399,meta:"NØPE Basics · Plain · Everyday",shape:"basic",colors:C.neutral},
{id:"baggy-denim",name:"Washed Denim Overshirt",price:2499,meta:"Urban Loom · Denim · Oversized",shape:"denim",colors:C.blue},
{id:"yellow-check",name:"Yellow Micro Check Shirt",price:1899,meta:"Weekend · Check · Bright",shape:"yellowcheck",colors:C.bright},
{id:"maroon-mandarin",name:"Maroon Mandarin Shirt",price:2399,meta:"Monarch · Festive · Bold",shape:"maroon",colors:C.dark},
{id:"olive-linen",name:"Olive Linen Relaxed Shirt",price:2299,meta:"Casa Linen · Linen · Relaxed",shape:"olive",colors:C.linen},
{id:"vshirt-linen-sand",name:"V-Neck Linen Shirt · Sand",price:4499,meta:"Atelier · V-Neck · Shirt · Linen · Relaxed · Premium",shape:"vneck",neck:"v",garment:"shirt",styleFamily:"linen-relaxed",colors:C.linen,tags:["v-neck","linen","premium","relaxed"]},
{id:"vshirt-oxford-blue",name:"V-Neck Oxford Shirt · Blue",price:3899,meta:"Atelier · V-Neck · Shirt · Oxford · Smart",shape:"vneck",neck:"v",garment:"shirt",styleFamily:"oxford-smart",colors:C.blue,tags:["v-neck","oxford","smart","premium"]},
{id:"vshirt-silk-black",name:"V-Neck Silk-Blend Shirt · Black",price:4999,meta:"After Dark · V-Neck · Shirt · Silk blend · Evening",shape:"vneck",neck:"v",garment:"shirt",styleFamily:"silk-evening",colors:C.dark,tags:["v-neck","silk","evening","premium"]},
{id:"vshirt-boxy-olive",name:"V-Neck Boxy Shirt · Olive",price:3599,meta:"Urban Loom · V-Neck · Shirt · Boxy · Casual",shape:"vneck",neck:"v",garment:"shirt",styleFamily:"boxy-casual",colors:C.linen,tags:["v-neck","boxy","casual","premium"]},
{id:"vtee-essential-white",name:"V-Neck Essential T-Shirt · White",price:799,meta:"NØPE Basics · V-Neck · T-Shirt · Cotton · Essential",shape:"vneck",neck:"v",garment:"t-shirt",styleFamily:"essential",colors:C.neutral,tags:["v-neck","cotton","everyday","affordable"]},
{id:"vtee-heavy-blue",name:"V-Neck Heavyweight Tee · Blue",price:999,meta:"NØPE Basics · V-Neck · T-Shirt · Heavyweight · Clean",shape:"vneck",neck:"v",garment:"t-shirt",styleFamily:"heavyweight",colors:C.blue,tags:["v-neck","heavyweight","clean","affordable"]},
{id:"vtee-modal-black",name:"V-Neck Modal Tee · Black",price:1099,meta:"NØPE Soft · V-Neck · T-Shirt · Modal · Smooth",shape:"vneck",neck:"v",garment:"t-shirt",styleFamily:"modal",colors:C.dark,tags:["v-neck","modal","smooth","affordable"]},
{id:"vtee-oversized-sage",name:"V-Neck Oversized Tee · Sage",price:899,meta:"NØPE Basics · V-Neck · T-Shirt · Oversized · Relaxed",shape:"vneck",neck:"v",garment:"t-shirt",styleFamily:"oversized",colors:C.linen,tags:["v-neck","oversized","relaxed","affordable"]},
{id:"oshirt-linen-ivory",name:"O-Neck Linen Shirt · Ivory",price:3299,meta:"Atelier · O-Neck · Shirt · Linen · Clean",shape:"oneck",neck:"o",garment:"shirt",styleFamily:"linen-clean",colors:C.neutral,tags:["o-neck","linen","clean","premium"]},
{id:"oshirt-oxford-navy",name:"O-Neck Oxford Shirt · Navy",price:3499,meta:"Atelier · O-Neck · Shirt · Oxford · Smart",shape:"oneck",neck:"o",garment:"shirt",styleFamily:"oxford-smart",colors:C.blue,tags:["o-neck","oxford","smart","premium"]},
{id:"oshirt-texture-rust",name:"O-Neck Textured Shirt · Rust",price:3799,meta:"Urban Loom · O-Neck · Shirt · Textured · Casual",shape:"oneck",neck:"o",garment:"shirt",styleFamily:"textured-casual",colors:C.earth,tags:["o-neck","textured","casual","premium"]},
{id:"oshirt-tailored-charcoal",name:"O-Neck Tailored Shirt · Charcoal",price:4199,meta:"Monarch · O-Neck · Shirt · Tailored · Structured",shape:"oneck",neck:"o",garment:"shirt",styleFamily:"tailored",colors:C.dark,tags:["o-neck","tailored","structured","premium"]},
{id:"otee-essential-black",name:"O-Neck Essential T-Shirt · Black",price:699,meta:"NØPE Basics · O-Neck · T-Shirt · Cotton · Essential",shape:"oneck",neck:"o",garment:"t-shirt",styleFamily:"essential",colors:C.dark,tags:["o-neck","cotton","everyday","affordable"]},
{id:"otee-heavy-white",name:"O-Neck Heavyweight Tee · White",price:899,meta:"NØPE Basics · O-Neck · T-Shirt · Heavyweight · Clean",shape:"oneck",neck:"o",garment:"t-shirt",styleFamily:"heavyweight",colors:C.neutral,tags:["o-neck","heavyweight","clean","affordable"]},
{id:"otee-pigment-olive",name:"O-Neck Pigment Tee · Olive",price:949,meta:"NØPE Basics · O-Neck · T-Shirt · Pigment · Relaxed",shape:"oneck",neck:"o",garment:"t-shirt",styleFamily:"pigment",colors:C.linen,tags:["o-neck","pigment","relaxed","affordable"]},
{id:"otee-boxy-blue",name:"O-Neck Boxy Tee · Blue",price:849,meta:"NØPE Basics · O-Neck · T-Shirt · Boxy · Youthful",shape:"oneck",neck:"o",garment:"t-shirt",styleFamily:"boxy",colors:C.blue,tags:["o-neck","boxy","youthful","affordable"]}
];
const positiveEvidenceKey="nope_positive_evidence_"+sessionId();
let positiveEvidence=[];
try{positiveEvidence=JSON.parse(sessionStorage.getItem(positiveEvidenceKey)||"[]")}catch(e){positiveEvidence=[]}
function persistPositiveEvidence(){sessionStorage.setItem(positiveEvidenceKey,JSON.stringify(positiveEvidence.slice(-12)))}
function evidenceProductCount(){return new Set(positiveEvidence.map(x=>x.product_id)).size}
function registerPositiveEvidence(p,action){
  if(!p||!p.id)return;
  if(!positiveEvidence.some(x=>x.product_id===p.id)){
    positiveEvidence.push({product_id:p.id,name:p.name,action,at:Date.now()});persistPositiveEvidence();
    updatePositiveEvidenceUI();
    if(evidenceProductCount()===6)analyzeTasteAfterEvidence();
  }
}
function updatePositiveEvidenceUI(){
  const count=evidenceProductCount(),text=document.getElementById("tasteEvidenceCount"),fill=document.getElementById("tasteEvidenceFill");
  if(text)text.textContent=count+" / 6 meaningful product choices";
  if(fill)fill.style.width=Math.min(100,(count/6)*100)+"%";
}
async function analyzeTasteAfterEvidence(){
  const reveal=document.getElementById("nopeProfileReveal");if(!reveal)return;
  try{
    reveal.classList.remove("hidden");
    document.getElementById("profileCombo").textContent="NØPE is connecting the dots…";
    document.getElementById("profileEvidence").textContent="6 different products chosen. Now checking what repeats — and what your rejections say to avoid.";
    const mem=await mcp("get_preferences",{user_id:"demo-user",session_id:sessionId()});
    const analysis=await mcp("analyze_customer_profile",{evidence:positiveEvidence,preferences:mem.preferences||[],products:SHOP_PRODUCTS});
    const combo=analysis.combination||"Still forming a taste pattern";
    const comboEl=document.getElementById("profileCombo"),evEl=document.getElementById("profileEvidence"),badges=document.getElementById("profileBadges"),results=document.getElementById("profileResults");
    if(comboEl)comboEl.textContent=analysis.status==="PROFILE_CONFIRMED"?"Your NØPE sweet spot: "+combo:"Your current direction: "+combo;
    if(evEl)evEl.textContent=analysis.status==="PROFILE_CONFIRMED"?"6 product choices · repeated attributes found · "+analysis.confidence+" confidence":"6 product choices · NØPE sees a direction, but will keep learning before making a hard rule.";
    if(badges)badges.innerHTML=(analysis.positive_pattern||[]).map(x=>'<span class="profileBadge">✓ '+x+'</span>').concat((analysis.negative_preferences||[]).map(x=>'<span class="profileBadge">↘ avoiding '+x+'</span>')).join("");
    const ranked=await mcp("rank_products",{products:SHOP_PRODUCTS,preferences:mem.preferences||[],intent:(analysis.combination||"")});
    const rankedProducts=(ranked.results||[]).map(x=>SHOP_PRODUCTS.find(p=>p.name===x.name)).filter(Boolean);
    const top=[...rankedProducts,...SHOP_PRODUCTS.filter(p=>!rankedProducts.some(x=>x.id===p.id))].slice(0,4);
    if(results)results.innerHTML='<span style="width:100%;font-size:9px;font-weight:950;color:#98a2b3;letter-spacing:.08em;text-transform:uppercase;margin-top:6px">NØPE would show next</span>'+top.map(x=>'<span class="profileBadge">'+x.name+' · ₹'+x.price+'</span>').join("");
    renderShopCore(top.concat(SHOP_PRODUCTS.filter(p=>!top.some(x=>x.id===p.id))).slice(0,8));
    updatePositiveEvidenceUI();
    stage("Taste pattern formed","NØPE combined repeated positive choices with rejection memory before changing the shortlist.","nAgent");
    setStatus("✓ NØPE connected 6 product choices into a current taste fingerprint","ok");
  }catch(e){console.warn("Taste analysis failed",e);const ev=document.getElementById("profileEvidence");if(ev)ev.textContent="NØPE has the evidence, but the profile check is still forming.";}
}
let cart=[], recorder=null, chunks=[], recording=false, transcript="";
let demoBaseline=[];
const mic=$("mic"), hint=$("hint"), transcriptEl=$("transcript"), statusEl=$("status");

function setStatus(t,c){if(statusEl){statusEl.textContent=t;statusEl.className="status "+(c||"")}}
function stage(t,d,n){$("stageTitle").textContent=t;$("stageDetail").textContent=d;["nGnani","nAgent","nMemory","nCatalog"].forEach(x=>$(x)?.classList.remove("live"));if(n)$(n)?.classList.add("live");const e=document.createElement("div");e.className="event";e.innerHTML='<span class="dot on"></span><span><b>'+t+"</b> — "+d+"</span>";$("timeline").prepend(e)}
function inferProductAffinity(p){
  const raw=((p?.name||"")+" "+(p?.style||"")+" "+(p?.meta||"")+" "+(p?.tags||[]).join(" ")).toLowerCase();
  const signals=[];
  if(/linen/.test(raw))signals.push(["material","linen"]);
  if(/relaxed|oversized|easy|airy/.test(raw))signals.push(["fit/style","relaxed and comfortable"]);
  if(/classy|minimal|clean|elegant/.test(raw))signals.push(["style","clean and understated"]);
  if(/casual|cuban|camp|resort/.test(raw))signals.push(["style","casual resort"]);
  if(/youthful|stylish/.test(raw))signals.push(["style","youthful"]);
  if(/v[- ]?neck/.test(raw))signals.push(["neckline","prefer V-neck"]);
  if(/o[- ]?neck|round[- ]?neck|crew[- ]?neck/.test(raw))signals.push(["neckline","prefer O-neck"]);
  if(/t-shirt|tee/.test(raw))signals.push(["garment preference","prefer T-shirt"]);
  if(/shirt/.test(raw)&&!/t-shirt|tee/.test(raw))signals.push(["garment preference","prefer shirt"]);
  signals.slice(0,5).forEach(([k,v])=>recordSignal(k,v,"User chose a product carrying this attribute","ui","positive_choice","medium"));
}
function addToCart(p,button){if(!cart.some(x=>x.id===p.id)){cart.push(p);registerPositiveEvidence(p,"add_to_bag");recordSignal("product affinity",p.name,"User added this recommendation to bag","ui","add_to_bag","medium");inferProductAffinity(p);if(button){button.textContent="✓ Added";button.classList.add("added")}$("cartCount").textContent=cart.length;setStatus(p.name+" added to your bag.","ok")}}
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
function visualFor(p){const cs=p.colors||C.neutral;return {bg1:cs[0],bg2:cs[1],c1:cs[2],c2:cs[3]}}
function productArtwork(p,color,accent){
 const a=color||p.colors?.[2]||"#52606b",b=accent||p.colors?.[3]||"#252d32",s=p.shape||"basic";
 const common='fill="'+a+'" stroke="'+b+'" stroke-width="3" stroke-linejoin="round"';
 const line=(x1,y1,x2,y2)=>'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" stroke="'+b+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
 const map={
 resort:'<path '+common+' d="M72 70L126 38L151 72L177 38L228 70L206 125L190 112L190 330L110 330L110 112L94 125Z"/><path d="M126 38L150 82L177 38" fill="none" stroke="'+b+'" stroke-width="7"/>'+line(150,82,150,315),
 oxford:'<path '+common+' d="M88 42L130 26L150 48L170 26L212 42L239 112L207 130L194 92L194 340L106 340L106 92L93 130L61 112Z"/><path d="M130 26L150 48L170 26" fill="none" stroke="'+b+'" stroke-width="5"/>'+line(150,48,150,340)+'<circle cx="150" cy="104" r="4" fill="'+b+'"/><circle cx="150" cy="142" r="4" fill="'+b+'"/><circle cx="150" cy="180" r="4" fill="'+b+'"/>',
 cuban:'<path '+common+' d="M86 68L125 38L150 62L175 38L214 68L235 118L205 136L194 112L190 330L110 330L106 112L95 136L65 118Z"/><path d="M125 38L150 92L175 38L160 72L150 92L140 72Z" fill="'+a+'" stroke="'+b+'" stroke-width="4"/>'+line(150,92,150,330),
 linen:'<path '+common+' d="M78 74L121 40L150 64L179 40L222 74L236 118L205 137L191 108L188 338L112 338L109 108L95 137L64 118Z"/><path d="M121 40L150 64L179 40L166 93L134 93Z" fill="'+b+'" stroke="'+b+'"/>'+line(150,64,150,338),
 formal:'<path '+common+' d="M94 35L130 20L150 44L170 20L206 35L230 105L201 118L191 86L191 342L109 342L109 86L99 118L70 105Z"/><path d="M130 20L150 44L170 20L159 72L141 72Z" fill="#fff9" stroke="'+b+'" stroke-width="3"/>'+line(150,72,150,342),
 boxy:'<path '+common+' d="M72 76L118 42L150 68L182 42L228 76L247 150L213 163L198 124L198 322L102 322L102 124L87 163L53 150Z"/><path d="M118 42L150 68L182 42L168 100L132 100Z" fill="'+b+'" stroke="'+b+'" stroke-width="3"/>',
 camp:'<path '+common+' d="M82 72L125 39L150 67L175 39L218 72L239 124L207 141L193 108L190 330L110 330L107 108L93 141L61 124Z"/><path d="M125 39L150 67L175 39L163 88L137 88Z" fill="'+a+'" stroke="'+b+'" stroke-width="5"/>'+line(150,67,150,330),
 mandarin:'<path '+common+' d="M90 58L129 28L150 50L171 28L210 58L232 114L202 132L191 98L191 334L109 334L109 98L98 132L68 114Z"/><path d="M129 28L150 50L171 28L171 77L129 77Z" fill="'+b+'" stroke="'+b+'"/>'+line(150,50,150,334),
 check:'<path '+common+' d="M86 60L127 30L150 55L173 30L214 60L236 120L204 138L191 104L191 334L109 334L109 104L96 138L64 120Z"/><path d="M110 120H190M110 160H190M110 200H190M110 240H190M130 100V300M160 100V300M185 100V300" stroke="'+b+'" stroke-width="3" opacity=".55"/>',
 texture:'<path '+common+' d="M92 54L130 25L150 49L170 25L208 54L238 125L204 141L192 107L190 335L110 335L108 107L96 141L62 125Z"/><path d="M116 95L184 95M116 122L184 122M116 149L184 149M116 176L184 176M116 203L184 203M116 230L184 230M116 257L184 257" stroke="'+b+'" stroke-width="2" opacity=".4"/>',
 band:'<path '+common+' d="M96 58L131 30L150 52L169 30L204 58L229 117L201 133L190 101L190 337L110 337L110 101L99 133L71 117Z"/><path d="M132 30H168V83H132Z" fill="'+b+'" stroke="'+b+'"/>'+line(150,83,150,337),
 overshirt:'<path '+common+' d="M78 68L122 31L150 55L178 31L222 68L250 136L214 151L198 108L198 344L102 344L102 108L86 151L50 136Z"/><path d="M122 31L150 55L178 31L168 88L132 88Z" fill="'+a+'" stroke="'+b+'" stroke-width="4"/><rect x="116" y="145" width="28" height="44" rx="3" fill="'+a+'" stroke="'+b+'" stroke-width="3"/><rect x="156" y="145" width="28" height="44" rx="3" fill="'+a+'" stroke="'+b+'" stroke-width="3"/>',
 polo:'<path '+common+' d="M92 70L128 39L150 61L172 39L208 70L231 124L202 140L190 105L190 332L110 332L110 105L98 140L69 124Z"/><path d="M128 39L150 61L172 39L163 91L137 91Z" fill="#fff9" stroke="'+b+'" stroke-width="4"/><path d="M137 91L150 102L163 91" fill="none" stroke="'+b+'" stroke-width="4"/>',
 tee:'<path '+common+' d="M101 67L132 43L150 62L168 43L199 67L229 123L196 140L182 109L182 324L118 324L118 109L104 140L71 123Z"/><path d="M132 43L150 62L168 43" fill="none" stroke="'+b+'" stroke-width="6"/><path d="M124 75H176" stroke="'+b+'" stroke-width="3" opacity=".5"/>',
  vneck:'<path '+common+' d="M84 69L126 36L150 61L174 36L216 69L241 124L207 142L193 108L190 332L110 332L107 108L93 142L59 124Z"/><path d="M126 36L150 88L174 36" fill="none" stroke="'+b+'" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
  oneck:'<path '+common+' d="M84 69L126 36L150 61L174 36L216 69L241 124L207 142L193 108L190 332L110 332L107 108L93 142L59 124Z"/><circle cx="150" cy="67" r="27" fill="none" stroke="'+b+'" stroke-width="7"/>',
 satin:'<path '+common+' d="M83 70L124 35L150 60L176 35L217 70L243 126L209 145L195 108L190 332L110 332L105 108L91 145L57 126Z"/><path d="M124 35L150 60L176 35L163 91L137 91Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M116 110L184 300" stroke="#fff8" stroke-width="12" opacity=".45"/><path d="M150 60V332" stroke="#fff6" stroke-width="3"/>',
 neon:'<path '+common+' d="M79 73L123 35L150 65L177 35L221 73L246 128L211 148L194 107L194 330L106 330L106 107L89 148L54 128Z"/><path d="M123 35L150 65L177 35L165 93L135 93Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M92 180L208 120M90 225L210 165M92 270L210 210" stroke="#fff8" stroke-width="8"/>',
 floral:'<path '+common+' d="M84 69L126 36L150 61L174 36L216 69L241 124L207 142L193 108L190 332L110 332L107 108L93 142L59 124Z"/><path d="M126 36L150 61L174 36L162 91L138 91Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><g fill="'+b+'"><circle cx="125" cy="140" r="8"/><circle cx="175" cy="165" r="10"/><circle cx="132" cy="210" r="9"/><circle cx="170" cy="260" r="8"/><circle cx="125" cy="285" r="7"/></g>',
 executive:'<path '+common+' d="M99 29L130 18L150 43L170 18L201 29L223 94L201 108L191 78L191 342L109 342L109 78L99 108L77 94Z"/><path d="M130 18L150 43L170 18L160 68H140Z" fill="#fff" stroke="'+b+'" stroke-width="3"/><path d="M111 106H189" stroke="'+b+'" stroke-width="2"/>'+line(150,68,150,342),
 slim:'<path '+common+' d="M105 38L134 24L150 45L166 24L195 38L216 101L190 113L181 84L178 340L122 340L119 84L110 113L84 101Z"/><path d="M134 24L150 45L166 24L159 70L141 70Z" fill="#fff" stroke="'+b+'" stroke-width="3"/>'+line(150,70,150,340),
 gloss:'<path '+common+' d="M77 70L122 34L150 61L178 34L223 70L247 126L210 145L194 106L191 332L109 332L106 106L90 145L53 126Z"/><path d="M122 34L150 61L178 34L165 91L135 91Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M115 115L185 285M125 100L195 270" stroke="#fff8" stroke-width="9" opacity=".45"/>',
 orange:'<path '+common+' d="M84 72L126 36L150 63L174 36L216 72L241 126L207 143L193 106L190 330L110 330L107 106L93 143L59 126Z"/><path d="M126 36L150 63L174 36L162 92L138 92Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M108 180L192 180M108 220L192 220" stroke="'+b+'" stroke-width="5"/>',
 basic:'<path '+common+' d="M94 58L129 31L150 52L171 31L206 58L230 116L201 133L190 99L190 337L110 337L110 99L99 133L70 116Z"/><path d="M129 31L150 52L171 31L162 78H138Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/>'+line(150,78,150,337),
 denim:'<path '+common+' d="M73 70L120 30L150 58L180 30L227 70L255 139L217 155L198 108L198 345L102 345L102 108L83 155L45 139Z"/><path d="M120 30L150 58L180 30L169 90L131 90Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M111 132H145V190H111ZM155 132H189V190H155Z" fill="none" stroke="'+b+'" stroke-width="3"/>',
 yellowcheck:'<path '+common+' d="M85 65L126 34L150 58L174 34L215 65L239 123L205 140L193 105L190 333L110 333L107 105L95 140L61 123Z"/><path d="M126 34L150 58L174 34L162 88L138 88Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M112 120H188M112 150H188M112 180H188M112 210H188M112 240H188M112 270H188M125 105V310M150 105V310M175 105V310" stroke="'+b+'" stroke-width="2" opacity=".7"/>',
 maroon:'<path '+common+' d="M90 58L129 28L150 50L171 28L210 58L232 114L202 132L191 98L191 334L109 334L109 98L98 132L68 114Z"/><path d="M129 28L150 50L171 28V78H129Z" fill="'+b+'" stroke="'+b+'"/><path d="M120 105L180 105M120 145L180 145M120 185L180 185" stroke="#fff4" stroke-width="4"/>',
 olive:'<path '+common+' d="M76 70L121 38L150 64L179 38L224 70L245 126L211 145L194 108L191 335L109 335L106 108L89 145L55 126Z"/><path d="M121 38L150 64L179 38L166 92L134 92Z" fill="'+b+'" stroke="'+b+'" stroke-width="4"/><path d="M115 115L185 300" stroke="#fff4" stroke-width="6"/>'
 };
 return '<svg class="garmentSvg" viewBox="0 0 300 390" aria-hidden="true">'+(map[s]||map.basic)+'</svg>';
}
function openProductDetail(p){
 const v=visualFor(p),box=document.createElement("div");box.className="choiceModal";
 const cs=p.colors||C.neutral;
 box.innerHTML='<div class="choiceSheet"><button class="modalClose" id="closeChoice" aria-label="Close">×</button><div class="choiceGrid"><div class="detailVisual" style="--bg1:'+cs[0]+';--bg2:'+cs[1]+'">'+productArtwork(p,cs[0],cs[3])+'</div><div><div class="shopEyebrow">NØPE quick look</div><div class="detailTitle">'+p.name+'</div><div style="font-size:18px;font-weight:900">₹'+p.price+'</div><div class="detailCopy">Explore it. Change it. NØPE notices.</div><div class="choiceLabel">Colour · '+cs.length+' options</div><div class="colorChoices">'+cs.map((c,j)=>'<button class="swatch '+(j===0?"active":"")+'" style="background:'+c+'" data-var="colour" data-color-index="'+j+'"></button>').join("")+'</div><div class="choiceLabel">Feel</div><div class="sizeChoices"><button class="sizeChoice active" data-fit="relaxed">Relaxed</button><button class="sizeChoice" data-fit="regular">Regular</button><button class="sizeChoice" data-fit="fitted">Fitted</button></div><div class="choiceLabel">Size</div><div class="sizeChoices"><button class="sizeChoice" data-size="S">S</button><button class="sizeChoice active" data-size="M">M</button><button class="sizeChoice" data-size="L">L</button><button class="sizeChoice" data-size="XL">XL</button></div><div class="modalFoot"><button class="quickBtn primary" id="addChoice">Add to bag</button></div></div></div></div>';
 document.body.appendChild(box);
 const close=()=>{recordBehaviorSignal("detail exit",p.name,"User closed the product detail view","detail_exit","low");box.remove()};
 box.querySelector("#closeChoice").onclick=close;
 box.addEventListener("click",e=>{if(e.target===box)close()});
 box.querySelector("#addChoice").onclick=()=>{addToCart(p);learnTaste(p,2.2,"detail add");recordBehaviorSignal("product detail preference",p.name,"User configured a product and kept exploring it","customize","medium");box.remove()};
 box.querySelectorAll("[data-var]").forEach(b=>b.onclick=()=>{box.querySelectorAll("[data-var]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const idx=Number(b.dataset.colorIndex),c=cs[idx],dv=box.querySelector(".detailVisual"),oldSvg=dv.querySelector(".garmentSvg"),temp=document.createElement("div");dv.style.setProperty("--bg1",c);dv.style.setProperty("--bg2",cs[(idx+1)%cs.length]);temp.innerHTML=productArtwork(p,c,cs[(idx+3)%cs.length]);oldSvg.replaceWith(temp.firstChild);recordBehaviorSignal("colour interest",p.name,"User explored colour "+(idx+1)+" of "+cs.length,"variation","low");learnTaste(p,.5,"variation")});
 box.querySelectorAll("[data-fit]").forEach(b=>b.onclick=()=>{box.querySelectorAll("[data-fit]").forEach(x=>x.classList.remove("active"));b.classList.add("active");recordBehaviorSignal("fit interest",b.dataset.fit,"User explored a fit variation","variation","low");learnTaste(p,.45,"fit")});
 box.querySelectorAll("[data-size]").forEach(b=>b.onclick=()=>{box.querySelectorAll("[data-size]").forEach(x=>x.classList.remove("active"));b.classList.add("active");recordBehaviorSignal("size interest",b.dataset.size,"User selected a size while exploring","variation","low");learnTaste(p,.25,"size")});
}
function productCard(p,i){
 const v=visualFor(p),badge=i===0?"NØPE is testing this":"",cs=p.colors||C.neutral,saved=savedProducts.has(p.id);
 const sw=cs.map((c,j)=>'<button class="swatch '+(j===0?"active":"")+'" style="background:'+c+'" data-colour="'+i+'" data-color-index="'+j+'" aria-label="Colour '+(j+1)+'"></button>').join("");
 return '<div class="shopProduct" data-product="'+p.id+'"><div class="visualProduct" style="--bg1:'+v.bg1+';--bg2:'+v.bg2+'" data-visual="'+i+'">'+productArtwork(p,cs[0],cs[3])+'<span class="productBadge">'+badge+'</span><button class="heartBtn '+(saved?"saved":"")+'" data-save="'+i+'" aria-label="'+(saved?"Unfavourite":"Favourite")+'">'+(saved?"♥":"♡")+'</button><span class="productShadow"></span></div><div class="swatches">'+sw+'</div><div class="productMetaRow"><button class="productName productOpen" data-detail="'+i+'">'+p.name+'</button><span class="productPrice">₹'+p.price+'</span></div><div class="cardActions"><button class="quickBtn" data-detail="'+i+'">Explore</button><button class="quickBtn primary" data-match="'+i+'">Add</button></div><button class="nopeReject" data-reject="'+i+'" aria-label="Skip">Skip this</button></div>';
}
function adaptShop(items){
 const ranked=[...items].sort((a,b)=>productScore(b,0)-productScore(a,0));
 renderShopCore(ranked);
}
function renderShopCore(items){
 const root=$("shopProducts");root.innerHTML=items.map(productCard).join("");
 renderTasteLab(items);
 root.querySelectorAll("[data-match]").forEach((b,i)=>b.onclick=()=>{const p=items[i];recordBehaviorSignal("add intent",p.name,"User chose to move this product toward purchase","add_click","medium");learnTaste(p,2,"add to bag");addToCart(p,b);});
 root.querySelectorAll("[data-detail]").forEach((b,i)=>b.onclick=()=>{const p=items[i];registerPositiveEvidence(p,"quick_look");recordBehaviorSignal("quick look",p.name,"User asked for a closer product view","quick_look","low");learnTaste(p,.7,"quick look");openProductDetail(p)});
 root.querySelectorAll("[data-save]").forEach((b,i)=>b.onclick=async e=>{e.preventDefault();e.stopPropagation();const p=items[i];if(!p)return;const isSaved=savedProducts.has(p.id);if(isSaved){savedProducts.delete(p.id);b.textContent="♡";b.classList.remove("saved");b.setAttribute("aria-label","Favourite");persistSavedProducts();await mcp("remove_preference",{user_id:"demo-user",preference:"save affinity",value:p.name,session_id:sessionId()});recordBehaviorSignal("unsave action",p.name,"User unfavourited this product","unsave_click","low");setStatus(p.name+" removed from favourites.","ok");await refreshSessionView();}else{savedProducts.add(p.id);b.textContent="♥";b.classList.add("saved");b.setAttribute("aria-label","Unfavourite");persistSavedProducts();registerPositiveEvidence(p,"favourite");await recordSignal("save affinity",p.name,"User saved this product","ui","save","medium");learnTaste(p,1.4,"save");setStatus(p.name+" saved to favourites.","ok")}});
 root.querySelectorAll("[data-colour]").forEach(b=>b.onclick=()=>{const p=items[Number(b.dataset.colour)],card=b.closest(".shopProduct"),visual=card?.querySelector(".visualProduct"),idx=Number(b.dataset.colorIndex),c=p.colors?.[idx]||b.style.background;card?.querySelectorAll("[data-colour]").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(visual){visual.style.setProperty("--cloth1",c);visual.style.setProperty("--cloth2",p.colors?.[(idx+1)%p.colors.length]||c);const svg=visual.querySelector(".garmentSvg");if(svg){const temp=document.createElement("div");temp.innerHTML=productArtwork(p,c,p.colors?.[(idx+3)%p.colors.length]||c);svg.replaceWith(temp.firstChild)}}recordBehaviorSignal("colour exploration",p.name,"User explored colour "+(idx+1)+" of "+(p.colors?.length||6),"variation","low");learnTaste(p,.45,"colour")});
 installRecommendationActions(items);installBehavioralLearning(items);
}
function renderShop(filter){
 let items=SHOP_PRODUCTS;
 if(!filter||filter==="all"){
   const demoMix=["vshirt-linen-sand","vtee-essential-white","oshirt-oxford-navy","otee-heavy-white","vshirt-boxy-olive","vtee-modal-black","oshirt-linen-ivory","otee-pigment-olive"];
   const lead=demoMix.map(id=>SHOP_PRODUCTS.find(p=>p.id===id)).filter(Boolean);
   items=[...lead,...SHOP_PRODUCTS.filter(p=>!lead.some(x=>x.id===p.id))];
 }else{
   items=items.filter(p=>filter==="shirts"||p.meta.toLowerCase().includes(filter==="wedding"?"wedding":"casual"));
 }
 if(!demoBaseline.length)demoBaseline=items.slice(0,8).map(p=>p.name);
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
function deliveryStatus(text,kind=""){const el=document.getElementById("deliveryStatus");if(el){el.textContent=text;el.className="deliveryStatus "+kind}}
function deliveryProduct(){return cart[0]||SHOP_PRODUCTS.find(p=>savedProducts.has(p.id))||currentVisibleProducts()[0]||SHOP_PRODUCTS[0]}
function installDeliveryLab(){
  const check=document.getElementById("deliveryCheck"),create=document.getElementById("deliveryCreate"),track=document.getElementById("deliveryTrack"),pin=document.getElementById("deliveryPin");
  if(!check||check.dataset.ready)return;check.dataset.ready="1";
  check.onclick=async()=>{const p=pin?.value?.trim()||"122001";stage("NØPE checking delivery","NØPE asked the Delhivery mock whether pincode "+p+" can be served.","nAgent");deliveryStatus("Checking "+p+"…");try{const r=await mcp("delhivery_check_serviceability",{pincode:p,payment_mode:"Prepaid"});const pc=r.delivery_codes?.[0]?.postal_code;if(pc?.pre_paid==="Y"){deliveryStatus("✓ Serviceable · Prepaid delivery available for "+p,"good");stage("Delhivery replied","Pincode "+p+" is serviceable in the mock rail.","nCatalog")}else{deliveryStatus("Not serviceable in this mock · "+(pc?.remarks||"Delivery unavailable"),"bad");stage("Delhivery replied","The mock rail returned a delivery constraint for "+p+".","nCatalog")}}catch(e){deliveryStatus("Could not check delivery: "+e.message,"bad")}};
  create.onclick=async()=>{const p=deliveryProduct();const pincode=pin?.value?.trim()||"122001";stage("NØPE preparing delivery","Using the product you most recently showed interest in: "+p.name+".","nAgent");deliveryStatus("Creating mock Delhivery shipment…");try{const order="NOPE-DEMO-"+Date.now();const r=await mcp("delhivery_create_shipment",{format:"json",test_mode:"success",shipments:[{order,user_id:"demo-user",payment_mode:"Prepaid",name:"Demo User",add:"Demo Address",city:"Gurugram",state:"Haryana",pin:pincode,phone:"9999999999",products:[{product_name:p.name,quantity:1,price:p.price}],total_amount:p.price}]});const wb=r.waybill||r.packages?.[0]?.waybill;if(!wb)throw Error("No AWB returned");sessionStorage.setItem("nope_demo_waybill",wb);deliveryStatus("✓ Shipment manifested · AWB "+wb,"good");stage("Delhivery shipment created","NØPE handed "+p.name+" to the mock delivery rail · AWB "+wb,"nCatalog");recordBehaviorSignal("delivery intent","mock shipment for "+p.name,"User tested the NØPE → Delhivery delivery flow","delivery_test","low")}catch(e){deliveryStatus("Shipment failed: "+e.message,"bad");setStatus("Delhivery error: "+e.message,"err")}};
  track.onclick=async()=>{let wb=sessionStorage.getItem("nope_demo_waybill")||"";stage("NØPE tracking delivery","NØPE is asking the Delhivery mock for the latest shipment status.","nAgent");deliveryStatus("Tracking…");try{const r=await mcp("delhivery_track_latest_shipment",{});const s=r.ShipmentData?.[0]?.Shipment?.[0];const actual=s?.AWB||wb||"latest";const status=s?.Status?.Status||"In Transit";if(actual&&!wb)sessionStorage.setItem("nope_demo_waybill",actual);deliveryStatus("✓ "+status+" · AWB "+actual,"good");stage("Delhivery tracking returned","Shipment "+actual+" is currently "+status+".","nCatalog")}catch(e){deliveryStatus("Tracking failed: "+e.message,"bad")}};
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
 const q=transcript.toLowerCase(), bm=q.match(/(?:₹|rs\.?|rupees?\s*)([0-9,]+)/i), budget=bm?Number(bm[1].replace(/,/g,"")):null;
 const category=/shirt|clothing|top/.test(q)?"clothing":"shirt", occasion=/wedding|shaadi|marriage/.test(q)?"wedding":null;
 const neck=/v[- ]?neck|v neck/.test(q)?"v":(/o[- ]?neck|round[- ]?neck|crew[- ]?neck/.test(q)?"o":null);
 const avoid=[/shiny|chamak|silk/.test(q)?"shiny":null,/formal|uncle/.test(q)?"formal":null].filter(Boolean).join(",");
 const style=/relaxed|casual|chill|youthful|stylish/.test(q)?"classy relaxed":(/classy/.test(q)?"classy":null);
 stage("Reading preference memory","Retrieving learned likes, dislikes and rejection signals.","nMemory");
 const prefs=await mcp("get_preferences",{user_id:"demo-user",session_id:sessionId()});
 proofStep("backend","Backend fetched "+(prefs.count||prefs.preferences?.length||0)+" stored preference signal(s) from Postgres");
 $("memoryText").textContent=(prefs.preferences||[]).slice(0,4).map(p=>(p.preference||"signal")+": "+(p.value||"")).join(" · ")||"No stored preference signal yet.";
 stage("Searching product catalogue","Filtering the mock catalogue against the current intent.","nCatalog");
 const found=await mcp("search_products",{category,max_price:budget,occasion,style,avoid,neck}), products=found.results||[];
 $("catalogue").innerHTML=products.slice(0,4).map(p=>'<div class="product"><div class="pname">'+p.name+'</div><div class="price">₹'+p.price+'</div><span class="tag">'+(p.category||"shirt")+" · returned</span></div>").join("")||'<div class="product"><div class="pname">No matching products</div></div>';
 let ranked=products;
 if(products.length){const rr=await mcp("rank_products",{products,preferences:prefs.preferences||[],intent:transcript});ranked=rr.results||products}
 if(ranked.length){renderShopMatches(ranked);proofStep("update","UI re-ranked "+ranked.length+" products using the fetched memory");}
 const picks=ranked.slice(0,3);
 updateIntelligence(transcript,found,picks);
 transcriptEl.textContent=transcript;
  stage("NØPE decision ready",currentInputSource==="voice"?"Gnani was used only to turn your voice into text. NØPE immediately updated the shortlist from that input.":"NØPE used your typed input and immediately updated the shortlist.","nAgent");
  hint.textContent=currentInputSource==="voice"?"Voice understood — NØPE updated the products":"NØPE updated the products from your message";setStatus(currentInputSource==="voice"?"✓ Voice input understood · products updated":"✓ Message understood · products updated","ok");
}
async function processTranscript(text,source="text"){transcript=String(text||"").trim();currentInputSource=source;if(!transcript){setStatus("I didn't catch that. Please try again.","err");return}proofStep("ui","Intent received from "+source+" · extracting signals");await captureIntentSignals(transcript,source);transcriptEl.textContent=transcript;hint.textContent="NØPE is thinking…";setStatus("✓ Voice/text received","ok");try{await runNopeVoice()}catch(e){console.error(e);setStatus("NØPE error: "+e.message,"err");hint.textContent="Try again or use the text box."}}
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
const agenticOpen=document.getElementById("agenticOpen");if(agenticOpen)agenticOpen.onclick=()=>{window.open("https://agenticorg.hackathon.pinelabs.com/dashboard/agents","_blank");setStatus("✓ AgenticOrg opened.","ok")};
// Legacy speak-back handler removed: NØPE is listen-only.
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
updatePositiveEvidenceUI();
installDeliveryLab();
refreshSessionView();
startMicroNudges();
stage("NØPE is learning","Catalogue opened. Watching which shapes, colours and products earn attention.","nAgent");
if(!sessionStorage.getItem("nope_open_signal")){sessionStorage.setItem("nope_open_signal","1");recordBehaviorSignal("browse start","fashion catalogue","User opened the NØPE shopping experience","page_open","low");setTimeout(()=>{SHOP_PRODUCTS.slice(0,8).forEach(p=>recordBehaviorSignal("initial exposure",p.name,"Product was presented in the first shopping view","impression","low"))},650);}
installGuidedDemo();
if(!navigator.mediaDevices?.getUserMedia)hint.textContent="Mic unavailable — use the text box below.";
else hint.textContent="Click 🎙️ → Allow microphone → speak → click again to send";
window.addEventListener("error",e=>{console.error(e.error||e.message);setStatus("Page error: "+e.message,"err")});
console.log("NØPE listen-only frontend initialized");
})();