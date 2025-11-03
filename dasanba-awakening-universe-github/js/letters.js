const flow = document.querySelector('.flow');
const input = document.querySelector('.bubble-input');
document.querySelector('.send').onclick = async () => {
  const text = input.innerText.trim();
  if (!text) return;
  addBubble(text, 'me');
  input.innerText = '';
  const r = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ message: text, mode: 'letters' })
  });
  const data = await r.json();
  addBubble(data.reply || '……', 'ai');
};
function addBubble(t, who){
  const b = document.createElement('div');
  b.className = `bubble ${who}`;
  b.innerText = t;
  flow.appendChild(b);
  flow.scrollTop = flow.scrollHeight;
}
