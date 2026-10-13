// ================= ГАРАЖ: НАХОДКИ =================
let findFilter = "all",
  openFind = null;
// грязная находка: комок ржавчины, окисленная вещица или кружок — рисуется кодом, у каждой вещи свой
const dirtyCache = new Map();
function dirtySprite(it) {
  let seed = it.depth * 131 + Math.round(it.base) + Math.round(it.cond * 100) * 7;
  for (const ch of it.name) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
  const kind = it.c === 2 ? "coin" : it.iron ? "rust" : "patina",
    key = kind + seed;
  if (dirtyCache.has(key)) return dirtyCache.get(key);
  const c = document.createElement("canvas");
  c.width = c.height = 24;
  const g = c.getContext("2d"),
    r = rng(seed);
  const P = {
    rust: ["#5a2c16", "#7e3f1f", "#a3592e", "#c4773f", "#3b1d0f"],
    patina: ["#4a3a26", "#6b5638", "#8a7350", "#5e7a4a", "#2f2618"],
    coin: ["#4f3b24", "#6e5634", "#8d7247", "#a98d5a", "#33261a"]
  }[kind];
  const blob = (x, y, rx, ry, col) => {
    g.fillStyle = col;
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry))));
      g.fillRect(Math.round(x - w), Math.round(y + dy), w * 2 + 1, 1);
    }
  };
  if (kind === "coin") {
    blob(12, 12, 9, 9, P[4]);
    blob(12, 12, 8, 8, P[1]);
    blob(11, 11, 6, 6, P[2]);
    for (let i = 0; i < 26; i++) {
      g.fillStyle = P[Math.floor(r() * 4)];
      const a = r() * 6.28,
        d = r() * 7;
      g.fillRect(Math.round(12 + Math.cos(a) * d), Math.round(12 + Math.sin(a) * d), 1, 1);
    }
  } else {
    const ang = r() * 3.14,
      len = kind === "rust" ? 6 + r() * 3 : 3 + r() * 2,
      n = kind === "rust" ? 6 : 6;
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1) - 0.5) * 2 * len,
        x = 12 + Math.cos(ang) * t + (r() - 0.5) * 3,
        y = 12 + Math.sin(ang) * t * 0.7 + (r() - 0.5) * 3,
        rx = (kind === "rust" ? 3 : 4.5) + r() * 2.5,
        ry = (kind === "rust" ? 2.5 : 3.5) + r() * 2;
      blob(x, y + 1, rx + 1, ry + 1, P[4]);
      blob(x, y, rx, ry, P[1]);
    }
    for (let i = 0; i < 120; i++) {
      g.fillStyle = P[Math.floor(r() * 5)];
      g.fillRect(Math.round(12 + (r() - 0.5) * 20), Math.round(12 + (r() - 0.5) * 16), 1, 1);
    }
    g.fillStyle = P[3];
    for (let i = 0; i < 6; i++) g.fillRect(Math.round(8 + r() * 8), Math.round(8 + r() * 6), 2, 1);
    // убрать крошки вне комка
    const d = g.getImageData(0, 0, 24, 24);
    for (let i = 0; i < 24 * 24; i++) {
      const x = i % 24,
        y = Math.floor(i / 24);
      let nb = 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
      ]) {
        const j = ((y + dy) * 24 + (x + dx)) * 4;
        if (x + dx >= 0 && x + dx < 24 && y + dy >= 0 && y + dy < 24 && d.data[j + 3]) nb++;
      }
      if (nb < 2) d.data[i * 4 + 3] = 0;
    }
    g.putImageData(d, 0, 0);
  }
  const url = c.toDataURL();
  dirtyCache.set(key, url);
  return url;
}
const findPic = it =>
  it.clean
    ? it.story
      ? storyItemPic(it.story)
      : FIND_IMG[it.name] || dirtySprite(it)
    : it.story
      ? dirtySprite(it)
      : FIND_IMG[it.name] || dirtySprite(it);
const eraCap = e => {
  const n = ERAS[e].name;
  return n[0].toUpperCase() + n.slice(1);
};
const notCleanTxt = it => (it.c === 2 ? "Не очищен" : "Не очищена");
function bestPrice(it) {
  if (it.leg) return LEGENDS[it.leg].price;
  const ant = CHANNELS[1].open();
  return sellPrice(it, ant ? CHANNELS[1] : CHANNELS[0]);
}
const FI = {
  chev: '<svg viewBox="0 0 20 20" class="chev"><path d="M7.5 4.5L13 10l-5.5 5.5"/></svg>',
  coins:
    '<svg viewBox="0 0 24 24"><ellipse cx="9" cy="7" rx="6" ry="2.5"/><path d="M3 7v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7"/><path d="M9 13.5v3c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4c0-1.4-2.7-2.5-6-2.5"/></svg>',
  museum:
    '<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
  dark: '<svg viewBox="0 0 24 24"><path d="M12 3c4 3 6 5.5 6 9a6 6 0 01-12 0c0-3.5 2-6 6-9z"/><path d="M9.5 13.5h5"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
  brush: '<svg viewBox="0 0 24 24"><path d="M14 4l6 6-7.5 7.5-6-6zM6.5 11.5L4 20l8.5-2.5"/></svg>',
  hand: '<svg viewBox="0 0 24 24"><path d="M7 11V5.5a1.5 1.5 0 013 0V10M10 9.5V4a1.5 1.5 0 013 0v6M13 9V5a1.5 1.5 0 013 0v6M16 10V8a1.5 1.5 0 013 0v5c0 4-2.5 7-7 7-3 0-4.5-1.5-6-4l-2-3.5a1.5 1.5 0 012.5-1.5L7 13"/></svg>',
  scrap: '<svg viewBox="0 0 24 24"><path d="M4 7h16l-1.5 13h-13zM9 7V4h6v3M9.5 11v5M14.5 11v5"/></svg>',
  ok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="M7 12.5l3.2 3.2L17 9" stroke="#211a12" stroke-width="2.6"/></svg>'
};
function renderFinds() {
  if (!G.inv.length)
    return (
      legShelf() +
      albumShelf() +
      `<section class="fbox"><h2 class="fh">Находки · 0</h2><p class="empty">Находок пока нет. На вкладке «Карты» можно поехать по карте или наугад.</p></section>`
    );
  const dirty = G.inv.filter(i => !i.clean),
    clean = G.inv.filter(i => i.clean),
    junk = clean.filter(i => i.c === 0);
  const list = G.inv
    .map((it, i) => [it, i])
    .filter(([it]) => findFilter === "all" || (findFilter === "dirty" ? !it.clean : it.clean));
  const seg = [
    ["all", "Все"],
    ["dirty", "Не очищены"],
    ["clean", "Опознаны"]
  ]
    .map(
      ([k, t]) => `<button aria-pressed="${findFilter === k}" onclick="SK.findFilter('${k}')">${t}</button>`
    )
    .join("");
  let bulk = "";
  if (dirty.length > 1 && findFilter !== "clean")
    bulk += `<div class="fbulk"><span>Не очищено: ${dirty.length}</span><button ${G.money < dirty.length * CLEAN_FEE ? "disabled" : ""} onclick="SK.cleanAll(false)">Всё мастеру · ${rub(dirty.length * CLEAN_FEE)}</button></div>`;
  if (junk.length > 1 && findFilter !== "dirty")
    bulk += `<div class="fbulk"><span>Мусор: ${junk.length}</span><button onclick="SK.sellJunk()">Всё в металлолом</button></div>`;
  const sellable = clean.filter(i => !i.story && !i.leg && i.c !== 0); // мусор — отдельно, в металлолом
  if (sellable.length > 1 && findFilter !== "dirty") {
    const sum = sellable.reduce((a, i) => a + sellPrice(i, CHANNELS[0]), 0);
    bulk += `<div class="fbulk"><span>Опознано: ${sellable.length}</span><button onclick="SK.sellAllBuy()">Сдать всё скупщику · ~${rub(sum)}</button></div>`;
  }
  const antInfo = CHANNELS[1].open()
    ? `<div class="antinfo"><b>Антиквар сейчас ищет:</b> ${(G.antWant || []).map(w => w.t).join(", ")}. Возьмёт ещё ${G.antLeft} ${plural(G.antLeft, "вещь", "вещи", "вещей")}.${G.antDue ? ` На комиссии: ${rub(G.antDue)} — придут после следующей поездки.` : ""}</div>`
    : "";
  const ordInfo = G.order
    ? `<div class="antinfo ord"><b>Заказ коллекционера:</b> «${G.order.name}» — заплатит вдвое против антиквара. Осталось ${G.order.left} ${plural(G.order.left, "поездка", "поездки", "поездок")}.</div>`
    : "";
  bulk = ordInfo + antInfo + bulk;
  const rows = list
    .map(([it, i]) => {
      const meta = `${eraCap(it.era)} · ${it.depth} см${it.cache ? " · тайник" : ""}`;
      if (!it.clean)
        return `<li class="fi" onclick="SK.openFind(${i})"><span class="fpic"><img src="${findPic(it)}" alt=""></span>
      <span class="fb"><b>${shownName(it)}</b>
        <span class="frow"><span class="fchip dirty">${notCleanTxt(it)}</span><span class="fclean"><button ${G.money < CLEAN_FEE ? "disabled" : ""} onclick="event.stopPropagation();SK.clean(${i},false)">Очистить · ${rub(CLEAN_FEE)}</button><button class="self" onclick="event.stopPropagation();SK.clean(${i},true)" title="Бесплатно. Только так видна редкая разновидность, но можно поцарапать">Сам</button></span></span>
        <small>${it.leg ? `<b class="legtxt">★ Легенда</b> · ${meta}` : it.story || it.c === 0 ? meta : `${rub(priceRange(it)[0])} – ${rub(priceRange(it)[1])} · ${meta}`}</small></span>${FI.chev}</li>`;
      return `<li class="fi ok c${it.c}${it.leg ? " leg" : ""}" onclick="SK.openFind(${i})"><span class="fpic"><img src="${findPic(it)}" alt=""></span>
      <span class="fb"><b>${it.name}</b><span class="frow">${it.leg ? `<span class="fchip legchip">★ Легенда</span>` : `<span class="fchip k${it.c}">${CLASSES[it.c].name}</span>`}</span>
        <small>${it.leg ? "Уникальная" : grTxt(it)[0].toUpperCase() + grTxt(it).slice(1)} · <em>${it.c === 0 ? "металлолом" : it.leg && !bestPrice(it) ? "бесценно" : rub(bestPrice(it))}</em></small><small>${meta}</small></span>${FI.chev}</li>`;
    })
    .join("");
  return (
    legShelf() +
    albumShelf() +
    `<section class="fbox"><h2 class="fh">Находки · ${G.inv.length}</h2><div class="fseg">${seg}</div>${bulk}
    <p class="fpick">${list.length ? "Выберите предмет" : "Здесь пока пусто"}</p><ol class="flist">${rows}</ol></section>
    <p class="hint">Чёрный рынок платит больше всех, но растёт внимание полиции (шанс облавы сейчас ${Math.min(100, Math.round(G.heat * 7 * (1 - sk("svyazi") * 0.08) * (G.rep <= -15 ? 2 : 1)))}%). Дар музею поднимает совесть: чем старше вещь, тем больше. Антиквар платит вдвое больше скупщика и открывается на ${ANT_LVL}-м уровне.</p>`
  );
}
const archRep = it => Math.max(2, Math.round(giftRep(it) * 1.5));
function toArch(i) {
  const it = G.inv[i];
  if (!it) return;
  const d = archRep(it),
    was = rank().name;
  G.rep += d;
  G.heat = Math.max(0, G.heat - 1);
  G.arch = (G.arch || 0) + 1;
  G.inv.splice(i, 1);
  openFind = null;
  SFX.museum();
  msg(
    `Археологи записали «${it.name}» в полевую опись и пожали руку. Совесть +${d}, полиция −1.${G.arch === 3 ? " <b>Экспедиция поручилась за вас: «Архивная карта» теперь на 30% дешевле.</b>" : ""}`
  );
  if (rank().name !== was) G.msg += `<br><b>Новое звание: «${rank().name}»</b> — ${rank().perk}.`;
  save();
  renderBase();
}
function toDed(i) {
  const it = G.inv[i];
  if (!it || !it.nyura) return;
  G.rep += 5;
  G.nyuraB = "ded";
  G.inv.splice(i, 1);
  openFind = null;
  SFX.museum();
  msg(
    `Дед долго вертел брошку в пальцах. «Нюркина… Она её никогда не снимала. Деревню затопили, а она так и не поехала смотреть». Брошка теперь стоит у него на комоде. Совесть +5.`
  );
  save();
  renderBase();
}
function legSheet(it, i, opt, meta) {
  const L = LEGENDS[it.leg],
    id = it.leg;
  let o = "";
  const no = (t, why) => opt("locked", FI.lock, t, why, "—", "", true);
  if (id === "capsule") {
    o += opt(
      "green",
      FI.museum,
      "Отдать в музей",
      "Пусть письмо прочитают все",
      "+12 к совести",
      `SK.sellLeg(${i},'mus')`
    );
    o += opt(
      "plain",
      FI.star,
      "Повесить в гараже",
      "Письмо в рамке над верстаком",
      "",
      `SK.sellLeg(${i},'wall')`
    );
    o += opt(
      "amber",
      FI.coins,
      "Продать скупщику",
      "Ему всё равно, что внутри",
      rub(L.price),
      `SK.sellLeg(${i},'buy')`
    );
  } else if (id === "star") {
    o += opt(
      "gold",
      FI.star,
      "Отдать внучке лётчика",
      "Бесплатно. Она живёт в Твери",
      "+30 к совести",
      `SK.sellLeg(${i},'family')`
    );
    o += opt(
      "dark",
      FI.dark,
      "Чёрный рынок",
      "−15 совести · полиция +4",
      rub(L.price),
      `SK.sellLeg(${i},'blk')`
    );
    o += no("Антиквар", "«Уберите. Я этого не видел»") + no("Скупщик", "Не берёт — боится");
  } else if (id === "helm") {
    o += opt(
      "gold",
      FI.museum,
      "Передать музею",
      "Премия за клад и статья в газете",
      `+40 к совести · ${rub(L.prize)}`,
      `SK.sellLeg(${i},'mus')`
    );
    o +=
      no("Чёрный рынок", "Слишком известная вещь — засветишься") +
      no("Антиквар", "Боится даже смотреть") +
      no("Скупщик", "«Ты что, с ума сошёл?»");
  } else {
    const antOpen = CHANNELS[1].open();
    o += antOpen
      ? opt(
          "gold",
          FI.star,
          "Продать антиквару",
          "Через аукцион · деньги после следующей поездки",
          rub(L.price),
          `SK.sellLeg(${i},'ant')`
        )
      : no("Антиквар", `Доступен с уровня ${ANT_LVL}`);
    o += opt(
      "amber",
      FI.coins,
      "Продать скупщику",
      "Сразу, но вдвое дешевле",
      rub(L.price / 2),
      `SK.sellLeg(${i},'buy')`
    );
    o += opt(
      "dark",
      FI.dark,
      "Чёрный рынок",
      "−10 совести · полиция +3",
      rub(Math.round(L.price * 1.4)),
      `SK.sellLeg(${i},'blk')`
    );
    o += opt(
      "green",
      FI.museum,
      "Подарить музею",
      "Об этом напишут все краеведы",
      "+25 к совести",
      `SK.sellLeg(${i},'mus')`
    );
  }
  return `<p class="fs-state legst">★ Легендарная находка</p>
    <img class="fs-pic" src="${findPic(it)}" alt=""><h2 class="fs-name">${it.name}</h2>
    <span class="fchip fs-chip legchip">Легенда · 1 из 5</span><p class="fs-meta">${meta}</p><p class="fs-note">${L.desc}</p>
    ${L.letter ? `<div class="fs-story"><p>${L.letter}</p></div>` : ""}
    <h3 class="fs-q">Что сделать с находкой?</h3>${o}<p class="fs-keep">Можно оставить находку у себя</p>`;
}
function sellLeg(i, how) {
  const it = G.inv[i];
  if (!it || !it.leg) return;
  const id = it.leg,
    L = LEGENDS[id],
    was = rank().name;
  let t = "";
  G.leg = G.leg || {};
  if (how === "mus") {
    const d = id === "helm" ? 40 : id === "capsule" ? 12 : 25;
    G.rep += d;
    SFX.museum();
    if (id === "helm") {
      G.money += L.prize;
      G.famous = 1;
      t = `<b>Шлем передан в музей.</b> Государство выплатило премию за клад: +${rub(L.prize)}. Совесть +${d}. Наутро про Серого написала областная газета: «Простой копатель нашёл шлем князя». Теперь его знают в лицо.`;
    } else t = `«${L.name}» — в дар музею. Директор долго жал руку. Совесть +${d}.`;
  } else if (how === "wall") {
    SFX.museum();
    t = `Письмо комсомольцев теперь висит в рамке над верстаком. Иногда Серый его перечитывает.`;
  } else if (how === "family") {
    G.rep += 30;
    SFX.museum();
    t = `<b>Внучка лётчика приехала из Твери.</b> Долго держала звезду в ладони и молчала, потом обняла Серого прямо у калитки. Совесть +30.`;
  } else if (how === "blk") {
    const p = Math.round((L.price || 0) * (id === "star" ? 1 : 1.4)),
      d = id === "star" ? 15 : 10;
    G.money += p;
    G.rep -= d;
    G.heat += id === "star" ? 4 : 3;
    SFX.coins(9);
    t = `Ушло за ${rub(p)} человеку без имени. Совесть −${d}, полиция насторожилась.`;
  } else if (how === "ant") {
    G.antDue = (G.antDue || 0) + L.price;
    SFX.coins(3);
    t = `Антиквар выставил «${L.name}» на закрытый аукцион. ${rub(L.price)} придут после следующей поездки.`;
  } else if (how === "buy") {
    const p = id === "capsule" ? L.price : L.price / 2;
    G.money += p;
    SFX.coins(9);
    t = `Скупщик забрал «${L.name}» за ${rub(p)}.`;
  }
  G.leg[id] = how;
  G.inv.splice(i, 1);
  openFind = null;
  msg(t);
  if (rank().name !== was) G.msg += `<br><b>Новое звание: «${rank().name}»</b> — ${rank().perk}.`;
  save();
  renderBase();
}
