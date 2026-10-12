// ===== АЛЬБОМ НАХОДОК: всё, что бывает в земле; не найденное — тёмным «?» =====
let albOpen = false;
const ALB = (() => {
  const seen = new Set(),
    by = [[], [], [], [], []];
  CAT.forEach(q => {
    if (q[0] === 0 || seen.has(q[2])) return;
    seen.add(q[2]);
    by[q[1]].push({ c: q[0], name: q[2] });
  });
  by.forEach(a => a.sort((x, y) => x.c - y.c));
  return by;
})();
const ALB_TIP = [
  "в Пригороде, на любой карте",
  "в Области, по картам «Слух» и «Схема»",
  "по картам «Схема» и «Архив», в Глуши",
  "по «Архиву» и в Глуши, глубоко",
  "на Городище, нужна лопата глубже 120 см"
];
function dexAdd(n) {
  if (!n) return;
  G.dex = G.dex || {};
  G.dex[n] = 1;
}
function dexSync() {
  G.dex = G.dex || {};
  (G.inv || []).concat(G.vit || []).forEach(i => {
    if (!i.story && !i.leg) G.dex[i.name] = 1;
  });
}
function albumShelf() {
  dexSync();
  const d = G.dex,
    tot = ALB.reduce((a, b) => a + b.length, 0),
    got = ALB.reduce((a, b) => a + b.filter(x => d[x.name]).length, 0);
  return `<details class="legs alb" ${albOpen ? "open" : ""} ontoggle="SK.albToggle(this.open)"><summary><b>Альбом находок · ${got}/${tot}</b><span class="alb-bar"><i style="width:${Math.round((got / tot) * 100)}%"></i></span></summary>
    ${ALB.map((a, e) => {
      const g = a.filter(x => d[x.name]).length;
      return `<div class="alb-era"><div class="alb-h"><span>${ERAS[e].name[0].toUpperCase() + ERAS[e].name.slice(1)}</span><b>${g}/${a.length}</b></div><div class="alb-g">${a.map((x, k) => (d[x.name] ? `<button class="k${x.c}" onclick="SK.albPick(${e},${k})"><img src="${FIND_IMG[x.name] || ""}" alt="${x.name}"></button>` : `<button class="no k${x.c}" onclick="SK.albPick(${e},${k})">?</button>`)).join("")}</div></div>`;
    }).join("")}</details>`;
}
// окошко с карточкой вещи из альбома (найденной — с картинкой и описанием, не найденной — с подсказкой, где искать)
function albWin(x) {
  const o = $("albOver"),
    got = G.dex && G.dex[x.name],
    era = ERAS[x.era].name[0].toUpperCase() + ERAS[x.era].name.slice(1);
  $("albSheet").innerHTML = got
    ? `<img class="alb-big" src="${FIND_IMG[x.name] || ""}" alt=""><h2>${x.name}</h2><p class="alb-tags"><span class="fchip k${x.c}">${CLASSES[x.c].name}</span> ${era}</p>${FIND_DESC[x.name] ? `<p>${FIND_DESC[x.name]}</p>` : ""}<p class="alb-got">✓ Есть в альбоме</p><button class="btn" onclick="SK.albClose()">Закрыть</button>`
    : `<div class="alb-big no">?</div><h2>Пока не найдено</h2><p class="alb-tags"><span class="fchip k${x.c}">${CLASSES[x.c].name}</span> ${era}</p><p>Ищите ${ALB_TIP[x.era]}.</p><button class="btn" onclick="SK.albClose()">Закрыть</button>`;
  o.hidden = false;
}
function legShelf() {
  const got = Object.keys(LEGENDS).filter(k => G.leg && G.leg[k]).length;
  const st = {
    found: "у вас",
    mus: "в музее",
    wall: "висит в гараже",
    family: "у внучки лётчика",
    blk: "продана на чёрном рынке",
    ant: "у антиквара",
    buy: "у скупщика"
  };
  return `<details class="legs"><summary><b>Легенды · ${got}/5</b><span class="legmini">${Object.keys(LEGENDS)
    .map(k => (G.leg && G.leg[k] ? `<img src="${FIND_IMG[LEGENDS[k].name]}" alt="">` : `<i>?</i>`))
    .join("")}</span></summary>
    <ul>${Object.entries(LEGENDS)
      .map(([k, L]) => {
        const s = G.leg && G.leg[k];
        return `<li class="${s ? "got" : ""}">${s ? `<img src="${FIND_IMG[L.name]}" alt="">` : `<i>?</i>`}<span><b>${s ? L.name : "???"}</b><small>${s ? st[s] || "" : L.hint}</small></span></li>`;
      })
      .join("")}</ul></details>`;
}
function renderFindSheet() {
  const box = $("fsheet"),
    i = openFind ? G.inv.indexOf(openFind) : -1;
  if (i < 0 || screen !== "base") {
    openFind = null;
    box.hidden = true;
    return;
  }
  const it = openFind,
    meta = `${eraCap(it.era)} · глубина ${it.depth} см${it.cache ? " · тайник с карты" : ""}`;
  const opt = (cls, ic, title, sub, right, onclick, dis) =>
    `<button class="fopt ${cls}" ${dis ? "disabled" : ""} onclick="${onclick}"><span class="fo-ic">${ic}</span><span class="fo-t"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="fo-r">${right}</span>${dis ? "" : FI.chev}</button>`;
  let body;
  if (!it.clean) {
    const risk = own("bath")
      ? 0
      : Math.max(0, 35 - sk("master") * 3 - (own("bench") ? 10 : 0) + (it.wet ? 10 : 0));
    body = `<p class="fs-state"><span class="dot dirty"></span>Находка не очищена</p>
      <img class="fs-pic${it.story ? "" : " dirty"}" src="${findPic(it)}" alt=""><h2 class="fs-name">${shownName(it)}</h2>
      <p class="fs-meta">${meta}</p><p class="fs-note">${it.leg ? "★ Легендарная находка — такое бывает раз в жизни. Почистите: ей ничего не грозит." : it.story ? "Под грязью и ржавчиной может быть что угодно." : it.c === 0 ? "Мусор — сохранность ему не поможет." : `${rangeCh().id === "ant" ? "Антиквар" : "Скупщик"} даст от ${rub(priceRange(it)[0])} до ${rub(priceRange(it)[1])} — всё решит сохранность. Почистите и узнаете. Редкая разновидность — ×${rareM(it)}, но её видно, только если чистить самому: мастер чистит на потоке и такое не замечает.`}</p>
      <h3 class="fs-q">Что сделать с находкой?</h3>
      ${opt("green", FI.brush, "Отдать мастеру", "Ничего не испортит", rub(CLEAN_FEE), `SK.clean(${i},false)`, G.money < CLEAN_FEE)}
      ${opt("plain", FI.hand, "Почистить самому", `Бесплатно, риск испортить ${risk}%${sk("master") || own("bench") || own("bath") ? " · шанс улучшить сохранность" : ""}`, "0 ₽", `SK.clean(${i},true)`)}
      ${it.story || it.leg ? "" : opt("amber", FI.coins, "Скупщику как есть", "Верные деньги, без риска и без сюрпризов", rub(dirtyPrice(it)), `SK.sellDirty(${i})`)}`;
  } else if (it.leg) {
    body = legSheet(it, i, opt, meta);
  } else {
    const n = it._new,
      C = CLASSES[it.c],
      cond = Math.round(it.cond * 100),
      anim = n && n.anim;
    if (n) n.anim = 0;
    const SI = it.story && STORY_ITEMS[it.story];
    let opts = "";
    if (it.nyura)
      opts += opt("gold", FI.star, "Отнести деду", "Это брошка его сестры", "+5 к совести", `SK.toDed(${i})`);
    if (SI) {
      opts += opt(
        "gold",
        it.story === "medal" ? FI.star : FI.museum,
        SI.btn,
        SI.sub,
        "",
        `SK.storyAct(${i})`
      );
    } else if (it.c === 0)
      opts = opt(
        "amber",
        FI.scrap,
        "Сдать в металлолом",
        "Пробки, гвозди, банки",
        "5–20 ₽",
        `SK.sellOneJunk(${i})`
      );
    else {
      opts += opt(
        "amber",
        FI.coins,
        "Продать скупщику",
        "Сразу и без вопросов · иногда шепнёт слух",
        rub(sellPrice(it, CHANNELS[0])),
        `SK.sell(${i},'buy')`
      );
      const antOpen = CHANNELS[1].open();
      if (antOpen) {
        const why = antWhy(it);
        opts += why
          ? opt("locked", FI.star, "Антиквар", why, "—", "", true)
          : opt(
              "gold",
              FI.star,
              "Продать антиквару",
              `${antWants(it) ? "Как раз ищет такое · ×1,3" : "Не в приоритете · ×0,8"} · деньги после следующей поездки`,
              rub(sellPrice(it, CHANNELS[1])),
              `SK.sell(${i},'ant')`
            );
      }
      if (vitCap() && it.c >= 2) {
        const full = (G.vit || []).length >= vitCap();
        opts += full
          ? opt("locked", FI.star, "В витрину", "Все места заняты", "—", "", true)
          : opt(
              "plain",
              FI.star,
              "Поставить в витрину",
              "Экскурсии принесут деньги после следующей поездки",
              "",
              `SK.toVit(${i})`
            );
      }
      if (G.hfSeen && it.era === 4)
        opts += opt(
          "green",
          FI.museum,
          "Отдать археологам",
          (G.arch || 0) >= 3
            ? "Экспедиция помнит вас"
            : `Сдайте ${3 - (G.arch || 0)} — и архивные карты подешевеют`,
          `+${archRep(it)} к совести`,
          `SK.toArch(${i})`
        );
      opts += opt(
        "green",
        FI.museum,
        "Подарить музею",
        museumPay(it) ? `Премия ${rub(museumPay(it))}` : "",
        `+${giftRep(it)} к совести`,
        `SK.sell(${i},'mus')`
      );
      if (it.c >= 2) {
        const raid = Math.min(
          100,
          Math.round(G.heat * 7 * (1 - sk("svyazi") * 0.08) * (G.rep <= -15 ? 2 : 1))
        );
        opts += opt(
          "dark",
          FI.dark,
          "Чёрный рынок",
          `${blackRep(it)} совести · облава ${raid}%`,
          rub(sellPrice(it, CHANNELS[2])),
          `SK.sell(${i},'blk')`
        );
      }
      if (!antOpen)
        opts += opt(
          "locked",
          FI.lock,
          "Антиквар",
          `Доступен с уровня ${ANT_LVL}`,
          rub(sellPrice(it, CHANNELS[1])),
          "",
          true
        );
    }
    body = `${SI ? `<p class="fs-state story">★ Это про деда</p>` : `<p class="fs-state ok">${FI.ok}Находка опознана${n && n.self ? " · почистили сами" : n ? " · после мастера" : ""}</p>`}
      <img class="fs-pic" src="${findPic(it)}" alt=""><h2 class="fs-name">${it.name}</h2>
      ${SI ? `<span class="fchip fs-chip story">Улика · ${SI.ch}</span>` : `<span class="fchip k${it.c} fs-chip">${C.name}</span>`}${SI ? `<div class="fs-story"><p>${SI.note}</p><small>${SI.keep}</small></div>` : ""}<p class="fs-meta">${meta}</p>${FIND_DESC[it.name] ? `<p class="fs-note">${FIND_DESC[it.name]}</p>` : ""}
      ${n && n.note ? `<p class="warn fs-warn">${n.note}</p>` : ""}
      ${it.gr != null && it.c !== 0 ? `<div class="fs-grade${anim ? " anim" : ""}${it.gr === 5 ? " rare" : ""}"><span>Сохранность</span><b>${GRADES[it.gr].n}</b><b class="gm">×${String(grM(it)).replace(".", ",")}</b><ol>${GRADES.map((g, k) => `<li class="${k <= it.gr ? "on" : ""}${k === it.gr ? " fin" : ""}${k === 5 ? " r" : ""}" style="--d:${k * 0.18}s">${g.s}</li>`).join("")}</ol></div>` : it.gr != null ? "" : `<div class="fs-cond"><span>Состояние</span><b>${cond}%</b><i style="--w:${cond}%"></i></div>`}
      <h3 class="fs-q">Что сделать с находкой?</h3>${opts}
      ${SI ? "" : `<p class="fs-keep">Можно оставить находку у себя</p>`}`;
  }
  const stats = `<div class="fs-stats"><span class="fs-money">${iconSvg("coin")}<b>${rub(G.money)}</b></span>
    <span><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="12" width="4" height="6" rx="1"/><rect x="8" y="8" width="4" height="10" rx="1"/><rect x="14" y="3" width="4" height="15" rx="1"/></svg>Ур. ${G.lvl}</span>
    <span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 17.5S2.5 12.8 2.5 7.4C2.5 4.9 4.4 3 6.7 3c1.4 0 2.6.7 3.3 1.8C10.7 3.7 11.9 3 13.3 3c2.3 0 4.2 1.9 4.2 4.4 0 5.4-7.5 10.1-7.5 10.1z"/></svg>${G.rep > 0 ? "+" : ""}${G.rep}</span>
    <span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 9.5C3 6 6.1 4 10 4s7 2 7 5.5V11H3z"/><rect x="2" y="11.5" width="16" height="2.5" rx="1.2"/></svg>${G.heat}</span></div>`;
  box.innerHTML = `<div class="fs-back" onclick="SK.closeFind()"></div><div class="fs${openFind && openFind.story ? " story" : ""}" role="dialog" aria-label="Находка"><span class="fs-grip"></span><button class="fs-x" onclick="SK.closeFind()" aria-label="Закрыть">×</button>${stats}${body}<button class="fs-ret" onclick="SK.closeFind()">Вернуться к находкам</button></div>`;
  box.hidden = false;
}
