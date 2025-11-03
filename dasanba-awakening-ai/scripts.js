const el=s=>document.querySelector(s);
const chat=el('#chat');
if(el('#send')){
  el('#send').addEventListener('click',async()=>{
    const v=el('#msg').value.trim();if(!v)return;
    addBubble(v,'me');el('#msg').value='';addBubble('（正在傾聽…）');
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'dialogue',message:v})});
    const data=await res.json();replaceLastBubble(data.reply||'（系統忙碌）');
  });
}
function addBubble(t,w){const li=document.createElement('li');li.className='bubble'+(w==='me'?' me':'');li.textContent=t;chat.appendChild(li);}
function replaceLastBubble(t){const last=chat.lastElementChild;if(last)last.textContent=t;}
if(el('#mirrorRun')){
  el('#mirrorRun').addEventListener('click',async()=>{
    const prompt=el('#mirrorPrompt').value.trim();if(!prompt)return;
    el('#mirrorResult').classList.remove('hidden');el('.deep-reading').textContent='鏡面啟動中…';
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type:'mirror',message:prompt})});
    const data=await res.json();el('.deep-reading').textContent=data.reading||'（鏡面今天沒開）';
  });
}