// ================= СЮЖЕТ «СЕРЫЙ»: комиксы, вкладка «Дед» =================
function fillPoly(g, pts, col, step) {
  g.fillStyle = col;
  const ys = pts.map(p => p[1]),
    y0 = Math.ceil(Math.min(...ys)),
    y1 = Math.floor(Math.max(...ys));
  for (let y = y0; y <= y1; y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [a, b] = pts[i],
        [c, d] = pts[(i + 1) % pts.length];
      if ((b <= y && d > y) || (d <= y && b > y)) xs.push(a + ((y - b) * (c - a)) / (d - b));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const a = Math.round(xs[k]),
        b = Math.round(xs[k + 1]);
      if (!step) g.fillRect(a, y, b - a, 1);
      else for (let x = a; x < b; x++) if ((x + y) % step === 0) g.fillRect(x, y, 1, 1);
    }
  }
}
function pline(g, x0, y0, x1, y1, col) {
  g.fillStyle = col;
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
  for (let i = 0; i <= n; i++)
    g.fillRect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1);
}
function spr(g, rows, pal, x, y) {
  const H = rows.length,
    W = rows[0].length,
    at = (i, j) => j >= 0 && j < H && i >= 0 && i < W && rows[j][i] !== ".";
  g.fillStyle = "#120e0a";
  for (let j = -1; j <= H; j++)
    for (let i = -1; i <= W; i++)
      if (!at(i, j) && (at(i - 1, j) || at(i + 1, j) || at(i, j - 1) || at(i, j + 1)))
        g.fillRect(x + i, y + j, 1, 1);
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++)
      if (at(i, j)) {
        g.fillStyle = pal[rows[j][i]];
        g.fillRect(x + i, y + j, 1, 1);
      }
}
const KOSTYA_KNEEL = [
  "....cccccc......",
  "..CCCccccc......",
  "...sshhhhh......",
  "...eshhhhh......",
  "...sssshhh......",
  "....sSs.........",
  "...jjjjjjbbb....",
  "..LjjjJjjbBb....",
  ".LLsjjJjjbBb....",
  "...jjjjJjbbb....",
  "...jjjjjjbbb....",
  "...nnnnnnnn.....",
  "..nnnnnnnnnn....",
  "..oo.....nnn....",
  "..OO......oo....",
  "..........OO...."
];
const PAL_K = Object.assign({}, PAL, { L: "#f6e08a" });
function panelAttic(g, r) {
  rect(g, 0, 0, 120, 150, "#17120e");
  fillPoly(
    g,
    [
      [0, 0],
      [120, 0],
      [120, 92],
      [60, 6],
      [0, 92]
    ],
    "#2a1d14"
  );
  for (let i = -120; i < 240; i += 7) {
    pline(g, 60 + i * 0.0, 6, 0 + i * 0.5 - 60, 92, "#1d140e");
  }
  for (let k = 0; k < 14; k++) {
    const t = k / 14;
    pline(g, 60 - 60 * t, 6 + 86 * t, 60 - 60 * t, 6 + 86 * t, "#3a281a");
  }
  fillPoly(
    g,
    [
      [60, 8],
      [118, 90],
      [2, 90]
    ],
    "#33261a"
  );
  for (let x = 8; x < 114; x += 8)
    for (let y = 10; y < 90; y++) {
      const half = ((y - 8) * 58) / 82;
      if (x > 60 - half && x < 60 + half) (g.fillStyle = "#2a1f15"), g.fillRect(x, y, 1, 1);
    }
  disc(g, 60, 40, 10, 10, "#120e0a");
  disc(g, 60, 40, 8, 8, "#7f97b0");
  disc(g, 58, 38, 4, 4, "#b8cadc");
  rect(g, 59, 32, 2, 17, "#120e0a");
  rect(g, 52, 39, 17, 2, "#120e0a");
  fillPoly(
    g,
    [
      [52, 46],
      [68, 46],
      [96, 138],
      [34, 138]
    ],
    "#9fb4c8",
    3
  );
  rect(g, 0, 90, 120, 60, "#3a2a1c");
  for (let y = 94; y < 150; y += 8) {
    rect(g, 0, y, 120, 1, "#2a1e14");
  }
  for (let k = 0; k < 30; k++) rect(g, r() * 120, 92 + r() * 56, 3, 1, "#4a3624");
  // ящики и чемодан
  rect(g, 4, 98, 28, 24, "#5a4028");
  rect(g, 4, 98, 28, 2, "#7a5838");
  rect(g, 4, 109, 28, 1, "#3a2818");
  rect(g, 17, 98, 1, 24, "#3a2818");
  rect(g, 8, 82, 20, 16, "#6a4a30");
  rect(g, 8, 82, 20, 2, "#8a6840");
  rect(g, 8, 89, 20, 1, "#4a3220");
  rect(g, 6, 124, 30, 10, "#4a3a5a");
  rect(g, 6, 124, 30, 2, "#6a5a7a");
  rect(g, 18, 122, 6, 2, "#2a2030");
  // стул и паутина
  rect(g, 96, 96, 3, 30, "#2a1d14");
  rect(g, 110, 96, 3, 30, "#2a1d14");
  rect(g, 96, 108, 17, 3, "#3a281a");
  rect(g, 96, 84, 3, 24, "#2a1d14");
  rect(g, 96, 84, 17, 3, "#3a281a");
  for (let i = 0; i < 14; i++) {
    pline(g, 0, i * 2, i * 2, 0, "#3a3530");
  }
  pline(g, 0, 10, 14, 4, "#4a4540");
  // луч фонаря на коробку
  fillPoly(
    g,
    [
      [66, 121],
      [70, 124],
      [54, 140],
      [40, 134]
    ],
    "#f6e08a",
    2
  );
  rect(g, 40, 130, 18, 9, "#8a2e24");
  rect(g, 40, 130, 18, 2, "#d9b84a");
  rect(g, 40, 137, 18, 2, "#5e1e18");
  rect(g, 47, 131, 4, 1, "#f6e08a");
  spr(g, KOSTYA_KNEEL, PAL_K, 64, 110);
}
function panelBox(g, r) {
  rect(g, 0, 0, 120, 150, "#4a3220");
  for (let y = 0; y < 150; y += 11) rect(g, 0, y, 120, 1, "#3a2618");
  for (let k = 0; k < 120; k++) rect(g, r() * 120, r() * 150, 4, 1, "#5a3e28");
  disc(g, 60, 72, 62, 62, "#5a3e26");
  disc(g, 60, 72, 46, 46, "#64462c");
  // крышка
  rect(g, 20, 18, 80, 30, "#a8382c");
  rect(g, 20, 18, 80, 2, "#c85040");
  rect(g, 22, 20, 76, 26, "#a8382c");
  for (let i = 0; i < 4; i++) {
    rect(g, 20, 18 + i, 80, 1, i === 0 ? "#f2d36a" : "#d9b84a");
  }
  rect(g, 20, 46, 80, 2, "#d9b84a");
  [
    [34, 32],
    [60, 30],
    [86, 32]
  ].forEach(([x, y]) => {
    disc(g, x, y, 5, 5, "#d9b84a");
    disc(g, x, y, 3, 3, "#a8382c");
    rect(g, x, y, 1, 1, "#f2d36a");
  });
  // коробка
  rect(g, 18, 50, 84, 58, "#8a2e24");
  rect(g, 18, 50, 84, 3, "#d9b84a");
  rect(g, 18, 105, 84, 3, "#d9b84a");
  rect(g, 18, 50, 3, 58, "#d9b84a");
  rect(g, 99, 50, 3, 58, "#d9b84a");
  rect(g, 22, 54, 76, 50, "#3a1e18");
  // фото
  rect(g, 64, 58, 28, 34, "#efe6d0");
  rect(g, 67, 61, 22, 28, "#a8916a");
  disc(g, 78, 72, 5, 6, "#6a5440");
  rect(g, 72, 79, 13, 10, "#5a4632");
  fillPoly(
    g,
    [
      [72, 67],
      [84, 67],
      [82, 64],
      [74, 64]
    ],
    "#4a5a34"
  );
  rect(g, 77, 65, 2, 1, "#c0302a");
  // треугольник
  fillPoly(
    g,
    [
      [26, 60],
      [62, 60],
      [44, 86]
    ],
    "#e8dcc0"
  );
  pline(g, 26, 60, 44, 72, "#b8a888");
  pline(g, 62, 60, 44, 72, "#b8a888");
  pline(g, 44, 72, 44, 86, "#b8a888");
  for (let i = 0; i < 4; i++) pline(g, 32 + i * 3, 63 + i, 52 - i * 2, 63 + i, "#5a5a9a");
  rect(g, 46, 78, 6, 1, "#8a5aa0");
  // звёздочка и пуговицы
  [
    [0, -3],
    [1, -1],
    [3, -1],
    [1, 0],
    [2, 2],
    [0, 1],
    [-2, 2],
    [-1, 0],
    [-3, -1],
    [-1, -1],
    [0, 0],
    [0, -2]
  ].forEach(([a, b]) => rect(g, 34 + a, 96 + b, 1, 1, "#c0302a"));
  disc(g, 52, 96, 2, 2, "#9a8a50");
  disc(g, 58, 98, 2, 2, "#9a8a50");
  // руки
  fillPoly(
    g,
    [
      [0, 118],
      [22, 104],
      [30, 112],
      [10, 130],
      [0, 132]
    ],
    "#eab58c"
  );
  fillPoly(
    g,
    [
      [22, 104],
      [30, 112],
      [26, 116],
      [20, 108]
    ],
    "#c98e66"
  );
  fillPoly(
    g,
    [
      [120, 118],
      [98, 104],
      [90, 112],
      [110, 130],
      [120, 132]
    ],
    "#eab58c"
  );
  fillPoly(
    g,
    [
      [98, 104],
      [90, 112],
      [94, 116],
      [100, 108]
    ],
    "#c98e66"
  );
  rect(g, 0, 130, 16, 20, "#5d7d38");
  rect(g, 104, 130, 16, 20, "#5d7d38");
  rect(g, 0, 130, 16, 2, "#44602a");
  rect(g, 104, 130, 16, 2, "#44602a");
}
function panelLetter(g, r) {
  rect(g, 0, 0, 120, 150, "#2a1e14");
  rect(g, 9, 11, 104, 132, "#120e0a");
  rect(g, 8, 10, 104, 132, "#e6dcc2");
  for (let k = 0; k < 160; k++) rect(g, 8 + r() * 104, 10 + r() * 132, 1, 1, "#d8ccae");
  rect(g, 8, 10, 104, 1, "#c8b894");
  rect(g, 8, 141, 104, 1, "#c8b894");
  rect(g, 8, 10, 1, 132, "#c8b894");
  rect(g, 111, 10, 1, 132, "#c8b894");
  pline(g, 8, 10, 111, 141, "#d4c6a6");
  pline(g, 111, 10, 8, 141, "#d4c6a6");
  pline(g, 60, 10, 60, 141, "#d8cbab");
  for (let row = 0; row < 11; row++) {
    let x = 16 + (row === 0 ? 18 : 0);
    const y = 22 + row * 9;
    while (x < 104 - (row === 10 ? 40 : 0)) {
      const w = 4 + Math.floor(r() * 12);
      if (x + w > 104) break;
      for (let i = 0; i < w; i++) {
        const yy = y + Math.round(Math.sin((x + i) * 0.9 + row) * 1.2);
        g.fillStyle = r() < 0.85 ? "#3a3a7a" : "#5a5a9a";
        g.fillRect(x + i, yy, 1, 1);
        if (r() < 0.3) g.fillRect(x + i, yy - 1, 1, 1);
      }
      x += w + 3;
    }
  }
  for (let i = 0; i < 22; i++) rect(g, 70 + i, 124 + Math.round(Math.sin(i * 0.7) * 2), 1, 1, "#2a2a6a");
  disc(g, 94, 30, 10, 10, "#8a6aa8");
  disc(g, 94, 30, 8, 8, "#e6dcc2");
  disc(g, 94, 30, 7, 7, "#8a6aa8");
  disc(g, 94, 30, 5, 5, "#e6dcc2");
  rect(g, 89, 29, 11, 1, "#8a6aa8");
  rect(g, 91, 26, 7, 1, "#8a6aa8");
  rect(g, 91, 33, 7, 1, "#8a6aa8");
  for (let i = 0; i < 36; i += 2) {
    rect(g, 14 + i, 118, 1, 1, "#9a4040");
    rect(g, 14 + i, 131, 1, 1, "#9a4040");
  }
  rect(g, 14, 118, 1, 14, "#9a4040");
  rect(g, 50, 118, 1, 14, "#9a4040");
  for (let i = 0; i < 4; i++) rect(g, 18 + i * 7, 124, 5, 1, "#9a4040");
}
function panelRoom(g, r) {
  rect(g, 0, 0, 120, 150, "#1a1820");
  for (let k = 0; k < 60; k++) rect(g, r() * 120, r() * 100, 2, 1, "#211f2a");
  rect(g, 80, 12, 32, 40, "#3a3020");
  rect(g, 82, 14, 28, 36, "#1e2c48");
  rect(g, 95, 14, 2, 36, "#3a3020");
  rect(g, 82, 31, 28, 2, "#3a3020");
  disc(g, 103, 22, 3, 3, "#e8e4c8");
  disc(g, 104, 21, 2, 2, "#1e2c48");
  [
    [86, 18],
    [89, 42],
    [106, 40],
    [86, 27]
  ].forEach(([x, y]) => rect(g, x, y, 1, 1, "#d8d8f0"));
  // детектор у стены
  pline(g, 8, 34, 14, 98, "#6a6a70");
  pline(g, 9, 34, 15, 98, "#4a4a50");
  rect(g, 6, 48, 7, 5, "#2a2a30");
  rect(g, 7, 49, 3, 2, "#7ac060");
  disc(g, 15, 101, 7, 2, "#2a2a30");
  disc(g, 15, 100, 5, 1, "#4a4a50");
  // стол
  rect(g, 0, 100, 120, 50, "#4a3426");
  rect(g, 0, 100, 120, 3, "#6a4a34");
  for (let y = 108; y < 150; y += 9) rect(g, 0, y, 120, 1, "#3a281c");
  // лампа
  fillPoly(
    g,
    [
      [22, 98],
      [56, 98],
      [44, 74],
      [30, 74]
    ],
    "#f6dc8a",
    2
  );
  rect(g, 32, 96, 8, 4, "#3a3030");
  rect(g, 35, 80, 2, 16, "#5a5050");
  fillPoly(
    g,
    [
      [28, 82],
      [44, 82],
      [40, 72],
      [32, 72]
    ],
    "#c89a40"
  );
  rect(g, 28, 82, 16, 1, "#8a6a28");
  // ноутбук
  rect(g, 50, 74, 38, 26, "#9a9aa0");
  rect(g, 52, 76, 34, 22, "#2c4a6a");
  for (let i = 0; i < 5; i++) {
    rect(g, 55, 79 + i * 4, 4, 3, "#e9c54a");
    rect(g, 61, 80 + i * 4, 8 + Math.floor(r() * 14), 1, "#8ab0d0");
  }
  rect(g, 46, 100, 46, 3, "#b8b8c0");
  fillPoly(
    g,
    [
      [52, 76],
      [86, 76],
      [100, 150],
      [38, 150]
    ],
    "#8ab0d0",
    4
  );
  // счета и кружка
  for (let i = 0; i < 4; i++) {
    rect(g, 92 + i, 90 - i * 2, 20, 14, i % 2 ? "#e8e4d8" : "#f4f0e6");
    rect(g, 95 + i, 94 - i * 2, 12, 1, "#c0302a");
    rect(g, 95 + i, 97 - i * 2, 14, 1, "#9a9aa0");
  }
  rect(g, 16, 104, 8, 9, "#c0302a");
  rect(g, 23, 106, 3, 4, "#c0302a");
  rect(g, 16, 104, 8, 1, "#e06050");
  // Сергей со спины
  disc(g, 69, 124, 10, 10, "#2a221c");
  fillPoly(
    g,
    [
      [57, 118],
      [81, 118],
      [84, 114],
      [54, 114]
    ],
    "#76853f"
  );
  rect(g, 57, 113, 24, 4, "#76853f");
  rect(g, 58, 112, 22, 2, "#8a9a4a");
  fillPoly(
    g,
    [
      [44, 150],
      [94, 150],
      [88, 132],
      [50, 132]
    ],
    "#44602a"
  );
  fillPoly(
    g,
    [
      [50, 132],
      [88, 132],
      [82, 128],
      [56, 128]
    ],
    "#5d7d38"
  );
  rect(g, 60, 126, 18, 1, "#8ab0d0");
}
function panelMuseum(g, r) {
  rect(g, 0, 0, 120, 150, "#3a3226");
  rect(g, 0, 96, 120, 54, "#2e2418");
  rect(g, 0, 96, 120, 2, "#4a3e2c");
  rect(g, 6, 14, 26, 40, "#2a2218");
  rect(g, 8, 16, 22, 36, "#c8d4dc");
  rect(g, 18, 16, 2, 36, "#2a2218");
  rect(g, 8, 32, 22, 2, "#2a2218");
  fillPoly(
    g,
    [
      [8, 52],
      [30, 52],
      [70, 120],
      [40, 120]
    ],
    "#e8e0c8",
    3
  );
  // полки с экспонатами
  [[30], [56], [82]].forEach(([y]) => {
    rect(g, 82, y, 38, 3, "#5a4028");
    rect(g, 82, y + 3, 38, 1, "#2a1e14");
  });
  disc(g, 92, 24, 7, 5, "#4a5a34");
  rect(g, 85, 25, 14, 4, "#4a5a34");
  rect(g, 88, 21, 3, 1, "#6a7a4a");
  [104, 108, 112].forEach(x => {
    rect(g, x, 18, 3, 12, "#b89a50");
    rect(g, x, 18, 3, 2, "#d8ba70");
  });
  rect(g, 86, 46, 30, 2, "#4a3020");
  rect(g, 86, 48, 6, 4, "#4a3020");
  rect(g, 108, 44, 2, 6, "#5a5a5a");
  rect(g, 88, 66, 12, 14, "#d8c8a0");
  rect(g, 90, 68, 8, 10, "#8a7a5a");
  rect(g, 104, 70, 12, 10, "#5a4632");
  // витрина
  rect(g, 4, 112, 58, 30, "#5a4028");
  rect(g, 6, 104, 54, 12, "#9ab8c8");
  rect(g, 6, 104, 54, 1, "#d8e8f0");
  for (let i = 0; i < 5; i++) disc(g, 14 + i * 10, 110, 2, 2, i % 2 ? "#d9b84a" : "#c0302a");
  // Савельич
  fillPoly(
    g,
    [
      [56, 150],
      [96, 150],
      [92, 96],
      [60, 96]
    ],
    "#6a4a30"
  );
  fillPoly(
    g,
    [
      [70, 96],
      [82, 96],
      [78, 112],
      [74, 112]
    ],
    "#d8d0c0"
  );
  rect(g, 75, 98, 2, 14, "#5a3a2a");
  disc(g, 76, 80, 11, 12, "#e0b08a");
  disc(g, 73, 77, 6, 5, "#ecc29c");
  rect(g, 64, 74, 4, 10, "#b8b4ac");
  rect(g, 85, 74, 4, 10, "#b8b4ac");
  disc(g, 76, 92, 10, 8, "#c8c4bc");
  rect(g, 70, 92, 12, 2, "#a8a49c");
  rect(g, 69, 86, 14, 2, "#c8c4bc");
  rect(g, 67, 79, 7, 5, "#2a2a2a");
  rect(g, 78, 79, 7, 5, "#2a2a2a");
  rect(g, 68, 80, 5, 3, "#d8e8f0");
  rect(g, 79, 80, 5, 3, "#d8e8f0");
  rect(g, 74, 80, 4, 1, "#2a2a2a");
  rect(g, 69, 80, 1, 1, "#ffffff");
  rect(g, 80, 80, 1, 1, "#ffffff");
  // поднял треугольник к свету
  fillPoly(
    g,
    [
      [44, 68],
      [60, 62],
      [56, 78]
    ],
    "#e8dcc0"
  );
  pline(g, 44, 68, 56, 70, "#b8a888");
  fillPoly(
    g,
    [
      [56, 74],
      [64, 70],
      [66, 80],
      [58, 82]
    ],
    "#e0b08a"
  );
  fillPoly(
    g,
    [
      [60, 96],
      [66, 82],
      [60, 80],
      [56, 96]
    ],
    "#6a4a30"
  );
}
function panelSavelich(g, r) {
  rect(g, 0, 0, 120, 150, "#2a2218");
  rect(g, 6, 6, 108, 70, "#d8c8a0");
  for (let k = 0; k < 12; k++)
    disc(g, 10 + r() * 100, 10 + r() * 62, 4 + r() * 8, 3 + r() * 5, r() < 0.6 ? "#a8b878" : "#8aa8b8");
  pline(g, 10, 60, 110, 20, "#7a9ab0");
  for (let i = 0; i < 40; i += 4) pline(g, 20 + i * 2, 50 - i * 0.6, 22 + i * 2, 50 - i * 0.6, "#8a3a3a");
  [
    [30, 30],
    [64, 40],
    [90, 22],
    [52, 58]
  ].forEach(([x, y]) => {
    rect(g, x, y, 2, 2, "#c0302a");
    rect(g, x, y + 2, 1, 3, "#5a5a5a");
  });
  // голова
  fillPoly(
    g,
    [
      [24, 150],
      [96, 150],
      [104, 132],
      [16, 132]
    ],
    "#6a4a30"
  );
  fillPoly(
    g,
    [
      [48, 132],
      [72, 132],
      [66, 146],
      [54, 146]
    ],
    "#d8d0c0"
  );
  disc(g, 60, 78, 30, 34, "#e0b08a");
  disc(g, 52, 62, 16, 14, "#ecc29c");
  disc(g, 74, 90, 14, 16, "#c89a78");
  disc(g, 31, 80, 6, 12, "#b8b4ac");
  disc(g, 89, 80, 6, 12, "#b8b4ac");
  disc(g, 30, 80, 4, 4, "#d09a78");
  disc(g, 60, 112, 30, 26, "#c8c4bc");
  for (let k = 0; k < 26; k++) {
    const x = 36 + r() * 48,
      y = 96 + r() * 36;
    rect(g, x, y, 1, 3, "#a8a49c");
  }
  disc(g, 60, 98, 14, 4, "#b8b4ac");
  rect(g, 52, 104, 16, 2, "#8a5a4a");
  rect(g, 38, 66, 16, 4, "#a8a49c");
  rect(g, 66, 66, 16, 4, "#a8a49c");
  rect(g, 37, 72, 20, 13, "#2a2a2a");
  rect(g, 63, 72, 20, 13, "#2a2a2a");
  rect(g, 39, 74, 16, 9, "#d8e8f0");
  rect(g, 65, 74, 16, 9, "#d8e8f0");
  rect(g, 57, 76, 6, 2, "#2a2a2a");
  rect(g, 45, 77, 4, 4, "#3a2a20");
  rect(g, 71, 77, 4, 4, "#3a2a20");
  rect(g, 40, 75, 4, 2, "#ffffff");
  rect(g, 66, 75, 4, 2, "#ffffff");
  fillPoly(
    g,
    [
      [58, 84],
      [62, 84],
      [65, 96],
      [55, 96]
    ],
    "#c89a78"
  );
}
const PANELS = {
  attic: panelAttic,
  box: panelBox,
  letter: panelLetter,
  room: panelRoom,
  museum: panelMuseum,
  savelich: panelSavelich
};
const PANEL_IMG = {};
function panelPic(id) {
  if (PANEL_IMG[id]) return PANEL_IMG[id];
  const c = document.createElement("canvas");
  c.width = 160;
  c.height = 200;
  const g = c.getContext("2d");
  PANELS[id](g, rng(id.length * 97 + 13));
  return (PANEL_IMG[id] = c.toDataURL());
}
const COMICS = {
  prologue: {
    title: "Пролог · Чердак",
    pages: [
      {
        p: "attic",
        cap: "Бабушкин дом в пригороде. Месяц после похорон. Я полез на чердак — посмотреть, что можно продать."
      },
      {
        p: "box",
        cap: "Под старыми журналами — жестяная коробка из-под леденцов. Фотография, звёздочка с пилотки и листок, сложенный треугольником."
      },
      {
        p: "letter",
        say: 1,
        cap: "«Здравствуй, мама! Стоим у деревни, где речка петлёй, а на горе барский дом с колоннами. Кормят хорошо, не волнуйся. Нюрке скажи — вернусь. Твой Андрей». Полевая почта 49127. Октябрь 1942-го."
      },
      {
        p: "room",
        cap: "Больше писем не было — в бабушкиных бумагах только «пропал без вести». А у меня — самодельный детектор и форум, где меня, Сергея Серова, быстро прозвали Серым."
      },
      {
        p: "loan",
        cap: "И долг. Мы с приятелем открыли в гараже шиномонтаж, взяли займ — 150 тысяч под залог гаража. Приятель уехал, шиномонтаж закрылся, а займ остался на мне. Платёж каждый месяц, проценты капают. Сначала деньги. Про деда — потом."
      }
    ]
  },
  museum: {
    title: "Глава 1 · Музей",
    pages: [
      {
        p: "museum",
        cap: "Краевед Савельич принял находку в дар. А потом увидел у меня треугольник — и долго вертел его на свету."
      },
      {
        p: "savelich",
        say: 1,
        cap: "«Полевая почта 49127… Это стрелковый полк. Осенью сорок второго они держали оборону в лесах — в Области, за рекой. Хочешь найти деда — ищи там. И приходи ещё, Серый»."
      }
    ]
  }
};
// ---- кадры глав 2–5 ----
function sepia(g, warm) {
  const d = g.getImageData(0, 0, 120, 150),
    p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const l = (p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11) / 255;
    p[i] = Math.min(255, 40 + l * 200 + (warm || 0));
    p[i + 1] = Math.min(255, 30 + l * 170);
    p[i + 2] = Math.min(255, 18 + l * 120);
  }
  g.putImageData(d, 0, 0);
  for (let y = 0; y < 150; y++)
    for (let x = 0; x < 120; x++) {
      const v = Math.hypot((x - 60) / 60, (y - 75) / 75);
      if (v > 0.85 && (x + y) % 2 === 0) {
        g.fillStyle = "rgba(40,26,14," + Math.min(0.7, (v - 0.85) * 2) + ")";
        g.fillRect(x, y, 1, 1);
      }
    }
}
function fog(g, y0, y1, col, step) {
  const rr = rng(y0 * 7 + y1);
  for (let y = y0; y < y1; y++) {
    const band = 0.5 + 0.5 * Math.sin(y * 0.15);
    for (let x = 0; x < 120; x++)
      if (rr() < band / (step || 3)) {
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
  }
}
function spruceP(g, x, y, h, c1, c2) {
  const tiers = 4;
  for (let t = 0; t < tiers; t++) {
    const top = y - h + ((t * h) / tiers) * 0.8,
      hh = (h / tiers) * 1.3,
      w = ((t + 1) * h) / 9;
    fillPoly(
      g,
      [
        [x, top],
        [x + w, top + hh],
        [x - w, top + hh]
      ],
      c1
    );
    fillPoly(
      g,
      [
        [x, top],
        [x + w, top + hh],
        [x + w * 0.3, top + hh]
      ],
      c2
    );
  }
  rect(g, x - 1, y, 2, 4, "#3a2a1a");
}
function birchP(g, x, y, h) {
  rect(g, x, y - h, 3, h, "#e8e4dc");
  rect(g, x + 2, y - h, 1, h, "#b8b4ac");
  for (let j = y - h + 3; j < y; j += 5) rect(g, x, j, 2, 1, "#2a2620");
  pline(g, x + 1, y - h + 8, x - 6, y - h + 2, "#8a8478");
  pline(g, x + 2, y - h + 14, x + 8, y - h + 7, "#8a8478");
}
// фигура в полный рост: s — масштаб, hat: pilotka|cap|scarf|bald|helmet, coat — цвет одежды
function figure(g, x, y, s, o) {
  const c = o.coat || "#5a6a3a",
    sk = o.skin || "#e0a87a",
    dk = o.dark || "#2a2a20";
  rect(g, x - 3 * s, y - 8 * s, 2 * s, 8 * s, dk);
  rect(g, x + 1 * s, y - 8 * s, 2 * s, 8 * s, dk); // ноги
  rect(g, x - 4 * s, y - 20 * s, 8 * s, 13 * s, c);
  rect(g, x - 4 * s, y - 20 * s, 8 * s, 1 * s, o.coat2 || "#7a8a4a"); // тело
  rect(g, x - 6 * s, y - 19 * s, 2 * s, 9 * s, c);
  rect(g, x + 4 * s, y - 19 * s, 2 * s, 9 * s, c); // руки
  rect(g, x - 6 * s, y - 10 * s, 2 * s, 2 * s, sk);
  rect(g, x + 4 * s, y - 10 * s, 2 * s, 2 * s, sk);
  disc(g, x, y - 24 * s, 3 * s, 4 * s, sk);
  rect(g, x - 1 * s, y - 21 * s, 2 * s, 1 * s, sk);
  if (o.hat === "pilotka") {
    rect(g, x - 3 * s, y - 28 * s, 7 * s, 2 * s, "#4a5a2a");
    rect(g, x - 2 * s, y - 29 * s, 5 * s, 1 * s, "#4a5a2a");
    rect(g, x + 1 * s, y - 28 * s, 1 * s, 1 * s, "#c0302a");
  } else if (o.hat === "cap") {
    rect(g, x - 3 * s, y - 29 * s, 6 * s, 3 * s, "#76853f");
    rect(g, x - 5 * s, y - 27 * s, 3 * s, 1 * s, "#525e2a");
  } else if (o.hat === "scarf") {
    disc(g, x, y - 25 * s, 4 * s, 5 * s, o.scarf || "#3a5a9a");
    disc(g, x, y - 23 * s, 2 * s, 3 * s, sk);
    rect(g, x - 4 * s, y - 21 * s, 8 * s, 2 * s, o.scarf || "#3a5a9a");
  } else if (o.hat === "helmet") {
    disc(g, x, y - 27 * s, 4 * s, 2 * s, "#4a5a34");
  } else if (o.hat === "grey") {
    rect(g, x - 3 * s, y - 27 * s, 1 * s, 3 * s, "#b8b4ac");
    rect(g, x + 2 * s, y - 27 * s, 1 * s, 3 * s, "#b8b4ac");
  }
  if (o.beard) disc(g, x, y - 21 * s, 3 * s, 2 * s, "#c8c4bc");
  if (o.camo)
    for (let k = 0; k < 8; k++)
      rect(g, x - 4 * s + ((k * 37) % 7) * s, y - 19 * s + ((k * 53) % 11) * s, 2 * s, 1 * s, "#3a4428");
}
function hands(g, col) {
  fillPoly(
    g,
    [
      [0, 124],
      [24, 108],
      [32, 116],
      [12, 134],
      [0, 136]
    ],
    col || "#eab58c"
  );
  fillPoly(
    g,
    [
      [120, 124],
      [96, 108],
      [88, 116],
      [108, 134],
      [120, 136]
    ],
    col || "#eab58c"
  );
  rect(g, 0, 134, 16, 16, "#5d7d38");
  rect(g, 104, 134, 16, 16, "#5d7d38");
}
function capsule(g, x, y) {
  rect(g, x, y, 10, 26, "#120e0a");
  rect(g, x + 1, y + 1, 8, 24, "#24221e");
  rect(g, x + 2, y + 1, 2, 24, "#4a4844");
  for (let j = y + 4; j < y + 24; j += 4) rect(g, x + 1, j, 8, 1, "#2e2c2a");
}
function panelForestDig(g, r) {
  rect(g, 0, 0, 120, 150, "#4e7040");
  rect(g, 0, 0, 120, 30, "#9ab4bc");
  for (let i = 0; i < 14; i++)
    spruceP(g, 4 + i * 9 + r() * 4, 38 + r() * 10, 30 + r() * 12, "#1f4626", "#2b5e32");
  rect(g, 0, 46, 120, 104, "#4e7040");
  for (let k = 0; k < 200; k++) rect(g, r() * 120, 46 + r() * 104, 2, 1, r() < 0.5 ? "#5e8a44" : "#3e5a30");
  for (let y = 60; y < 150; y++) {
    const x = 20 + Math.sin(y * 0.08) * 14;
    rect(g, x, y, 10, 1, "#3f3121");
    rect(g, x + 10, y, 3, 1, "#8a6e46");
  }
  disc(g, 78, 118, 16, 8, "#5e4a30");
  disc(g, 78, 117, 13, 6, "#3a2c1c");
  disc(g, 80, 118, 4, 2, "#c4c8cc");
  rect(g, 79, 117, 2, 1, "#ffffff");
  pline(g, 96, 104, 112, 92, "#6a6a70");
  disc(g, 96, 106, 5, 2, "#2a2a30");
  const t = document.createElement("canvas");
  t.width = 16;
  t.height = 16;
  spr(t.getContext("2d"), KOSTYA_KNEEL, PAL_K, 0, 0);
  g.imageSmoothingEnabled = false;
  g.drawImage(t, 48, 96, 32, 32);
}
function panelDugout42(g, r) {
  rect(g, 0, 0, 120, 150, "#9aa0a0");
  rect(g, 0, 80, 120, 70, "#7a7a6a");
  for (let i = 0; i < 5; i++) birchP(g, 8 + i * 26 + r() * 6, 84, 50 + r() * 20);
  disc(g, 84, 92, 30, 14, "#5a5a48");
  disc(g, 84, 90, 26, 10, "#6a6a58");
  for (let j = 0; j < 4; j++) rect(g, 62, 82 + j * 3, 44, 2, j % 2 ? "#4a3a2a" : "#5a4a3a");
  rect(g, 78, 90, 12, 10, "#1a1410");
  for (let k = 0; k < 40; k++) rect(g, r() * 120, 96 + r() * 54, 3, 1, "#e8e8e0");
  figure(g, 30, 128, 2, { hat: "pilotka", coat: "#6a6a4a", coat2: "#8a8a6a" });
  figure(g, 52, 130, 2, { hat: "pilotka", coat: "#5a5a40", coat2: "#7a7a5a" });
  rect(g, 35, 76, 4, 1, "#f0e8d8");
  for (let k = 0; k < 10; k++) rect(g, 38 + k + r() * 3, 74 - k * 2, 1, 1, "#d8d8d8");
  sepia(g);
}
function panelBorzy(g, r) {
  rect(g, 0, 0, 120, 150, "#3a4a3a");
  for (let i = 0; i < 8; i++) spruceP(g, i * 16 + r() * 6, 70, 50 + r() * 20, "#1a3a20", "#244a2a");
  rect(g, 70, 70, 48, 30, "#5a6a5a");
  rect(g, 72, 62, 36, 10, "#4a5a4a");
  rect(g, 76, 64, 12, 7, "#8ab0c0");
  rect(g, 92, 64, 12, 7, "#8ab0c0");
  fillPoly(
    g,
    [
      [14, 150],
      [106, 150],
      [100, 104],
      [20, 104]
    ],
    "#4a5a2a"
  );
  for (let k = 0; k < 26; k++)
    rect(g, 20 + r() * 80, 106 + r() * 44, 4, 2, r() < 0.5 ? "#2a3418" : "#6a7a3a");
  disc(g, 58, 74, 22, 26, "#d8a07a");
  disc(g, 58, 54, 20, 8, "#3a3028");
  rect(g, 40, 62, 36, 3, "#2a2018");
  rect(g, 44, 68, 10, 3, "#2a2018");
  rect(g, 64, 68, 10, 3, "#2a2018");
  rect(g, 47, 72, 4, 3, "#1a1410");
  rect(g, 67, 72, 4, 3, "#1a1410");
  for (let k = 0; k < 40; k++) rect(g, 42 + r() * 32, 84 + r() * 14, 1, 1, "#9a7a5a");
  rect(g, 50, 90, 16, 2, "#7a3a2a");
  rect(g, 60, 90, 1, 1, "#f0e0c0");
  rect(g, 66, 90, 12, 2, "#f0e8d8");
  rect(g, 77, 90, 2, 2, "#e06030");
  for (let k = 0; k < 8; k++) rect(g, 80 + k, 86 - k * 2, 1, 1, "#c8c8c8");
  for (let i = 0; i < 4; i++) {
    const x = 80 + i * 3,
      y = 108 - i * 4;
    rect(g, x, y, 24, 13, "#3a1a10");
    rect(g, x + 1, y + 1, 22, 11, i % 2 ? "#e07a48" : "#d8683a");
    rect(g, x + 3, y + 3, 6, 6, "#f0a070");
    rect(g, x + 12, y + 4, 9, 1, "#a84a28");
    rect(g, x + 12, y + 7, 7, 1, "#a84a28");
  }
  disc(g, 92, 126, 7, 6, "#d8a07a");
  rect(g, 86, 122, 12, 3, "#c89070");
}
function panelHQ(g, r) {
  rect(g, 0, 0, 120, 150, "#4a3a2a");
  for (let y = 0; y < 90; y += 10) rect(g, 0, y, 120, 1, "#3a2a1a");
  rect(g, 0, 96, 120, 54, "#3a2a1a");
  rect(g, 84, 20, 26, 76, "#1a1410");
  figure(g, 97, 96, 2, { hat: "pilotka", coat: "#3a3a2a" });
  rect(g, 8, 86, 72, 8, "#6a4a2a");
  rect(g, 10, 94, 4, 40, "#4a3220");
  rect(g, 72, 94, 4, 40, "#4a3220");
  rect(g, 14, 78, 40, 10, "#c8b890");
  pline(g, 16, 82, 50, 80, "#6a5a4a");
  pline(g, 20, 85, 46, 84, "#6a5a4a");
  disc(g, 64, 80, 14, 14, "rgba(255,220,140,.25)");
  rect(g, 63, 76, 3, 8, "#f0e8d0");
  rect(g, 64, 72, 1, 4, "#ffd070");
  disc(g, 64, 72, 2, 3, "#ffe090");
  figure(g, 30, 120, 2, { hat: "none", coat: "#5a5a3a" });
  rect(g, 36, 82, 10, 4, "#5a5a3a");
  rect(g, 44, 80, 2, 2, "#e0a87a");
  rect(g, 45, 79, 6, 1, "#2a2a6a");
  rect(g, 26, 72, 8, 3, "#3a3020");
  sepia(g, 20);
}
function panelSumka(g, r) {
  rect(g, 0, 0, 120, 150, "#3a2a1c");
  for (let k = 0; k < 160; k++)
    rect(g, r() * 120, r() * 150, 3, 2, pick(["#4a3624", "#2e2216", "#5a4630", "#9c4a32"], r));
  fillPoly(
    g,
    [
      [40, 0],
      [80, 0],
      [100, 150],
      [20, 150]
    ],
    "#c8b890",
    4
  );
  rect(g, 22, 52, 76, 48, "#120e0a");
  rect(g, 24, 54, 72, 44, "#5a3820");
  fillPoly(
    g,
    [
      [24, 54],
      [96, 54],
      [100, 24],
      [20, 24]
    ],
    "#6a4428"
  );
  rect(g, 20, 22, 80, 3, "#4a2c18");
  rect(g, 30, 58, 58, 36, "#d8cca8");
  for (let i = 0; i < 6; i++)
    for (let x = 34; x < 84; x += 2) if (r() < 0.7) rect(g, x, 62 + i * 5, 1, 1, "#5a5a7a");
  fillPoly(
    g,
    [
      [70, 58],
      [88, 58],
      [88, 80]
    ],
    "#b8a888"
  );
  rect(g, 56, 26, 8, 8, "#c8a040");
  hands(g, "#d8a882");
}
function panelTrain(g, r) {
  rect(g, 0, 0, 120, 150, "#c88a6a");
  rect(g, 0, 0, 120, 40, "#e0a87a");
  rect(g, 0, 40, 120, 20, "#d89878");
  disc(g, 30, 46, 10, 10, "#f4d08a");
  rect(g, 0, 64, 120, 6, "#5a5a5a");
  rect(g, 0, 72, 120, 2, "#8a8a8a");
  rect(g, 0, 78, 120, 2, "#8a8a8a");
  for (let x = 0; x < 120; x += 8) rect(g, x, 70, 3, 12, "#4a3a2a");
  rect(g, 0, 84, 120, 66, "#8a8478");
  rect(g, 0, 84, 120, 3, "#c8c0a8");
  rect(g, 96, 20, 3, 64, "#3a3a3a");
  rect(g, 86, 20, 24, 10, "#2a4a8a");
  rect(g, 88, 23, 20, 1, "#e8e8e8");
  rect(g, 88, 26, 14, 1, "#e8e8e8");
  rect(g, 14, 112, 92, 4, "#6a4a2a");
  rect(g, 18, 116, 3, 14, "#4a3220");
  rect(g, 98, 116, 3, 14, "#4a3220");
  figure(g, 36, 128, 2, { hat: "scarf", scarf: "#3a5a9a", coat: "#6a4a5a", skin: "#e0b090" });
  rect(g, 22, 106, 18, 8, "#8a6a40");
  for (let i = 0; i < 6; i++) rect(g, 24 + i * 3, 100 - (i % 2) * 2, 1, 6, "#5aa040");
  figure(g, 80, 128, 2, { hat: "cap", coat: "#5d7d38", coat2: "#44602a" });
  rect(g, 86, 90, 8, 12, "#8e5e33");
  pline(g, 100, 70, 104, 128, "#7a7a7a");
}
function panelNyura(g, r) {
  rect(g, 0, 0, 120, 150, "#6a5a4a");
  for (let y = 0; y < 150; y += 9) rect(g, 0, y, 120, 1, "#5a4a3a");
  disc(g, 60, 72, 40, 46, "#3a5a9a");
  for (let k = 0; k < 40; k++) disc(g, 22 + r() * 76, 30 + r() * 84, 1, 1, "#e8e8f0");
  disc(g, 60, 80, 26, 30, "#e0b090");
  disc(g, 52, 70, 10, 8, "#ecc4a4");
  for (let k = 0; k < 14; k++) {
    const y = 62 + k * 4;
    pline(g, 40, y, 46, y + 1, "#c08a68");
    pline(g, 74, y + 1, 80, y, "#c08a68");
  }
  rect(g, 42, 66, 12, 2, "#9a9088");
  rect(g, 66, 66, 12, 2, "#9a9088");
  rect(g, 45, 72, 7, 4, "#ffffff");
  rect(g, 68, 72, 7, 4, "#ffffff");
  rect(g, 47, 72, 4, 4, "#5a7a9a");
  rect(g, 70, 72, 4, 4, "#5a7a9a");
  rect(g, 48, 73, 1, 1, "#ffffff");
  rect(g, 71, 73, 1, 1, "#ffffff");
  rect(g, 75, 77, 2, 4, "#a8d0e8");
  rect(g, 58, 76, 4, 12, "#d0a080");
  rect(g, 52, 96, 16, 2, "#a86a5a");
  pline(g, 46, 92, 52, 96, "#c08a68");
  pline(g, 74, 92, 68, 96, "#c08a68");
  fillPoly(
    g,
    [
      [34, 110],
      [86, 110],
      [100, 150],
      [20, 150]
    ],
    "#3a5a9a"
  );
  rect(g, 50, 104, 20, 8, "#e0b090");
  fillPoly(
    g,
    [
      [56, 108],
      [64, 108],
      [66, 124],
      [54, 124]
    ],
    "#2a4a8a"
  );
}
function panelGat42(g, r) {
  rect(g, 0, 0, 120, 150, "#a8a8a0");
  rect(g, 0, 70, 120, 80, "#6a6a58");
  for (let k = 0; k < 5; k++) {
    const x = r() * 120;
    rect(g, x, 40, 2, 32, "#4a4a40");
    pline(g, x + 1, 48, x - 6, 40, "#4a4a40");
  }
  fillPoly(
    g,
    [
      [56, 70],
      [64, 70],
      [100, 150],
      [20, 150]
    ],
    "#8a7a5a"
  );
  for (let y = 72; y < 150; y += 3) {
    const w = 4 + (y - 70) * 0.5;
    rect(g, 60 - w, y, w * 2, 1, "#6a5a3a");
  }
  for (let k = 0; k < 60; k++) {
    const x = r() * 120,
      y = 72 + r() * 78;
    if (Math.abs(x - 60) < 6 + (y - 70) * 0.5) continue;
    rect(g, x, y - 5, 1, 5, "#4a5a3a");
  }
  figure(g, 60, 104, 1, { hat: "scarf", scarf: "#6a6a6a", coat: "#4a4a40" });
  disc(g, 65, 92, 3, 3, "#8a8a7a");
  fog(g, 40, 150, "rgba(240,240,232,.45)", 4);
  sepia(g);
  disc(g, 62, 66, 2, 2, "#ff9a40");
  disc(g, 62, 66, 4, 3, "rgba(255,160,60,.3)");
}
function panelMedal(g, r) {
  rect(g, 0, 0, 120, 150, "#2a2016");
  for (let k = 0; k < 200; k++)
    rect(g, r() * 120, r() * 150, 3, 1, pick(["#3a2c1e", "#1e160e", "#4a3a26"], r));
  for (let k = 0; k < 6; k++) pline(g, r() * 120, r() * 60, r() * 120, 60 + r() * 90, "#5a4a30");
  for (let k = 0; k < 10; k++) rect(g, r() * 120, r() * 150, 2, 1, "#6a8a8a");
  disc(g, 60, 96, 40, 26, "#d8a882");
  disc(g, 60, 92, 34, 20, "#e8b890");
  pline(g, 30, 96, 40, 106, "#c08a68");
  pline(g, 90, 96, 80, 106, "#c08a68");
  for (let k = 0; k < 20; k++) rect(g, 26 + r() * 68, 82 + r() * 30, 2, 1, "#5a4430");
  capsule(g, 40, 74);
  rect(g, 40, 72, 10, 4, "#3a3836");
  fillPoly(
    g,
    [
      [54, 76],
      [94, 70],
      [96, 92],
      [56, 98]
    ],
    "#e8dcc0"
  );
  for (let i = 0; i < 4; i++) pline(g, 58, 80 + i * 4, 90, 75 + i * 4, "#3a3a6a");
  rect(g, 0, 128, 22, 22, "#5d7d38");
  rect(g, 98, 128, 22, 22, "#5d7d38");
}
function panelBurial(g, r) {
  rect(g, 0, 0, 120, 150, "#9ac0d8");
  rect(g, 0, 96, 120, 54, "#6a9a4a");
  for (let i = 0; i < 4; i++) birchP(g, 6 + i * 34, 98, 60 + r() * 20);
  rect(g, 52, 40, 16, 58, "#e8e4dc");
  rect(g, 66, 40, 2, 58, "#b8b4ac");
  fillPoly(
    g,
    [
      [52, 40],
      [68, 40],
      [60, 28]
    ],
    "#e8e4dc"
  );
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
    [0, 1]
  ].forEach(([a, b]) => rect(g, 60 + a, 56 + b, 1, 1, "#c0302a"));
  rect(g, 50, 98, 20, 4, "#6a4a2a");
  disc(g, 60, 106, 22, 6, "#5a3a24");
  for (let k = 0; k < 14; k++) {
    const x = 44 + r() * 32,
      y = 104 + r() * 6;
    rect(g, x, y, 2, 2, "#ffffff");
    rect(g, x, y, 1, 1, "#f0c93c");
  }
  figure(g, 30, 134, 2, { hat: "scarf", scarf: "#2a2a3a", coat: "#3a3a4a", skin: "#e0b090" });
  rect(g, 38, 108, 6, 6, "#ffffff");
  rect(g, 40, 110, 2, 2, "#f0c93c");
  figure(g, 90, 134, 2, { hat: "grey", beard: 1, coat: "#6a4a30" });
  figure(g, 108, 128, 1, { hat: "none", coat: "#4a5a2a", camo: 1 });
  figure(g, 14, 128, 1, { hat: "none", coat: "#4a5a2a", camo: 1 });
}
function panelKitchen(g, r) {
  rect(g, 0, 0, 120, 150, "#2a2420");
  rect(g, 8, 10, 30, 36, "#1a2236");
  rect(g, 22, 10, 2, 36, "#4a3a2a");
  rect(g, 8, 27, 30, 2, "#4a3a2a");
  fillPoly(
    g,
    [
      [80, 20],
      [88, 20],
      [110, 70],
      [58, 70]
    ],
    "#f6dc8a",
    3
  );
  rect(g, 80, 10, 8, 10, "#c8a040");
  rect(g, 83, 0, 2, 10, "#3a3a3a");
  rect(g, 0, 70, 120, 80, "#c8d8c8");
  for (let y = 70; y < 150; y += 8)
    for (let x = ((y / 8) % 2) * 8; x < 120; x += 16) rect(g, x, y, 8, 8, "#a8c0b0");
  rect(g, 86, 60, 14, 18, "#e0e8ec");
  rect(g, 84, 70, 18, 10, "#a87a3a");
  rect(g, 102, 72, 4, 6, "#a87a3a");
  rect(g, 10, 72, 20, 26, "#efe6d0");
  rect(g, 12, 74, 16, 18, "#a8916a");
  disc(g, 17, 80, 2, 2, "#5a4632");
  disc(g, 23, 80, 2, 2, "#5a4632");
  fillPoly(
    g,
    [
      [30, 150],
      [44, 108],
      [78, 108],
      [92, 150]
    ],
    "#d8a882"
  );
  for (let k = 0; k < 20; k++)
    pline(g, 36 + r() * 48, 112 + r() * 30, 40 + r() * 48, 113 + r() * 30, "#b8886a");
  capsule(g, 54, 100);
  rect(g, 0, 140, 120, 10, "#4a3a6a");
}
function panelBorzy2(g, r) {
  rect(g, 0, 0, 120, 150, "#8a9898");
  rect(g, 0, 70, 120, 80, "#4a5a50");
  fillPoly(
    g,
    [
      [54, 60],
      [66, 60],
      [100, 150],
      [20, 150]
    ],
    "#6a5a40"
  );
  for (let y = 62; y < 150; y += 3) {
    const w = 6 + (y - 60) * 0.45;
    rect(g, 60 - w, y, w * 2, 1, "#4a3a28");
  }
  figure(g, 62, 100, 2, { hat: "bald", coat: "#4a5a2a", camo: 1, skin: "#d8a07a" });
  rect(g, 72, 76, 10, 3, "#d8a07a");
  rect(g, 58, 60, 6, 1, "#7a3a2a");
  fog(g, 20, 120, "rgba(220,228,224,.45)", 4);
  fillPoly(
    g,
    [
      [10, 150],
      [50, 150],
      [46, 118],
      [14, 118]
    ],
    "#1a1a16"
  );
  disc(g, 30, 112, 10, 10, "#1a1a16");
  rect(g, 20, 102, 20, 5, "#2a2a20");
}
Object.assign(PANELS, {
  forestdig: panelForestDig,
  dugout42: panelDugout42,
  borzy: panelBorzy,
  hq: panelHQ,
  sumka: panelSumka,
  train: panelTrain,
  nyura: panelNyura,
  gat42: panelGat42,
  medal: panelMedal,
  burial: panelBurial,
  kitchen: panelKitchen,
  borzy2: panelBorzy2
});
Object.assign(COMICS, {
  ch2: {
    title: "Глава 2 · Лес",
    pages: [
      {
        p: "forestdig",
        cap: "Леса в Области. Окопы заросли, но их ещё видно. Под бруствером детектор запищал чисто — алюминий. Жетон, номер 4-17."
      },
      {
        p: "dugout42",
        say: 1,
        cap: "Ноябрь сорок второго. Двое у блиндажа: старший сержант Серов и рядовой Лыков. Эту фотографию мне отдала внучка Фёдора."
      },
      {
        p: "borzy",
        say: 1,
        cap: "«Слышь, Серый. За жетон дам сто тысяч. Тебе он зачем — деда этим не вернёшь». Борзого на форуме знают все."
      }
    ]
  },
  ch3: {
    title: "Глава 3 · Усадьба",
    pages: [
      {
        p: "hq",
        say: 1,
        cap: "Осень сорок второго, штаб полка в барском доме. «Группу ст. сержанта Серова — к упавшему самолёту, остров за Гнилым бродом. Вывести экипаж»."
      },
      {
        p: "sumka",
        cap: "В подвале усадьбы — истлевший планшет. Донесение читается наполовину. Ответа на него в архиве нет."
      }
    ]
  },
  ch4: {
    title: "Глава 5 · Нюра",
    pages: [
      {
        p: "train",
        cap: "Электричку отменили. Старушка с рассадой на лавке посмотрела на меня так, будто узнала."
      },
      {
        p: "nyura",
        say: 1,
        cap: "«Андрюша?.. Нет, внучок. Глаза у тебя его. Я Нюра, сестра его. Всю жизнь его ждала»."
      },
      {
        p: "gat42",
        say: 1,
        cap: "«Самолёт в болото упал. Солдатики пошли по гати — и не вышли. Я им хлеб носила. У сухой берёзы на острове они были, я костёр видела»."
      }
    ]
  },
  ch5: {
    title: "Глава 6 · Остров",
    pages: [
      {
        p: "medal",
        cap: "Остров. Сухая берёза. Почти метр торфа. Эбонитовый пенал, а в нём записка: «Серов Андрей Михайлович, 1912…»."
      }
    ]
  },
  end_good: {
    title: "Финал · Вернулся",
    pages: [
      {
        p: "burial",
        cap: "Савельич и отряд «Рубеж» подняли всех семерых. Деда похоронили в селе, у братской могилы. Нюра принесла ромашки. — Вернулся, — сказала она."
      }
    ]
  },
  end_grey: {
    title: "Финал · Серый",
    pages: [
      {
        p: "kitchen",
        cap: "Я никому не сказал. Принёс медальон Нюре. Она долго держала его в ладонях. Дед так и остался на острове. Но теперь мы хотя бы знаем где."
      }
    ]
  },
  end_bad: {
    title: "Финал · Чёрный",
    pages: [
      {
        p: "borzy2",
        say: 1,
        cap: "«Ну что, Серый, нашёл? Давай сюда, коллекционер ждёт». Деньги я получил. Деда — нет."
      }
    ]
  }
});
let _PRs = 12345;
const _PR = () => {
  _PRs = (_PRs * 16807) % 2147483647;
  return (_PRs - 1) / 2147483646;
};
