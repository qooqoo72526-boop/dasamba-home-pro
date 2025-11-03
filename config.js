
// === Dasamba Home PRO V2 Config ===
// Set your backend base URL (no trailing slash), e.g. "https://dasamba-ai-dasamba-backend-v.hf.space"
const BASE_URL = window.BASE_URL_OVERRIDE || "https://dasamba-ai-dasamba-backend-v.hf.space";

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
