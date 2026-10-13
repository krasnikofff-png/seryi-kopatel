// ================= БАРАХОЛКА (7-й уровень) =================
// Лоты вслепую: что внутри — видно только после покупки. В коробках и чемоданах бывают письма и фото с наводками на места.
const FLEA_ART = {
  box: "@art(flea/box.png)",
  sack: "@art(flea/sack.png)",
  case: "@art(flea/case.png)",
  pack: "@art(flea/letters.png)",
  letter: "@art(flea/letter.png)",
  photo: "@art(flea/photo.png)"
};
const LOTS = {
  box: {
    n: "Коробка с чердака",
    d: "Хозяйка не открывала: «всё дедово, забирайте». Быт и монеты, бывает военное.",
    pr: [2800, 3800],
    k: [2, 4],
    cls: [0.1, 0.55, 0.25, 0.08, 0.02],
    era: [0.45, 0.35, 0.2, 0, 0],
    lead: 0.35
  },
  sack: {
    n: "Мешок железа",
    d: "Ржавчина со всего района. В основном лом, но иногда попадается штык или каска.",
    pr: [1600, 2400],
    k: [3, 5],
    cls: [0.6, 0.3, 0, 0.1, 0],
    era: [0.4, 0.45, 0.15, 0, 0],
    iron: 1,
    lead: 0
  },
  case: {
    n: "Дедов чемодан",
    d: "Тяжёлый, с медными уголками. Продавец просит дорого и божится, что не заглядывал.",
    pr: [10000, 15000],
    k: [3, 4],
    cls: [0, 0.25, 0.35, 0.3, 0.1],
    era: [0.2, 0.45, 0.3, 0.05, 0],
    lead: 0.6
  },
  pack: {
    n: "Пачка старых писем",
    d: "Перевязана бечёвкой. Вещей нет — только письма и фото. В них бывают наводки на места.",
    pr: [1500, 2500],
    k: [0, 0],
    lead: 1
  }
};
const FLEA_SELLER = [
  "Тётка в пуховом платке: «Всё с чердаков, сынок. Сама не знаю, что там».",
  "Дед с тележкой: «Не открывал и тебе не советую — открывай дома».",
  "Парень в спортивном костюме: «Из расселённого дома. Берёшь — не глядя».",
  "Старушка у вокзала: «Мужнино. Мне уже ни к чему»."
];
// наводки: письма и фото ведут на место, где закопан клад
const LEADS = [
  {
    k: "letter",
    reg: 1,
    c: 2,
    n: 3,
    era: 2,
    place: "Хутор Сычи",
    note: "письмо 1930 г.",
    mark: "под углом амбара",
    text: "«Отцовские царские в горшке — под углом амбара, с полуденной стороны. Нас увозят. Бог даст, вернёмся»."
  },
  {
    k: "photo",
    reg: 1,
    c: 4,
    n: 1,
    era: 2,
    place: "Липовка, у колодца",
    note: "фото 1912 г.",
    mark: "камень у колодца",
    text: "Семья у колодца. На обороте карандашом: «Серебро — под камнем, что у колодца»."
  },
  {
    k: "letter",
    reg: 1,
    c: 2,
    n: 3,
    era: 2,
    place: "Часовня у Покровского",
    note: "открытка 1915 г.",
    mark: "за часовней",
    text: "«Батюшка велел зарыть церковное за часовней, пока не утихнет». Подпись неразборчива."
  },
  {
    k: "letter",
    reg: 2,
    c: 3,
    n: 2,
    era: 1,
    place: "Блиндаж у Сосновки",
    note: "письмо с фронта, 1942",
    mark: "у трёх сосен, где блиндаж",
    text: "«Мама, мы с ребятами закопали ящик с наградами у трёх сосен, где наш блиндаж. Если не вернусь — достаньте»."
  },
  {
    k: "photo",
    reg: 2,
    c: 3,
    n: 1,
    era: 1,
    place: "Землянка у оврага",
    note: "фото 1943 г.",
    mark: "наша землянка",
    text: "Солдат у землянки. На обороте: «Наша землянка. Тут остался мой планшет»."
  },
  {
    k: "photo",
    reg: 2,
    c: 3,
    n: 2,
    era: 1,
    place: "Окопы у Красного",
    note: "схема на обороте фото, 1941",
    mark: "крестик у оврага",
    text: "На обороте фото — схема карандашом: дорога, овраг и крестик. Подпись: «оставили, не донести»."
  },
  {
    k: "letter",
    reg: 3,
    c: 4,
    n: 2,
    era: 2,
    place: "Остров на Гнилом болоте",
    note: "письмо из ссылки, 1931",
    mark: "остров, где прятались",
    text: "«На острове, где мы прятались от отряда, остался сундучок. Найдите, кто сможет»."
  },
  {
    k: "letter",
    reg: 3,
    c: 3,
    n: 2,
    era: 1,
    place: "Гать за Ольховкой",
    note: "письмо 1944 г.",
    mark: "у старой гати",
    text: "«Склад партизанский у старой гати, за ольшаником. Мы туда больше не вернёмся»."
  }
];
const LEAD_MAX = 4;
const rndInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function newLead() {
  G.leads = G.leads || [];
  if (G.leads.length >= LEAD_MAX) return null;
  const maxR = TRANSPORT[G.transport].region,
    have = G.leads.map(l => l.i);
  let pool = LEADS.map((l, i) => i).filter(i => LEADS[i].reg <= maxR && !have.includes(i));
  const used = G.leadUsed || [];
  const fresh = pool.filter(i => !used.includes(i));
  if (fresh.length) pool = fresh;
  else G.leadUsed = [];
  if (!pool.length) return null;
  const i = pick(pool),
    L = { i };
  G.leads.push(L);
  (G.leadUsed = G.leadUsed || []).push(i);
  return LEADS[i];
}
function fleaItem(c, eraW, iron) {
  let pool = CAT.filter(q => q[0] === c && (!iron || q[3]));
  if (!pool.length) pool = CAT.filter(q => q[0] === c);
  const ws = pool.map(q => eraW[q[1]] || 0.01),
    s = ws.reduce((a, b) => a + b, 0),
    q = pool[pickW(ws.map(w => w / s))];
  return {
    name: q[2],
    c,
    era: q[1],
    iron: q[3],
    w: q[4],
    base: econBase(c, q[1], 1),
    cond: 0.8,
    depth: 0,
    clean: true,
    gr: c === 0 ? 2 : pickW([0.15, 0.35, 0.32, 0.13, 0.05]),
    flea: 1
  };
}
function fleaStall() {
  if (!G.flea || G.flea.t !== G.trips) {
    const types = Object.keys(LOTS).filter(k => k !== "pack" || (G.leads || []).length < LEAD_MAX);
    const lots = [];
    while (lots.length < 3 && types.length) {
      const k = types.splice(Math.floor(Math.random() * types.length), 1)[0],
        L = LOTS[k];
      lots.push({ k, p: Math.round(rndInt(L.pr[0], L.pr[1]) / 100) * 100 });
    }
    G.flea = { t: G.trips, lots, s: Math.floor(Math.random() * FLEA_SELLER.length) };
  }
  return G.flea;
}
let fleaOpen = null; // что показываем: null — ряды, иначе результат покупки
function openFlea() {
  if (!perk("flea")) return;
  fleaStall();
  fleaOpen = null;
  renderFlea();
  $("fleaOver").hidden = false;
  SFX.paper();
}
function closeFlea() {
  $("fleaOver").hidden = true;
  fleaOpen = null;
  renderBase();
}
function buyLot(j) {
  const st = fleaStall(),
    lot = st.lots[j];
  if (!lot || lot.sold || G.money < lot.p) return;
  const L = LOTS[lot.k];
  G.money -= lot.p;
  lot.sold = 1;
  const got = [],
    leads = [];
  const n = rndInt(L.k[0], L.k[1]);
  for (let i = 0; i < n; i++) {
    const it = fleaItem(pickW(L.cls), L.era, L.iron);
    if (it.c > 0) dexAdd(it.name);
    G.inv.push(it);
    got.push(it);
  }
  if (Math.random() < L.lead) {
    const ld = newLead();
    if (ld) leads.push(ld);
    if (lot.k === "pack" && Math.random() < 0.3) {
      const l2 = newLead();
      if (l2) leads.push(l2);
    }
  }
  fleaOpen = { lot, got, leads };
  SFX.coins(2);
  if (leads.length) setTimeout(() => SFX.paper(), 300);
  save();
  renderFlea();
}
const fleaTag = it =>
  it.c === 0 ? "мусор — только в металлолом" : `${CLASSES[it.c].name} · сохранность «${GRADES[it.gr].n.toLowerCase()}»`;
function leadCard(L, small) {
  return `<div class="fl-lead${small ? " sm" : ""}"><img src="${FLEA_ART[L.k]}" alt=""><div><b>${L.note[0].toUpperCase() + L.note.slice(1)}</b><p>${L.text}</p>${small ? "" : `<small>Наводка: ${L.place} (${REG_SHORT_NAME[L.reg].toLowerCase()}) — появилась в блокноте на вкладке «Карты»</small>`}</div></div>`;
}
function renderFlea() {
  const s = $("fleaSheet"),
    st = fleaStall();
  if (fleaOpen) {
    const { lot, got, leads } = fleaOpen,
      L = LOTS[lot.k];
    const val = got.reduce((a, it) => a + (it.c === 0 ? 0 : sellPrice(it, CHANNELS[1])), 0);
    s.innerHTML = `<h2>${L.n}</h2><p class="fl-sub">Заплатили ${rub(lot.p)}.${got.some(i => i.c > 0) ? ` Антиквар дал бы за всё ~${rub(val)}.` : ""}</p>${got.length ? `<ul class="mg-got fl-got">${got.map(it => `<li><img src="${FIND_IMG[it.name] || ""}" alt=""><span>${it.name}<small class="k${it.c}">${fleaTag(it)}</small></span></li>`).join("")}</ul>` : ""}${leads.map(l => leadCard(l)).join("")}${!got.length && !leads.length ? `<p>Пусто: только газеты и пыль.</p>` : ""}${lot.k === "pack" && !leads.length ? `<p>Письма как письма — про погоду и урожай. Наводок нет.</p>` : ""}<div class="row"><button class="btn" onclick="SK.fleaBack()">К рядам</button></div>`;
    return;
  }
  const leadsN = (G.leads || []).length;
  s.innerHTML = `<h2>Барахолка</h2><p class="fl-sub">${FLEA_SELLER[st.s]}</p><div class="fl-lots">${st.lots
    .map((lot, j) => {
      const L = LOTS[lot.k],
        can = !lot.sold && G.money >= lot.p;
      return `<div class="fl-lot${lot.sold ? " sold" : ""}"><img src="${FLEA_ART[lot.k]}" alt=""><div class="fl-b"><b>${L.n}</b><p>${L.d}</p>${lot.sold ? `<span class="fl-sold">Продано</span>` : `<button class="btn fl-buy" ${can ? "" : "disabled"} onclick="SK.buyLot(${j})">Купить · ${rub(lot.p)}</button>${can ? "" : `<small class="fl-warn">Не хватает ${rub(lot.p - G.money)}</small>`}`}</div></div>`;
    })
    .join(
      ""
    )}</div><p class="fl-note">Что внутри — видно только после покупки. Вещи уже чистые: их сразу можно продать. Новые лоты — после следующей поездки.${leadsN ? ` Наводок в блокноте: ${leadsN}.` : ""}</p><button class="btn ghost" onclick="SK.fleaClose()">Уйти</button>`;
}
// блокнот: барахолка и наводки
function fleaNb() {
  if (!perk("flea")) return "";
  const maxR = TRANSPORT[G.transport].region;
  const leads = (G.leads || [])
    .map((l, j) => {
      const L = LEADS[l.i];
      if (!L) return "";
      const ok = L.reg <= maxR;
      return `<div class="nbc lead"><div class="nbc-pic spr"><img src="${FLEA_ART[L.k]}" alt=""></div><div class="nbc-b"><span class="nbc-hand">${L.note.replace(/^.*?(\d{4}).*$/, "$1")}</span><h3>${L.place}</h3><p>${L.text}</p><ul><li>${NBI.zone}<span>Зона: маленькая, точно по ${L.k === "photo" ? "фото" : "письму"}</span></li><li>${NBI.box}<span>Клад: ${["", "бытовые вещи", "монеты", "военное", "редкая вещь"][L.c]}${L.n > 1 ? ` · ${L.n} ${plural(L.n, "вещь", "вещи", "вещей")}` : ""}</span></li><li>${NBI.road}<span>${REG_IN[L.reg]} · один раз</span></li></ul>${ok ? `<button class="nb-btn" onclick="SK.goLead(${j})">Ехать по наводке</button>` : `<button class="nb-btn" disabled>${LOCK_SVG} Не доехать</button><p class="nb-warn">Нужен транспорт до глуши</p>`}</div></div>`;
    })
    .join("");
  const st = fleaStall(),
    left = st.lots.filter(l => !l.sold).length;
  return `${leads}<div class="nbc flea"><div class="nbc-pic spr"><img src="${FLEA_ART.box}" alt=""></div><div class="nbc-b"><h3>Барахолка</h3><p>У вокзала по выходным торгуют чужими чердаками. Лоты вслепую, а в старых письмах бывают наводки на места.</p><ul><li>${NBI.box}<span>Лотов сегодня: ${left} из ${st.lots.length}</span></li><li>${NBI.bars}<span>Вещи уже чистые</span></li></ul><button class="nb-btn" onclick="SK.openFlea()">Зайти</button></div></div>`;
}
function leadMap(L) {
  const eraW = [0.1, 0.1, 0.1, 0.05, 0];
  eraW[L.era] += 0.6;
  return {
    id: 6,
    name: L.place,
    zoneR: 5.5,
    shownR: 6.5,
    offset: 0.8,
    probs: [0.15, 0.3, 0.3, 0.2, 0.05],
    eraW,
    n: 22,
    hint: where =>
      `${L.k === "photo" ? "На обороте фото" : "В письме"}: «${L.mark}». Искать ${where}. Стрелка у края экрана покажет направление.`
  };
}
function goLead(j) {
  const l = (G.leads || [])[j],
    L = l && LEADS[l.i];
  if (!L || L.reg > TRANSPORT[G.transport].region) return;
  G.leads.splice(j, 1);
  G.inv.forEach(i => delete i._new);
  G.msg = "";
  const t = newTrip(leadMap(L), L.reg),
    mult = REGIONS[L.reg].mult,
    taken = new Set(t.items.map(i => i.tx + "," + i.ty));
  // клад по наводке: у самой отметки
  const cx = Math.floor(t.zc.x / TS),
    cy = Math.floor(t.zc.y / TS);
  let k = 0;
  for (let r = 0; r < 5 && k < L.n; r++)
    for (let dx = -r; dx <= r && k < L.n; dx++)
      for (let dy = -r; dy <= r && k < L.n; dy++) {
        const tx = cx + dx,
          ty = cy + dy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || taken.has(tx + "," + ty) || !diggable(tx, ty)) continue;
        if (Math.random() < 0.5 && r < 3) continue;
        taken.add(tx + "," + ty);
        let it = makeItem(L.c, null, mult, L.era, true);
        for (let a = 0; a < 6 && it.c !== L.c; a++) it = makeItem(L.c, null, mult, L.era, true);
        it.base = Math.round((it.base * 1.5) / 10) * 10;
        it.cache = true;
        it.depth = Math.min(it.depth, 70);
        t.items.push(
          Object.assign({ tx, ty, x: tx * TS + 6 + Math.random() * 4, y: ty * TS + 6 + Math.random() * 4 }, it)
        );
        k++;
      }
  t.lead = { name: L.place, note: L.note };
  loadTrip(t);
  save();
  showField();
}
