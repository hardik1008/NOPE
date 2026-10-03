import { db, storage } from "hatchable";

export const access = "public";

const tools = [
  {
    name: "gnani_speech_to_text",
    description: "Convert base64 audio to text using Gnani STT. Supports Hindi, English and Hinglish.",
    inputSchema: {
      type: "object",
      properties: {
        audio_base64: { type: "string" },
        language_code: { type: "string", default: "hi-IN" },
        format: { type: "string", enum: ["transcribe","verbatim","formatted"], default: "transcribe" }, preferred_language: { type: "string", default: "hi-IN" }
      },
      required: ["audio_base64"]
    }
  },
  {
    name: "gnani_text_to_speech",
    description: "Convert text to speech using Gnani TTS and return a public audio URL.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        language: { type: "string", default: "hi-en" },
        voice: { type: "string", default: "Yashvi" },
        speed: { type: "number", default: 1 }
      },
      required: ["text"]
    }
  },
  {
    name: "create_order",
    description: "Create a mock Pine Labs order. Supports test_mode values: balance_low, timeout, malformed.",
    inputSchema: {
      type: "object",
      properties: {
        amount: { type: "number", description: "Order amount in INR" },
        currency: { type: "string", default: "INR" },
        product_id: { type: "string" },
        test_mode: { type: "string", enum: ["success", "balance_low", "timeout", "malformed"] }
      },
      required: ["amount", "product_id"]
    }
  },
  {
    name: "check_order_status",
    description: "Check the status of a mock Pine Labs order.",
    inputSchema: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"]
    }
  },
  {
    name: "search_products",
    description: "Search the NØPE mock fashion catalogue using budget, category, occasion, style and negative preferences.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Product category such as shirt or clothing" },
        max_price: { type: ["number", "null"], description: "Maximum price in INR. Use null when the user did not specify a budget." },
        occasion: { type: ["string", "null"], description: "Occasion such as wedding; use null when not specified." },
        style: { type: ["string", "null"], description: "Desired style such as classy, relaxed, smart-casual; use null when not specified." },
        avoid: { type: ["string", "null"], description: "Things to avoid such as shiny or formal; use null when not specified." }
      },
      required: ["category"]
    }
  },
  {
    name: "record_preference",
    description: "Store a user's preference or rejection reason so NØPE can use it in future recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        preference: { type: "string" },
        value: { type: "string" },
        reason: { type: "string" },
        confidence: { type: "string", enum: ["low","medium","high"] }
      },
      required: ["user_id","preference","value"]
    }
  },
  {
    name: "get_preferences",
    description: "Retrieve a user's learned preferences and rejection signals.",
    inputSchema: {
      type: "object",
      properties: { user_id: { type: "string" } },
      required: ["user_id"]
    }
  },
  {
    name: "rank_products",
    description: "Rank returned NØPE products against current intent and preference memory. Only rank products supplied by the caller; never invent catalogue items.",
    inputSchema: {
      type: "object",
      properties: {
        products: { type: "array" },
        preferences: { type: "array" },
        intent: { type: "string" }
      },
      required: ["products"]
    }
  },
  {
    name: "confirm_purchase",
    description: "Confirm an order only after the user has explicitly approved the purchase. Use approval=true only when the user clearly said yes/buy/purchase/checkout.",
    inputSchema: {
      type: "object",
      properties: {
        order_id: { type: "string" },
        approval: { type: "boolean" }
      },
      required: ["order_id","approval"]
    }
  },
  {
    name: "get_order_timeline",
    description: "Return the order state and chronological NØPE audit events for transparency and debugging.",
    inputSchema: {
      type: "object",
      properties: { order_id: { type: "string" } },
      required: ["order_id"]
    }
  },
  {
    name: "delhivery_check_serviceability",
    description: "Mock Delhivery pincode serviceability check. Returns Delhivery-style delivery_codes.",
    inputSchema: {
      type: "object",
      properties: {
        pincode: { type: "string", description: "6 digit destination pincode" },
        payment_mode: { type: "string", enum: ["Prepaid", "COD"], default: "Prepaid" }
      },
      required: ["pincode"]
    }
  },
  {
    name: "delhivery_create_shipment",
    description: "Mock Delhivery B2C shipment creation. Supports success, no_rider, timeout and malformed test modes.",
    inputSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["json"], default: "json" },
        shipments: { type: "array", description: "Delhivery shipment objects" },
        test_mode: { type: "string", enum: ["success", "no_rider", "timeout", "malformed"], default: "success" }
      },
      required: ["shipments"]
    }
  },
  {
    name: "delhivery_track_latest_shipment",
    description: "Track the most recently created successful NØPE Delhivery shipment. This tool requires NO arguments. ALWAYS call this tool directly when the user asks to track the shipment just created. NEVER ask the user for a waybill number.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

function jsonRpc(id, result) {
  return { jsonrpc: "2.0", id, result };
}

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, MCP-Protocol-Version, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method === "GET") {
    return res.json({
      name: "NØPE Pine Labs Mock MCP",
      version: "1.0.0",
      protocol: "2025-06-18",
      status: "ok"
    });
  }

  const body = req.body || {};
  const id = body.id ?? null;
  const method = body.method;

  if (method === "initialize") {
    return res.json(jsonRpc(id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "nope-pine-labs-mock", version: "1.0.0" }
    }));
  }

  if (method === "notifications/initialized") {
    return res.status(202).send("");
  }

  if (method === "tools/list") {
    return res.json(jsonRpc(id, { tools }));
  }

  if (method === "tools/call") {
    const name = body.params?.name;
    const args = body.params?.arguments || {};

    if (name === "gnani_speech_to_text") {
      const key = process.env.GNANI_API_KEY;
      if (!key) return res.json(jsonRpc(id, { content:[{type:"text",text:JSON.stringify({success:false,error:"GNANI_API_KEY_NOT_CONFIGURED"})}], isError:true }));
      const raw = String(args.audio_base64 || "");
      if (!raw) return res.json(errorRpc(id, -32602, "audio_base64 is required"));
      const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0));
      const boundary = "----NOPEGnani" + crypto.randomUUID().replace(/-/g, "");
      const enc = new TextEncoder();
      const part = (name, value) =>
        enc.encode("--" + boundary + "\r\n" +
          "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n" +
          value + "\r\n");
      const fileHead = enc.encode("--" + boundary + "\r\n" +
        "Content-Disposition: form-data; name=\"audio_file\"; filename=\"audio.wav\"\r\n" +
        "Content-Type: audio/wav\r\n\r\n");
      const fileTail = enc.encode("\r\n--" + boundary + "--\r\n");
      const languagePart = part("language_code", String(args.language_code || "hi-IN"));
      const formatPart = part("format", String(args.format || "transcribe"));
      const preferredLanguagePart = part("preferred_language", String(args.preferred_language || args.language_code || "hi-IN"));
      const body = new Uint8Array(languagePart.length + preferredLanguagePart.length + formatPart.length + fileHead.length + bytes.length + fileTail.length);
      let pos = 0;
      for (const chunk of [languagePart, preferredLanguagePart, formatPart, fileHead, bytes, fileTail]) {
        body.set(chunk, pos); pos += chunk.length;
      }
      let upstream;
      let sttError = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          upstream = await fetch("https://api.vachana.ai/stt/v3", {
            method:"POST",
            headers:{"X-API-Key-ID":key, "Content-Type":"multipart/form-data; boundary=" + boundary},
            body
          });
          if (upstream.status !== 504) break;
        } catch (e) { sttError = e; }
        await new Promise(r => setTimeout(r, 700));
      }
      if (!upstream) return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({success:false,error:"GNANI_STT_UNAVAILABLE",message:"Gnani speech service is temporarily unavailable. Please try again."})}],isError:true}));
      const rawText = await upstream.text();
      let data;
      try { data = JSON.parse(rawText); } catch { data = {raw:rawText}; }
      return res.json(jsonRpc(id, {
        content:[{type:"text",text:JSON.stringify({
          success:upstream.ok,
          status_code:upstream.status,
          transcript:data.transcript ?? data.text ?? data,
          request_id:data.request_id ?? null
        })}],
        isError:!upstream.ok
      }));
    }

    if (name === "gnani_text_to_speech") {
      const key = process.env.GNANI_API_KEY;
      if (!key) return res.json(jsonRpc(id, { content:[{type:"text",text:JSON.stringify({success:false,error:"GNANI_API_KEY_NOT_CONFIGURED"})}], isError:true }));
      const textValue = String(args.text || "");
      if (!textValue) return res.json(errorRpc(id, -32602, "text is required"));
      const upstream = await fetch("https://api.vachana.ai/api/v1/tts/inference", {
        method:"POST",
        headers:{"Content-Type":"application/json","X-API-Key-ID":key},
        body:JSON.stringify({
          model:"timbre-v2.5",
          text:textValue,
          voice:String(args.voice || "Yashvi"),
          language:String(args.language || "hi-IN"),
          speed:Number(args.speed || 1),
          sample_rate:16000,
          encoding:"linear_pcm",
          container:"wav",
          num_channels:1
        })
      });
      const upstreamContentType = upstream.headers.get("content-type") || ""; const contentType = upstreamContentType.toLowerCase().includes("audio/") ? upstreamContentType : "audio/wav"; const audioFormat = String(args.output_format || "wav");
      if (!upstream.ok) {
        const err = await upstream.text();
        return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({success:false,status_code:upstream.status,error:err.slice(0,1000)})}],isError:true}));
      }
      let buffer = new Uint8Array(await upstream.arrayBuffer());
      const isWav = buffer.length >= 12 && buffer[0]===82 && buffer[1]===73 && buffer[2]===70 && buffer[3]===70 && buffer[8]===87 && buffer[9]===65 && buffer[10]===86 && buffer[11]===69;
      if (!isWav) {
        const pcm = buffer; const sampleRate=16000, channels=1, bits=16; const wav=new Uint8Array(44+pcm.length); const dv=new DataView(wav.buffer); const ws=(o,s)=>{for(let i=0;i<s.length;i++)dv.setUint8(o+i,s.charCodeAt(i))}; ws(0,"RIFF"); dv.setUint32(4,36+pcm.length,true); ws(8,"WAVE"); ws(12,"fmt "); dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,channels,true); dv.setUint32(24,sampleRate,true); dv.setUint32(28,sampleRate*channels*bits/8,true); dv.setUint16(32,channels*bits/8,true); dv.setUint16(34,bits,true); ws(36,"data"); dv.setUint32(40,pcm.length,true); wav.set(pcm,44); buffer=wav;
      }
      const audioUrl = await storage.put("gnani/" + crypto.randomUUID() + ".wav", buffer, contentType);
      let binary = ""; for (let i = 0; i < buffer.length; i += 0x8000) binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
      const audio_base64 = btoa(binary);
      return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({success:true,audio_url:audioUrl,audio_base64,audio_content_type:contentType})}],isError:false}));
    }

    if (name === "create_order") {
      const mode = args.test_mode || "success";

      if (mode === "balance_low" || mode === "insufficient_balance") {
        return res.json(jsonRpc(id, {
          content: [{ type: "text", text: JSON.stringify({
            status: "BALANCE_TOO_LOW",
            message: "Merchant balance is insufficient to create the order."
          }) }],
          isError: true
        }));
      }

      if (mode === "timeout") {
        await new Promise(resolve => setTimeout(resolve, 11000));
        return res.json(jsonRpc(id, {
          content: [{ type: "text", text: JSON.stringify({
            status: "TIMEOUT",
            message: "Upstream payment service timed out."
          }) }],
          isError: true
        }));
      }

      if (mode === "malformed") {
        return res.json(jsonRpc(id, {
          content: [{ type: "text", text: "{malformed-response" }],
          isError: false
        }));
      }

      const orderId = "NOPE-" + Date.now();
      await db.query(
        "INSERT INTO nope_orders (order_id, user_id, product_id, amount, currency, state, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [orderId, String(args.user_id || "demo-user"), String(args.product_id), Number(args.amount), String(args.currency || "INR"), "APPROVED_PENDING_PAYMENT", "PENDING"]
      );
      await db.query(
        "INSERT INTO nope_events (user_id, event_type, order_id, payload) VALUES ($1, $2, $3, $4)",
        [String(args.user_id || "demo-user"), "ORDER_CREATED", orderId, JSON.stringify({product_id: args.product_id, amount: args.amount})]
      );
      return res.json(jsonRpc(id, {
        content: [{ type: "text", text: JSON.stringify({
          status: "SUCCESS",
          order_id: orderId,
          payment_status: "PENDING",
          amount: args.amount,
          currency: args.currency || "INR",
          product_id: args.product_id,
          message: "Order created successfully"
        }) }],
        isError: false
      }));
    }

    if (name === "rank_products") {
      const products = Array.isArray(args.products) ? args.products : [];
      const prefs = Array.isArray(args.preferences) ? args.preferences : [];
      const textBlob = JSON.stringify(prefs).toLowerCase() + " " + String(args.intent || "").toLowerCase();
      const ranked = products.map(p => {
        let score = 50;
        const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
        const hay = JSON.stringify(p).toLowerCase();
        if (textBlob.includes("relaxed") && (tags.includes("relaxed") || hay.includes("relaxed"))) score += 15;
        if (textBlob.includes("classy") && (tags.includes("classy") || hay.includes("classy"))) score += 10;
        if (textBlob.includes("youthful") && (tags.includes("youthful") || hay.includes("youthful"))) score += 10;
        if (textBlob.includes("formal") && (tags.includes("formal") || hay.includes("formal"))) score -= 25;
        if (textBlob.includes("shiny") && (tags.includes("shiny") || hay.includes("shiny"))) score -= 30;
        return {...p, fit_score: Math.max(0, Math.min(100, score))};
      }).sort((a,b)=>b.fit_score-a.fit_score).slice(0,4);
      return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({results:ranked})}],isError:false}));
    }

    if (name === "confirm_purchase") {
      const orderId = String(args.order_id || "");
      if (args.approval !== true) {
        return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({success:false,error:"USER_APPROVAL_REQUIRED",message:"Purchase not confirmed because explicit user approval was not provided."})}],isError:true}));
      }
      const {rows} = await db.query("SELECT order_id, user_id, amount, currency, state FROM nope_orders WHERE order_id = $1",[orderId]);
      if (!rows[0]) return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({success:false,error:"ORDER_NOT_FOUND"})}],isError:true}));
      await db.query("UPDATE nope_orders SET state = $1, payment_status = $2, updated_at = now() WHERE order_id = $3",["PAID","PAID",orderId]);
      await db.query("INSERT INTO nope_events (user_id,event_type,order_id,payload) VALUES ($1,$2,$3,$4)",[rows[0].user_id,"PAYMENT_CONFIRMED",orderId,JSON.stringify({amount:rows[0].amount,currency:rows[0].currency})]);
      return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({success:true,order_id:orderId,status:"PAID",message:"Payment confirmed after explicit user approval."})}],isError:false}));
    }

    if (name === "get_order_timeline") {
      const orderId = String(args.order_id || "");
      const order = await db.query("SELECT order_id,user_id,product_id,amount,currency,state,payment_status,shipment_waybill,created_at,updated_at FROM nope_orders WHERE order_id = $1",[orderId]);
      const events = await db.query("SELECT event_type,payload,created_at FROM nope_events WHERE order_id = $1 ORDER BY created_at ASC",[orderId]);
      return res.json(jsonRpc(id,{content:[{type:"text",text:JSON.stringify({order:order.rows[0] || null,events:events.rows})}],isError:false}));
    }

    if (name === "search_products") {
      const catalogue = [
        { product_id:"SHIRT-001", name:"Linen Blend Resort Shirt", price:2499, category:"shirt", occasion:"wedding", style:"classy relaxed smart-casual youthful", tags:["matte","breathable","relaxed","youthful"] },
        { product_id:"SHIRT-002", name:"Satin Formal Evening Shirt", price:2899, category:"shirt", occasion:"wedding", style:"formal classy", tags:["shiny","slim","formal"] },
        { product_id:"SHIRT-003", name:"Textured Oxford Casual Shirt", price:2299, category:"shirt", occasion:"wedding", style:"classy relaxed smart-casual youthful", tags:["matte","textured","relaxed","youthful"] },
        { product_id:"SHIRT-004", name:"Premium Slim Tux Shirt", price:2999, category:"shirt", occasion:"wedding", style:"formal sharp", tags:["formal","slim","structured"] },
        { product_id:"SHIRT-005", name:"Cotton Cuban Collar Shirt", price:1999, category:"shirt", occasion:"wedding", style:"relaxed stylish smart-casual youthful", tags:["matte","relaxed","stylish","youthful"] },
        { product_id:"SHIRT-006", name:"Silk Finish Party Shirt", price:2699, category:"shirt", occasion:"party wedding", style:"stylish bold", tags:["shiny","party"] },
        { product_id:"SHIRT-007", name:"Relaxed Linen Shirt", price:2399, category:"shirt", occasion:"wedding travel", style:"relaxed classy", tags:["matte","linen","relaxed"] },
        { product_id:"SHIRT-008", name:"Structured Premium Dress Shirt", price:2599, category:"shirt", occasion:"wedding", style:"formal classy", tags:["formal","structured"] },
        { product_id:"SHIRT-009", name:"Camp Collar Resort Shirt", price:1899, category:"shirt", occasion:"wedding", style:"relaxed stylish youthful", tags:["matte","printed","relaxed","youthful"] }
      ];
      const category = String(args.category || "").toLowerCase();
      const maxPrice = args.max_price == null || args.max_price === "" ? Infinity : Number(args.max_price);
      const occasion = String(args.occasion || "").toLowerCase();
      const style = String(args.style || "").toLowerCase();
      const avoid = String(args.avoid || "").toLowerCase();
      const avoidWords = avoid.split(/[,\s]+/).filter(Boolean);
      const results = catalogue.filter(p => {
        if (category && category !== "all" && category !== "clothing" && p.category !== category) return false;
        if (p.price > maxPrice) return false;
        if (occasion && !p.occasion.includes(occasion) && !p.occasion.includes("wedding")) return false;
        if (style && !style.split(/[,\s]+/).filter(Boolean).some(w => p.style.includes(w))) return false;
        if (avoidWords.some(w => p.tags.some(t => t.includes(w)))) return false;
        return true;
      }).slice(0,8);
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          results,
          count: results.length,
          message: results.length ? "Products matched the supplied constraints." : "No products matched all supplied constraints."
        }) }],
        isError:false
      }));
    }

    if (name === "record_preference") {
      await db.query(
        "INSERT INTO nope_preferences (user_id, preference, value, reason, confidence) VALUES ($1, $2, $3, $4, $5)",
        [String(args.user_id), String(args.preference), String(args.value), args.reason ? String(args.reason) : null, args.confidence || "medium"]
      );
      await db.query(
        "INSERT INTO nope_events (user_id, event_type, payload) VALUES ($1, $2, $3)",
        [String(args.user_id), "PREFERENCE_LEARNED", JSON.stringify({preference:args.preference,value:args.value,reason:args.reason || null,confidence:args.confidence || "medium"})]
      );
      // For rejection-driven shopping flows, return a fresh shortlist together with the saved memory.
      // This makes the learning loop atomic and prevents the agent from stopping after saving feedback.
      const learned = `${args.preference || ""} ${args.value || ""}`.toLowerCase();
      const rejection = `${args.reason || ""}`.toLowerCase();
      const needsRelaxed = learned.includes("relaxed") || learned.includes("youthful") || learned.includes("stylish") || rejection.includes("formal");
      let next_options = [];
      if (needsRelaxed) {
        next_options = [
          { product_id:"SHIRT-001", name:"Linen Blend Resort Shirt", price:2499, reason:"Relaxed, youthful and wedding-appropriate without a formal look." },
          { product_id:"SHIRT-003", name:"Textured Oxford Casual Shirt", price:2299, reason:"Relaxed smart-casual texture with a youthful feel." },
          { product_id:"SHIRT-005", name:"Cotton Cuban Collar Shirt", price:1999, reason:"Relaxed, stylish and youthful while staying non-formal." },
          { product_id:"SHIRT-007", name:"Relaxed Linen Shirt", price:2399, reason:"Relaxed linen look suited to a wedding without formal structure." }
        ];
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({ status:"SAVED", message:"Preference learned and stored. Fresh alternatives are ready.", preference:args.preference, value:args.value, confidence:args.confidence || "medium", next_options }) }],
        isError:false
      }));
    }

    if (name === "get_preferences") {
      const { rows } = await db.query(
        "SELECT preference, value, reason, confidence, created_at FROM nope_preferences WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
        [String(args.user_id)]
      );
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({ preferences:rows, count:rows.length }) }],
        isError:false
      }));
    }

    if (name === "delhivery_check_serviceability") {
      const pin = String(args.pincode || "");
      const postal = {
        pin: Number(pin),
        pre_paid: args.payment_mode === "COD" ? "N" : "Y",
        cod: "Y",
        pickup: "Y",
        repl: "Y",
        remarks: ""
      };
      if (pin === "000000" || pin === "110008") {
        postal.pre_paid = "N";
        postal.cod = "N";
        postal.pickup = "N";
        postal.repl = "N";
        postal.remarks = "Embargo";
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          delivery_codes: [{ postal_code: postal }]
        }) }],
        isError:false
      }));
    }

    if (name === "delhivery_create_shipment") {
      const mode = args.test_mode || "success";
      if (mode === "no_rider") {
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text: JSON.stringify({
            success:false,
            error:"NO_RIDER_AVAILABLE",
            message:"No delivery rider is currently available for this pincode."
          }) }],
          isError:true
        }));
      }
      if (mode === "timeout") {
        await new Promise(r => setTimeout(r, 11000));
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text: JSON.stringify({
            success:false,
            error:"UPSTREAM_TIMEOUT",
            message:"Delhivery upstream timed out."
          }) }],
          isError:true
        }));
      }
      if (mode === "malformed") {
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text:"{broken-delhivery-response" }],
          isError:false
        }));
      }

      const shipments = Array.isArray(args.shipments) ? args.shipments : [];
      const s = shipments[0] || {};
      const waybill = "NOPEAWB" + Date.now();
      await db.query(
        "INSERT INTO nope_shipments (order_id, waybill, status) VALUES ($1, $2, $3)",
        [s.order || "", waybill, "Manifested"]
      );
      if (s.order) {
        await db.query("UPDATE nope_orders SET state = $1, shipment_waybill = $2, updated_at = now() WHERE order_id = $3",["SHIPMENT_CREATED",waybill,String(s.order)]);
        await db.query("INSERT INTO nope_events (user_id,event_type,order_id,payload) VALUES ($1,$2,$3,$4)",[String(s.user_id || "demo-user"),"SHIPMENT_CREATED",String(s.order),JSON.stringify({waybill})]);
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          success:true,
          packages:[{
            waybill,
            order:s.order || "",
            status:"Manifested",
            serviceable:true,
            payment_mode:s.payment_mode || "Prepaid"
          }],
          waybill,
          status:"Manifested",
          message:"Shipment manifested successfully. This waybill can be used for tracking."
        }) }],
        isError:false
      }));
    }

    if (name === "delhivery_track_shipment" || name === "delhivery_track_latest_shipment") {
      let waybill = args.waybill ? String(args.waybill) : "";
      if (!waybill) {
        const { rows } = await db.query("SELECT waybill FROM nope_shipments ORDER BY created_at DESC LIMIT 1");
        waybill = rows[0]?.waybill || "";
      }
      if (!waybill) {
        return res.json(jsonRpc(id, {
          content: [{ type:"text", text: JSON.stringify({ success:false, error:"NO_SHIPMENT_FOUND", message:"No successful shipment is available to track yet." }) }],
          isError:true
        }));
      }
      return res.json(jsonRpc(id, {
        content: [{ type:"text", text: JSON.stringify({
          ShipmentData:[{
            Shipment:[{
              AWB:waybill,
              Status:{
                Status:"In Transit",
                StatusType:"UD",
                StatusDateTime:new Date().toISOString()
              },
              Scans:[]
            }]
          }]
        }) }],
        isError:false
      }));
    }

    if (name === "check_order_status") {
      return res.json(jsonRpc(id, {
        content: [{ type: "text", text: JSON.stringify({
          order_id: args.order_id,
          status: "CONFIRMED",
          payment_status: "PAID",
          message: "Order confirmed"
        }) }],
        isError: false
      }));
    }

    return res.status(404).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Unknown tool" }
    });
  }

  if (method === "ping") {
    return res.json(jsonRpc(id, {}));
  }

  return res.status(400).json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Unsupported MCP method" }
  });
}