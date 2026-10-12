// ================= МИР (статичный) =================
const solids = [],
  trees = [];
const RUIN = { x: 368, y: 128, w: 128, h: 96 };
const bg = document.createElement("canvas");
bg.width = WW;
bg.height = WH;
function buildField(plough) {
  const g = bg.getContext("2d"),
    r = rng(7);
  const inPlough = (x, y) => {
    if (!plough) return 0;
    const n2 = Math.sin(x * 0.05) * 6 + Math.sin(y * 0.07) * 5 + Math.sin((x + y) * 0.13) * 2;
    if (!(x > roadX(y) + 34 + n2 && x < WW - 60 + n2 && y > 116 + n2 && y < WH - 70 + n2)) return 0;
    if (((x - RUIN.x - RUIN.w / 2) / 104) ** 2 + ((y - RUIN.y - RUIN.h / 2 - 6) / 84) ** 2 < 1 + n2 * 0.02)
      return 0;
    const my = 432 + Math.sin(x * 0.02) * 10 + n2 * 0.4;
    if (Math.abs(y - my) < 9) return 0;
    return y < my ? 1 : 2;
  };
  const img = g.createImageData(WW, WH),
    d = img.data;
  // ровная яркая трава: один основной тон и мелкая пиксельная рябь
  const base = [112, 166, 64],
    dk = [102, 155, 58],
    lt = [124, 176, 72],
    lt2 = [134, 184, 80];
  const sand = [188, 160, 112],
    rut = [160, 132, 90],
    sandL = [204, 178, 128];
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const n = Math.sin(x * 0.035 + 1) + Math.sin(y * 0.04 + x * 0.012) + Math.sin((x - y) * 0.02);
      const q = r();
      let c = base;
      if (q < 0.1 + (n < -1 ? 0.08 : 0)) c = dk;
      else if (q < 0.2 + (n > 1 ? 0.1 : 0)) c = lt;
      else if (q < 0.215) c = lt2;
      {
        const pl = inPlough(x, y);
        if (pl) {
          const ph = pl === 1 ? (y + x * 0.12) % 5 : (x + y * 0.18) % 5;
          c =
            ph < 1.4
              ? q < 0.3
                ? [96, 70, 46]
                : [104, 76, 50]
              : ph < 2.4
                ? q < 0.5
                  ? [122, 90, 60]
                  : [116, 86, 57]
                : q < 0.4
                  ? [140, 106, 72]
                  : q < 0.75
                    ? [132, 100, 68]
                    : [148, 114, 78];
          if (q > 0.985) c = [166, 132, 92];
          if (q < 0.006) c = [120, 150, 70];
        }
      }
      const dx = Math.abs(x - rx);
      if (dx < 10 && !(dx > 7 && r() < 0.55)) {
        c = sand;
        const rr = Math.abs(x - rx + 0.5);
        if (Math.abs(rr - 4) < 1.2 || Math.abs(rr + 4) < 1.2) c = rut;
        else if (r() < 0.06) c = sandL;
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  // лужа на дороге
  const px = roadX(330) + 2;
  disc(g, px, 331, 11, 6, "#5d7f8c");
  disc(g, px, 330, 10, 5, "#86b8d2");
  disc(g, px - 3, 328, 4, 1, "#cfe6f1");
  rect(g, px + 3, 331, 3, 1, "#cfe6f1");
  // развалины из красного кирпича: тень, стены

  const walls = [
    [368, 128, 48, 8],
    [440, 128, 56, 8],
    [368, 128, 8, 96],
    [488, 128, 8, 52],
    [368, 216, 40, 8],
    [440, 216, 56, 8]
  ];
  walls.forEach(([x, y, w, h]) => {
    g.fillStyle = "rgba(30,40,20,.35)";
    g.fillRect(x + 2, y + 3, w, h);
  });
  walls.forEach(([x, y, w, h]) => {
    solids.push({ x, y, w, h });
    rect(g, x, y, w, h, "#9c4a32");
    for (let j = y, row = 0; j < y + h; j += 3, row++) {
      rect(g, x, j, w, 1, "#c2b29a");
      for (let i = x + (row % 2 ? 2 : 5); i < x + w; i += 6) rect(g, i, j + 1, 1, 2, "#b8a890");
      for (let i = x; i < x + w; i += 3)
        if (r() < 0.25) rect(g, i, j + 1, Math.min(3, x + w - i), 2, r() < 0.5 ? "#b8603f" : "#7e3a26");
    }
    rect(g, x, y, w, 1, "#d8cab0");
    rect(g, x, y + h - 1, w, 1, "#5e2c1c");
  });
  for (let k = 0; k < 46; k++) {
    // кирпичный бой
    const inside = r() < 0.55,
      bx = inside ? RUIN.x + 12 + r() * (RUIN.w - 24) : RUIN.x - 10 + r() * (RUIN.w + 30),
      by = inside ? RUIN.y + 14 + r() * (RUIN.h - 28) : RUIN.y + RUIN.h + 2 + r() * 14;
    const c = pick(["#a8523a", "#8a4430", "#b8603f", "#9b9586"], r);
    rect(g, bx, by + 1, 3, 1, "rgba(30,40,20,.3)");
    rect(g, bx, by, 3, 2, c);
    rect(g, bx, by, 2, 1, "#d08a6a");
  }
  // забор
  const fy = 80;
  let posts = [];
  for (let x = 224; x <= 592; x += 14) posts.push(x);
  const broken = new Set([6, 15, 16, 22]);
  g.fillStyle = "rgba(30,40,20,.3)";
  g.fillRect(224, fy + 1, 370, 2);
  for (let i = 0; i < posts.length - 1; i++) {
    if (broken.has(i)) continue;
    const x = posts[i];
    rect(g, x, fy - 6, 14, 1, "#9a774c");
    rect(g, x, fy - 3, 14, 1, "#8a6a42");
    rect(g, x, fy - 2, 14, 1, "#5c4329");
    solids.push({ x, y: fy - 5, w: 14, h: 6 });
  }
  rect(g, posts[15] + 2, fy + 4, 16, 2, "#8a6a42");
  rect(g, posts[15] + 2, fy + 6, 16, 1, "#5c4329");
  posts.forEach(x => {
    rect(g, x, fy - 9, 3, 10, "#6e4f30");
    rect(g, x, fy - 9, 3, 2, "#93714a");
  });

  // ---- деревья и кусты: плотный лес по краям, открытая поляна посередине ----
  const nearRoad = (x, y, m) => Math.abs(x - roadX(y)) < m;
  const inRuin = (x, y, m) =>
    x > RUIN.x - m && x < RUIN.x + RUIN.w + m && y > RUIN.y - m && y < RUIN.y + RUIN.h + m + 10;
  const nearFence = (x, y) => Math.abs(y - fy) < 22 && x > 210 && x < 606;
  const inZone = (x, y, m) => Math.hypot(x - ZONE.x, y - ZONE.y) < ZONE.r + m;
  const free = (x, y, dmin) => !trees.some(t => Math.hypot(t.x - x, t.y - y) < dmin);
  const shadow = (x, y, rw) => {
    g.fillStyle = "rgba(30,50,18,.35)";
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.floor(rw * Math.sqrt(1 - (dy * dy) / 16));
      g.fillRect(x + 3 - w, y + dy, w * 2, 1);
    }
  };
  function addTree(x, y, kind) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    shadow(x, y, 14);
  }
  function addBush(tx, ty) {
    const x = tx * TS + 8,
      y = ty * TS + 13;
    trees.push({ x, y, kind: 2 });
    solids.push({ x: x - 5, y: y - 5, w: 10, h: 5 });
    shadow(x, y, 9);
  }
  const treeKind = () => {
    const q = r();
    return q < 0.18 ? 1 : q < 0.42 ? 3 : 0;
  };
  // кромка леса: два-три ряда деревьев вдоль краёв, кроны заходят друг на друга
  for (let a = 0; a < 6000; a++) {
    const side = Math.floor(r() * 4),
      t = r(),
      depth = r() * 38;
    const x = side === 0 ? t * WW : side === 1 ? t * WW : side === 2 ? depth + 4 : WW - 4 - depth;
    const y =
      side === 0
        ? depth + 14
        : side === 1
          ? WH - 2 - depth * 0.7
          : side === 2
            ? 20 + t * (WH - 20)
            : 20 + t * (WH - 20);
    if (nearRoad(x, y, 30) || nearFence(x, y) || inZone(x, y, 40) || inPlough(x, y)) continue;
    if (!free(x, y, 22)) continue;
    addTree(x, y, treeKind());
  }
  // кусты в просветах кромки
  for (let a = 0, n = 0; a < 3000 && n < 70; a++) {
    const tx = 1 + Math.floor(r() * (MW - 2)),
      ty = 2 + Math.floor(r() * (MH - 3)),
      x = tx * TS + 8,
      y = ty * TS + 13;
    const edge = Math.min(x, WW - x, y, WH - y);
    if (edge > 66 || edge < 18) continue;
    if (nearRoad(x, y, 26) || nearFence(x, y) || inZone(x, y, 30) || inRuin(x, y, 12) || inPlough(x, y))
      continue;
    if (ty >= MH - 5 && nearRoad(x, y, 60)) continue;
    if (!free(x, y, 15)) continue;
    addBush(tx, ty);
    n++;
  }
  // несколько рощиц: у дороги, у развалин и пара в поле
  const groves = [
    [150, 250],
    [60 + r() * 40, 470],
    [RUIN.x + RUIN.w + 40, RUIN.y + 40],
    [RUIN.x - 40, RUIN.y + 110],
    [250, 560],
    [560, 470],
    [300, 380]
  ];
  for (const [gx, gy] of groves) {
    for (let a = 0, n = 0; a < 60 && n < 2; a++) {
      const x = gx + (r() - 0.5) * 44,
        y = gy + (r() - 0.5) * 30;
      if (
        nearRoad(x, y, 26) ||
        inZone(x, y, 30) ||
        inRuin(x, y, 14) ||
        nearFence(x, y) ||
        inPlough(x, y) ||
        inPlough(x, y - 30) ||
        !free(x, y, 20)
      )
        continue;
      addTree(x, y, treeKind());
      n++;
    }
    for (let a = 0, n = 0; a < 40 && n < 1; a++) {
      const tx = Math.floor((gx + (r() - 0.5) * 56) / TS),
        ty = Math.floor((gy + (r() - 0.5) * 40) / TS),
        x = tx * TS + 8,
        y = ty * TS + 13;
      if (
        tx < 1 ||
        ty < 2 ||
        tx >= MW - 1 ||
        ty >= MH - 1 ||
        nearRoad(x, y, 24) ||
        inZone(x, y, 24) ||
        inRuin(x, y, 12) ||
        nearFence(x, y) ||
        inPlough(x, y) ||
        !free(x, y, 14)
      )
        continue;
      addBush(tx, ty);
      n++;
    }
  }

  // ---- мелочь на траве ----
  const ok = (x, y) => !nearRoad(x, y, 12) && !inRuin(x, y, -4) && !inPlough(x, y);
  // кустики травы: аккуратные «галочки», примерно одна на две клетки
  function tuft(x, y, big) {
    rect(g, x - 2, y + 1, 5, 1, "rgba(40,70,20,.25)");
    rect(g, x, y - 3, 1, 4, "#3f7a2a");
    rect(g, x - 1, y - 1, 1, 2, "#3f7a2a");
    rect(g, x + 1, y - 2, 1, 3, "#4b8a30");
    rect(g, x, y - 3, 1, 1, "#8cc455");
    rect(g, x + 1, y - 2, 1, 1, "#8cc455");
    if (big) {
      rect(g, x - 3, y - 1, 1, 1, "#3f7a2a");
      rect(g, x - 2, y, 1, 1, "#3f7a2a");
      rect(g, x + 3, y - 1, 1, 1, "#4b8a30");
      rect(g, x + 2, y, 1, 1, "#4b8a30");
      rect(g, x - 2, y - 2, 1, 2, "#4b8a30");
      rect(g, x - 2, y - 2, 1, 1, "#8cc455");
    }
  }
  for (let ty = 0; ty < MH; ty++)
    for (let tx = 0; tx < MW; tx++) {
      if (r() > 0.5) continue;
      const x = tx * TS + 3 + Math.floor(r() * 10),
        y = ty * TS + 4 + Math.floor(r() * 10);
      if (!ok(x, y)) continue;
      tuft(x, y, r() < 0.45);
    }
  // трава по краям дороги
  for (let y = 6; y < WH; y += 7 + Math.floor(r() * 6)) {
    const s = r() < 0.5 ? -1 : 1;
    tuft(Math.round(roadX(y) + s * (9 + r() * 2)), y, r() < 0.5);
  }
  // цветы: одиночные и по 2–3, в основном белые и жёлтые
  function flower(x, y, k) {
    if (k === 0) {
      rect(g, x, y - 1, 1, 1, "#f6f2e6");
      rect(g, x - 1, y, 1, 1, "#f6f2e6");
      rect(g, x + 1, y, 1, 1, "#f6f2e6");
      rect(g, x, y + 1, 1, 1, "#e2ddd0");
      rect(g, x, y, 1, 1, "#e9c54a");
    } else if (k === 1) {
      rect(g, x, y, 2, 2, "#f0c93c");
      rect(g, x, y, 1, 1, "#fbe58a");
      rect(g, x, y + 2, 1, 1, "#3f7a2a");
    } else {
      rect(g, x, y, 1, 1, "#8fb3e0");
      rect(g, x + 1, y - 1, 1, 1, "#a9c6ec");
      rect(g, x, y + 1, 1, 1, "#3f7a2a");
    }
  }
  for (let k = 0; k < 280; k++) {
    const cx = Math.floor(r() * WW),
      cy = Math.floor(r() * WH);
    if (!ok(cx, cy)) continue;
    const kind = r() < 0.45 ? 0 : r() < 0.8 ? 1 : 2,
      n = r() < 0.5 ? 1 : 2 + Math.floor(r() * 2);
    for (let j = 0; j < n; j++) {
      const x = cx + Math.round((r() - 0.5) * 8),
        y = cy + Math.round((r() - 0.5) * 6);
      if (ok(x, y)) flower(x, y, kind);
    }
  }
  // камни: мало, с бликом и тенью
  for (let k = 0; k < 34; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!ok(x, y)) continue;
    rect(g, x, y + 2, 5, 1, "rgba(30,50,18,.35)");
    rect(g, x, y, 5, 2, "#8f8a7e");
    rect(g, x + 1, y - 1, 3, 1, "#a9a497");
    rect(g, x + 1, y, 2, 1, "#c9c4b6");
    rect(g, x, y + 1, 5, 1, "#77736a");
  }
  if (plough) {
    // комья земли и стерня по краям пашни
    for (let k = 0; k < 900; k++) {
      const x = Math.floor(r() * WW),
        y = Math.floor(r() * WH);
      if (!inPlough(x, y)) continue;
      rect(g, x, y + 1, 3, 1, "rgba(60,40,20,.35)");
      rect(g, x, y, 2, 1, r() < 0.5 ? "#9a7450" : "#86643f");
      if (r() < 0.3) rect(g, x, y - 1, 1, 1, "#b08a5e");
    }
    for (let k = 0; k < 1200; k++) {
      const x = Math.floor(r() * WW),
        y = Math.floor(r() * WH);
      if (
        inPlough(x, y) ||
        (!inPlough(x - 14, y) && !inPlough(x + 14, y) && !inPlough(x, y - 14) && !inPlough(x, y + 14))
      )
        continue;
      if (nearRoad(x, y, 12) || inRuin(x, y, -4)) continue;
      rect(g, x, y - 2, 1, 3, r() < 0.5 ? "#c8b46a" : "#a89450");
      if (r() < 0.4) rect(g, x + 1, y - 1, 1, 2, "#d8c47a");
    }
    // колея трактора поперёк пашни
    for (let y = 120; y < WH - 60; y++) {
      const x = Math.round(560 + Math.sin(y * 0.012) * 14);
      if (!inPlough(x, y)) continue;
      rect(g, x - 4, y, 2, 1, "#6e5034");
      rect(g, x + 3, y, 2, 1, "#6e5034");
    }
    // рулоны сена на краю и брошенная борона
    [
      [300, 434],
      [322, 430],
      [470, 438]
    ].forEach(([x, y]) => {
      g.fillStyle = "rgba(30,40,20,.35)";
      g.fillRect(x - 6, y + 4, 14, 4);
      disc(g, x, y, 7, 6, "#c8a04a");
      disc(g, x - 1, y - 1, 5, 4, "#dcb860");
      disc(g, x - 2, y - 2, 2, 1, "#f0d488");
      for (let i = -5; i <= 5; i += 3) rect(g, x + i, y - 4, 1, 8, "#a88438");
      solids.push({ x: x - 6, y: y - 4, w: 12, h: 9 });
    });
    {
      const x = 128,
        y = 600;
      g.fillStyle = "rgba(30,40,20,.35)";
      g.fillRect(x + 2, y + 3, 30, 6);
      rect(g, x, y, 30, 2, "#6a3a26");
      rect(g, x, y + 5, 30, 2, "#6a3a26");
      for (let i = 0; i < 30; i += 4) {
        rect(g, i + x, y, 2, 7, "#7a4a30");
        rect(g, i + x, y + 7, 1, 2, "#4a2a1a");
      }
      solids.push({ x, y, w: 30, h: 8 });
    }
  }
  g.fillStyle = "rgba(26,50,12,.12)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
// ---- ЛЕС (регион «Область»): ельник, поляна с окопами, блиндаж ----
const BLIND = { x: 396, y: 132, w: 76, h: 46 };
const TRENCH = [
  [262, 214],
  [300, 236],
  [290, 268],
  [336, 290],
  [324, 330],
  [372, 352],
  [364, 392],
  [412, 414],
  [404, 446]
];
const TRAIL = [
  [92, 352],
  [140, 340],
  [186, 350],
  [232, 334],
  [270, 326]
];
function segDist(P, x, y) {
  let d = 1e9;
  for (let i = 0; i < P.length - 1; i++) {
    const [a, b] = P[i],
      [c, e] = P[i + 1],
      dx = c - a,
      dy = e - b,
      t = Math.max(0, Math.min(1, ((x - a) * dx + (y - b) * dy) / (dx * dx + dy * dy)));
    d = Math.min(d, Math.hypot(x - a - t * dx, y - b - t * dy));
  }
  return d;
}
function trenchDist(x, y) {
  let d = 1e9;
  for (let i = 0; i < TRENCH.length - 1; i++) {
    const [a, b] = TRENCH[i],
      [c, e] = TRENCH[i + 1],
      dx = c - a,
      dy = e - b,
      t = Math.max(0, Math.min(1, ((x - a) * dx + (y - b) * dy) / (dx * dx + dy * dy)));
    d = Math.min(d, Math.hypot(x - a - t * dx, y - b - t * dy));
  }
  return d;
}
function buildForest() {
  const g = bg.getContext("2d"),
    r = rng(11);
  const img = g.createImageData(WW, WH),
    d = img.data;
  const GL = { x: ZONE.x - 20, y: ZONE.y + 10, r: ZONE.r + 70 }; // поляна
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const n = Math.sin(x * 0.05 + 2) + Math.sin(y * 0.045 - x * 0.02) + Math.sin((x + y) * 0.03);
      const gd = Math.hypot((x - GL.x) / GL.r, (y - GL.y) / (GL.r * 0.85)),
        glade = gd < 1 - n * 0.05;
      const q = r();
      let c;
      if (glade) {
        c =
          q < 0.12 ? [92, 136, 56] : q < 0.24 ? [112, 158, 66] : q < 0.255 ? [124, 168, 74] : [102, 148, 60];
        if (gd > 0.85 && q < 0.35) c = [86, 124, 54];
      } else {
        c = q < 0.14 ? [64, 94, 44] : q < 0.26 ? [86, 120, 56] : [74, 106, 50];
        if (n > 1.1) {
          c = q < 0.5 ? [112, 92, 58] : q < 0.8 ? [98, 80, 50] : [126, 106, 68];
        } // хвоя
        else if (n < -1.3 && q < 0.6) c = [92, 134, 62];
      } // мох
      if (x < 300 && y > 300 && y < 380) {
        const td = segDist(TRAIL, x, y);
        if (td < 4 && !(td > 3 && r() < 0.5)) c = r() < 0.08 ? [136, 112, 76] : [112, 90, 60];
        else if (td < 6 && r() < 0.3) c = [92, 128, 58];
      }
      const dx = Math.abs(x - rx);
      if (dx < 8 && !(dx > 6 && r() < 0.5)) {
        c = [118, 94, 62];
        const rr = x - rx;
        if (Math.abs(rr - 3.5) < 1.1 || Math.abs(rr + 3.5) < 1.1) c = [92, 72, 48];
        else if (Math.abs(rr) < 1.6 && r() < 0.7) c = [84, 118, 52];
        else if (r() < 0.05) c = [136, 112, 76];
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  // лужи на лесной дороге
  [
    [300, 10, 5],
    [470, 8, 4]
  ].forEach(([yy, a, b]) => {
    const px = roadX(yy) + 1;
    disc(g, px, yy + 1, a + 1, b + 1, "#4d5f3e");
    disc(g, px, yy, a, b, "#6f8f94");
    disc(g, px - 2, yy - 2, 3, 1, "#b7d0d0");
  });
  // окопы: зигзаг через поляну, бруствер с одной стороны
  for (let y = 150; y < 480; y++)
    for (let x = 220; x < 470; x++) {
      const td = trenchDist(x, y);
      if (td > 7) continue;
      let c = null;
      if (td < 3.2) c = (x + y) % 7 === 0 ? "#33281a" : "#3f3121";
      else if (td < 4.4) c = "#5e4a30";
      else if (td < 6) c = r() < 0.5 ? "#8a6e46" : "#7a6040";
      else if (r() < 0.4) c = "#6e8a44";
      if (c) {
        g.fillStyle = c;
        g.fillRect(x, y, 1, 1);
      }
    }
  for (let i = 0; i < TRENCH.length - 1; i++) {
    const [a, b] = TRENCH[i],
      [c, e] = TRENCH[i + 1];
    for (let t = 0; t < 1; t += 0.12) {
      const x = a + (c - a) * t,
        y = b + (e - b) * t;
      if (r() < 0.6) {
        rect(g, x - 6, y - 6, 3, 2, "#8c8466");
        rect(g, x - 6, y - 6, 3, 1, "#aba387");
      }
    }
  }
  // блиндаж: земляной холм, накат из брёвен, тёмный вход
  const B = BLIND;
  g.fillStyle = "rgba(20,30,12,.35)";
  g.fillRect(B.x + 3, B.y + B.h - 4, B.w, 6);
  disc(g, B.x + B.w / 2, B.y + B.h / 2 + 4, B.w / 2 + 4, B.h / 2, "#4a6a34");
  disc(g, B.x + B.w / 2, B.y + B.h / 2 + 2, B.w / 2, B.h / 2 - 3, "#6a8a44");
  for (let k = 0; k < 60; k++) {
    const a = r() * 6.28,
      dd = r();
    rect(
      g,
      B.x + B.w / 2 + (Math.cos(a) * dd * B.w) / 2,
      B.y + B.h / 2 + 2 + Math.sin(a) * dd * (B.h / 2 - 4),
      1,
      1,
      r() < 0.5 ? "#7e9c50" : "#567a3a"
    );
  }
  for (let j = 0; j < 5; j++) {
    const y = B.y + 8 + j * 5;
    rect(g, B.x + 8, y, B.w - 16, 4, "#6a4a2c");
    rect(g, B.x + 8, y, B.w - 16, 1, "#8a6640");
    rect(g, B.x + 8, y + 3, B.w - 16, 1, "#4a3220");
    disc(g, B.x + 8, y + 2, 2, 2, "#9a7a50");
    disc(g, B.x + 8, y + 2, 1, 1, "#6a4a2c");
    disc(g, B.x + B.w - 8, y + 2, 2, 2, "#9a7a50");
  }
  rect(g, B.x + B.w / 2 - 7, B.y + B.h - 10, 14, 10, "#1b140c");
  rect(g, B.x + B.w / 2 - 8, B.y + B.h - 11, 16, 2, "#5a3e24");
  rect(g, B.x + B.w / 2 - 8, B.y + B.h - 11, 2, 11, "#5a3e24");
  rect(g, B.x + B.w / 2 + 6, B.y + B.h - 11, 2, 11, "#5a3e24");
  solids.push({ x: B.x + 4, y: B.y + 6, w: B.w - 8, h: B.h - 8 });
  const shadow = (x, y, rw) => {
    g.fillStyle = "rgba(20,34,12,.38)";
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.floor(rw * Math.sqrt(1 - (dy * dy) / 16));
      g.fillRect(x + 3 - w, y + dy, w * 2, 1);
    }
  };
  const nearRoad = (x, y, m) => Math.abs(x - roadX(y)) < m;
  const inGlade = (x, y, m) => Math.hypot((x - GL.x) / (GL.r + m), (y - GL.y) / ((GL.r + m) * 0.85)) < 1;
  const inBlind = (x, y, m) => x > B.x - m && x < B.x + B.w + m && y > B.y - m && y < B.y + B.h + m + 10;
  const free = (x, y, dmin) => !trees.some(t => Math.hypot(t.x - x, t.y - y) < dmin);
  function addTree(x, y, kind) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    shadow(x, y, kind === 4 ? 11 : 14);
  }
  function addBush(x, y) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind: 2 });
    solids.push({ x: x - 5, y: y - 5, w: 10, h: 5 });
    shadow(x, y, 9);
  }
  const kindF = () => {
    const q = r();
    return q < 0.58 ? 4 : q < 0.82 ? 3 : 0;
  };
  const startZone = (x, y) => (y > WH - 90 && Math.abs(x - roadX(y)) < 70) || segDist(TRAIL, x, y - 18) < 26;
  // густой лес: плотнее у краёв, реже у поляны
  for (let a = 0; a < 9000; a++) {
    const x = 6 + r() * (WW - 12),
      y = 16 + r() * (WH - 18);
    if (nearRoad(x, y, 24) || inGlade(x, y, 6) || inBlind(x, y, 16) || startZone(x, y)) continue;
    const edge = Math.min(x, WW - x, y, WH - y),
      dmin = edge < 50 ? 16 : inGlade(x, y, 60) ? 26 : 20;
    if (!free(x, y, dmin)) continue;
    addTree(x, y, kindF());
  }
  // одинокие деревья и кусты на поляне
  for (let a = 0, n = 0; a < 400 && n < 7; a++) {
    const x = GL.x + (r() - 0.5) * GL.r * 1.6,
      y = GL.y + (r() - 0.5) * GL.r * 1.3;
    if (
      !inGlade(x, y, -20) ||
      Math.hypot(x - ZONE.x, y - ZONE.y) < ZONE.r * 0.55 ||
      trenchDist(x, y) < 14 ||
      inBlind(x, y, 14) ||
      !free(x, y, 40)
    )
      continue;
    if (r() < 0.5) addTree(x, y, r() < 0.6 ? 3 : 4);
    else addBush(x, y);
    n++;
  }
  // поваленные стволы и пни
  for (let a = 0, n = 0; a < 400 && n < 9; a++) {
    const x = 30 + r() * (WW - 90),
      y = 40 + r() * (WH - 80),
      len = 22 + Math.floor(r() * 14);
    if (
      nearRoad(x, y, 30) ||
      nearRoad(x + len, y, 30) ||
      inBlind(x, y, 20) ||
      Math.hypot(x - ZONE.x, y - ZONE.y) < ZONE.r ||
      startZone(x, y) ||
      !free(x + len / 2, y, 22)
    )
      continue;
    rect(g, x + 2, y + 4, len, 2, "rgba(20,34,12,.38)");
    rect(g, x, y, len, 5, "#6a4a2c");
    rect(g, x, y, len, 1, "#8e6a42");
    rect(g, x, y + 4, len, 1, "#47301c");
    for (let i = 4; i < len - 2; i += 5 + Math.floor(r() * 4)) rect(g, i + x, y + 1, 2, 1, "#56391f");
    disc(g, x + len, y + 2, 2, 2, "#b08a5a");
    rect(g, x + len, y + 2, 1, 1, "#7a5a36");
    for (let i = 0; i < len; i += 3) if (r() < 0.45) rect(g, x + i, y - 1, 2, 1, "#6e9a44");
    solids.push({ x, y: y - 1, w: len + 2, h: 7 });
    n++;
  }
  for (let a = 0, n = 0; a < 300 && n < 14; a++) {
    const x = 20 + r() * (WW - 40),
      y = 30 + r() * (WH - 60);
    if (
      nearRoad(x, y, 20) ||
      inBlind(x, y, 10) ||
      Math.hypot(x - ZONE.x, y - ZONE.y) < ZONE.r * 0.8 ||
      startZone(x, y) ||
      !free(x, y, 14)
    )
      continue;
    rect(g, x - 3, y + 2, 9, 2, "rgba(20,34,12,.38)");
    rect(g, x - 3, y - 2, 7, 5, "#6a4a2c");
    rect(g, x + 2, y - 2, 2, 5, "#4e3520");
    disc(g, x, y - 3, 3, 1, "#c9a26a");
    rect(g, x, y - 3, 1, 1, "#8a6a42");
    solids.push({ x: x - 3, y: y - 3, w: 7, h: 5 });
    n++;
  }
  const ok = (x, y) =>
    !nearRoad(x, y, 10) && !inBlind(x, y, 2) && trenchDist(x, y) > 7 && segDist(TRAIL, x, y) > 6;
  // папоротник
  function fern(x, y) {
    const c1 = "#3e7a34",
      c2 = "#5c9a44",
      c3 = "#86c060";
    rect(g, x - 4, y + 1, 9, 1, "rgba(20,34,12,.3)");
    for (let k = -1; k <= 1; k++) {
      for (let i = 0; i < 5; i++) {
        rect(g, x + k * (1 + i), y - i + Math.abs(k) * Math.floor(i / 2), 1, 1, i < 2 ? c1 : c2);
      }
    }
    rect(g, x, y - 5, 1, 5, c1);
    rect(g, x - 1, y - 4, 1, 1, c3);
    rect(g, x + 1, y - 3, 1, 1, c3);
    rect(g, x - 3, y - 2, 1, 1, c3);
    rect(g, x + 3, y - 2, 1, 1, c3);
  }
  for (let k = 0; k < 420; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!ok(x, y) || inGlade(x, y, -30)) continue;
    fern(x, y);
  }
  // трава на поляне
  function tuft(x, y) {
    rect(g, x - 2, y + 1, 5, 1, "rgba(40,70,20,.25)");
    rect(g, x, y - 3, 1, 4, "#3f7a2a");
    rect(g, x - 1, y - 1, 1, 2, "#3f7a2a");
    rect(g, x + 1, y - 2, 1, 3, "#4b8a30");
    rect(g, x, y - 3, 1, 1, "#8cc455");
    rect(g, x + 1, y - 2, 1, 1, "#8cc455");
  }
  for (let k = 0; k < 520; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!ok(x, y) || !inGlade(x, y, 0)) continue;
    tuft(x, y);
  }
  // грибы и ягоды
  for (let k = 0; k < 26; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!ok(x, y)) continue;
    if (r() < 0.4) {
      rect(g, x, y, 1, 2, "#efe6d0");
      rect(g, x - 1, y - 1, 3, 1, "#d0402e");
      rect(g, x, y - 2, 1, 1, "#d0402e");
      rect(g, x - 1, y - 1, 1, 1, "#fff");
    } else if (r() < 0.6) {
      rect(g, x, y, 2, 2, "#e8dcc0");
      rect(g, x - 1, y - 1, 4, 1, "#7a4a26");
      rect(g, x, y - 2, 2, 1, "#94603a");
    } else {
      rect(g, x, y, 1, 1, "#3a4ea8");
      rect(g, x + 2, y + 1, 1, 1, "#3a4ea8");
      rect(g, x + 1, y - 1, 1, 1, "#5a6ec8");
      rect(g, x - 1, y + 1, 3, 1, "#3f7a2a");
    }
  }
  // ржавая колючка у окопа
  for (let x = 246; x < 300; x += 2) {
    const y = 200 + Math.round(Math.sin(x * 0.4) * 1.5);
    rect(g, x, y, 1, 1, x % 6 === 0 ? "#8a5a3a" : "#6a5040");
  }
  g.fillStyle = "rgba(16,30,8,.12)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
// ---- БОЛОТО (регион «Глушь»): топь, гать, остров с обломками самолёта ----
const POOLS = [
  [150, 170, 62, 38],
  [545, 135, 70, 44],
  [565, 470, 58, 48],
  [205, 505, 72, 44],
  [300, 105, 42, 26],
  [470, 575, 46, 24],
  [215, 330, 46, 30],
  [330, 430, 34, 22],
  [600, 300, 26, 40]
];
const GAT = [
  [92, 342],
  [150, 332],
  [214, 334],
  [262, 322],
  [318, 312]
];
const ISLE = { x: ZONE.x + 6, y: ZONE.y - 4, rx: ZONE.r + 34, ry: ZONE.r + 18 };
function waterAt(x, y) {
  let v = 0;
  for (const [cx, cy, rx, ry] of POOLS) {
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    if (d < 1.6) v = Math.max(v, 1.6 - d);
  }
  return v;
} // >0.6 — вода
function buildSwamp() {
  const g = bg.getContext("2d"),
    r = rng(23);
  const img = g.createImageData(WW, WH),
    d = img.data;
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const n = Math.sin(x * 0.06 + 1) + Math.sin(y * 0.05 - x * 0.025) + Math.sin((x - y) * 0.035);
      const q = r(),
        wv = waterAt(x + Math.sin(y * 0.3) * 1.5, y + Math.sin(x * 0.3) * 1.5),
        isle = ((x - ISLE.x) / ISLE.rx) ** 2 + ((y - ISLE.y) / ISLE.ry) ** 2 < 1 - n * 0.04;
      let c;
      if (wv > 0.6) {
        c = wv > 0.95 ? (q < 0.1 ? [46, 72, 70] : [38, 62, 62]) : q < 0.5 ? [58, 84, 72] : [66, 92, 74];
        if (q < 0.012) c = [150, 176, 160];
      } else if (wv > 0.45) {
        c = q < 0.5 ? [84, 92, 52] : [70, 80, 46];
      } // топкий край
      else if (isle) {
        c = q < 0.14 ? [86, 104, 50] : q < 0.28 ? [104, 122, 58] : [96, 116, 55];
        if (n > 1.1 && q < 0.4) c = [122, 130, 62];
      } // остров посуше
      else {
        c = q < 0.15 ? [86, 100, 52] : q < 0.28 ? [110, 118, 58] : [96, 110, 56];
        if (n > 1.1 && q < 0.55)
          c = q < 0.3 ? [142, 146, 70] : [126, 134, 62]; // сфагнум
        else if (n < -1.2 && q < 0.6) c = q < 0.3 ? [88, 74, 50] : [100, 84, 56];
      } // торф
      const dx = Math.abs(x - rx);
      if (dx < 8 && !(dx > 6 && r() < 0.5)) {
        c = q < 0.5 ? [96, 80, 56] : [104, 88, 60];
        const rr = x - rx;
        if (Math.abs(rr - 3.5) < 1.1 || Math.abs(rr + 3.5) < 1.1) c = [70, 58, 40];
        else if (q < 0.05) c = [74, 96, 88];
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  // вода непроходима (кроме гати)
  for (let ty = 0; ty < MH; ty++)
    for (let tx = 0; tx < MW; tx++) {
      const x = tx * TS + 8,
        y = ty * TS + 8;
      if (waterAt(x, y) > 0.6 && segDist(GAT, x, y) > 9)
        solids.push({ x: tx * TS, y: ty * TS, w: TS, h: TS });
    }
  // рогоз и осока по берегам
  function reed(x, y) {
    const h = 4 + Math.floor(r() * 4);
    rect(g, x, y - h, 1, h, "#4e6a2c");
    rect(g, x + 1, y - h + 2, 1, h - 2, "#6a8a3a");
    if (r() < 0.5) {
      rect(g, x, y - h - 3, 1, 3, "#5a3a22");
      rect(g, x, y - h - 3, 1, 1, "#7a5432");
    }
  }
  for (let k = 0; k < 1400; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH),
      w = waterAt(x, y);
    if (w < 0.38 || w > 0.72 || segDist(GAT, x, y) < 8 || Math.abs(x - roadX(y)) < 10) continue;
    reed(x, y);
  }
  // ряска и кувшинки
  for (let k = 0; k < 160; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (waterAt(x, y) < 0.8 || segDist(GAT, x, y) < 8) continue;
    if (r() < 0.7) {
      rect(g, x, y, 2, 1, "#7aa040");
      rect(g, x + 1, y + 1, 1, 1, "#5e8a34");
    } else {
      disc(g, x, y, 2, 1, "#5e9a44");
      rect(g, x, y, 1, 1, "#2e4a3a");
      if (r() < 0.4) rect(g, x + 1, y - 1, 1, 1, "#f4f0e0");
    }
  }
  // кочки
  for (let k = 0; k < 150; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (waterAt(x, y) > 0.4 || Math.abs(x - roadX(y)) < 12 || segDist(GAT, x, y) < 9) continue;
    disc(g, x, y + 1, 4, 2, "rgba(30,36,14,.35)");
    disc(g, x, y, 3, 2, "#6a7a3a");
    rect(g, x - 1, y - 3, 1, 3, "#8a9a48");
    rect(g, x + 1, y - 4, 1, 4, "#a0aa52");
    rect(g, x - 2, y - 2, 1, 2, "#8a9a48");
    rect(g, x, y - 4, 1, 1, "#c8c070");
  }
  // гать — настил из жердей от дороги к острову
  for (let i = 0; i < GAT.length - 1; i++) {
    const [a, b] = GAT[i],
      [c, e] = GAT[i + 1],
      len = Math.hypot(c - a, e - b),
      ux = (c - a) / len,
      uy = (e - b) / len;
    for (let t = 0; t < len; t += 3) {
      const x = a + ux * t,
        y = b + uy * t;
      g.fillStyle = "rgba(20,24,10,.35)";
      g.fillRect(Math.round(x - uy * 6) + 1, Math.round(y + ux * 6) + 2, 2, 2);
      for (let k = -5; k <= 5; k++) {
        const px = Math.round(x - uy * k),
          py = Math.round(y + ux * k);
        g.fillStyle = Math.floor(t / 3) % 2 ? "#8a6a42" : "#7a5c38";
        if (Math.abs(k) === 5) g.fillStyle = "#5a4028";
        g.fillRect(px, py, 2, 2);
      }
      if (r() < 0.12) {
        g.fillStyle = "#4a3420";
        g.fillRect(Math.round(x - uy * (r() * 8 - 4)), Math.round(y + ux * (r() * 8 - 4)), 2, 1);
      }
    }
  }
  // обломки самолёта на острове: крыло со звездой, хвост, винт
  const W = { x: 452, y: 250 };
  g.fillStyle = "rgba(20,30,12,.35)";
  g.fillRect(W.x + 2, W.y + 4, 54, 12);
  for (let j = 0; j < 11; j++) {
    const off = Math.round(j * 0.9);
    rect(g, W.x + off, W.y + j, 54 - off * 2, 1, j < 2 ? "#9aa088" : j > 8 ? "#4e5446" : "#6e765e");
  }
  for (let i = 6; i < 50; i += 8) rect(g, W.x + i, W.y + 1, 1, 9, "#5a6250");
  [
    [0, -3],
    [1, -1],
    [3, -1],
    [1, 0],
    [2, 1],
    [0, 0],
    [-1, 1],
    [-2, 1],
    [-1, -1],
    [-3, -1],
    [0, -2]
  ].forEach(([a, b]) => rect(g, W.x + 40 + a, W.y + 5 + b, 1, 1, "#c0302a"));
  rect(g, W.x + 52, W.y + 2, 4, 6, "#3a3a32");
  rect(g, W.x + 54, W.y + 3, 3, 1, "#8a8a78");
  for (let k = 0; k < 8; k++) rect(g, W.x - 6 + r() * 66, W.y + 12 + r() * 10, 2, 1, "#7a5a3a"); // ржавчина вокруг
  solids.push({ x: W.x, y: W.y, w: 56, h: 11 });
  const Tl = { x: 378, y: 332 };
  g.fillStyle = "rgba(20,30,12,.35)";
  g.fillRect(Tl.x + 2, Tl.y + 3, 20, 16);
  for (let j = 0; j < 16; j++) {
    const w = Math.max(3, 18 - j);
    rect(g, Tl.x + (18 - w), Tl.y + j, w, 1, j < 1 ? "#9aa088" : "#6e765e");
  }
  rect(g, Tl.x + 10, Tl.y + 4, 6, 2, "#c0302a");
  rect(g, Tl.x + 12, Tl.y + 2, 2, 6, "#c0302a");
  solids.push({ x: Tl.x + 2, y: Tl.y, w: 16, h: 15 });
  rect(g, 508, 346, 2, 9, "#4a4a40");
  rect(g, 503, 349, 12, 2, "#4a4a40");
  rect(g, 508, 348, 2, 1, "#8a8a78"); // винт
  solids.push({ x: 503, y: 346, w: 12, h: 9 });
  const shadow = (x, y, rw) => {
    g.fillStyle = "rgba(20,30,10,.35)";
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.floor(rw * Math.sqrt(1 - (dy * dy) / 16));
      g.fillRect(x + 3 - w, y + dy, w * 2, 1);
    }
  };
  const free = (x, y, dmin) => !trees.some(t => Math.hypot(t.x - x, t.y - y) < dmin);
  const bad = (x, y) =>
    waterAt(x, y) > 0.42 ||
    Math.abs(x - roadX(y)) < 22 ||
    segDist(GAT, x, y - 14) < 22 ||
    (y > WH - 90 && Math.abs(x - roadX(y)) < 70) ||
    ((x - ISLE.x) / ISLE.rx) ** 2 + ((y - ISLE.y) / ISLE.ry) ** 2 < 0.8 ||
    (x > 440 && x < 520 && y > 240 && y < 290);
  function addTree(x, y, kind) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    shadow(x, y, kind === 5 ? 7 : 11);
  }
  for (let a = 0; a < 5000; a++) {
    const x = 8 + r() * (WW - 16),
      y = 18 + r() * (WH - 22);
    if (bad(x, y)) continue;
    const edge = Math.min(x, WW - x, y, WH - y);
    if (!free(x, y, edge < 40 ? 22 : 40)) continue;
    const q = r();
    addTree(x, y, q < 0.55 ? 5 : q < 0.8 ? 4 : 3);
  }
  addTree(400, 298, 5); // сухая берёза на острове — здесь был костёр группы Серова
  g.fillStyle = "rgba(16,26,8,.12)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
// ---- УСАДЬБА (архивная карта): руины барского дома, аллея, фонтан, пруд, часовня ----
const HOUSE = { x: 372, y: 192, w: 116, h: 58 };
const AVE_Y = 322,
  FOUNT = { x: 430, y: 300 };
const POND = { x: 548, y: 452, rx: 52, ry: 30 };
const CHAPEL = { x: 186, y: 132, w: 32, h: 30 };
const inHouse = (x, y, m) =>
  x > HOUSE.x - m && x < HOUSE.x + HOUSE.w + m && y > HOUSE.y - m && y < HOUSE.y + HOUSE.h + m;
const pondAt = (x, y) => ((x - POND.x) / POND.rx) ** 2 + ((y - POND.y) / POND.ry) ** 2;
function buildManor() {
  const g = bg.getContext("2d"),
    r = rng(41);
  const img = g.createImageData(WW, WH),
    d = img.data;
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const n = Math.sin(x * 0.04 + 3) + Math.sin(y * 0.05 + x * 0.015) + Math.sin((x - y) * 0.025);
      const q = r();
      let c =
        q < 0.12 ? [90, 134, 54] : q < 0.24 ? [112, 156, 64] : q < 0.26 ? [126, 166, 72] : [100, 146, 58];
      if (n < -1.2 && q < 0.5) c = [84, 124, 50];
      const pw = pondAt(x + Math.sin(y * 0.3), y);
      if (pw < 1) {
        c = pw < 0.7 ? (q < 0.5 ? [44, 74, 72] : [52, 82, 78]) : q < 0.5 ? [66, 94, 76] : [74, 100, 78];
        if (q < 0.01) c = [150, 180, 170];
      }
      // аллея: старый гравий, зарос травой
      const ay = Math.abs(y - AVE_Y);
      if (x > rx + 6 && x < FOUNT.x - 16 && ay < 7 && !(ay > 5 && q < 0.5)) {
        c = q < 0.3 ? [150, 140, 112] : q < 0.55 ? [166, 156, 126] : [140, 128, 98];
        if (q > 0.82) c = [104, 146, 58];
      }
      // площадка перед домом
      if (Math.hypot(x - FOUNT.x, (y - FOUNT.y) * 1.2) < 46 && !(pw < 1)) {
        if (q < 0.6) c = q < 0.3 ? [156, 146, 118] : [142, 132, 104];
      }
      const dx = Math.abs(x - rx);
      if (dx < 10 && !(dx > 7 && r() < 0.55)) {
        c = [188, 160, 112];
        const rr = Math.abs(x - rx + 0.5);
        if (Math.abs(rr - 4) < 1.2) c = [160, 132, 90];
        else if (r() < 0.06) c = [204, 178, 128];
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  for (let ty = 0; ty < MH; ty++)
    for (let tx = 0; tx < MW; tx++)
      if (pondAt(tx * TS + 8, ty * TS + 8) < 0.85) solids.push({ x: tx * TS, y: ty * TS, w: TS, h: TS });
  // камыш у пруда
  for (let k = 0; k < 260; k++) {
    const a = r() * 6.28,
      f = 1 + r() * 0.18,
      x = Math.round(POND.x + Math.cos(a) * POND.rx * f),
      y = Math.round(POND.y + Math.sin(a) * POND.ry * f),
      h = 3 + Math.floor(r() * 4);
    rect(g, x, y - h, 1, h, "#4e6a2c");
    if (r() < 0.4) rect(g, x, y - h - 2, 1, 2, "#5a3a22");
  }
  for (let k = 0; k < 20; k++) {
    const a = r() * 6.28,
      f = r() * 0.7;
    const x = POND.x + Math.cos(a) * POND.rx * f,
      y = POND.y + Math.sin(a) * POND.ry * f;
    disc(g, x, y, 2, 1, "#5e9a44");
    if (r() < 0.5) rect(g, x, y - 1, 1, 1, "#f4f0e0");
  }
  // столбы ворот у дороги
  [[AVE_Y - 13], [AVE_Y + 9]].forEach(([y]) => {
    const x = Math.round(roadX(AVE_Y)) + 14;
    g.fillStyle = "rgba(30,40,20,.35)";
    g.fillRect(x + 2, y + 3, 8, 8);
    rect(g, x, y, 8, 8, "#9c4a32");
    rect(g, x, y, 8, 2, "#efe8d4");
    rect(g, x + 1, y + 3, 6, 1, "#b8603f");
    rect(g, x, y + 7, 8, 1, "#5e2c1c");
    solids.push({ x, y, w: 8, h: 8 });
  });
  // дом: оштукатуренные стены, местами голый кирпич, проломы
  const H = HOUSE,
    T = 6;
  const walls = [
    [H.x, H.y, H.w, T],
    [H.x, H.y, T, H.h],
    [H.x + H.w - T, H.y, T, 38],
    [H.x, H.y + H.h - T, 38, T],
    [H.x + 70, H.y + H.h - T, H.w - 70, T],
    [H.x + 44, H.y, T, 30],
    [H.x + 44, H.y + 40, T, 12],
    [H.x + 76, H.y + T, T, 22]
  ];
  const gaps = [
    [H.x + 22, H.y, 14],
    [H.x + 92, H.y, 10]
  ];
  // пол: битый кирпич и штукатурка внутри
  for (let y = H.y + T; y < H.y + H.h - T; y++)
    for (let x = H.x + T; x < H.x + H.w - T; x++) {
      const q = r();
      if (q < 0.45) {
        g.fillStyle = q < 0.15 ? "#8a7a62" : q < 0.3 ? "#9a8a70" : "#7a6a52";
        g.fillRect(x, y, 1, 1);
      }
    }
  for (let k = 0; k < 70; k++) {
    const x = H.x + 8 + r() * (H.w - 16),
      y = H.y + 8 + r() * (H.h - 16);
    rect(g, x, y, 3, 2, pick(["#a8523a", "#b8603f", "#d8c48a", "#efe8d4"], r));
  }
  walls.forEach(([x, y, w, h]) => {
    g.fillStyle = "rgba(30,40,20,.35)";
    g.fillRect(x + 2, y + 3, w, h);
  });
  walls.forEach(([x, y, w, h]) => {
    let segs = [[x, w]];
    gaps.forEach(([gx, gy, gw]) => {
      if (gy === y && h === T) {
        segs = segs.flatMap(([sx, sw]) =>
          gx > sx && gx < sx + sw
            ? [
                [sx, gx - sx],
                [gx + gw, sx + sw - gx - gw]
              ]
            : [[sx, sw]]
        );
      }
    });
    segs.forEach(([sx, sw]) => {
      if (sw <= 0) return;
      const W = h === T ? sw : w;
      const X = h === T ? sx : x;
      solids.push({ x: X, y, w: W, h });
      rect(g, X, y, W, h, "#d8c48a");
      rect(g, X, y, W, 1, "#efe8d4");
      rect(g, X, y + h - 1, W, 1, "#a89060");
      for (let k = 0; k < (W * h) / 18; k++) {
        const bx = X + Math.floor(r() * Math.max(1, W - 3)),
          by = y + 1 + Math.floor(r() * Math.max(1, h - 3));
        rect(g, bx, by, 3, 2, r() < 0.5 ? "#9c4a32" : "#b8603f");
        rect(g, bx, by, 3, 1, "#c2b29a");
      }
      if (r() < 0.6) rect(g, X + Math.floor(r() * W), y, 1, h, "#6a5a3a");
    });
  });
  // портик: шесть колонн (две упали), ступени
  const cy = H.y + H.h + 6;
  rect(g, H.x + 36, cy - 2, 46, 16, "#9a968a");
  for (let j = 0; j < 3; j++)
    rect(g, H.x + 34 - j * 2, cy + 14 + j * 3, 50 + j * 4, 3, j % 2 ? "#b0ac9e" : "#c4c0b2");
  [0, 1, 2, 3, 5].forEach(i => {
    if (i === 2) return;
    const x = H.x + 40 + i * 8,
      y = cy + 2;
    g.fillStyle = "rgba(30,40,20,.35)";
    g.fillRect(x + 2, y + 3, 6, 5);
    disc(g, x + 3, y + 3, 3, 3, "#d8d2c0");
    disc(g, x + 3, y + 3, 2, 2, "#f2ecdc");
    rect(g, x + 2, y + 2, 1, 1, "#ffffff");
    solids.push({ x, y, w: 6, h: 6 });
  });
  [
    [H.x + 52, cy + 28, 22],
    [H.x + 84, cy + 8, 18]
  ].forEach(([x, y, l]) => {
    g.fillStyle = "rgba(30,40,20,.35)";
    g.fillRect(x + 2, y + 3, l, 5);
    rect(g, x, y, l, 5, "#e8e2d0");
    rect(g, x, y, l, 1, "#fbf8ee");
    rect(g, x, y + 4, l, 1, "#b8b2a0");
    for (let i = 5; i < l; i += 6) rect(g, i + x, y, 1, 5, "#c8c2b0");
    solids.push({ x, y, w: l, h: 5 });
  });
  // фонтан: каменная чаша, сухая, внутри трава
  disc(g, FOUNT.x, FOUNT.y + 2, 17, 10, "rgba(30,40,20,.3)");
  disc(g, FOUNT.x, FOUNT.y, 16, 9, "#a8a496");
  disc(g, FOUNT.x, FOUNT.y, 13, 7, "#6a7a4a");
  disc(g, FOUNT.x, FOUNT.y - 1, 13, 1, "#c8c4b6");
  for (let k = 0; k < 20; k++)
    rect(g, FOUNT.x - 10 + r() * 20, FOUNT.y - 4 + r() * 8, 1, 1, r() < 0.5 ? "#8cc455" : "#4b8a30");
  rect(g, FOUNT.x - 2, FOUNT.y - 6, 4, 6, "#b8b4a6");
  rect(g, FOUNT.x - 2, FOUNT.y - 6, 4, 1, "#dcd8ca");
  solids.push({ x: FOUNT.x - 3, y: FOUNT.y - 6, w: 6, h: 6 });
  // часовня с зелёным куполом
  const C = CHAPEL;
  g.fillStyle = "rgba(30,40,20,.35)";
  g.fillRect(C.x + 3, C.y + 4, C.w, C.h);
  rect(g, C.x, C.y, C.w, C.h, "#e8e2d0");
  rect(g, C.x, C.y, C.w, 2, "#fbf8ee");
  rect(g, C.x, C.y + C.h - 2, C.w, 2, "#b8b2a0");
  rect(g, C.x + C.w - 3, C.y, 3, C.h, "#c8c2b0");
  for (let k = 0; k < 8; k++) rect(g, C.x + 2 + r() * (C.w - 6), C.y + 3 + r() * (C.h - 8), 3, 2, "#9c4a32");
  rect(g, C.x + C.w / 2 - 4, C.y + C.h - 9, 8, 9, "#2a2018");
  disc(g, C.x + C.w / 2, C.y + 12, 9, 8, "#2e5a3a");
  disc(g, C.x + C.w / 2 - 2, C.y + 10, 5, 4, "#4a8a5a");
  disc(g, C.x + C.w / 2 - 3, C.y + 8, 2, 1, "#8acaa0");
  rect(g, C.x + C.w / 2, C.y, 1, 6, "#c8a040");
  rect(g, C.x + C.w / 2 - 2, C.y + 2, 5, 1, "#c8a040");
  solids.push({ x: C.x, y: C.y + 2, w: C.w, h: C.h - 2 });
  // деревья: липовая аллея и заросший парк
  const shadow = (x, y, rw) => {
    g.fillStyle = "rgba(30,50,18,.35)";
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.floor(rw * Math.sqrt(1 - (dy * dy) / 16));
      g.fillRect(x + 3 - w, y + dy, w * 2, 1);
    }
  };
  const free = (x, y, dmin) => !trees.some(t => Math.hypot(t.x - x, t.y - y) < dmin);
  function addTree(x, y, kind) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    shadow(x, y, kind === 2 ? 9 : 14);
  }
  for (let x = Math.round(roadX(AVE_Y)) + 40; x < FOUNT.x - 40; x += 34) {
    addTree(x, AVE_Y - 12, 0);
    addTree(x + 6, AVE_Y + 50, 0);
  }
  const bad = (x, y) =>
    Math.abs(x - roadX(y)) < 26 ||
    inHouse(x, y, 26) ||
    (y > AVE_Y - 34 && y < AVE_Y + 84 && x < FOUNT.x + 40) ||
    Math.hypot(x - FOUNT.x, y - FOUNT.y) < 56 ||
    pondAt(x, y) < 1.5 ||
    (x > C.x - 18 && x < C.x + C.w + 18 && y > C.y - 10 && y < C.y + C.h + 26) ||
    (y > WH - 90 && Math.abs(x - roadX(y)) < 70) ||
    Math.hypot(x - ZONE.x, y - 40 - ZONE.y) < ZONE.r * 0.95 ||
    Math.hypot(x - ZONE.x, y - ZONE.y) < ZONE.r * 0.8;
  for (let a = 0; a < 7000; a++) {
    const x = 8 + r() * (WW - 16),
      y = 18 + r() * (WH - 22);
    if (bad(x, y)) continue;
    const edge = Math.min(x, WW - x, y, WH - y);
    if (!free(x, y, edge < 50 ? 22 : 38)) continue;
    const q = r();
    addTree(x, y, q < 0.5 ? 0 : q < 0.68 ? 1 : q < 0.86 ? 3 : 2);
  }
  // мелочь: трава, цветы, битый кирпич у дома
  const ok = (x, y) => Math.abs(x - roadX(y)) > 12 && !inHouse(x, y, 2) && pondAt(x, y) > 1.1;
  function tuft(x, y) {
    rect(g, x - 2, y + 1, 5, 1, "rgba(40,70,20,.25)");
    rect(g, x, y - 3, 1, 4, "#3f7a2a");
    rect(g, x - 1, y - 1, 1, 2, "#3f7a2a");
    rect(g, x + 1, y - 2, 1, 3, "#4b8a30");
    rect(g, x, y - 3, 1, 1, "#8cc455");
    rect(g, x + 1, y - 2, 1, 1, "#8cc455");
  }
  for (let k = 0; k < 700; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (ok(x, y)) tuft(x, y);
  }
  for (let k = 0; k < 160; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!ok(x, y)) continue;
    const col = pick(["#f6f2e6", "#f0c93c", "#b88ad8", "#8fb3e0"], r);
    rect(g, x, y, 1, 1, col);
    rect(g, x + 1, y + 1, 1, 1, col);
  }
  for (let k = 0; k < 60; k++) {
    const x = H.x - 14 + r() * (H.w + 28),
      y = H.y - 10 + r() * (H.h + 40);
    if (inHouse(x, y, -2)) continue;
    rect(g, x, y, 3, 2, pick(["#a8523a", "#b8603f", "#d8c48a", "#9b9586"], r));
  }
  g.fillStyle = "rgba(26,50,12,.12)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
let worldKind = null;
const LOC = (r, map) =>
  map === 4
    ? "hillfort"
    : map === 5
      ? "flooded"
      : map === 3
        ? "manor"
        : r === 2
          ? "forest"
          : r === 3
            ? "swamp"
            : "plough";
const GROUND = { field: "#70a640", plough: "#70a640", forest: "#4e7040", swamp: "#5e6c3a", manor: "#6a9a44" };
// ---- ГОРОДИЩЕ (отчёт экспедиции 1954 г.): мыс над рекой, валы и ров, обрыв к воде ----
const HF = { x: ZONE.x, y: ZONE.y, rv: 126, rd: 146 };
const HF_RK = { x: HF.x - 58, y: HF.y - 52, w: 52, h: 30 },
  HF_BL = { x: HF.x + 44, y: HF.y + 34 },
  HF_TW = { x: HF.x + 34, y: HF.y - 46 },
  HF_PITS = [
    [HF.x - 20, HF.y + 46],
    [HF.x + 70, HF.y - 14],
    [HF.x - 84, HF.y + 6]
  ];
const hfRiver = y => 586 + Math.sin(y * 0.013) * 16 + Math.sin(y * 0.041) * 5; // правый берег — вода правее
const hfTop = x => 54 + Math.sin(x * 0.017) * 10; // верхняя излучина — вода выше
const hfWater = (x, y) => x > hfRiver(y) || (x > 260 && y < hfTop(x) + Math.max(0, (x - 260) * 0.12));
const hfBank = (x, y) =>
  !hfWater(x, y) && (hfWater(x + 22, y) || hfWater(x, y - 20) || hfWater(x + 16, y - 14)); // обрыв: полоса у воды
const hfGateA = Math.atan2(1, -1); // ворота смотрят вниз-влево, к дороге
const hfRing = (x, y) => {
  const dx = x - HF.x,
    dy = (y - HF.y) * 1.08,
    d = Math.hypot(dx, dy),
    a = Math.atan2(dy, dx);
  let da = Math.abs(a - hfGateA);
  if (da > Math.PI) da = 2 * Math.PI - da;
  return { d, gate: da < 0.2 };
};
function buildHillfort() {
  const g = bg.getContext("2d"),
    r = rng(41),
    img = g.createImageData(WW, WH),
    d = img.data;
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const n = Math.sin(x * 0.05 + 2) + Math.sin(y * 0.045 - x * 0.02) + Math.sin((x + y) * 0.03),
        q = r();
      let c = q < 0.14 ? [92, 124, 56] : q < 0.3 ? [112, 142, 64] : [102, 134, 60];
      if (n > 1.2 && q < 0.5) c = [124, 150, 70];
      if (n < -1.3 && q < 0.4) c = [86, 112, 52];
      const R = hfRing(x, y);
      if (!R.gate) {
        if (R.d > HF.rv - 14 && R.d < HF.rv + 10) {
          const s = (R.d - (HF.rv - 2)) / 12,
            lit = ((x - HF.x) * -0.6 + (y - HF.y) * -0.8) * (s < 0 ? -1 : 1) > 0;
          c =
            Math.abs(s) < 0.35
              ? q < 0.4
                ? [150, 172, 82]
                : [140, 164, 76]
              : lit
                ? Math.abs(s) < 0.7
                  ? [160, 180, 90]
                  : [172, 188, 98]
                : Math.abs(s) < 0.7
                  ? [92, 118, 54]
                  : [70, 94, 44];
          if (q < 0.05) c = [188, 186, 104];
          if (q > 0.985) c = [214, 206, 120];
        } else if (R.d > HF.rv + 10 && R.d < HF.rd) {
          const m = Math.abs(R.d - (HF.rv + 10 + HF.rd) / 2);
          c = m < 4 ? (q < 0.5 ? [52, 76, 40] : [58, 84, 44]) : q < 0.4 ? [66, 92, 46] : [74, 100, 50];
          if (m < 3 && Math.sin(Math.atan2(y - HF.y, x - HF.x) * 7) > 0.8)
            c = q < 0.3 ? [96, 128, 138] : [78, 110, 124];
        }
      }
      if (hfWater(x, y)) {
        const e = hfWater(x - 6, y) && hfWater(x, y + 6) && !hfBank(x - 8, y);
        c = e ? (q < 0.08 ? [70, 110, 128] : [58, 96, 116]) : q < 0.5 ? [86, 124, 132] : [96, 132, 138];
        if (q < 0.01) c = [190, 214, 220];
      } else if (hfBank(x, y)) {
        let k = 0;
        while (k < 24 && !hfWater(x + k, y) && !hfWater(x, y - k) && !hfWater(x + k * 0.7, y - k * 0.7))
          k += 2;
        c =
          k < 5
            ? q < 0.5
              ? [150, 140, 104]
              : [162, 150, 110]
            : k < 11
              ? (y + Math.round(x * 0.3)) % 5 === 0
                ? [192, 160, 100]
                : q < 0.5
                  ? [214, 184, 122]
                  : [204, 174, 114]
              : k < 17
                ? q < 0.5
                  ? [180, 120, 76]
                  : [168, 110, 70]
                : k < 21
                  ? q < 0.5
                    ? [96, 74, 52]
                    : [86, 66, 46]
                  : q < 0.6
                    ? [84, 120, 52]
                    : [96, 130, 58];
        if (k < 11 && k > 4 && q < 0.02) c = [120, 120, 116];
        if (k >= 17 && k < 21 && q < 0.08) c = [60, 46, 32];
      }
      const dx = Math.abs(x - rx);
      if (y > HF.y && dx < 7 && !(dx > 5 && r() < 0.5)) {
        c = q < 0.5 ? [150, 124, 84] : [158, 132, 90];
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  // тропа от дороги к воротам
  for (let t = 0; t < 1; t += 0.004) {
    const x0 = roadX(560) + 6,
      y0 = 560,
      gx = HF.x + Math.cos(hfGateA) * (HF.rv + 40),
      gy = HF.y + (Math.sin(hfGateA) * (HF.rv + 40)) / 1.08,
      cx = (x0 + gx) / 2 - 30,
      cy = (y0 + gy) / 2 + 40;
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * gx,
      y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * gy;
    rect(g, x - 2, y, 5, 2, r() < 0.5 ? "#9a8458" : "#8c7850");
  }
  for (let ty = 0; ty < MH; ty++)
    for (let tx = 0; tx < MW; tx++) {
      const x = tx * TS + 8,
        y = ty * TS + 8;
      if (hfWater(x, y) && hfWater(x - 6, y)) solids.push({ x: tx * TS, y: ty * TS, w: TS, h: TS });
    }
  // кромка обрыва: тень и корни
  for (let k = 0; k < 900; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!hfBank(x, y)) continue;
    if (r() < 0.5) rect(g, x, y, 2, 1, "#8a6a44");
    else rect(g, x, y, 1, 2, "#6a5034");
  }
  // камыш у воды
  for (let k = 0; k < 500; k++) {
    const x = Math.floor(r() * WW),
      y = Math.floor(r() * WH);
    if (!hfWater(x, y) || (hfWater(x - 10, y) && hfWater(x, y + 10))) continue;
    const h = 4 + Math.floor(r() * 3);
    rect(g, x, y - h, 1, h, "#4e6a2c");
    rect(g, x + 1, y - h + 2, 1, h - 2, "#6a8a3a");
  }
  // табличка «Памятник археологии»
  const S = {
    x: HF.x + Math.cos(hfGateA) * (HF.rv + 30) - 14,
    y: HF.y + (Math.sin(hfGateA) * (HF.rv + 30)) / 1.08 - 24
  };
  rect(g, S.x + 12, S.y + 12, 2, 14, "#4a3a28");
  g.fillStyle = "rgba(20,30,10,.35)";
  g.fillRect(S.x + 3, S.y + 24, 24, 4);
  rect(g, S.x, S.y, 28, 14, "#2a3a5a");
  rect(g, S.x + 1, S.y + 1, 26, 12, "#3a5a8a");
  for (let k = 0; k < 4; k++) rect(g, S.x + 3, S.y + 3 + k * 2.5, 22 - (k % 2) * 6, 1, "#e8e4d0");
  solids.push({ x: S.x + 10, y: S.y + 20, w: 6, h: 6 });
  // раскоп экспедиции 1954 года: прямоугольная яма с уступами, колышки, бечёвка, отвал
  const RK = { x: HF.x - 58, y: HF.y - 52, w: 52, h: 30 };
  g.fillStyle = "rgba(30,20,10,.35)";
  g.fillRect(RK.x + 2, RK.y + 2, RK.w, RK.h);
  rect(g, RK.x, RK.y, RK.w, RK.h, "#7a5a3a");
  rect(g, RK.x + 3, RK.y + 3, RK.w - 6, RK.h - 6, "#664a30");
  rect(g, RK.x + 7, RK.y + 7, RK.w - 14, RK.h - 14, "#54402a");
  rect(g, RK.x, RK.y, RK.w, 2, "#9a7a52");
  rect(g, RK.x, RK.y, 2, RK.h, "#9a7a52");
  for (let k = 0; k < 40; k++) {
    const x = RK.x + 4 + r() * (RK.w - 8),
      y = RK.y + 4 + r() * (RK.h - 8);
    rect(g, x, y, 2, 1, r() < 0.5 ? "#7a9a46" : "#5a7a3a");
  } // заросло
  [
    [0, 0],
    [RK.w, 0],
    [0, RK.h],
    [RK.w, RK.h]
  ].forEach(([a, b]) => {
    rect(g, RK.x + a - 1, RK.y + b - 4, 2, 5, "#e8dcc0");
    rect(g, RK.x + a - 1, RK.y + b - 4, 2, 1, "#c03028");
  });
  for (let x = RK.x; x < RK.x + RK.w; x += 2) rect(g, x, RK.y - 3, 1, 1, "#e8e0c8");
  for (let y = RK.y - 3; y < RK.y + RK.h - 3; y += 2) {
    rect(g, RK.x - 1, y, 1, 1, "#e8e0c8");
    rect(g, RK.x + RK.w - 1, y, 1, 1, "#e8e0c8");
  }
  disc(g, RK.x + RK.w + 12, RK.y + 10, 9, 6, "#8a7048");
  disc(g, RK.x + RK.w + 11, RK.y + 8, 6, 4, "#a08458");
  for (let k = 0; k < 10; k++) rect(g, RK.x + RK.w + 5 + r() * 14, RK.y + 6 + r() * 8, 1, 1, "#6a8a3a");
  // кольцо сгнивших столбов — остатки башни
  for (let a = 0; a < 8; a++) {
    const x = HF.x + 34 + Math.cos(a * 0.785) * 13,
      y = HF.y - 46 + Math.sin(a * 0.785) * 11;
    rect(g, x, y, 3, 3, "#3a2a1a");
    rect(g, x, y, 3, 1, "#6a5034");
  }
  // валун с мхом
  const BL = { x: HF.x + 44, y: HF.y + 34 };
  disc(g, BL.x + 3, BL.y + 5, 12, 4, "rgba(20,30,10,.4)");
  disc(g, BL.x, BL.y, 11, 8, "#6e6e6a");
  disc(g, BL.x - 2, BL.y - 2, 8, 5, "#8e8e88");
  disc(g, BL.x - 4, BL.y - 4, 3, 2, "#b0b0a8");
  for (let k = 0; k < 14; k++)
    rect(g, BL.x - 8 + r() * 14, BL.y + r() * 6, 2, 1, r() < 0.5 ? "#5e7e3a" : "#7a9a46");
  solids.push({ x: BL.x - 10, y: BL.y - 6, w: 20, h: 12 });
  // свежие ямы чужих копателей — конкуренты были тут недавно
  [
    [HF.x - 20, HF.y + 46],
    [HF.x + 70, HF.y - 14],
    [HF.x - 84, HF.y + 6]
  ].forEach(([x, y]) => {
    disc(g, x + 5, y, 5, 3, "#7a5a38");
    disc(g, x + 5, y - 1, 3, 2, "#9a7448");
    disc(g, x, y, 3, 2, "#2a1e12");
    rect(g, x - 1, y - 1, 2, 1, "#4a3622");
  });
  // курган за городищем
  const KG = { x: 150, y: 170 };
  disc(g, KG.x + 4, KG.y + 6, 30, 12, "rgba(20,40,10,.25)");
  disc(g, KG.x, KG.y, 28, 16, "#7a9a48");
  disc(g, KG.x - 4, KG.y - 4, 20, 11, "#8eaa54");
  disc(g, KG.x - 8, KG.y - 7, 10, 5, "#a2b862");
  // кострище туристов у ворот
  const KO = { x: S.x - 26, y: S.y + 40 };
  for (let a = 0; a < 8; a++)
    disc(g, KO.x + Math.cos(a * 0.785) * 7, KO.y + Math.sin(a * 0.785) * 5, 2, 1, "#8a8a84");
  disc(g, KO.x, KO.y, 4, 3, "#2a2420");
  rect(g, KO.x - 1, KO.y - 1, 2, 1, "#c06a2a");
  rect(g, KO.x - 18, KO.y - 3, 12, 3, "#6a4a2a");
  rect(g, KO.x - 18, KO.y - 3, 12, 1, "#8a6a40");
  rect(g, KO.x + 8, KO.y + 5, 12, 3, "#6a4a2a");
  rect(g, KO.x + 8, KO.y + 5, 12, 1, "#8a6a40");
  // мостки и лодка у реки
  const MY = 470,
    MX = Math.round(hfRiver(MY)) - 14;
  for (let k = 0; k < 11; k++) {
    rect(g, MX + k * 3, MY, 2, 8, k % 2 ? "#8a6a42" : "#7a5c38");
    rect(g, MX + k * 3, MY + 8, 2, 1, "#4a3420");
  }
  rect(g, MX + 6, MY + 9, 1, 4, "#3a2a1a");
  rect(g, MX + 26, MY + 9, 1, 4, "#3a2a1a");
  const LB = { x: MX + 18, y: MY + 16 };
  for (let j = 0; j < 8; j++) {
    const w = 26 - Math.abs(j - 3.5) * 4;
    rect(g, LB.x + 13 - w / 2, LB.y + j, w, 1, j < 2 ? "#5a7a8a" : j > 5 ? "#2a3a44" : "#3e5a68");
  }
  rect(g, LB.x + 5, LB.y + 3, 16, 2, "#2a2a24");
  // камни на перекате
  for (let k = 0; k < 10; k++) {
    const y = 120 + r() * 480,
      x = hfRiver(y) + 8 + r() * 20;
    if (!hfWater(x, y)) continue;
    disc(g, x, y, 2, 1, "#8a8a80");
    rect(g, x - 1, y - 1, 1, 1, "#b0b0a6");
    rect(g, x + 3, y, 3, 1, "#c8dce0");
  }
  // деревья вне городища
  const shadow = (x, y, rw) => {
    g.fillStyle = "rgba(30,50,18,.35)";
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.floor(rw * Math.sqrt(1 - (dy * dy) / 16));
      g.fillRect(x + 3 - w, y + dy, w * 2, 1);
    }
  };
  const free = (x, y, dm) => !trees.some(t => Math.hypot(t.x - x, t.y - y) < dm);
  function addTree(x, y, kind) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    shadow(x, y, kind === 2 ? 9 : 13);
  }
  const bad = (x, y) =>
    hfWater(x, y) ||
    hfWater(x + 26, y) ||
    hfWater(x, y - 26) ||
    hfRing(x, y - 14).d < HF.rd + 14 ||
    Math.abs(x - roadX(y)) < 24 ||
    (y > WH - 90 && Math.abs(x - roadX(y)) < 70) ||
    Math.hypot(x - S.x - 14, y - S.y - 14) < 44 ||
    Math.hypot(x - 150, y - 176) < 40 ||
    (y > 440 && y < 510 && x > hfRiver(y) - 70);
  for (let a = 0; a < 6000; a++) {
    const x = 8 + r() * (WW - 16),
      y = 18 + r() * (WH - 22);
    if (bad(x, y)) continue;
    const edge = Math.min(x, WW - x, y, WH - y);
    if (!free(x, y, edge < 40 ? 24 : 44)) continue;
    const q = r();
    addTree(x, y, q < 0.35 ? 3 : q < 0.7 ? 0 : q < 0.9 ? 4 : 2);
  }
  addTree(KG.x + 6, KG.y - 14, 0); // старый дуб на кургане
  for (let k = 0; k < 5; k++) {
    const a = r() * 6.28,
      rr = 60 + r() * 30,
      x = HF.x + Math.cos(a) * rr,
      y = HF.y + Math.sin(a) * rr;
    if (free(x, y, 30) && Math.hypot(x - HF.x - 44, y - HF.y - 34) > 20) addTree(x, y, 2);
  } // кусты внутри площадки
  g.fillStyle = "rgba(16,26,8,.12)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
// ---- ЗАТОПЛЕННАЯ ДЕРЕВНЯ: водохранилище отступило, на илистом берегу — фундаменты ----
const FLD_HOUSES = [
  [226, 262],
  [290, 256],
  [352, 262],
  [470, 258],
  [532, 264],
  [238, 350],
  [302, 344],
  [466, 352],
  [528, 346]
];
const FLD_CHURCH = { x: 384, y: 330, w: 62, h: 40 };
const fldWater = (x, y) =>
  y < 128 + Math.sin(x * 0.021) * 16 + Math.sin(x * 0.05) * 5 || x > 604 + Math.sin(y * 0.03) * 10;
const fldShore = (x, y) => !fldWater(x, y) && (fldWater(x, y - 26) || fldWater(x + 26, y));
function buildFlooded() {
  const g = bg.getContext("2d"),
    r = rng(57),
    img = g.createImageData(WW, WH),
    d = img.data;
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const q = r(),
        n = Math.sin(x * 0.07) + Math.sin(y * 0.06 + x * 0.02) + Math.sin((x - y) * 0.04);
      let c;
      const grass = y > 500 + Math.sin(x * 0.03) * 20;
      // ил с трещинами
      const cx = Math.sin(x * 0.21 + Math.sin(y * 0.13) * 2) + Math.sin(y * 0.19 + Math.sin(x * 0.11) * 2);
      c = q < 0.3 ? [150, 138, 112] : q < 0.6 ? [160, 148, 120] : [142, 130, 104];
      if (Math.abs(cx) < 0.07) c = [104, 94, 76];
      if (n > 1.4 && q < 0.5) c = [132, 140, 96];
      if (grass) {
        c = q < 0.2 ? [96, 128, 58] : q < 0.45 ? [112, 140, 64] : [104, 134, 60];
        if (q < 0.06) c = [150, 138, 112];
      } else if (y > 420 && q < ((y - 420) / 200) * 0.6) c = q < 0.15 ? [110, 136, 62] : [118, 142, 70]; // молодая трава к берегу
      if (fldWater(x, y)) {
        const deep = fldWater(x, y + 14) && fldWater(x - 14, y);
        c = deep ? (q < 0.06 ? [60, 92, 112] : [52, 84, 104]) : q < 0.5 ? [92, 118, 118] : [100, 124, 122];
        if (q < 0.008) c = [200, 220, 226];
      } else if (fldShore(x, y)) {
        c = q < 0.4 ? [112, 100, 80] : [122, 108, 86];
        if (q < 0.03) c = [86, 110, 70];
      }
      if (Math.abs(x - rx) < 7 && grass) {
        c = q < 0.5 ? [150, 124, 84] : [158, 132, 90];
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  for (let ty = 0; ty < MH; ty++)
    for (let tx = 0; tx < MW; tx++) {
      const x = tx * TS + 8,
        y = ty * TS + 8;
      if (fldWater(x, y) && fldWater(x, y + 4)) solids.push({ x: tx * TS, y: ty * TS, w: TS, h: TS });
    }
  // линии старого уреза: полосы засохших водорослей и ракушки
  for (let x = 0; x < WW; x++) {
    const base = 128 + Math.sin(x * 0.021) * 16 + Math.sin(x * 0.05) * 5;
    for (const off of [34, 58, 86]) {
      const y = base + off + Math.sin(x * 0.07 + off) * 4;
      if (x > 590) continue;
      rect(g, x, y, 1, 2, off === 34 ? "#7e8a6a" : "#9aa088");
      if (r() < 0.25) rect(g, x, y + 2, 1, 1, "#c8c4b0");
    }
  }
  for (let k = 0; k < 420; k++) {
    const x = r() * WW,
      y = 140 + r() * 340;
    if (fldWater(x, y) || fldShore(x, y)) continue;
    rect(g, x, y, 1, 1, r() < 0.5 ? "#e8e4d8" : "#d0c8b4");
  }
  // лужи, в которых отражается небо
  [
    [200, 420],
    [330, 212],
    [560, 410],
    [120, 300],
    [440, 450],
    [600, 250]
  ].forEach(([x, y], i) => {
    if (fldWater(x, y)) return;
    const rx = 10 + (i % 3) * 5,
      ry = 5 + (i % 2) * 2;
    disc(g, x, y + 1, rx + 3, ry + 2, "#7a6c54");
    disc(g, x, y, rx, ry, "#6a8aa0");
    disc(g, x - 2, y - 1, rx - 3, ry - 2, "#86a6ba");
    rect(g, x - rx + 4, y - 1, 4, 1, "#d8e8f0");
    rect(g, x + 2, y + 1, 3, 1, "#c8dce8");
  });
  // старая улица — полосы колеи
  for (let x = 180; x < 580; x++) {
    const y = 304 + Math.sin(x * 0.02) * 3;
    if (r() < 0.7) {
      rect(g, x, y - 8, 1, 1, "#8a7a5e");
      rect(g, x, y + 8, 1, 1, "#8a7a5e");
    }
  }
  // фундаменты изб: каменный контур, внутри печной развал
  const stone = (x, y) => {
    rect(g, x, y, 3, 2, r() < 0.5 ? "#8e8a80" : "#a8a498");
    rect(g, x, y + 2, 3, 1, "#5e5a52");
  };
  FLD_HOUSES.forEach(([hx, hy]) => {
    const w = 30,
      h = 24;
    g.fillStyle = "rgba(40,36,28,.25)";
    g.fillRect(hx + 2, hy + 2, w, h);
    for (let x = 0; x < w; x += 3) {
      stone(hx + x, hy);
      stone(hx + x, hy + h - 3);
    }
    for (let y = 0; y < h; y += 3) {
      stone(hx, hy + y);
      stone(hx + w - 3, hy + y);
    }
    for (let k = 0; k < 6; k++)
      rect(g, hx + 8 + r() * 12, hy + 7 + r() * 9, 3, 2, r() < 0.5 ? "#9a4a34" : "#7a3a28");
  });
  // церковь: фундамент с апсидой
  const C = FLD_CHURCH;
  for (let x = 0; x < C.w; x += 3) {
    stone(C.x + x, C.y);
    stone(C.x + x, C.y + C.h - 3);
  }
  for (let y = 0; y < C.h; y += 3) {
    stone(C.x, C.y + y);
    stone(C.x + C.w - 3, C.y + y);
  }
  for (let a = -1.5; a <= 1.5; a += 0.12)
    stone(C.x + C.w + Math.cos(a) * 14 - 2, C.y + C.h / 2 + Math.sin(a) * 16);
  // колодцы, пни, лодка, столбы ограды
  [
    [268, 306],
    [498, 306]
  ].forEach(([x, y]) => {
    disc(g, x, y, 7, 6, "#5e5a52");
    disc(g, x, y, 5, 4, "#a8a498");
    disc(g, x, y, 3, 2, "#2a3030");
    solids.push({ x: x - 6, y: y - 4, w: 12, h: 9 });
  });
  const stump = (x, y) => {
    disc(g, x + 1, y + 2, 5, 2, "rgba(30,26,20,.35)");
    disc(g, x, y, 4, 3, "#5a4632");
    disc(g, x, y - 1, 3, 2, "#8a6e4a");
    rect(g, x, y - 1, 1, 1, "#5a4632");
  };
  for (let x = 200; x < 580; x += 46) {
    stump(x + r() * 8, 286);
    stump(x + 16 + r() * 8, 326);
  }
  for (let k = 0; k < 26; k++) {
    const x = 180 + k * 15,
      y = 230 + Math.sin(k) * 3;
    if (r() < 0.75) {
      rect(g, x, y - 6, 2, 7, "#4a3a2a");
      rect(g, x, y - 6, 2, 1, "#6a5440");
    }
  }
  // стены церкви выше фундамента: обломки кладки
  const wall = (x, y, w, h) => {
    g.fillStyle = "rgba(30,26,20,.4)";
    g.fillRect(x + 3, y + h, w, 4);
    for (let j = 0; j < h; j += 3)
      for (let i = 0; i < w; i += 4)
        rect(g, x + i + ((j / 3) % 2) * 2, y + j, 4, 3, (i + j) % 7 < 3 ? "#b0aca0" : "#9a968a");
    rect(g, x, y, w, 1, "#c8c4b8");
    rect(g, x, y + h - 1, w, 1, "#6a665e");
    solids.push({ x, y: y + h - 6, w, h: 6 });
  };
  wall(FLD_CHURCH.x, FLD_CHURCH.y - 10, 22, 12);
  wall(FLD_CHURCH.x + FLD_CHURCH.w - 14, FLD_CHURCH.y + FLD_CHURCH.h - 14, 14, 10);
  for (let k = 0; k < 30; k++)
    rect(
      g,
      FLD_CHURCH.x + r() * (FLD_CHURCH.w + 10),
      FLD_CHURCH.y + FLD_CHURCH.h + r() * 10,
      3,
      2,
      r() < 0.5 ? "#a8a498" : "#8a4a34"
    );
  // телеграфные столбы вдоль улицы, покосившиеся, с обрывком провода
  const poles = [
    [196, 292],
    [310, 290],
    [540, 292]
  ];
  poles.forEach(([x, y], i) => {
    const tilt = i % 2 ? 3 : -3;
    for (let j = 0; j < 22; j++)
      rect(g, x + Math.round((tilt * j) / 22), y - j, 2, 1, j > 19 ? "#3a2a1a" : "#5a4430");
    rect(g, x + tilt - 4, y - 20, 10, 1, "#4a3622");
    g.fillStyle = "rgba(30,26,20,.35)";
    g.fillRect(x + 2, y, 8, 2);
  });
  for (let x = 198; x < 308; x++) {
    const t = (x - 198) / 110,
      y = 272 - Math.sin(t * Math.PI) * -10;
    rect(g, x, y, 1, 1, "#2a2620");
  }
  // ржавое колесо телеги и плуг
  disc(g, 250, 410, 7, 7, "#7a4a2a");
  disc(g, 250, 410, 5, 5, "#a49884");
  for (let a = 0; a < 6; a++) rect(g, 250 + Math.cos(a) * 4, 410 + Math.sin(a) * 4, 1, 1, "#7a4a2a");
  rect(g, 249, 409, 3, 3, "#5a3a22");
  for (let k = 0; k < 14; k++) rect(g, 500 + k * 2, 430 - k, 3, 2, k % 3 ? "#8a4a2a" : "#6a3a22");
  rect(g, 524, 412, 2, 8, "#6a3a22");
  // указатель «Заречье»
  rect(g, 168, 382, 2, 14, "#5a5a54");
  rect(g, 156, 374, 28, 9, "#3a5aa0");
  for (let k = 0; k < 5; k++) rect(g, 184 + k, 374 + k, 1, 9 - k * 2, "#3a5aa0");
  rect(g, 157, 375, 26, 7, "#5a7ac0");
  for (let k = 0; k < 4; k++) rect(g, 183 + k, 375 + k, 1, 7 - k * 2, "#5a7ac0");
  rect(g, 160, 377, 15, 3, "#e8ecf4");
  for (let k = 0; k < 4; k++) rect(g, 175 + k, 375 + k, 1, 7 - k * 2, "#e8ecf4");
  for (let k = 0; k < 6; k++) rect(g, 156 + r() * 28, 374 + r() * 9, 1, 1, "#9a5a2a");

  // сваи старой пристани уходят в воду
  for (let k = 0; k < 7; k++) {
    const x = 480 + (k % 2) * 14,
      y = 146 - Math.floor(k / 2) * 12;
    rect(g, x, y, 3, 5, "#3a2a1a");
    rect(g, x, y, 3, 1, "#6a5034");
    rect(g, x - 2, y + 5, 7, 1, "#a8c4cc");
  }
  // остов баржи у правого берега
  for (let j = 0; j < 12; j++) {
    const w = Math.round(30 - Math.abs(j - 6) * 2.5);
    rect(g, 592 - w / 2, 330 + j * 4, w, 3, j % 2 ? "#4a3424" : "#5a4230");
    rect(g, 592 - w / 2, 330 + j * 4, 2, 3, "#2a1e14");
  }
  const B = { x: 150, y: 168 };
  g.fillStyle = "rgba(30,26,20,.35)";
  g.fillRect(B.x + 3, B.y + 7, 40, 5);
  for (let j = 0; j < 9; j++) {
    const w = 40 - Math.abs(j - 4) * 5;
    rect(g, B.x + 20 - w / 2, B.y + j, w, 1, j < 2 ? "#8a6a44" : j > 6 ? "#4a3624" : "#6e5236");
  }
  rect(g, B.x + 6, B.y + 3, 28, 3, "#3a2a1a");
  solids.push({ x: B.x, y: B.y, w: 40, h: 9 });
  // ивы и кусты по краю, где посуше
  const shadow = (x, y, rw) => {
    g.fillStyle = "rgba(30,40,18,.35)";
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.floor(rw * Math.sqrt(1 - (dy * dy) / 16));
      g.fillRect(x + 3 - w, y + dy, w * 2, 1);
    }
  };
  const free = (x, y, dm) => !trees.some(t => Math.hypot(t.x - x, t.y - y) < dm);
  function addTree(x, y, kind) {
    x = Math.round(x);
    y = Math.round(y);
    trees.push({ x, y, kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    shadow(x, y, kind === 2 ? 9 : 13);
  }
  const bad = (x, y) =>
    fldWater(x, y) ||
    fldWater(x, y - 40) ||
    (x > 140 && x < 610 && y > 190 && y < 460) ||
    Math.abs(x - roadX(y)) < 24 ||
    (y > WH - 90 && Math.abs(x - roadX(y)) < 70) ||
    Math.hypot(x - ZONE.x, y - ZONE.y) < ZONE.r;
  for (let a = 0; a < 5000; a++) {
    const x = 8 + r() * (WW - 16),
      y = 18 + r() * (WH - 22);
    if (bad(x, y)) continue;
    const edge = Math.min(x, WW - x, y, WH - y);
    if (!free(x, y, edge < 40 ? 26 : 46)) continue;
    const q = r();
    addTree(x, y, y < 440 ? (q < 0.6 ? 5 : 2) : q < 0.4 ? 0 : q < 0.7 ? 3 : 2);
  }
  g.fillStyle = "rgba(16,26,8,.12)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
function ensureWorld(kind) {
  if (worldKind === kind) return;
  worldKind = kind;
  solids.length = 0;
  trees.length = 0;
  bg.getContext("2d").clearRect(0, 0, WW, WH);
  (
    ({
      forest: buildForest,
      swamp: buildSwamp,
      manor: buildManor,
      hillfort: buildHillfort,
      flooded: buildFlooded,
      plough: () => buildField(true)
    })[kind] || (() => buildField(false))
  )();
}
const nearTrunk = (tx, ty) =>
  trees.some(t => t.kind !== 2 && Math.hypot(t.x - (tx * TS + 8), t.y - (ty * TS + 8)) < 20);
// спрайты деревьев: 0 — лиственное, 1 — в белом цвету, 2 — куст, 3 — берёза
function crown(g, clumps, pal, rr) {
  // pal: [контур, тень, основной, свет, блик]
  clumps.forEach(([x, y, rx, ry]) => disc(g, x, y + 1, rx + 1, ry + 1, pal[0]));
  clumps.forEach(([x, y, rx, ry]) => disc(g, x, y, rx, ry, pal[1]));
  clumps.forEach(([x, y, rx, ry]) => disc(g, x - 1, y - 1, rx - 1, ry - 1, pal[2]));
  clumps.forEach(([x, y, rx, ry]) =>
    disc(
      g,
      x - Math.round(rx * 0.3),
      y - Math.round(ry * 0.35),
      Math.max(1, Math.round(rx * 0.5)),
      Math.max(1, Math.round(ry * 0.45)),
      pal[3]
    )
  );
  clumps.forEach(([x, y, rx, ry]) => {
    rect(g, x - Math.round(rx * 0.45), y - Math.round(ry * 0.55), 2, 1, pal[4]);
  });
  for (let i = 0; i < 40; i++) {
    const c = clumps[Math.floor(rr() * clumps.length)],
      a = rr() * 6.28,
      d = rr();
    g.fillStyle = rr() < 0.5 ? pal[1] : pal[3];
    g.fillRect(
      Math.round(c[0] + Math.cos(a) * c[2] * d * 0.8),
      Math.round(c[1] + Math.sin(a) * c[3] * d * 0.8),
      1,
      1
    );
  }
}
function makeTree(kind) {
  const c = document.createElement("canvas"),
    g = c.getContext("2d"),
    rr = rng(31 + kind);
  if (kind === 2) {
    // куст
    c.width = 26;
    c.height = 20;
    crown(
      g,
      [
        [13, 11, 9, 6],
        [8, 12, 5, 4],
        [18, 12, 5, 4],
        [13, 8, 6, 4]
      ],
      ["#244a1c", "#356b26", "#4a8a32", "#6aaa44", "#9fd070"],
      rr
    );
    for (let i = 0; i < 4; i++) rect(g, 6 + Math.floor(rr() * 14), 8 + Math.floor(rr() * 8), 1, 1, "#f2f0e0");
    return c;
  }
  if (kind === 5) {
    // сухостой
    c.width = 30;
    c.height = 48;
    rect(g, 13, 10, 4, 37, "#8a8478");
    rect(g, 16, 10, 1, 37, "#5e594f");
    rect(g, 13, 10, 1, 37, "#a8a294");
    rect(g, 12, 8, 2, 3, "#8a8478");
    rect(g, 15, 6, 2, 5, "#7a7468");
    rect(g, 14, 4, 1, 3, "#6a655a");
    [
      [13, 18, -1, -1, 7],
      [16, 22, 1, -1, 8],
      [13, 28, -1, -1, 5],
      [16, 14, 1, -1, 5]
    ].forEach(([x, y, dx, dy, n]) => {
      for (let i = 0; i < n; i++)
        rect(g, x + dx * i, y + dy * Math.floor(i * 0.7), 1, 1, i < n - 2 ? "#7a7468" : "#9a948a");
    });
    rect(g, 11, 45, 8, 2, "#4e4a42");
    rect(g, 14, 30, 2, 2, "#3e3a32");
    rect(g, 13, 20, 1, 3, "#6a8a4a");
    rect(g, 16, 34, 1, 2, "#6a8a4a");
    return c;
  }
  if (kind === 4) {
    // ель
    c.width = 34;
    c.height = 54;
    rect(g, 15, 44, 4, 8, "#5a3e24");
    rect(g, 17, 44, 2, 8, "#3e2a18");
    rect(g, 13, 51, 8, 1, "#3e2a18");
    const tiers = [
      [4, 9, 5],
      [10, 13, 8],
      [18, 14, 11],
      [27, 14, 14],
      [35, 12, 16]
    ];
    const pal = ["#0f2414", "#1a3a20", "#24502c", "#33683a", "#5e9a5a"];
    tiers.forEach(([top, h, hw]) => {
      for (let j = 0; j < h; j++) {
        const w = Math.round((hw * (j + 1)) / h);
        rect(g, 17 - w - 1, top + j, w * 2 + 3, 1, pal[0]);
      }
    });
    tiers.forEach(([top, h, hw]) => {
      for (let j = 0; j < h; j++) {
        const w = Math.round((hw * (j + 1)) / h);
        rect(g, 17 - w, top + j, w * 2 + 1, 1, pal[2]);
        rect(g, 17 + Math.ceil(w * 0.25), top + j, Math.max(0, Math.floor(w * 0.75) + 1), 1, pal[1]);
        rect(g, 17 - w, top + j, Math.max(1, Math.round(w * 0.45)), 1, pal[3]);
        if (j === h - 1) {
          for (let i = -w; i <= w; i += 2) rect(g, 17 + i, top + j, 1, 1, pal[1]);
        }
      }
      for (let i = 0; i < Math.round(hw * 0.6); i++) {
        const j = Math.floor(rr() * h),
          w = Math.round((hw * (j + 1)) / h);
        rect(g, 17 - w + Math.floor(rr() * w), top + j, 1, 1, pal[4]);
      }
    });
    rect(g, 16, 2, 2, 3, pal[2]);
    rect(g, 16, 2, 1, 2, pal[3]);
    return c;
  }
  c.width = 42;
  c.height = 50;
  if (kind === 3) {
    // берёза
    rect(g, 19, 26, 4, 22, "#ece8dc");
    rect(g, 22, 26, 1, 22, "#c9c4b6");
    rect(g, 18, 46, 6, 2, "#9a9486");
    [
      [19, 29],
      [21, 33],
      [19, 37],
      [20, 41],
      [21, 44]
    ].forEach(([x, y]) => rect(g, x, y, 2, 1, "#2a2620"));
    rect(g, 15, 30, 4, 1, "#c9c4b6");
    rect(g, 23, 33, 4, 1, "#c9c4b6");
    crown(
      g,
      [
        [21, 18, 10, 11],
        [14, 20, 6, 7],
        [28, 18, 6, 7],
        [21, 10, 7, 7],
        [20, 26, 7, 5]
      ],
      ["#2e5a20", "#4a7d2e", "#62a03c", "#86c052", "#b4dc78"],
      rr
    );
    return c;
  }
  rect(g, 18, 30, 6, 17, "#6a4a2c");
  rect(g, 22, 30, 2, 17, "#4e3520");
  rect(g, 16, 45, 10, 2, "#523820");
  rect(g, 15, 46, 3, 1, "#523820");
  rect(g, 24, 46, 3, 1, "#523820");
  const pal = ["#1f4418", "#2f6224", "#45852f", "#62a23e", "#a2d26a"];
  crown(
    g,
    [
      [21, 20, 14, 12],
      [11, 22, 8, 7],
      [31, 21, 8, 7],
      [21, 11, 10, 8],
      [14, 13, 6, 5],
      [29, 13, 6, 5],
      [21, 28, 10, 5]
    ],
    pal,
    rr
  );
  if (kind === 1) {
    for (let i = 0; i < 34; i++) {
      const x = 6 + Math.floor(rr() * 30),
        y = 4 + Math.floor(rr() * 28);
      if (Math.hypot((x - 21) / 15, (y - 19) / 14) > 1) continue;
      rect(g, x, y, 2, 2, "#fbf8f0");
      rect(g, x + 1, y + 1, 1, 1, i % 3 ? "#f2c6d0" : "#f6e08a");
    }
  }
  return c;
}
ensureWorld("field");
const treeSpr = [makeTree(0), makeTree(1), makeTree(2), makeTree(3), makeTree(4), makeTree(5)];
// сезонные версии деревьев: осенью листва жёлтая и рыжая, зимой снег на кронах
const treeSeason = {};
function treeFor(kind, se) {
  if (!se || se === "summer") return treeSpr[kind];
  const key = kind + se;
  if (treeSeason[key]) return treeSeason[key];
  const src = treeSpr[kind],
    c = document.createElement("canvas");
  c.width = src.width;
  c.height = src.height;
  const g = c.getContext("2d");
  g.drawImage(src, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height),
    p = d.data,
    W = c.width,
    o = new Uint8ClampedArray(p);
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (p[i + 3] < 128) continue;
      const r = p[i],
        gg = p[i + 1],
        b = p[i + 2];
      const green = gg > r + 8 && gg > b;
      if (!green) continue;
      const l = (r + gg + b) / 3,
        above = y === 0 || p[i - W * 4 + 3] < 128;
      if (se === "autumn" && kind !== 4) {
        const yel = kind === 3 || (x * 7 + y * 3) % 5 < 2;
        o[i] = Math.min(255, gg * 1.25 + 20);
        o[i + 1] = Math.round(gg * (yel ? 1.0 : 0.62));
        o[i + 2] = Math.round(b * 0.4);
      } else if (se === "winter") {
        if (kind === 4) {
          if (above || l > 120 || ((x + y) % 3 === 0 && l > 90)) {
            o[i] = o[i + 1] = 236;
            o[i + 2] = 242;
          } else {
            o[i] = Math.round(r * 0.8);
            o[i + 1] = Math.round(gg * 0.85);
            o[i + 2] = Math.round(b * 0.9);
          }
        } else {
          if (above || l > 105) {
            o[i] = o[i + 1] = 232;
            o[i + 2] = 238;
          } else if ((x + y) % 2 === 0) {
            o[i] = 110;
            o[i + 1] = 96;
            o[i + 2] = 80;
          } else o[i + 3] = 0;
        }
      } else if (se === "spring" && kind !== 4) {
        o[i] = Math.min(255, r + 18);
        o[i + 1] = Math.min(255, gg + 22);
        o[i + 2] = Math.min(255, b + 6);
      }
    }
  d.data.set(o);
  g.putImageData(d, 0, 0);
  return (treeSeason[key] = c);
}
