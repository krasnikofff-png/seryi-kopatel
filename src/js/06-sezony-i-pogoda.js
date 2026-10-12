// ===== СЕЗОНЫ И ПОГОДА =====
// сезон = 4 поездки; год — 16 поездок; начинаем осенью
const SEASONS = [
  {
    id: "autumn",
    name: "Осень",
    end: 540,
    line: "Лучшее время: поля убраны, дожди размягчают землю. День короче — до 17:00.",
    wx: { clear: 0.45, rain: 0.35, fog: 0.2 }
  },
  {
    id: "winter",
    name: "Зима",
    end: 480,
    line: "Земля мёрзлая: копать вдвое дольше, лопата берёт на 10 см мельче, день до 16:00. Зато болота замёрзли — в Глуши тайники чаще, а антиквар платит на 15% больше.",
    wx: { clear: 0.5, frost: 0.35, fog: 0.15 }
  },
  {
    id: "spring",
    name: "Весна",
    end: 600,
    line: "Свежая пахота: в Пригороде вещи на 10 см выше. Распутица — дорога в Глушь на 30 минут дольше.",
    wx: { clear: 0.45, rain: 0.35, fog: 0.2 }
  },
  {
    id: "summer",
    name: "Лето",
    end: 720,
    line: "Длинный день, до 20:00. Трава: каждый копок на 5 минут дольше, в поле больше дачников, грибников и конкурентов.",
    wx: { clear: 0.5, heat: 0.3, rain: 0.2 }
  }
];
const WEATHER = {
  clear: { name: "ясно", d: "без сюрпризов" },
  rain: {
    name: "дождь",
    d: "земля мягкая — копок на 5 мин быстрее, но находки грязнее: риск при чистке +10%"
  },
  fog: {
    name: "туман",
    d: "радиус детектора −5, зато свидетели вас почти не видят — событий в дороге меньше"
  },
  heat: { name: "жара", d: "каждый копок на 5 минут дольше" },
  frost: { name: "мороз", d: "полчаса отогреваете батарейки детектора" }
};
const seasonIdx = n => Math.floor((n ?? G.trips ?? 0) / 4) % 4;
const season = n => SEASONS[seasonIdx(n)];
const isWinter = () => season().id === "winter";
function rollWx() {
  const w = season().wx;
  let r = Math.random(),
    acc = 0;
  for (const k in w) {
    acc += w[k];
    if (r < acc) return (G.wx = k);
  }
  return (G.wx = "clear");
}
const dayEnd = () => Math.min(780, season().end + (own("lamp") ? 120 : 0));
const hhmmAbs = m => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
function seasonStrip() {
  const S = season(),
    W = WEATHER[G.wx || "clear"],
    k = ((G.trips || 0) % 4) + 1;
  return `<div class="nb-season"><div class="nbs-top"><b>${S.name}</b><span>поездка ${k} из 4</span><em>Прогноз: ${W.name}</em></div><p>${S.line}${G.wx && G.wx !== "clear" ? ` <b>${W.name[0].toUpperCase() + W.name.slice(1)}:</b> ${W.d}.` : ""}</p></div>`;
}
function regionCard(r) {
  const I = REG_INFO[r],
    RG = REGIONS[r];
  return `<div class="nb-reg"><b>${I.land}</b><p>${I.line}</p><ul>
    <li><span>Цены</span>${RG.mult > 1 ? `×${RG.mult}` : "обычные"}</li><li><span>Слой</span>${I.layer}</li><li><span>Глубина</span>${I.depth}</li>
    <li><span>Выезд</span>в ${hhmm(I.start + (season().id === "spring" && r === 3 ? 30 : 0) + (G.wx === "frost" ? 30 : 0))}${season().id === "spring" && r === 3 ? " (распутица)" : G.wx === "frost" ? " (мороз)" : ""}</li><li><span>Риски</span>${I.risks}</li></ul></div>`;
}
function showRegionIntro(r) {
  const box = $("evt"),
    I = REG_INFO[r];
  SFX.story();
  box.innerHTML = `<div class="sheet reg-intro"><small>Открыт регион</small><h2>${REGIONS[r].name}</h2><p><b>${I.land}.</b> ${I.line}</p>
    <ul><li>Цены находок: ×${REGIONS[r].mult}</li><li>Чаще всего: ${I.layer}</li><li>Глубина: ${I.depth}</li><li>Дорога: выезд в поле в ${hhmm(I.start)}</li><li>Риски: ${I.risks}</li></ul>
    <button class="btn" onclick="$('evt').hidden=true">Понятно</button></div>`;
  box.hidden = false;
}
function pickW(w, r) {
  let x = (r || R)(),
    a = 0;
  for (let i = 0; i < w.length; i++) {
    a += w[i];
    if (x < a) return i;
  }
  return 0;
}
function disc(c, cx, cy, rx, ry, col) {
  c.fillStyle = col;
  ry = ry || rx;
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))));
    c.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1);
  }
}
function rect(c, x, y, w, h, col) {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), w, h);
}
const roadX = y => 96 + Math.sin(y * 0.018) * 18 + Math.sin(y * 0.05) * 4;
const hit = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// картинки металлоискателей для окна снаряжения (1 — самодельный … 6 — георадар)
const DET_IMG = [
  null,
  "@art(det-img/1.png)",
  "@art(det-img/2.png)",
  "@art(det-img/3.png)",
  "@art(det-img/4.png)",
  "@art(det-img/5.png)",
  "@art(det-img/6.png)"
];
// картинки лопат (1 — сапёрная … 6 — бур и щуп)
const SHOVEL_IMG = [
  null,
  "@art(shovel-img/1.png)",
  "@art(shovel-img/2.png)",
  "@art(shovel-img/3.png)",
  "@art(shovel-img/4.png)",
  "@art(shovel-img/5.png)",
  "@art(shovel-img/6.png)",
  "@art(shovel-img/7.png)"
];
// картинки транспорта (1 — электричка … 6 — «буханка»)
const TRANSPORT_IMG = [
  null,
  "@art(transport-img/1.png)",
  "@art(transport-img/2.png)",
  "@art(transport-img/3.png)",
  "@art(transport-img/4.png)",
  "@art(transport-img/5.png)",
  "@art(transport-img/6.png)"
];
const GEAR_IMG = { det: DET_IMG, shovel: SHOVEL_IMG, transport: TRANSPORT_IMG };
