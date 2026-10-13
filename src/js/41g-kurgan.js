// ================= КУРГАН (15-й уровень) =================
// Степной курган: насыпь, каменная баба, грабительские ямы. Всё лежит глубоко, в центре — погребение и моральный выбор.
const KG = { x: ZONE.x, y: ZONE.y + 10, rx: 134, ry: 98 };
const KG_PITS = [
  [KG.x - 54, KG.y - 22],
  [KG.x + 50, KG.y + 34],
  [KG.x + 34, KG.y - 42]
];
const KG_IDOL = { x: KG.x - 30, y: KG.y - 38 };
const KG_SIGN = { x: KG.x - 170, y: KG.y + 86 };
const kgIn = (x, y, m = 0) => ((x - KG.x) / (KG.rx + m)) ** 2 + ((y - KG.y) / (KG.ry + m)) ** 2 < 1;
const KG_DEER = "Золотая бляха «Олень»";
const KURGAN_UNIQ = [
  [3, 4, "Акинак", 1, 0.6],
  [3, 4, "Бронзовое зеркало", 0, 0.4],
  [3, 4, "Псалий", 0, 0.1],
  [4, 4, "Гривна", 0, 0.3],
  [4, 4, KG_DEER, 0, 0.05],
  [2, 4, "Бронзовый колокольчик", 0, 0.05]
];
Object.assign(FIND_IMG, {
  Акинак: "@art(find-img/akinak.png)",
  "Бронзовое зеркало": "@art(find-img/bronzovoe-zerkalo.png)",
  Псалий: "@art(find-img/psalij.png)",
  Гривна: "@art(find-img/grivna.png)",
  [KG_DEER]: "@art(find-img/zolotaya-blyaha-olen.png)",
  "Бронзовый колокольчик": "@art(find-img/bronzovyj-kolokolchik.png)"
});
Object.assign(FIND_DESC, {
  Акинак:
    "Короткий железный меч скифов. Носили на правом бедре, в ножнах с золотой обкладкой — от неё остались только зелёные пятна.",
  "Бронзовое зеркало": "Скифское зеркало с ручкой-петлёй. Его клали в могилу женщинам — чтобы и там видеть себя.",
  Псалий: "Бронзовая деталь конской узды. Где псалий — там рядом хоронили и коня.",
  Гривна: "Шейный обруч, знак знатного воина. Концы загнуты в шарики — так носили две с половиной тысячи лет назад.",
  [KG_DEER]:
    "Золотая нашивка со щита: олень с подогнутыми ногами — «звериный стиль» скифов. В мире таких десятки, и почти все в Эрмитаже.",
  "Бронзовый колокольчик": "Колокольчик с конской сбруи. Звенел, когда всадник скакал по степи."
});
ALB.push(KURGAN_UNIQ.map(q => ({ c: q[0], era: q[1], name: q[2], kurgan: 1 })));
ALB_ROW.push("Из кургана");
MAP_ART[9] = "@art(map-art/9.png)";
TRAIL_INK.kurgan = [150, 128, 84];
GROUND.kurgan = "#98a050";
PLACES[9] = {
  id: 9,
  reg: 2,
  name: "Курган",
  price: 0,
  desc: "Скифский курган в степи. Памятник археологии.",
  zoneR: 6,
  shownR: 7,
  offset: 0.5,
  probs: [0.06, 0.14, 0.24, 0.32, 0.24],
  eraW: [0, 0.04, 0.08, 0.3, 0.58],
  n: 28,
  need: g => perk("kurgan") && TRANSPORT[g.transport].region >= 2,
  needTxt: "Курган — в Области: нужен транспорт до области"
};
function kurganCard() {
  const P = PLACES[9],
    ok = P.need(G),
    deep = SHOVEL[G.shovel].depth >= 120,
    li = a => `<ul>${a.map(([ic, x]) => `<li>${NBI[ic]}<span>${x}</span></li>`).join("")}</ul>`;
  return `<div class="nbc place"><div class="nbc-pic"><img src="${MAP_ART[9]}" alt=""></div><div class="nbc-b"><span class="nbc-hand">IV в. до н. э.</span><h3>Курган</h3><p>Скифский курган в степи: насыпь, каменная баба на вершине и три старые грабительские ямы. ${G.kurganGrave ? "Погребение уже вскрыто — но насыпь ещё хранит вещи." : "В центре насыпи, глубоко, — нетронутое погребение."}</p>${li(
    [
      ["bars", "Находки: древность, глубоко в насыпи"],
      ["trees", "У грабительских ям пусто — их выбрали давно"],
      ["acc", "Памятник археологии: полиция +2 за поездку"],
      ["road", `Цены находок: ${multTxt(ECON.reg[REGIONS[P.reg].mult])}`]
    ]
  )}${ok ? `<button class="nb-btn" onclick="SK.go(9)">Ехать на курган</button>` : `<button class="nb-btn" disabled>${LOCK_SVG} Закрыто</button>`}${!ok ? `<p class="nb-warn">${P.needTxt}</p>` : !deep && !G.kurganGrave ? `<p class="nb-warn">Погребение на глубине около 120 см — нужен ручной бур</p>` : ""}</div></div>`;
}
function buildKurgan() {
  const g = bg.getContext("2d"),
    r = rng(91),
    img = g.createImageData(WW, WH),
    d = img.data;
  for (let y = 0; y < WH; y++) {
    const rx = roadX(y);
    for (let x = 0; x < WW; x++) {
      const n = Math.sin(x * 0.045 + 2) + Math.sin(y * 0.05 - x * 0.02) + Math.sin((x + y) * 0.03),
        q = r();
      let c;
      if (Math.abs(x - rx) < 9 + Math.sin(y * 0.2)) c = [178, 152, 106].map(v => v + (q < 0.3 ? -10 : 0));
      else {
        c = [152 + n * 5, 160 + n * 5, 80 + n * 3];
        const k = ((x - KG.x) / KG.rx) ** 2 + ((y - KG.y) / KG.ry) ** 2;
        if (k < 1) {
          const h = Math.sqrt(1 - k),
            sx = (x - KG.x) / KG.rx,
            sy = (y - KG.y) / KG.ry,
            sh = -(sx * 0.75 + sy * 0.9) * (1 - h * 0.5) * 58 + h * 16;
          c = [c[0] + sh + h * 8, c[1] + sh + h * 4, c[2] + sh * 0.6 - h * 6];
          if (Math.abs(((h * 5) % 1) - 0.5) < 0.035 && h < 0.95) c = c.map(v => v - 14); // уступы насыпи
        } else if (k < 1.12) c = c.map(v => v - 14 * (1.12 - k) * 8);
        if (q < 0.045) c = [196, 188, 118];
        else if (q < 0.06) c = [112, 122, 58];
      }
      const i = (y * WW + x) * 4;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  // ковыль: светлые метёлки
  for (let k = 0; k < 900; k++) {
    const x = r() * WW,
      y = r() * WH;
    if (Math.abs(x - roadX(y)) < 12) continue;
    g.fillStyle = r() < 0.5 ? "rgba(226,214,160,.7)" : "rgba(200,190,130,.6)";
    g.fillRect(x, y, 1, 3);
    g.fillRect(x + 1, y - 1, 1, 2);
  }
  // грабительские ямы
  KG_PITS.forEach(([x, y]) => {
    disc(g, x, y + 2, 15, 10, "#8e7a50");
    disc(g, x, y, 12, 8, "#5a4630");
    disc(g, x - 1, y + 1, 8, 5, "#3e3020");
  });
  // каменная баба
  {
    const { x, y } = KG_IDOL;
    disc(g, x + 3, y + 3, 8, 3, "rgba(40,40,20,.35)");
    rect(g, x - 4, y - 16, 9, 18, "#7a7a74");
    rect(g, x - 3, y - 16, 7, 17, "#9a9a92");
    disc(g, x, y - 19, 4, 4, "#9a9a92");
    rect(g, x - 2, y - 20, 1, 1, "#5a5a54");
    rect(g, x + 1, y - 20, 1, 1, "#5a5a54");
    rect(g, x - 3, y - 9, 7, 1, "#7a7a74"); // руки с чашей
    rect(g, x - 1, y - 8, 3, 2, "#b0b0a8");
    solids.push({ x: x - 5, y: y - 6, w: 10, h: 8 });
  }
  // табличка «Памятник археологии»
  {
    const { x, y } = KG_SIGN;
    rect(g, x, y - 14, 2, 16, "#6a4a2a");
    rect(g, x - 9, y - 22, 20, 10, "#f0ece0");
    rect(g, x - 9, y - 22, 20, 2, "#b03a2a");
    for (let k = 0; k < 3; k++) rect(g, x - 7, y - 18 + k * 2, 14 - k * 4, 1, "#6a6a6a");
    solids.push({ x: x - 3, y: y - 4, w: 8, h: 6 });
  }
  // кусты по краям степи
  for (let a = 0; a < 3000 && trees.length < 46; a++) {
    const x = 10 + r() * (WW - 20),
      y = 30 + r() * (WH - 40),
      edge = Math.min(x, WW - x, y, WH - y);
    if (edge > 70 && r() > 0.03) continue;
    if (kgIn(x, y, 30) || Math.abs(x - roadX(y)) < 22 || (y > WH - 90 && Math.abs(x - roadX(y)) < 70)) continue;
    if (trees.some(t => Math.hypot(t.x - x, t.y - y) < 26)) continue;
    const kind = r() < 0.7 ? 2 : r() < 0.5 ? 3 : 0;
    trees.push({ x: Math.round(x), y: Math.round(y), kind });
    solids.push({ x: x - 3, y: y - 4, w: 6, h: 4 });
    disc(g, x + 3, y, kind === 2 ? 9 : 12, 3, "rgba(40,50,18,.3)");
  }
  g.fillStyle = "rgba(40,40,10,.1)";
  for (let x = 0; x <= WW; x += TS) g.fillRect(x, 0, 1, WH);
  for (let y = 0; y <= WH; y += TS) g.fillRect(0, y, WW, 1);
}
// вещи кургана: насыпь прибавляет глубины, у грабительских ям пусто, в центре — погребение
function kurganItems(t, used, mult) {
  t.items.forEach(i => {
    if (!i.story && !i.leg && kgIn(i.x, i.y)) i.depth = Math.min(150, i.depth + 30);
  });
  t.items = t.items.filter(i => i.leg || i.story || !KG_PITS.some(([x, y]) => Math.hypot(i.x - x, i.y - y) < 28));
  const n = 2 + (R() < 0.4 ? 1 : 0);
  for (let k = 0; k < n; k++)
    for (let a = 0; a < 200; a++) {
      const x = KG.x + (R() - 0.5) * KG.rx * 1.6,
        y = KG.y + (R() - 0.5) * KG.ry * 1.6,
        tx = Math.floor(x / TS),
        ty = Math.floor(y / TS);
      if (!kgIn(x, y, -12) || used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
      if (KG_PITS.some(([px, py]) => Math.hypot(x - px, y - py) < 28)) continue;
      used.add(tx + "," + ty);
      const pool = KURGAN_UNIQ.filter(q => q[2] !== KG_DEER || R() < 0.1),
        q = pick(pool);
      t.items.push({
        tx,
        ty,
        x: tx * TS + 8,
        y: ty * TS + 8,
        c: q[0],
        era: q[1],
        name: q[2],
        iron: q[3],
        w: q[4],
        base: q[2] === KG_DEER ? 60000 : econBase(q[0], 4, mult),
        depth: 70 + Math.floor(R() * 55),
        found: false,
        kg: 1
      });
      break;
    }
  if (!G.kurganGrave) {
    const cx = Math.floor(KG.x / TS),
      cy = Math.floor(KG.y / TS);
    for (let rr = 0; rr < 3; rr++) {
      const c = [
        [0, 0],
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
        [1, 1]
      ]
        .map(([dx, dy]) => [cx + dx * rr, cy + dy * rr])
        .find(([tx, ty]) => !used.has(tx + "," + ty) && diggable(tx, ty));
      if (!c) continue;
      used.add(c[0] + "," + c[1]);
      t.items.push({
        tx: c[0],
        ty: c[1],
        x: c[0] * TS + 8,
        y: c[1] * TS + 8,
        c: 4,
        era: 4,
        name: "Погребальная камера",
        iron: false,
        w: 0.01,
        base: 0,
        depth: 120,
        found: false,
        grave: 1
      });
      break;
    }
  }
}
function kurganStart() {
  G.heat += 2;
  const first = !G.kgSeen;
  G.kgSeen = 1;
  save();
  toast(
    `${first ? "Курган — памятник археологии, у подножия табличка «Охраняется государством». Полиция +2 за поездку. Насыпь — это лишние полметра земли: всё лежит глубоко. У старых грабительских ям пусто. " : "Курган. Полиция +2. "}${G.kurganGrave ? "Погребение в центре уже вскрыто — ищите вещи в насыпи." : "В самом центре, на глубине около 120 см, — погребальная камера. Детектор её почти не слышит: идите к кресту в центре кольца."}`
  );
}
function kurganGrave() {
  G.kurganGrave = 1;
  T.event = "kurgan";
  setTimeout(showEvent, 350);
}
function kgLoot(name, base) {
  const q = KURGAN_UNIQ.find(x => x[2] === name),
    it = {
      tid: T.id,
      name,
      c: q[0],
      era: 4,
      iron: q[3],
      w: q[4],
      base: base || econBase(q[0], 4, REGIONS[T.region].mult),
      cond: 0.9,
      depth: 120,
      clean: false
    };
  dexAdd(name);
  G.inv.push(it);
  T.found++;
  return it;
}
EVENTS.kurgan = {
  title: "Погребение",
  text: () =>
    "Лопата проваливается в пустоту. Под бревенчатым накатом — кости, истлевший щит и тусклый блеск золота: олень с подогнутыми ногами, гривна, короткий меч. Это нетронутое скифское погребение. Такое бывает раз в жизни. И это чья-то могила.",
  opts: [
    {
      id: "all",
      label: () => "Забрать всё",
      sub: () => "золотой олень, гривна и акинак · совесть −15 · полиция +3",
      run: () => {
        kgLoot(KG_DEER, 60000);
        kgLoot("Гривна");
        kgLoot("Акинак");
        G.rep -= 15;
        G.heat += 3;
        return "Вы выгребли всё, что блестело, и засыпали яму. Руки дрожат до самой машины. Совесть −15, полиция +3.";
      }
    },
    {
      id: "one",
      label: () => "Взять только оленя и засыпать",
      sub: () => "золотой олень · совесть −5 · полиция +1",
      run: () => {
        kgLoot(KG_DEER, 60000);
        G.rep -= 5;
        G.heat += 1;
        return "Одну бляху — в карман, остальное вы засыпали землёй. Совесть −5, полиция +1.";
      }
    },
    {
      id: "report",
      label: () => "Засыпать и позвонить археологам",
      sub: () => "премия музея 20 000 ₽ · совесть +15 · полиция −1 · олень в альбоме",
      run: () => {
        G.money += 20000;
        G.rep += 15;
        G.heat = Math.max(0, G.heat - 1);
        G.kurganReported = 1;
        dexAdd(KG_DEER);
        return "Через неделю приехала экспедиция. В отчёте написали: «Погребение обнаружено местным краеведом». Музей выплатил премию 20 000 ₽, а фото золотого оленя вклеено в ваш альбом. Совесть +15.";
      }
    }
  ]
};
