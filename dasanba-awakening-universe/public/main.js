
let CFG={};
fetch('config.json').then(r=>r.json()).then(c=>CFG=c);

window.addEventListener('DOMContentLoaded',()=>{
  const s=document.querySelector('.splash');
  if(s){ setTimeout(()=>{ s.remove(); }, 3600); }
  const audio=document.getElementById('bgm'); if(audio){
    const play=()=>audio.play().catch(()=>{});
    document.addEventListener('click', play, {once:true});
  }
  const slides=[...document.querySelectorAll('.trio img')];
  if(slides.length){
    let i=0; slides[0].classList.add('active');
    setInterval(()=>{ slides[i].classList.remove('active'); i=(i+1)%slides.length; slides[i].classList.add('active'); }, 3800);
  }
});

function initCloudMail(){
  const bubbles=document.getElementById('bubbles');
  const input=document.getElementById('msg');
  const btn=document.getElementById('send');
  const add=(txt,me=false)=>{
    const d=document.createElement('div'); d.className='bubble'+(me?' me':''); d.textContent=txt;
    bubbles.appendChild(d); d.scrollIntoView({behavior:'smooth',block:'end'});
  };
  btn.addEventListener('click', async ()=>{
    const text=input.value.trim(); if(!text) return;
    add(text,true); input.value='';
    const r=await fetch(CFG.talkEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({mode:'chat',messages:[{role:'user',content:text}]})})
      .then(r=>r.json()).catch(()=>({reply:'（風太大，我聽不清…）'}));
    add(r.reply||'……');
  });
}
function initMirror(){
  const ta=document.getElementById('answers');
  const btn=document.getElementById('analyze');
  const insight=document.getElementById('insight');
  const birds=document.getElementById('birds');
  const b_m=document.getElementById('b_m'), b_a=document.getElementById('b_a'), b_g=document.getElementById('b_g');
  btn.addEventListener('click', async ()=>{
    const raw=ta.value.trim(); if(!raw) return;
    insight.classList.add('hidden'); birds.classList.add('hidden');
    const r=await fetch(CFG.talkEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({mode:'mirror',answers:raw.split(/\n+/).map(s=>s.trim()).filter(Boolean)})})
      .then(r=>r.json()).catch(()=>({insight:'（鏡面起霧了，等等再試）',birds:{}}));
    insight.textContent=r.insight||'';
    b_m.textContent=r.birds?.migou||''; b_a.textContent=r.birds?.ajin||''; b_g.textContent=r.birds?.gungun||'';
    insight.classList.remove('hidden'); birds.classList.remove('hidden');
  });
}
window.initCloudMail = initCloudMail;
window.initMirror = initMirror;
