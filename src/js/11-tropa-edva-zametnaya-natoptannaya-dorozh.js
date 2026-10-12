// ===== ТРОПА: едва заметная натоптанная дорожка от машины к нужному месту =====
let trailCv = null;
const TRAIL_INK = {
  plough: [178, 150, 102],
  forest: [58, 50, 30],
  swamp: [52, 46, 30],
  manor: [70, 58, 36],
  hillfort: [66, 56, 32],
  flooded: [196, 184, 150]
};
function buildTrail(t) {
  trailCv = null;
  if (!t) return;
  let goal = null,
    stopR = 0;
  const st = t.items.find(i => i.story && !i.found);
  if (st) {
    goal = { x: st.x, y: st.y };
    stopR = 3.5 * TS;
  } // сюжетная вещь: тропа обрывается в нескольких шагах
  else if (t.shown) {
    goal = { x: t.shown.x, y: t.shown.y };
    stopR = t.shown.r * 0.55;
  } // карта: тропа уходит в кольцо и теряется
  if (!goal) return;
  const a = { tx: Math.floor((roadX(580) + 20) / TS), ty: 36 };
  while (blocked(a.tx, a.ty) && a.tx < MW) a.tx++;
  let g = { tx: Math.floor(goal.x / TS), ty: Math.floor(goal.y / TS) };
  outer: for (let r = 0; r < 8; r++)
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++)
        if (!blocked(g.tx + dx, g.ty + dy)) {
          g = { tx: g.tx + dx, ty: g.ty + dy };
          break outer;
        }
  const p = findPath(a, g);
  if (!p || p.length < 4) return;
  const rr = rng((t.id || 1) * 977 + (t.map || 0) * 31);
  // сглаживаем лесенку клеток и даём тропе петлять
  let pts = [a, ...p]
    .filter((c, i, arr) => i % 2 === 0 || i === arr.length - 1)
    .map(c => ({ x: c.tx * TS + 8 + (rr() - 0.5) * 6, y: c.ty * TS + 8 + (rr() - 0.5) * 6 }));
  for (let it = 0; it < 3; it++) {
    const o = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const A = pts[i],
        B = pts[i + 1];
      o.push(
        { x: A.x * 0.75 + B.x * 0.25, y: A.y * 0.75 + B.y * 0.25 },
        { x: A.x * 0.25 + B.x * 0.75, y: A.y * 0.25 + B.y * 0.75 }
      );
    }
    o.push(pts[pts.length - 1]);
    pts = o;
  }
  const seg = [];
  let tot = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    seg.push(d);
    tot += d;
  }
  const c = document.createElement("canvas");
  c.width = WW;
  c.height = WH;
  const q = c.getContext("2d");
  const ink = TRAIL_INK[worldKind] || [70, 56, 34];
  let run = 0,
    ended = false;
  for (let i = 0; i < pts.length - 1 && !ended; i++) {
    const A = pts[i],
      B = pts[i + 1],
      L = seg[i];
    for (let s = 0; s < L; s += 1) {
      const x = A.x + ((B.x - A.x) * s) / L,
        y = A.y + ((B.y - A.y) * s) / L,
        d = run + s;
      if (d < 26) continue; // у машины тропы не видно — она начинается в траве
      const left = Math.hypot(goal.x - x, goal.y - y) - stopR;
      if (left < 0) {
        ended = true;
        break;
      }
      const fade = Math.min(1, left / (5 * TS)) * Math.min(1, (d - 26) / 40); // проявляется и тает
      const nx = -(B.y - A.y) / L,
        ny = (B.x - A.x) / L,
        w = 1 + (Math.sin(d * 0.09) > 0.3 ? 1 : 0);
      for (let k = -w; k <= w; k++) {
        if (rr() < 0.22) continue;
        const al = (k === 0 ? 0.36 : 0.2) * fade * (0.7 + rr() * 0.5);
        q.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${al.toFixed(3)})`;
        q.fillRect(Math.round(x + nx * k), Math.round(y + ny * k), 1, 1);
      }
      if (rr() < 0.04 * fade) {
        q.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${(0.4 * fade).toFixed(3)})`;
        q.fillRect(Math.round(x + nx * (rr() < 0.5 ? -2 : 2)), Math.round(y + ny * 2), 1, 1);
      } // примятые травинки по краям
    }
    run += L;
  }
  trailCv = c;
}
