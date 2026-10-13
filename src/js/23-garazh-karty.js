// ================= ГАРАЖ: КАРТЫ
const REG_SHORT_NAME = [null, "Пригород", "Область", "Глушь"];
const REG_IN = [null, "В пригороде", "В области", "В глуши"];
const MAP_ART = {
  f: "@art(map-art/f.png)",
  1: "@art(map-art/1.png)",
  2: "@art(map-art/2.png)",
  3: "@art(map-art/3.png)"
};
Object.assign(MAP_ART, { 4: "@art(map-art/4.png)", 5: "@art(map-art/5.png)" });
const mapPic = m => MAP_ART[m.id];
const LOCK_SVG =
  '<svg class="lk" viewBox="0 0 10 12" aria-hidden="true"><path fill="currentColor" d="M2 5V3a3 3 0 0 1 6 0v2h1v7H1V5zm2 0h2V3a1 1 0 0 0-2 0z"/></svg>';
const NB_ART = {
  train: "@art(nb-art/train.jpeg)",
  pine: "@art(nb-art/pine.jpeg)",
  m0: "@art(nb-art/m0.jpeg)",
  m1: "@art(nb-art/m1.jpeg)",
  m2: "@art(nb-art/m2.jpeg)"
};
const NBI = {
  zone: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="none" stroke="#8a2a1e" stroke-width="2" stroke-dasharray="3 2.4"/></svg>',
  acc: '<svg viewBox="0 0 20 20" fill="none" stroke="#2b2318" stroke-width="1.8"><circle cx="10" cy="10" r="6.5"/><circle cx="10" cy="10" r="2"/><path d="M10 1v5M10 14v5M1 10h5M14 10h5"/></svg>',
  bars: '<svg viewBox="0 0 20 20" fill="#2b2318"><rect x="2" y="12" width="4" height="6"/><rect x="8" y="8" width="4" height="10"/><rect x="14" y="3" width="4" height="15"/></svg>',
  trees:
    '<svg viewBox="0 0 20 20" fill="#2b2318"><path d="M6 2 1.5 10H4L1 15h4v3h2v-3h4L8 10h2.5z"/><path d="M15 5l-3.5 6h2l-2.5 4h3v3h2v-3h3l-2.5-4h2z"/></svg>',
  road: '<svg viewBox="0 0 20 20" fill="none" stroke="#2b2318" stroke-width="2.2" stroke-linecap="round"><path d="M4 18c0-4 9-3 9-7S6 8 8 2"/></svg>',
  box: '<svg viewBox="0 0 20 20" fill="none" stroke="#2b2318" stroke-width="1.8"><rect x="2.5" y="7" width="15" height="10"/><path d="M2.5 7 5 3h10l2.5 4M8 10h4"/></svg>'
};
const NB_TXT = {
  1: {
    d: "Бывшая ферма. Говорят, там ещё попадаются монеты и хозяйственные вещи.",
    hand: "Со слов<br>местного",
    li: [
      ["zone", "Зона поиска: большая"],
      ["acc", "Точность: низкая"],
      ["bars", "Находки: монеты, предметы быта"],
      ["trees", "Глубина: в основном неглубоко"]
    ]
  },
  2: {
    d: "Старый довоенный план деревни. Можно точнее определить место поиска.",
    li: [
      ["zone", "Зона поиска: меньше"],
      ["acc", "Точность: выше"],
      ["bars", "Находки: монеты, военное"],
      ["box", "Тайник: в половине случаев"],
      ["trees", "Глубина: средняя"]
    ]
  },
  4: {
    d: "Отчёт экспедиции 1954 года: городище на мысу над рекой. Это памятник — копать тут нельзя.",
    hand: "1954",
    li: [
      ["zone", "Зона: городище за валами"],
      ["bars", "Находки: древность и старина"],
      ["trees", "Под обрывом — неглубоко, после дождя больше"],
      ["acc", "Полиция +1 за каждую поездку"]
    ]
  },
  5: {
    d: "Деревню затопили под водохранилище. Летом и осенью вода отступает и открывает старую улицу.",
    li: [
      ["zone", "Зона: бывшая улица"],
      ["bars", "Находки: всех эпох вперемешку"],
      ["trees", "Глубина: мелко, ил размыл слои"],
      ["road", "Только летом и осенью"]
    ]
  },
  3: {
    d: "Копия штабной карты 1942 года. Дают только тем, кому доверяют.",
    hand: "Из архива",
    li: [
      ["zone", "Зона поиска: маленькая"],
      ["acc", "Точность: высокая"],
      ["bars", "Находки: военное и редкое"],
      ["box", "Тайник: всегда"],
      ["trees", "Глубина: глубоко"]
    ]
  }
};
const REG_GEN = [null, "пригороде", "области", "глуши"];
// особое место открыто, только если туда можно поехать (или купить отчёт и сразу ехать)
function placeOpen(id) {
  if (id === 4) return TRANSPORT[G.transport].region >= 2 && G.det >= 4;
  return PLACES[id].need(G);
}
function placeLockTxt(id) {
  if (id === 5) return "Деревня сейчас под водой. Дно покажется летом и осенью.";
  if (TRANSPORT[G.transport].region < 2) return "Городище — в Области. Нужен мопед или машина.";
  return "Городище откроется с профессиональным детектором (4-й уровень).";
}
const multTxt = x => "×" + String(x).replace(".", ",");
function placeCard(id) {
  const P = PLACES[id],
    t = NB_TXT[id],
    li = a => `<ul>${a.map(([ic, x]) => `<li>${NBI[ic]}<span>${x}</span></li>`).join("")}</ul>`;
  let btn,
    warn = "";
  if (id === 4) {
    if (!G.hfOwn)
      btn =
        G.det < 4
          ? `<button class="nb-btn" disabled>${LOCK_SVG} Закрыто</button>`
          : `<button class="nb-btn" ${G.money < P.unlock ? "disabled" : ""} onclick="SK.buyPlace(4)">Купить отчёт · ${rub(P.unlock)}</button>`;
    else
      btn =
        G.det < 4
          ? `<button class="nb-btn" disabled>${LOCK_SVG} Закрыто</button>`
          : `<button class="nb-btn" onclick="SK.go(4)">Ехать на городище</button>`;
    if (G.det < 4) warn = "Нужен профессиональный детектор (4-й уровень)";
    else if (!G.hfOwn)
      warn =
        G.money < P.unlock
          ? `Не хватает ${rub(P.unlock - G.money)}`
          : "Отчёт покупается один раз — дальше ездить бесплатно";
  } else {
    const ok = P.need(G);
    btn = ok
      ? `<button class="nb-btn" onclick="SK.go(5)">Ехать в деревню</button>`
      : `<button class="nb-btn" disabled>${LOCK_SVG} Под водой</button>`;
    warn = ok ? "Дорога бесплатная, пока стоит сушь" : "Вода стоит высоко. Дно покажется летом и осенью";
  }
  return `<div class="nbc place"><div class="nbc-pic"><img src="${mapPic(P)}" alt=""></div><div class="nbc-b">${t.hand ? `<span class="nbc-hand">${t.hand}</span>` : ""}<h3>${id === 4 ? "Городище" : "Деревня"}</h3>
    <p>${t.d}</p>${li(t.li.concat([["road", `Цены находок: ${REGIONS[P.reg].mult > 1 ? multTxt(ECON.reg[REGIONS[P.reg].mult]) : "обычные"}`]]))}${btn}${warn ? `<p class="nb-warn">${warn}</p>` : ""}</div></div>`;
}
function renderMaps() {
  const maxR = TRANSPORT[G.transport].region;
  if (G.region > maxR) G.region = maxR;
  const r = G.region,
    RG = REGIONS[r],
    tr = TRANSPORT[G.transport];
  const head = `<div class="nb-head"><h2>Полевой блокнот</h2><img src="${NB_ART.pine}" alt=""></div>`;
  if (G.place && !placeOpen(G.place)) G.place = 0; // закрытое место не открываем
  const pl = G.place || 0;
  const seg = `<div class="nb-seg">${[1, 2, 3]
    .map(i =>
      i > maxR
        ? `<button class="lock" disabled aria-disabled="true" tabindex="-1">${REG_SHORT_NAME[i]} ${LOCK_SVG}</button>`
        : `<button aria-pressed="${!pl && r === i}" onclick="SK.setRegion(${i})">${REG_SHORT_NAME[i]}</button>`
    )
    .join("")}
      ${[
        [4, "Городище"],
        [5, "Деревня"]
      ]
        .map(([id, n]) =>
          placeOpen(id)
            ? `<button class="pl" aria-pressed="${pl === id}" onclick="SK.setPlace(${id})">${n}</button>`
            : `<button class="pl lock" aria-disabled="true" onclick="SK.placeLocked(${id})">${n} ${LOCK_SVG}</button>`
        )
        .join("")}</div>
    ${pl ? "" : regionCard(r)}${seasonStrip()}`;
  if (pl) return `<div class="nbw"><div class="nb">${head}${seg}${placeCard(pl)}</div></div>`;
  const price = RG.mult > 1 ? `находки дороже, ${multTxt(ECON.reg[RG.mult])}` : "обычные цены";
  const art =
    G.transport === 1
      ? `<img class="art" src="${NB_ART.train}" alt="">`
      : `<img class="spr" src="${TRANSPORT_IMG[G.transport]}" alt=""><span style="flex:1"></span>`;
  const trc = `<div class="nb-tr">${art}<div class="nb-tr-t">${G.transport === 1 ? "" : `<span class="nm">${tr.name.replace(/ с багажником| с прицепом/, "")}</span>`}<span>Дорога</span><b>Бесплатно</b><small>${REG_IN[r]} — ${price}</small></div></div>`;
  const li = a => `<ul>${a.map(([ic, t]) => `<li>${NBI[ic]}<span>${t}</span></li>`).join("")}</ul>`;
  const free = `<div class="nbc"><div class="nbc-pic"><img src="${NB_ART.m0}" alt=""></div><div class="nbc-b"><h3>Наугад</h3>
      <p>Просто выбираем место в ${REG_GEN[r]} и едем.</p>${li([
        ["zone", "Зона поиска: нет"],
        ["bars", "Находок: меньше"],
        ["road", "Места: любые поля и леса"]
      ])}
      <button class="nb-btn" onclick="SK.go(0)">Ехать</button></div></div>`;
  const cards = MAPS.map(m => {
    const t = NB_TXT[m.id],
      p = mapPrice(m, r),
      ok = m.need(G),
      money = G.money >= p,
      have = G.maps[mk(m.id, r)] || 0;
    const pic = m.id === 1 ? NB_ART.m1 : m.id === 2 ? NB_ART.m2 : mapPic(m);
    let btn;
    if (!ok)
      btn = `<button class="nb-btn" disabled>${LOCK_SVG} Закрыто</button><p class="nb-warn">${typeof m.needTxt === "function" ? m.needTxt(G) : m.needTxt}</p>`;
    else if (have) btn = `<button class="nb-btn" onclick="SK.go(${m.id})">Ехать · карта уже есть</button>`;
    else
      btn = `<button class="nb-btn" ${money ? "" : "disabled"} onclick="SK.buyGo(${m.id})">Ехать · ${rub(p)}</button>${money ? "" : `<p class="nb-warn">Не хватает ${rub(p - G.money)}</p>`}`;
    return `<div class="nbc${ok ? "" : " off"}"><div class="nbc-pic${m.id === 3 ? " raw" : ""}"><img src="${pic}" alt=""></div><div class="nbc-b">${t.hand ? `<span class="nbc-hand">${t.hand}</span>` : ""}<h3>${{ 3: "Архив", 4: "Городище", 5: "Деревня" }[m.id] || m.name}</h3>
      <p>${t.d}</p>${li(t.li)}${btn}</div></div>`;
  }).join("");
  return `<div class="nbw"><div class="nb">${head}${seg}${trc}${free}${cards}${fleaNb()}<div class="nb-note">${NBI.zone}Основные находки — внутри отмеченной зоны.</div></div></div>`;
}
