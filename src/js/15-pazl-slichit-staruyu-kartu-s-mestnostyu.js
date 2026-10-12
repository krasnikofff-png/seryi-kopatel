// ===== ПАЗЛ: СЛИЧИТЬ СТАРУЮ КАРТУ С МЕСТНОСТЬЮ =====
const LM = {
  church: { n: "Церковь", f: "фундамент церкви" },
  well: { n: "Колодец", f: "колодец" },
  oak: { n: "Дуб", f: "старый дуб" },
  mound: { n: "Курган", f: "курган" },
  cross: { n: "Крест", f: "придорожный крест" },
  mill: { n: "Мельница", gone: 1 },
  farm: { n: "Хутор", gone: 1 }
};
const PZ_COST = 20,
  PZ_SEE = 6 * TS;
function makePuzzle(t, map, used) {
  const need = map.id === 2 ? 1 : 2,
    nDecoy = map.id === 2 ? 1 : 2,
    kinds = ["church", "well", "oak", "mound", "cross"].sort(() => R() - 0.5),
    real = kinds.slice(0, need + 1);
  const field = [];
  const ok = (x, y) => {
    const tx = Math.floor(x / TS),
      ty = Math.floor(y / TS);
    if (!diggable(tx, ty) || used.has(tx + "," + ty)) return false;
    if (trees.some(tr => Math.hypot(tr.x - x, tr.y - y) < 22)) return false;
    if (field.some(m => Math.hypot(m.x - x, m.y - y) < 5 * TS)) return false;
    return true;
  };
  const put = (k, isReal, near) => {
    for (let a = 0; a < 300; a++) {
      const an = R() * Math.PI * 2,
        d = (near ? 9 : 5.5) * TS + R() * 7 * TS;
      let x = ZC.x + Math.cos(an) * d,
        y = ZC.y + Math.sin(an) * d * 0.75;
      if (near && Math.hypot(x - near.x, y - near.y) < 8 * TS) continue;
      x = Math.round(x / TS) * TS + 8;
      y = Math.round(y / TS) * TS + 12;
      if (x < 40 || y < 70 || x > WW - 40 || y > WH - 40 || !ok(x, y)) continue;
      const m = { id: "f" + field.length, k, x, y, real: isReal };
      field.push(m);
      used.add(Math.floor(x / TS) + "," + Math.floor(y / TS));
      return m;
    }
    return null;
  };
  real.forEach(k => put(k, true));
  for (let i = 0; i < nDecoy; i++) {
    const src = field.filter(m => m.real)[i % need];
    if (src) put(src.k, false, src);
  }
  // старая карта: поворот, сдвиг и неточность чертёжника
  const rot = map.id === 2 ? 0 : (R() < 0.5 ? -1 : 1) * (0.2 + R() * 0.25),
    cs = Math.cos(rot),
    sn = Math.sin(rot),
    sx = (R() - 0.5) * 60,
    sy = (R() - 0.5) * 40;
  const toOld = (x, y, noise) => {
    const dx = x - ZC.x,
      dy = y - ZC.y;
    return {
      ox: ZC.x + dx * cs - dy * sn + sx + (noise ? (R() - 0.5) * 10 : 0),
      oy: ZC.y + dx * sn + dy * cs + sy + (noise ? (R() - 0.5) * 10 : 0)
    };
  };
  const old = [];
  field
    .filter(m => m.real)
    .forEach(m => old.push(Object.assign({ id: "o" + old.length, k: m.k, fid: m.id }, toOld(m.x, m.y, 1))));
  ["mill", "farm"].slice(0, map.id === 2 ? 1 : 2).forEach(k => {
    const an = R() * Math.PI * 2,
      d = 5 * TS + R() * 6 * TS;
    old.push(
      Object.assign(
        { id: "o" + old.length, k },
        toOld(ZC.x + Math.cos(an) * d, ZC.y + Math.sin(an) * d * 0.75, 0)
      )
    );
  });
  old.sort(() => R() - 0.5);
  const pz = {
    mid: map.id,
    seed: Math.floor(R() * 1e6),
    need,
    rotated: rot !== 0,
    old,
    field,
    cross: toOld(ZC.x, ZC.y, 0),
    river: [
      toOld(ZC.x - 260, ZC.y + 150),
      toOld(ZC.x - 60, ZC.y + 60),
      toOld(ZC.x + 40, ZC.y + 170),
      toOld(ZC.x + 260, ZC.y + 120)
    ],
    pairs: {},
    seen: [],
    done: 0,
    tries: 0
  };
  if (sk("karto") >= 3) {
    const m = field.find(x => x.real),
      o = old.find(x => x.fid === m.id);
    pz.seen.push(m.id);
    pz.pairs[o.id] = m.id;
    pz.hint = 1;
  }
  return pz;
}
// спрайты ориентиров
const LM_SPR = {};
function lmSpr(k) {
  if (LM_SPR[k]) return LM_SPR[k];
  const c = document.createElement("canvas"),
    g = c.getContext("2d");
  if (k === "church") {
    c.width = 30;
    c.height = 22;
    const st = (x, y, w, h) => {
      rect(g, x, y, w, h, "#2e2a26");
      rect(g, x + 1, y, w - 2, h - 1, "#9a948a");
      rect(g, x + 1, y, w - 2, 1, "#c8c2b6");
    };
    rect(g, 3, 6, 24, 15, "rgba(60,50,30,.25)");
    st(2, 4, 26, 4);
    st(2, 4, 4, 16);
    st(24, 4, 4, 9);
    st(2, 17, 10, 4);
    st(18, 17, 10, 4);
    for (let i = 0; i < 6; i++) rect(g, 8 + i * 3, 10 + (i % 2) * 3, 2, 1, "#a87a5a");
    rect(g, 13, 0, 4, 5, "#2e2a26");
    rect(g, 14, 0, 2, 5, "#7a746a");
  } else if (k === "well") {
    c.width = 18;
    c.height = 24;
    rect(g, 4, 0, 1, 14, "#3a2a1a");
    rect(g, 13, 0, 1, 14, "#3a2a1a");
    rect(g, 2, 0, 14, 3, "#5a3a22");
    rect(g, 2, 0, 14, 1, "#7a5434");
    rect(g, 5, 5, 8, 1, "#6a5a4a");
    disc(g, 9, 17, 8, 5, "#2e2a26");
    disc(g, 9, 17, 7, 4, "#9a948a");
    disc(g, 9, 16, 5, 3, "#1a1612");
    rect(g, 3, 15, 12, 1, "#c8c2b6");
  } else if (k === "oak") {
    c.width = 38;
    c.height = 36;
    rect(g, 16, 22, 6, 13, "#2a1a10");
    rect(g, 17, 22, 3, 13, "#5a3a22");
    rect(g, 12, 32, 14, 3, "#2a1a10");
    [
      [19, 13, 17, 12, "#14301a"],
      [19, 12, 16, 11, "#22471f"],
      [14, 10, 9, 7, "#2e5a26"],
      [24, 9, 9, 6, "#2e5a26"],
      [16, 7, 7, 4, "#4a7a32"],
      [11, 13, 5, 4, "#3a6a2a"]
    ].forEach(([x, y, a, b, col]) => disc(g, x, y, a, b, col));
    for (let i = 0; i < 40; i++) {
      const x = 6 + ((i * 37) % 26),
        y = 3 + ((i * 17) % 18);
      if (Math.hypot((x - 19) / 16, (y - 12) / 11) < 1) rect(g, x, y, 1, 1, i % 3 ? "#5a8a3a" : "#1a3a1a");
    }
  } else if (k === "mound") {
    c.width = 32;
    c.height = 14;
    disc(g, 16, 9, 15, 5, "#3e5a2c");
    disc(g, 15, 8, 13, 4, "#5e8a44");
    disc(g, 13, 7, 8, 2, "#7aaa58");
    rect(g, 15, 3, 4, 3, "#2e2a26");
    rect(g, 16, 3, 2, 2, "#9a948a");
    for (let i = 0; i < 12; i++) rect(g, 4 + ((i * 29) % 24), 5 + ((i * 7) % 6), 1, 2, "#8aba60");
  } else if (k === "cross") {
    c.width = 14;
    c.height = 26;
    rect(g, 6, 4, 3, 22, "#2a1a10");
    rect(g, 7, 4, 1, 22, "#7a5434");
    rect(g, 2, 9, 11, 3, "#2a1a10");
    rect(g, 3, 10, 9, 1, "#7a5434");
    rect(g, 4, 15, 7, 2, "#2a1a10");
    rect(g, 5, 15, 5, 1, "#7a5434");
    fillPoly(
      g,
      [
        [1, 5],
        [7, 0],
        [13, 5]
      ],
      "#3a2a1a"
    );
    rect(g, 4, 22, 7, 4, "rgba(40,30,20,.3)");
  }
  return (LM_SPR[k] = c);
}
function pzSee() {
  const pz = T && T.pz;
  if (!pz) return;
  let nw = [];
  pz.field.forEach(m => {
    if (!pz.seen.includes(m.id) && Math.hypot(m.x - P.x, m.y - P.y) < PZ_SEE) {
      pz.seen.push(m.id);
      nw.push(m);
    }
  });
  if (nw.length) {
    toast(`Ориентир: ${nw.map(m => LM[m.k].f).join(", ")}. Отмечен в блокноте — сравните со старой картой.`);
    pzBtn();
  }
}
function pzBtn() {
  const b = $("pzBtn");
  if (!b) return;
  const pz = T && T.pz;
  b.hidden = !pz;
  if (!pz) return;
  b.innerHTML = `<span class="ic" data-ic="map" style="width:18px;height:14px"></span><span>${pz.done ? "Сверить заново" : "Сличить карту"}<small>${pz.seen.length} ${plural(pz.seen.length, "ориентир", "ориентира", "ориентиров")}</small></span>`;
  b.querySelectorAll(".ic[data-ic]").forEach(el => setIcon(el, el.dataset.ic));
}
let pzSel = null,
  pzNote = "";
function openPz() {
  if (!T || !T.pz) return;
  paused = true;
  pzSel = null;
  renderPz();
  $("pzOver").hidden = false;
}
function closePz() {
  $("pzOver").hidden = true;
  paused = !!(T && T.event);
}
const PZW = 300,
  PZH = 220,
  PZS = PZW / 520;
function pzOldXY(o) {
  const c = T.pz.cross;
  return [(o.ox - c.ox) * PZS + PZW / 2, (o.oy - c.oy) * PZS + PZH / 2];
}
function pzFieldXY(m) {
  return [(m.x - ZC.x) * PZS + PZW / 2, (m.y - ZC.y) * PZS + PZH / 2];
}
function lmIcon(g, k, x, y, col) {
  g.fillStyle = col;
  g.strokeStyle = col;
  g.lineWidth = 1.5;
  if (k === "church") {
    g.fillRect(x - 4, y - 3, 8, 6);
    g.fillRect(x - 1, y - 8, 2, 5);
    g.fillRect(x - 3, y - 7, 6, 1.5);
  } else if (k === "well") {
    g.beginPath();
    g.arc(x, y, 4, 0, 7);
    g.stroke();
    g.fillRect(x - 5, y - 7, 10, 1.5);
  } else if (k === "oak") {
    g.beginPath();
    g.arc(x, y - 2, 5, 0, 7);
    g.fill();
    g.fillRect(x - 1, y, 2, 6);
  } else if (k === "mound") {
    g.beginPath();
    g.ellipse(x, y + 1, 7, 3.5, 0, Math.PI, 0);
    g.fill();
  } else if (k === "cross") {
    g.fillRect(x - 1, y - 7, 2, 13);
    g.fillRect(x - 4, y - 4, 8, 2);
  } else if (k === "mill") {
    g.fillRect(x - 2, y - 2, 4, 6);
    g.beginPath();
    g.moveTo(x - 6, y - 6);
    g.lineTo(x + 6, y + 6);
    g.moveTo(x + 6, y - 6);
    g.lineTo(x - 6, y + 6);
    g.stroke();
  } else if (k === "farm") {
    g.fillRect(x - 5, y - 1, 10, 6);
    g.beginPath();
    g.moveTo(x - 6, y - 1);
    g.lineTo(x, y - 6);
    g.lineTo(x + 6, y - 1);
    g.fill();
  }
}
function lblPos(boxes, x, y, tw, W) {
  const c = [
    [x + 10, y + 2],
    [x - 10 - tw, y + 2],
    [x - tw / 2, y + 12],
    [x - tw / 2, y - 24],
    [x + 10, y - 12],
    [x - 10 - tw, y - 12]
  ];
  for (const [tx, ty] of c) {
    if (tx < 2 || tx + tw > W - 2 || ty < 1 || ty + 13 > PZH - 1) continue;
    const bx = { x: tx - 2, y: ty, w: tw + 4, h: 13 };
    if (!boxes.some(b => bx.x < b.x + b.w && bx.x + bx.w > b.x && bx.y < b.y + b.h && bx.y + bx.h > b.y)) {
      boxes.push(bx);
      return [tx, ty];
    }
  }
  return [x + 10 + tw > W - 4 ? x - 10 - tw : x + 10, y + 2];
}
function drawOldMap(g, pz) {
  const W = PZW,
    H = PZH,
    r = rng(pz.seed || 777),
    mid = pz.mid || 3,
    ink = "#3a2a18",
    pen = (c, w) => {
      g.strokeStyle = c;
      g.lineWidth = w || 1;
    };
  // бумага: желтизна, пятна, сгибы, потёртые края
  const gr = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * 0.7);
  gr.addColorStop(0, "#efe2bd");
  gr.addColorStop(1, "#cdb788");
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = r() < 0.5 ? "rgba(120,90,40,.08)" : "rgba(255,250,230,.18)";
    g.fillRect(r() * W, r() * H, 1 + r() * 2, 1);
  }
  for (let i = 0; i < 5; i++) {
    const x = r() * W,
      y = r() * H,
      R = 10 + r() * 28;
    const sg = g.createRadialGradient(x, y, 1, x, y, R);
    sg.addColorStop(0, "rgba(150,110,50,.16)");
    sg.addColorStop(0.8, "rgba(150,110,50,.05)");
    sg.addColorStop(1, "rgba(150,110,50,0)");
    g.fillStyle = sg;
    g.beginPath();
    g.arc(x, y, R, 0, 7);
    g.fill();
  }
  const wob = (pts, close) => {
    g.beginPath();
    pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
    if (close) g.closePath();
  };
  const blob = (cx, cy, rx, ry, n) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2,
        k = 0.75 + r() * 0.4;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return pts;
  };
  // рельеф: горизонтали холма с бергштрихами
  {
    const hx = 30 + r() * (W - 60),
      hy = 25 + r() * (H - 50);
    pen("rgba(140,100,50,.45)", 1);
    for (let k = 1; k <= 4; k++) {
      wob(blob(hx, hy, k * 12, k * 8, 18), 1);
      g.stroke();
    }
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      g.beginPath();
      g.moveTo(hx + Math.cos(a) * 44, hy + Math.sin(a) * 30);
      g.lineTo(hx + Math.cos(a) * 50, hy + Math.sin(a) * 34);
      g.stroke();
    }
  }
  // пашня: наделы со штриховкой
  for (let f = 0; f < 3; f++) {
    const x = r() * (W - 70),
      y = r() * (H - 50),
      w = 40 + r() * 40,
      h = 24 + r() * 26,
      ang = (r() - 0.5) * 0.5;
    g.save();
    g.translate(x + w / 2, y + h / 2);
    g.rotate(ang);
    pen("rgba(110,80,40,.55)", 0.8);
    g.strokeRect(-w / 2, -h / 2, w, h);
    pen("rgba(130,100,50,.3)", 0.6);
    for (let yy = -h / 2 + 3; yy < h / 2; yy += 3) {
      g.beginPath();
      g.moveTo(-w / 2, yy);
      g.lineTo(w / 2, yy);
      g.stroke();
    }
    g.restore();
  }
  // леса: контур пунктиром и значки деревьев
  for (let f = 0; f < 3; f++) {
    const cx = r() * W,
      cy = r() * H,
      rx = 26 + r() * 30,
      ry = 18 + r() * 20,
      pts = blob(cx, cy, rx, ry, 14);
    g.fillStyle = "rgba(110,130,80,.13)";
    wob(pts, 1);
    g.fill();
    g.setLineDash([2, 2]);
    pen("rgba(70,90,50,.6)", 0.8);
    wob(pts, 1);
    g.stroke();
    g.setLineDash([]);
    for (let i = 0; i < 40; i++) {
      const x = cx + (r() - 0.5) * rx * 1.6,
        y = cy + (r() - 0.5) * ry * 1.6;
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 > 0.7) continue;
      const conif = r() < 0.5;
      g.fillStyle = "rgba(60,80,40,.75)";
      if (conif) {
        g.beginPath();
        g.moveTo(x, y - 4);
        g.lineTo(x + 2.5, y + 1);
        g.lineTo(x - 2.5, y + 1);
        g.fill();
      } else {
        g.beginPath();
        g.arc(x, y - 1.5, 2, 0, 7);
        g.fill();
      }
      g.fillRect(x - 0.4, y, 0.8, 2);
    }
  }
  // болото
  {
    const bx = r() * W,
      by = H * 0.6 + r() * H * 0.35;
    for (let i = 0; i < 14; i++) {
      const x = bx + (r() - 0.5) * 60,
        y = by + (r() - 0.5) * 24;
      pen("rgba(70,100,120,.55)", 0.8);
      g.beginPath();
      g.moveTo(x - 4, y);
      g.lineTo(x + 4, y);
      g.moveTo(x - 2, y);
      g.lineTo(x - 3, y - 3);
      g.moveTo(x, y);
      g.lineTo(x, y - 4);
      g.moveTo(x + 2, y);
      g.lineTo(x + 3, y - 3);
      g.stroke();
    }
  }
  // река со штриховкой берегов
  {
    const rv = pz.river.map(p => pzOldXY(p));
    g.lineCap = "round";
    g.lineJoin = "round";
    pen("rgba(120,160,190,.55)", 7);
    wob(rv);
    g.stroke();
    pen("#4a6a8a", 1.2);
    g.save();
    g.translate(0, -3.5);
    wob(rv);
    g.stroke();
    g.restore();
    g.save();
    g.translate(0, 3.5);
    wob(rv);
    g.stroke();
    g.restore();
    g.font = "italic 13px 'Caveat',cursive";
    g.fillStyle = "#3a5a7a";
    const m = rv[1];
    g.fillText("р. Гнилуша", m[0] + 6, m[1] - 9);
  }
  // дорога: двойная линия и просёлок пунктиром
  {
    const y0 = 10 + r() * (H - 20),
      y1 = 10 + r() * (H - 20),
      pts = [
        [0, y0],
        [W * 0.35, y0 + (r() - 0.5) * 40],
        [W * 0.7, y1 + (r() - 0.5) * 40],
        [W, y1]
      ];
    pen("#5a4028", 1);
    g.save();
    g.translate(0, -1.8);
    wob(pts);
    g.stroke();
    g.restore();
    g.save();
    g.translate(0, 1.8);
    wob(pts);
    g.stroke();
    g.restore();
    g.setLineDash([3, 3]);
    pen("rgba(90,64,40,.7)", 1);
    wob([
      [W * 0.35, pts[1][1]],
      [W * 0.45, H]
    ]);
    g.stroke();
    g.setLineDash([]);
  }
  if (mid === 3) {
    // штабная: сетка квадратов и линия окопов красным карандашом
    pen("rgba(60,60,90,.25)", 0.6);
    for (let x = 0; x < W; x += 40) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, H);
      g.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(W, y);
      g.stroke();
    }
    g.font = "9px 'PT Sans Narrow',sans-serif";
    g.fillStyle = "rgba(60,60,90,.6)";
    for (let x = 0; x < W; x += 40) g.fillText(String(41 + x / 40), x + 2, 9);
    const c = pzOldXY(pz.cross);
    pen("rgba(180,40,30,.75)", 1.4);
    g.beginPath();
    for (let i = 0; i <= 10; i++) {
      const x = c[0] - 60 + i * 12,
        y = c[1] + 38 + (i % 2 ? -5 : 5);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
    pen("rgba(40,60,160,.7)", 1.4);
    g.beginPath();
    g.moveTo(c[0] + 70, c[1] - 50);
    g.lineTo(c[0] + 40, c[1] - 20);
    g.stroke();
    g.beginPath();
    g.moveTo(c[0] + 40, c[1] - 20);
    g.lineTo(c[0] + 48, c[1] - 21);
    g.lineTo(c[0] + 42, c[1] - 28);
    g.stroke();
  }
  // сгибы листа
  pen("rgba(120,90,50,.25)", 1);
  g.beginPath();
  g.moveTo(W / 2, 0);
  g.lineTo(W / 2, H);
  g.moveTo(0, H / 2);
  g.lineTo(W, H / 2);
  g.stroke();
  pen("rgba(255,250,235,.35)", 1);
  g.beginPath();
  g.moveTo(W / 2 + 1, 0);
  g.lineTo(W / 2 + 1, H);
  g.moveTo(0, H / 2 + 1);
  g.lineTo(W, H / 2 + 1);
  g.stroke();
  // роза ветров
  {
    const x = W - 24,
      y = 26;
    pen(ink, 1);
    g.beginPath();
    g.arc(x, y, 11, 0, 7);
    g.stroke();
    g.fillStyle = ink;
    g.beginPath();
    g.moveTo(x, y - 15);
    g.lineTo(x + 3, y);
    g.lineTo(x - 3, y);
    g.fill();
    g.beginPath();
    g.moveTo(x, y + 15);
    g.lineTo(x + 3, y);
    g.lineTo(x - 3, y);
    g.stroke();
    g.font = "bold 10px 'PT Sans Narrow',sans-serif";
    g.fillText("С", x - 3, y - 17);
  }
  // картуш и масштаб
  {
    const t1 = mid === 2 ? "Схема д. Лыково" : "Карта 1:25 000",
      t2 = mid === 2 ? "1939 г., от руки" : "Штаб 1942 г. · секретно";
    g.font = "italic 600 14px 'Caveat',cursive";
    const w = Math.max(g.measureText(t1).width, g.measureText(t2).width) + 14;
    g.fillStyle = "rgba(236,224,190,.92)";
    g.fillRect(6, H - 38, w, 32);
    pen(ink, 1);
    g.strokeRect(6, H - 38, w, 32);
    g.strokeRect(8, H - 36, w - 4, 28);
    g.fillStyle = ink;
    g.fillText(t1, 13, H - 24);
    g.font = "italic 12px 'Caveat',cursive";
    g.fillText(t2, 13, H - 12);
    const sx = W - 70,
      sy = H - 12;
    g.fillStyle = ink;
    g.fillRect(sx, sy, 20, 3);
    pen(ink, 1);
    g.strokeRect(sx, sy, 60, 3);
    g.fillRect(sx + 40, sy, 20, 3);
    g.font = "9px 'PT Sans Narrow',sans-serif";
    g.fillText("0", sx - 2, sy - 2);
    g.fillText("200 саж.", sx + 34, sy - 2);
  }
  // потёртые края и уголки
  g.strokeStyle = "rgba(90,60,30,.5)";
  g.lineWidth = 3;
  g.strokeRect(1.5, 1.5, W - 3, H - 3);
  g.fillStyle = "#2a2117";
  [
    [0, 0, 1, 1],
    [W, 0, -1, 1],
    [0, H, 1, -1],
    [W, H, -1, -1]
  ].forEach(([x, y, dx, dy]) => {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + dx * (6 + r() * 6), y);
    g.lineTo(x, y + dy * (6 + r() * 6));
    g.fill();
  });
}
function renderPz() {
  const pz = T.pz,
    box = $("pzOver");
  setTimeout(() => {
    pzNote = "";
  }, 0);
  const pairs = Object.entries(pz.pairs),
    need = pz.need;
  box.innerHTML = `<div class="sheet pz"><h2>Сличить карту с местностью</h2>
    ${pzNote ? `<p class="pz-note">${pzNote}</p>` : ""}<p class="pz-hint">${pzSel ? `Теперь нажмите этот же ориентир на нижней схеме.` : pairs.length >= need ? `Пар достаточно (${pairs.length} из ${need}) — можно сверять. Новая пара заменит старую.` : `Нажмите ориентир на старой карте, потом — тот же на схеме местности. Пар: ${pairs.length} из ${need}.`} Часть того, что на старой карте, давно исчезла${pz.rotated ? ", а сама карта нарисована под углом" : ""}.</p>
    <div class="pz-cap">Старая карта</div><canvas id="pzOld" width="${PZW * 2}" height="${PZH * 2}"></canvas>
    <div class="pz-cap">Местность — что вы видели <small>${pz.seen.length ? "" : "пока ничего: походите по полю"}</small></div><canvas id="pzNow" width="${PZW * 2}" height="${PZH * 2}"></canvas>
    <div class="pz-pairs">${pairs
      .map(([o, f]) => {
        const O = pz.old.find(x => x.id === o),
          F = pz.field.find(x => x.id === f);
        return `<button onclick="SK.pzUnpair('${o}')">${LM[O.k].n} ↔ ${LM[F.k].f} ✕</button>`;
      })
      .join("")}</div>
    <div class="row"><button class="btn" ${pairs.length === need ? "" : "disabled"} onclick="SK.pzCheck()">Сверить · ${PZ_COST} мин</button><button class="btn ghost" onclick="SK.pzClose()">Закрыть</button></div></div>`;
  // старая карта — рисованный план с лесами, пашней, дорогой, болотом, рельефом и картушем
  const co = $("pzOld"),
    g = co.getContext("2d");
  g.scale(2, 2);
  drawOldMap(g, pz);
  const hitsO = [],
    hitsN = [],
    boxO = [],
    boxN = [];
  pz.old.forEach(o => {
    const [x, y] = pzOldXY(o);
    boxO.push({ x: x - 9, y: y - 9, w: 18, h: 18 });
  });
  {
    const [x, y] = pzOldXY(pz.cross);
    boxO.push({ x: x - 13, y: y - 13, w: 60, h: 26 });
  }
  pz.old.forEach(o => {
    const [x, y] = pzOldXY(o),
      sel = pzSel === o.id,
      paired = pz.pairs[o.id];
    g.fillStyle = "rgba(236,224,190,.85)";
    g.beginPath();
    g.arc(x, y, 9, 0, 7);
    g.fill();
    if (sel || paired) {
      g.strokeStyle = sel ? "#c0302a" : "#4a6a20";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(x, y, 11, 0, 7);
      g.stroke();
    }
    lmIcon(g, o.k, x, y, "#2a1c10");
    g.font = "italic 600 13px 'Caveat','PT Sans Narrow',cursive";
    const L = LM[o.k].n,
      tw = g.measureText(L).width,
      [tx, ty] = lblPos(boxO, x, y, tw, PZW);
    g.fillStyle = "rgba(236,224,190,.7)";
    g.fillRect(tx - 2, ty, tw + 4, 13);
    g.fillStyle = "#2a1c10";
    g.fillText(L, tx, ty + 11);
    hitsO.push({ o, x, y, lx: tx - 3, ly: ty - 2, lw: tw + 6, lh: 17 });
  });
  {
    const [x, y] = pzOldXY(pz.cross);
    g.strokeStyle = "#b02a20";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x - 7, y - 7);
    g.lineTo(x + 7, y + 7);
    g.moveTo(x + 7, y - 7);
    g.lineTo(x - 7, y + 7);
    g.stroke();
    g.lineWidth = 1;
    g.beginPath();
    g.arc(x, y, 12, 0, 7);
    g.stroke();
    g.font = "italic 13px 'Caveat',cursive";
    g.fillStyle = "#b02a20";
    g.fillText(pz.mid === 2 ? "хутор?" : "здесь", x + 13, y - 8);
  }
  // местность
  const cn = $("pzNow"),
    q = cn.getContext("2d");
  q.scale(2, 2);
  q.imageSmoothingEnabled = false;
  q.drawImage(bg, ZC.x - PZW / 2 / PZS, ZC.y - PZH / 2 / PZS, PZW / PZS, PZH / PZS, 0, 0, PZW, PZH);
  q.fillStyle = "rgba(20,30,10,.25)";
  q.fillRect(0, 0, PZW, PZH);
  trees.forEach(tr => {
    const [x, y] = pzFieldXY(tr);
    if (x > 0 && y > 0 && x < PZW && y < PZH) {
      q.fillStyle = "rgba(10,30,10,.6)";
      q.fillRect(x - 1.5, y - 3, 3, 3);
    }
  });
  if (T.shown) {
    const [x, y] = pzFieldXY(T.shown);
    q.strokeStyle = "rgba(250,236,170,.8)";
    q.setLineDash([3, 3]);
    q.lineWidth = 1.5;
    q.beginPath();
    q.arc(x, y, T.shown.r * PZS, 0, 7);
    q.stroke();
    q.setLineDash([]);
  }
  pz.field
    .filter(m => pz.seen.includes(m.id))
    .forEach(m => {
      const [x, y] = pzFieldXY(m);
      boxN.push({ x: x - 10, y: y - 10, w: 20, h: 20 });
    });
  pz.field
    .filter(m => pz.seen.includes(m.id))
    .forEach(m => {
      const [x, y] = pzFieldXY(m),
        paired = Object.values(pz.pairs).includes(m.id);
      q.fillStyle = paired ? "rgba(200,230,120,.5)" : "rgba(255,250,220,.45)";
      q.beginPath();
      q.arc(x, y, 11, 0, 7);
      q.fill();
      lmIcon(q, m.k, x, y, "#1a1408");
      q.font = "11px 'PT Sans Narrow',sans-serif";
      const tw = q.measureText(LM[m.k].f).width,
        [tx, ty] = lblPos(boxN, x, y, tw, PZW);
      q.fillStyle = "#fff8e0";
      q.strokeStyle = "rgba(0,0,0,.6)";
      q.lineWidth = 3;
      q.strokeText(LM[m.k].f, tx, ty + 11);
      q.fillText(LM[m.k].f, tx, ty + 11);
      hitsN.push({ o: m, x, y, lx: tx - 3, ly: ty - 2, lw: tw + 6, lh: 17 });
    });
  {
    const [x, y] = pzFieldXY(P);
    q.fillStyle = "#f2d36a";
    q.beginPath();
    q.arc(x, y, 3.5, 0, 7);
    q.fill();
    q.strokeStyle = "#000";
    q.lineWidth = 1;
    q.stroke();
  }
  const hitPt = (e, cv, hits) => {
    const r = cv.getBoundingClientRect(),
      x = ((e.clientX - r.left) * PZW) / r.width,
      y = ((e.clientY - r.top) * PZH) / r.height;
    let best = null,
      bd = 1e9;
    const lab = hits.find(h => x >= h.lx && x <= h.lx + h.lw && y >= h.ly && y <= h.ly + h.lh);
    if (lab) return lab.o;
    hits.forEach(h => {
      const d = Math.hypot(h.x - x, h.y - y);
      if (d < 24 && d < bd) {
        bd = d;
        best = h.o;
      }
    });
    return best;
  };
  co.onclick = e => {
    const o = hitPt(e, co, hitsO);
    if (!o) return;
    pzSel = pzSel === o.id ? null : o.id;
    renderPz();
  };
  cn.onclick = e => {
    const m = hitPt(e, cn, hitsN);
    if (!m) return;
    if (!pzSel) {
      pzNote = "Сначала нажмите ориентир на старой карте, потом — этот.";
      renderPz();
      return;
    }
    for (const k in pz.pairs) if (pz.pairs[k] === m.id) delete pz.pairs[k];
    let note = "";
    const keys = Object.keys(pz.pairs);
    if (keys.length >= pz.need && !pz.pairs[pzSel]) {
      const drop = keys[0],
        O = pz.old.find(x => x.id === drop);
      delete pz.pairs[drop];
      note = `Пара «${LM[O.k].n}» заменена новой — нужно всего ${pz.need} ${plural(pz.need, "пара", "пары", "пар")}.`;
    }
    pz.pairs[pzSel] = m.id;
    pzSel = null;
    pzNote = note;
    renderPz();
  };
}
function pzUnpair(o) {
  delete T.pz.pairs[o];
  renderPz();
}
function pzCheck() {
  const pz = T.pz,
    P2 = Object.entries(pz.pairs).map(([o, f]) => [
      pz.old.find(x => x.id === o),
      pz.field.find(x => x.id === f)
    ]);
  if (P2.length !== pz.need) return;
  let px,
    py,
    warn = "";
  const c = pz.cross;
  if (P2.length === 1) {
    const [o, f] = P2[0];
    px = f.x + (c.ox - o.ox);
    py = f.y + (c.oy - o.oy);
  } else {
    const [[o1, f1], [o2, f2]] = P2,
      ax = o2.ox - o1.ox,
      ay = o2.oy - o1.oy,
      bx = f2.x - f1.x,
      by = f2.y - f1.y,
      den = ax * ax + ay * ay || 1;
    const zr = (bx * ax + by * ay) / den,
      zi = (by * ax - bx * ay) / den,
      cx = c.ox - o1.ox,
      cy = c.oy - o1.oy;
    px = f1.x + zr * cx - zi * cy;
    py = f1.y + zr * cy + zi * cx;
    const sc = Math.hypot(zr, zi),
      ang = Math.abs(Math.atan2(zi, zr));
    if (sc < 0.8 || sc > 1.25)
      warn = ` Странно: по этим ориентирам карта выходит ${sc < 1 ? "сжатой" : "растянутой"} в ${sc < 1 ? (1 / sc).toFixed(1) : sc.toFixed(1)} раза. Может, перепутали ориентир?`;
    else if (ang > 0.6) warn = " Странно: карта выходит сильно повёрнутой. Может, перепутали ориентир?";
  }
  px = Math.max(30, Math.min(WW - 30, px));
  py = Math.max(60, Math.min(WH - 30, py));
  T.minutes += PZ_COST;
  pz.tries++;
  pz.done = 1;
  pz.ok = P2.every(([o, f]) => o.fid === f.id);
  T.shown = { x: px, y: py, r: T.real.r + 4 };
  closePz();
  updateHud();
  pzBtn();
  save();
  toast(`Сверили старую карту с местностью (−${PZ_COST} мин). Кольцо стало уже.${warn}`);
}

// сюжетные находки ложатся в фиксированные места, когда наступает их глава
const STORY_SPOT = {
  zheton: { world: "forest", st: 2, x: 336, y: 294, depth: 28, c: 3, era: 1, w: 0.02 },
  sumka: { world: "manor", st: 3, x: 432, y: 222, depth: 55, c: 3, era: 1, w: 0.6 },
  medal: { world: "swamp", st: 5, x: 412, y: 308, depth: 95, c: 3, era: 1, w: 0.03 },
  kotelok: { world: "forest", st: 4, x: 104, y: 152, depth: 70, c: 3, era: 1, w: 0.4 },
  flyaga: { world: "swamp", st: 4, x: 216, y: 152, depth: 80, c: 3, era: 1, w: 0.3 }
};
function placeStory(t, used) {
  const S = G.story;
  if (!S) return;
  for (const id in STORY_SPOT) {
    const p = STORY_SPOT[id];
    if (p.world !== worldKind || S.st !== p.st || S.clues.includes(id) || G.inv.some(i => i.story === id))
      continue;
    if (id === "medal" && G.debt > 0) continue; // остров — только без долгов
    const cx = Math.floor(p.x / TS),
      cy = Math.floor(p.y / TS);
    outer: for (let r = 0; r < 6; r++)
      for (let dx = -r; dx <= r; dx++)
        for (let dy = -r; dy <= r; dy++) {
          const tx = cx + dx,
            ty = cy + dy;
          if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
          used.add(tx + "," + ty);
          t.items.push({
            tx,
            ty,
            x: tx * TS + 8,
            y: ty * TS + 8,
            c: p.c,
            era: p.era,
            name: STORY_ITEMS[id].name,
            iron: false,
            w: p.w,
            base: 3000,
            depth: p.depth,
            found: false,
            story: id
          });
          break outer;
        }
  }
}
function loadTrip(t) {
  curReg = t.region || 1;
  ensureWorld(LOC(t.region, t.map));
  try {
    cardEl.hidden = true;
    toastEl.hidden = true;
  } catch (e) {} // старая карточка находки не переезжает в новую поездку
  ZC = t.zc ? { x: t.zc.x, y: t.zc.y } : { x: ZONE.x, y: ZONE.y };
  T = t;
  items = T.items;
  holes = new Map(Object.entries(T.holes || {}).map(([k, v]) => [k, +v]));
  P.x = T.px;
  P.y = T.py;
  P.dir = T.dir || "up";
  P.moving = false;
  path = [];
  dest = null;
  mark = null;
  digT = 0;
  try {
    buildTrail(T);
  } catch (e) {
    trailCv = null;
  }
  birds.length = 0;
  for (let i = 0; i < 4; i++) spawnBird();
  $("placeF").innerHTML =
    `<b>${T.map === 4 ? "Городище · древность" : T.map === 5 ? "Затопленная деревня" : REGIONS[T.region].name + " · " + (T.map === 3 ? "усадьба" : REG_INFO[T.region].layer)}</b><small>${SEASONS.find(x => x.id === T.season)?.name || season().name}, ${WEATHER[T.wx || "clear"].name} · ${T.map === 4 ? "отчёт экспедиции 1954 г." : T.map === 5 ? "вода отступила" : T.map ? "карта «" + (MAPS.find(m => m.id === T.map) || { name: "?" }).name + "»" : "поиск наугад"}</small>`;
  buildBars();
  updateHud();
  digLabels();
  pzBtn();
  if (T.pz && !T.pz.told) {
    T.pz.told = 1;
    setTimeout(
      () =>
        toast(
          `Старая карта: найдите в поле ${T.pz.need === 1 ? "ориентир" : "ориентиры"} и сличите их с картой — кольцо станет точнее. Кнопка «Сличить карту» вверху.`
        ),
      1200
    );
  }
}
