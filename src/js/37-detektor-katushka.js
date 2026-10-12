// ================= ДЕТЕКТОР: катушка =================
function coilPos(t) {
  const f = FACE[P.dir],
    sw = Math.sin(t * (P.moving ? 6 : 3)) * 5;
  return {
    x: P.x + OFF.x + f[0] * 11 + (f[1] ? sw : 0),
    y: P.y + OFF.y - 2 + f[1] * 10 + (f[0] ? sw * 0.6 : 0)
  };
}
