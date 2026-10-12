// ================= СОСТОЯНИЕ ИГРЫ =================
const KEY = "seryi-kopatel-pole-v1";
function fresh() {
  return {
    money: 5000,
    shovel: 1,
    det: 1,
    transport: 1,
    rep: 0,
    heat: 0,
    inv: [],
    trips: 0,
    trip: null,
    xp: 0,
    lvl: 1,
    sp: 0,
    skills: { torg: 0, karto: 0, master: 0, svyazi: 0 },
    region: 1,
    maps: {},
    seenIntro: false,
    story: { st: 0, clues: [] },
    msg: "Стартовый капитал — 5 000 ₽. Купите карту или езжайте наугад — это бесплатно.",
    msgBad: false
  };
}
let G;
try {
  const L = JSON.parse(localStorage.getItem(KEY));
  G = Object.assign(fresh(), L || {});
  G.skills = Object.assign(fresh().skills, (L && L.skills) || {});
  if (!G.maps || typeof G.maps !== "object") G.maps = {};
} catch (e) {
  G = fresh();
}
let T = null,
  items = [],
  holes = new Map();
function save() {
  if (T) {
    T.holes = Object.fromEntries(holes);
    T.px = P.x;
    T.py = P.y;
    T.dir = P.dir;
  }
  G.trip = T;
  try {
    localStorage.setItem(KEY, JSON.stringify(G));
  } catch (e) {}
}
const $ = id => document.getElementById(id);
const rub = n => Math.round(n).toLocaleString("ru-RU") + " ₽";
const rnd = (a, b) => a + Math.random() * (b - a);
const kg = n => n.toFixed(1).replace(".", ",");
const sk = id => G.skills[id] || 0;
const bagCap = () => TRANSPORT[G.transport].cap;
const shovelMax = () => SHOVEL[G.shovel].depth - (isWinter() ? 10 : 0);
const mapPrice = (m, r) =>
  Math.round(
    (m.price *
      Math.pow(MAP_GROWTH, r - 1) *
      (m.id === 3 && G.rep >= 40 ? 0.5 : 1) *
      (m.id === 3 && (G.arch || 0) >= 3 ? 0.7 : 1) *
      (G.rumor ? 0.7 : 1)) /
      10
  ) * 10;
const rank = () => RANKS.find(r => G.rep >= r.min);
const giftRep = it => (it.c ? Math.max(1, Math.round(GIFT_BASE[it.c] * ERAS[it.era || 0].rm)) : 0);
const blackRep = it => -Math.max(1, Math.ceil(giftRep(it) / 3));
const ANT_CLS = [2, 3, 4],
  ANT_MINCOND = 0.7,
  ANT_LIMIT = 3,
  RUMOR_CHANCE = 0.25;
const ANT_WISHES = [
  { c: 2, e: 1, t: "монеты военных лет" },
  { c: 2, e: 2, t: "монеты империи" },
  { c: 2, e: 3, t: "старинные монеты" },
  { c: 2, e: 4, t: "древние монеты" },
  { c: 4, e: 4, t: "древние украшения" },
  { c: 2, e: -1, t: "любые монеты" },
  { c: 3, e: -1, t: "военное" },
  { c: 3, e: 1, t: "военное 1941–45" },
  { c: 3, e: 2, t: "военное царской армии" },
  { c: 4, e: -1, t: "редкие вещи" }
];
function rollAnt() {
  const a = [...ANT_WISHES];
  G.antWant = [];
  while (G.antWant.length < 2) {
    const k = Math.floor(Math.random() * a.length);
    G.antWant.push(a.splice(k, 1)[0]);
  }
  G.antLeft = ANT_LIMIT;
}
const antWants = it => (G.antWant || []).some(w => w.c === it.c && (w.e < 0 || w.e === it.era));
const antDem = it => (antWants(it) ? 1.3 : 0.8);
function antWhy(it) {
  if (!ANT_CLS.includes(it.c)) return "Не его профиль: берёт только монеты, военное и редкое";
  if (it.gr != null ? it.gr < 2 : it.cond < ANT_MINCOND)
    return it.gr != null
      ? `Сохранность «${GRADES[it.gr].n.toLowerCase()}» — берёт от «хорошей»`
      : `Состояние ${Math.round(it.cond * 100)}% — ниже 70% не берёт`;
  if ((G.antLeft ?? ANT_LIMIT) <= 0) return "Больше не берёт — приходите после поездки";
  return "";
}
function sellPrice(it, ch) {
  const blk = ch.id === "blk" ? (G.rep <= -15 ? 1.4 : G.rep <= -5 ? 1.2 : 1) : 1;
  const m = grM(it),
    cond = ch.id === "ant" ? (it.gr != null ? m * (it.gr >= 3 ? 1.15 : 1) : m * m) : m,
    dem = ch.id === "ant" ? antDem(it) * (isWinter() ? 1.15 : 1) : 1;
  return Math.round(it.base * cond * ch.mult * blk * dem * (1 + sk("torg") * 0.02));
}
const museumPay = it => (G.rep >= 15 ? Math.round(sellPrice(it, CHANNELS[1]) * 0.25) : 0);
const GRADES = [
    { n: "Плохая", s: "Плох.", m: 0.3 },
    { n: "Удовлетворительная", s: "Удовл.", m: 0.7 },
    { n: "Хорошая", s: "Хор.", m: 1 },
    { n: "Очень хорошая", s: "Оч. хор.", m: 1.6 },
    { n: "Отличная", s: "Отл.", m: 2.5 },
    { n: "Редкая разновидность", s: "★", m: 5 }
  ],
  GR_W = [16, 30, 32, 14, 6, 2];
const rareM = it => (it.base < 2000 ? 5 : it.base <= 10000 ? 3 : 2); // редкая разновидность: чем дороже вещь, тем меньше прибавка
const grM = it => (it.leg ? 1 : it.gr != null ? (it.gr === 5 ? rareM(it) : GRADES[it.gr].m) : it.cond); // множитель цены: сохранность после чистки (старые сохранения — по проценту состояния)
const grTxt = it =>
  it.leg
    ? "легенда"
    : it.gr != null
      ? GRADES[it.gr].n.toLowerCase()
      : `состояние ${Math.round(it.cond * 100)}%`;
const shownName = it => (it.story ? dirtyName(it) : it.name); // в поле сразу видно, что за вещь; сюжетные — загадка до чистки
const rangeCh = () => (CHANNELS[1].open() ? CHANNELS[1] : CHANNELS[0]);
const priceRange = it => {
  const k = rangeCh().mult * (1 + sk("torg") * 0.02);
  return [
    Math.max(5, Math.round((it.base * GRADES[0].m * k) / 5) * 5),
    Math.round((it.base * GRADES[4].m * k) / 10) * 10
  ];
};
const dirtyPrice = it => Math.max(10, Math.round((it.base * Math.min(1, it.cond + 0.1) * 0.35) / 10) * 10);
function rollGrade(it, self, rm, careful) {
  let g = pickW(GR_W.map(x => x / 100)),
    note = "";
  const pd = Math.max(0, Math.min(0.75, (0.9 - it.cond) * 1.4)); // задели лопатой — сохранность хуже
  if (g < 5 && R() < pd) g = Math.max(0, g - 1);
  if (self && !it.story) {
    const risk =
      (own("bath")
        ? 0
        : Math.max(0, 35 - sk("master") * 3 - (own("bench") ? 10 : 0) + (it.wet ? 10 : 0)) / 100) *
      (rm == null ? 1 : rm);
    if (Math.random() < risk && g > 0) {
      g--;
      note = "Перестарались с чисткой — сохранность упала на ступень.";
    } else if (
      g < 4 &&
      Math.random() <
        sk("master") * 0.04 + (own("bench") ? 0.05 : 0) + (own("bath") ? 0.05 : 0) + (careful ? 0.06 : 0)
    )
      g++;
  }
  if (!self && g === 5) {
    g = 4;
    note = "";
  } // мастер чистит на потоке и брак штампа не замечает: редкую разновидность видно только своими руками
  if (it.story) g = Math.max(2, Math.min(4, g));
  it.gr = g;
  return note;
}
function dirtyName(it) {
  if (it.story)
    return (
      {
        zheton: "Овальная пластинка",
        sumka: "Истлевший кожаный ком",
        kotelok: "Мятая посудина",
        flyaga: "Бутылка в истлевшем чехле",
        medal: "Чёрный цилиндрик"
      }[it.story] || "Странная вещь"
    );
  return it.c === 2 ? "Кружок, похоже на монету" : it.iron ? "Ржавая железка" : "Окисленная вещица";
}
function gainXp(n) {
  G.xp += n;
  let up = false;
  while (G.xp >= xpNeed(G.lvl)) {
    G.xp -= xpNeed(G.lvl);
    G.lvl++;
    G.sp++;
    up = true;
  }
  return up;
}
