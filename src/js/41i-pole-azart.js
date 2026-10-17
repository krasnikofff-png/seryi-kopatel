// ================= ДВИЖУХА В ПОЛЕ: ставка на сигнал, наводка дня, кубышка, конкурент =================
// Всё живёт в T (сохраняется вместе с поездкой): T.fart, T.q (наводка), T.rv (конкурент).

// строки, которые допишутся в карточку находки (ставка, фарт, выполненные задачи)
const cardX = [];
const cardXTake = () =>
  cardX
    .splice(0)
    .map(l => "<br>" + l)
    .join("");

// ---------- СТАВКА НА СИГНАЛ И ФАРТ ----------
// Пока детектор пищит над клеткой, можно угадать, что там. Угадал — фарт растёт (до 5), мимо — сгорает.
// Фарт: каждая находка дороже на 6% за ступень и даёт больше опыта.
const FART_MAX = 5,
  BET_NM = { coin: "монета", iron: "железо", color: "цветмет" };
let betTile = null,
  betKey = "";
const betKind = it => (it.c === 2 && !it.iron ? "coin" : it.iron ? "iron" : "color");
function betSync(sig) {
  const row = $("betRow");
  if (!row) return;
  const t = pTile(),
    k = t.tx + "," + t.ty;
  if (betTile && betTile.k !== k) betTile = null;
  const show = !!T && !paused && !path.length && digT <= 0 && ((sig && sig.s > 0.3) || !!betTile);
  const key = show ? k + "|" + (betTile ? betTile.b : "") + "|" + (T.fart || 0) : "";
  if (key === betKey) return;
  betKey = key;
  row.hidden = !show;
  if (!show) return;
  if (!G.betTip) {
    G.betTip = 1;
    toast(
      "<b>Что пищит?</b> Перед копкой можно угадать: монета, железо или цветмет. Угадали — растёт <b>фарт</b>: находки дороже, опыта больше. Ошиблись — фарт сгорает. Не уверены — просто копайте."
    );
  }
  const b = betTile && betTile.b;
  row.innerHTML = `<span class="bt-q">${b ? "Ставка:" : "Что там?"}</span>${["coin", "iron", "color"]
    .map(
      x =>
        `<button class="bt${b === x ? " on" : ""}" ${b && b !== x ? "disabled" : ""} onclick="SK.bet('${x}')">${BET_NM[x][0].toUpperCase() + BET_NM[x].slice(1)}</button>`
    )
    .join("")}`;
}
function bet(b) {
  if (!T || betTile) return;
  const t = pTile();
  betTile = { k: t.tx + "," + t.ty, b };
  betKey = "";
  SFX.clink && SFX.clink();
}
function fartChip() {
  const c = $("fartChip");
  if (!c) return;
  const f = (T && T.fart) || 0;
  c.hidden = !f;
  if (f)
    c.innerHTML = `<span>Фарт<small>находки дороже</small></span><span class="fp">${"<i></i>".repeat(f)}${'<i class="o"></i>'.repeat(FART_MAX - f)}</span>`;
}
// вызывается из копки, когда вещь вынута: проверяет ставку и даёт прибавку за фарт
function betResolve(got, it, tx, ty) {
  const k = tx + "," + ty;
  if (betTile && betTile.k === k && !got.story && !got.leg) {
    const ok = betTile.b === betKind(got);
    T.bets = (T.bets || 0) + 1;
    if (ok) {
      T.fart = Math.min(FART_MAX, (T.fart || 0) + 1);
      T.betOk = (T.betOk || 0) + 1;
      cardX.push(`<b class="bt-ok">Угадали: ${BET_NM[betTile.b]}!</b> Фарт ${T.fart} из ${FART_MAX}.`);
      SFX.coins && SFX.coins(2);
    } else {
      cardX.push(`<b class="bt-no">Мимо: это ${BET_NM[betKind(got)]}.</b>${T.fart ? " Фарт сгорел." : ""}`);
      T.fart = 0;
    }
    betTile = null;
    betKey = "";
  }
  const f = T.fart || 0;
  if (f && it.c > 0 && !it.story && !it.leg) {
    it.base = Math.round((it.base * (1 + 0.06 * f)) / 10) * 10;
    it.lucky = f;
  }
  fartChip();
  return f ? Math.round(CLASSES[got.c].xp * 0.15 * f) : 0;
}

// ---------- НАВОДКА ДНЯ: слух о месте + задачи на поездку ----------
const QLM = {
  well: { n: "старый колодец", nom: "старый колодец", v: "колодца" },
  stove: { n: "печище сгоревшей избы", nom: "печище сгоревшей избы", v: "печища" },
  dug: { n: "обвалившуюся землянку", nom: "обвалившаяся землянка", v: "землянки" }
};
const QLM_SAY = {
  well: "Бабка у магазина: «За полем старый колодец. Туда в войну всё бросали — и монеты, и ордена, чтоб немцу не досталось».",
  stove: "На форуме пишут: от сгоревшей избы осталась одна печь. Где печь — там жили, а где жили — там и теряли.",
  dug: "Дед говорил: в сорок втором тут стояли связисты, жили в землянке. Землянка обвалилась, а вещи остались."
};
const DIR8 = [
  "на востоке",
  "на юго-востоке",
  "на юге",
  "на юго-западе",
  "на западе",
  "на северо-западе",
  "на севере",
  "на северо-востоке"
];
function questGen(t, used, mult, map) {
  const kind =
    worldKind === "forest"
      ? "dug"
      : worldKind === "swamp"
        ? R() < 0.5
          ? "dug"
          : "well"
        : R() < 0.5
          ? "well"
          : "stove";
  // место для ориентира: ровная земля вокруг, подальше от машины
  let spot = null;
  for (let a = 0; a < 400 && !spot; a++) {
    const x = 40 + R() * (WW - 80),
      y = 110 + R() * (WH - 170),
      tx = Math.floor(x / TS),
      ty = Math.floor(y / TS);
    if (Math.hypot(x - t.px, y - t.py) < 14 * TS) continue;
    let ok = true;
    for (let dx = -2; dx <= 2 && ok; dx++)
      for (let dy = -2; dy <= 2 && ok; dy++) if (!diggable(tx + dx, ty + dy)) ok = false;
    if (ok) spot = { tx, ty, x: tx * TS + 8, y: ty * TS + 12, k: kind };
  }
  if (!spot) return;
  used.add(spot.tx + "," + spot.ty);
  const era = kind === "dug" ? 1 : null,
    eraW = kind === "dug" ? null : map.eraW || [0.4, 0.35, 0.25, 0, 0];
  let n = 0;
  for (let a = 0; a < 200 && n < 5; a++) {
    const tx = spot.tx + Math.round((R() - 0.5) * 6),
      ty = spot.ty + Math.round((R() - 0.5) * 6);
    if ((tx === spot.tx && ty === spot.ty) || used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
    used.add(tx + "," + ty);
    const it = makeItem(pickW([0.08, 0.3, 0.34, 0.22, 0.06]), eraW, mult, era == null ? undefined : era);
    t.items.push(Object.assign({ tx, ty, x: tx * TS + 4 + R() * 8, y: ty * TS + 4 + R() * 8, qs: 1 }, it));
    n++;
  }
  // кубышка: у колодца или печища — часто, иначе изредка где-то на поле
  if (kind !== "dug" ? R() < 0.45 : R() < 0.15) potPut(t, used, spot.tx, spot.ty, 3, mult);
  else if (R() < 0.12) potPut(t, used, Math.floor(t.zc.x / TS), Math.floor(t.zc.y / TS), 5, mult);
  const ang = Math.atan2(spot.y - WH / 2, spot.x - WW / 2),
    dir = DIR8[(Math.round(ang / (Math.PI / 4)) + 8) % 8];
  // задачи: ориентир всегда, плюс две случайные
  const eras = [...new Set(t.items.filter(i => !i.story && !i.leg && i.c > 0).map(i => i.era))],
    sh = SHOVEL[G.shovel].depth - (t.season === "winter" ? 10 : 0),
    deep = [80, 60, 45, 35].find(d => d <= sh - 5) || 30,
    pool = [
      { k: "coins", n: R() < 0.5 ? 2 : 3 },
      eras.length ? { k: "era", e: pick(eras) } : null,
      { k: "deep", d: deep },
      { k: "bets", n: R() < 0.5 ? 2 : 3 },
      { k: "care" }
    ].filter(Boolean);
  const tasks = [{ k: "spot" }];
  while (tasks.length < 3 && pool.length) tasks.push(pool.splice(Math.floor(R() * pool.length), 1)[0]);
  tasks.forEach(q => (q.pay = Math.round((mult * (q.k === "spot" ? 600 : 300 + R() * 300)) / 50) * 50));
  t.q = { kind, dir, spot, tasks, bonus: Math.round((mult * 1000) / 50) * 50 };
}
function potPut(t, used, cx, cy, rad, mult) {
  for (let a = 0; a < 80; a++) {
    const tx = cx + Math.round((R() - 0.5) * 2 * rad),
      ty = cy + Math.round((R() - 0.5) * 2 * rad);
    if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
    used.add(tx + "," + ty);
    const era = pickW([0.15, 0.25, 0.45, 0.15, 0]);
    t.items.push({
      tx,
      ty,
      x: tx * TS + 8,
      y: ty * TS + 8,
      c: 2,
      era,
      name: "Кубышка",
      iron: false,
      w: 0.6,
      base: 0,
      depth: Math.max(22, Math.min(SHOVEL[G.shovel].depth - 4, 70, ERAS[era].d[0] + 10 + Math.floor(R() * 15))),
      found: false,
      pot: 1,
      mult
    });
    return;
  }
}
const qText = q =>
  q.k === "spot"
    ? `Найти ${QLM[T.q.kind].n} и выкопать рядом вещь`
    : q.k === "coins"
      ? `Выкопать ${q.n} ${plural(q.n, "монету", "монеты", "монет")}`
      : q.k === "era"
        ? `Найти вещь — ${ERAS[q.e].name}`
        : q.k === "deep"
          ? `Докопаться до ${q.d} см`
          : q.k === "bets"
            ? `Угадать ${q.n} ${plural(q.n, "сигнал", "сигнала", "сигналов")}`
            : "Не повредить лопатой ни одной находки";
const qProg = q =>
  q.k === "coins"
    ? ` (${Math.min(q.n, T.qCoins || 0)}/${q.n})`
    : q.k === "bets"
      ? ` (${Math.min(q.n, T.betOk || 0)}/${q.n})`
      : "";
function qChip() {
  const b = $("qBtn");
  if (!b) return;
  const Q = T && T.q;
  b.hidden = !Q;
  if (!Q) return;
  const d = Q.tasks.filter(q => q.done).length;
  b.innerHTML = `${pxi("paper", 18)}<span>Наводка<small>задачи <b>${d} из ${Q.tasks.length}</b></small></span>`;
}
function qInfo() {
  const Q = T && T.q;
  if (!Q) return;
  toast(
    `<b>Наводка дня.</b> ${QLM_SAY[Q.kind]} Ищите ${Q.dir} поля.<br>${Q.tasks
      .map(
        q =>
          `${q.done ? pxi("check", 12) : q.fail ? pxi("x", 10) : "·"} ${qText(q)}${q.done || q.fail ? "" : qProg(q)} — ${rub(q.pay)}`
      )
      .join("<br>")}<br>Все три — ещё ${rub(Q.bonus)}.`
  );
}
function questStart() {
  if (!T || !T.q) return;
  qChip();
  const pr = toastEl.hidden ? "" : toastEl.innerHTML.replace(/^.*?<p>|<\/p>.*$/g, "") + "<br><br>";
  toast(`${pr}<b>Наводка дня:</b> ${QLM_SAY[T.q.kind]} Ищите ${T.q.dir} поля. Задачи — кнопка «Наводка» сверху.`);
}
function qDone(q, inCard) {
  if (q.done || q.fail) return;
  q.done = true;
  G.money += q.pay;
  gainXp(4);
  const line = `<b class="bt-ok">Задача выполнена:</b> ${qText(q).toLowerCase()} — +${rub(q.pay)}.`;
  const Q = T.q;
  let all = "";
  if (Q.tasks.every(x => x.done)) {
    G.money += Q.bonus;
    T.fart = Math.min(FART_MAX, (T.fart || 0) + 2);
    all = ` <b>Наводка отработана целиком:</b> +${rub(Q.bonus)} и фарт +2!`;
    fartChip();
  }
  if (inCard) cardX.push(line + all);
  else toast(line + all);
  SFX.levelup && SFX.levelup();
  qChip();
  updateHud();
}
// копок закончен (h — глубина ямы): задача на глубину
function questDig(h) {
  const Q = T && T.q;
  if (!Q) return;
  Q.tasks.forEach(q => q.k === "deep" && h >= q.d && qDone(q, false));
  if (!Q.seen && Math.hypot(P.x - Q.spot.x, P.y - Q.spot.y) < 5 * TS) {
    Q.seen = 1;
    toast(`Вот ${QLM[Q.kind].nom} — то самое место из слуха. Вокруг должно быть густо.`);
  }
}
// вещь вынута: монеты, слой, ориентир, ставки, неосторожность
function questFound(got, it, hurt) {
  const Q = T && T.q;
  if (!Q || got.story) return;
  if (it.c === 2) T.qCoins = (T.qCoins || 0) + 1;
  if (hurt) Q.hurt = true;
  Q.tasks.forEach(q => {
    if (q.done || q.fail) return;
    if (q.k === "spot" && got.qs) qDone(q, true);
    else if (q.k === "coins" && (T.qCoins || 0) >= q.n) qDone(q, true);
    else if (q.k === "era" && it.era === q.e && it.c > 0) qDone(q, true);
    else if (q.k === "bets" && (T.betOk || 0) >= q.n) qDone(q, true);
    else if (q.k === "care" && hurt) {
      q.fail = true;
      cardX.push(`<b class="bt-no">Задача сорвана:</b> находку задели лопатой.`);
    }
  });
  qChip();
}
// конец поездки: «не повредить» засчитывается, если было что беречь; итог наводки и конкурента
function azartEnd() {
  if (!T) return "";
  let s = "";
  const Q = T.q;
  if (Q) {
    const care = Q.tasks.find(q => q.k === "care" && !q.done && !q.fail);
    if (care && T.found >= 2) {
      care.done = true;
      G.money += care.pay;
      if (Q.tasks.every(x => x.done)) G.money += Q.bonus;
    }
    const d = Q.tasks.filter(q => q.done).length;
    s += ` Наводка: выполнено ${d} из ${Q.tasks.length}.`;
  }
  if (T.rv && T.rv.got) s += ` ${T.rv.n} унёс с поля ${T.rv.got} ${plural(T.rv.got, "находку", "находки", "находок")}.`;
  if (T.betOk) s += ` Угадано сигналов: ${T.betOk}.`;
  return s;
}

// ---------- КУБЫШКА: горшок с монетами, быстрая копка его колет ----------
function potWarn(here, h) {
  const pot = here.find(i => i.pot && !i.found && i.depth - h <= 15 && i.depth > h);
  if (!pot || pot.warned) return;
  pot.warned = 1;
  toast(
    "Лопата стукнула о черепок. <b>Похоже на горшок!</b> Дальше — только аккуратно: быстрым копом его можно расколоть."
  );
}
function potDig(got, fast) {
  got.found = true;
  let n = 5 + Math.floor(Math.random() * 5);
  const cracked = fast;
  if (cracked) n = Math.ceil(n / 2);
  const mult = got.mult || REGIONS[T.region].mult,
    coins = [];
  for (let k = 0; k < n; k++) {
    let m = makeItem(2, null, mult, got.era, true);
    for (let a = 0; a < 10 && m.c !== 2; a++) m = makeItem(2, null, mult, got.era, true);
    const it = {
      wet: T.wx === "rain" ? 1 : 0,
      tid: T.id,
      name: m.name,
      c: m.c,
      iron: m.iron,
      era: m.era,
      w: m.w,
      base: m.base,
      cond: Math.round((cracked ? rnd(0.45, 0.8) : rnd(0.85, 1)) * 100) / 100,
      depth: got.depth,
      clean: false,
      pot: 1
    };
    dexAdd(it.name);
    G.inv.push(it);
    coins.push(it);
    T.found++;
  }
  SFX.coins && SFX.coins(8);
  const xp = betResolve(got, coins[0], got.tx, got.ty);
  coins.forEach(c => questFound(got, c, false));
  const up = gainXp(CLASSES[2].xp * n + xp);
  cardX.unshift(
    cracked
      ? `<b class="bt-no">Кубышка треснула!</b> Быстрая лопата расколола горшок — половина монет ушла в землю. В сумке ${n} ${plural(n, "монета", "монеты", "монет")}.`
      : `<b class="bt-ok">Кубышка!</b> Глиняный горшок, а в нём ${n} ${plural(n, "монета", "монеты", "монет")}. Почистите дома — посмотрим, что за клад.`
  );
  card(coins[0], cracked, up, false);
}

// ---------- КОНКУРЕНТ НА КАРТЕ ----------
const FIELD_RIVALS = [
  {
    n: "Шнырь",
    k: 2,
    hue: 200,
    skill: 0.45,
    dig: 16,
    hi: "«О, коллега! Тут вообще-то моё поле. Ну ладно, копай, где я уже прошёл»."
  },
  {
    n: "Генка",
    k: 4,
    hue: 300,
    skill: 0.55,
    dig: 14,
    hi: "«Слышь, а у тебя что за прибор? Самоделка? Ну-ну. Я вон там всё прошёл, не трать время»."
  },
  {
    n: "Студент",
    k: 3,
    hue: 280,
    skill: 0.3,
    dig: 18,
    hi: "«Здрасьте! А вы давно копаете? Я по роликам научился. Тут что-нибудь есть вообще?»"
  }
];
function rivalGen(t) {
  if ((G.trips || 0) < 2 || worldKind === "kurgan") return;
  if (R() > (worldKind === "plough" || worldKind === "field" ? 0.55 : 0.4)) return;
  const i = Math.floor(R() * FIELD_RIVALS.length);
  for (let a = 0; a < 300; a++) {
    const tx = 2 + Math.floor(R() * (MW - 4)),
      ty = 6 + Math.floor(R() * (MH - 10));
    if (blocked(tx, ty) || Math.hypot(tx * TS - t.px, ty * TS - t.py) < 16 * TS) continue;
    // приезжает не сразу и уезжает через три-пять часов: в эти часы — гонка за сигналами
    const from = t.minutes + 30 + Math.floor(R() * 120);
    t.rv = {
      n: FIELD_RIVALS[i].n,
      i,
      tx,
      ty,
      tgt: null,
      dl: 0,
      last: from,
      from,
      until: from + 180 + Math.floor(R() * 120),
      got: 0
    };
    return;
  }
}
const rvHere = () => !!(T && T.rv && !T.slet && T.minutes >= T.rv.from && !T.rv.gone);
function rivalTick() {
  const r = T && T.rv;
  if (!r || T.slet || r.gone || T.minutes < r.from) return;
  if (!r.came) {
    r.came = 1;
    toast(
      `На край поля подъехала «девятка». Вылез <b>${r.n}</b> с детектором — конкурент. Что он выкопает, вам уже не достанется.`
    );
  }
  if (T.minutes >= r.until && !r.dl) {
    r.gone = 1;
    toast(
      `${r.n} сложил детектор и уехал${r.got ? `, унёс ${r.got} ${plural(r.got, "находку", "находки", "находок")}` : " ни с чем"}. Поле снова ваше.`
    );
    return;
  }
  while (r.last < T.minutes) {
    r.last++;
    // ходит вдвое медленнее Серого: останавливается послушать детектор
    if (r.last % 2 && !r.dl) continue;
    rivalMinute(r);
  }
  if (!r.hi && Math.abs(r.tx * TS + 8 - P.x) + Math.abs(r.ty * TS + 13 - P.y) < 4 * TS) {
    r.hi = 1;
    toast(`<b>${r.n}</b> с детектором подошёл поближе: ${FIELD_RIVALS[r.i].hi}`);
  }
}
function rivalMinute(r) {
  const D = FIELD_RIVALS[r.i];
  if (r.dl > 0) {
    r.dl--;
    if (!r.dl) rivalDigDone(r);
    return;
  }
  if (!r.tgt) r.tgt = rivalPick(r, D);
  if (r.tx === r.tgt.tx && r.ty === r.tgt.ty) {
    r.dl = (D.dig + 8) * (isWinter() ? 2 : 1);
    return;
  }
  const dx = Math.sign(r.tgt.tx - r.tx),
    dy = Math.sign(r.tgt.ty - r.ty),
    opts =
      Math.abs(r.tgt.tx - r.tx) > Math.abs(r.tgt.ty - r.ty)
        ? [
            [dx, 0],
            [0, dy]
          ]
        : [
            [0, dy],
            [dx, 0]
          ];
  for (const [ax, ay] of opts) {
    if (!ax && !ay) continue;
    if (!blocked(r.tx + ax, r.ty + ay)) {
      r.tx += ax;
      r.ty += ay;
      r.dir = ax > 0 ? "right" : ax < 0 ? "left" : ay > 0 ? "down" : "up";
      return;
    }
  }
  r.tgt = null;
}
function rivalPick(r, D) {
  const Q = T.q;
  // он тоже слышал слух — иногда идёт прямо к ориентиру
  if (Q && Math.random() < 0.35) {
    const qs = items.filter(i => i.qs && !i.found);
    if (qs.length) {
      const it = pick(qs);
      if (!Q.rvSaid && Math.hypot(P.x - Q.spot.x, P.y - Q.spot.y) > 4 * TS) {
        Q.rvSaid = 1;
        toast(`${r.n} пошёл в сторону ${QLM[Q.kind].v} — похоже, тоже слышал этот слух. Поторопитесь!`);
      }
      return { tx: it.tx, ty: it.ty };
    }
  }
  if (Math.random() < D.skill) {
    const near = items.filter(
      i => !i.found && !i.story && !i.leg && Math.abs(i.tx - r.tx) + Math.abs(i.ty - r.ty) < 14
    );
    if (near.length) {
      const it = pick(near);
      return { tx: it.tx, ty: it.ty };
    }
  }
  for (let a = 0; a < 60; a++) {
    const tx = r.tx + Math.round((Math.random() - 0.5) * 16),
      ty = r.ty + Math.round((Math.random() - 0.5) * 12);
    if (ty > 4 && diggable(tx, ty)) return { tx, ty };
  }
  return { tx: r.tx, ty: r.ty };
}
function rivalDigDone(r) {
  const k = r.tx + "," + r.ty;
  holes.set(k, Math.max(holes.get(k) || 0, 30));
  r.tgt = null;
  const it = items.find(i => !i.found && !i.story && !i.leg && i.tx === r.tx && i.ty === r.ty && i.depth <= 45);
  if (!it || Math.random() < 0.25) {
    r.pop = { txt: "пусто", t: performance.now() };
    return;
  }
  it.found = true;
  it.rival = true;
  r.got++;
  r.pop = { txt: it.pot ? "клад!" : it.c >= 2 ? "есть!" : "+1", t: performance.now() };
  const near = Math.hypot(r.tx * TS - P.x, r.ty * TS - P.y) < 9 * TS;
  if (it.pot) toast(`${r.n} выкопал кубышку! Слышно, как он звенит монетами. Эх…`);
  else if (it.qs && T.q && !T.q.rvWarn) {
    T.q.rvWarn = 1;
    toast(`${r.n} копает у ${QLM[T.q.kind].v} и уже что-то вытащил. Место из слуха пустеет!`);
  } else if (near && it.c >= 2) toast(`${r.n} вытащил что-то в двух шагах от вас. «Кто первый встал — того и тапки»!`);
}
function azartEnts(ents, camX, camY) {
  if (!T) return;
  const now = performance.now();
  if (rvHere()) {
    const D = FIELD_RIVALS[T.rv.i];
    rvDraw(ents, T.rv, hueSheet(D.k, D.hue), camX, camY, now);
  }
  const Q = T.q;
  if (Q) {
    const sp = lmSprite(Q.kind),
      x = Q.spot.x - (sp.width >> 1) - camX,
      y = Q.spot.y - sp.height + 3 - camY;
    if (x < VW && y < VH && x + sp.width > 0 && y + sp.height > 0)
      ents.push({ y: Q.spot.y, f: () => ctx.drawImage(sp, x, y) });
  }
}
// ориентиры наводки: колодец, печище, землянка — пиксельные, рисуются один раз
const lmCache = {};
function lmSprite(k) {
  if (lmCache[k]) return lmCache[k];
  const c = document.createElement("canvas");
  c.width = 22;
  c.height = 20;
  const g = c.getContext("2d"),
    r = (x, y, w, h, col) => {
      g.fillStyle = col;
      g.fillRect(x, y, w, h);
    };
  if (k === "well") {
    // сруб из брёвен с журавлём
    r(3, 11, 16, 7, "#2a1c10");
    r(4, 11, 14, 6, "#7a5230");
    [12, 14, 16].forEach(y => r(4, y, 14, 1, "#5a3a20"));
    r(6, 11, 10, 2, "#1a2630");
    r(5, 4, 1, 8, "#5a3a20");
    r(16, 4, 1, 8, "#5a3a20");
    r(4, 3, 14, 2, "#8a6036");
    r(4, 3, 14, 1, "#a87a48");
    r(10, 5, 1, 5, "#9a9a92");
    r(9, 9, 3, 2, "#6a6a62");
  } else if (k === "stove") {
    // печь без избы: кирпичная кладка и труба
    r(3, 9, 16, 9, "#2a1c10");
    r(4, 10, 14, 7, "#a8503a");
    [11, 13, 15].forEach((y, i) => {
      r(4, y, 14, 1, "#7a3428");
      for (let x = 5 + (i % 2) * 2; x < 18; x += 4) r(x, y - 1, 1, 1, "#7a3428");
    });
    r(8, 13, 6, 4, "#1a1410");
    r(12, 2, 5, 8, "#2a1c10");
    r(13, 3, 3, 7, "#984836");
    r(13, 5, 3, 1, "#7a3428");
    r(2, 16, 4, 2, "#6a6258");
    r(16, 16, 5, 2, "#7a7268");
  } else {
    // землянка: заросший холмик, накат из брёвен, тёмный вход
    for (let y = 0; y < 9; y++) {
      const w = Math.round(9 * Math.sqrt(1 - ((y - 8) / 9) ** 2));
      r(11 - w, 9 + y, w * 2, 1, y < 2 ? "#4e7a34" : "#5e8a3c");
    }
    r(2, 17, 18, 1, "#3e6228");
    [10, 12].forEach(y => r(5, y, 12, 1, "#6a4a2a"));
    r(8, 13, 6, 5, "#1a1410");
    r(7, 13, 1, 5, "#6a4a2a");
    r(14, 13, 1, 5, "#6a4a2a");
    r(7, 12, 8, 1, "#7a5634");
  }
  return (lmCache[k] = c);
}
Object.assign(window.SK, { bet, qInfo });
