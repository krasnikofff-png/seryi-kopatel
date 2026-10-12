// ================= ГАРАЖ: СНАРЯЖЕНИЕ =================
// короткие имена, подписи и параметры для экрана прокачки
const GSHORT = {
  det: [null, "Самодельный", "Бюджетный", "С дискриминацией", "Профессиональный", "Глубинный", "Георадар"],
  shovel: [
    null,
    "Сапёрная",
    "Штыковая",
    "С упором",
    "Профессиональная",
    "Археологическая",
    "Бур и щуп",
    "Мотобур"
  ],
  transport: [null, "Электричка", "Велосипед", "Мопед «Рига»", "«Москвич»", "«Нива»", "«Буханка»"]
};
const GSUB = {
  det: [
    null,
    "Сила сигнала · есть помехи",
    "Без помех",
    "Определяет тип металла",
    "Показывает глубину находки",
    "Поиск в глубоких слоях",
    "Тип металла и глубина"
  ],
  shovel: [
    null,
    "Короткая, на первые 30 см",
    "Длинный черенок",
    "Упор для ноги",
    "Зубцы режут корни",
    "Узкое лезвие для раскопа",
    "Бур и щуп для глубины",
    "Мотор достаёт до древности"
  ],
  transport: [
    null,
    "Только пригород",
    "Пригород, багажник",
    "Открывает область",
    "Область, прицеп",
    "Открывает глушь и болота",
    "Самый большой кузов"
  ]
};
const GWHAT = {
  det: ["детектор", "Все детекторы"],
  shovel: ["лопату", "Все лопаты"],
  transport: ["транспорт", "Весь транспорт"]
};
const RAD = { 20: "1 клетка", 24: "1,5 клетки", 26: "1,5 клетки", 28: "почти 2 клетки", 32: "2 клетки" };
const REG_SHORT = [null, "Пригород", "Пригород и область", "Все три"];
const GI = {
  // линейные иконки
  depth: '<svg viewBox="0 0 20 20"><path d="M10 3v9M6 8.5l4 4 4-4M4 16.5h12"/></svg>',
  noise: '<svg viewBox="0 0 20 20"><path d="M2 10h3l2-5 3 10 2.5-7 1.5 2H18"/></svg>',
  radius:
    '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="2.6" fill="currentColor"/></svg>',
  metal:
    '<svg viewBox="0 0 20 20"><path d="M10 2.5l6.5 3.7v7.6L10 17.5l-6.5-3.7V6.2z"/><path d="M10 10l6.5-3.8M10 10v7.5M10 10L3.5 6.2"/></svg>',
  eye: '<svg viewBox="0 0 20 20"><path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z"/><circle cx="10" cy="10" r="2.5"/></svg>',
  dig: '<svg viewBox="0 0 20 20"><path d="M14 2.5l3.5 3.5M15.7 4.2L9 11M6.2 10.3l3.5 3.5-3 3c-1 1-2.6 1-3.5 0s-1-2.5 0-3.5z"/></svg>',
  fast: '<svg viewBox="0 0 20 20"><path d="M11 2L4.5 11H10l-1 7 6.5-9H10z"/></svg>',
  bag: '<svg viewBox="0 0 20 20"><path d="M5 7h10l1 10H4zM7.5 7V5.5a2.5 2.5 0 015 0V7"/></svg>',
  map: '<svg viewBox="0 0 20 20"><path d="M2.5 5l5-2 5 2 5-2v12l-5 2-5-2-5 2zM7.5 3v12M12.5 5v12"/></svg>'
};
function gearRows(k, a, b) {
  // строки сравнения: [иконка, название, было, стало, лучше?]
  const R = [];
  if (k === "det") {
    R.push(["depth", "Глубина", a.depth + " см", b.depth + " см", b.depth > a.depth]);
    if (a.noise !== b.noise)
      R.push(["noise", "Помехи", a.noise ? "Есть" : "Нет", b.noise ? "Есть" : "Нет", !b.noise]);
    if (a.disc !== b.disc)
      R.push(["metal", "Тип металла", a.disc ? "Да" : "Нет", b.disc ? "Да" : "Нет", b.disc]);
    if (a.showDepth !== b.showDepth)
      R.push(["eye", "Глубина до вещи", a.showDepth ? "Да" : "Нет", b.showDepth ? "Да" : "Нет", b.showDepth]);
    R.push(["radius", "Радиус", RAD[a.r], RAD[b.r], b.r > a.r]);
  } else if (k === "shovel") {
    R.push(["depth", "Предел", a.depth + " см", b.depth + " см", b.depth > a.depth]);
    R.push(["dig", "За копок", a.step + " см", b.step + " см", b.step > a.step]);
    R.push(["fast", "Быстро", a.step * 2 + " см", b.step * 2 + " см", b.step > a.step]);
  } else {
    R.push(["bag", "Сумка", a.cap + " кг", b.cap + " кг", b.cap > a.cap]);
    R.push(["map", "Регионы", REG_SHORT[a.region], REG_SHORT[b.region], b.region > a.region]);
  }
  return R;
}
function gearGain(k, a, b) {
  // зелёная фраза: что даст улучшение
  const p = [];
  if (k === "det") {
    if (a.noise && !b.noise) p.push("без помех");
    if (!a.disc && b.disc) p.push("видит тип металла");
    if (!a.showDepth && b.showDepth) p.push("показывает глубину");
    if (b.depth > a.depth) p.push(`на ${b.depth - a.depth} см глубже`);
    if (b.r > a.r) p.push("шире радиус");
  } else if (k === "shovel") {
    if (b.depth > a.depth) p.push(`на ${b.depth - a.depth} см глубже`);
    if (b.step > a.step) p.push(`+${b.step - a.step} см за копок`);
  } else {
    if (b.cap > a.cap) p.push(`+${b.cap - a.cap} кг в сумку`);
    if (b.region > a.region) p.push(`открывает ${["", "пригород", "область", "глушь и болота"][b.region]}`);
  }
  if (!p.length) return "";
  const t = p.length > 1 ? p.slice(0, -1).join(", ") + " и " + p[p.length - 1] : p[0];
  return t[0].toUpperCase() + t.slice(1);
}
function gearStats(k, x) {
  return k === "det"
    ? `<span>${GI.depth}${x.depth} см</span><span>${GI.radius}${RAD[x.r]}</span>`
    : k === "shovel"
      ? `<span>${GI.depth}${x.depth} см</span><span>${GI.dig}${x.step} см за копок</span>`
      : `<span>${GI.bag}${x.cap} кг</span><span>${GI.map}${["", "пригород", "+ область", "+ глушь"][x.region]}</span>`;
}
const gearSel = {};
