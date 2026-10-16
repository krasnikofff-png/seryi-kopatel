// ===== АЛЬБОМ НАХОДОК: всё, что бывает в земле; не найденное — тёмным «?» =====
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
const ALB_ROW = []; // названия особых рядов альбома (ночные, со дна…)
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
// альбом и легенды — две фишки над находками; сам альбом открывается окном
let albRow = -1,
  albOnly = false;
const albName = e => (e < 5 ? ERAS[e].name[0].toUpperCase() + ERAS[e].name.slice(1) : ALB_ROW[e - 5]);
function albumShelf() {
  dexSync();
  const d = G.dex,
    tot = ALB.reduce((a, b) => a + b.length, 0),
    got = ALB.reduce((a, b) => a + b.filter(x => d[x.name]).length, 0);
  return `<button class="fchipbtn" onclick="SK.openAlb()">${pxi("paper", 20)}<span>Альбом</span><b>${got}/${tot}</b></button>`;
}
function legShelf() {
  const got = Object.keys(LEGENDS).filter(k => G.leg && G.leg[k]).length;
  return `<button class="fchipbtn leg" onclick="SK.openLegs()">${pxi("star", 20)}<span>Легенды</span><b>${got}/5</b></button>`;
}
const sheetTop = () =>
  `<span class="grab" aria-hidden="true"></span><button class="sx" onclick="SK.albClose()" aria-label="Закрыть">${pxi("x", 16)}</button>`;
function openAlb() {
  dexSync();
  const d = G.dex,
    tot = ALB.reduce((a, b) => a + b.length, 0),
    got = ALB.reduce((a, b) => a + b.filter(x => d[x.name]).length, 0);
  if (albRow < 0) {
    albRow = ALB.findIndex(a => a.some(x => d[x.name]));
    if (albRow < 0) albRow = 0;
  }
  const rows = ALB.map((a, e) => {
    const g = a.filter(x => d[x.name]).length;
    return `<button class="alb-lay${e === albRow ? " on" : ""}" onclick="SK.albRow(${e})"><span>${albName(e)}</span><span class="alb-bar"><i style="width:${Math.round((g / a.length) * 100)}%"></i></span><b>${g}/${a.length}</b></button>`;
  }).join("");
  const cells = ALB[albRow]
    .map((x, k) => [x, k])
    .filter(([x]) => !albOnly || d[x.name])
    .map(([x, k]) =>
      d[x.name]
        ? `<button class="k${x.c}" onclick="SK.albPick(${albRow},${k})"><img src="${FIND_IMG[x.name] || ""}" alt="${x.name}"></button>`
        : `<button class="no k${x.c}" onclick="SK.albPick(${albRow},${k})" aria-label="Не найдено">${perk("book") ? `<img class="sil" src="${FIND_IMG[x.name] || ""}" alt="">` : "?"}</button>`
    )
    .join("");
  $("albSheet").className = "sheet alb-win";
  $("albSheet").innerHTML = `${sheetTop()}
  <div class="sh-h"><h2>Альбом находок</h2><span class="alb-tot">собрано ${got} из ${tot}</span></div>
  <div class="alb-lays">${rows}</div>
  <div class="fseg"><button aria-pressed="${!albOnly}" onclick="SK.albOnly(false)">Все вещи</button><button aria-pressed="${albOnly}" onclick="SK.albOnly(true)">Только найденные</button></div>
  <h3 class="alb-cap">${albName(albRow)}</h3>
  <div class="alb-g">${cells || `<p class="empty">В этом слое пока ничего не найдено.</p>`}</div>
  <p class="hint">${perk("book") ? "Нажмите на силуэт — подскажу, где такое искать." : "Нажмите на «?» — подскажу, где такое искать."}</p>`;
  $("albOver").hidden = false;
}
function openLegs() {
  const st = {
    found: "у вас",
    mus: "в музее",
    wall: "висит в гараже",
    family: "у внучки лётчика",
    blk: "продана на чёрном рынке",
    ant: "у антиквара",
    buy: "у скупщика"
  };
  const got = Object.keys(LEGENDS).filter(k => G.leg && G.leg[k]).length;
  $("albSheet").className = "sheet alb-win legs-win";
  $("albSheet").innerHTML = `${sheetTop()}
  <div class="sh-h"><h2>Легенды</h2><span class="alb-tot">найдено ${got} из 5</span></div>
  <p>Пять вещей, о которых рассказывают на форуме. Каждая — одна на всю игру.</p>
  <ul class="legs-l">${Object.entries(LEGENDS)
    .map(([k, L]) => {
      const s = G.leg && G.leg[k];
      return `<li class="${s ? "got" : ""}"><span class="slot${s ? " star" : " no"}">${s ? `<img src="${FIND_IMG[L.name]}" alt="">` : "?"}</span><span><b>${s ? L.name : "Неизвестная легенда"}</b><small>${s ? st[s] || "" : L.hint}</small></span></li>`;
    })
    .join("")}</ul>`;
  $("albOver").hidden = false;
}
// карточка вещи из альбома: найденной — с картинкой и описанием, не найденной — с подсказкой, где искать
function albWin(x) {
  const o = $("albOver"),
    got = G.dex && G.dex[x.name],
    era = ERAS[x.era] ? ERAS[x.era].name[0].toUpperCase() + ERAS[x.era].name.slice(1) : "";
  $("albSheet").className = "sheet alb-win one";
  $("albSheet").innerHTML = `${sheetTop()}
  ${got ? `<span class="slot big star"><img src="${FIND_IMG[x.name] || ""}" alt=""></span>` : perk("book") ? `<span class="slot big no"><img class="sil" src="${FIND_IMG[x.name] || ""}" alt=""></span>` : `<span class="slot big no">?</span>`}
  <h2>${got ? x.name : "Пока не найдено"}</h2><p class="alb-tags"><span class="tag k${x.c}">${CLASSES[x.c].name}</span>${era ? `<span class="tag">${era}</span>` : ""}${got ? `<span class="tag ok">Есть в альбоме</span>` : ""}</p>
  ${got ? (FIND_DESC[x.name] ? `<p>${FIND_DESC[x.name]}</p>` : "") : `<p>Ищите ${x.night ? "в ночную смену (9-й уровень): светится в темноте" : x.kurgan ? "на кургане (15-й уровень), глубоко в насыпи" : x.house ? "в старом доме под снос (11-й уровень): чердак, печь, стены, подпол" : x.mag ? "поисковым магнитом с берега (6-й уровень): река у Городища, затопленная деревня, болото, пруд усадьбы" : ALB_TIP[x.era]}.</p>`}
  <button class="btn ghost" onclick="SK.openAlb()">${pxi("back", 14)}К альбому</button>`;
  o.hidden = false;
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
    meta = `${eraCap(it.era)}, ${it.depth} см${it.cache ? ", тайник с карты" : ""}`;
  const PI = {
    [FI.brush]: "bench",
    [FI.hand]: "brush",
    [FI.coins]: "coin",
    [FI.star]: "star",
    [FI.museum]: "heart",
    [FI.dark]: "shield",
    [FI.lock]: "lock",
    [FI.scrap]: "trash"
  };
  const icon = ic =>
    PI[ic] === "coin" ? `<img src="${COIN_IMG}" alt="" width="30" height="30">` : pxi(PI[ic] || "star", 28);
  const opt = (cls, ic, title, sub, right, onclick, dis) =>
    `<button class="fopt ${cls}" ${dis ? "disabled" : ""} onclick="${onclick}"><span class="fo-ic">${icon(ic)}</span><span class="fo-t"><b>${title}</b>${sub ? `<small>${sub}</small>` : ""}</span><span class="fo-r">${right}</span></button>`;
  let body;
  if (!it.clean) {
    const risk = own("bath") ? 0 : Math.max(0, 35 - sk("master") * 3 - (own("bench") ? 10 : 0) + (it.wet ? 10 : 0));
    body = `<div class="fs-head"><span class="slot big mud"><img class="fs-pic" src="${findPic(it)}" alt=""></span><div class="fs-hb"><span class="frow"><span class="tag">В земле</span>${it.leg ? `<span class="tag leg">Легенда</span>` : it.story ? "" : `<span class="tag k${it.c}">${CLASSES[it.c].name}</span>`}</span><h2 class="fs-name">${shownName(it)}</h2><p class="fs-meta">${meta}</p></div></div><p class="fs-note">${it.leg ? "★ Легендарная находка — такое бывает раз в жизни. Почистите: ей ничего не грозит." : it.story ? "Под грязью и ржавчиной может быть что угодно." : it.c === 0 ? "Мусор — сохранность ему не поможет." : `${rangeCh().id === "ant" ? "Антиквар" : "Скупщик"} даст от ${rub(priceRange(it)[0])} до ${rub(priceRange(it)[1])} — всё решит сохранность. Почистите и узнаете. Редкая разновидность — ×${rareM(it)}, но её видно, только если чистить самому: мастер чистит на потоке и такое не замечает.`}</p>
      <h3 class="fs-q">Что сделать</h3>
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
      opts += opt("gold", it.story === "medal" ? FI.star : FI.museum, SI.btn, SI.sub, "", `SK.storyAct(${i})`);
    } else if (it.c === 0)
      opts = opt("amber", FI.scrap, "Сдать в металлолом", "Пробки, гвозди, банки", "5–20 ₽", `SK.sellOneJunk(${i})`);
    else {
      if (G.order && G.order.name === it.name)
        opts += opt(
          "gold",
          FI.star,
          "Отдать коллекционеру",
          "По заказу · платит вдвое против антиквара",
          rub(orderPrice(it)),
          `SK.sellOrder(${i})`
        );
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
          (G.arch || 0) >= 3 ? "Экспедиция помнит вас" : `Сдайте ${3 - (G.arch || 0)} — и архивные карты подешевеют`,
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
        const raid = Math.min(100, Math.round(G.heat * 7 * (1 - sk("svyazi") * 0.08) * (G.rep <= -15 ? 2 : 1)));
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
    body = `<div class="fs-head"><span class="slot big star"><img class="fs-pic" src="${findPic(it)}" alt=""></span><div class="fs-hb"><span class="frow">${SI ? `<span class="tag leg">Про деда</span><span class="tag">Улика, ${SI.ch}</span>` : `<span class="tag ok">Опознана</span><span class="tag k${it.c}">${C.name}</span>`}</span><h2 class="fs-name">${it.name}</h2><p class="fs-meta">${meta}${n && n.self ? ", почистили сами" : n ? ", после мастера" : ""}</p></div></div>
      ${SI ? `<div class="fs-story"><p>${SI.note}</p><small>${SI.keep}</small></div>` : ""}${FIND_DESC[it.name] ? `<p class="fs-note">${FIND_DESC[it.name]}</p>` : ""}
      ${n && n.note ? `<p class="warn fs-warn">${n.note}</p>` : ""}
      ${
        it.gr != null && it.c !== 0
          ? `<div class="fs-grade${anim ? " anim" : ""}${it.gr === 5 ? " rare" : ""}"><span>Сохранность</span><b>${GRADES[it.gr].n}, цена ×${String(grM(it)).replace(".", ",")}</b><ol aria-hidden="true">${GRADES.slice(
              0,
              it.gr === 5 ? 6 : 5
            )
              .map(
                (g, k) =>
                  `<li class="g${k}${k <= it.gr ? " on" : ""}${k === it.gr ? " fin" : ""}${k === 5 ? " r" : ""}" style="--d:${k * 0.18}s"></li>`
              )
              .join("")}</ol></div>`
          : it.gr != null
            ? ""
            : `<div class="fs-cond"><span>Состояние</span><b>${cond}%</b><i style="--w:${cond}%"></i></div>`
      }
      <h3 class="fs-q">Куда отдать</h3>${opts}
      ${SI ? "" : `<p class="fs-keep">Можно оставить находку у себя</p>`}`;
  }
  box.innerHTML = `<div class="fs-back" onclick="SK.closeFind()"></div><div class="fs${openFind && openFind.story ? " story" : ""}" role="dialog" aria-label="Находка"><span class="fs-grip"></span><button class="sx" onclick="SK.closeFind()" aria-label="Закрыть">${pxi("x", 16)}</button>${body}<button class="btn ghost fs-ret" onclick="SK.closeFind()">К находкам</button></div>`;
  box.hidden = false;
}
