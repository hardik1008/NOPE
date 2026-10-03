(() => {
"use strict";
const $=id=>document.getElementById(id);
const API="/api/mcp";
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
function addToCart(p,button){if(!cart.some(x=>x.id===p.id)){cart.push(p);if(button){button.textContent="✓ Added";button.classList.add("added")}$("cartCount").textContent=cart.length;setStatus(p.name+" added to your bag.","ok")}}
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
 root.innerHTML=items.slice(0,4).map((p,i)=>{const tone=tones[i%tones.length];const score=Math.round(p.score||94-i*3);const local=SHOP_PRODUCTS.find(x=>x.name===p.name)||SHOP_PRODUCTS.find(x=>x.name.toLowerCase().includes(String(p.name||"").toLowerCase().split(" ")[0]));const brand=(local?.meta||"").split("·")[0].trim()||brands[i%brands.length];const reason=i===0?"Strong fit for your current brief":i===1?"Matches your style + budget":"Fits the brief with fewer trade-offs";return '<div class="shopProduct"><div class="photo" style="--shirt:'+tone+'"><span class="tone"></span></div><div class="shopMeta" style="margin-top:10px;font-weight:800">'+brand+'</div><h3>'+p.name+'</h3><div class="shopPrice">₹'+p.price+'</div><div class="matchBadge">✦ '+score+'% NØPE match</div><div class="reason">'+reason+'</div><button class="shopBtn" data-match="'+i+'">Add to bag</button></div>'}).join("");
 root.querySelectorAll("[data-match]").forEach((b,i)=>{b.onclick=()=>{const p=SHOP_PRODUCTS.find(x=>x.name===items[i]?.name)||items[i];addToCart(p,b)}});
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
 const prefs=await mcp("get_preferences",{user_id:"demo-user"});
 $("memoryText").textContent=(prefs.preferences||[]).slice(0,4).map(p=>(p.preference||"signal")+": "+(p.value||"")).join(" · ")||"No stored preference signal yet.";
 stage("Searching product catalogue","Filtering the mock catalogue against the current intent.","nCatalog");
 const found=await mcp("search_products",{category,max_price:budget,occasion,style,avoid}), products=found.results||[];
 $("catalogue").innerHTML=products.slice(0,4).map(p=>'<div class="product"><div class="pname">'+p.name+'</div><div class="price">₹'+p.price+'</div><span class="tag">'+(p.category||"shirt")+" · returned</span></div>").join("")||'<div class="product"><div class="pname">No matching products</div></div>';
 let ranked=products;
 if(products.length){const rr=await mcp("rank_products",{products,preferences:prefs.preferences||[],intent:transcript});ranked=rr.results||products}
 if(ranked.length)renderShopMatches(ranked);
 const picks=ranked.slice(0,3);
 const reply=picks.length?"Yay! Maine aapke liye "+picks.length+" lovely options choose kiye hain. "+picks.map((p,i)=>(i+1)+". "+p.name+" — rupees "+p.price).join(". ")+" . Ye aapki current style aur budget ke saath achchhe se match karte hain. Agar kuch pasand na aaye, bas mujhe bata dena — main softly adjust karke aur options dhoondhungi.":"Hmm, abhi exact match nahi mila. Koi baat nahi — aap budget ya style mein jo change karna chahte hain, bas bata dijiye. Main phir se pyaar se search karungi.";
 transcriptEl.textContent=transcript;stage("Generating NØPE voice response","Sending the final decision to Gnani TTS.","nTts");
 const t=await mcp("gnani_text_to_speech",{text:reply,language:"hi-en",voice:"Nalini",speed:1.05});
 if(!t.success)throw Error(t.error||"TTS failed");
 const bin=atob(t.audio_base64||""),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
 if(audio._objectUrl)URL.revokeObjectURL(audio._objectUrl);audio._objectUrl=URL.createObjectURL(new Blob([arr],{type:t.audio_content_type||"audio/wav"}));audio.src=audio._objectUrl;audio.hidden=false;audio.load();
 try{await audio.play()}catch(e){console.warn("Autoplay blocked; audio controls remain available.",e)}
 hint.textContent="NØPE replied — click 🎙️ to speak again";setStatus("✓ Full voice loop complete","ok");
}
async function processTranscript(text){transcript=String(text||"").trim();if(!transcript){setStatus("I didn't catch that. Please try again.","err");return}transcriptEl.textContent=transcript;hint.textContent="NØPE is thinking…";setStatus("✓ Voice/text received","ok");try{await runNopeVoice()}catch(e){console.error(e);setStatus("NØPE error: "+e.message,"err");hint.textContent="Try again or use the text box."}}
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
   await processTranscript(typeof r.transcript==="string"?r.transcript:JSON.stringify(r.transcript));
  }catch(e){console.error(e);hint.textContent="Voice failed — type below if needed";setStatus("Voice error: "+e.message,"err")}
 };
 recorder.start(250);
}
mic.addEventListener("click",async e=>{
 e.preventDefault();
 try{if(!recording)await start();else{setStatus("Stopping recording…","ok");recording=false;recorder.stop()}}
 catch(e){recording=false;mic.classList.remove("recording");mic.textContent="🎙";console.error(e);setStatus("Microphone error: "+e.name+" — "+e.message,"err");hint.textContent="Click again after allowing microphone access."}
});
$("sendText").onclick=()=>processTranscript($("textInput").value);
$("textInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("sendText").click()});
document.querySelectorAll(".chip[data-cat]").forEach(c=>c.onclick=()=>{document.querySelectorAll(".chip[data-cat]").forEach(x=>x.classList.remove("active"));c.classList.add("active");renderShop(c.dataset.cat)});
$("surprise").onclick=()=>processTranscript("Find me a classy relaxed shirt under ₹3000");
$("copy").onclick=async()=>{if(!transcript)return setStatus("Nothing to copy yet.","err");try{await navigator.clipboard.writeText(transcript);setStatus("✓ Transcript copied.","ok")}catch(e){setStatus("Clipboard blocked — select the transcript manually.","err")}};
$("open").onclick=()=>{window.open("https://agenticorg.hackathon.pinelabs.com/dashboard/agents","_blank");setStatus("✓ AgenticOrg opened.","ok")};
$("speak").onclick=async()=>{if(!transcript)return setStatus("Speak or type first.","err");try{setStatus("Generating Gnani TTS…");const r=await mcp("gnani_text_to_speech",{text:transcript,language:"hi-IN",voice:"Nalini",speed:1.05});if(!r.success)throw Error(r.error||"TTS failed");audio.src=r.audio_url;audio.hidden=false;await audio.play();setStatus("✓ Gnani TTS worked","ok")}catch(e){setStatus("TTS error: "+e.message,"err")}};
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
if(!navigator.mediaDevices?.getUserMedia)hint.textContent="Mic unavailable — use the text box below.";
else hint.textContent="Click 🎙️ → Allow microphone → speak → click again to send";
window.addEventListener("error",e=>{console.error(e.error||e.message);setStatus("Page error: "+e.message,"err")});
console.log("NØPE v33 frontend initialized");
})();