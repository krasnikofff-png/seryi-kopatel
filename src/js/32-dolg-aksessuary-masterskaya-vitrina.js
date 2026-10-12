// ===== ДОЛГ, АКСЕССУАРЫ, МАСТЕРСКАЯ, ВИТРИНА =====
const DEBT0 = 150000,
  DEBT_PAY = 5000,
  DEBT_EVERY = 5,
  DEBT_FINE = 15000,
  DEBT_STEP = 1000,
  DEBT_CAP = 20000,
  DEBT_RATE = 0.03;
// минимальный платёж растёт на 1000 ₽ каждый месяц; на остаток капает 3% в месяц
const debtMin = () => Math.min(G.debt, DEBT_CAP, DEBT_PAY + DEBT_STEP * (G.debtM || 0));
const collDue = () => Math.min(G.debt, debtMin() * 2);
function debtMonth() {
  let o = "";
  if (G.debt > 0) {
    const pr = Math.round(G.debt * DEBT_RATE);
    G.debt += pr;
    o = ` Проценты за месяц: +${rub(pr)}.`;
  }
  G.debtM = (G.debtM || 0) + 1;
  return o;
}
const SHOP = [
  {
    sec: "acc",
    id: "phones",
    name: "Наушники",
    price: 2500,
    d: "Слышен даже слабый писк — радиус детектора +4"
  },
  {
    sec: "acc",
    id: "lamp",
    name: "Налобный фонарь",
    price: 3500,
    d: "Копать на 2 часа дольше, чем позволяет световой день"
  },
  {
    sec: "acc",
    id: "pin",
    name: "Пинпоинтер",
    price: 4000,
    d: "Щуп показывает точную клетку, где лежит вещь, — без промахов. И быстрый копок почти не портит находки"
  },
  { sec: "acc", id: "coil", name: "Глубинная катушка", price: 9000, d: "Детектор слышит на 15 см глубже" },
  {
    sec: "ws",
    id: "bench",
    name: "Верстак",
    price: 6000,
    d: "Чистка своими руками: риск испортить вещь на 10% меньше"
  },
  {
    sec: "ws",
    id: "bath",
    name: "Ультразвуковая ванна",
    price: 25000,
    d: "Чистка своими руками вообще без риска",
    need: "bench"
  },
  {
    sec: "ws",
    id: "vit",
    name: "Витрина",
    price: 8000,
    d: "6 мест для лучших находок. После каждой поездки экскурсии приносят деньги"
  },
  { sec: "ws", id: "vit2", name: "Вторая витрина", price: 15000, d: "Ещё 6 мест в коллекции", need: "vit" }
];
const own = id => !!(G.own && G.own[id]);
const vitCap = () => (own("vit") ? 6 : 0) + (own("vit2") ? 6 : 0);
const VIT_SETS = [
  {
    id: "coins3",
    name: "Монеты трёх эпох",
    d: "монета войны, империи и старины",
    test: v => [1, 2, 3].every(e => v.some(i => i.c === 2 && i.era === e))
  },
  {
    id: "front",
    name: "Фронтовая полка",
    d: "три военные вещи из слоя войны",
    test: v => v.filter(i => i.c === 3 && i.era === 1).length >= 3
  },
  {
    id: "tsar",
    name: "Царская армия",
    d: "две военные вещи из слоя империи",
    test: v => v.filter(i => i.c === 3 && i.era === 2).length >= 2
  },
  {
    id: "old",
    name: "Старина",
    d: "три ценные вещи из слоя старины",
    test: v => v.filter(i => i.c >= 2 && i.era === 3).length >= 3
  },
  {
    id: "anc",
    name: "Древность",
    d: "две ценные вещи из слоя древности",
    test: v => v.filter(i => i.c >= 2 && i.era === 4).length >= 2
  }
];
function vitIncome() {
  const v = G.vit || [];
  if (!v.length) return 0;
  const sets = VIT_SETS.filter(x => x.test(v)).length;
  return Math.round((v.reduce((a, i) => a + i.base * grM(i), 0) * 0.05 * (1 + sets * 0.2)) / 10) * 10;
}
function debtTick() {
  // раз в DEBT_EVERY поездок — платёж
  if (!(G.debt > 0)) return "";
  if (G.trips - G.debtTrip < DEBT_EVERY) return "";
  let out = "";
  const need = Math.max(0, debtMin() - (G.debtPaid || 0));
  if (need === 0) {
    out = " Платёж по долгу в этом месяце уже внесён.";
    G.debtMiss = 0;
  } else if (G.money >= need) {
    G.money -= need;
    G.debt = Math.max(0, G.debt - need);
    G.debtMiss = 0;
    out = ` Списан платёж по долгу: ${rub(need)}.`;
  } else {
    G.debt += DEBT_FINE;
    G.debtMiss = (G.debtMiss || 0) + 1;
    G.msgBad = true;
    out = ` <b>Звонил коллектор.</b> Платёж не внесён — штраф ${rub(DEBT_FINE)}.${G.debtMiss >= 2 ? " «Всё, Серый. Жди в гости — приеду прямо к тебе на копку»." : " «Ещё раз пропустишь — приеду сам»."}`;
  }
  out += debtMonth();
  if (G.debt > 0) out += ` Долг: ${rub(G.debt)}. Следующий платёж — ${rub(debtMin())}.`;
  else out += " <b>Долг закрыт!</b>";
  G.debtTrip = G.trips;
  G.debtPaid = 0;
  G.debtOk = 0;
  return out;
}
function payDebt(n) {
  if (!(G.debt > 0)) return;
  const req = debtMin();
  n = Math.min(n, G.debt, G.money);
  if (n <= 0) return;
  SFX.cash();
  G.money -= n;
  G.debt -= n;
  G.debtPaid = (G.debtPaid || 0) + n;
  let closed = false,
    pr = "";
  if (G.debt > 0 && G.debtPaid >= req) {
    pr = debtMonth();
    G.debtTrip = G.trips;
    G.debtPaid = 0;
    G.debtOk = 1;
    G.debtMiss = 0;
    closed = true;
  } // месяц закрыт — отсчёт до следующего платежа заново
  msg(
    G.debt > 0
      ? `Внесено ${rub(n)} в счёт долга. Осталось ${rub(G.debt)}.${closed ? ` <b>Платёж за этот месяц внесён.</b>${pr} Следующий — ${rub(debtMin())} через ${DEBT_EVERY} ${plural(DEBT_EVERY, "поездку", "поездки", "поездок")}.` : ""}`
      : `<b>Долг закрыт!</b> Больше никаких коллекторов — теперь всё, что найдёте, ваше.`
  );
  save();
  renderBase();
}
function debtHelp() {
  const o = $("debtOver");
  if (!o) return;
  const d = G.debt > 0;
  $("debtSheet").innerHTML = `<h2>Долг за гараж</h2>
  <p>Полтора года назад мы с приятелем открыли в гараже шиномонтаж и взяли займ — ${rub(DEBT0)} под залог гаража. Приятель уехал на север и не берёт трубку, шиномонтаж закрылся, а займ записан на меня. Не платить — заберут гараж со всем, что в нём.</p>
  <ul class="dh">
  <li>Раз в ${DEBT_EVERY} поездок списывается платёж${d ? ` — сейчас <b>${rub(debtMin())}</b>` : ""}. Каждый месяц он растёт на ${rub(DEBT_STEP)} (до ${rub(DEBT_CAP)}).</li>
  <li>На остаток капает 3% в месяц${d ? ` — сейчас это ≈ <b>${rub(Math.round(G.debt * DEBT_RATE))}</b>` : ""}. Чем быстрее гасите, тем меньше переплата.</li>
  <li>Можно внести заранее или больше минимума — всё идёт в счёт долга.</li>
  <li>Не хватило денег — штраф ${rub(DEBT_FINE)}. Две просрочки подряд — коллектор приедет прямо на копку.</li></ul>
  <button class="btn" onclick="document.getElementById('debtOver').hidden=true">Понятно</button>`;
  o.hidden = false;
}
function buyShop(id) {
  const x = SHOP.find(i => i.id === id);
  if (!x || own(id) || G.money < x.price || (x.need && !own(x.need))) return;
  G.money -= x.price;
  G.own = G.own || {};
  G.own[id] = 1;
  SFX.upgrade();
  msg(`Куплено: ${x.name}. ${x.d}.`);
  save();
  renderBase();
}
function toVit(i) {
  const it = G.inv[i];
  if (!it || !it.clean || it.c < 2 || it.story || it.leg || (G.vit || []).length >= vitCap()) return;
  G.vit = G.vit || [];
  const before = VIT_SETS.filter(x => x.test(G.vit)).map(x => x.id);
  G.vit.push(it);
  G.inv.splice(i, 1);
  openFind = null;
  const done = VIT_SETS.filter(
    x => x.test(G.vit) && !before.includes(x.id) && !(G.setsDone || []).includes(x.id)
  );
  done.forEach(x => {
    G.setsDone = (G.setsDone || []).concat(x.id);
    G.rep += 3;
  });
  gearTab = "ws";
  msg(
    `${it.name} — в витрину.${done.length ? ` <b>Собран набор «${done.map(x => x.name).join("», «")}»!</b> Совесть +${3 * done.length}, экскурсии дороже.` : ""}`
  );
  tab = "gear";
  save();
  renderBase();
}
function fromVit(k) {
  const it = (G.vit || [])[k];
  if (!it) return;
  G.vit.splice(k, 1);
  G.inv.push(it);
  msg(`${it.name} — снова в находках.`);
  save();
  renderBase();
}
function renderEcon() {
  let debt = "";
  if (G.debt > 0) {
    const left = Math.max(0, DEBT_EVERY - (G.trips - G.debtTrip)),
      need = Math.max(0, debtMin() - (G.debtPaid || 0)),
      mn = debtMin(),
      pct = Math.round((1 - G.debt / DEBT0) * 100);
    const when = left
        ? `через ${left} ${plural(left, "поездку", "поездки", "поездок")}`
        : "после этой поездки",
      pay = Math.min(need || mn, G.debt);
    debt = `<section class="eco debt mini"><div class="eco-h dq" onclick="SK.debtHelp()"><h2>Долг <span class="dq-i">?</span></h2><b>${rub(G.debt)}</b></div><div class="eco-bar"><i style="--w:${Math.max(0, Math.min(100, pct))}%"></i></div>
      <div class="debt-row"><div class="debt-pay">${G.debtOk && need === mn ? `<b class="debt-ok">✓ Внесено</b><small>следующий ${when}</small>` : need ? `<b>Платёж ${rub(need)}</b><small>${when}</small>` : `<b class="debt-ok">✓ Внесено</b><small>следующий ${when}</small>`}</div>
      ${G.money >= G.debt ? `<button onclick="SK.payDebt(${G.debt})">Погасить всё</button>` : `<button ${G.money < pay ? "disabled" : ""} onclick="SK.payDebt(${pay})">${G.debtOk && need === mn ? "Внести заранее" : "Внести"}</button>`}</div>${(G.debtMiss || 0) >= 2 ? `<div class="debt-warn">⚠ Коллектор приедет на следующую копку</div>` : (G.debtMiss || 0) === 1 ? `<div class="debt-warn">⚠ Одна просрочка — ещё одна, и приедет коллектор</div>` : ""}</section>`;
  } else
    debt = `<section class="eco debt done"><div class="eco-h"><h2>Долг</h2><b>закрыт</b></div><p>Коллекторы больше не звонят.</p></section>`;
  const card = x => {
    const has = own(x.id),
      lock = x.need && !own(x.need);
    return `<li class="eco-i${has ? " own" : ""}"><div><b>${x.name}</b><small>${x.d}</small></div>${has ? `<span class="eco-own">✓ есть</span>` : lock ? `<span class="eco-lock">Сначала: ${SHOP.find(i => i.id === x.need).name.toLowerCase()}</span>` : `<button ${G.money < x.price ? "disabled" : ""} onclick="SK.buyShop('${x.id}')">${rub(x.price)}</button>`}</li>`;
  };
  const acc = `<section class="eco"><div class="eco-h"><h2>Аксессуары к детектору</h2></div><p class="dim">Покупаются один раз и работают в каждой поездке.</p><ul class="eco-l">${SHOP.filter(
    x => x.sec === "acc"
  )
    .map(card)
    .join("")}</ul></section>`;
  const ws = `<section class="eco"><div class="eco-h"><h2>Мастерская</h2></div><p class="dim">Чистка находок дома и витрина для коллекции.</p><ul class="eco-l">${SHOP.filter(
    x => x.sec === "ws"
  )
    .map(card)
    .join("")}</ul></section>`;
  let vit = "";
  if (vitCap()) {
    const v = G.vit || [],
      inc = vitIncome();
    vit = `<section class="eco vit"><div class="eco-h"><h2>Витрина · ${v.length}/${vitCap()}</h2><b>${inc ? `+${rub(inc)} за поездку` : ""}</b></div>
      ${
        v.length
          ? `<ul class="vit-l">${v.map((it, k) => `<li><img src="${findPic(it)}" alt=""><span>${it.name}<small>${CLASSES[it.c].name} · ${grTxt(it)}</small></span><button onclick="SK.fromVit(${k})">Забрать</button></li>`).join("")}</ul>`
          : `<p>Пусто. Монеты, военное и редкое можно поставить в витрину из окна находки.</p>`
      }
      <div class="vit-sets">${VIT_SETS.map(x => {
        const ok = x.test(v);
        return `<span class="${ok ? "ok" : ""}">${ok ? "✓" : "○"} ${x.name}<small>${x.d}</small></span>`;
      }).join("")}</div>
      <p class="dim">Экскурсии: 5% стоимости выставленного за поездку, каждый собранный набор +20%.</p></section>`;
  }
  return { debt, acc, ws, vit };
}
const SHOP_TABS = { acc: "Аксессуары", ws: "Мастерская" };
function renderGear(GEAR) {
  if (!GEAR[gearTab] && !SHOP_TABS[gearTab]) gearTab = "shovel";
  const E = renderEcon(),
    items = t => SHOP.filter(x => x.sec === t),
    canBuy = t => items(t).some(x => !own(x.id) && !(x.need && !own(x.need)) && G.money >= x.price);
  const shopRow = `<div class="subtabs shop" role="tablist">${Object.keys(SHOP_TABS)
    .map(
      t =>
        `<button role="tab" aria-selected="${t === gearTab}" onclick="SK.gearTab('${t}')">${SHOP_TABS[t]}<small>${items(t).filter(x => own(x.id)).length}/${items(t).length}</small>${canBuy(t) ? `<i class="sdot" aria-label="можно купить"></i>` : ""}</button>`
    )
    .join("")}</div>`;
  const gearRow = `<div class="subtabs" role="tablist">${Object.keys(GEAR)
    .map(
      t =>
        `<button role="tab" aria-selected="${t === gearTab}" onclick="SK.gearTab('${t}')">${GEAR[t].label}<small>ур. ${G[t]}/${GEAR[t].tbl.length - 1}</small></button>`
    )
    .join("")}</div>`;
  if (SHOP_TABS[gearTab]) return E.debt + gearRow + shopRow + (gearTab === "acc" ? E.acc : E.ws + E.vit);
  const k = gearTab,
    g = GEAR[k],
    T = g.tbl,
    lv = G[k],
    img = GEAR_IMG[k],
    sh = GSHORT[k];
  let sel = gearSel[k];
  const MX = T.length - 1;
  if (!sel || sel <= lv || sel > MX) sel = Math.min(MX, lv + 1);
  const sub = gearRow + shopRow;
  let card;
  if (lv >= MX) {
    card = `<section class="upg"><div class="upg-h"><h2>${GWHAT[k][0][0].toUpperCase() + GWHAT[k][0].slice(1)} — максимум</h2><span>${MX} / ${MX}</span></div>
      <div class="upg-cols one"><figure><figcaption><b>${sh[MX]}</b><small>Сейчас · ур. ${MX}</small></figcaption><img src="${img[MX]}" alt="${T[MX].name}"></figure></div>
      <p class="upg-gain">Это лучшее, что есть</p></section>`;
  } else {
    const a = T[lv],
      b = T[sel],
      next = sel === lv + 1,
      rows = gearRows(k, a, b),
      after = T[sel + 1];
    const can = next && G.money >= b.price;
    const btn = !next
      ? `<button class="buy" disabled>Сначала нужен: ${sh[lv + 1]}</button><p class="buy-note">Улучшать можно только по порядку</p>`
      : can
        ? `<button class="buy" onclick="SK.buy('${k}')">Купить улучшение · ${rub(b.price)}</button><p class="buy-note">Останется ${rub(G.money - b.price)}</p>`
        : `<button class="buy" disabled>Не хватает ${rub(b.price - G.money)}</button><p class="buy-note">Нужно ${rub(b.price)}, у вас ${rub(G.money)}</p>`;
    card = `<section class="upg"><div class="upg-h"><h2>Улучшить ${GWHAT[k][0]}</h2><span>${lv} → ${sel} / ${MX}</span></div>
      <div class="upg-cols"><figure><figcaption><b>${sh[lv]}</b><small>Сейчас · ур. ${lv}</small></figcaption><img src="${img[lv]}" alt="${a.name}"></figure>
        <span class="upg-arr" aria-hidden="true">→</span>
        <figure><figcaption><b>${sh[sel]}</b><small>Уровень ${sel}</small></figcaption><img src="${img[sel]}" alt="${b.name}"></figure></div>
      <p class="upg-gain">${gearGain(k, a, b)}</p>
      <table class="cmp"><thead><tr><th>Параметр</th><th>Сейчас</th><th>После</th></tr></thead><tbody>
        ${rows.map(([ic, n, x, y, up]) => `<tr><td><span class="pi">${GI[ic]}</span>${n}</td><td>${x}</td><td class="${up ? "up" : ""}">${y}</td></tr>`).join("")}
      </tbody></table>
      <p class="upg-next">${after ? `Следующее улучшение: ${sh[sel + 1].toLowerCase().startsWith("«") ? sh[sel + 1] : sh[sel + 1].toLowerCase()}` : "Это последний уровень"}</p>
      ${btn}</section>`;
  }
  const list = `<div class="glist-h"><h2>${GWHAT[k][1]}</h2><small>${{ shovel: SHOVEL, det: DET, transport: TRANSPORT }[k].length - 1} уровней снаряжения · нажмите, чтобы сравнить</small></div>
    <ol class="glist">${T.slice(1)
      .map((x, i) => {
        const n = i + 1,
          st = n < lv ? "done" : n === lv ? "cur" : n === lv + 1 ? "next" : "far",
          pick = n === sel && n > lv;
        const badge =
          n === lv
            ? `<span class="gl-badge eq">✓ Экипирован</span>`
            : n === lv + 1
              ? `<span class="gl-badge nx">Следующий</span>`
              : "";
        const price =
          n < lv
            ? `<span class="gl-own">есть</span>`
            : n === lv
              ? ""
              : `<span class="gl-price">${rub(x.price)}<b aria-hidden="true">›</b></span>`;
        return `<li class="${st}${pick ? " pick" : ""}"${n > lv ? ` role="button" tabindex="0" onclick="SK.gearPick('${k}',${n})"` : ""}>
        <span class="gl-n">${n}</span><img src="${img[n]}" alt="">
        <span class="gl-b"><span class="gl-top"><b>${sh[n]}</b>${badge}</span><small>${GSUB[k][n]}</small><span class="gl-bot"><span class="gl-s">${gearStats(k, x)}</span>${price}</span></span></li>`;
      })
      .join("")}</ol>`;
  return E.debt + sub + card + list;
}
