(() => {
  const canvas = document.querySelector('#canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const start = document.querySelector('#wallBallListener');
  const pause = document.querySelector('#game-pause');
  const status = document.querySelector('#game-status');
  const scoreLabel = document.querySelector('#game-score');
  const w = canvas.width, h = canvas.height;
  const paddle = { x: 14, y: h / 2 - 45, width: 12, height: 90 };
  const ball = { x: w / 2, y: h / 2, vx: -260, vy: 110, radius: 7 };
  const keys = new Set();
  let running = false, paused = false, score = 0, best = 0, frame = 0, last = 0;
  try { best = Math.max(0, Number(localStorage.getItem('wallBallBest')) || 0); } catch {}
  const clamp = y => Math.max(0, Math.min(h - paddle.height, y));
  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#dfebe4'; ctx.setLineDash([4, 9]); ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#27786d'; ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#b95b82'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fill();
    scoreLabel.textContent = `Score: ${score} · Best: ${best}`;
  }
  function stop() {
    running = false; cancelAnimationFrame(frame); pause.disabled = true;
    start.textContent = 'Play again'; status.textContent = `Game over. Score: ${score}. Ready for another round?`; keys.clear(); draw();
  }
  function tick(time) {
    if (!running || paused) return;
    const dt = Math.min((time - last) / 1000 || 0, .035); last = time;
    if (keys.has('ArrowUp')) paddle.y = clamp(paddle.y - 360 * dt);
    if (keys.has('ArrowDown')) paddle.y = clamp(paddle.y + 360 * dt);
    const previousX = ball.x; ball.x += ball.vx * dt; ball.y += ball.vy * dt;
    if (ball.y < ball.radius) {ball.y = ball.radius; ball.vy = Math.abs(ball.vy);}
    if (ball.y > h - ball.radius) {ball.y = h - ball.radius; ball.vy = -Math.abs(ball.vy);}
    if (ball.x > w - ball.radius) {ball.x = w - ball.radius; ball.vx = -Math.abs(ball.vx);}
    const edge = paddle.x + paddle.width;
    if (ball.vx < 0 && previousX - ball.radius >= edge && ball.x - ball.radius <= edge && ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height) {
      ball.x = edge + ball.radius; ball.vx = Math.min(470, Math.abs(ball.vx) + 12);
      ball.vy = ((ball.y - paddle.y - paddle.height / 2) / (paddle.height / 2)) * 240;
      score++; best = Math.max(best, score);
      try {localStorage.setItem('wallBallBest', String(best));} catch {}
    }
    if (ball.x < -ball.radius) {stop(); return;}
    draw(); frame = requestAnimationFrame(tick);
  }
  function togglePause() {
    if (!running) return;
    paused = !paused; keys.clear(); pause.textContent = paused ? 'Resume' : 'Pause';
    status.textContent = paused ? 'Paused. Resume when you are ready.' : 'Keep the ball in play!';
    cancelAnimationFrame(frame);
    if (!paused) {last = performance.now(); frame = requestAnimationFrame(tick);}
  }
  start.addEventListener('click', () => {
    cancelAnimationFrame(frame); score = 0; paddle.y = h / 2 - paddle.height / 2;
    Object.assign(ball, {x: w / 2, y: h / 2, vx: -260, vy: 110});
    running = true; paused = false; keys.clear(); last = performance.now();
    start.textContent = 'Restart'; pause.textContent = 'Pause'; pause.disabled = false;
    status.textContent = 'Keep the ball in play!'; canvas.focus(); draw(); frame = requestAnimationFrame(tick);
  });
  pause.addEventListener('click', togglePause);
  canvas.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', ' '].includes(e.key)) {e.preventDefault(); if(e.key === ' ') {if(!e.repeat) togglePause();} else keys.add(e.key);}
  });
  canvas.addEventListener('keyup', e => keys.delete(e.key));
  canvas.addEventListener('blur', () => keys.clear());
  window.addEventListener('blur', () => {if(running && !paused) togglePause();});
  canvas.addEventListener('pointermove', e => {
    if (!running || paused) return;
    const rect = canvas.getBoundingClientRect(); paddle.y = clamp((e.clientY - rect.top) * h / rect.height - paddle.height / 2);
  });
  canvas.addEventListener('pointerdown', e => {canvas.focus(); canvas.setPointerCapture(e.pointerId);});
  document.addEventListener('visibilitychange', () => {if(document.hidden && running && !paused) togglePause();});
  draw();
})();
