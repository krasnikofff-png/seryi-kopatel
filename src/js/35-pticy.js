// ================= ПТИЦЫ =================
function spawnBird() {
  const onFence = R() < 0.6;
  birds.push({
    x: onFence ? 240 + R() * 340 : RUIN.x + 20 + R() * 90,
    y: onFence ? 74 : RUIN.y + R() * 90 + 10,
    fly: false,
    vx: 0,
    vy: 0,
    t: R() * 3,
    hop: 0,
    face: R() < 0.5 ? -1 : 1
  });
}
let birdTimer = 0;
function updateBirds(dt) {
  for (let i = birds.length - 1; i >= 0; i--) {
    const b = birds[i];
    b.t += dt;
    if (!b.fly) {
      if (Math.hypot(b.x - P.x, b.y - P.y) < 30) {
        b.fly = true;
        b.vx = (b.x > P.x ? 1 : -1) * (40 + R() * 20);
        b.vy = -30 - R() * 20;
        b.face = Math.sign(b.vx);
      } else if (b.t > 1.5 + R() * 3) {
        b.t = 0;
        b.hop = 0.25;
        b.x += (R() - 0.5) * 6;
        b.face = R() < 0.5 ? -1 : 1;
      }
      b.hop = Math.max(0, b.hop - dt);
    } else {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vy -= 6 * dt;
      if (b.y < -20 || b.x < -20 || b.x > WW + 20) birds.splice(i, 1);
    }
  }
  if (birds.length < 4) {
    birdTimer += dt;
    if (birdTimer > 12) {
      birdTimer = 0;
      spawnBird();
    }
  }
}
function drawBird(b, cx, cy) {
  const x = Math.round(b.x - cx),
    y = Math.round(b.y - cy - (b.hop > 0 ? 1 : 0)),
    f = b.face;
  if (!b.fly) {
    disc(ctx, x, y + 1, 2, 0, "rgba(20,30,10,.3)");
  }
  rect(ctx, x - 2, y - 3, 5, 3, "#7a5a3c");
  rect(ctx, x - 1, y - 1, 3, 1, "#c9b08a");
  rect(ctx, x + (f > 0 ? 2 : -3), y - 4, 2, 2, "#5b4030");
  rect(ctx, x + (f > 0 ? 4 : -4), y - 3, 1, 1, "#d8b25a");
  if (b.fly) {
    const up = Math.floor(b.t * 12) % 2;
    rect(ctx, x - 3, y - (up ? 6 : 2), 3, 2, "#6a4d33");
    rect(ctx, x + 1, y - (up ? 6 : 2), 3, 2, "#6a4d33");
  }
}
