
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export default async function handler(req, res){
  if(req.method!=='POST') return res.status(405).json({error:'method not allowed'});
  if(!OPENAI_API_KEY) return res.status(500).json({error:'missing OPENAI_API_KEY'});
  try{
    const { mode='chat', messages=[], answers=[] } = req.body || {};
    const sys_chat = `你是「雲間信件✉️」的靈氣夥伴。語氣自然、有溫度、不官腔，敢愛敢恨但不失禮。`;
    const sys_mirror = `你是「靈魂照妖鏡🪞」的守鏡者。根據使用者的自述(answers[])，輸出 JSON：
{
  "insight": "600-800字，宇宙視角的深層覺察文字；不要出現評分、不要寫開始解析等字眼。語氣精品、不假掰。",
  "birds": {
    "migou": "🩷米果一句話（自我價值/邊界）",
    "ajin": "💛阿金一句話（反骨/行動）",
    "gungun": "🩵滾滾一句話（誠懇/安定）"
  }
}`;
    const payload = mode==='mirror'
      ? [{role:'system', content: sys_mirror}, {role:'user', content: JSON.stringify(answers)}]
      : [{role:'system', content: sys_chat}, ...messages];
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method:'POST',
      headers:{'Authorization':`Bearer ${OPENAI_API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({ model:'gpt-4o-mini', temperature: mode==='mirror'?0.6:0.8, messages: payload })
    });
    const j = await r.json();
    if(j.error) return res.status(500).json(j);
    const text = j.choices?.[0]?.message?.content || '';
    if(mode==='mirror'){
      try{ return res.json(JSON.parse(text)); }catch{ return res.json({insight:text,birds:{}}); }
    }
    return res.json({reply:text});
  }catch(e){ return res.status(500).json({error:e.message}); }
}
