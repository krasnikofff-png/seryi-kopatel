// ================= ЦИФРЫ 3×5 =================
const DIG = {
  0: "111101101101111",
  1: "010110010010111",
  2: "111001111100111",
  3: "111001111001111",
  4: "101101111001001",
  5: "111100111001111",
  6: "111100111101111",
  7: "111001001001001",
  8: "111101111101111",
  9: "111101111001111"
};
const GLY = { с: [3, "000011100100011"], м: [5, "0000010001110111010110001"] };
// подпись «20 см» на тёмной плашке
function label(t, x, y) {
  const gl = [...t].map(ch => (ch === " " ? [1, ""] : GLY[ch] || [3, DIG[ch]]));
  const w = gl.reduce((a, g) => a + g[0] + 1, -1),
    ox = Math.round(x - w / 2),
    oy = Math.round(y);
  for (const pass of [0, 1]) {
    let cx = ox;
    ctx.fillStyle = pass ? "#fbf6e8" : "rgba(28,22,12,.9)";
    for (const [gw, b] of gl) {
      for (let i = 0; i < b.length; i++)
        if (b[i] === "1") {
          const px = cx + (i % gw),
            py = oy + Math.floor(i / gw);
          if (pass) ctx.fillRect(px, py, 1, 1);
          else ctx.fillRect(px - 1, py - 1, 3, 3);
        }
      cx += gw + 1;
    }
  }
}

function drawDetector(cx, cy, sig) {
  const f = FACE[P.dir],
    c = coilPos(sweepT);
  const hx = P.x + OFF.x + f[0] * 3 + (P.dir === "down" ? 3 : P.dir === "up" ? -3 : 0),
    hy = P.y + OFF.y - 7;
  const x0 = Math.round(hx - cx),
    y0 = Math.round(hy - cy),
    x1 = Math.round(c.x - cx),
    y1 = Math.round(c.y - cy);
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  ctx.fillStyle = "#3b3b38";
  for (let i = 0; i <= n; i++)
    ctx.fillRect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1);
  const glow = sig.s > 0.08;
  const lv = G.det,
    rx = lv >= 5 ? 5 : 4;
  if (glow) {
    ctx.globalAlpha = 0.25 + sig.s * 0.5;
    disc(ctx, x1, y1, rx + 2, 3, lv === 1 ? "#e3b85a" : "#f6dc6a");
    ctx.globalAlpha = 1;
  }
  if (lv === 1) {
    disc(ctx, x1, y1, 4, 2, glow ? "#e3b85a" : "#6b5634");
    disc(ctx, x1, y1, 2, 1, "#3a2e1c");
    rect(ctx, x1 - 3, y1, 1, 1, "#e8e2d0");
    rect(ctx, x1 + 2, y1 - 1, 1, 1, "#e8e2d0");
  } else if (lv === 2) {
    disc(ctx, x1, y1, 4, 2, glow ? "#f2d14b" : "#6f6f68");
    disc(ctx, x1, y1, 2, 1, "#4a4a44");
  } else if (lv === 3) {
    disc(ctx, x1, y1, 4, 2, glow ? "#f2d14b" : "#2b2b28");
    disc(ctx, x1, y1, 2, 1, "#56564f");
  } else if (lv === 4) {
    disc(ctx, x1, y1, 4, 2, glow ? "#f2d14b" : "#1e1e1c");
    disc(ctx, x1, y1, 2, 1, "#b8483a");
  } else if (lv === 5) {
    disc(ctx, x1, y1, 5, 2, glow ? "#f2d14b" : "#1e1e1c");
    disc(ctx, x1, y1, 3, 1, "#c9b23a");
    disc(ctx, x1, y1, 1, 0, "#1e1e1c");
  } else {
    disc(ctx, x1, y1, 6, 3, glow ? "#f2d14b" : "#2a3440");
    disc(ctx, x1, y1, 4, 2, "#5a8ab0");
    disc(ctx, x1, y1, 1, 0, "#d8ecf8");
  }
}
