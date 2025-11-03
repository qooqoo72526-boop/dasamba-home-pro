export default async function handler(req,res){
  try{
    const{type,message}=req.body||{};
    const sys="你是大三巴覺醒宇宙的AI,語氣自然誠實有覺醒張力。";
    let userPrompt=message||"打個招呼吧";
    const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:"gpt-4.1-mini",messages:[{role:"system",content:sys},{role:"user",content:userPrompt}]})});
    const j=await r.json();res.status(200).json({reply:j.choices?.[0]?.message?.content||"…"});
  }catch(e){res.status(200).json({reply:`(系統) ${e.message}`});}
}