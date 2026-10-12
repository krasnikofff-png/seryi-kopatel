// ================= КЛЕТКИ И ПУТЬ =================
let paused = true,
  digT = 0,
  digTarget = null,
  digFast = false,
  screen = "base";
let path = [],
  dest = null,
  mark = null,
  CX = 0,
  CY = 0,
  OFF = { x: 0, y: 0 },
  noise = 0,
  showZone = true;
const birds = [],
  parts = [];
const pTile = () => ({ tx: Math.floor(P.x / TS), ty: Math.floor((P.y - 5) / TS) });
const targetTile = pTile;
const tileFeet = t => ({ x: t.tx * TS + 8, y: t.ty * TS + 13 });
function blocked(tx, ty) {
  if (tx < 0 || ty < 1 || tx >= MW || ty >= MH) return true;
  const b = { x: tx * TS + 3, y: ty * TS + 3, w: 10, h: 10 };
  return solids.some(s => hit(b, s));
}
function diggable(tx, ty) {
  if (tx < 1 || ty < 1 || tx >= MW - 1 || ty >= MH - 1) return false;
  return !blocked(tx, ty);
}
function findPath(a, g) {
  if (a.tx === g.tx && a.ty === g.ty) return [];
  const prev = new Map(),
    k = t => t.tx + "," + t.ty,
    q = [a];
  prev.set(k(a), null);
  while (q.length) {
    const c = q.shift();
    if (c.tx === g.tx && c.ty === g.ty) break;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ]) {
      const n = { tx: c.tx + dx, ty: c.ty + dy },
        kk = k(n);
      if (prev.has(kk) || blocked(n.tx, n.ty)) continue;
      prev.set(kk, c);
      q.push(n);
    }
  }
  if (!prev.has(k(g))) return null;
  const out = [];
  let c = g;
  while (c && !(c.tx === a.tx && c.ty === a.ty)) {
    out.unshift(c);
    c = prev.get(k(c));
  }
  return out;
}
const holeAt = (tx, ty) => holes.get(tx + "," + ty) || 0;
