// ================= СПРАЙТЫ ПЕРСОНАЖЕЙ v3 — стиль «Савельича»: контур, свет слева, тень дизерингом справа =================
const SO = "#1e1712";
function hx(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function toHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map(v =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}
function tone(h, f) {
  const [r, g, b] = hx(h);
  return f > 0
    ? toHex(r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f)
    : toHex(r * (1 + f), g * (1 + f), b * (1 + f));
}
function kit(W, H) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  const R = (x, y, w, h, col) => {
    if (w <= 0 || h <= 0) return;
    g.fillStyle = col;
    g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const E = (cx, cy, rx, ry, col) => {
    g.fillStyle = col;
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry + 0.01))));
      g.fillRect(cx - w, cy + y, w * 2 + 1, 1);
    }
  };
  const P = (pts, col) => {
    g.fillStyle = col;
    let y0 = 1e9,
      y1 = -1e9;
    pts.forEach(p => {
      y0 = Math.min(y0, p[1]);
      y1 = Math.max(y1, p[1]);
    });
    for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
      const yc = y + 0.5,
        xs = [];
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i],
          b = pts[(i + 1) % pts.length];
        if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc))
          xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xa = Math.round(xs[k]),
          xb = Math.round(xs[k + 1]);
        if (xb > xa) g.fillRect(xa, y, xb - xa, 1);
      }
    }
  };
  const L = (x0, y0, x1, y1, col, w) => {
    w = w || 1;
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
    g.fillStyle = col;
    for (let i = 0; i <= n; i++)
      g.fillRect(
        Math.round(x0 + ((x1 - x0) * i) / n - (w - 1) / 2),
        Math.round(y0 + ((y1 - y0) * i) / n - (w - 1) / 2),
        w,
        w
      );
  };
  const px = (x, y, col) => {
    g.fillStyle = col;
    g.fillRect(x, y, 1, 1);
  };
  return { c, g, R, E, P, L, px, W, H };
}
// свет слева: в каждом горизонтальном отрезке одного цвета — блик слева, тень справа с дизерингом
function lightPass(k, skip) {
  const { g, W, H } = k,
    d = g.getImageData(0, 0, W, H),
    p = d.data,
    o = new Uint8ClampedArray(p),
    key = i => (p[i] << 16) | (p[i + 1] << 8) | p[i + 2];
  const S = new Set((skip || []).concat([SO]).map(h => parseInt(h.slice(1), 16))),
    cache = {};
  const sh = (c, f) => {
    const q = c + "_" + f;
    return cache[q] || (cache[q] = hx(tone(toHex((c >> 16) & 255, (c >> 8) & 255, c & 255), f)));
  };
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      const i = (y * W + x) * 4;
      if (p[i + 3] < 200) {
        x++;
        continue;
      }
      const c = key(i);
      let e = x;
      while (e + 1 < W && p[(y * W + e + 1) * 4 + 3] >= 200 && key((y * W + e + 1) * 4) === c) e++;
      const n = e - x + 1;
      if (!S.has(c))
        for (let j = 0; j < n; j++) {
          const t = (j + 0.5) / n,
            xx = x + j,
            ii = (y * W + xx) * 4;
          let f = 0;
          if (j === 0 && n >= 3) f = 0.16;
          else if (j === n - 1 && n >= 4) f = -0.36;
          else if (t > 0.66) f = -0.2;
          else if (t > 0.52 && (xx + y) % 2 === 0) f = -0.2;
          if (f) {
            const v = sh(c, f);
            o[ii] = v[0];
            o[ii + 1] = v[1];
            o[ii + 2] = v[2];
          }
        }
      x = e + 1;
    }
  }
  d.data.set(o);
  g.putImageData(d, 0, 0);
}
function outline(k, col) {
  const { g, W, H } = k,
    d = g.getImageData(0, 0, W, H),
    p = d.data,
    o = new Uint8ClampedArray(p),
    [r, gg, b] = hx(col || SO);
  const op = (x, y) => x >= 0 && y >= 0 && x < W && y < H && p[(y * W + x) * 4 + 3] >= 128;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (p[i + 3] >= 128) continue;
      if (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1)) {
        o[i] = r;
        o[i + 1] = gg;
        o[i + 2] = b;
        o[i + 3] = 255;
      }
    }
  d.data.set(o);
  g.putImageData(d, 0, 0);
}
function crisp(k) {
  const { g, W, H } = k,
    d = g.getImageData(0, 0, W, H),
    p = d.data;
  for (let i = 3; i < p.length; i += 4) p[i] = p[i] >= 128 ? 255 : 0;
  g.putImageData(d, 0, 0);
}
// ---- фигура в полный рост: холст 48×76, земля на y=71 ----
const SPR = {};
function fig(o) {
  const id = o.id;
  if (id && SPR[id]) return SPR[id];
  const k = kit(48, 76),
    { g, R, E, P, L, px } = k;
  g.translate(4, 0);
  let seed = o.seed || 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const C = o.coat || "#5d7d38",
    Lg = o.legs || "#3c5070",
    B = o.boots || "#3a2a1c",
    sk = o.skin || "#e2a97e",
    ssh = tone(sk, -0.2),
    hair = o.hairC || "#3a2a1e",
    back = !!o.back;
  const hy = o.scarf ? 11 : 11;
  // рюкзак (сбоку из-за плеча)
  if (o.pack && !back) R(29, 23, 6, 15, o.packC || "#8e5e33");
  // ноги
  if (o.long) {
    R(15, 57, 4, 10, o.stock || "#4a3e3a");
    R(21, 57, 4, 10, o.stock || "#4a3e3a");
    R(13, 66, 7, 5, B);
    R(21, 66, 7, 5, B);
  } else if (o.galife) {
    P(
      [
        [13, 43],
        [20, 43],
        [20, 53],
        [14, 54]
      ],
      Lg
    );
    P(
      [
        [21, 43],
        [28, 43],
        [27, 54],
        [21, 53]
      ],
      Lg
    );
    R(14, 53, 6, 14, B);
    R(21, 53, 6, 14, B);
    R(13, 66, 7, 5, B);
    R(21, 66, 7, 5, B);
  } else {
    R(14, 43, 6, 24, Lg);
    R(21, 43, 6, 24, Lg);
    R(13, 66, 7, 5, B);
    R(21, 66, 7, 5, B);
  }
  // туловище
  if (o.long)
    P(
      [
        [12, 22],
        [15, 20],
        [25, 20],
        [28, 22],
        [31, 58],
        [9, 58]
      ],
      C
    );
  else
    P(
      [
        [12, 22],
        [15, 20],
        [25, 20],
        [28, 22],
        [28, 44],
        [12, 44]
      ],
      C
    );
  if (back && o.pack) R(14, 23, 13, 16, o.packC || "#8e5e33");
  // шея
  R(18, 17, 5, 4, ssh);
  // руки
  const arm = pts => {
    for (let i = 0; i < pts.length - 1; i++) L(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], SO, 5);
    for (let i = 0; i < pts.length - 1; i++)
      L(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], o.sleeve || C, 3);
    const [a, b] = pts[pts.length - 1];
    R(a - 1, b, 3, 3, sk);
  };
  if (o.box) {
    R(11, 31, 19, 10, SO);
    R(12, 32, 17, 8, o.boxC || "#8a6a40");
  }
  const aL = o.armL || "down",
    aR = o.armR || "down";
  if (aL === "up")
    arm([
      [11, 23],
      [7, 15],
      [5, 6]
    ]);
  else if (aL === "box")
    arm([
      [10, 23],
      [10, 34]
    ]);
  else
    arm([
      [10, 23],
      [10, 40]
    ]);
  if (aR === "out")
    arm([
      [30, 23],
      [34, 29],
      [41, 30]
    ]);
  else if (aR === "box")
    arm([
      [30, 23],
      [30, 34]
    ]);
  else if (aR === "flowers")
    arm([
      [30, 23],
      [31, 35]
    ]);
  else
    arm([
      [30, 23],
      [30, 40]
    ]);
  // голова
  if (o.scarf && !back) {
    E(20, hy + 1, 8, 9, o.scarf);
    E(20, hy + 2, 5, 6, sk);
  } else {
    if (!back) {
      E(13, hy + 1, 1, 2, sk);
      E(27, hy + 1, 1, 2, sk);
    }
    E(20, hy, 6, 7, back ? o.scarf || hair : sk);
  }
  if (!back && !o.scarf) {
    if (o.hair === "short" || o.hair === "gray") {
      const hc = o.hair === "gray" ? "#b8b4ac" : hair;
      for (let y = hy - 7; y < hy - 3; y++)
        for (let x = 14; x <= 26; x++) if (((x - 20) / 6) ** 2 + ((y - hy) / 7) ** 2 <= 1) px(x, y, hc);
      R(14, hy - 3, 1, 3, hc);
      R(26, hy - 3, 1, 3, hc);
    }
    if (o.hair === "bald") {
      R(14, hy - 1, 1, 5, "#c8c4bc");
      R(26, hy - 1, 1, 5, "#c8c4bc");
    }
  }
  if (o.hat === "cap") {
    P(
      [
        [13, hy - 3],
        [14, hy - 8],
        [26, hy - 8],
        [27, hy - 3]
      ],
      o.hatC || "#76853f"
    );
  }
  if (o.hat === "pilotka") {
    P(
      [
        [13, hy - 3],
        [15, hy - 8],
        [25, hy - 9],
        [27, hy - 3]
      ],
      o.hatC || "#6a6a40"
    );
  }
  if (o.scarf && !back) {
    R(18, hy + 10, 5, 3, o.scarf);
    P(
      [
        [16, hy + 11],
        [24, hy + 11],
        [23, hy + 17],
        [20, hy + 14],
        [17, hy + 17]
      ],
      o.scarf
    );
  }
  lightPass(k);
  // ---------- детали после света ----------
  const dk = tone(C, -0.32),
    lt = tone(C, 0.18);
  if (o.style === "jacket") {
    L(20, 21, 20, 43, dk);
    R(14, 33, 5, 1, dk);
    R(22, 33, 5, 1, dk);
    P(
      [
        [16, 20],
        [20, 25],
        [24, 20]
      ],
      o.shirt || "#c8c0a8"
    );
    L(16, 20, 19, 24, lt);
    L(24, 20, 21, 24, dk);
  }
  if (o.style === "tunic") {
    R(17, 19, 7, 2, tone(C, -0.15));
    px(17, 20, "#8a2e2a");
    px(23, 20, "#8a2e2a");
    R(20, 21, 1, 7, dk);
    [23, 26].forEach(y => px(20, y, "#a89a70"));
    R(14, 25, 4, 1, dk);
    R(23, 25, 4, 1, dk);
    R(13, 40, 15, 2, "#4a3020");
    R(19, 40, 3, 2, "#b8a050");
    if (o.strap) L(14, 22, 26, 40, "#5a3a24");
  }
  if (o.style === "cardigan") {
    P(
      [
        [17, 20],
        [20, 30],
        [23, 20]
      ],
      "#d8d0c0"
    );
    L(17, 20, 20, 32, dk);
    L(23, 20, 20, 32, dk);
    [33, 37, 41].forEach(y => px(20, y, "#c8a868"));
    for (let y = 24; y < 44; y += 3) for (let x = 14 + (y % 2); x < 27; x += 3) px(x, y, dk);
  }
  if (o.style === "coat") {
    if (o.box) {
      L(20, 42, 20, 57, dk);
    } else L(20, 22 + (o.scarf ? 9 : 0), 20, 57, dk);
    [28, 35, 42, 49].forEach(y => {
      px(18, y, "#1e1a18");
      px(22, y, "#1e1a18");
    });
    R(12, 22, 4, 1, lt);
  }
  if (o.camo) {
    const cs = ["#3a4428", "#7a6a3a", "#2a3020", "#5a5a34"];
    for (let n = 0; n < 70; n++) {
      const x = 12 + Math.floor(rnd() * 17),
        y = 21 + Math.floor(rnd() * 44);
      const d = g.getImageData(x + 4, y, 1, 1).data;
      const isC = toHex(d[0], d[1], d[2]),
        base = [
          C,
          tone(C, 0.16),
          tone(C, -0.2),
          tone(C, -0.36),
          Lg,
          tone(Lg, 0.16),
          tone(Lg, -0.2),
          tone(Lg, -0.36)
        ];
      if (!base.includes(isC)) continue;
      R(x, y, 2 + Math.floor(rnd() * 2), 1 + Math.floor(rnd() * 2), cs[n % 4]);
    }
  }
  if (o.pack && !back) {
    R(15, 21, 2, 13, o.strapC || "#4a3020");
    R(24, 21, 2, 13, o.strapC || "#4a3020");
  }
  if (back && o.pack) {
    R(14, 23, 13, 1, tone(o.packC || "#8e5e33", 0.2));
    R(16, 30, 9, 1, tone(o.packC || "#8e5e33", -0.3));
  }
  if (o.belt && o.style !== "tunic") {
    R(13, 41, 15, 2, "#3a2a1c");
    R(19, 41, 2, 2, "#9a9478");
  }
  if (!o.long && !o.galife) R(20, 44, 1, 22, SO);
  if (o.galife) R(20, 44, 1, 9, SO);
  // лицо
  const fy = o.scarf ? hy + 1 : hy;
  if (!back) {
    const eye = o.eye || "#2a2018",
      wh = "#f2ece0";
    R(16, fy, 2, 1, wh);
    px(17, fy, eye);
    R(22, fy, 2, 1, wh);
    px(22, fy, eye);
    R(16, fy - 2, 3, 1, o.brow || "#3a2618");
    R(22, fy - 2, 3, 1, o.brow || "#3a2618");
    px(20, fy + 2, ssh);
    px(20, fy + 3, ssh);
    px(21, fy + 3, tone(sk, -0.34));
    R(19, fy + 5, 3, 1, o.mouth || "#8a4a3a");
    if (o.smirk) px(22, fy + 4, o.mouth || "#8a4a3a");
    if (o.stubble)
      for (let y = fy + 3; y <= fy + 7; y++)
        for (let x = 15; x <= 25; x++)
          if (
            ((x - 20) / 6) ** 2 + ((y - hy) / 7) ** 2 <= 0.95 &&
            (x * 7 + y * 3) % 3 === 0 &&
            !(y === fy + 5 && x >= 19 && x <= 21)
          )
            px(x, y, tone(sk, -0.38));
    if (o.wrinkles) {
      R(18, fy - 4, 5, 1, tone(sk, -0.22));
      px(15, fy + 1, tone(sk, -0.22));
      px(25, fy + 1, tone(sk, -0.22));
      px(17, fy + 4, tone(sk, -0.22));
      px(23, fy + 4, tone(sk, -0.22));
    }
    if (o.mustache) R(18, fy + 4, 5, 1, o.mustC || "#4a3022");
    if (o.beard) {
      const bc = "#cfcbc3";
      E(20, fy + 7, 6, 4, bc);
      for (let y = fy + 4; y < fy + 12; y++)
        for (let x = 14; x < 27; x++)
          if ((x + y) % 3 === 0 && ((x - 20) / 6) ** 2 + ((y - fy - 7) / 4) ** 2 <= 1)
            px(x, y, x > 22 ? "#a29e96" : "#e2ded6");
      R(17, fy + 4, 7, 1, "#e6e2da");
      px(20, fy + 5, "#7a4a3e");
    }
    if (o.glasses) {
      const gc = "#4a3a30";
      [15, 21].forEach(x => {
        R(x, fy - 1, 4, 1, gc);
        px(x, fy, gc);
        px(x + 3, fy, gc);
        R(x + 1, fy + 1, 2, 1, gc);
      });
      R(19, fy - 1, 2, 1, gc);
      px(16, fy - 1, "#e8e4dc");
    }
    if (o.hair === "bald") {
      R(17, hy - 6, 3, 1, tone(sk, 0.4));
    }
    if (o.hat === "cap") R(12, hy - 3, 13, 2, tone(o.hatC || "#76853f", -0.35));
    if (o.hat === "pilotka") px(21, hy - 6, "#c8302a");
    if (o.scarf && o.dots)
      for (let y = hy - 8; y < hy + 18; y++)
        for (let x = 11; x < 30; x++) {
          if ((x * 5 + y * 3) % 7) continue;
          const d = g.getImageData(x + 4, y, 1, 1).data,
            cc = toHex(d[0], d[1], d[2]);
          if ([o.scarf, tone(o.scarf, 0.16), tone(o.scarf, -0.2), tone(o.scarf, -0.36)].includes(cc))
            px(x, y, "#eef0f4");
        }
    if (o.cig) {
      R(22, fy + 5, 4, 1, "#f0ece0");
      px(26, fy + 5, "#e06030");
      px(27, fy + 3, "#c8c8c8");
      px(28, fy + 1, "#b8b8b8");
    }
  } else {
    // со спины: затылок
    if (o.hat === "pilotka") px(20, hy - 7, tone(o.hatC || "#6a6a40", 0.2));
  }
  // предметы в руках
  if (o.detector) {
    L(31, 43, 37, 69, "#6a6a70");
    L(32, 43, 38, 69, "#4a4a50");
    E(37, 70, 4, 1, "#2a2a30");
  }
  if (aR === "flowers") {
    [
      [29, 30],
      [32, 28],
      [34, 31],
      [31, 26]
    ].forEach(([x, y]) => {
      L(31, 37, x, y, "#4a8a3a");
      R(x - 1, y - 1, 3, 3, "#f4f4ea");
      px(x, y, "#f0c93c");
    });
  }
  if (o.box && o.seed) {
    for (let i = 0; i < 6; i++) {
      const x = 13 + i * 3;
      L(x, 32, x + (i % 2 ? 1 : -1), 26, "#4a8a3a");
      R(x - 1 + (i % 2 ? 1 : -1), 25, 3, 2, "#6ab84a");
    }
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
  crisp(k);
  outline(k, o.line);
  return id ? (SPR[id] = k.c) : k.c;
}
function drawFig(g, spr, x, gy, s) {
  s = s || 1;
  g.imageSmoothingEnabled = false;
  g.drawImage(spr, Math.round(x - 24 * s), Math.round(gy - 72 * s), 48 * s, 76 * s);
}
// герои
const F_SERYI = {
  id: "seryi",
  style: "jacket",
  hat: "cap",
  hair: "short",
  stubble: 1,
  pack: 1,
  coat: "#5d7d38",
  legs: "#3c5070"
};
const F_SAV = {
  id: "sav",
  style: "cardigan",
  hair: "bald",
  beard: 1,
  glasses: 1,
  coat: "#6e4c30",
  legs: "#3a3028",
  skin: "#dcae88",
  brow: "#d8d4cc",
  eye: "#2a3440"
};
const F_NYURA = {
  id: "nyura",
  long: 1,
  style: "coat",
  scarf: "#3a5a9a",
  dots: 1,
  wrinkles: 1,
  coat: "#3e3a44",
  skin: "#e4b494",
  eye: "#6a8aaa",
  brow: "#a89c90",
  mouth: "#a8645a",
  boots: "#2a2220"
};
const F_BORZY = {
  id: "borzy",
  style: "jacket",
  camo: 1,
  hair: "short",
  hairC: "#2e2620",
  stubble: 1,
  smirk: 1,
  coat: "#56633a",
  legs: "#4a5530",
  skin: "#d8a07a",
  shirt: "#222222",
  boots: "#222018"
};
const F_SOLD = {
  style: "tunic",
  galife: 1,
  hat: "pilotka",
  coat: "#6a6a48",
  legs: "#5a5a40",
  boots: "#2a2420",
  hair: "short"
};
// ---- погрудные портреты 48×58 (как Савельич) ----
function borzyBust() {
  if (SPR.bBust) return SPR.bBust;
  const k = kit(48, 58),
    { g, R, E, P, L, px } = k,
    O = SO,
    sk = "#d8a07a",
    sh = "#b98660",
    sh2 = "#9c6c4a",
    hi = "#e8b690",
    stb = "#bf8f6c",
    stb2 = "#9a6a4c";
  P(
    [
      [0, 58],
      [1, 47],
      [8, 41],
      [17, 38],
      [31, 38],
      [40, 41],
      [47, 47],
      [48, 58]
    ],
    O
  );
  P(
    [
      [1, 58],
      [2, 47],
      [9, 42],
      [17, 39],
      [31, 39],
      [39, 42],
      [46, 47],
      [47, 58]
    ],
    "#56633a"
  );
  P(
    [
      [32, 39],
      [39, 42],
      [46, 47],
      [47, 58],
      [37, 58]
    ],
    "#465230"
  );
  let s = 11;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let n = 0; n < 70; n++) {
    const y = 42 + Math.floor(rnd() * 16),
      half = y < 47 ? 8 + (y - 39) * 3 : 22,
      x = 24 - half + Math.floor(rnd() * half * 2);
    if (x < 3 || x > 44) continue;
    R(
      x,
      y,
      3 + Math.floor(rnd() * 3),
      2,
      x > 34 ? ["#2a3020", "#4a4428"][n % 2] : ["#3a4428", "#7a6a3a", "#2a3020"][n % 3]
    );
  }
  P(
    [
      [19, 39],
      [24, 49],
      [29, 39]
    ],
    "#1e1e1e"
  );
  for (let i = 0; i < 8; i++) px(19 + Math.round(i * 0.6), 40 + i, i % 2 ? "#c8a040" : "#f0d070");
  for (let i = 0; i < 8; i++) px(29 - Math.round(i * 0.6), 40 + i, i % 2 ? "#c8a040" : "#f0d070");
  P(
    [
      [13, 39],
      [19, 39],
      [23, 52],
      [17, 50]
    ],
    "#3e4828"
  );
  P(
    [
      [35, 39],
      [29, 39],
      [25, 52],
      [31, 50]
    ],
    "#323a20"
  );
  L(13, 39, 22, 51, "#6a7448");
  // шея
  R(17, 31, 14, 9, O);
  R(18, 31, 12, 9, sk);
  R(26, 31, 4, 9, sh);
  R(18, 38, 12, 1, sh2);
  // уши
  E(12, 22, 3, 4, O);
  E(12, 22, 2, 3, sh);
  px(11, 22, sh2);
  E(36, 22, 3, 4, O);
  E(36, 22, 2, 3, sh2);
  px(37, 20, "#7a5040");
  // голова с тяжёлой челюстью: два эллипса
  E(24, 19, 12, 14, O);
  E(24, 26, 12, 9, O);
  E(24, 19, 11, 13, sk);
  E(24, 26, 11, 8, sk);
  const inH = (x, y) =>
    ((x - 24) / 11) ** 2 + ((y - 19) / 13) ** 2 <= 1 || ((x - 24) / 11) ** 2 + ((y - 26) / 8) ** 2 <= 1;
  for (let y = 5; y < 35; y++)
    for (let x = 12; x < 37; x++) {
      if (!inH(x, y)) continue;
      let c = null;
      if (x >= 31) c = sh;
      else if (x === 30 && (x + y) % 2 === 0) c = sh;
      if (x >= 34) c = sh2;
      if (x <= 15 && y > 14 && y < 30) c = hi;
      if (y >= 28) {
        c = x >= 31 ? stb2 : stb;
        if (x === 30 && y % 2) c = stb2;
      } else if (y === 27 && x % 2 === 0) c = x >= 31 ? stb2 : stb;
      if (y < 11) c = x >= 31 ? "#3a2e26" : "#4e3e32";
      else if (y === 11 && x % 2 === 0) c = x >= 31 ? "#3a2e26" : "#4e3e32";
      if (c) px(x, y, c);
    }
  R(17, 7, 4, 1, "#6a564a");
  R(16, 8, 2, 1, "#6a564a");
  // брови, глаза
  R(16, 16, 7, 2, "#2a1e16");
  R(26, 15, 7, 2, "#2a1e16");
  px(32, 15, sh);
  R(17, 19, 4, 1, "#efe6d8");
  R(19, 19, 2, 1, "#2a2018");
  R(27, 19, 4, 1, "#e2d6c6");
  R(27, 19, 2, 1, "#2a2018");
  R(16, 18, 6, 1, sh);
  R(26, 18, 6, 1, sh2);
  px(18, 19, "#ffffff");
  px(15, 16, hi);
  px(15, 17, hi);
  // нос (сломанный, чуть вбок)
  R(23, 20, 2, 6, sh);
  px(25, 22, sh2);
  px(25, 23, sh2);
  px(22, 24, hi);
  R(22, 26, 5, 1, sh2);
  px(22, 26, "#5a3a2a");
  px(26, 26, "#5a3a2a");
  // рот с ухмылкой
  R(19, 30, 8, 1, "#6a3830");
  px(27, 29, "#6a3830");
  px(28, 28, "#6a3830");
  R(20, 31, 6, 1, stb2);
  // сигарета
  R(26, 30, 10, 2, "#f0ece0");
  R(26, 31, 10, 1, "#c8c4b8");
  R(34, 30, 2, 2, "#e06030");
  px(36, 30, "#ffb060");
  for (let i = 0; i < 6; i++) px(37 + Math.round(Math.sin(i * 0.9) * 2), 27 - i * 3, "#b8bcbc");
  return (SPR.bBust = k.c);
}
function nyuraBust() {
  if (SPR.nBust) return SPR.nBust;
  const k = kit(48, 58),
    { g, R, E, P, L, px } = k,
    O = SO,
    sk = "#e4b494",
    SC = "#3a5a9a",
    SD = "#22345e";
  P(
    [
      [0, 58],
      [1, 48],
      [8, 43],
      [16, 41],
      [32, 41],
      [40, 43],
      [47, 48],
      [48, 58]
    ],
    O
  );
  P(
    [
      [1, 58],
      [2, 48],
      [9, 44],
      [16, 42],
      [32, 42],
      [39, 44],
      [46, 48],
      [47, 58]
    ],
    "#4a4250"
  );
  P(
    [
      [32, 42],
      [39, 44],
      [46, 48],
      [47, 58],
      [36, 58]
    ],
    "#3a3440"
  );
  R(23, 46, 1, 12, "#2a2430");
  [50, 55].forEach(y => {
    R(21, y, 2, 2, O);
    px(21, y, "#9a8a7a");
  });
  E(24, 21, 16, 18, O);
  E(24, 21, 15, 17, SC);
  for (let y = 4; y < 40; y++)
    for (let x = 9; x < 40; x++)
      if (((x - 24) / 15) ** 2 + ((y - 21) / 17) ** 2 <= 1 && x >= 33 && (x >= 36 || (x + y) % 2 === 0))
        px(x, y, SD);
  E(24, 24, 10, 12, O);
  E(24, 24, 9, 11, sk);
  for (let y = 13; y < 36; y++)
    for (let x = 15; x < 34; x++) {
      const d = ((x - 24) / 9) ** 2 + ((y - 24) / 11) ** 2;
      if (d > 1) continue;
      if (x >= 28 && d > 0.28 && (x >= 31 || (x + y) % 2 === 0)) px(x, y, "#c4906e");
      if (x >= 31 && d > 0.55) px(x, y, "#a87a5a");
    }
  R(18, 14, 12, 2, "#d0ccc4");
  R(18, 14, 12, 1, "#e8e4dc");
  px(17, 15, "#b8b4ac");
  R(18, 18, 10, 1, "#c8987a");
  R(19, 20, 8, 1, "#d4a888");
  R(17, 22, 5, 1, "#b8aca0");
  R(26, 22, 5, 1, "#a89c90");
  R(18, 24, 3, 2, "#f2ece4");
  px(19, 24, "#6a8aaa");
  px(19, 25, "#4a6a8a");
  R(27, 24, 3, 2, "#e8e0d6");
  px(28, 24, "#6a8aaa");
  px(28, 25, "#4a6a8a");
  px(18, 24, "#ffffff");
  R(17, 26, 4, 1, "#c8987a");
  R(27, 26, 4, 1, "#b8886a");
  px(16, 25, "#c8987a");
  px(31, 25, "#b8886a");
  px(16, 23, "#c8987a");
  px(31, 23, "#b8886a");
  for (let i = 0; i < 4; i++) px(30, 27 + i, "#bfe0f2");
  px(30, 31, "#e0f0f8");
  R(24, 26, 1, 5, "#c8987a");
  R(25, 27, 1, 4, "#b0806a");
  E(24, 31, 2, 1, "#d49880");
  L(20, 30, 18, 35, "#c8987a");
  L(28, 30, 30, 35, "#b0806a");
  R(21, 34, 6, 1, "#a8645a");
  px(20, 33, "#a8645a");
  px(27, 33, "#a8645a");
  R(22, 35, 4, 1, "#d4a088");
  for (let y = 4; y < 40; y++)
    for (let x = 9; x < 40; x++) {
      if ((x * 5 + y * 3) % 9) continue;
      if (((x - 24) / 15) ** 2 + ((y - 21) / 17) ** 2 > 1) continue;
      if (((x - 24) / 10) ** 2 + ((y - 24) / 12) ** 2 <= 1) continue;
      px(x, y, x > 34 ? "#c8ccd8" : "#f4f4f0");
    }
  E(24, 40, 5, 3, O);
  E(24, 40, 4, 2, SC);
  P(
    [
      [20, 41],
      [16, 52],
      [22, 49]
    ],
    SC
  );
  P(
    [
      [28, 41],
      [32, 52],
      [26, 49]
    ],
    SD
  );
  px(23, 39, "#f4f4f0");
  px(26, 41, "#f4f4f0");
  return (SPR.nBust = k.c);
}
// ---- пейзаж ----
function spruce3(g, x, y, h, pal, snow) {
  x = Math.round(x);
  y = Math.round(y);
  h = Math.round(h);
  const [ol, dk, md, lt] = pal,
    tiers = Math.max(3, Math.round(h / 10));
  for (let j = 0; j < h; j++) {
    const t = j / h,
      tp = (t * tiers) % 1,
      w = Math.max(1, Math.round((1 + t * h * 0.33) * (0.5 + 0.5 * tp))),
      yy = y - h + j;
    rect(g, x - w - 1, yy, w * 2 + 3, 1, ol);
    for (let i = -w; i <= w; i++) {
      let c = md;
      if (i < -w * 0.35 || (i < -w * 0.1 && (i + yy) % 2 === 0)) c = lt;
      if (i > w * 0.35 || (i > w * 0.1 && (i + yy) % 2 === 0)) c = dk;
      if (tp > 0.82 && (i + yy) % 2 === 0) c = dk;
      if (snow && tp < 0.25 && i < w * 0.2) c = snow;
      g.fillStyle = c;
      g.fillRect(x + i, yy, 1, 1);
    }
  }
  rect(g, x - 1, y, 3, 3, "#2a1e14");
}
function farForest(g, r, y, n, c1, c2) {
  for (let i = 0; i < n; i++) {
    const x = i * (PW / n) + r() * 6,
      h = 8 + r() * 10;
    for (let j = 0; j < h; j++) {
      const w = Math.round(j * 0.35 + 0.5);
      rect(g, x - w, y - h + j, w * 2 + 1, 1, (j + i) % 3 ? c1 : c2);
    }
  }
}
function birch3(g, x, y, h, o) {
  o = o || {};
  x = Math.round(x);
  y = Math.round(y);
  const w = o.w || 4;
  if (!o.bare && o.leaf) {
    const L = o.leaf;
    for (let k = 0; k < 7; k++) {
      const lx = Math.round(x + w / 2 + (((k * 37) % 25) - 12) * 1.1),
        ly = Math.round(y - h + 4 + ((k * 17) % 24)),
        rx = 6 + (k % 3) * 2,
        ry = 4 + (k % 2) * 2;
      for (let dy = -ry - 1; dy <= ry + 1; dy++)
        for (let dx = -rx - 1; dx <= rx + 1; dx++) {
          const d = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
          if (d > 1.15) continue;
          if (d > 0.75 && (dx + dy + k) % 2) continue;
          rect(
            g,
            lx + dx,
            ly + dy,
            1,
            1,
            dy > ry * 0.3 || dx > rx * 0.4 ? L[1] : dx < -rx * 0.3 && dy < 0 ? L[2] || L[0] : L[0]
          );
        }
    }
  }
  rect(g, x - 1, y - h, w + 2, h, "#1a1610");
  rect(g, x, y - h, w, h, "#ece8dc");
  rect(g, x + w - 1, y - h, 1, h, "#b8b4a8");
  for (let j = y - h + 2; j < y; j += 2) if ((j * 13) % 5 === 0) rect(g, x + w - 2, j, 1, 1, "#b8b4a8");
  for (let j = y - h + 3; j < y; j += 3 + ((j * 7) % 4)) {
    const ww = 1 + ((j * 11) % 3);
    rect(g, x + ((j * 5) % 2), j, ww, 1, "#2a2620");
  }
  rect(g, x, y - 8, w, 8, "#4a4238");
  for (let j = y - 8; j < y; j += 2) rect(g, x + (j % 3), j, 2, 1, "#ece8dc");
  const br = o.bare ? "#5a544a" : "#3a342c";
  pline(g, x + 1, y - h + 10, x - 7, y - h + 1, br);
  pline(g, x + w - 1, y - h + 18, x + w + 8, y - h + 8, br);
  pline(g, x + 1, y - h + 26, x - 6, y - h + 19, br);
}
function cloud(g, x, y, w, c1, c2) {
  c1 = c1 || "#f2f2ea";
  c2 = c2 || "#cfd6d4";
  disc(g, x, y, w * 0.5, w * 0.22, c1);
  disc(g, x - w * 0.3, y + 2, w * 0.3, w * 0.15, c1);
  disc(g, x + w * 0.32, y + 1, w * 0.34, w * 0.17, c1);
  disc(g, x + w * 0.05, y - w * 0.15, w * 0.25, w * 0.18, c1);
  for (let i = -w * 0.7; i < w * 0.7; i++) if ((i | 0) % 2 === 0) rect(g, x + i, y + w * 0.16, 1, 1, c2);
  rect(g, x - w * 0.6, y + w * 0.19, w * 1.2, 1, c2);
}
function tufts(g, r, x0, y0, w, h, n, cols) {
  for (let k = 0; k < n; k++) {
    const x = Math.floor(x0 + r() * w),
      y = Math.floor(y0 + r() * h),
      c = cols[k % cols.length];
    rect(g, x, y - 2, 1, 3, c);
    rect(g, x - 1, y - 1, 1, 2, c);
    rect(g, x + 1, y - 1, 1, 2, c);
  }
}
function sepia3(g, grain) {
  const d = g.getImageData(0, 0, PW, PH),
    p = d.data;
  let s = 5;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let y = 0; y < PH; y++)
    for (let x = 0; x < PW; x++) {
      const i = (y * PW + x) * 4;
      let l = (p[i] * 0.3 + p[i + 1] * 0.59 + p[i + 2] * 0.11) / 255;
      l = 0.08 + l * 0.88 + (rnd() - 0.5) * (grain || 0.07);
      const v = Math.hypot((x - 80) / 80, (y - 100) / 100);
      if (v > 0.7) l -= (v - 0.7) * 0.7;
      l = Math.max(0, Math.min(1, l));
      p[i] = Math.round(38 + l * 196);
      p[i + 1] = Math.round(26 + l * 168);
      p[i + 2] = Math.round(14 + l * 118);
    }
  g.putImageData(d, 0, 0);
}
function fog(g, y0, y1, col, str) {
  for (let y = y0; y < y1; y++) {
    const band = str * (0.55 + 0.45 * Math.sin(y * 0.13));
    for (let x = 0; x < PW; x++)
      if (((x * 13 + y * 29) % 97) / 97 < band) {
        g.fillStyle = col;
        g.fillRect(x, y, 1, 1);
      }
  }
}
const PAL_SPR = ["#0e1e10", "#1a3a20", "#2a5430", "#3a6c3c"],
  PAL_SPR_D = ["#0c1a10", "#14301a", "#1e4024", "#2a5430"];
