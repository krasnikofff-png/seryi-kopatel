// ================= ЦИКЛ =================
let sweepT = 0,
  last = performance.now();
function update(dt) {
  sweepT += dt;
  for (const c of clouds) {
    c.x += c.v * dt;
    if (c.x - c.rx > WW) c.x = -c.rx;
  }
  if (mark) {
    mark.t -= dt;
    if (mark.t <= 0) mark = null;
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.z += p.vy * dt;
    p.vy += 140 * dt;
    if (p.z > 0) p.z = 0;
    if (p.life <= 0) parts.splice(i, 1);
  }
  updateBirds(dt);
  if (toastT > 0) {
    toastT -= dt;
    if (toastT <= 0) toastEl.hidden = true;
  }
  if (cardT > 0) {
    cardT -= dt;
    if (cardT <= 0) cardEl.hidden = true;
  }
  if (paused || !T) {
    P.moving = false;
    return;
  }
  if (T.minutes >= dayEnd()) {
    const n = T.found,
      end = hhmmAbs(480 + dayEnd()),
      wt = T.wx,
      se = T.season;
    endTrip("Стемнело, пора домой.");
    dayOverPopup(n, end, se, wt);
    return;
  }
  if (digT > 0) {
    digT -= dt;
    P.moving = false;
    if (digT <= 0) finishDig();
    return;
  }
  if (!path.length) {
    const d = keys.has("u")
      ? [0, -1]
      : keys.has("d")
        ? [0, 1]
        : keys.has("l")
          ? [-1, 0]
          : keys.has("r")
            ? [1, 0]
            : null;
    if (d) {
      const t = pTile(),
        n = { tx: t.tx + d[0], ty: t.ty + d[1] };
      if (!blocked(n.tx, n.ty)) {
        path = [n];
        dest = null;
      } else P.dir = d[0] ? (d[0] > 0 ? "right" : "left") : d[1] > 0 ? "down" : "up";
    }
  }
  if (path.length) {
    const f = tileFeet(path[0]),
      dx = f.x - P.x,
      dy = f.y - P.y,
      L = Math.hypot(dx, dy),
      sp = 62 * dt;
    P.moving = true;
    P.walk += dt;
    if (Math.abs(dx) > Math.abs(dy)) P.dir = dx > 0 ? "right" : "left";
    else if (Math.abs(dy) > 0.01) P.dir = dy > 0 ? "down" : "up";
    if (L <= sp) {
      P.x = f.x;
      P.y = f.y;
      path.shift();
      T.minutes += T.region === 3 ? 2 : 1;
      pzSee();
      SFX.step((P._st = !P._st));
      noise = (R() - 0.5) * 0.25 * (R() < 0.15 ? 2.5 : 1);
      updateHud();
      if (!path.length) {
        dest = null;
        save();
      }
    } else {
      P.x += (dx / L) * sp;
      P.y += (dy / L) * sp;
    }
  } else P.moving = false;
}
function frame(now) {
  requestAnimationFrame(frame); // планируем следующий кадр заранее, чтобы ошибка не останавливала игру
  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
  last = now;
  try {
    if (screen === "field" && T) update(dt);
    if (screen === "field" && T) draw(); // поездка могла закончиться внутри update
  } catch (e) {
    console.error(e);
  }
}
