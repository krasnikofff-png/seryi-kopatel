// ================= КАДРЫ КОМИКСА v2 (160×200) =================
const PW = 160,
  PH = 200;
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];
function grad(g, x, y, w, h, c1, c2) {
  for (let j = 0; j < h; j++) {
    const t = j / (h - 1 || 1);
    for (let i = 0; i < w; i++) {
      g.fillStyle = t * 16 > BAYER[(y + j) & 3][(x + i) & 3] + 0.5 ? c2 : c1;
      g.fillRect(x + i, y + j, 1, 1);
    }
  }
}
function glow(g, cx, cy, r, col, max) {
  for (let y = Math.max(0, cy - r); y < Math.min(PH, cy + r); y++)
    for (let x = Math.max(0, cx - r); x < Math.min(PW, cx + r); x++) {
      const d = Math.hypot(x - cx, (y - cy) * 1.15) / r;
      if (d >= 1) continue;
      const a = (1 - d) * (max || 1) * 16;
      if (a > BAYER[y & 3][x & 3]) {
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
    }
}
function ell(g, cx, cy, rx, ry, fill, out) {
  if (out) disc(g, cx, cy, rx + 1, ry + 1, out);
  disc(g, cx, cy, rx, ry, fill);
}
function speck(g, r, x, y, w, h, n, cols) {
  for (let k = 0; k < n; k++) {
    g.fillStyle = cols[Math.floor(r() * cols.length)];
    g.fillRect(Math.floor(x + r() * w), Math.floor(y + r() * h), 1, 1);
  }
}
function vign(g, str) {
  for (let y = 0; y < PH; y++)
    for (let x = 0; x < PW; x++) {
      const v = Math.hypot((x - 80) / 80, (y - 100) / 100);
      if (v > 0.75 && (v - 0.75) * str * 16 > BAYER[y & 3][x & 3]) {
        g.fillStyle = "#0e0a07";
        g.fillRect(x, y, 1, 1);
      }
    }
}
function sepia2(g) {
  const d = g.getImageData(0, 0, PW, PH),
    p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const l = (p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11) / 255,
      q = Math.round(l * 6) / 6;
    p[i] = 34 + q * 196;
    p[i + 1] = 26 + q * 168;
    p[i + 2] = 16 + q * 116;
  }
  g.putImageData(d, 0, 0);
  vign(g, 1.6);
}
// ---- голова крупно ----
function head(g, cx, cy, s, o) {
  const sk = o.skin || "#e2a97e",
    sh = o.shade || "#c08560",
    ln = "#2a1a12",
    hw = Math.round(13 * s),
    hh = Math.round(16 * s);
  if (o.back) {
    ell(g, cx, cy, hw, hh, o.hair || "#2e221a", ln);
    return;
  }
  disc(g, cx - hw, cy + 1, Math.round(3 * s), Math.round(4 * s), sh);
  disc(g, cx + hw, cy + 1, Math.round(3 * s), Math.round(4 * s), sh);
  ell(g, cx, cy, hw, hh, sk, ln);
  for (let y = cy - hh; y <= cy + hh; y++)
    for (let x = cx; x <= cx + hw; x++) {
      const d = ((x - cx) / hw) ** 2 + ((y - cy) / hh) ** 2;
      if (d <= 1 && ((d > 0.4 && x > cx + hw * 0.5) || (d > 0.3 && x > cx + hw * 0.2 && (x + y) % 2 === 0))) {
        g.fillStyle = sh;
        g.fillRect(x, y, 1, 1);
      }
    }
  const ey = cy - Math.round(2 * s),
    ex = Math.round(5 * s),
    ew = Math.max(2, Math.round(3 * s)),
    eh = Math.max(1, Math.round(2 * s));
  [[-1], [1]].forEach(([sd]) => {
    const x = cx + sd * ex - Math.floor(ew / 2);
    rect(g, x, ey, ew, eh, "#f4efe4");
    rect(
      g,
      x + Math.floor(ew / 2) - (sd < 0 ? 0 : 1),
      ey,
      Math.max(1, Math.round(1.5 * s)),
      eh,
      o.eye || "#3a2a20"
    );
    rect(g, x - 1, ey - Math.round(2 * s), ew + 2, Math.max(1, Math.round(s)), o.brow || "#3a2618");
  });
  if (o.wet) rect(g, cx + ex + 1, ey + eh, 1, Math.round(3 * s), "#bfe0f2");
  pline(g, cx + 1, ey + 1, cx + Math.round(2 * s), cy + Math.round(5 * s), sh);
  rect(g, cx - 1, cy + Math.round(5 * s), Math.round(3 * s), 1, sh);
  rect(
    g,
    cx - Math.round(3 * s),
    cy + Math.round(9 * s),
    Math.round(6 * s),
    Math.max(1, Math.round(s * 0.8)),
    o.mouth || "#8a4a3a"
  );
  if (o.smirk) rect(g, cx + Math.round(3 * s), cy + Math.round(8 * s), Math.round(2 * s), 1, "#8a4a3a");
  if (o.wrinkles) {
    const S = v => Math.round(v * s);
    [-1, 1].forEach(sd => {
      pline(g, cx + sd * S(8), ey, cx + sd * S(10), ey - S(1), sh);
      pline(g, cx + sd * S(8), ey + S(2), cx + sd * S(10), ey + S(3), sh);
      pline(g, cx + sd * S(3), cy + S(5), cx + sd * S(5), cy + S(10), sh);
      pline(g, cx + sd * S(4), ey + S(3), cx + sd * S(6), ey + S(3), sh);
    });
    pline(g, cx - S(6), cy - hh + S(6), cx + S(6), cy - hh + S(6), sh);
    pline(g, cx - S(4), cy - hh + S(8), cx + S(4), cy - hh + S(8), sh);
  }
  if (o.stubble)
    for (let k = 0; k < Math.round(60 * s); k++) {
      const a = _PR() * Math.PI,
        r2 = _PR();
      g.fillStyle = "#7a5a44";
      g.fillRect(
        Math.round(cx + Math.cos(a) * hw * 0.85 * r2 + (_PR() - 0.5) * hw),
        Math.round(cy + Math.round(6 * s) + Math.sin(a) * hh * 0.45 * r2),
        1,
        1
      );
    }
  if (o.hair === "short") {
    fillPoly(
      g,
      [
        [cx - hw - 1, cy - Math.round(4 * s)],
        [cx - hw + 2, cy - hh - 1],
        [cx + hw - 2, cy - hh - 1],
        [cx + hw + 1, cy - Math.round(4 * s)],
        [cx + hw - 2, cy - hh + Math.round(5 * s)],
        [cx - hw + 2, cy - hh + Math.round(4 * s)]
      ],
      o.hairc || "#2e221a"
    );
  }
  if (o.hair === "buzz") {
    for (let y = cy - hh; y < cy - hh + Math.round(7 * s); y++)
      for (let x = cx - hw; x <= cx + hw; x++)
        if (((x - cx) / hw) ** 2 + ((y - cy) / hh) ** 2 <= 1 && (x + y) % 2 === 0) {
          g.fillStyle = "#3a2e26";
          g.fillRect(x, y, 1, 1);
        }
  }
  if (o.hair === "bald") {
    disc(
      g,
      cx - Math.round(4 * s),
      cy - hh + Math.round(5 * s),
      Math.round(4 * s),
      Math.round(2 * s),
      "#f0c4a0"
    );
    disc(g, cx - hw, cy - Math.round(2 * s), Math.round(3 * s), Math.round(6 * s), "#c8c4bc");
    disc(g, cx + hw, cy - Math.round(2 * s), Math.round(3 * s), Math.round(6 * s), "#b8b4ac");
  }
  if (o.beard) {
    ell(g, cx, cy + Math.round(13 * s), Math.round(12 * s), Math.round(11 * s), "#cfcbc2", "#8a867e");
    for (let k = 0; k < Math.round(30 * s); k++)
      rect(
        g,
        cx - Math.round(10 * s) + Math.floor(_PR() * 20 * s),
        cy + Math.round(6 * s) + Math.floor(_PR() * 16 * s),
        1,
        Math.round(2 * s),
        "#a8a49c"
      );
    ell(g, cx, cy + Math.round(8 * s), Math.round(7 * s), Math.round(2 * s), "#d8d4cc");
    rect(g, cx - Math.round(3 * s), cy + Math.round(11 * s), Math.round(6 * s), 1, "#8a5a4a");
  }
  if (o.mustache)
    rect(g, cx - Math.round(5 * s), cy + Math.round(7 * s), Math.round(10 * s), Math.round(2 * s), "#4a3022");
  if (o.glasses) {
    const gy = ey - 1;
    [-1, 1].forEach(sd => {
      const x = cx + sd * ex - Math.round(4 * s);
      rect(g, x, gy, Math.round(8 * s), 1, "#1a1a1a");
      rect(g, x, gy + Math.round(5 * s), Math.round(8 * s), 1, "#1a1a1a");
      rect(g, x, gy, 1, Math.round(5 * s), "#1a1a1a");
      rect(g, x + Math.round(8 * s) - 1, gy, 1, Math.round(5 * s), "#1a1a1a");
      rect(g, x + 1, gy + 1, Math.round(2 * s), 1, "#ffffff");
    });
    rect(g, cx - 1, gy + 1, 3, 1, "#1a1a1a");
  }
  if (o.cap) {
    fillPoly(
      g,
      [
        [cx - hw - 1, cy - hh + Math.round(6 * s)],
        [cx - hw + 2, cy - hh - Math.round(2 * s)],
        [cx + hw - 2, cy - hh - Math.round(2 * s)],
        [cx + hw + 1, cy - hh + Math.round(6 * s)]
      ],
      "#76853f"
    );
    rect(
      g,
      cx - hw - Math.round(5 * s),
      cy - hh + Math.round(5 * s),
      Math.round(12 * s),
      Math.round(2 * s),
      "#525e2a"
    );
    rect(g, cx - hw, cy - hh, hw * 2, 1, "#8a9a4a");
  }
  if (o.pilotka) {
    fillPoly(
      g,
      [
        [cx - hw, cy - hh + Math.round(4 * s)],
        [cx - hw + Math.round(3 * s), cy - hh - Math.round(3 * s)],
        [cx + hw - Math.round(2 * s), cy - hh - Math.round(4 * s)],
        [cx + hw + 1, cy - hh + Math.round(3 * s)]
      ],
      "#5a6234"
    );
    rect(
      g,
      cx + Math.round(2 * s),
      cy - hh - Math.round(1 * s),
      Math.round(2 * s),
      Math.round(2 * s),
      "#c8302a"
    );
  }
  if (o.scarf) {
    const sc = o.scarf,
      S = v => Math.round(v * s),
      dk = o.scarfDk || "#1a1a24";
    for (let y = cy - hh - S(4); y <= cy + hh + S(3); y++)
      for (let x = cx - hw - S(5); x <= cx + hw + S(5); x++) {
        const out = ((x - cx) / (hw + S(4))) ** 2 + ((y - cy + S(1)) / (hh + S(4))) ** 2,
          inn = ((x - cx) / (hw - S(1))) ** 2 + ((y - cy - S(3)) / (hh - S(3))) ** 2;
        if (out <= 1 && (inn > 1 || y < cy - hh + S(7))) {
          g.fillStyle = out > 0.86 ? dk : sc;
          g.fillRect(x, y, 1, 1);
        }
      }
    if (o.dots)
      for (let k = 0; k < Math.round(40 * s); k++) {
        const a = _PR() * Math.PI * 2,
          rr = _PR();
        const x = Math.round(cx + Math.cos(a) * (hw + S(1) + rr * S(2))),
          y = Math.round(cy + S(1) + Math.sin(a) * (hh + S(1) + rr * S(2)));
        if (y < cy - hh + S(5) || Math.abs(x - cx) > hw - S(1))
          rect(g, x, y, Math.max(1, S(0.6)), Math.max(1, S(0.6)), "#f4f4f0");
      }
    fillPoly(
      g,
      [
        [cx - S(4), cy + hh],
        [cx + S(4), cy + hh],
        [cx + S(6), cy + hh + S(6)],
        [cx, cy + hh + S(3)],
        [cx - S(6), cy + hh + S(6)]
      ],
      sc
    );
    ell(g, cx, cy + hh + S(1), S(3), S(2), sc, dk);
  }
}
// ---- фигура в полный рост (≈ 46*s px) ----
function body(g, x, y, s, o) {
  const c = o.coat || "#5d7d38",
    c2 = o.coatHi || "#7a9a4a",
    lg = o.legs || "#3c5070",
    bt = "#2a1e14",
    ln = "#1a120c";
  rect(
    g,
    x - Math.round(5 * s) - 1,
    y - Math.round(16 * s) - 1,
    Math.round(10 * s) + 2,
    Math.round(16 * s) + 2,
    ln
  );
  rect(g, x - Math.round(5 * s), y - Math.round(16 * s), Math.round(4 * s), Math.round(14 * s), lg);
  rect(g, x + Math.round(1 * s), y - Math.round(16 * s), Math.round(4 * s), Math.round(14 * s), lg);
  rect(g, x - Math.round(6 * s), y - Math.round(3 * s), Math.round(5 * s), Math.round(3 * s), bt);
  rect(g, x + Math.round(1 * s), y - Math.round(3 * s), Math.round(5 * s), Math.round(3 * s), bt);
  rect(
    g,
    x - Math.round(7 * s) - 1,
    y - Math.round(32 * s) - 1,
    Math.round(14 * s) + 2,
    Math.round(17 * s) + 2,
    ln
  );
  rect(g, x - Math.round(7 * s), y - Math.round(32 * s), Math.round(14 * s), Math.round(17 * s), c);
  rect(g, x - Math.round(7 * s), y - Math.round(32 * s), Math.round(4 * s), Math.round(17 * s), c2);
  if (o.belt)
    rect(g, x - Math.round(7 * s), y - Math.round(18 * s), Math.round(14 * s), Math.round(2 * s), "#4a3020");
  if (o.camo)
    for (let k = 0; k < Math.round(14 * s); k++)
      rect(
        g,
        x - Math.round(7 * s) + Math.floor(_PR() * 12 * s),
        y - Math.round(31 * s) + Math.floor(_PR() * 15 * s),
        Math.round(3 * s),
        Math.round(2 * s),
        k % 2 ? "#3a4428" : "#7a6a3a"
      );
  if (o.pack)
    rect(g, x + Math.round(6 * s), y - Math.round(30 * s), Math.round(4 * s), Math.round(12 * s), "#8e5e33");
  const arm = (sx, up) => {
    rect(g, x + sx - 1, y - Math.round(31 * s), Math.round(3 * s) + 2, Math.round(13 * s) + 1, ln);
    rect(g, x + sx, y - Math.round(31 * s), Math.round(3 * s), Math.round(12 * s), c);
    rect(g, x + sx, y - Math.round(19 * s), Math.round(3 * s), Math.round(2 * s), o.skin || "#e2a97e");
  };
  if (!o.noL) arm(-Math.round(10 * s));
  arm(Math.round(7 * s));
  head(g, x, y - Math.round(38 * s), s * 0.42, o.head || {});
}
function sprucePix(g, x, y, h, dark, mid, light) {
  const tiers = 5;
  for (let t = 0; t < tiers; t++) {
    const top = y - h + ((t * h) / tiers) * 0.78,
      hh = (h / tiers) * 1.35,
      w = ((t + 1.2) * h) / 11;
    fillPoly(
      g,
      [
        [x, top - 1],
        [x + w + 1, top + hh + 1],
        [x - w - 1, top + hh + 1]
      ],
      "#0e1e10"
    );
    fillPoly(
      g,
      [
        [x, top],
        [x + w, top + hh],
        [x - w, top + hh]
      ],
      mid
    );
    fillPoly(
      g,
      [
        [x, top],
        [x - w, top + hh],
        [x - w * 0.3, top + hh]
      ],
      light || mid
    );
    fillPoly(
      g,
      [
        [x, top],
        [x + w, top + hh],
        [x + w * 0.4, top + hh]
      ],
      dark
    );
  }
  rect(g, x - 1, y, 3, 4, "#3a2a1a");
}
function birchPix(g, x, y, h, bare) {
  rect(g, x - 1, y - h, 5, h, "#1a1610");
  rect(g, x, y - h, 3, h, "#ece8dc");
  rect(g, x + 2, y - h, 1, h, "#b8b4a8");
  for (let j = y - h + 3; j < y; j += 4 + ((j * 7) % 3)) rect(g, x, j, 2, 1, "#2a2620");
  if (bare) {
    pline(g, x + 1, y - h + 10, x - 8, y - h + 2, "#7a746a");
    pline(g, x + 2, y - h + 18, x + 10, y - h + 9, "#7a746a");
    pline(g, x + 1, y - h + 26, x - 6, y - h + 20, "#7a746a");
  }
}
function boardFloor(g, y0, c1, c2, c3) {
  rect(g, 0, y0, PW, PH - y0, c1);
  for (let y = y0 + 3; y < PH; y += 6) rect(g, 0, y, PW, 1, c2);
  for (let y = y0; y < PH; y += 6) {
    for (let x = (y * 7) % 23; x < PW; x += 31) rect(g, x, y, 1, 6, c2);
  }
  if (c3) for (let k = 0; k < 40; k++) rect(g, (k * 53) % PW, y0 + ((k * 31) % (PH - y0)), 3, 1, c3);
}
function capsule2(g, x, y, len) {
  rect(g, x - 1, y - 1, 12, len + 2, "#0a0806");
  rect(g, x, y, 10, len, "#22201c");
  rect(g, x + 2, y, 2, len, "#55524c");
  rect(g, x + 7, y, 2, len, "#141210");
  for (let j = y + 5; j < y + len; j += 5) rect(g, x, j, 10, 1, "#2e2c28");
}
// ---------- кадры ----------
function P_box(g, r) {
  rect(g, 0, 0, PW, PH, "#3a2818");
  for (let y = 0; y < PH; y += 14) rect(g, 0, y, PW, 1, "#2c1e12");
  speck(g, r, 0, 0, PW, PH, 160, ["#46301e", "#30200f"]);
  glow(g, 80, 92, 92, "#4e3622", 0.9);
  glow(g, 80, 92, 64, "#5e4229", 0.8);
  rect(g, 24, 20, 112, 42, "#0a0806");
  rect(g, 26, 22, 108, 38, "#a8382c");
  rect(g, 26, 22, 108, 3, "#d9b84a");
  rect(g, 26, 56, 108, 3, "#d9b84a");
  rect(g, 26, 22, 3, 38, "#d9b84a");
  rect(g, 131, 22, 3, 38, "#d9b84a");
  [
    [50, 40],
    [80, 40],
    [110, 40]
  ].forEach(([x, y]) => {
    disc(g, x, y, 7, 7, "#d9b84a");
    disc(g, x, y, 5, 5, "#a8382c");
    disc(g, x, y, 2, 2, "#f2d36a");
  });
  rect(g, 22, 62, 116, 74, "#0a0806");
  rect(g, 24, 64, 112, 70, "#8a2e24");
  rect(g, 24, 64, 112, 4, "#d9b84a");
  rect(g, 24, 130, 112, 4, "#d9b84a");
  rect(g, 28, 68, 104, 62, "#2c1612");
  rect(g, 91, 71, 36, 46, "#0a0806");
  {
    const ph = oldPhoto(dedPhoto(), 1);
    g.imageSmoothingEnabled = true;
    g.drawImage(ph, 92, 72, 34, 44);
    g.imageSmoothingEnabled = false;
  }
  fillPoly(
    g,
    [
      [34, 74],
      [84, 74],
      [59, 104]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [36, 75],
      [82, 75],
      [59, 102]
    ],
    "#e8dcc0"
  );
  pline(g, 36, 75, 59, 88, "#b8a888");
  pline(g, 82, 75, 59, 88, "#b8a888");
  pline(g, 59, 88, 59, 102, "#c8b898");
  for (let i = 0; i < 4; i++) pline(g, 44 + i * 2, 78 + i * 2, 74 - i * 2, 78 + i * 2, "#5a5a9a");
  disc(g, 72, 92, 4, 4, "#8a6aa8");
  disc(g, 72, 92, 3, 3, "#e8dcc0");
  [
    [0, -4],
    [1, -2],
    [4, -1],
    [2, 1],
    [3, 4],
    [0, 2],
    [-3, 4],
    [-2, 1],
    [-4, -1],
    [-1, -2],
    [0, 0],
    [0, -3],
    [1, 0],
    [-1, 0],
    [0, 1],
    [1, 1],
    [-1, 1]
  ].forEach(([a, b]) => rect(g, 46 + a, 118 + b, 1, 1, "#d0302a"));
  disc(g, 66, 120, 3, 3, "#8a7a40");
  disc(g, 66, 119, 1, 1, "#c8b860");
  disc(g, 76, 122, 3, 3, "#8a7a40");
  fillPoly(
    g,
    [
      [0, 150],
      [30, 128],
      [42, 140],
      [16, 170],
      [0, 172]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [0, 152],
      [30, 130],
      [40, 140],
      [16, 168],
      [0, 170]
    ],
    "#e2a97e"
  );
  fillPoly(
    g,
    [
      [30, 130],
      [40, 140],
      [34, 146],
      [26, 136]
    ],
    "#c08560"
  );
  fillPoly(
    g,
    [
      [PW, 152],
      [130, 130],
      [120, 140],
      [144, 168],
      [PW, 170]
    ],
    "#e2a97e"
  );
  fillPoly(
    g,
    [
      [130, 130],
      [120, 140],
      [126, 146],
      [134, 136]
    ],
    "#c08560"
  );
  rect(g, 0, 170, 22, 30, "#5d7d38");
  rect(g, 138, 170, 22, 30, "#5d7d38");
  rect(g, 0, 170, 22, 2, "#44602a");
  rect(g, 138, 170, 22, 2, "#44602a");
}
function P_letter(g, r) {
  rect(g, 0, 0, PW, PH, "#22180f");
  speck(g, r, 0, 0, PW, PH, 120, ["#2c2014", "#1a120b"]);
  rect(g, 13, 13, 138, 178, "#0a0806");
  rect(g, 11, 11, 138, 178, "#e6dcc2");
  speck(g, r, 11, 11, 138, 178, 260, ["#d8ccae", "#ece4cc"]);
  pline(g, 11, 11, 148, 188, "#d2c4a2");
  pline(g, 148, 11, 11, 188, "#d2c4a2");
  pline(g, 80, 11, 80, 188, "#d6c9a8");
  for (let row = 0; row < 14; row++) {
    let x = 22 + (row === 0 ? 24 : 0);
    const y = 26 + row * 10;
    while (x < 138 - (row === 13 ? 56 : 0)) {
      const w = 5 + Math.floor(r() * 14);
      if (x + w > 138) break;
      for (let i = 0; i < w; i++) {
        const yy = y + Math.round(Math.sin((x + i) * 0.95 + row) * 1.4);
        g.fillStyle = r() < 0.85 ? "#3a3a7a" : "#5a5a9a";
        g.fillRect(x + i, yy, 1, 1);
        if (r() < 0.35) g.fillRect(x + i, yy - 1, 1, 1);
      }
      x += w + 4;
    }
  }
  for (let i = 0; i < 30; i++) rect(g, 96 + i, 166 + Math.round(Math.sin(i * 0.6) * 2), 1, 1, "#2a2a6a");
  disc(g, 126, 36, 13, 13, "#7a5aa0");
  disc(g, 126, 36, 11, 11, "#e6dcc2");
  disc(g, 126, 36, 9, 9, "#7a5aa0");
  disc(g, 126, 36, 7, 7, "#e6dcc2");
  rect(g, 119, 35, 15, 2, "#7a5aa0");
  rect(g, 121, 31, 11, 1, "#7a5aa0");
  rect(g, 121, 40, 11, 1, "#7a5aa0");
  for (let i = 0; i < 46; i += 2) {
    rect(g, 18 + i, 160, 1, 1, "#9a4040");
    rect(g, 18 + i, 176, 1, 1, "#9a4040");
  }
  rect(g, 18, 160, 1, 17, "#9a4040");
  rect(g, 64, 160, 1, 17, "#9a4040");
  for (let i = 0; i < 5; i++) rect(g, 22 + i * 8, 167, 6, 1, "#9a4040");
}
function P_room(g, r) {
  rect(g, 0, 0, PW, PH, "#16141c");
  speck(g, r, 0, 0, PW, 130, 120, ["#1c1a24", "#121018"]);
  rect(g, 104, 16, 44, 52, "#2e261a");
  rect(g, 107, 19, 38, 46, "#141e34");
  rect(g, 125, 19, 2, 46, "#2e261a");
  rect(g, 107, 41, 38, 2, "#2e261a");
  disc(g, 136, 28, 4, 4, "#e8e4c8");
  disc(g, 138, 27, 3, 3, "#141e34");
  [
    [112, 24],
    [116, 52],
    [140, 56],
    [110, 34],
    [132, 50]
  ].forEach(([x, y]) => rect(g, x, y, 1, 1, "#c8c8e0"));
  pline(g, 12, 44, 20, 130, "#5a5a60");
  pline(g, 13, 44, 21, 130, "#3a3a40");
  rect(g, 9, 62, 9, 7, "#22222a");
  rect(g, 10, 63, 4, 2, "#6ab050");
  ell(g, 22, 134, 9, 3, "#22222a", "#0a0a0e");
  rect(g, 0, 132, PW, 68, "#3e2c20");
  rect(g, 0, 132, PW, 3, "#5a4030");
  for (let y = 142; y < PH; y += 11) rect(g, 0, y, PW, 1, "#2e2016");
  glow(g, 44, 132, 40, "#7a5a34", 0.7);
  glow(g, 44, 132, 24, "#a8804a", 0.7);
  rect(g, 42, 118, 10, 14, "#3a3030");
  fillPoly(
    g,
    [
      [34, 106],
      [58, 106],
      [52, 94],
      [40, 94]
    ],
    "#c89a40"
  );
  rect(g, 34, 106, 24, 1, "#8a6a28");
  rect(g, 40, 106, 12, 2, "#f6e08a");
  rect(g, 70, 100, 50, 32, "#0a0a0e");
  rect(g, 71, 101, 48, 30, "#9a9aa0");
  rect(g, 73, 103, 44, 26, "#1e3a5a");
  for (let i = 0; i < 5; i++) {
    rect(g, 76, 106 + i * 5, 4, 4, "#e9c54a");
    rect(g, 82, 107 + i * 5, 10 + Math.floor(r() * 20), 1, "#8ab0d0");
  }
  rect(g, 64, 131, 62, 4, "#b8b8c0");
  glow(g, 95, 124, 34, "#2a4a6a", 0.6);
  for (let i = 0; i < 4; i++) {
    rect(g, 128 + i, 118 - i * 2, 26, 18, i % 2 ? "#e0dccf" : "#f2eee4");
    rect(g, 131 + i, 122 - i * 2, 14, 1, "#c0302a");
    rect(g, 131 + i, 126 - i * 2, 18, 1, "#9a9aa0");
  }
  rect(g, 22, 138, 10, 12, "#c0302a");
  rect(g, 31, 141, 3, 5, "#c0302a");
  rect(g, 22, 138, 10, 1, "#e06050");
  head(g, 92, 164, 1.15, { back: 1, hair: "#1e1812" });
  fillPoly(
    g,
    [
      [78, 152],
      [106, 152],
      [108, 146],
      [76, 146]
    ],
    "#76853f"
  );
  rect(g, 74, 150, 36, 3, "#525e2a");
  fillPoly(
    g,
    [
      [52, PH],
      [132, PH],
      [124, 176],
      [60, 176]
    ],
    "#44602a"
  );
  fillPoly(
    g,
    [
      [60, 176],
      [124, 176],
      [116, 170],
      [68, 170]
    ],
    "#5d7d38"
  );
  rect(g, 82, 158, 20, 1, "#5a7aa0");
}
function P_loan(g, r) {
  // гараж под залогом: ворота, шины, бумага с красной печатью, телефон с напоминанием
  rect(g, 0, 0, PW, PH, "#1a1814");
  for (let y = 0; y < 132; y += 8)
    for (let x = (y / 8) % 2 ? 0 : -10; x < PW; x += 20) {
      rect(g, x, y, 19, 7, "#3a2620");
      rect(g, x, y, 19, 1, "#4a3028");
    }
  rect(g, 26, 22, 108, 110, "#121210");
  rect(g, 28, 24, 104, 108, "#5a5e5c");
  for (let y = 26; y < 132; y += 6) {
    rect(g, 28, y, 104, 1, "#3e4240");
    rect(g, 28, y + 1, 104, 1, "#727674");
  }
  rect(g, 76, 70, 8, 4, "#2a2a28");
  speck(g, r, 28, 24, 104, 108, 90, ["#6e4a30", "#4a3a2a", "#7a5634"]);
  rect(g, 86, 40, 34, 42, "#0e0e0c");
  rect(g, 87, 41, 32, 40, "#ece6d6");
  rect(g, 90, 45, 26, 2, "#2a2a28");
  for (let i = 0; i < 5; i++) rect(g, 90, 51 + i * 4, 14 + Math.floor(r() * 12), 1, "#8a8478");
  disc(g, 108, 72, 7, 7, "#b8302a");
  disc(g, 108, 72, 5, 5, "#ece6d6");
  disc(g, 108, 72, 4, 4, "#b8302a");
  rect(g, 90, 41, 4, 3, "#c8b880");
  rect(g, 112, 41, 4, 3, "#c8b880");
  rect(g, 0, 132, PW, 68, "#2c2a26");
  rect(g, 0, 132, PW, 2, "#44403a");
  speck(g, r, 0, 134, PW, 66, 140, ["#36332e", "#24221e"]);
  [
    [14, 150],
    [14, 138],
    [16, 126]
  ].forEach(([x, y]) => {
    ell(g, x + 12, y, 14, 6, "#1a1a1a", "#0a0a0a");
    ell(g, x + 12, y - 1, 6, 2, "#2e2e2e");
  });
  fillPoly(
    g,
    [
      [96, PH],
      [140, PH],
      [136, 166],
      [104, 160]
    ],
    "#5d7d38"
  );
  fillPoly(
    g,
    [
      [104, 160],
      [136, 166],
      [132, 158],
      [108, 154]
    ],
    "#76853f"
  );
  rect(g, 98, 130, 30, 46, "#0a0a0e");
  rect(g, 100, 133, 26, 38, "#1e3a5a");
  glow(g, 113, 150, 30, "#3a6a9a", 0.5);
  rect(g, 102, 137, 22, 7, "#e9c54a");
  rect(g, 104, 139, 10, 1, "#1e3a5a");
  rect(g, 104, 141, 16, 1, "#1e3a5a");
  rect(g, 102, 148, 22, 9, "#c0302a");
  rect(g, 104, 150, 14, 1, "#ffd8c8");
  rect(g, 104, 153, 18, 1, "#ffd8c8");
  rect(g, 102, 160, 16, 1, "#8ab0d0");
  rect(g, 102, 164, 12, 1, "#8ab0d0");
}
function savelichSprite() {
  const W = 48,
    H = 58,
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  const R = (x, y, w, h, col) => {
    g.fillStyle = col;
    g.fillRect(x, y, w, h);
  };
  const E = (cx, cy, rx, ry, col) => {
    g.fillStyle = col;
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry + 0.01))));
      g.fillRect(cx - w, cy + y, w * 2 + 1, 1);
    }
  };
  const O = "#1e1712";
  // кардиган
  const poly = (pts, col) => {
    g.fillStyle = col;
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
  };
  poly(
    [
      [0, H],
      [1, 48],
      [7, 42],
      [16, 39],
      [32, 39],
      [41, 42],
      [47, 48],
      [48, H]
    ],
    O
  );
  poly(
    [
      [1, H],
      [2, 48],
      [8, 43],
      [16, 40],
      [32, 40],
      [40, 43],
      [46, 48],
      [47, H]
    ],
    "#6e4c30"
  );
  for (let y = 42; y < H; y += 2) for (let x = 2 + (y % 4 ? 1 : 0); x < 46; x += 3) R(x, y, 1, 1, "#5c3e26"); // вязка
  poly(
    [
      [32, 40],
      [40, 43],
      [46, 48],
      [47, H],
      [36, H]
    ],
    "#5a3c24"
  );
  // рубашка и вырез
  poly(
    [
      [18, 40],
      [24, 52],
      [30, 40]
    ],
    "#d8d0c0"
  );
  R(23, 44, 2, 8, "#b8b0a0");
  poly(
    [
      [16, 40],
      [22, 56],
      [18, H],
      [14, H]
    ],
    "#7e5a3a"
  );
  poly(
    [
      [32, 40],
      [26, 56],
      [30, H],
      [34, H]
    ],
    "#5e4028"
  );
  [50, 55].forEach(y => {
    R(21, y, 2, 2, O);
    R(21, y, 1, 1, "#c8a868");
  });
  // уши и голова
  E(12, 22, 2, 3, O);
  E(12, 22, 1, 2, "#c8946e");
  E(36, 22, 2, 3, O);
  E(36, 22, 1, 2, "#a87a58");
  E(24, 20, 11, 14, O);
  E(24, 20, 10, 13, "#dcae88");
  for (let y = 7; y < 34; y++)
    for (let x = 14; x < 35; x++) {
      const d = ((x - 24) / 10) ** 2 + ((y - 20) / 13) ** 2;
      if (d > 1) continue;
      if (x >= 29 && d > 0.28 && (x >= 32 || (x + y) % 2 === 0)) R(x, y, 1, 1, "#bb8c68");
      if (x >= 33 && d > 0.5) R(x, y, 1, 1, "#a07656");
    }
  E(20, 11, 4, 2, "#f0c8a2");
  R(19, 10, 3, 1, "#fadcbc"); // блик на лысине
  R(18, 14, 12, 1, "#c49870");
  R(19, 16, 10, 1, "#c49870"); // морщины на лбу
  // седые виски
  [
    [13, 17],
    [13, 19],
    [14, 21],
    [13, 23],
    [14, 25]
  ].forEach(([x, y]) => {
    R(x - 1, y, 3, 2, "#c8c4bc");
  });
  R(11, 16, 1, 10, O);
  [
    [35, 17],
    [35, 19],
    [34, 21],
    [35, 23],
    [34, 25]
  ].forEach(([x, y]) => {
    R(x - 1, y, 3, 2, "#a8a49c");
  });
  R(37, 16, 1, 10, O);
  // кустистые брови
  R(16, 19, 6, 2, "#d8d4cc");
  R(26, 19, 6, 2, "#c0bcb4");
  R(16, 19, 6, 1, "#ece8e0");
  // очки
  const lens = (cx, col) => {
    for (let a = 0; a < 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      R(Math.round(cx + Math.cos(t) * 4), Math.round(24 + Math.sin(t) * 3.5), 1, 1, "#2a221c");
    }
  };
  E(19, 24, 3, 3, "#e8d8c4");
  E(29, 24, 3, 3, "#d4c0aa");
  lens(19);
  lens(29);
  R(23, 23, 3, 1, "#2a221c");
  R(15, 23, -3, 1, "#2a221c");
  R(11, 23, 4, 1, "#2a221c");
  R(33, 23, 3, 1, "#2a221c");
  R(18, 24, 2, 2, "#2a3440");
  R(28, 24, 2, 2, "#2a3440");
  R(18, 24, 1, 1, "#6a7a8a");
  R(17, 22, 2, 1, "#ffffff");
  R(27, 22, 2, 1, "#f4f4f4");
  // нос
  R(24, 26, 1, 5, "#c49870");
  R(25, 27, 1, 4, "#a87a58");
  E(24, 31, 2, 1, "#d48a6e");
  R(23, 31, 1, 1, "#e8a888");
  // борода и усы
  E(24, 38, 11, 10, O);
  E(24, 38, 10, 9, "#cfcbc3");
  E(24, 33, 8, 3, "#cfcbc3");
  for (let k = 0; k < 70; k++) {
    const x = 15 + ((k * 7) % 19),
      y = 31 + ((k * 11) % 16);
    const d = ((x - 24) / 10) ** 2 + ((y - 38) / 9) ** 2;
    if (d < 0.95) R(x, y, 1, 2, k % 3 ? "#aeaaa2" : "#e2ded6");
  }
  for (let y = 30; y < 48; y++)
    for (let x = 29; x < 35; x++) {
      const d = ((x - 24) / 10) ** 2 + ((y - 38) / 9) ** 2;
      if (d < 0.95 && (x + y) % 2 === 0) R(x, y, 1, 1, "#a29e96");
    }
  R(19, 32, 11, 2, "#e6e2da");
  R(18, 33, 2, 1, "#cfcbc3");
  R(29, 33, 2, 1, "#b8b4ac");
  R(19, 34, 11, 1, "#a8a49c"); // усы
  R(22, 35, 5, 1, "#7a4a3e");
  R(23, 36, 3, 1, "#b07a68"); // рот
  R(24, 46, 1, 2, "#a8a49c");
  return c;
}

function savPic() {
  if (PANEL_IMG.savp) return PANEL_IMG.savp;
  const sp = savelichSprite(),
    c = document.createElement("canvas");
  c.width = sp.width;
  c.height = 40;
  const g = c.getContext("2d");
  g.fillStyle = "#d8c8a0";
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(sp, 0, -4);
  return (PANEL_IMG.savp = c.toDataURL());
}
function P_savelich(g, r) {
  rect(g, 0, 0, PW, PH, "#2a2218");
  rect(g, 8, 8, 144, 96, "#0a0806");
  rect(g, 10, 10, 140, 92, "#d8c8a0");
  [
    [30, 30, 16, 10, "#a8b878"],
    [70, 24, 12, 8, "#8aa8b8"],
    [120, 40, 20, 12, "#a8b878"],
    [50, 70, 18, 10, "#a8b878"],
    [110, 80, 14, 8, "#8aa8b8"]
  ].forEach(([x, y, a, b, c]) => disc(g, x, y, a, b, c));
  pline(g, 16, 90, 148, 26, "#6a8aa8");
  pline(g, 16, 91, 148, 27, "#6a8aa8");
  for (let i = 0; i < 120; i += 6) rect(g, 22 + i, 66 - i * 0.45, 3, 1, "#8a3a3a");
  [
    [40, 44],
    [86, 56],
    [124, 30],
    [64, 82],
    [100, 66]
  ].forEach(([x, y]) => {
    rect(g, x, y, 3, 3, "#c0302a");
    rect(g, x + 1, y + 3, 1, 4, "#4a4a4a");
  });
  {
    const sp = savelichSprite();
    g.imageSmoothingEnabled = false;
    g.drawImage(sp, 8, PH - sp.height * 3, sp.width * 3, sp.height * 3);
  }
}
function P_sumka(g, r) {
  rect(g, 0, 0, PW, PH, "#2a1e14");
  speck(g, r, 0, 0, PW, PH, 420, ["#3a2a1c", "#1e160e", "#4a3a26", "#8a3a28", "#6a3020"]);
  for (let k = 0; k < 26; k++) {
    const x = r() * PW,
      y = r() * 80;
    rect(g, x, y, 7, 4, "#7a3424");
    rect(g, x, y, 7, 1, "#9c4a32");
  }
  glow(g, 80, 110, 80, "#4a3826", 0.9);
  glow(g, 80, 110, 50, "#6a5034", 0.8);
  rect(g, 28, 64, 104, 68, "#0a0806");
  rect(g, 30, 66, 100, 64, "#5a3820");
  fillPoly(
    g,
    [
      [30, 66],
      [130, 66],
      [136, 26],
      [24, 26]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [31, 65],
      [129, 65],
      [134, 28],
      [26, 28]
    ],
    "#6a4428"
  );
  rect(g, 24, 26, 112, 3, "#4a2c18");
  rect(g, 74, 30, 12, 12, "#c8a040");
  rect(g, 77, 33, 6, 6, "#6a4428");
  rect(g, 40, 72, 80, 52, "#d8cca8");
  speck(g, r, 40, 72, 80, 52, 60, ["#c8bc98", "#b8ac88"]);
  for (let i = 0; i < 8; i++)
    for (let x = 46; x < 112; x += 2) if (r() < 0.65) rect(g, x, 78 + i * 5, 1, 1, "#4a4a6a");
  fillPoly(
    g,
    [
      [94, 72],
      [120, 72],
      [120, 104]
    ],
    "#a89870"
  );
  fillPoly(
    g,
    [
      [0, 170],
      [34, 144],
      [46, 156],
      [18, 186],
      [0, 188]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [0, 172],
      [34, 146],
      [44, 156],
      [18, 184],
      [0, 186]
    ],
    "#d8a882"
  );
  fillPoly(
    g,
    [
      [PW, 172],
      [126, 146],
      [116, 156],
      [142, 184],
      [PW, 186]
    ],
    "#d8a882"
  );
  rect(g, 0, 186, 22, 14, "#5d7d38");
  rect(g, 138, 186, 22, 14, "#5d7d38");
}
function capsH(g, x, y, len) {
  rect(g, x - 1, y - 1, len + 2, 12, "#0a0806");
  rect(g, x, y, len, 10, "#22201c");
  rect(g, x, y + 2, len, 2, "#5a564e");
  rect(g, x, y + 7, len, 2, "#141210");
  for (let i = x + 5; i < x + len; i += 5) rect(g, i, y, 1, 10, "#2e2c28");
}
function P_medal(g, r) {
  rect(g, 0, 0, PW, PH, "#22180f");
  speck(g, r, 0, 0, PW, PH, 500, ["#2e2216", "#18110a", "#3a2c1c", "#4a3a26"]);
  for (let k = 0; k < 7; k++) {
    let x = r() * PW,
      y = r() * 60;
    for (let j = 0; j < 30; j++) {
      const nx = x + (r() - 0.5) * 10,
        ny = y + 5;
      pline(g, x, y, nx, ny, "#4a3622");
      x = nx;
      y = ny;
    }
  }
  for (let k = 0; k < 10; k++) rect(g, r() * PW, r() * 96, 3, 1, "#4a6a6a");
  fillPoly(
    g,
    [
      [22, 40],
      [132, 24],
      [138, 52],
      [28, 70]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [24, 41],
      [131, 26],
      [136, 51],
      [29, 68]
    ],
    "#e6d8b6"
  );
  speck(g, r, 30, 32, 100, 30, 40, ["#cdbf98", "#d8c8a4"]);
  for (let i = 0; i < 5; i++)
    for (let x = 34; x < 124; x += 2)
      if (r() < 0.6) rect(g, x, Math.round(42 + i * 4.6 - (x - 34) * 0.15), 1, 1, "#4a4a7a");
  pline(g, 70, 34, 74, 62, "#c8b890");
  fillPoly(
    g,
    [
      [46, PH],
      [114, PH],
      [110, 170],
      [50, 170]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [48, PH],
      [112, PH],
      [108, 172],
      [52, 172]
    ],
    "#5d7d38"
  );
  rect(g, 48, 190, 64, 4, "#4a6a2c");
  rect(g, 52, 172, 56, 3, "#7a9a4a");
  ell(g, 80, 146, 36, 24, "#d8a882", "#2a1a12");
  for (let i = 0; i < 4; i++) {
    const fx = 54 + i * 15;
    ell(g, fx, 116 + Math.abs(i - 1.5) * 3, 7, 12, "#d8a882", "#2a1a12");
    ell(g, fx, 112 + Math.abs(i - 1.5) * 3, 5, 4, "#e8bc96");
    rect(g, fx - 3, 104 + Math.abs(i - 1.5) * 3, 6, 3, "#6a4a30");
  }
  ell(g, 80, 146, 35, 23, "#d8a882");
  ell(g, 76, 140, 26, 14, "#e6b892");
  pline(g, 56, 150, 96, 138, "#b8886a");
  pline(g, 62, 160, 104, 150, "#b8886a");
  ell(g, 118, 150, 8, 16, "#d8a882", "#2a1a12");
  ell(g, 116, 146, 5, 10, "#e6b892");
  for (let k = 0; k < 70; k++) {
    const a = r() * Math.PI * 2,
      d = r();
    rect(g, 80 + Math.cos(a) * 34 * d, 146 + Math.sin(a) * 22 * d, 2, 1, r() < 0.6 ? "#4a3622" : "#2e2216");
  }
  for (let k = 0; k < 30; k++) rect(g, 48 + r() * 64, 104 + r() * 14, 2, 1, "#4a3622");
  capsH(g, 52, 134, 44);
  rect(g, 97, 134, 1, 10, "#5a564e");
  rect(g, 100, 132, 10, 14, "#0a0806");
  rect(g, 101, 133, 8, 12, "#2a2824");
  for (let j = 134; j < 145; j += 2) rect(g, 101, j, 8, 1, "#3a3832");
  glow(g, 74, 128, 6, "#f0f0e0", 0.25);
}
function P_kitchen(g, r) {
  rect(g, 0, 0, PW, PH, "#2a2420");
  for (let x = 0; x < PW; x += 8) rect(g, x, 0, 1, 96, "#252019");
  rect(g, 10, 14, 40, 48, "#2e261a");
  rect(g, 13, 17, 34, 42, "#141e34");
  rect(g, 29, 17, 2, 42, "#2e261a");
  rect(g, 13, 37, 34, 2, "#2e261a");
  rect(g, 108, 0, 2, 18, "#3a3a3a");
  fillPoly(
    g,
    [
      [96, 30],
      [122, 30],
      [116, 18],
      [102, 18]
    ],
    "#c89a40"
  );
  rect(g, 96, 30, 26, 1, "#8a6a28");
  glow(g, 109, 44, 50, "#5a4630", 0.8);
  glow(g, 109, 60, 40, "#8a7050", 0.5);
  rect(g, 0, 96, PW, 104, "#c8d8c8");
  for (let y = 96; y < PH; y += 10)
    for (let x = (((y - 96) / 10) % 2) * 10; x < PW; x += 20) rect(g, x, y, 10, 10, "#a8c0b0");
  rect(g, 113, 80, 16, 30, "#0a0806");
  rect(g, 114, 81, 14, 28, "#d8e4e8");
  rect(g, 115, 86, 12, 22, "#a8502a");
  rect(g, 115, 86, 12, 2, "#c8703a");
  rect(g, 124, 86, 2, 22, "#c86a3a");
  rect(g, 121, 72, 1, 14, "#c8c8c8");
  rect(g, 111, 94, 20, 16, "#0a0806");
  rect(g, 112, 95, 18, 14, "#b8a878");
  for (let x = 113; x < 130; x += 3) rect(g, x, 96, 1, 12, "#8a7a50");
  rect(g, 112, 95, 18, 2, "#d8c898");
  rect(g, 130, 97, 6, 10, "#0a0806");
  rect(g, 131, 98, 4, 8, "#b8a878");
  rect(g, 132, 100, 2, 4, "#c8d8c8");
  rect(g, 110, 108, 22, 3, "#8a7a50");
  rect(g, 14, 96, 26, 34, "#0a0806");
  rect(g, 15, 97, 24, 32, "#efe6d0");
  rect(g, 17, 99, 20, 22, "#a8916a");
  head(g, 23, 108, 0.32, { pilotka: 1, skin: "#7a6a50", shade: "#6a5a40" });
  head(g, 31, 108, 0.32, { pilotka: 1, skin: "#7a6a50", shade: "#6a5a40" });
  rect(g, 44, 112, 14, 12, "#e8e8f0");
  rect(g, 44, 112, 14, 2, "#c8c8d0");
  fillPoly(
    g,
    [
      [0, PH],
      [0, 166],
      [40, 150],
      [54, 166],
      [30, PH]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [0, PH],
      [0, 168],
      [39, 152],
      [52, 166],
      [28, PH]
    ],
    "#5a4a5a"
  );
  fillPoly(
    g,
    [
      [PW, PH],
      [PW, 166],
      [120, 150],
      [106, 166],
      [130, PH]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [PW, PH],
      [PW, 168],
      [121, 152],
      [108, 166],
      [132, PH]
    ],
    "#5a4a5a"
  );
  ell(g, 64, 162, 22, 14, "#d8ac8c", "#2a1a12");
  ell(g, 96, 162, 22, 14, "#d8ac8c", "#2a1a12");
  ell(g, 64, 162, 21, 13, "#d8ac8c");
  ell(g, 96, 162, 21, 13, "#d8ac8c");
  ell(g, 62, 158, 14, 6, "#e6bc9c");
  ell(g, 98, 158, 14, 6, "#e6bc9c");
  for (let i = 0; i < 4; i++) {
    rect(g, 50 + i * 6, 170, 1, 5, "#a8785a");
    rect(g, 104 + i * 6, 170, 1, 5, "#a8785a");
  }
  for (let k = 0; k < 12; k++) {
    const x = 46 + r() * 68,
      y = 154 + r() * 16;
    rect(g, x, y, 3, 1, "#c09474");
  }
  capsH(g, 58, 146, 40);
  rect(g, 99, 146, 1, 10, "#5a564e");
  ell(g, 52, 150, 7, 5, "#d8ac8c", "#2a1a12");
  ell(g, 108, 150, 7, 5, "#d8ac8c", "#2a1a12");
  rect(g, 48, 148, 6, 1, "#a8785a");
  rect(g, 106, 148, 6, 1, "#a8785a");
}
