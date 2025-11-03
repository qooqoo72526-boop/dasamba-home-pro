const out = document.querySelector('.oracles');
const input = document.querySelector('.bubble-input');
document.querySelector('.send').onclick = async () => {
  const text = input.innerText.trim();
  if (!text) return;
  input.innerText = '';
  out.innerHTML = '<div class="oracle wait">鏡面在發光…</div>';
  const r = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ message: text, mode: 'mirror' })
  });
  const data = await r.json();
  out.innerHTML = `<div class="oracle">${data.reply || '……'}</div>`;
};
