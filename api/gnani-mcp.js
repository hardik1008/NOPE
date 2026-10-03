import { storage } from "hatchable";

export const access = "public";

const PROTOCOL = "2025-06-18";
const sessions = new Set();

const tools = [
  {
    name: "gnani_speech_to_text",
    description: "Convert base64 audio to text using Gnani STT. Supports Hindi, English and Hinglish.",
    inputSchema: {
      type: "object",
      properties: {
        audio_base64: { type: "string" },
        language_code: { type: "string", default: "hi-IN" },
        format: { type: "string", default: "wav" }
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
        voice: { type: "string", default: "Poorvi" },
        speed: { type: "number", default: 1 }
      },
      required: ["text"]
    }
  }
];

function rpc(id, result) {
  return { jsonrpc: "2.0", id, result };
}

function errorRpc(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function requireKey() {
  const key = process.env.GNANI_API_KEY;
  if (!key) throw new Error("GNANI_API_KEY is not configured on the server.");
  return key;
}

export default async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("MCP-Protocol-Version", PROTOCOL);

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method === "GET") {
    return res.json({ name: "NØPE Gnani Bridge", version: "1.0.0", protocol: PROTOCOL, status: "ok", tools: tools.map(t => t.name) });
  }

  const body = req.body || {};
  const id = body.id ?? null;
  const method = body.method;

  if (method === "initialize") {
    const session = crypto.randomUUID();
    sessions.add(session);
    res.setHeader("Mcp-Session-Id", session);
    return res.json(rpc(id, {
      protocolVersion: PROTOCOL,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "nope-gnani-bridge", version: "1.0.0" }
    }));
  }

  if (method === "notifications/initialized") return res.status(202).send("");

  if (method === "ping") return res.json(rpc(id, {}));

  if (method === "tools/list") return res.json(rpc(id, { tools }));

  if (method !== "tools/call") {
    return res.status(400).json(errorRpc(id, -32601, "Unsupported MCP method"));
  }

  const name = body.params?.name;
  const args = body.params?.arguments || {};

  try {
    const key = requireKey();

    if (name === "gnani_speech_to_text") {
      const raw = String(args.audio_base64 || "");
      if (!raw) return res.json(errorRpc(id, -32602, "audio_base64 is required"));

      const bytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0));
      const form = new FormData();
      form.append("audio_file", new Blob([bytes], { type: "audio/wav" }), "audio.wav");
      form.append("language_code", String(args.language_code || "hi-IN"));
      form.append("format", String(args.format || "wav"));

      const upstream = await fetch("https://api.vachana.ai/stt/v3", {
        method: "POST",
        headers: { "X-API-Key-ID": key },
        body: form
      });

      const text = await upstream.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      return res.json(rpc(id, {
        content: [{ type: "text", text: JSON.stringify({
          success: upstream.ok,
          status_code: upstream.status,
          transcript: data.transcript ?? data.text ?? data,
          request_id: data.request_id ?? null,
          language_code: args.language_code || "hi-IN"
        }) }],
        isError: !upstream.ok
      }));
    }

    if (name === "gnani_text_to_speech") {
      const text = String(args.text || "");
      if (!text) return res.json(errorRpc(id, -32602, "text is required"));

      const payload = {
        model: "timbre-v2.5",
        text,
        voice: String(args.voice || "Poorvi"),
        language: String(args.language || "hi-en"),
        speed: Number(args.speed || 1),
        output_format: "wav"
      };

      const upstream = await fetch("https://api.vachana.ai/api/v1/tts/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key-ID": key },
        body: JSON.stringify(payload)
      });

      const contentType = upstream.headers.get("content-type") || "";
      if (!upstream.ok) {
        const errorText = await upstream.text();
        return res.json(rpc(id, {
          content: [{ type: "text", text: JSON.stringify({ success:false, status_code:upstream.status, error:errorText.slice(0,1000) }) }],
          isError: true
        }));
      }

      const buffer = new Uint8Array(await upstream.arrayBuffer());
      // storage is imported statically at the top of this file
      const url = await storage.put("gnani/" + crypto.randomUUID() + ".wav", buffer, contentType || "audio/wav");

      return res.json(rpc(id, {
        content: [{ type: "text", text: JSON.stringify({ success:true, audio_url:url, content_type:contentType || "audio/wav" }) }],
        isError: false
      }));
    }

    return res.json(errorRpc(id, -32601, "Unknown tool"));
  } catch (e) {
    return res.json(rpc(id, {
      content: [{ type: "text", text: JSON.stringify({ success:false, error:String(e?.message || e) }) }],
      isError: true
    }));
  }
}