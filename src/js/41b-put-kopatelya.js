// ================= ПУТЬ КОПАТЕЛЯ: награды за уровни =================
// Каждый уровень открывает конкретную вещь. «soon» — появится в следующем обновлении.
const TRACK = [
  { l: 2, id: "book", n: "Записная книжка", d: "В альбоме вместо «?» видны силуэты ещё не найденных вещей" },
  {
    l: 3,
    id: "thermos",
    n: "Термос и ушанка",
    d: "День в поле на час длиннее, а Серый — в ушанке",
    ic: "@art(ui/ushanka.png)"
  },
  { l: 4, id: "ant", n: "Антиквар", d: "Новый покупатель: платит больше скупщика за то, что ищет" },
  { l: 5, id: "eye", n: "Наметанный глаз", d: "На поле видна осевшая земля — под ней старый тайник" },
  {
    l: 6,
    id: "magnet",
    n: "Поисковый магнит и жилет",
    d: "У воды: закинуть магнит и вытянуть со дна железо, которое детектор не берёт. В гардеробе — жилет рыболова",
    ic: "@art(ui/w-vest.png)"
  },
  { l: 7, id: "flea", n: "Барахолка", d: "Лоты вслепую и старые письма с наводками на новые места" },
  {
    l: 8,
    id: "archive",
    n: "Знакомый в архиве",
    d: "«Архивная карта» без требования совести и на 30% дешевле"
  },
  {
    l: 9,
    id: "night",
    n: "Ночная смена и «горка»",
    d: "Можно остаться в поле на ночь: светящиеся находки и клады-огоньки, полиция +1. Серый — в розовом костюме «горка»",
    ic: "@art(ui/gorka.png)"
  },
  {
    l: 10,
    id: "orders",
    n: "Заказы коллекционеров",
    d: "Иногда коллекционер ищет конкретную вещь и платит вдвое"
  },
  { l: 11, id: "house", n: "Дом под снос", d: "Новое место: подпол, чердак, печь — ищете руками" },
  {
    l: 12,
    id: "slet",
    n: "Слёт копателей",
    d: "Раз в сезон — соревнование на общем поле. В гардеробе — камуфляж «флора», а победителю — панама",
    ic: "@art(ui/w-flora.png)"
  },
  { l: 13, id: "forum", n: "Имя на форуме", d: "Скупщик платит на 10% больше, слухи приходят чаще" },
  { l: 15, id: "kurgan", n: "Курган", d: "Новое особое место: скифский курган в степи и погребение в центре" }
];
function perk(id) {
  const t = TRACK.find(x => x.id === id);
  return !!t && !t.soon && G.lvl >= t.l;
}
function lvlUpTxt() {
  const t = TRACK.find(x => x.l === G.lvl);
  return `<br><b>Новый уровень ${G.lvl}! Очко навыка ждёт дома.${t ? ` Открыто: ${t.n}${t.soon ? " (скоро)" : ""}.` : ""}</b>`;
}
function trackBox() {
  const nx = TRACK.find(t => t.l > G.lvl);
  const li = t => {
    const st = G.lvl >= t.l ? (t.soon ? "soon" : "done") : t === nx ? "next" : "lock";
    return `<li class="${st}"><span class="tr-l">${t.l}</span><div><b>${t.n}</b><small>${t.d}</small></div><span class="tr-s">${st === "done" ? pxi("check", 20) : st === "soon" ? `<em class="tr-soon">скоро</em>` : st === "next" ? `<em class="tr-next">Следующая</em>` : pxi("lock", 16)}</span></li>`;
  };
  // пройденное сворачиваем: видны два последних шага, следующая награда и что дальше
  const past = TRACK.filter(t => G.lvl >= t.l),
    hide = past.slice(0, Math.max(0, past.length - 2)),
    rest = TRACK.filter(t => !hide.includes(t));
  return `<section class="track">${hide.length ? `<details class="tr-past"><summary>${pxi("check", 16)}Пройдено ${hide.length} ${plural(hide.length, "шаг", "шага", "шагов")}</summary><ol>${hide.map(li).join("")}</ol></details>` : ""}<ol>${rest.map(li).join("")}</ol></section>`;
}

// ===== НОЧНЫЕ НАХОДКИ: только в ночную смену =====
const NIGHT = [
  [3, 1, "Светящийся опознавательный знак", 0, 0.02],
  [3, 1, "Компас Адрианова", 0, 0.06],
  [1, 1, "Часы «Кировские»", 0, 0.04],
  [3, 1, "Фосфорная мушка", 1, 0.01],
  [4, 1, "Циферблат авиаприбора", 0, 0.15],
  [4, 3, "Купальский клад", 0, 2]
];
Object.assign(FIND_IMG, {
  "Светящийся опознавательный знак": "@art(find-img/svetyaschijsya-opoznavatelnyj-znak.png)",
  "Компас Адрианова": "@art(find-img/kompas-adrianova.png)",
  "Часы «Кировские»": "@art(find-img/chasy-kirovskie.png)",
  "Фосфорная мушка": "@art(find-img/fosfornaya-mushka.png)",
  "Циферблат авиаприбора": "@art(find-img/ciferblat-aviapribora.png)",
  "Купальский клад": "@art(find-img/kupalskij-klad.png)"
});
Object.assign(FIND_DESC, {
  "Светящийся опознавательный знак":
    "Круглая бляшка с фосфором: немецкие солдаты носили её на спине, чтобы не потерять друг друга в темноте.",
  "Компас Адрианова": "Красноармейский компас со светящимися метками — по ним шли ночью без фонаря.",
  "Часы «Кировские»": "Наручные часы со светящимися стрелками. Остановились в 4:12 — может, на рассвете боя.",
  "Фосфорная мушка": "Мушка от винтовочного прицела с каплей светящейся краски — для стрельбы в сумерках.",
  "Циферблат авиаприбора": "Светящийся циферблат высотомера с самолёта. Где-то над этим лесом его потерял лётчик.",
  "Купальский клад": "Горшок, который «горел» в ночь на Ивана Купалу. Внутри — серебро. Бабки не врали."
});
ALB.push(NIGHT.map(q => ({ c: q[0], era: q[1], name: q[2], night: 1 })));
ALB_ROW.push("Ночные находки");
function nightItem(q, tx, ty, extra) {
  const base = q[2] === "Купальский клад" ? 25000 : econBase(q[0], q[1], REGIONS[T.region].mult);
  return Object.assign(
    {
      tx,
      ty,
      x: tx * TS + 8,
      y: ty * TS + 8,
      c: q[0],
      era: q[1],
      name: q[2],
      iron: q[3],
      w: q[4],
      base,
      depth: 5 + Math.floor(Math.random() * 18),
      found: false
    },
    extra
  );
}
function freeTileNear(cx, cy, r0, r1) {
  for (let a = 0; a < 300; a++) {
    const an = Math.random() * 6.28,
      d = r0 + Math.random() * (r1 - r0),
      tx = Math.floor((cx + Math.cos(an) * d) / TS),
      ty = Math.floor((cy + Math.sin(an) * d) / TS);
    if (diggable(tx, ty) && !items.some(i => !i.found && i.tx === tx && i.ty === ty)) return { tx, ty };
  }
  return null;
}
function spawnNight() {
  const pool = NIGHT.filter(q => q[2] !== "Купальский клад" && (q[0] < 4 || Math.random() < 0.3));
  const n = 3 + Math.floor(Math.random() * 2);
  for (let k = 0; k < n; k++) {
    const p = freeTileNear(P.x, P.y, 3 * TS, 14 * TS);
    if (p) items.push(nightItem(pick(pool), p.tx, p.ty, { glow: 1 }));
  }
  let msg = "Стемнело. В траве кое-где теплятся зеленоватые огоньки — так светится фосфор.";
  if (worldKind === "swamp" || worldKind === "hillfort" || worldKind === "kurgan") {
    const z = T.real || { x: P.x, y: P.y, r: 8 * TS },
      p = freeTileNear(z.x, z.y, 0, z.r);
    if (p) {
      const m = makeItem(pickW([0, 0, 0.6, 0, 0.4]), [0, 0, 0.5, 0.5, 0], REGIONS[T.region].mult);
      m.depth = 25 + Math.floor(Math.random() * 20);
      items.push(Object.assign({ tx: p.tx, ty: p.ty, x: p.tx * TS + 8, y: p.ty * TS + 8, wisp: 1, cache: true }, m));
      msg += " Над болотом мелькнул блуждающий огонёк — говорят, так «горит» клад.";
    }
  }
  const yr = Math.floor(G.trips / 16);
  if (season().id === "summer" && G.kupalaY !== yr && Math.random() < 0.5) {
    const p = freeTileNear(P.x, P.y, 4 * TS, 12 * TS);
    if (p) {
      G.kupalaY = yr;
      items.push(
        nightItem(
          NIGHT.find(q => q[2] === "Купальский клад"),
          p.tx,
          p.ty,
          { glow: 2, depth: 30 }
        )
      );
      msg += " <b>Сегодня ночь на Ивана Купалу.</b> Где-то рядом над землёй дрожит красный огонёк.";
    }
  }
  toast(msg);
}
// ночь: темнота вокруг, свет фонаря у копателя, светящиеся вещи и огоньки
let nightCv = null;
function drawNight(camX, camY) {
  if (!T || !T.night) return;
  if (!nightCv) nightCv = document.createElement("canvas");
  if (nightCv.width !== VW || nightCv.height !== VH) {
    nightCv.width = VW;
    nightCv.height = VH;
  }
  const g = nightCv.getContext("2d"),
    px = P.x - camX,
    py = P.y - 6 - camY,
    lampHat = wearIs("hat", "headlamp"),
    R = (own("lamp") ? 70 : 52) + (lampHat ? 12 : 0);
  g.globalCompositeOperation = "source-over";
  g.clearRect(0, 0, VW, VH);
  g.fillStyle = "rgba(6,10,28,.8)";
  g.fillRect(0, 0, VW, VH);
  g.globalCompositeOperation = "destination-out";
  const gr = g.createRadialGradient(px, py, R * 0.35, px, py, R);
  gr.addColorStop(0, "rgba(0,0,0,1)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(px, py, R, 0, 7);
  g.fill();
  if (lampHat) {
    // луч фонаря на лбу — вперёд, куда смотрит Серый
    const d = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[P.dir] || [0, 1],
      bx = px + d[0] * R * 0.75,
      by = py + d[1] * R * 0.75,
      gb = g.createRadialGradient(bx, by, 4, bx, by, R * 0.6);
    gb.addColorStop(0, "rgba(0,0,0,1)");
    gb.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gb;
    g.beginPath();
    g.arc(bx, by, R * 0.6, 0, 7);
    g.fill();
  }
  ctx.drawImage(nightCv, 0, 0);
  const t = performance.now() / 1000;
  for (const it of items) {
    if (it.found) continue;
    const x = it.x - camX,
      y = it.y - camY;
    if (x < -10 || y < -10 || x > VW + 10 || y > VH + 10) continue;
    if (it.glow) {
      const a = 0.55 + 0.45 * Math.sin(t * 2.2 + it.x),
        col = it.glow === 2 ? "255,120,60" : "120,240,150";
      ctx.fillStyle = `rgba(${col},${(a * 0.25).toFixed(2)})`;
      ctx.fillRect(x - 3, y - 3, 7, 7);
      ctx.fillStyle = `rgba(${col},${a.toFixed(2)})`;
      ctx.fillRect(x - 1, y - 1, 3, 3);
    } else if (it.wisp && !it.wispGone) {
      if (Math.hypot(it.x - P.x, it.y - P.y) < 26) {
        it.wispGone = 1;
        toast("Огонёк погас прямо над землёй. Значит, здесь.");
        continue;
      }
      const yy = y - 10 + Math.sin(t * 1.7 + it.y) * 3,
        a = 0.6 + 0.4 * Math.sin(t * 3 + it.x);
      ctx.fillStyle = `rgba(170,210,255,${(a * 0.25).toFixed(2)})`;
      ctx.fillRect(x - 4, yy - 4, 9, 9);
      ctx.fillStyle = `rgba(220,240,255,${a.toFixed(2)})`;
      ctx.fillRect(x - 1, yy - 1, 3, 3);
    }
  }
}
// наметанный глаз: осевшая земля над старой ямой
function eyeSpots(t, used, mult) {
  if (!perk("eye")) return;
  const n = (R() < 0.6 ? 1 : 0) + (t.region === 3 && R() < 0.5 ? 1 : 0);
  for (let k = 0; k < n; k++)
    for (let a = 0; a < 200; a++) {
      const inZ = t.real && R() < 0.5,
        x = inZ ? t.real.x + (R() - 0.5) * t.real.r * 1.6 : 24 + R() * (WW - 48),
        y = inZ ? t.real.y + (R() - 0.5) * t.real.r * 1.6 : 96 + R() * (WH - 120),
        tx = Math.floor(x / TS),
        ty = Math.floor(y / TS);
      if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
      used.add(tx + "," + ty);
      const m = makeItem(pickW([0, 0, 0.35, 0.45, 0.2]), [0.1, 0.4, 0.35, 0.15, 0], mult);
      m.depth = 20 + Math.floor(R() * 25);
      t.items.push(Object.assign({ tx, ty, x: tx * TS + 8, y: ty * TS + 8, sunk: 1, cache: true }, m));
      break;
    }
}
function drawSunk(camX, camY) {
  for (const it of items) {
    if (!it.sunk || it.found || holes.has(it.tx + "," + it.ty)) continue;
    const x = it.tx * TS + 8 - camX,
      y = it.ty * TS + 9 - camY;
    if (x < -12 || y < -12 || x > VW + 12 || y > VH + 12) continue;
    disc(ctx, x, y, 9, 5, "rgba(50,34,18,.16)");
    disc(ctx, x, y, 6, 3, "rgba(50,34,18,.14)");
  }
}
// заказы коллекционеров
const orderPrice = it => sellPrice(it, { id: "ord", mult: 2 });
function orderTick() {
  if (G.order) {
    G.order.left--;
    if (G.order.left <= 0) {
      const n = G.order.name;
      G.order = null;
      return `<br>Коллекционер нашёл «${n}» у другого копателя — заказ закрыт.`;
    }
    return "";
  }
  if (!perk("orders") || Math.random() > 0.35) return "";
  const pool = ALB.slice(1, 4)
    .flat()
    .filter(x => x.c === 2 || x.c === 3);
  const x = pick(pool);
  G.order = { name: x.name, left: 6 };
  return `<br><b>Заказ коллекционера:</b> ищет «${x.name}» — заплатит вдвое против антиквара. Срок — 6 поездок.`;
}
function sellOrder(i) {
  const it = G.inv[i];
  if (!it || !G.order || it.name !== G.order.name || !it.clean) return;
  const p = orderPrice(it);
  G.money += p;
  G.inv.splice(i, 1);
  G.order = null;
  openFind = null;
  SFX.cash();
  msg(`Коллекционер забрал «${it.name}» и заплатил ${rub(p)}. Обещал писать ещё.`);
  save();
  renderBase();
}
