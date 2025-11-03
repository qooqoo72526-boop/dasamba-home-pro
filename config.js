
// === Dasamba Home PRO V2 Config ===
// Set your backend base URL (no trailing slash), e.g. "https://dasamba-ai-dasamba-backend-v.hf.space"
const BASE_URL = const CONFIG = {
  BASE_URL: "https://api.openai.com/v1",
  API_KEY: process.env.OPENAI_API_KEY,  // ✅ 這一行很重要
};

export async function chatToBackend(message) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message})
  });
  const data = await res.json();
  // backend returns { reply: "..." } or { error: "..." }
  if (data.reply) return data.reply;
  if (data.error) return `（系統）${data.error}`;
  return "（系統）目前忙碌，等我一下下。";
}
