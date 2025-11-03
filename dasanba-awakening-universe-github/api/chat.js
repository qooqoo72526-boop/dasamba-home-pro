export default async function handler(req, res) {
  try {
    const { message, mode } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const sys = (mode === 'mirror')
      ? "你是宇宙風格的敘事者。輸出需詩性但不做作，600字上下，段落有呼吸，避免條列。最後附上阿金/米果/滾滾各一句符合個性的短句。不要出現「深度解析」「三鳥回應」等字眼。"
      : "你是溫柔的雲間筆友，以自然對話回覆，簡短誠懇，像朋友。";

    const rsp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: message || "" }
        ],
        temperature: 0.8
      })
    });

    const data = await rsp.json();
    if (data?.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
    return res.status(500).json({ error: data?.error?.message || "Upstream error" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
