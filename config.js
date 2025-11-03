// === DaSanBa Awakening Universe Config ===
// 🌌 Emotional Value AI | 大三巴覺醒宇宙

export const CONFIG = {
  BASE_URL: "https://api.openai.com/v1", // 固定的 OpenAI 接口
  API_KEY: process.env.OPENAI_API_KEY,   // 從 Vercel 環境變數讀取 🔑
};

// 🪄 對話函式：發送訊息給 OpenAI
export async function chatToBackend(message) {
  try {
    const res = await fetch(`${CONFIG.BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 可以改成 gpt-4o 或妳的模型
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await res.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else if (data.error) {
      return `（系統）錯誤：${data.error.message}`;
    } else {
      return "（系統）目前沒有回覆，請再試一次。";
    }
  } catch (err) {
    return `（系統）發生異常：${err.message}`;
  }
}
