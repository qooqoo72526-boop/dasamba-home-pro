const cvs = document.getElementById('stars');
if (cvs){
  const ctx = cvs.getContext('2d');
  let W,H,stars=[];
  function resize(){ W=cvs.width=window.innerWidth; H=cvs.height=window.innerHeight; }
  function init(){ stars = Array.from({length:150}, ()=>({x:Math.random()*W,y:Math.random()*H,v:0.2+Math.random()*0.6,r:0.5+Math.random()*1.5})); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='rgba(255,255,255,.85)';
    stars.forEach(s=>{ s.y+=s.v; if(s.y>H) s.y=-5; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', ()=>{ resize(); init(); });
  resize(); init(); draw();
}
const splash = document.getElementById('splash');
if (splash){ setTimeout(()=> splash.classList.add('hide'), 3500); }
