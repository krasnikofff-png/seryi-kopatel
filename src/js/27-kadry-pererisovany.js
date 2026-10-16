// ================= КАДРЫ (перерисованы) =================
function P_attic(g, r) {
  rect(g, 0, 0, PW, PH, "#120e0b");
  fillPoly(
    g,
    [
      [80, 4],
      [-4, 122],
      [164, 122]
    ],
    "#1e1610"
  );
  for (let y = 10; y < 120; y += 7) rect(g, 0, y, PW, 1, "#17110c");
  for (let y = 10; y < 120; y += 14) for (let x = (y * 5) % 37; x < PW; x += 37) rect(g, x, y, 1, 7, "#17110c");
  fillPoly(
    g,
    [
      [0, 0],
      [80, 4],
      [-4, 122],
      [0, 122]
    ],
    "#0d0a08"
  );
  fillPoly(
    g,
    [
      [PW, 0],
      [80, 4],
      [164, 122],
      [PW, 122]
    ],
    "#0d0a08"
  );
  for (let d = 10; d < 90; d += 14) {
    pline(g, 80 - d, 4, -4 - d, 122, "#1a140e");
    pline(g, 80 + d, 4, 164 + d, 122, "#1a140e");
  }
  pline(g, 80, 4, -4, 122, "#3a2c1e");
  pline(g, 80, 4, 164, 122, "#3a2c1e");
  rect(g, 0, 118, PW, 2, "#2c2016");
  ell(g, 80, 40, 10, 10, "#221a12", "#0a0806");
  disc(g, 80, 40, 8, 8, "#18243a");
  rect(g, 79, 32, 2, 17, "#0a0806");
  rect(g, 72, 39, 17, 2, "#0a0806");
  rect(g, 75, 36, 1, 1, "#c8d0e0");
  rect(g, 84, 44, 1, 1, "#c8d0e0");
  boardFloor(g, 118, "#2a1e14", "#1c140e", "#34261a");
  rect(g, 6, 96, 34, 26, "#3a2a1a");
  rect(g, 6, 96, 34, 2, "#4a3624");
  rect(g, 22, 96, 1, 26, "#22180e");
  rect(g, 10, 80, 24, 16, "#33251a");
  rect(g, 10, 80, 24, 2, "#45321f");
  rect(g, 120, 90, 4, 36, "#22180e");
  rect(g, 138, 90, 4, 36, "#22180e");
  rect(g, 120, 104, 22, 3, "#2c2014");
  rect(g, 120, 76, 4, 16, "#22180e");
  rect(g, 120, 76, 22, 3, "#2c2014");
  glow(g, 74, 150, 46, "#4a3824", 0.9);
  glow(g, 74, 152, 30, "#6a5034", 0.9);
  glow(g, 70, 154, 16, "#8a6a40", 0.8);
  rect(g, 58, 146, 26, 12, "#0a0806");
  rect(g, 59, 147, 24, 10, "#8a2e24");
  rect(g, 59, 147, 24, 2, "#d9b84a");
  rect(g, 59, 155, 24, 2, "#5e1e18");
  rect(g, 66, 148, 6, 1, "#f6e08a");
  drawFig(g, fig(F_SERYI), 112, 170);
  for (let i = 0; i < 14; i++) pline(g, 100, 146, 84 - i, 150 + i * 0.3, i % 2 ? "#6a5a30" : "#8a7440");
  rect(g, 98, 144, 6, 4, "#3a3a3a");
  rect(g, 96, 145, 2, 2, "#f6e08a");
}
function P_museum(g, r) {
  rect(g, 0, 0, PW, PH, "#3a3024");
  for (let x = 0; x < PW; x += 16) rect(g, x, 0, 1, 124, "#33291e");
  rect(g, 0, 124, PW, 76, "#2a2016");
  rect(g, 0, 124, PW, 3, "#4a3c2a");
  glow(g, 80, 4, 70, "#5a4a32", 0.8);
  rect(g, 72, 0, 16, 4, "#2a2018");
  rect(g, 76, 4, 8, 4, "#e8c870");
  for (let s = 0; s < 3; s++) {
    const y = 30 + s * 28;
    rect(g, 4, y, 52, 3, "#5a4028");
    rect(g, 4, y + 3, 52, 1, "#1e140c");
    rect(g, 104, y, 52, 3, "#5a4028");
    rect(g, 104, y + 3, 52, 1, "#1e140c");
  }
  ell(g, 16, 24, 8, 6, "#4a5a34", "#1a2010");
  rect(g, 8, 25, 17, 4, "#4a5a34");
  [30, 35, 40, 45].forEach(x => {
    rect(g, x, 14, 4, 16, "#b89a50");
    rect(g, x, 14, 4, 2, "#e0c070");
  });
  rect(g, 8, 48, 44, 3, "#4a3020");
  rect(g, 8, 51, 8, 6, "#4a3020");
  rect(g, 40, 46, 3, 8, "#6a6a6a");
  rect(g, 10, 74, 14, 20, "#d8c8a0");
  rect(g, 12, 76, 10, 15, "#8a7a5a");
  rect(g, 30, 76, 18, 16, "#5a4632");
  rect(g, 110, 14, 16, 16, "#d8c8a0");
  rect(g, 112, 16, 12, 12, "#8a7a5a");
  disc(g, 140, 24, 6, 6, "#8a7a40");
  rect(g, 108, 46, 40, 6, "#6a5a3a");
  rect(g, 110, 72, 10, 16, "#4a3a2a");
  rect(g, 130, 70, 16, 18, "#7a2a24");
  rect(g, 0, 150, 64, 50, "#5a4028");
  rect(g, 2, 138, 60, 14, "#7aa0b0");
  rect(g, 2, 138, 60, 1, "#c8e0e8");
  for (let i = 0; i < 6; i++) {
    disc(g, 9 + i * 9, 146, 2, 2, i % 2 ? "#d9b84a" : "#c0302a");
    rect(g, 8 + i * 9, 141, 3, 3, i % 2 ? "#5a7aa0" : "#c0302a");
  }
  drawFig(g, fig(Object.assign({}, F_SAV, { id: "savUp", armL: "up" })), 110, 198, 2);
  fillPoly(
    g,
    [
      [58, 58],
      [84, 48],
      [78, 72]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [60, 58],
      [83, 49],
      [78, 70]
    ],
    "#e8dcc0"
  );
  pline(g, 60, 58, 78, 61, "#b8a888");
  pline(g, 83, 49, 78, 61, "#b8a888");
  rect(g, 76, 58, 6, 6, "#dcae88");
  rect(g, 76, 58, 6, 1, SO);
}
function P_forestdig(g, r) {
  grad(g, 0, 0, PW, 62, "#94b0c2", "#d4ddd6");
  cloud(g, 34, 16, 30);
  cloud(g, 124, 28, 22);
  farForest(g, r, 64, 26, "#5e7a76", "#6a8682");
  rect(g, 0, 63, PW, 6, "#4e6a5c");
  for (let i = 0; i < 13; i++) spruce3(g, i * 13 + r() * 6 - 2, 80, 40 + r() * 26, PAL_SPR);
  grad(g, 0, 78, PW, 122, "#4a6c3c", "#5e8846");
  speck(g, r, 0, 78, PW, 122, 700, ["#557a40", "#3e5e30", "#6a9a4c", "#4a7038"]);
  // окоп: заросший бруствер ломаной линией
  const tr = x => {
    const p = ((x + 8) % 34) / 34;
    return Math.round(146 + (p < 0.5 ? p : 1 - p) * 14 - (x - 40) * 0.06);
  };
  for (let x = 24; x < PW; x++) {
    const y = tr(x);
    rect(g, x, y - 7, 1, 2, "#7c9e56");
    rect(g, x, y - 5, 1, 4, (x * 7) % 5 ? "#62844a" : "#6e6040");
    rect(g, x, y - 1, 1, 1, "#3e5630");
    rect(g, x, y, 1, 3, "#1c2216");
    rect(g, x, y + 3, 1, 2, "#4a3a26");
    rect(g, x, y + 5, 1, 1, "#3a5230");
  }
  for (let k = 0; k < 50; k++) {
    const x = 24 + r() * 136,
      y = tr(Math.round(x)) - 8;
    rect(g, x, y, 1, 2, "#8ab460");
    rect(g, x + 1, y + 1, 1, 1, "#4a7038");
  }
  // тропа
  for (let y = 78; y < PH; y++) {
    const x = Math.round(6 + Math.sin(y * 0.06) * 14 + (y - 78) * 0.08),
      w = 8 + (y - 78) * 0.07;
    rect(g, x - 2, y, 2, 1, "#3e5a2e");
    rect(g, x, y, w, 1, "#6a5236");
    rect(g, x + w, y, 2, 1, "#8a6e46");
    if (y % 3 === 0) rect(g, x + 2 + (y % 5), y, 2, 1, "#4a3a24");
  }
  tufts(g, r, 0, 126, PW, 74, 90, ["#7aaa58", "#3a5a2c", "#6a9a4c"]);
  for (let k = 0; k < 10; k++) {
    const x = 40 + r() * 120,
      y = 140 + r() * 56;
    rect(g, x, y, 1, 1, "#f4f0d8");
    rect(g, x, y - 1, 1, 1, "#f4f0d8");
  }
  birch3(g, 138, 150, 92, { leaf: ["#8ab84a", "#5e8a38"] });
  birch3(g, 10, 110, 58, { leaf: ["#8ab84a", "#5e8a38"], w: 3 });
  // яма у бруствера
  ell(g, 104, 172, 22, 8, "#5e4a30", "#2a2014");
  ell(g, 104, 171, 17, 5, "#3a2c1c");
  ell(g, 104, 172, 13, 3, "#2a2014");
  for (let k = 0; k < 24; k++) rect(g, 82 + r() * 44, 162 + r() * 18, 2, 1, r() < 0.5 ? "#6a5234" : "#4a3a24");
  ell(g, 107, 171, 5, 2, "#9aa0a4", "#3a3a3a");
  rect(g, 105, 170, 4, 1, "#e8ecee");
  rect(g, 108, 172, 2, 1, "#5a5a60");
  pline(g, 128, 154, 150, 130, "#6a6a70");
  pline(g, 128, 155, 150, 131, "#4a4a50");
  ell(g, 126, 156, 7, 3, "#2a2a30", "#0a0a0e");
  drawFig(g, fig(F_SERYI), 66, 184);
}
function P_dugout42(g, r) {
  rect(g, 0, 0, PW, PH, "#2a1e14");
  for (let y = 0; y < PH; y += 9) rect(g, 0, y, PW, 1, "#22180f");
  speck(g, r, 0, 0, PW, PH, 200, ["#33251a", "#1e150d"]);
  const k = kit(124, 150),
    q = k.g,
    W = 124,
    H = 150;
  // зимний березняк, ноябрь
  for (let y = 0; y < H; y++) {
    const t = y / H;
    q.fillStyle = t < 0.55 ? ((y * 7) % 4 ? "#cfcfc6" : "#c4c4ba") : "#e8e8e0";
    q.fillRect(0, y, W, 1);
  }
  for (let i = 0; i < 9; i++) {
    const x = 4 + i * 14 + ((i * 37) % 7),
      h = 60 + ((i * 23) % 30);
    q.fillStyle = "#1a1610";
    q.fillRect(x - 1, 84 - h, 5, h);
    q.fillStyle = "#ece8dc";
    q.fillRect(x, 84 - h, 3, h);
    q.fillStyle = "#9a968c";
    q.fillRect(x + 2, 84 - h, 1, h);
    for (let j = 84 - h + 3; j < 84; j += 4 + (j % 3)) q.fillRect(x, j, 2, 1);
    q.fillStyle = "#6a645a";
    for (let b = 0; b < 3; b++) {
      const by = 84 - h + 8 + b * 12;
      for (let s = 0; s < 8; s++) q.fillRect(x + (b % 2 ? 3 + s : -s), by - s, 1, 1);
    }
  }
  q.fillStyle = "#f0f0e8";
  q.fillRect(0, 84, W, 66);
  for (let n = 0; n < 220; n++) {
    q.fillStyle = n % 3 ? "#d8d8ce" : "#b8b8ae";
    q.fillRect((n * 53) % W, 84 + ((n * 31) % 66), 2, 1);
  }
  // блиндаж: накат из брёвен
  for (let j = 0; j < 5; j++) {
    q.fillStyle = SO;
    q.fillRect(64, 70 + j * 5, 58, 5);
    q.fillStyle = j % 2 ? "#5a4a3a" : "#6a5a46";
    q.fillRect(65, 71 + j * 5, 56, 3);
    q.fillStyle = "#8a7a5a";
    q.fillRect(64, 71 + j * 5, 2, 3);
  }
  q.fillStyle = "#f4f4ee";
  q.fillRect(64, 67, 58, 4);
  q.fillStyle = "#1a1410";
  q.fillRect(86, 80, 16, 16);
  q.fillStyle = "#3a2e22";
  q.fillRect(86, 80, 2, 16);
  q.fillRect(100, 80, 2, 16);
  q.imageSmoothingEnabled = false;
  q.drawImage(
    fig(Object.assign({}, F_SOLD, { id: "ded42", mustache: 0, stubble: 0, coat: "#6a6a4a", strap: 1 })),
    -24 + 30,
    150 - 75 - 2,
    48,
    76
  );
  q.drawImage(
    fig(Object.assign({}, F_SOLD, { id: "lykov42", stubble: 1, coat: "#5e5e44", hair: "short", seed: 3 })),
    -24 + 60,
    150 - 73 - 2,
    48,
    76
  );
  // дым самокрутки
  for (let i = 0; i < 10; i++) {
    q.fillStyle = "#f4f4ee";
    q.fillRect(36 + Math.round(Math.sin(i) * 2), 76 - i * 3, 1, 1);
  }
  const ph = oldPhoto(k.c, 1);
  g.imageSmoothingEnabled = false;
  rect(g, 16, 14, ph.width + 2, ph.height + 2, "#0a0806");
  g.drawImage(ph, 15, 12);
  g.imageSmoothingEnabled = false;
}
function P_borzy(g, r) {
  grad(g, 0, 0, PW, 92, "#4a5a5c", "#7a8a8a");
  cloud(g, 40, 18, 34, "#8a9898", "#6a7a7c");
  farForest(g, r, 70, 20, "#2a3c34", "#33463c");
  for (let i = 0; i < 11; i++) spruce3(g, i * 16 + r() * 6 - 4, 96, 48 + r() * 26, PAL_SPR_D);
  rect(g, 0, 94, PW, 106, "#4a4234");
  speck(g, r, 0, 94, PW, 106, 300, ["#3a3428", "#5a5040", "#3e4a2c"]);
  // его машина: старый «уазик»
  rect(g, 96, 78, 64, 42, "#0a0806");
  rect(g, 97, 92, 63, 26, "#4a5a3a");
  rect(g, 102, 79, 52, 14, "#3e4e30");
  rect(g, 105, 81, 20, 10, "#7a98a4");
  rect(g, 128, 81, 22, 10, "#7a98a4");
  rect(g, 105, 81, 20, 2, "#a8c4cc");
  rect(g, 128, 81, 22, 2, "#a8c4cc");
  rect(g, 97, 92, 63, 2, "#5e6e48");
  rect(g, 97, 110, 63, 3, "#2a3420");
  disc(g, 112, 118, 7, 7, "#141210");
  disc(g, 112, 118, 3, 3, "#4a4a48");
  disc(g, 148, 118, 7, 7, "#141210");
  disc(g, 148, 118, 3, 3, "#4a4a48");
  g.imageSmoothingEnabled = false;
  g.drawImage(borzyBust(), 8, PH - 58 * 3 + 6, 48 * 3, 58 * 3);
  // рука с купюрами
  for (let i = 0; i < 4; i++) {
    const x = 106 + i * 4,
      y = 146 - i * 5;
    rect(g, x - 1, y - 1, 32, 18, "#3a1a10");
    rect(g, x, y, 30, 16, i % 2 ? "#e07a48" : "#d8683a");
    rect(g, x + 3, y + 3, 8, 8, "#f0a070");
    rect(g, x + 15, y + 4, 12, 1, "#a84a28");
    rect(g, x + 15, y + 8, 9, 1, "#a84a28");
  }
  ell(g, 120, 170, 11, 8, "#d8a07a", SO);
  rect(g, 110, 166, 12, 2, "#b47e5a");
  rect(g, 112, 170, 10, 1, "#b47e5a");
  rect(g, 126, 164, 4, 8, "#bc8a64");
}
function P_hq(g, r) {
  rect(g, 0, 0, PW, PH, "#4a3a2a");
  for (let y = 0; y < 128; y += 12) {
    rect(g, 0, y, PW, 2, "#3a2c1e");
    rect(g, 0, y + 2, PW, 1, "#5a4834");
  }
  rect(g, 0, 128, PW, 72, "#33261a");
  boardFloor(g, 128, "#33261a", "#2a1e14");
  rect(g, 118, 24, 34, 104, "#0a0806");
  rect(g, 120, 26, 30, 102, "#14100c");
  drawFig(
    g,
    fig(Object.assign({}, F_SOLD, { id: "officer", coat: "#4a4a36", hat: "pilotka", strap: 1, mustache: 0 })),
    135,
    126
  );
  rect(g, 6, 116, 104, 10, "#6a4a2a");
  rect(g, 6, 116, 104, 2, "#8a6a40");
  rect(g, 10, 126, 5, 60, "#4a3220");
  rect(g, 100, 126, 5, 60, "#4a3220");
  rect(g, 16, 106, 56, 12, "#c8b890");
  pline(g, 20, 110, 66, 108, "#6a5a4a");
  pline(g, 24, 113, 62, 112, "#6a5a4a");
  rect(g, 40, 108, 3, 3, "#8a3a3a");
  glow(g, 88, 104, 44, "#8a6a3a", 0.8);
  glow(g, 88, 104, 24, "#c09050", 0.7);
  rect(g, 86, 100, 4, 16, "#f0e8d0");
  rect(g, 87, 96, 2, 4, "#ffd070");
  disc(g, 88, 94, 2, 3, "#fff0a0");
  drawFig(g, fig(Object.assign({}, F_SOLD, { id: "hqsold", hat: null, hair: "short", mustache: 1, seed: 5 })), 44, 190);
  sepia3(g);
  glow(g, 88, 96, 10, "#f0c070", 0.6);
}
function P_train(g, r) {
  grad(g, 0, 0, PW, 40, "#e09068", "#e8b484");
  grad(g, 0, 40, PW, 46, "#e8b484", "#c8846a");
  disc(g, 44, 66, 15, 15, "#f8d890");
  disc(g, 44, 66, 12, 12, "#fce8b0");
  for (let x = 0; x < PW; x += 11) {
    const h = 6 + ((x * 7) % 11);
    rect(g, x, 86 - h, 10, h, "#6a4a4a");
    if (x % 3 === 0) rect(g, x + 3, 86 - h + 3, 2, 2, "#f0c070");
  }
  rect(g, 0, 86, PW, 6, "#5a5050");
  rect(g, 0, 94, PW, 2, "#9a9090");
  rect(g, 0, 102, PW, 2, "#9a9090");
  for (let x = 0; x < PW; x += 10) rect(g, x, 92, 4, 14, "#4a3a2a");
  rect(g, 0, 108, PW, 92, "#8a8478");
  rect(g, 0, 108, PW, 4, "#d8d0b8");
  rect(g, 0, 112, PW, 1, "#5a5448");
  speck(g, r, 0, 113, PW, 87, 160, ["#7a7468", "#9a9488"]);
  for (let x = 0; x < PW; x += 20) rect(g, x, 113, 1, 87, "#7a7468");
  rect(g, 130, 26, 4, 82, "#2a2a2a");
  rect(g, 118, 22, 30, 14, "#0a0a0a");
  rect(g, 119, 23, 28, 12, "#2a4a8a");
  rect(g, 122, 27, 22, 1, "#c8d8f0");
  rect(g, 122, 30, 16, 1, "#c8d8f0");
  rect(g, 10, 148, 140, 5, "#5a3a20");
  rect(g, 10, 148, 140, 1, "#7a5a34");
  rect(g, 14, 153, 4, 22, "#3a2614");
  rect(g, 142, 153, 4, 22, "#3a2614");
  rect(g, 10, 134, 140, 4, "#5a3a20");
  rect(g, 10, 134, 140, 1, "#7a5a34");
  drawFig(
    g,
    fig(
      Object.assign({}, F_NYURA, {
        id: "nyuraBox",
        armL: "box",
        armR: "box",
        box: 1,
        seed: 1,
        boxC: "#8a6a40"
      })
    ),
    52,
    186
  );
  drawFig(g, fig(Object.assign({}, F_SERYI, { id: "seryiDet", detector: 1 })), 108, 186);
  rect(g, 0, 186, PW, 1, "#6a6458");
}
function P_nyura(g, r) {
  rect(g, 0, 0, PW, PH, "#5a4a3a");
  for (let y = 0; y < PH; y += 10) {
    rect(g, 0, y, PW, 1, "#4a3a2c");
    rect(g, 0, y + 1, PW, 1, "#6a5848");
  }
  rect(g, 108, 14, 40, 50, "#3a2a1c");
  rect(g, 111, 17, 34, 44, "#8ab0c8");
  rect(g, 127, 17, 2, 44, "#3a2a1c");
  rect(g, 111, 38, 34, 2, "#3a2a1c");
  rect(g, 111, 17, 34, 4, "#c8dce8");
  fillPoly(
    g,
    [
      [104, 14],
      [116, 14],
      [112, 70],
      [104, 70]
    ],
    "#a83a3a"
  );
  rect(g, 8, 24, 26, 32, "#2a1e14");
  rect(g, 10, 26, 22, 28, "#c8b890");
  rect(g, 12, 28, 18, 18, "#8a7a5a");
  glow(g, 80, 110, 70, "#6a5848", 0.6);
  g.imageSmoothingEnabled = false;
  g.drawImage(nyuraBust(), 8, PH - 58 * 3 + 8, 48 * 3, 58 * 3);
}
function P_gat42(g, r) {
  grad(g, 0, 0, PW, 96, "#d0d0c8", "#b0b0a8");
  farForest(g, r, 92, 18, "#8a8a82", "#9a9a92");
  rect(g, 0, 92, PW, 108, "#6a6a58");
  speck(g, r, 0, 92, PW, 108, 300, ["#5a5a48", "#7a7a68", "#4a5a48"]);
  for (let k = 0; k < 9; k++) {
    const x = r() * PW,
      h = 24 + r() * 26,
      y = 96 + r() * 6;
    rect(g, x, y - h, 2, h, "#3a3a32");
    pline(g, x + 1, y - h + 10, x - 7, y - h + 2, "#3a3a32");
    pline(g, x + 1, y - h + 18, x + 7, y - h + 9, "#3a3a32");
  }
  for (let y = 94; y < PH; y += 2) {
    const t = (y - 92) / 108,
      w = Math.round(5 + t * 68),
      c = (y >> 1) % 2 ? "#8a7a5a" : "#7a6a4a";
    rect(g, 80 - w - 1, y, w * 2 + 2, 2, "#3a2e1e");
    rect(g, 80 - w, y, w * 2, 1, c);
    rect(g, 80 - w, y + 1, w * 2, 1, "#5a4a30");
    if (t > 0.3) for (let x = 80 - w; x < 80 + w; x += 7 + Math.round(t * 10)) rect(g, x, y, 1, 2, "#4a3a24");
  }
  for (let k = 0; k < 180; k++) {
    const x = r() * PW,
      y = 94 + r() * 106,
      t = (y - 92) / 108;
    if (Math.abs(x - 80) < 7 + t * 70) continue;
    rect(g, x, y - 5, 1, 5, "#3a4a30");
    if (r() < 0.3) rect(g, x, y - 7, 1, 2, "#6a4a2a");
  }
  for (let k = 0; k < 40; k++) {
    const x = r() * PW,
      y = 110 + r() * 90;
    if (Math.abs(x - 80) < 10 + (y - 92) * 0.66) continue;
    rect(g, x, y, 3, 1, "#8a9a90");
  }
  const sb = Object.assign({}, F_SOLD, {
    back: 1,
    pack: 1,
    packC: "#5a5040",
    hat: "pilotka",
    hairC: "#3a2e22"
  });
  fog(g, 60, 100, "#e8e8e0", 0.3);
  [
    [84, 104],
    [78, 100],
    [82, 97]
  ].forEach(([x, y], i) => {
    rect(g, x - 1, y - 9 + i, 3, 9 - i, "#2a2a22");
    rect(g, x - 1, y - 11 + i, 3, 2, "#2a2a22");
  });
  fog(g, 80, 120, "#e8e8e0", 0.16);
  drawFig(g, fig(Object.assign({}, sb, { id: "sb2", seed: 3 })), 76, 170);
  fog(g, 120, PH, "#e8e8e0", 0.12);
  sepia3(g);
  glow(g, 124, 88, 7, "#ff9a40", 0.9);
  rect(g, 123, 87, 3, 2, "#ffc070");
}
function P_burial(g, r) {
  grad(g, 0, 0, PW, 128, "#94c4e0", "#d4e6ee");
  cloud(g, 30, 22, 30);
  cloud(g, 128, 14, 22);
  for (let i = 0; i < 6; i++)
    birch3(g, 4 + i * 30 + r() * 6, 132, 78 + r() * 30, { leaf: ["#9ac858", "#6a9a3e"], w: 3 });
  rect(g, 0, 128, PW, 72, "#5e8e44");
  speck(g, r, 0, 128, PW, 72, 300, ["#6e9e4e", "#4e7e38", "#f4f4ea"]);
  tufts(g, r, 0, 132, PW, 68, 60, ["#7aae58", "#4a7a38"]);
  rect(g, 70, 48, 22, 86, "#0a0806");
  rect(g, 71, 49, 20, 84, "#ece8dc");
  rect(g, 86, 49, 5, 84, "#c8c4b8");
  rect(g, 72, 49, 2, 84, "#f8f6f0");
  fillPoly(
    g,
    [
      [70, 48],
      [92, 48],
      [81, 30]
    ],
    "#0a0806"
  );
  fillPoly(
    g,
    [
      [72, 48],
      [90, 48],
      [81, 32]
    ],
    "#ece8dc"
  );
  [
    [0, -5],
    [1, -3],
    [5, -1],
    [2, 1],
    [3, 5],
    [0, 3],
    [-3, 5],
    [-2, 1],
    [-5, -1],
    [-1, -3],
    [0, 0],
    [0, -4],
    [1, 0],
    [-1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
    [0, 2],
    [2, 0],
    [-2, 0]
  ].forEach(([a, b]) => rect(g, 81 + a, 70 + b, 1, 1, "#c0302a"));
  ell(g, 81, 142, 30, 8, "#5a3a24", "#2a1a10");
  for (let k = 0; k < 22; k++) {
    const x = 56 + r() * 50,
      y = 138 + r() * 8;
    rect(g, x, y, 2, 2, "#ffffff");
    rect(g, x, y, 1, 1, "#f0c93c");
  }
  const sr = Object.assign({}, F_BORZY, {
    id: "poisk",
    smirk: 0,
    stubble: 0,
    hair: "short",
    hairC: "#4a3a2a",
    coat: "#4a5a2a",
    legs: "#3a4428",
    seed: 9
  });
  drawFig(g, fig(sr), 14, 166);
  drawFig(g, fig(Object.assign({}, sr, { id: "poisk2", seed: 4, skin: "#e2a97e" })), 148, 164);
  drawFig(g, fig(Object.assign({}, F_NYURA, { id: "nyuraF", armR: "flowers" })), 44, 194);
  drawFig(g, fig(F_SAV), 120, 194);
}
function P_borzy2(g, r) {
  grad(g, 0, 0, PW, 96, "#9aa8a8", "#7a8a8a");
  rect(g, 0, 92, PW, 108, "#4a5a50");
  speck(g, r, 0, 92, PW, 108, 200, ["#3e4e44", "#5a6a5e"]);
  for (let k = 0; k < 7; k++) {
    const x = r() * PW,
      h = 36 + r() * 16;
    rect(g, x, 94 - h, 2, h, "#3a4440");
    pline(g, x + 1, 94 - h + 12, x - 8, 94 - h + 2, "#3a4440");
    pline(g, x + 1, 94 - h + 20, x + 6, 94 - h + 12, "#3a4440");
  }
  fillPoly(
    g,
    [
      [72, 86],
      [88, 86],
      [150, PH],
      [10, PH]
    ],
    "#6a5a40"
  );
  for (let y = 88; y < PH; y += 3) {
    const w = 8 + (y - 86) * 0.6;
    rect(g, 80 - w, y, w * 2, 2, "#5a4a30");
    rect(g, 80 - w, y + 2, w * 2, 1, "#3a2a1c");
  }
  fog(g, 30, 120, "#d8e0dc", 0.3);
  drawFig(g, fig(Object.assign({}, F_BORZY, { id: "borzyOut", armR: "out", cig: 1 })), 90, 176, 2);
  fog(g, 120, 150, "#d8e0dc", 0.12);
  const sil = fig(
    Object.assign({}, F_SERYI, {
      id: "seryiBack",
      back: 1,
      coat: "#141412",
      legs: "#141412",
      boots: "#141412",
      hatC: "#141412",
      hairC: "#141412",
      packC: "#1e1e1a",
      skin: "#141412",
      line: "#0a0a08"
    })
  );
  drawFig(g, sil, 30, 232, 2);
}

Object.assign(PANELS, {
  attic: P_attic,
  box: P_box,
  letter: P_letter,
  room: P_room,
  loan: P_loan,
  museum: P_museum,
  savelich: P_savelich,
  forestdig: P_forestdig,
  dugout42: P_dugout42,
  borzy: P_borzy,
  hq: P_hq,
  sumka: P_sumka,
  train: P_train,
  nyura: P_nyura,
  gat42: P_gat42,
  medal: P_medal,
  burial: P_burial,
  kitchen: P_kitchen,
  borzy2: P_borzy2
});

let comicQ = null;
function showComic(id, done) {
  const C = COMICS[id],
    el = $("comic");
  let i = 0;
  const render = () => {
    const p = C.pages[i];
    el.innerHTML = `<div class="cm"><div class="cm-top"><span>${C.title}</span><button class="cm-skip" onclick="SK.comicEnd()">Пропустить</button></div>
      <div class="cm-frame" onclick="SK.comicNext()"><img src="${panelPic(p.p)}" style="${panelFy(p.p)}" alt=""><div class="cm-cap${p.say ? " say" : ""}">${p.cap}</div></div>
      <div class="cm-nav"><span class="cm-dots">${C.pages.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</span><button class="cm-next" onclick="SK.comicNext()">${i < C.pages.length - 1 ? "Дальше" : "Закрыть"}</button></div></div>`;
  };
  comicQ = {
    next: () => {
      if (i < C.pages.length - 1) {
        i++;
        render();
        SFX.paper();
      } else comicQ.end();
    },
    end: () => {
      el.hidden = true;
      el.innerHTML = "";
      comicQ = null;
      if (done) done();
    }
  };
  render();
  el.hidden = false;
  SFX.story();
}
const CLUES = [
  {
    id: "letter",
    ch: "Пролог",
    name: "Письмо деда",
    text: "Треугольник, октябрь 1942: «…речка петлёй, на горе барский дом с колоннами. Нюрке скажи — вернусь»."
  },
  {
    id: "pp",
    ch: "Глава 1",
    name: "Полевая почта 49127",
    text: "Савельич: стрелковый полк, осенью 1942-го держал оборону в лесах Области."
  },
  {
    id: "zheton",
    ch: "Глава 2",
    name: "Жетон однополчанина",
    text: "Жетон 4-17. Савельич нашёл по номеру: рядовой Фёдор Лыков, из одного взвода с дедом."
  },
  {
    id: "photo",
    ch: "Глава 2",
    name: "Фотография у блиндажа",
    text: "Серов и Лыков у блиндажа, ноябрь 1942. На обороте: «Гнилой брод». Отдала внучка Фёдора."
  },
  {
    id: "sumka",
    ch: "Глава 3",
    name: "Полевая сумка с донесением",
    text: "Штаб в усадьбе: «Группу ст. сержанта Серова — к упавшему самолёту, остров за Гнилым бродом». Ответа нет."
  },
  {
    id: "kotelok",
    ch: "Глава 4",
    name: "Котелок Гуревича",
    text: "Ефрейтор Семён Гуревич, из группы деда. Котелок лежал у просеки за окопами: группа ушла из леса на север, к болотам."
  },
  {
    id: "flyaga",
    ch: "Глава 4",
    name: "Фляга Ахметова",
    text: "Рядовой Ильяс Ахметов, из группы деда. Фляга нашлась у Гнилого брода: группа дошла до болота."
  },
  {
    id: "nyura",
    ch: "Глава 5",
    name: "Рассказ бабы Нюры",
    text: "Младшая сестра деда: солдаты ушли по гати к самолёту и не вернулись. Их костёр был у сухой берёзы на острове. Дорогу по гати покажет, когда Серый рассчитается с долгами."
  },
  {
    id: "medal",
    ch: "Глава 6",
    name: "Смертный медальон",
    text: "Записка: «Серов Андрей Михайлович, 1912…». Дед нашёлся."
  }
];
function dedPhoto() {
  const W = 48,
    H = 60,
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
      const w = Math.round(rx * Math.sqrt(1 - (y * y) / (ry * ry + 0.01)));
      g.fillRect(cx - w, cy + y, w * 2 + 1, 1);
    }
  };
  // студийный фон: светлее за головой
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - 24, y - 24) / 34;
      const v = Math.round(178 - d * 60);
      R(x, y, 1, 1, `rgb(${v},${v},${v - 6})`);
    }
  // плечи и гимнастёрка
  const P = [
    [0, 60],
    [0, 49],
    [6, 44],
    [15, 41],
    [33, 41],
    [42, 44],
    [48, 49],
    [48, 60]
  ];
  g.fillStyle = "#3b3d30";
  g.beginPath();
  P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.fill();
  R(2, 47, 10, 13, "#4a4c3c");
  R(36, 47, 10, 13, "#33352a");
  R(0, 45, 4, 2, "#55574a");
  R(44, 45, 4, 2, "#2a2c22"); // погонов нет — 1941, петлицы
  // шея
  R(19, 38, 10, 5, "#9a8a7a");
  R(19, 38, 3, 5, "#b09e8a");
  R(26, 38, 3, 5, "#7e6e60");
  R(19, 41, 10, 2, "#6e6052");
  // стоячий воротник и петлицы
  g.fillStyle = "#2c2e24";
  g.beginPath();
  g.moveTo(15, 41);
  g.lineTo(24, 49);
  g.lineTo(33, 41);
  g.lineTo(30, 40);
  g.lineTo(24, 45);
  g.lineTo(18, 40);
  g.fill();
  R(13, 42, 5, 3, "#5a3a34");
  R(30, 42, 5, 3, "#5a3a34");
  R(14, 43, 1, 1, "#c8b890");
  R(16, 43, 1, 1, "#c8b890");
  R(31, 43, 1, 1, "#c8b890");
  R(33, 43, 1, 1, "#c8b890");
  // планка и пуговицы
  R(23, 49, 2, 11, "#2a2c22");
  [51, 56].forEach(y => {
    R(23, y, 2, 2, "#9a9478");
    R(23, y, 1, 1, "#c8c2a2");
  });
  // голова (крупнее, погрудный портрет)
  E(24, 27, 10, 13, "#1e1a16");
  E(24, 27, 9, 12, "#b8a694");
  for (let y = 15; y < 40; y++)
    for (let x = 15; x < 34; x++) {
      const d = ((x - 24) / 9) ** 2 + ((y - 27) / 12) ** 2;
      if (d > 1) continue;
      if (x >= 28 && d > 0.3) {
        if (x >= 31 || (x + y) % 2 === 0) R(x, y, 1, 1, "#93826f");
      }
      if (x >= 31 && d > 0.55) R(x, y, 1, 1, "#7a6a58");
      if (x <= 18 && d > 0.45 && y > 19 && (x + y) % 2 === 0) R(x, y, 1, 1, "#c9b8a4");
    }
  // уши
  E(14, 28, 2, 3, "#1e1a16");
  E(14, 28, 1, 2, "#a69482");
  E(34, 28, 2, 3, "#1e1a16");
  E(34, 28, 1, 2, "#7c6c5a");
  // коротко стриженные виски
  for (let y = 19; y < 26; y++) {
    R(15, y, 2, 1, y % 2 ? "#3a3026" : "#4a3e32");
    R(32, y, 2, 1, y % 2 ? "#2a221c" : "#3a3026");
  }
  // брови
  R(18, 23, 5, 1, "#2e241c");
  R(26, 23, 5, 1, "#2e241c");
  R(18, 22, 2, 1, "#4a3c30");
  R(29, 22, 2, 1, "#3a2e24");
  // глаза: веко, зрачок, блик
  R(18, 25, 5, 1, "#5a4a3c");
  R(26, 25, 5, 1, "#4a3c30");
  R(19, 26, 3, 1, "#d4c8b6");
  R(27, 26, 3, 1, "#b8ac9a");
  R(20, 26, 2, 1, "#1c1612");
  R(27, 26, 2, 1, "#1c1612");
  R(20, 26, 1, 1, "#3a3028");
  R(19, 27, 3, 1, "#a08e7c");
  R(27, 27, 3, 1, "#86765e");
  // нос
  R(25, 26, 1, 6, "#8e7e6c");
  R(24, 27, 1, 4, "#c8b6a2");
  R(22, 32, 2, 1, "#6e5e50");
  R(25, 32, 2, 1, "#5e5044");
  R(24, 32, 1, 1, "#8e7e6c");
  // носогубки, рот, подбородок
  R(20, 32, 1, 2, "#9a8a78");
  R(29, 32, 1, 2, "#7a6a58");
  R(21, 35, 7, 1, "#4e3e34");
  R(22, 34, 5, 1, "#a29080");
  R(22, 36, 5, 1, "#a8968a");
  R(23, 38, 4, 1, "#8e7e6c");
  // пилотка, сдвинута набок
  g.fillStyle = "#1a1612";
  g.beginPath();
  g.moveTo(14, 21);
  g.lineTo(15, 13);
  g.lineTo(25, 9);
  g.lineTo(35, 11);
  g.lineTo(36, 19);
  g.lineTo(25, 17);
  g.closePath();
  g.fill();
  g.fillStyle = "#4a4c3a";
  g.beginPath();
  g.moveTo(15, 20);
  g.lineTo(16, 14);
  g.lineTo(25, 10);
  g.lineTo(34, 12);
  g.lineTo(35, 18);
  g.lineTo(25, 16);
  g.closePath();
  g.fill();
  g.fillStyle = "#5c5e4a";
  g.beginPath();
  g.moveTo(16, 14);
  g.lineTo(25, 10);
  g.lineTo(26, 12);
  g.lineTo(17, 16);
  g.closePath();
  g.fill();
  g.fillStyle = "#3a3c2e";
  g.beginPath();
  g.moveTo(15, 20);
  g.lineTo(25, 16);
  g.lineTo(35, 18);
  g.lineTo(35, 20);
  g.lineTo(25, 18);
  g.lineTo(15, 22);
  g.closePath();
  g.fill();
  [
    [0, -2],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [0, -1],
    [-1, 1],
    [1, 1],
    [0, 1]
  ].forEach(([a, b]) => R(30 + a, 15 + b, 1, 1, "#6a2a24"));
  R(30, 14, 1, 1, "#a04a40");
  return c;
}
function oldPhoto(src, scale) {
  const W = src.width,
    H = src.height,
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  g.drawImage(src, 0, 0);
  const d = g.getImageData(0, 0, W, H),
    p = d.data;
  let s = 7;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let l = (p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11) / 255;
      l = 0.1 + l * 0.86; // выцветший контраст
      l += (rnd() - 0.5) * 0.08; // зерно
      const v = Math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2));
      if (v > 0.7) l -= (v - 0.7) * 0.6; // виньетка
      l = Math.max(0, Math.min(1, l));
      p[i] = Math.round(38 + l * 196);
      p[i + 1] = Math.round(26 + l * 168);
      p[i + 2] = Math.round(14 + l * 118);
    }
  g.putImageData(d, 0, 0);
  // царапины и залом
  g.fillStyle = "rgba(240,226,196,.3)";
  for (let k = 0; k < 3; k++) {
    let x = rnd() * W,
      y = rnd() * H;
    const n = 6 + rnd() * 14;
    for (let j = 0; j < n; j++) {
      g.fillRect(Math.round(x), Math.round(y), 1, 1);
      x += rnd() - 0.5;
      y += 1;
    }
  }
  g.fillStyle = "rgba(250,240,215,.18)";
  for (let y = 0; y < H; y++) g.fillRect(Math.round(W * 0.68 + (y - H / 2) * 0.12), y, 1, 1);
  g.fillStyle = "rgba(60,40,20,.25)";
  for (let k = 0; k < 14; k++) g.fillRect(Math.floor(rnd() * W), Math.floor(rnd() * H), 1, 1);
  // пятно и потёртые углы
  g.fillStyle = "rgba(120,90,50,.18)";
  for (let y = -5; y <= 5; y++) {
    const w = Math.round(6 * Math.sqrt(1 - (y * y) / 26));
    g.fillRect(W - 14 - w, H - 16 + y, w * 2, 1);
  }
  // рамка-паспарту
  const o = document.createElement("canvas"),
    b = 4;
  o.width = (W + b * 2) * scale;
  o.height = (H + b * 2 + 6) * scale;
  const q = o.getContext("2d");
  q.imageSmoothingEnabled = false;
  q.fillStyle = "#e6dcc0";
  q.fillRect(0, 0, o.width, o.height);
  q.fillStyle = "#cfc2a0";
  for (let x = 0; x < o.width; x += scale * 2) {
    q.fillRect(x, 0, scale, scale);
    q.fillRect(x, o.height - scale, scale, scale);
  }
  for (let y = 0; y < o.height; y += scale * 2) {
    q.fillRect(0, y, scale, scale);
    q.fillRect(o.width - scale, y, scale, scale);
  }
  q.fillStyle = "rgba(150,120,70,.25)";
  q.fillRect(0, 0, o.width, scale * 2);
  q.drawImage(c, b * scale, b * scale, W * scale, H * scale);
  // загнутые/стёртые уголки
  q.fillStyle = "#d6c8a6";
  [
    [0, 0],
    [o.width - scale * 3, 0],
    [0, o.height - scale * 3],
    [o.width - scale * 3, o.height - scale * 3]
  ].forEach(([x, y]) => q.fillRect(x, y, scale * 3, scale * 3));
  // надпись карандашом внизу
  q.fillStyle = "rgba(90,80,70,.7)";
  const ty = (H + b + 3) * scale;
  [
    [8, 0, 6],
    [16, 0, 4],
    [22, 0, 8],
    [32, 0, 5]
  ].forEach(([x, yy, w]) => q.fillRect((x + b) * scale, ty, w * scale, scale));
  return o;
}

function soldierPic() {
  if (PANEL_IMG.soldier) return PANEL_IMG.soldier;
  return (PANEL_IMG.soldier = oldPhoto(dedPhoto(), 3).toDataURL());
}
function storyGoal() {
  const st = G.story.st,
    reg = TRANSPORT[G.transport].region;
  if (st <= 1)
    return {
      t: "Отнести любую находку в дар музею",
      d: "Краевед Савельич знает про войну в этих местах — может, он поможет понять письмо."
    };
  const has = id => G.inv.some(i => i.story === id);
  if (st === 2)
    return has("zheton")
      ? { t: "Почистить находку из леса", d: "Странная пластинка из окопа ждёт во вкладке «Находки»." }
      : reg >= 2
        ? {
            t: "Леса Области — позиции полка 49127",
            d: "Поезжайте в Область без карты или с картой. Вдоль старого окопа детектор поймает что-то из сорок второго."
          }
        : {
            t: "Добраться до лесов Области",
            d: "Там держал оборону полк деда. Область открывает транспорт — мопед «Рига» во вкладке «Снаряжение»."
          };
  if (st === 3) {
    if (has("sumka"))
      return { t: "Почистить находку из усадьбы", d: "Истлевший кожаный ком ждёт во вкладке «Находки»." };
    const ok = G.det >= 4 && G.rep >= 15;
    return {
      t: "Барский дом с колоннами",
      d: ok
        ? "Это усадьба с архивной карты. Поезжайте по ней из вкладки «Карты» и ищите в руинах дома — там стоял штаб полка."
        : `Дом из письма — усадьба на архивной карте. Архив её выдаст, когда будет ${[G.det < 4 ? "профессиональный детектор (4-й уровень)" : "", G.rep < 15 ? "звание «Поисковик» (совесть +15)" : ""].filter(Boolean).join(" и ")}.`
    };
  }
  if (st === 4) {
    const S = G.story,
      k = S.clues.includes("kotelok"),
      f = S.clues.includes("flyaga"),
      sd = SHOVEL[G.shovel].depth;
    if (has("kotelok") || has("flyaga"))
      return {
        t: "Почистить вещь однополчанина",
        d: "Находка ждёт во вкладке «Находки». Почистите и покажите Савельичу."
      };
    if (k && f)
      return {
        t: "Отправляйтесь в любую поездку",
        d: "Савельич нашёл в сельсовете: у Серовых была младшая дочь Анна, 1930 года. Вдруг она ещё жива. Смотрите по сторонам в дороге."
      };
    const where = [
      !k
        ? `<b>Леса Области</b>: просека за старыми окопами, около 70 см${sd < 70 ? ` (лопата сейчас берёт ${sd} см)` : ""}`
        : "",
      !f
        ? `<b>Глушь и болота</b>: край болота у Гнилого брода, около 80 см${reg < 3 ? " — туда открывает «Нива»" : sd < 80 ? ` (лопата сейчас берёт ${sd} см)` : ""}`
        : ""
    ].filter(Boolean);
    return {
      t: `Однополчане деда · найдено ${(k ? 1 : 0) + (f ? 1 : 0)} из 2`,
      d: `В группе деда было семеро. Савельич нашёл по спискам двоих: ефрейтора Семёна Гуревича и рядового Ильяса Ахметова. Их вещи покажут, куда ушла группа. Где искать: ${where.join("; ")}.`
    };
  }
  if (st === 5) {
    if (has("medal")) return { t: "Почистить находку с острова", d: "Чёрный цилиндрик ждёт во вкладке «Находки»." };
    if (G.debt > 0)
      return {
        t: "Рассчитаться с долгом",
        d: `Нюра: «Андрюша чужого не брал и в долгах не ходил. Рассчитайся с людьми — тогда покажу, где гать». Осталось ${rub(G.debt)} — погасить можно в гараже, в блоке «Долг».`
      };
    return reg >= 3
      ? {
          t: "Остров на болоте, у сухой берёзы",
          d: `Глушь и болота: по гати на остров, к сухой берёзе у обломков самолёта. Лежит глубоко — нужна лопата хотя бы на 100 см${G.shovel < 5 ? " (сейчас " + SHOVEL[G.shovel].depth + " см)" : ""}.`
        }
      : { t: "Добраться до болот", d: "Глушь открывает «Нива» во вкладке «Снаряжение»." };
  }
  const E = {
    good: ["Финал «Вернулся»", "Деда похоронили в селе, у братской могилы. История окончена — но копать можно дальше."],
    grey: [
      "Финал «Серый»",
      "Медальон у Нюры. Дед так и остался на острове. История окончена — но копать можно дальше."
    ],
    bad: ["Финал «Чёрный»", "Медальон ушёл к коллекционеру. История окончена — но копать можно дальше."]
  }[G.story.end] || ["История окончена", ""];
  return { t: E[0], d: E[1] };
}
function renderDed() {
  const S = G.story,
    goal = storyGoal(),
    found = id => S.clues.includes(id),
    got = CLUES.filter(c => found(c.id)),
    left = CLUES.length - got.length;
  const replays = [
    ["prologue", 0, "Пролог"],
    ["museum", 2, "Музей"],
    ["ch2", 3, "Лес"],
    ["ch3", 4, "Усадьба"],
    ["ch4", 5, "Нюра"],
    ["ch5", 6, "Остров"]
  ]
    .filter(([, m]) => S.st >= m)
    .concat(S.end ? [[`end_${S.end}`, 0, "Финал"]] : []);
  return `<section class="dd-card"><span class="dd-photo"><img src="${soldierPic()}" alt="Фото деда"></span><div><h2>Андрей Михайлович Серов</h2><p class="dim">Старший сержант, 1912 г. р. ${S.end === "good" ? "Найден в 2026-м, похоронен в селе." : S.end === "grey" ? "Найден на острове в 2026-м." : "Пропал без вести в 1942-м."}</p></div></section>
  <section class="dd-goal">${pxi("pin", 26)}<div><small>Что дальше</small><b>${goal.t}</b>${goal.d ? `<p>${goal.d}</p>` : ""}</div></section>
  <section class="dd-box"><div class="eco-h"><h2>Улики</h2><b>${got.length} из ${CLUES.length}</b></div>
  <ul class="dd-list">${got
    .map(
      c =>
        `<li><span class="dd-ic"><img src="${storyItemPic(c.id)}" alt=""></span><div><small>${c.ch}</small><b>${c.name}</b><p>${c.id === "zheton" && S.sold ? "Продан Борзому за 100 000 ₽. Имя Савельич успел назвать: Фёдор Лыков." : c.id === "medal" && S.end === "bad" ? "Отдан Борзому. Записка: «Серов Андрей Михайлович, 1912…»." : c.text}</p></div></li>`
    )
    .join(
      ""
    )}${left ? `<li class="off"><span class="dd-ic">?</span><div><b>Ещё ${left} ${plural(left, "улика не найдена", "улики не найдены", "улик не найдено")}</b></div></li>` : ""}</ul></section>
  <section class="dd-box"><div class="eco-h"><h2>Пересмотреть</h2></div><div class="dd-replay">${replays
    .map(([id, , t]) => `<button onclick="SK.comic('${id}')">${pxi("arrow", 14)}${t}</button>`)
    .join("")}</div></section>`;
}
const STORY_ITEMS = {
  zheton: {
    ch: "Глава 2",
    name: "Жетон 4-17",
    note: "Алюминиевый жетон, номер читается: 4-17. Это не дед — но кто-то из его полка. По номеру Савельич сможет узнать имя.",
    keep: "Продавать его скупщику нельзя — только показать Савельичу.",
    btn: "Показать Савельичу",
    sub: "Узнать имя по номеру"
  },
  sumka: {
    ch: "Глава 3",
    name: "Полевая сумка",
    note: "Офицерский планшет, кожа истлела. Внутри сложенный лист, чернила почти выцвели. Можно разобрать слово «Серова».",
    keep: "Савельич прочтёт остальное.",
    btn: "Показать Савельичу",
    sub: "Прочитать донесение"
  },
  kotelok: {
    ch: "Глава 4",
    name: "Котелок Гуревича",
    note: "Алюминиевый солдатский котелок, мятый, дно пробито осколком. На боку нацарапано: «С. Гуревич».",
    keep: "Это кто-то из группы деда. Савельич найдёт его по спискам.",
    btn: "Показать Савельичу",
    sub: "Найти по спискам"
  },
  flyaga: {
    ch: "Глава 4",
    name: "Фляга Ахметова",
    note: "Стеклянная солдатская фляга в истлевшем суконном чехле. На алюминиевой крышке выбито: «И. Ахметов».",
    keep: "Ещё один из группы деда. Савельич должен это увидеть.",
    btn: "Показать Савельичу",
    sub: "Найти по спискам"
  },
  medal: {
    ch: "Глава 6",
    name: "Смертный медальон",
    note: "Эбонитовый пенал солдатского медальона. Крышка прикипела, внутри шуршит бумага.",
    keep: "Что вы сделаете с ним — решит, чем закончится история.",
    btn: "Открыть пенал",
    sub: "Прочитать записку"
  }
};
const SDIG = {
  0: [7, 5, 5, 5, 7],
  1: [2, 6, 2, 2, 7],
  2: [7, 1, 7, 4, 7],
  4: [5, 5, 7, 1, 1],
  7: [7, 1, 2, 2, 2],
  9: [7, 5, 7, 1, 7],
  "-": [0, 0, 7, 0, 0]
};
function digits(g, str, x, y, col) {
  g.fillStyle = col;
  [...str].forEach((ch, k) => {
    const m = SDIG[ch];
    if (!m) return;
    m.forEach((row, j) => {
      for (let i = 0; i < 3; i++) if (row & (4 >> i)) g.fillRect(x + k * 4 + i, y + j, 1, 1);
    });
  });
}
function storyItemPic(id) {
  const k = "si_" + id;
  if (PANEL_IMG[k]) return PANEL_IMG[k];
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  const O = "#1a140e";
  if (id === "letter") {
    fillPoly(
      g,
      [
        [2, 7],
        [30, 7],
        [16, 27]
      ],
      O
    );
    fillPoly(
      g,
      [
        [3, 8],
        [29, 8],
        [16, 25]
      ],
      "#e8dcc0"
    );
    fillPoly(
      g,
      [
        [3, 8],
        [16, 17],
        [29, 8]
      ],
      "#f2e8d0"
    );
    pline(g, 3, 8, 16, 17, "#b8a888");
    pline(g, 29, 8, 16, 17, "#b8a888");
    pline(g, 16, 17, 16, 25, "#c8b898");
    pline(g, 7, 11, 14, 11, "#4a4a8a");
    pline(g, 9, 13, 15, 13, "#4a4a8a");
    pline(g, 18, 12, 23, 12, "#4a4a8a");
    disc(g, 23, 19, 4, 4, "#8a6aa8");
    disc(g, 23, 19, 3, 3, "#e8dcc0");
    rect(g, 21, 19, 5, 1, "#8a6aa8");
    rect(g, 9, 18, 4, 1, "#c8a888");
  } else if (id === "pp") {
    rect(g, 2, 5, 28, 22, O);
    rect(g, 3, 6, 26, 20, "#e6dcc2");
    rect(g, 3, 6, 26, 1, "#f2e8d0");
    for (let i = 3; i < 29; i += 3) rect(g, i, 25, 2, 1, "#c8b894");
    disc(g, 11, 13, 6, 6, "#7a5aa0");
    disc(g, 11, 13, 5, 5, "#e6dcc2");
    disc(g, 11, 13, 4, 4, "#7a5aa0");
    disc(g, 11, 13, 3, 3, "#e6dcc2");
    rect(g, 8, 13, 7, 1, "#7a5aa0");
    rect(g, 9, 11, 5, 1, "#7a5aa0");
    pline(g, 19, 10, 26, 10, "#5a5a8a");
    pline(g, 19, 13, 25, 13, "#5a5a8a");
    digits(g, "49127", 6, 19, "#7a5aa0");
  } else if (id === "zheton") {
    pline(g, 3, 3, 6, 9, "#8a6a3a");
    pline(g, 4, 3, 7, 9, "#6a4a2a");
    disc(g, 16, 17, 13, 8, O);
    disc(g, 16, 16, 12, 7, "#8a9094");
    disc(g, 16, 15, 11, 6, "#a4aaae");
    disc(g, 13, 12, 6, 2, "#c8ccd0");
    rect(g, 10, 11, 3, 1, "#e8ecee");
    disc(g, 7, 13, 2, 2, O);
    rect(g, 7, 13, 1, 1, "#3a3a3a");
    digits(g, "4-17", 11, 14, "#4a5054");
    rect(g, 10, 20, 12, 1, "#8a9094");
    rect(g, 22, 19, 3, 2, "#8a5a3a");
    rect(g, 9, 19, 2, 1, "#9a6a42");
    rect(g, 25, 13, 1, 2, "#7a8084");
  } else if (id === "photo") {
    rect(g, 4, 3, 24, 28, O);
    rect(g, 5, 4, 22, 26, "#efe6d0");
    for (let i = 5; i < 27; i += 2) {
      rect(g, i, 4, 1, 1, "#cfc4a8");
      rect(g, i, 29, 1, 1, "#cfc4a8");
    }
    for (let j = 4; j < 30; j += 2) {
      rect(g, 5, j, 1, 1, "#cfc4a8");
      rect(g, 26, j, 1, 1, "#cfc4a8");
    }
    rect(g, 7, 6, 18, 17, "#b49c74");
    rect(g, 7, 6, 18, 6, "#c8b088");
    rect(g, 7, 18, 18, 5, "#6a5440");
    rect(g, 15, 17, 8, 3, "#4a3a28");
    disc(g, 11, 11, 2, 2, "#6a5440");
    rect(g, 9, 13, 5, 6, "#5a4632");
    rect(g, 9, 9, 5, 1, "#4a3a28");
    disc(g, 19, 10, 2, 2, "#6a5440");
    rect(g, 17, 12, 5, 7, "#5a4632");
    rect(g, 17, 8, 5, 1, "#4a3a28");
    pline(g, 8, 26, 15, 26, "#6a5a44");
    pline(g, 16, 26, 22, 25, "#6a5a44");
    fillPoly(
      g,
      [
        [22, 4],
        [27, 4],
        [27, 9]
      ],
      "#d8ccb0"
    );
    pline(g, 22, 4, 27, 9, "#b8ac90");
  } else if (id === "sumka") {
    fillPoly(
      g,
      [
        [6, 11],
        [9, 5],
        [16, 2],
        [23, 5],
        [26, 11],
        [24, 11],
        [21, 6],
        [16, 4],
        [11, 6],
        [8, 11]
      ],
      "#4a2c18"
    );
    rect(g, 9, 7, 10, 7, "#e6dcc2");
    pline(g, 10, 9, 17, 9, "#5a5a8a");
    pline(g, 10, 11, 16, 11, "#5a5a8a");
    rect(g, 4, 10, 24, 18, O);
    rect(g, 5, 11, 22, 16, "#6a4024");
    rect(g, 5, 26, 22, 1, "#4a2c18");
    fillPoly(
      g,
      [
        [5, 11],
        [27, 11],
        [27, 19],
        [16, 22],
        [5, 19]
      ],
      "#8a5634"
    );
    pline(g, 5, 19, 16, 22, "#5a3420");
    pline(g, 16, 22, 27, 19, "#5a3420");
    rect(g, 5, 11, 22, 1, "#a87048");
    rect(g, 14, 18, 4, 5, "#c8a040");
    rect(g, 15, 19, 2, 3, "#6a4024");
    rect(g, 14, 18, 4, 1, "#f2d36a");
    rect(g, 7, 24, 2, 1, "#a87048");
    rect(g, 22, 24, 3, 1, "#a87048");
  } else if (id === "nyura") {
    disc(g, 16, 21, 12, 9, O);
    disc(g, 16, 20, 11, 8, "#b83a3a");
    disc(g, 13, 17, 5, 3, "#d05050");
    for (let k = 0; k < 14; k++) {
      const a = k * 2.4,
        r = 3 + (k % 4) * 2;
      rect(
        g,
        16 + Math.round(Math.cos(a) * r),
        20 + Math.round(Math.sin(a) * r * 0.7),
        1,
        1,
        k % 3 ? "#f4f0e0" : "#f2d36a"
      );
    }
    fillPoly(
      g,
      [
        [12, 13],
        [16, 11],
        [20, 13],
        [24, 6],
        [21, 6],
        [16, 9],
        [11, 6],
        [8, 6]
      ],
      "#a83030"
    );
    pline(g, 8, 6, 12, 13, O);
    pline(g, 24, 6, 20, 13, O);
    disc(g, 16, 12, 2, 2, "#8a2828");
    disc(g, 22, 26, 4, 2, "#c8904a");
    rect(g, 20, 25, 4, 1, "#e8b870");
  } else if (id === "medal") {
    rect(g, 8, 7, 9, 21, O);
    rect(g, 9, 8, 7, 19, "#22201e");
    rect(g, 10, 8, 2, 19, "#4a4844");
    rect(g, 14, 8, 1, 19, "#141210");
    for (let j = 10; j < 26; j += 3) rect(g, 9, j, 7, 1, "#2e2c2a");

    fillPoly(
      g,
      [
        [13, 7],
        [16, 3],
        [30, 12],
        [28, 22],
        [17, 16]
      ],
      O
    );
    fillPoly(
      g,
      [
        [14, 7],
        [16, 5],
        [29, 13],
        [27, 21],
        [17, 15]
      ],
      "#e8dcc0"
    );
    pline(g, 17, 8, 26, 13, "#4a4a7a");
    pline(g, 17, 10, 25, 15, "#4a4a7a");
    pline(g, 18, 12, 24, 16, "#4a4a7a");
    pline(g, 26, 17, 27, 18, "#4a4a7a");
    rect(g, 27, 13, 1, 6, "#c8b898");
    rect(g, 8, 7, 1, 21, "#6a6864");
    rect(g, 19, 23, 9, 6, O);
    rect(g, 20, 24, 7, 4, "#2a2826");
    for (let i = 20; i < 27; i += 2) rect(g, i, 24, 1, 4, "#5a5854");
    rect(g, 20, 24, 7, 1, "#7a7874");
  } else if (id === "kotelok") {
    pline(g, 7, 11, 16, 4, "#5a6064");
    pline(g, 16, 4, 25, 11, "#5a6064");
    pline(g, 8, 11, 16, 5, "#8a9094");
    pline(g, 16, 5, 24, 11, "#8a9094");
    rect(g, 5, 10, 22, 19, O);
    rect(g, 6, 11, 20, 17, "#9aa0a4");
    rect(g, 6, 11, 20, 2, "#d8dcde");
    rect(g, 6, 25, 20, 3, "#6e7478");
    rect(g, 8, 13, 3, 11, "#bcc2c6");
    rect(g, 22, 13, 3, 12, "#7e8488");
    rect(g, 17, 16, 4, 3, "#7e8488");
    rect(g, 18, 17, 2, 1, "#5a6064");
    pline(g, 10, 20, 16, 20, "#4a5054");
    pline(g, 10, 22, 14, 22, "#4a5054");
    rect(g, 19, 26, 2, 2, O);
    rect(g, 4, 10, 24, 1, O);
  } else if (id === "flyaga") {
    rect(g, 12, 3, 8, 5, O);
    rect(g, 13, 4, 6, 3, "#b8bec2");
    rect(g, 13, 4, 6, 1, "#e0e4e6");
    rect(g, 13, 8, 6, 4, O);
    rect(g, 14, 8, 4, 4, "#7a9a8a");
    disc(g, 16, 20, 11, 10, O);
    disc(g, 16, 20, 10, 9, "#5a5838");
    disc(g, 13, 17, 5, 4, "#6e6c48");
    for (let j = 13; j < 29; j += 3) rect(g, 7, j, 18, 1, "#4a482e");
    pline(g, 5, 15, 13, 9, "#3a3824");
    pline(g, 27, 15, 19, 9, "#3a3824");
    rect(g, 20, 22, 4, 3, "#3a3824");
    rect(g, 9, 18, 2, 2, "#7e7c56");
  } else {
    rect(g, 3, 3, 26, 26, "#3a3124");
    rect(g, 4, 4, 24, 24, "#2a2218");
    rect(g, 12, 8, 8, 3, "#7a6a52");
    rect(g, 18, 11, 3, 5, "#7a6a52");
    rect(g, 14, 16, 4, 4, "#7a6a52");
    rect(g, 14, 22, 4, 3, "#7a6a52");
  }
  return (PANEL_IMG[k] = c.toDataURL());
}
function storyPrologue() {
  showComic("prologue", () => {
    G.story.st = 1;
    if (!G.story.clues.includes("letter")) G.story.clues.push("letter");
    G.msg = "В гараже появилась вкладка «Дед»: письмо и что делать дальше.";
    G.msgBad = false;
    save();
    renderBase();
  });
}
function storyMuseum() {
  showComic("museum", () => {
    G.story.st = 2;
    if (!G.story.clues.includes("pp")) G.story.clues.push("pp");
    G.msg = "Новая улика во вкладке «Дед»: полевая почта 49127 — полк держал оборону в лесах Области.";
    G.msgBad = false;
    save();
    tab = "ded";
    renderBase();
  });
}
let choiceQ = null;
function storyChoice(title, pic, text, opts) {
  const el = $("comic");
  choiceQ = opts;
  el.innerHTML = `<div class="cm choice"><div class="cm-top"><span>${title}</span></div><div class="cm-frame"><img src="${panelPic(pic)}" style="${panelFy(pic)}" alt=""><div class="cm-cap say">${text}</div></div>
    <p class="cm-hint">Выбор изменит концовку</p><div class="cm-ch">${opts.map((o, k) => `<button class="cm-opt ${o.cls || ""}" ${o.off ? "disabled" : ""} onclick="SK.choose(${k})"><span class="cm-k">${k + 1}</span><span><b>${o.label}</b><small>${o.sub}</small></span></button>`).join("")}</div></div>`;
  el.hidden = false;
}
function addClue(id) {
  if (!G.story.clues.includes(id)) G.story.clues.push(id);
}
function storyDone(text) {
  G.msg = text;
  G.msgBad = false;
  openFind = null;
  tab = "ded";
  save();
  renderBase();
}
function storyAct(i) {
  const it = G.inv[i];
  if (!it || !it.story || !it.clean) return;
  const id = it.story;
  openFind = null;
  renderFindSheet();
  const drop = () => {
    const k = G.inv.findIndex(x => x.story === id);
    if (k >= 0) G.inv.splice(k, 1);
  };
  if (id === "zheton")
    showComic("ch2", () =>
      storyChoice("Глава 2 · Лес", "borzy", "Борзый ждёт ответа. Сто тысяч — это почти все долги разом.", [
        {
          label: "Отказать Борзому",
          sub: "Жетон останется у Савельича · +2 совести",
          cls: "green",
          run: () => {
            drop();
            G.rep += 2;
            addClue("zheton");
            addClue("photo");
            G.story.st = 3;
            storyDone(
              "Жетон остался у Савельича, а внучка Лыкова отдала фотографию. Совесть +2. Дальше — барский дом с колоннами из письма."
            );
          }
        },
        {
          label: "Продать жетон за 100 000 ₽",
          sub: "−5 совести · светлый финал закроется",
          cls: "dark",
          run: () => {
            drop();
            G.money += 100000;
            G.rep -= 5;
            G.story.sold = true;
            addClue("zheton");
            addClue("photo");
            G.story.st = 3;
            storyDone(
              "Борзый отсчитал сто тысяч. Совесть −5. Фотографию внучка Лыкова всё равно отдала — но Савельич смотрел мимо."
            );
          }
        }
      ])
    );
  else if (id === "kotelok" || id === "flyaga") {
    drop();
    G.rep += 2;
    addClue(id);
    const both = G.story.clues.includes("kotelok") && G.story.clues.includes("flyaga");
    storyDone(
      (id === "kotelok"
        ? "Савельич нашёл по спискам: ефрейтор Семён Гуревич, из группы деда. Котелок лежал у просеки — группа ушла из леса к болотам. Совесть +2."
        : "Рядовой Ильяс Ахметов, из группы деда. Фляга лежала у Гнилого брода — группа дошла до болота. Совесть +2.") +
        (both
          ? " <b>Обе вещи найдены.</b> Савельич нашёл в сельсовете: у Серовых была младшая дочь Анна, 1930 года. Смотрите по сторонам в дороге."
          : " Осталось найти вещь второго однополчанина.")
    );
  } else if (id === "sumka")
    showComic("ch3", () => {
      drop();
      G.rep += 2;
      addClue("sumka");
      G.story.st = 4;
      storyDone(
        "Донесение во вкладке «Дед»: группа деда ушла к упавшему самолёту, на остров за Гнилым бродом. Совесть +2."
      );
    });
  else if (id === "medal")
    showComic("ch5", () =>
      storyChoice("Финал", "medal", "Записка в пенале: «Серов Андрей Михайлович, 1912…». Что с ним делать?", [
        {
          label: "Позвонить Савельичу",
          sub: G.story.sold
            ? "Закрыто: вы продали жетон, Савельич вам больше не верит"
            : "Поисковики поднимут всех семерых · +10 совести",
          cls: "green",
          off: !!G.story.sold,
          run: () => {
            drop();
            endStory("good", 10, 0);
          }
        },
        {
          label: "Отнести Нюре и никому не говорить",
          sub: "Дед останется на острове · +2 совести",
          cls: "gold",
          run: () => {
            drop();
            endStory("grey", 2, 0);
          }
        },
        {
          label: "Отдать Борзому за 100 000 ₽",
          sub: "Коллекционер ждёт · −15 совести",
          cls: "dark",
          run: () => {
            drop();
            endStory("bad", -15, 100000);
          }
        }
      ])
    );
}
function endStory(kind, rep, money) {
  G.rep += rep;
  G.money += money;
  G.story.end = kind;
  G.story.st = 6;
  addClue("medal");
  save();
  showComic("end_" + kind, () =>
    storyDone(
      {
        good: "Финал «Вернулся». Совесть +10. История деда окончена — копать можно дальше.",
        grey: "Финал «Серый». Совесть +2. История деда окончена — копать можно дальше.",
        bad: "Финал «Чёрный». +100 000 ₽, совесть −15. История деда окончена — копать можно дальше."
      }[kind]
    )
  );
}
