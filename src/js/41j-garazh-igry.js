// ================= ГАРАЖ: ТОРГ, АУКЦИОН, ЭЛЕКТРОЛИЗ, СКЛЕЙКА =================
// Все четыре — окна поверх гаража (#gmOver), короткие, на полминуты.
function gmOver() {
  let o = $("gmOver");
  // окно игры открывается поверх — карточку находки под ним закрываем (но не при перерисовке открытого окна)
  if (openFind && (!o || o.hidden)) {
    openFind = null;
    renderFindSheet();
  }
  if (!o) {
    o = document.createElement("div");
    o.id = "gmOver";
    o.className = "over";
    o.style.zIndex = 95;
    document.body.appendChild(o);
  }
  return o;
}
function gmClose() {
  const o = $("gmOver");
  if (o) {
    o.hidden = true;
    o.innerHTML = "";
  }
  clearInterval(gmTimer);
  gmTimer = null;
  HG = AU = EL = GL = null;
}
let gmTimer = null,
  HG = null,
  AU = null,
  EL = null,
  GL = null;
const gmPic = it => `<span class="slot big star gm-pic"><img src="${findPic(it)}" alt=""></span>`;
const r10 = v => Math.round(v / 10) * 10;

// ---------- ТОРГ С АНТИКВАРОМ ----------
// Антиквар называет цену, вы — свою. Его предел скрыт: перегнёте — потеряет терпение и уйдёт до следующей поездки.
const HG_SAY = {
  start: [
    "Ну, показывайте… Так. Дам вот столько — и то из уважения.",
    "Хм. Вещь неплохая. Моя цена — вот, и не торгуйтесь сильно."
  ],
  near: [
    "Многовато. Давайте сойдёмся на моей цене — и по рукам.",
    "Ну вы и жук. Ладно, могу чуть добавить — но не больше."
  ],
  far: ["Вы смеётесь? За такие деньги я сам в поле поеду.", "Это вы в интернете цен насмотрелись? Не, так не пойдёт."],
  deal: ["По рукам. Деньги — после следующей поездки, как продам.", "Договорились. Хорошая вещь, найду ей хозяина."],
  gone: ["Всё, разговор окончен. Приходите после следующей поездки — может, остыну."]
};
function hagOpen(i) {
  const it = G.inv[i];
  if (!it || antWhy(it)) return;
  const p = sellPrice(it, CHANNELS[1]);
  HG = {
    i,
    it,
    p,
    lim: r10(p * (1.08 + Math.random() * 0.27 + skl("torg") * 0.03 + (antWants(it) ? 0.08 : 0))),
    pat: 3,
    offer: r10(p * 1.25),
    counter: null,
    say: pick(HG_SAY.start),
    st: "talk"
  };
  hagRender();
}
function hagRender() {
  const o = gmOver(),
    H = HG;
  if (!H) return;
  const lo = r10(H.p * 0.9),
    hi = r10(H.p * 2),
    face = H.st === "deal" ? "ok" : H.st === "gone" ? "bad" : H.pat >= 3 ? "calm" : H.pat === 2 ? "hm" : "angry";
  o.innerHTML = `<div class="sheet plank gm hg"><h2>Торг с антикваром</h2><div class="gm-top">${gmPic(H.it)}<div><b>${H.it.name}</b><small>Его первая цена: ${rub(H.p)}${antWants(H.it) ? " · он такое ищет" : ""}</small><span class="hg-pat" aria-label="Терпение: ${H.pat} из 3">Терпение ${[0, 1, 2].map(k => `<i class="${k < H.pat ? "on" : ""}"></i>`).join("")}</span></div></div><p class="hg-say ${face}">«${H.say}»</p>${
    H.st === "talk"
      ? `<label class="hg-sl"><span>Ваша цена</span><b id="hgV">${rub(H.offer)}</b><input type="range" min="${lo}" max="${hi}" step="10" value="${H.offer}" oninput="SK.hagSet(this.value)" aria-label="Ваша цена"></label><div class="row"><button class="btn" onclick="SK.hagOffer()">${lblCost(`Предложить · ${rub(H.offer)}`)}</button>${H.counter ? `<button class="btn y" onclick="SK.hagTake()">${lblCost(`Согласиться · ${rub(H.counter)}`)}</button>` : `<button class="btn y" onclick="SK.hagTake(1)">${lblCost(`Его цена · ${rub(H.p)}`)}</button>`}<button class="btn ghost" onclick="SK.gmClose()">Передумать</button></div>`
      : `<div class="row"><button class="btn${H.st === "gone" ? " ghost" : ""}" onclick="SK.gmDone()">${H.st === "deal" ? "Пожать руку" : "Уйти"}</button></div>`
  }<p class="gm-hint">Его предел скрыт. Навык «Торг» и вещь, которую он ищет, поднимают предел.</p></div>`;
  o.hidden = false;
}
function hagSet(v) {
  if (!HG) return;
  HG.offer = +v;
  const b = $("hgV");
  if (b) b.textContent = rub(HG.offer);
  const btn = document.querySelector(".hg .btn:not(.y):not(.ghost)");
  if (btn) btn.innerHTML = lblCost(`Предложить · ${rub(HG.offer)}`);
}
function hagOffer() {
  const H = HG;
  if (!H || H.st !== "talk") return;
  if (H.offer <= H.lim) return hagDeal(H.offer);
  if (H.offer <= H.lim * 1.12) {
    H.pat--;
    H.counter = Math.max(H.p, r10(Math.min(H.offer, H.lim) * 0.97));
    H.say = pick(HG_SAY.near) + ` ${rub(H.counter)}.`;
  } else {
    H.pat -= 2;
    H.say = pick(HG_SAY.far);
  }
  if (H.pat <= 0) {
    H.pat = 0;
    H.st = "gone";
    H.say = HG_SAY.gone[0];
    G.antOff = G.trips;
    save();
    SFX.thud && SFX.thud();
  }
  hagRender();
}
function hagTake(first) {
  const H = HG;
  if (!H || H.st !== "talk") return;
  hagDeal(first ? H.p : H.counter || H.p);
}
function hagDeal(price) {
  const H = HG,
    i = G.inv.indexOf(H.it);
  if (i < 0) return;
  G.antDue = (G.antDue || 0) + price;
  G.antLeft--;
  G.inv.splice(i, 1);
  openFind = null;
  SFX.coins(3);
  const plus = price - H.p;
  msg(
    `Антиквар взял «${H.it.name}» за ${rub(price)}${plus > 0 ? ` — выторговали +${rub(plus)}` : ""}. Деньги придут после следующей поездки.`
  );
  H.st = "deal";
  H.say = pick(HG_SAY.deal);
  save();
  hagRender();
}

// ---------- ФОРУМ-АУКЦИОН ----------
// 20 секунд живых ставок. Цена растёт до скрытого пика, потом покупатели начинают снимать ставки — продайте вовремя.
const AU_NICK = [
  "Antik_Tver",
  "Михалыч",
  "Kladoiskatel",
  "Нумизмат_64",
  "Серебро_СПб",
  "dedushka_kopal",
  "Ратник",
  "Faleristika",
  "Монетчик",
  "Старина_НН"
];
const aucOk = it => !it.story && !it.leg && it.clean && it.c >= 2;
function aucOpen(i) {
  const it = G.inv[i];
  if (!it || !aucOk(it) || G.aucT === G.trips) return;
  const ref = sellPrice(it, CHANNELS[1]) * (it.gr >= 3 ? 1.1 : 1);
  AU = {
    i,
    it,
    peak: r10(ref * (0.8 + Math.random() * 0.8) * (perk("forum") ? 1.1 : 1)),
    start: r10(Math.max(50, sellPrice(it, CHANNELS[0]) * 0.7)),
    bids: [],
    t: 20,
    nb: 1.2,
    ph: "wait",
    msg: "Лот выставлен. Ждём первых ставок…"
  };
  G.aucT = G.trips;
  save();
  aucRender();
  clearInterval(gmTimer);
  gmTimer = setInterval(aucTick, 100);
}
function aucTick() {
  const A = AU;
  if (!A || A.ph === "end") return;
  A.t = Math.max(0, A.t - 0.1);
  A.nb -= 0.1;
  const cur = A.bids.length ? A.bids[A.bids.length - 1].v : 0;
  if (A.nb <= 0) {
    if (A.ph === "wait" || A.ph === "up") {
      let v = cur ? cur + Math.max(10, r10(A.peak * (0.05 + Math.random() * 0.09))) : A.start;
      if (v >= A.peak) {
        v = A.peak;
        A.ph = "peak";
        A.nb = 2.6;
      } else {
        A.ph = "up";
        A.nb = 0.7 + Math.random() * 1.3;
      }
      const who = pick(AU_NICK.filter(n => !A.bids.length || n !== A.bids[A.bids.length - 1].who));
      A.bids.push({ who, v });
      A.msg = `${who} ставит ${rub(v)}`;
      SFX.clink && SFX.clink();
    } else if (A.ph === "peak" || A.ph === "down") {
      // пик пройден: кто-то снимает ставку, цена откатывается
      const b = A.bids.pop();
      A.ph = "down";
      A.nb = 1.6 + Math.random();
      A.msg = `${b.who} снял ставку${A.bids.length ? "" : " — лот снова пустой"}`;
      SFX.thud && SFX.thud();
    }
  }
  if (A.t <= 0) return aucEnd(false);
  aucRender();
}
function aucRender() {
  const A = AU,
    o = gmOver();
  if (!A) return;
  const cur = A.bids.length ? A.bids[A.bids.length - 1].v : 0;
  o.innerHTML = `<div class="sheet plank gm au"><h2>Форум-аукцион</h2><div class="gm-top">${gmPic(A.it)}<div><b>${A.it.name}</b><small>${A.ph === "end" ? "Торги закрыты" : `Осталось ${Math.ceil(A.t)} с`}</small></div></div><div class="au-time"><i style="width:${(A.t / 20) * 100}%"></i></div><div class="au-cur"><small>Текущая ставка</small><b>${cur ? rub(cur) : "—"}</b><span class="au-msg ${A.ph === "down" ? "down" : ""}">${A.msg}</span></div><ul class="au-bids">${A.bids
    .slice(-4)
    .reverse()
    .map((b, k) => `<li class="${k ? "" : "au-top"}"><span>${b.who}</span><b>${rub(b.v)}</b></li>`)
    .join("")}</ul><div class="row">${
    A.ph === "end"
      ? `<button class="btn" onclick="SK.gmDone()">Готово</button>`
      : `<button class="btn y" ${cur ? "" : "disabled"} onclick="SK.aucSell()">${lblCost(cur ? `Продать · ${rub(cur)}` : "Продать · нет ставок")}</button>`
  }</div><p class="gm-hint">${A.ph === "end" ? "" : "Когда время выйдет, лот уйдёт по последней ставке. После пика покупатели начинают снимать ставки."}</p></div>`;
  o.hidden = false;
}
function aucSell() {
  aucEnd(true);
}
function aucEnd() {
  const A = AU;
  if (!A || A.ph === "end") return;
  clearInterval(gmTimer);
  gmTimer = null;
  const b = A.bids[A.bids.length - 1],
    i = G.inv.indexOf(A.it);
  A.ph = "end";
  if (b && i >= 0) {
    G.money += b.v;
    G.inv.splice(i, 1);
    openFind = null;
    SFX.coins(b.v > 5000 ? 8 : 5);
    A.msg = `Продано нику ${b.who} за ${rub(b.v)}.`;
    msg(`Форум-аукцион: «${A.it.name}» ушла к нику ${b.who} за ${rub(b.v)}.`);
  } else {
    A.msg = "Ставок не осталось — лот не продан. Следующий лот — после поездки.";
    msg("Форум-аукцион: лот не продан. Следующий — после поездки.", true);
  }
  save();
  aucRender();
}

// ---------- ЭЛЕКТРОЛИЗ ----------
// Ржавое железо в банке под током. Вынуть вовремя: рано — ржавчина осталась, поздно — ток изъел металл.
const elOk = it => !it.clean && it.iron && it.c > 0 && !it.story && !it.leg;
function elOpen(i) {
  const it = G.inv[i];
  if (!it || !elOk(it)) return;
  const c = 0.55 + Math.random() * 0.22,
    w = 0.065 + skl("master") * 0.008;
  EL = { i, it, p: 0, on: false, win: [c - w, c + w], bub: [], img: new Image() };
  EL.img.src = FIND_IMG[it.name] || findPic(it);
  elRender();
  clearInterval(gmTimer);
  gmTimer = setInterval(elTick, 50);
}
function elRender() {
  const E = EL,
    o = gmOver();
  o.innerHTML = `<div class="sheet plank gm el"><h2>Электролиз</h2><p class="gm-sub">${E.it.name ? shownName(E.it) : ""}: банка с содовым раствором, ток от зарядки. Ржавчина уходит пузырями.</p><canvas id="elCv" width="192" height="168"></canvas><div class="el-bar"><span class="el-win" style="left:${E.win[0] * 100}%;width:${(E.win[1] - E.win[0]) * 100}%"></span><i id="elP"></i></div><p class="gm-hint">Вынимайте, когда стрелка в зелёной полосе. Навык «Мастер» делает её шире.</p><div class="row">${
    E.on
      ? `<button class="btn y" onclick="SK.elPull()">Вынуть!</button>`
      : `<button class="btn" onclick="SK.elStart()">Включить ток</button><button class="btn ghost" onclick="SK.gmClose()">Отмена</button>`
  }</div></div>`;
  o.hidden = false;
  elDraw();
}
function elStart() {
  if (!EL) return;
  EL.on = true;
  elRender();
}
function elTick() {
  const E = EL;
  if (!E) return;
  if (E.on) {
    E.p = Math.min(1, E.p + 0.0055);
    if (Math.random() < 0.6)
      E.bub.push({ x: 60 + Math.random() * 72, y: 120 + Math.random() * 20, r: 1 + Math.random() * 2 });
  }
  E.bub.forEach(b => (b.y -= 2.2));
  E.bub = E.bub.filter(b => b.y > 30);
  elDraw();
  if (E.p >= 1) elPull();
}
function elDraw() {
  const E = EL,
    cv = $("elCv");
  if (!E || !cv) return;
  const g = cv.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.clearRect(0, 0, 192, 168);
  // банка
  g.fillStyle = "#3a4c50";
  g.fillRect(28, 20, 136, 140);
  g.fillStyle = "#6e8c90";
  g.fillRect(32, 36, 128, 120);
  g.fillStyle = "rgba(255,255,255,.18)";
  g.fillRect(36, 40, 6, 110);
  // провода
  g.fillStyle = "#c8402a";
  g.fillRect(70, 6, 3, 50);
  g.fillStyle = "#222";
  g.fillRect(120, 6, 3, 40);
  g.fillStyle = "#9a9a92";
  g.fillRect(116, 44, 10, 70);
  // вещь: проступает из-под ржавчины, передержка — изъедена
  const t = document.createElement("canvas");
  t.width = t.height = 96;
  const tg = t.getContext("2d");
  tg.imageSmoothingEnabled = false;
  if (E.img.complete && E.img.naturalWidth) tg.drawImage(E.img, 0, 0, 96, 96);
  tg.globalCompositeOperation = "source-atop";
  const rust = Math.max(0, 1 - E.p / E.win[0]);
  tg.fillStyle = `rgba(130,62,26,${(0.25 + 0.7 * rust).toFixed(2)})`;
  tg.fillRect(0, 0, 96, 96);
  if (E.p > E.win[1]) {
    const k = (E.p - E.win[1]) / (1 - E.win[1]),
      rr = rng(7);
    tg.fillStyle = "rgba(40,30,24,.85)";
    for (let n = 0; n < 220 * k; n++) tg.fillRect(Math.floor(rr() * 24) * 4, Math.floor(rr() * 24) * 4, 4, 4);
  }
  g.drawImage(t, 48, 52);
  E.bub.forEach(b => {
    g.fillStyle = "rgba(230,245,245,.8)";
    g.fillRect(Math.round(b.x), Math.round(b.y), Math.round(b.r * 2), Math.round(b.r * 2));
  });
  const pi = $("elP");
  if (pi) pi.style.left = E.p * 100 + "%";
}
function elPull() {
  const E = EL;
  if (!E || !E.on) return;
  clearInterval(gmTimer);
  gmTimer = null;
  const it = E.it;
  reveal(it, true, 0, false);
  let note;
  if (E.p < E.win[0]) {
    it.gr = Math.max(0, it.gr - 1);
    note = "Вынули рано — ржавчина осталась в порах, сохранность на ступень ниже.";
  } else if (E.p <= E.win[1]) {
    if (it.gr < 4) it.gr++;
    note = "В самый раз: ржавчина сошла, металл цел — сохранность на ступень выше!";
  } else {
    it.gr = Math.max(0, it.gr - 2);
    note = "Передержали — ток изъел металл, сохранность упала на две ступени.";
  }
  it._new.note = note;
  it.elx = 1;
  SFX.clean(E.p < E.win[0] || E.p > E.win[1]);
  gmClose();
  openFind = it;
  msg(note, !(E.p >= E.win[0] && E.p <= E.win[1]));
  save();
  renderBase();
}

// ---------- СКЛЕЙКА ----------
// Обломки вещи перемешаны: меняйте местами два кусочка, пока картинка не сложится.
function glueOpen(i) {
  const it = G.inv[i];
  if (!it || !it.broken || !it.clean) return;
  const n = it.broken,
    cols = n === 4 ? 2 : 3,
    rows = 2;
  let ord;
  do ord = [...Array(n).keys()].sort(() => Math.random() - 0.5);
  while (ord.every((v, k) => v === k));
  GL = { i, it, n, cols, rows, ord, sel: -1, moves: 0, done: false, img: new Image() };
  GL.img.onload = glueRender;
  GL.img.src = findPic(it);
  glueRender();
}
function glueRender() {
  const Gl = GL,
    o = gmOver();
  if (!Gl) return;
  const S = Gl.cols === 2 ? 96 : 72;
  const cell = k => {
    const v = Gl.ord[k],
      sx = (v % Gl.cols) * S,
      sy = Math.floor(v / Gl.cols) * S;
    return `<button class="gl-c${Gl.sel === k ? " sel" : ""}${Gl.done ? " ok" : ""}" style="width:${S}px;height:${S}px;background-image:url(${Gl.img.src});background-size:${S * Gl.cols}px ${S * Gl.rows}px;background-position:-${sx}px -${sy}px" onclick="SK.glueTap(${k})" aria-label="Кусочек ${k + 1}"></button>`;
  };
  o.innerHTML = `<div class="sheet plank gm gl"><h2>Склейка</h2><p class="gm-sub">${Gl.it.name}: ${Gl.n} ${plural(Gl.n, "обломок", "обломка", "обломков")}. Нажмите на два кусочка — они поменяются местами.</p><div class="gl-grid" style="grid-template-columns:repeat(${Gl.cols},${S}px)">${Gl.ord.map((_, k) => cell(k)).join("")}</div><p class="gm-hint">${Gl.done ? `Склеено за ${Gl.moves} ${plural(Gl.moves, "ход", "хода", "ходов")}. Цена теперь ×0,85 вместо ×0,25.` : `Ходов: ${Gl.moves}`}</p><div class="row">${Gl.done ? `<button class="btn" onclick="SK.gmDone()">Готово</button>` : `<button class="btn ghost" onclick="SK.gmClose()">Отложить</button>`}</div></div>`;
  o.hidden = false;
}
function glueTap(k) {
  const Gl = GL;
  if (!Gl || Gl.done) return;
  if (Gl.sel < 0) Gl.sel = k;
  else if (Gl.sel === k) Gl.sel = -1;
  else {
    [Gl.ord[Gl.sel], Gl.ord[k]] = [Gl.ord[k], Gl.ord[Gl.sel]];
    Gl.sel = -1;
    Gl.moves++;
    SFX.clink && SFX.clink();
    if (Gl.ord.every((v, j) => v === j)) {
      Gl.done = true;
      Gl.it.broken = 0;
      Gl.it.glued = 1;
      SFX.museum && SFX.museum();
      msg(`Склеили «${Gl.it.name}». Шов почти не видно — цена теперь ×0,85.`);
      openFind = Gl.it;
      save();
    }
  }
  glueRender();
}
function gmDone() {
  gmClose();
  renderBase();
}
Object.assign(window.SK, {
  gmClose,
  gmDone,
  hagOpen,
  hagSet,
  hagOffer,
  hagTake,
  aucOpen,
  aucSell,
  elOpen,
  elStart,
  elPull,
  glueOpen,
  glueTap
});
