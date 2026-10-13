// ================= КОПАТЕЛЬ С ДЕТЕКТОРОМ: готовые спрайты =================
// листы 120×168: строки — вниз, влево, вправо, вверх; столбцы — кадры ходьбы 0,1,2; кадр 40×42, ноги в точке (20,29)
const HERO_DET = [
  null,
  "@art(hero-det/1.png)",
  "@art(hero-det/2.png)",
  "@art(hero-det/3.png)",
  "@art(hero-det/4.png)",
  "@art(hero-det/5.png)",
  "@art(hero-det/6.png)"
].map(u => {
  if (!u) return null;
  const im = new Image();
  im.src = u;
  return im;
});
// одежда копателя: надевается сама с уровнем. Новую одежду добавлять сюда — свой набор из шести листов (по детекторам)
const loadSheets = urls =>
  urls.map(u => {
    if (!u) return null;
    const im = new Image();
    im.src = u;
    return im;
  });
const OUTFITS = [
  { id: "cap", l: 1, n: "Кепка", sheets: HERO_DET },
  {
    id: "ushanka",
    l: 3,
    n: "Ушанка",
    sheets: loadSheets([
      null,
      "@art(hero-det/u1.png)",
      "@art(hero-det/u2.png)",
      "@art(hero-det/u3.png)",
      "@art(hero-det/u4.png)",
      "@art(hero-det/u5.png)",
      "@art(hero-det/u6.png)"
    ])
  },
  {
    id: "gorka",
    l: 9,
    n: "Ушанка и розовая «горка»",
    sheets: loadSheets([
      null,
      "@art(hero-det/ug1.png)",
      "@art(hero-det/ug2.png)",
      "@art(hero-det/ug3.png)",
      "@art(hero-det/ug4.png)",
      "@art(hero-det/ug5.png)",
      "@art(hero-det/ug6.png)"
    ])
  }
];
const outfit = () => OUTFITS.filter(o => (G.lvl || 1) >= o.l).pop();
function heroImg(d) {
  const im = outfit().sheets[d];
  return im && im.complete && im.naturalWidth ? im : HERO_DET[d];
}
const HD_ROW = { down: 0, left: 1, right: 2, up: 3 },
  HD_SWAY = [0, -2, 2];
function heroCoil(x, y, fr) {
  const sw = HD_SWAY[fr],
    h = (sw / 2) | 0;
  return P.dir === "down"
    ? { x: x + 1 + sw, y: y + 8 }
    : P.dir === "up"
      ? { x: x - 1 + sw, y: y - 24 }
      : P.dir === "right"
        ? { x: x + 12, y: y - 1 + h }
        : { x: x - 13, y: y - 1 + h };
}
function drawHeroDet(x, y, sig) {
  const im = heroImg(G.det);
  if (!im || !im.complete || !im.naturalWidth) return false;
  const fr = P.moving ? [0, 1, 0, 2][((Math.floor(P.walk * 8) % 4) + 4) % 4] : 0;
  x = Math.round(x);
  y = Math.round(y);
  disc(ctx, x, y + 1, 5, 1, "rgba(20,30,10,.35)");
  const c = heroCoil(x, y, fr),
    big = G.det === 5 ? 6 : 5,
    glow = sig.s > 0.08,
    col = G.det === 1 ? "#e3b85a" : "#f6dc6a";
  if (glow) {
    ctx.globalAlpha = 0.25 + sig.s * 0.5;
    disc(ctx, c.x, c.y, big + 2, 3, col);
    ctx.globalAlpha = 1;
  }
  ctx.drawImage(im, HD_ROW[P.dir] * 0 + fr * 40, HD_ROW[P.dir] * 42, 40, 42, x - 20, y - 29, 40, 42);
  if (glow && G.det !== 6) {
    ctx.globalAlpha = 0.3 + sig.s * 0.5;
    disc(ctx, c.x, c.y, big - 3, 1, col);
    ctx.globalAlpha = 1;
  }
  return true;
}
function drawShovel(cx, cy) {
  let x = P.x + OFF.x + (P.dir === "left" ? -4 : 4) - cx,
    y = P.y + OFF.y - 8 - cy;
  if (digT > 0) {
    const t = targetTile();
    x = t.tx * TS + 8 - cx;
    y = t.ty * TS + 5 - cy + (digT > 0.2 ? -3 : 1);
  }
  x = Math.round(x);
  y = Math.round(y);
  rect(ctx, x, y - 6, 1, 7, "#8a6a42");
  rect(ctx, x - 1, y - 7, 3, 1, "#6e5032");
  rect(ctx, x - 1, y + 1, 3, 3, "#a9aaa5");
  rect(ctx, x, y + 4, 1, 1, "#a9aaa5");
}
function draw() {
  const camX =
    WW <= VW ? Math.floor((WW - VW) / 2) : Math.max(0, Math.min(WW - VW, Math.round(P.x - VW / 2)));
  const mid = viewMidY || VH / 2,
    camY = Math.max(-Math.round(viewTop), Math.min(WH - VH + Math.round(viewBot), Math.round(P.y - 8 - mid)));
  CX = camX;
  CY = camY;
  {
    const t = pTile(),
      f = FACE[P.dir];
    OFF =
      !P.moving && (holes.has(t.tx + "," + t.ty) || digT > 0)
        ? { x: -f[0] * 7, y: -f[1] * 5 + (f[1] ? 0 : -2) }
        : { x: 0, y: 0 };
  }
  ctx.fillStyle = GROUND[worldKind] || "#70a640";
  ctx.fillRect(0, 0, VW, VH);
  ctx.drawImage(bg, -camX, -camY);
  if (trailCv) ctx.drawImage(trailCv, -camX, -camY);
  {
    const S = T && T.season;
    if (S === "winter") {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#eef2f2";
      ctx.fillRect(0, 0, VW, VH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      for (let y = -camY & 3; y < VH; y += 4)
        for (let x = (-camX & 7) + ((y + camY) & 4 ? 4 : 0); x < VW; x += 8) ctx.fillRect(x, y, 1, 1);
    } else if (S === "autumn") {
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "#d8a038";
      ctx.fillRect(0, 0, VW, VH);
      ctx.globalAlpha = 1;
      const hr = rng(7);
      for (let k = 0; k < 160; k++) {
        const x = (((hr() * WW - camX) % WW) + WW) % WW,
          y = (((hr() * WH - camY) % WH) + WH) % WH;
        if (x < VW && y < VH) rect(ctx, x, y, 2, 1, k % 3 ? "#c8782a" : "#e0b040");
      }
    } else if (S === "spring") {
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#8a6a3a";
      ctx.fillRect(0, 0, VW, VH);
      ctx.globalAlpha = 1;
    }
  }
  // тени облаков
  ctx.globalAlpha = 0.08;
  for (const c of clouds) disc(ctx, c.x - camX, c.y - camY, c.rx, c.ry, "#1c2a10");
  ctx.globalAlpha = 1;
  // зона с карты
  if (showZone && T.shown) {
    const Z = T.shown,
      N = Math.round(2 * Math.PI * Z.r);
    ctx.fillStyle = "rgba(250,236,170,.75)";
    for (let i = 0; i < N; i++) {
      if (i % 8 > 3) continue;
      const a = i / Z.r;
      ctx.fillRect(
        Math.round(Z.x + Math.cos(a) * Z.r - camX),
        Math.round(Z.y + Math.sin(a) * Z.r - camY),
        1,
        1
      );
    }
  }
  // стрелка к зоне, пока игрок не дошёл до кольца
  if (showZone && T.shown && Math.hypot(P.x - T.shown.x, P.y - T.shown.y) > T.shown.r * 0.9) {
    const Z = T.shown,
      top = viewTop + 10,
      bot = VH - viewBot - 10,
      cx = VW / 2,
      cy = (top + bot) / 2,
      zx = Z.x - camX,
      zy = Z.y - camY;
    if (zx < 4 || zx > VW - 4 || zy < top || zy > bot) {
      const dx = zx - cx,
        dy = zy - cy,
        k = Math.min(
          (VW / 2 - 13) / Math.max(1e-3, Math.abs(dx)),
          (bot - top) / 2 / Math.max(1e-3, Math.abs(dy))
        );
      const ax = cx + dx * k,
        ay = cy + dy * k,
        a = Math.atan2(dy, dx),
        ps = 1.35 + 0.2 * Math.sin(performance.now() / 200);
      ctx.save();
      ctx.translate(Math.round(ax), Math.round(ay));
      ctx.rotate(a);
      ctx.scale(ps, ps);
      ctx.fillStyle = "#2a2014";
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-6, -7);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f2d14b";
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-4, -5);
      ctx.lineTo(-1.5, 0);
      ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  drawSunk(camX, camY);
  // ямы
  holes.forEach((h, k) => {
    const [tx, ty] = k.split(",").map(Number),
      x = tx * TS + 8 - camX,
      y = ty * TS + 9 - camY,
      q = Math.min(1, h / 100);
    const hr = rng(tx * 131 + ty * 977);
    for (let i = 0; i < 10; i++) {
      const a = hr() * 6.28,
        dd = 8 + hr() * 4;
      rect(
        ctx,
        x + Math.cos(a) * dd,
        y + Math.sin(a) * dd * 0.6,
        hr() < 0.4 ? 2 : 1,
        1,
        hr() < 0.5 ? "#7a5634" : "#9a7348"
      );
    }
    disc(ctx, x, y + 1, 8, 5, "rgba(60,40,20,.35)");
    disc(ctx, x, y, 7, 4, "#9a7348");
    rect(ctx, x - 6, y - 2, 3, 1, "#b48c5c");
    rect(ctx, x - 3, y - 4, 4, 1, "#b48c5c");
    rect(ctx, x + 4, y + 2, 2, 1, "#6b4b2d");
    disc(
      ctx,
      x,
      y,
      3 + Math.round(q * 2),
      2 + Math.round(q),
      `rgb(${Math.round(84 - q * 44)},${Math.round(62 - q * 36)},${Math.round(40 - q * 24)})`
    );
    if (items.some(i => i.found && !i.rival && i.tx === tx && i.ty === ty)) {
      rect(ctx, x, y, 1, 1, "#ffe27a");
    }
  });
  const corners = (t, col) => {
    const x = t.tx * TS - camX,
      y = t.ty * TS - camY;
    ctx.fillStyle = col;
    [
      [0, 0],
      [13, 0],
      [0, 13],
      [13, 13]
    ].forEach(([a, b]) => {
      ctx.fillRect(x + a, y + b, 3, 1);
      ctx.fillRect(x + a + (a ? 2 : 0), y + b + (b ? -2 : 0), 1, 3);
    });
  };
  if (path.length) {
    ctx.fillStyle = "rgba(250,236,170,.7)";
    for (const n of path.slice(0, -1)) ctx.fillRect(n.tx * TS + 7 - camX, n.ty * TS + 7 - camY, 2, 2);
  }
  if (dest) corners(dest, "rgba(250,236,170,.95)");
  if (!paused && !path.length) {
    const t = pTile(),
      x = t.tx * TS - camX,
      y = t.ty * TS - camY;
    ctx.strokeStyle = diggable(t.tx, t.ty) ? "#f2d14b" : "#e0563e";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillRect(x + 1, y + 1, TS - 2, TS - 2);
    ctx.globalAlpha = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, TS - 1, TS - 1);
    ctx.strokeStyle = "rgba(30,22,10,.55)";
    ctx.strokeRect(x + 1.5, y + 1.5, TS - 3, TS - 3);
  }
  if (mark) {
    const x = mark.tx * TS + 8 - camX,
      y = mark.ty * TS + 8 - camY;
    ctx.fillStyle = "rgba(220,80,60,.9)";
    for (let i = -3; i <= 3; i++) {
      ctx.fillRect(x + i, y + i, 1, 1);
      ctx.fillRect(x + i, y - i, 1, 1);
    }
  }
  // сущности по глубине
  const sig = signal({ x: P.x, y: P.y - 5 });
  if (
    own("pin") &&
    !paused &&
    !path.length &&
    digT <= 0 &&
    sig.it &&
    sig.s > 0.25 &&
    Math.hypot(sig.it.x - P.x, sig.it.y - (P.y - 5)) < 34
  ) {
    const a = 0.5 + 0.5 * Math.sin(performance.now() / 160),
      x = sig.it.tx * TS - camX,
      y = sig.it.ty * TS - camY;
    ctx.fillStyle = `rgba(110,240,130,${(0.18 + 0.22 * a).toFixed(2)})`;
    ctx.fillRect(x + 1, y + 1, TS - 2, TS - 2);
    ctx.fillStyle = `rgba(150,255,160,${(0.7 + 0.3 * a).toFixed(2)})`;
    [
      [0, 0],
      [12, 0],
      [0, 12],
      [12, 12]
    ].forEach(([u, v]) => {
      ctx.fillRect(x + u, y + v, 4, 1);
      ctx.fillRect(x + u + (u ? 3 : 0), y + v + (v ? -3 : 0), 1, 4);
    });
    ctx.fillRect(x + 5, y + 7, 6, 2);
    ctx.fillRect(x + 7, y + 5, 2, 6);
  }
  const ents = [];
  trees.forEach(t => {
    const sp = treeFor(t.kind, T && T.season),
      x = t.x - (sp.width >> 1) - camX,
      y = t.y - sp.height + 2 - camY;
    if (x > VW || y > VH || x + sp.width < 0 || y + sp.height < 0) return;
    ents.push({ y: t.y, f: () => ctx.drawImage(sp, x, y) });
  });
  if (T.pz)
    T.pz.field.forEach(m => {
      const sp = lmSpr(m.k),
        x = m.x - (sp.width >> 1) - camX,
        y = m.y - sp.height + 3 - camY;
      if (x > VW || y > VH || x + sp.width < 0 || y + sp.height < 0) return;
      ents.push({ y: m.y, f: () => ctx.drawImage(sp, x, y) });
    });
  birds.forEach(b => ents.push({ y: b.fly ? 9999 : b.y, f: () => drawBird(b, camX, camY) }));
  ents.push({
    y: P.y,
    f: () => {
      if (digT <= 0 && drawHeroDet(P.x + OFF.x - camX, P.y + OFF.y - camY, sig)) return;
      if (P.dir === "up") digT > 0 ? drawShovel(camX, camY) : drawDetector(camX, camY, sig);
      drawPlayer(P.x + OFF.x - camX, P.y + OFF.y - camY);
      if (P.dir !== "up") digT > 0 ? drawShovel(camX, camY) : drawDetector(camX, camY, sig);
    }
  });
  sletEnts(ents, camX, camY);
  ents.sort((a, b) => a.y - b.y).forEach(e => e.f());
  if (worldKind === "swamp") {
    ctx.globalAlpha = 0.09;
    for (const c of clouds) {
      disc(ctx, c.x - camX, c.y - camY + 40, Math.round(c.rx * 1.4), Math.round(c.ry * 1.2), "#e6ecd8");
      disc(ctx, WW - c.x - camX, c.y - camY + 260, Math.round(c.rx * 1.1), c.ry, "#e6ecd8");
    }
    ctx.globalAlpha = 1;
  }
  for (const p of parts) rect(ctx, p.x - camX, p.y + p.z - camY, 1, 1, p.col);
  {
    const w = T && T.wx,
      tt = performance.now() / 1000;
    if (w === "rain") {
      ctx.fillStyle = "rgba(200,215,230,.55)";
      for (let k = 0; k < 70; k++) {
        const x = (k * 53 + tt * 40) % VW,
          y = (k * 97 + tt * 260) % VH;
        ctx.fillRect(x | 0, y | 0, 1, 4);
      }
    } else if (w === "fog") {
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "#e8ece6";
      ctx.fillRect(0, 0, VW, VH);
      ctx.globalAlpha = 1;
    } else if (T && T.season === "winter") {
      ctx.fillStyle = "rgba(255,255,255,.85)";
      for (let k = 0; k < 45; k++) {
        const x = (((k * 71 + Math.sin(tt + k) * 6 + tt * 8) % VW) + VW) % VW,
          y = (k * 113 + tt * 22) % VH;
        ctx.fillRect(x | 0, y | 0, 1, 1);
      }
    } else if (w === "heat") {
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = "#f8d070";
      ctx.fillRect(0, 0, VW, VH);
      ctx.globalAlpha = 1;
    }
  }
  drawNight(camX, camY);
  // глубины рядом с игроком
  holes.forEach((h, k) => {
    if (T.slet && T.slet.rh && T.slet.rh[k]) return; // ямы соперников без подписи
    const [tx, ty] = k.split(",").map(Number),
      x = tx * TS + 8 - camX,
      y = ty * TS + 15 - camY;
    if (x > -20 && x < VW + 20 && y > -10 && y < VH + 10) label(h + " см", x, y);
  });
  updateLcd(sig);
  syncButtons();
  updateSound(sig);
}
