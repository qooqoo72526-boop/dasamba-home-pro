
import { chatToBackend } from './config.js';

// Starfield
(function(){
  const c = document.getElementById('stars');
  if(!c) return;
  const ctx = c.getContext('2d');
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  let w=0,h=0, stars=[];
  function resize(){
    w = c.width = innerWidth*DPR;
    h = c.height = innerHeight*DPR;
    stars = Array.from({length: Math.floor((w*h)/(30000))}, ()=> ({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.2+0.2, s: Math.random()*0.6+0.2
    }));
  }
  resize(); addEventListener('resize', resize);
  (function loop(){
    requestAnimationFrame(loop);
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#dfe7ff';
    stars.forEach(st=>{
      st.y += st.s;
      if(st.y>h) st.y=0, st.x=Math.random()*w;
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2); ctx.fill();
    });
  })();
})();

// Personas
const PERSONA = {
  migou: {
    name: "米果",
    tag: "自我價值 • 邊界",
    quote: "我很值錢 不要糟蹋我",
    long: "漂亮的鮭色朱陸冠巴丹 家裡受寵的小公主 學習快很會說話 天生有勇氣 什麼都敢試 最喜歡媽媽 對外人冷淡 會保護自己不迎合 別人看不懂的時候 她依然站在自己的答案上",
    img: "./assets/img/migou.webp",
    mouth: "./assets/img/migou_mouth.webp"
  },
  ajin: {
    name: "阿金",
    tag: "反骨 • 自由",
    quote: "我活著就要自由地燃燒",
    long: "家中第一隻鳥 小霸王型格 喜歡領頭 也願意扛責 任性但不敷衍 面對挑戰不找藉口 喜歡和世界硬碰硬 偶爾想管米果 但也懂得在重要的人面前 收回刺和傲氣",
    img: "./assets/img/ajin.webp",
    mouth: "./assets/img/ajin_mouth.webp"
  },
  gungan: {
    name: "滾滾",
    tag: "溫誠 • 安全感",
    quote: "我只希望身邊的人都能放心做自己",
    long: "藍眼溫柔的大男孩 阿金認可的小弟 習慣照顧別人的情緒 也在學習說出自己 安靜而穩定 在需要的時候站出來 幫大家把心放回胸口",
    img: "./assets/img/gungan.webp",
    mouth: "./assets/img/gungan_mouth.webp"
  }
};

export function openPersona(id){
  const p = PERSONA[id];
  const m = document.querySelector('#personaModal');
  const avatar = m.querySelector('.avatar img');
  const title = m.querySelector('.mtitle');
  const desc = m.querySelector('.mdesc');
  avatar.src = p.img;
  title.textContent = `${p.name}  —  ${p.tag}`;
  desc.textContent = p.long + "  ｜ " + p.quote;
  m.classList.add('open');

  // simple mouth animation while opening
  const img = avatar;
  let t=0, alt=false;
  const mouthTick = ()=>{
    if(!m.classList.contains('open')) return;
    t++;
    if(t%35===0){
      alt=!alt;
      img.src = alt ? p.mouth : p.img;
    }
    requestAnimationFrame(mouthTick);
  }
  mouthTick();
}
export function closeModal(){ document.querySelector('#personaModal')?.classList.remove('open'); }

// Soul mirror logic
export async function runSoulMirror(){
  const ta = document.querySelector('#soulText');
  const out = document.querySelector('#soulOut');
  const val = (ta.value||"").trim();
  if(!val){ out.textContent = "寫下你此刻最真實的感受 我在"; return; }
  out.textContent = "解析中 讓靈魂說話……";
  const prompt = `你是情緒價值覺醒教練，請直接以深層解析方式回應 600 字以上，不要條列、不要指令口吻，敢愛敢恨但溫柔。使用繁體中文。來訪者的原話：${val}`;
  const reply = await chatToBackend(prompt);
  out.textContent = reply;
}

// Dialogue (Cloud letters) logic
export async function runLetter(){
  const who = document.querySelector('input[name=who]:checked')?.value || 'migou';
  const msg = document.querySelector('#letterText').value.trim();
  const wrap = document.querySelector('#letterOut');
  if(!msg){ wrap.innerHTML = '<div class="envelope"><small>雲巢來信</small>說點什麼吧 我在聽</div>'; return; }
  const p = PERSONA[who];
  const system = `你是${p.name}，語氣可愛但真誠，保留牠的個性與立場，用第一人稱，句子短一點，不用太多標點。`;
  const prompt = `${system} 回覆這段訊息：${msg}`;
  const reply = await chatToBackend(prompt);

  wrap.innerHTML = `<div class="envelope"><small>${p.name} 在雲上回你</small>${reply}</div>`;

  // little beak animation
  const avatar = document.querySelector('#letterAvatar');
  if(avatar){
    let alt=false, tick=0;
    const frames=[p.img,p.mouth,p.img];
    (function loop(){
      if(tick>42){avatar.src=p.img; return;}
      avatar.src=frames[alt?1:0]; alt=!alt; tick++;
      setTimeout(loop, 120);
    })();
  }
}
