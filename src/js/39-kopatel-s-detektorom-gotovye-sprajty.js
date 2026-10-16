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
// ===== ОДЕЖДА: слои поверх листа копателя (штаны, верх, рюкзак, шапка). Новая вещь — строка в WEAR и свой слой =====
// Слои и иконки рисует tools/sprites/wear_more.py и wear_icons.py.
// Как открывается: l — уровень; ok() — условие (проверяется в гараже); flea — только лотом на барахолке.
// how — подсказка в гардеробе, pr() — прогресс [сейчас, нужно], fx — что даёт.
const WEAR_SLOTS = [
  ["hat", "Шапка"],
  ["jacket", "Верх"],
  ["pants", "Штаны"],
  ["pack", "Рюкзак"]
];
const wst = k => (G.wst && G.wst[k]) || 0;
const empireHalf = () => {
  if (typeof ALB === "undefined" || !ALB[2]) return [0, 1];
  dexSync();
  const a = ALB[2];
  return [a.filter(x => G.dex[x.name]).length, Math.ceil(a.length / 2)];
};
const WEAR = {
  hat: [
    { id: "cap", n: "Кепка", l: 1, ic: "@art(ui/cap.png)" },
    { id: "ushanka", n: "Ушанка", l: 3, auto: 1, ic: "@art(ui/ushanka.png)", ov: "@art(hero-det/ov-ushanka.png)" },
    {
      id: "helmet",
      n: "Каска СШ-40",
      ok: () => G.inv.some(i => i.name === "Каска СШ-40" && i.clean && i.gr >= 3),
      how: "Найти каску СШ-40, почистить до «очень хорошей» сохранности и привезти домой",
      ic: "@art(ui/w-helmet.png)",
      ov: "@art(hero-det/ov-helmet.png)"
    },
    {
      id: "panama",
      n: "Панама-«афганка»",
      ok: () => (G.sletWins || 0) > 0,
      how: "Выиграть слёт копателей",
      ic: "@art(ui/w-panama.png)",
      ov: "@art(hero-det/ov-panama.png)"
    },
    {
      id: "petushok",
      n: "Шапка-«петушок»",
      flea: 1,
      how: "Иногда лежит в лоте на барахолке",
      ic: "@art(ui/w-petushok.png)",
      ov: "@art(hero-det/ov-petushok.png)"
    },
    {
      id: "bandana",
      n: "Бандана с черепом",
      ok: () => wst("blk") >= 5,
      pr: () => [wst("blk"), 5],
      how: "Продать 5 вещей на чёрном рынке",
      fx: "Чёрный рынок платит на 5% больше, но полиция после поездки не остывает",
      ic: "@art(ui/w-bandana.png)",
      ov: "@art(hero-det/ov-bandana.png)"
    },
    {
      id: "forester",
      n: "Фуражка лесника",
      ok: () => G.rep >= 40,
      pr: () => [Math.max(0, G.rep), 40],
      how: "Звание «Хранитель памяти»: совесть +40",
      fx: "На посту ДПС уважают: договориться вдвое дешевле",
      ic: "@art(ui/w-forester.png)",
      ov: "@art(hero-det/ov-forester.png)"
    },
    {
      id: "headlamp",
      n: "Шапка с фонарём",
      ok: () => own("lamp"),
      how: "Купить налобный фонарь в магазине",
      fx: "В ночную смену светит дальше — туда, куда смотрит Серый",
      ic: "@art(ui/w-headlamp.png)",
      ov: "@art(hero-det/ov-headlamp.png)"
    }
  ],
  jacket: [
    { id: "green", n: "Зелёная куртка", l: 1, ic: "@art(ui/jacket.png)" },
    { id: "gorka", n: "Розовая «горка»", l: 9, auto: 1, ic: "@art(ui/gorka.png)", ov: "@art(hero-det/ov-gorka.png)" },
    {
      id: "vest",
      n: "Жилет рыболова",
      l: 6,
      ic: "@art(ui/w-vest.png)",
      ov: "@art(hero-det/ov-vest.png)"
    },
    {
      id: "vatnik",
      n: "Телогрейка",
      ok: () => wst("winter") > 0,
      how: "Съездить в поле зимой",
      fx: "Зимой день в поле на 30 минут длиннее",
      ic: "@art(ui/w-vatnik.png)",
      ov: "@art(hero-det/ov-vatnik.png)"
    },
    {
      id: "telnyashka",
      n: "Тельняшка",
      ok: () => wst("flood") > 0,
      how: "Съездить к затопленной деревне",
      ic: "@art(ui/w-telnyashka.png)",
      ov: "@art(hero-det/ov-telnyashka.png)"
    },
    {
      id: "ozk",
      n: "Плащ ОЗК",
      ok: () => wst("rain") >= 6,
      pr: () => [wst("rain"), 6],
      how: "Шесть поездок в дождь",
      ic: "@art(ui/w-ozk.png)",
      ov: "@art(hero-det/ov-ozk.png)"
    },
    {
      id: "olimpiyka",
      n: "Олимпийка",
      flea: 1,
      how: "Иногда лежит в лоте на барахолке",
      ic: "@art(ui/w-olimpiyka.png)",
      ov: "@art(hero-det/ov-olimpiyka.png)"
    },
    {
      id: "deer",
      n: "Свитер с оленями",
      ok: () => !!(G.story && G.story.clues && G.story.clues.includes("nyura")),
      how: "Подарок бабы Нюры — в истории деда",
      fx: "Бабушки у поля добрее: за возвращённое кольцо — ещё 300 ₽",
      ic: "@art(ui/w-deer.png)",
      ov: "@art(hero-det/ov-deer.png)"
    },
    {
      id: "gimnast",
      n: "Гимнастёрка деда",
      ok: () => !!(G.story && G.story.end === "good"),
      how: "Финал «Вернулся» в истории деда",
      ic: "@art(ui/w-gimnast.png)",
      ov: "@art(hero-det/ov-gimnast.png)"
    }
  ],
  pants: [
    { id: "jeans", n: "Джинсы", l: 1, ic: "@art(ui/jeans.png)" },
    {
      id: "gorka",
      n: "Штаны «горка»",
      l: 9,
      auto: 1,
      ic: "@art(ui/gorka-pants.png)",
      ov: "@art(hero-det/ov-gorka-pants.png)"
    },
    { id: "flora", n: "Камуфляж «флора»", l: 12, ic: "@art(ui/w-flora.png)", ov: "@art(hero-det/ov-flora.png)" },
    {
      id: "treniki",
      n: "Треники с лампасами",
      flea: 1,
      how: "Иногда лежат в лоте на барахолке",
      ic: "@art(ui/w-treniki.png)",
      ov: "@art(hero-det/ov-treniki.png)"
    },
    {
      id: "zabrody",
      n: "Болотные заброды",
      ok: () => wst("swamp") >= 10,
      pr: () => [wst("swamp"), 10],
      how: "Найти 10 вещей на болоте",
      fx: "На болоте день на 30 минут длиннее: ноги сухие",
      ic: "@art(ui/w-zabrody.png)",
      ov: "@art(hero-det/ov-zabrody.png)"
    },
    {
      id: "shorts",
      n: "Шорты",
      ok: () => wst("summer") >= 8,
      pr: () => [wst("summer"), 8],
      how: "Восемь поездок летом",
      ic: "@art(ui/w-shorts.png)",
      ov: "@art(hero-det/ov-shorts.png)"
    },
    {
      id: "galife",
      n: "Галифе и сапоги",
      ok: () => {
        const [a, b] = empireHalf();
        return a >= b;
      },
      pr: empireHalf,
      how: "Собрать в альбоме половину слоя империи",
      ic: "@art(ui/w-galife.png)",
      ov: "@art(hero-det/ov-galife.png)"
    }
  ],
  pack: [
    { id: "pack", n: "Рюкзак", l: 1, ic: "@art(ui/w-pack.png)" },
    {
      id: "meshok",
      n: "Вещмешок",
      ok: () => G.transport >= 2,
      how: "Купить велосипед с багажником",
      ic: "@art(ui/w-meshok.png)",
      ov: "@art(hero-det/ov-meshok.png)"
    },
    {
      id: "ermak",
      n: "Рюкзак «Ермак»",
      ok: () => G.transport >= 4,
      how: "Купить «Москвич» с прицепом",
      ic: "@art(ui/w-ermak.png)",
      ov: "@art(hero-det/ov-ermak.png)"
    },
    {
      id: "baul",
      n: "Клетчатый баул",
      flea: 1,
      how: "Иногда лежит в лоте на барахолке",
      ic: "@art(ui/w-baul.png)",
      ov: "@art(hero-det/ov-baul.png)"
    }
  ]
};
// комплекты: три вещи вместе дают прибавку
const WEAR_SETS = [
  {
    id: "rek",
    n: "Поисковик-реконструктор",
    w: { hat: "helmet", jacket: "gimnast", pants: "galife" },
    fx: "Дар музею — совесть +1 сверху",
    say: "Савельич: «Хоть сейчас в строй. Только каску не снимай»."
  },
  {
    id: "d90",
    n: "Лихие девяностые",
    w: { hat: "petushok", jacket: "olimpiyka", pants: "treniki" },
    fx: "Скупщик платит на 10% больше",
    say: "Скупщик: «О, свой человек. Для своих — по-братски»."
  },
  {
    id: "ryb",
    n: "Рыбак",
    w: { hat: "panama", jacket: "vest", pants: "zabrody" },
    fx: "Магнит закидывается вдвое быстрее",
    say: "На берегу кивают: «Клюёт?» — «Железо клюёт»."
  }
];
Object.values(WEAR).forEach(a =>
  a.forEach(w => {
    if (!w.ov) return;
    const im = new Image();
    im.src = w.ov;
    w.img = im;
  })
);
const wearKey = (s, w) => s + ":" + w.id;
const wearOpen = (s, w) =>
  (G.wearGot || []).includes(wearKey(s, w)) || (w.l && (G.lvl || 1) >= w.l) || (!!w.ok && !w.flea && w.ok());
// новая вещь: ушанка и «горка» надеваются сами (так обещает «Путь копателя»), остальное — по кнопке в окне «Обновка»
function wearSync() {
  G.wear = G.wear || {};
  G.wearSeen = G.wearSeen || [];
  G.wearGot = G.wearGot || [];
  G.wearNew = G.wearNew || [];
  WEAR_SLOTS.forEach(([s]) =>
    WEAR[s].forEach(w => {
      const k = wearKey(s, w);
      if (G.wearSeen.includes(k) || !wearOpen(s, w)) return;
      G.wearSeen.push(k);
      if (!G.wearGot.includes(k)) G.wearGot.push(k);
      if (w.auto) G.wear[s] = w.id;
      if (w.l !== 1) G.wearNew.push(k);
    })
  );
}
// барахолка: одежда, которой ещё нет, иногда лежит в купленном лоте
function wearFlea() {
  wearSync();
  const left = [];
  WEAR_SLOTS.forEach(([s]) => WEAR[s].forEach(w => w.flea && !G.wearSeen.includes(wearKey(s, w)) && left.push([s, w])));
  if (!left.length || Math.random() > 0.35) return null;
  const [s, w] = left[Math.floor(Math.random() * left.length)];
  G.wearGot.push(wearKey(s, w));
  wearSync();
  return w;
}
const wearOn = s => WEAR[s].find(w => w.id === (G.wear && G.wear[s])) || WEAR[s][0];
const wearIs = (s, id) => wearOn(s).id === id;
const setOn = id => {
  const S = WEAR_SETS.find(x => x.id === id);
  return !!S && Object.entries(S.w).every(([s, v]) => wearIs(s, v));
};
const heroCache = {};
let wearLvl = -1;
const WEAR_ORDER = ["pants", "jacket", "pack", "hat"];
// лист копателя с надетыми слоями; ws — что надето (по умолчанию — текущее)
function heroImg(d, ws) {
  if (wearLvl !== G.lvl) {
    wearLvl = G.lvl;
    wearSync();
  }
  const base = HERO_DET[d];
  if (!base || !base.complete || !base.naturalWidth) return base;
  const lay = WEAR_ORDER.map(s => (ws && ws[s] ? WEAR[s].find(w => w.id === ws[s]) || wearOn(s) : wearOn(s))).filter(
    w => w.img
  );
  if (!lay.length) return base;
  if (lay.some(w => !w.img.complete || !w.img.naturalWidth)) return base;
  const key = d + ":" + lay.map(w => w.ov).join(",");
  if (!heroCache[key]) {
    const c = document.createElement("canvas");
    c.width = base.naturalWidth;
    c.height = base.naturalHeight;
    const g = c.getContext("2d");
    g.drawImage(base, 0, 0);
    lay.forEach(w => g.drawImage(w.img, 0, 0));
    heroCache[key] = c;
  }
  return heroCache[key];
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
  if (!im || im.complete === false || im.naturalWidth === 0) return false;
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
  const camX = WW <= VW ? Math.floor((WW - VW) / 2) : Math.max(0, Math.min(WW - VW, Math.round(P.x - VW / 2)));
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
      ctx.fillRect(Math.round(Z.x + Math.cos(a) * Z.r - camX), Math.round(Z.y + Math.sin(a) * Z.r - camY), 1, 1);
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
        k = Math.min((VW / 2 - 13) / Math.max(1e-3, Math.abs(dx)), (bot - top) / 2 / Math.max(1e-3, Math.abs(dy)));
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
