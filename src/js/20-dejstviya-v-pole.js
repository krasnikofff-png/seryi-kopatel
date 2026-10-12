// ================= ДЕЙСТВИЯ В ПОЛЕ =================
const toastEl = $("toast"),
  cardEl = $("card");
let toastT = 0,
  cardT = 0;
function toast(t) {
  toastEl.innerHTML = t;
  toastEl.hidden = false;
  toastT = 3.2;
  cardEl.hidden = true;
}
function card(it, hurt, up, more) {
  cardEl.classList.toggle("leg", !!it.leg);
  if (it.leg) {
    cardEl.innerHTML = `<span class="x">×</span><div class="k">★ ЛЕГЕНДА · ${it.depth} см · ${ERAS[it.era].name}</div><img class="cpic" src="${FIND_IMG[it.name] || ""}" alt=""><h2>${it.name}</h2><p>Такое находят раз в жизни. Руки дрожат. Почистите дома — ей ничего не грозит.${up ? "<br><b>Новый уровень! Очко навыка ждёт дома.</b>" : ""}</p>`;
    cardEl.hidden = false;
    cardT = 8;
    toastEl.hidden = true;
    return;
  }
  cardEl.innerHTML = `<span class="x">×</span><div class="k">${it.cache ? "Тайник с карты! · " : "Находка · "}${it.depth} см · ${ERAS[it.era].name}${it.vdi ? " · ВДИ " + it.vdi : ""}</div>${it.story ? "" : `<img class="cpic" src="${FIND_IMG[it.name] || ""}" alt="">`}<h2>${shownName(it)}</h2><p>${hurt ? "Кажется, задели лопатой — сохранность может пострадать. " : ""}${it.story ? "Что это — станет ясно после чистки." : it.c === 0 ? "Мусор. Только в металлолом." : `<span class="crange">${CLASSES[it.c].name} · ${rangeCh().id === "ant" ? "антиквар" : "скупщик"} даст ${rub(priceRange(it)[0])} – ${rub(priceRange(it)[1])}</span>Цену решит сохранность — узнаете после чистки. Бывают и редкие разновидности ×${rareM(it)} — их видно, только если чистить самому.`}${it.story ? `<br><b>★ Сердце ёкнуло: кажется, это то, что вы искали. Почистите дома.</b>` : ""}${more ? `<br><b>Детектор над ямой не умолкает — глубже лежит что-то ещё.</b>` : ""}${up ? "<br><b>Новый уровень! Очко навыка ждёт дома.</b>" : ""}</p>`;
  cardEl.hidden = false;
  cardT = 5;
  toastEl.hidden = true;
}
cardEl.addEventListener("pointerdown", e => {
  e.stopPropagation();
  cardEl.hidden = true;
});
const tripBag = () => (T ? G.inv.filter(i => i.tid === T.id) : []);
const soilW = w => Math.min(3, Math.round((w * 2 + 0.25) * 100) / 100); // с землёй, но не тяжелее 3 кг // вещь с налипшей землёй и комом глины
const bagW = () => tripBag().reduce((s, i) => s + (i.clean ? i.w : soilW(i.w)), 0);
const digTime = fast => {
  let t = fast ? 10 : 20;
  if (isWinter()) t *= 2;
  if (season().id === "summer") t += 5;
  if (T && T.wx === "heat") t += 5;
  return Math.max(5, t - (T ? T.digBonus : 0));
};
function canAct() {
  return screen === "field" && !paused && T && !path.length && digT <= 0;
}
function dig(fast) {
  if (!canAct()) return;
  const t = pTile();
  if (!diggable(t.tx, t.ty)) {
    toast("Тут не копнуть: камни и корни.");
    return;
  }
  if (holeAt(t.tx, t.ty) >= shovelMax()) {
    toast(`Глубже ${shovelMax()} см этой лопатой не взять${isWinter() ? " — земля мёрзлая" : ""}.`);
    return;
  }
  digTarget = t;
  digFast = fast;
  digT = fast ? 0.3 : 0.5;
  SFX.dig(fast);
}
function finishDig() {
  const { tx, ty } = digTarget,
    k = tx + "," + ty,
    sh = SHOVEL[G.shovel],
    h = Math.min(shovelMax(), holeAt(tx, ty) + sh.step * (digFast ? 2 : 1));
  holes.set(k, h);
  const roots = worldKind === "forest" && nearTrunk(tx, ty),
    brick = worldKind === "manor" && inHouse(tx * TS + 8, ty * TS + 8, 4);
  T.minutes += digTime(digFast) + (roots || brick ? 10 : 0);
  if (roots && !T.rootsSaid) {
    T.rootsSaid = true;
    toast("Корни! У деревьев копать дольше — +10 минут на каждый копок.");
  }
  if (brick && !T.brickSaid) {
    T.brickSaid = true;
    toast("Битый кирпич и штукатурка — в руинах копать дольше, +10 минут. Зато здесь жили и теряли вещи.");
  }
  updateHud();
  burst(tx * TS + 8, ty * TS + 9);
  const here = items.filter(i => !i.found && i.tx === tx && i.ty === ty).sort((a, b) => a.depth - b.depth),
    got = here.find(i => i.depth <= h);
  if (got) {
    if (bagW() + soilW(got.w) > bagCap()) {
      holes.set(k, Math.max(0, got.depth - 1));
      toast(
        `Лопата звякнула о что-то тяжёлое: ${dirtyName(got).toLowerCase()}, ~${kg(soilW(got.w))} кг с землёй. В сумке свободно ${kg(Math.max(0, bagCap() - bagW()))} кг — не влезет. Выкиньте что-нибудь или езжайте домой.`
      );
      save();
      return;
    }
    got.found = true;
    T.found++;
    const cond = digFast ? (own("pin") ? rnd(0.7, 0.98) : rnd(0.4, 0.95)) : rnd(0.8, 1);
    const it = {
      wet: T.wx === "rain" ? 1 : 0,
      tid: T.id,
      name: got.name,
      c: got.c,
      iron: got.iron,
      era: got.era,
      w: got.w,
      base: got.base,
      cond: Math.round(cond * 100) / 100,
      depth: got.depth,
      clean: false,
      cache: !!got.cache
    };
    if (got.story) {
      it.story = got.story;
      it.cond = Math.max(it.cond, 0.8);
    }
    if (got.nyura) {
      it.nyura = 1;
      G.nyuraB = 1;
    }
    if (got.leg) {
      it.leg = got.leg;
      it.cond = 1;
      G.leg = G.leg || {};
      G.leg[got.leg] = "found";
    }
    if (DET[G.det].disc && !got.leg && !got.story) {
      it.vdi = vdiOf(got);
      (G.vdiLog = G.vdiLog || []).push([it.vdi, got.c]);
      if (G.vdiLog.length > 80) G.vdiLog.shift();
    }
    if (it.c === 0) {
      it.clean = true; // мусор не чистят: его сразу видно, путь один — в металлолом
      it.gr = 2;
    }
    if (!it.story && !it.leg) dexAdd(it.name);
    G.inv.push(it);
    SFX.clink();
    if (it.leg) setTimeout(() => SFX.legend(), 250);
    const up = gainXp(CLASSES[got.c].xp);
    const more = here.find(
      i => i !== got && i.depth > got.depth && i.depth - h <= DET[G.det].depth + (own("coil") ? 15 : 0)
    );
    card(it, digFast && cond < 0.7, up, more);
    updateHud();
    save();
    if (got.ring) {
      it.ring = 1;
      T.event = "ringBack";
      setTimeout(showEvent, 350);
      save();
      return;
    }
    if (
      (worldKind === "forest" || worldKind === "swamp") &&
      got.era === 1 &&
      got.c >= 2 &&
      moralOk() &&
      Math.random() < 0.18
    )
      moralFire("bones");
    return;
  }
  const deeper = here.find(i => i.depth > h);
  if (!deeper) SFX.thud();
  if (!deeper && moralOk()) {
    const w = worldKind;
    if ((w === "forest" || w === "swamp") && Math.random() < 0.05) {
      moralFire("stash");
      return;
    }
    if ((w === "plough" || w === "manor" || w === "forest") && Math.random() < 0.05) {
      moralFire("grave");
      return;
    }
  }
  if (!deeper) {
    const cx = tx * TS + 8,
      cy = ty * TS + 8,
      dl = DET[G.det].depth + (own("coil") ? 15 : 0);
    const nb = items
      .filter(
        i =>
          !i.found &&
          Math.abs(i.tx - tx) <= 1 &&
          Math.abs(i.ty - ty) <= 1 &&
          !(i.tx === tx && i.ty === ty) &&
          i.depth - holeAt(i.tx, i.ty) <= dl
      )
      .sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy))[0];
    if (nb) {
      const dx = nb.tx - tx,
        dy = nb.ty - ty,
        dir = [dy < 0 ? "сверху" : dy > 0 ? "снизу" : "", dx < 0 ? "слева" : dx > 0 ? "справа" : ""]
          .filter(Boolean)
          .join(" и ");
      let m = `Яма ${h} см, пусто. Но звенит в стенке ямы — <b>${dir}</b>. Вещь в соседней клетке.`;
      if (!G.pinTip) {
        G.pinTip = 1;
        m +=
          " Катушка широкая и пищит над соседними клетками почти одинаково." +
          (own("pin") ? "" : " Пинпоинтер в магазине показывает точную клетку.");
      }
      toast(m);
      if (!G.pinTip2) {
        G.pinTip2 = 1;
        toastT = 8;
      }
      save();
      return;
    }
  }
  if (deeper && h >= shovelMax())
    toast(
      `Яма ${h} см — дно для этой лопаты${isWinter() ? " в мёрзлой земле" : ""}. Сигнал идёт снизу, до вещи ещё ~${Math.ceil((deeper.depth - h) / 5) * 5} см. Нужна лопата получше.`
    );
  else if (deeper) toast(`Яма ${h} см. Металл глубже, копайте дальше.`);
  else
    toast(
      `Яма ${h} см. ${pick(["Пусто, только корни.", "Пусто, глина и камни.", G.det === 1 ? "Пусто. Самодельный детектор шумит — это была помеха." : "Ничего. Наверное, помеха."])}`
    );
  save();
}
function updateHud() {
  if (!T) return;
  const m = 480 + T.minutes;
  {
    const ce = $("clockEnd");
    if (ce) ce.textContent = "до " + hhmmAbs(480 + dayEnd());
  }
  $("clock").textContent =
    String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  $("moneyF").textContent = rub(G.money);
  $("bagTxt").textContent = `${kg(bagW())} / ${bagCap()} кг`;
}
function digLabels() {
  const sh = SHOVEL[G.shovel];
  $("careInfo").textContent = `+${sh.step} см · ${digTime(false)} мин`;
  $("fastInfo").textContent = `+${sh.step * 2} см · ${digTime(true)} мин`;
}
function syncButtons() {
  const off = !canAct();
  ["digCare", "digFast"].forEach(id => ($(id).disabled = off));
}
$("digCare").onclick = () => dig(false);
$("digFast").onclick = () => dig(true);

// сумка в поле
function openBag() {
  if (screen !== "field" || !T) return;
  paused = true;
  renderBag();
  $("bagOver").hidden = false;
}
function renderBag() {
  $("bagTitle").textContent = `Сумка · ${kg(bagW())} из ${bagCap()} кг (с землёй)`;
  const list = tripBag(),
    ul = $("bagList");
  ul.innerHTML = list.length
    ? list
        .map(
          (it, i) =>
            `<li><span>${shownName(it)}<small>${kg(soilW(it.w))} кг · ${it.depth} см · ${ERAS[it.era].name}</small></span><button data-i="${i}">Выкинуть</button></li>`
        )
        .join("")
    : "<li><span>За эту поездку пока пусто.</span></li>";
  ul.querySelectorAll("button").forEach(
    b =>
      (b.onclick = () => {
        const it = list[+b.dataset.i];
        G.inv.splice(G.inv.indexOf(it), 1);
        updateHud();
        renderBag();
        save();
      })
  );
}
function closeBag() {
  if (!$("bagOver").hidden) {
    $("bagOver").hidden = true;
    paused = !!(T && T.event);
  }
}
$("bagBtn").onclick = openBag;
$("bagClose").onclick = closeBag;
$("bagOver").addEventListener("pointerdown", e => {
  if (e.target.id === "bagOver") closeBag();
});

function endTrip(text) {
  cardEl.hidden = true;
  cardT = 0;
  toastEl.hidden = true;
  const n = T ? T.found : 0,
    dirty = G.inv.filter(i => !i.clean).length;
  const wasManor = T && T.map === 3;
  const sBefore = seasonIdx();
  T = null;
  G.trips++;
  G.heat = Math.max(0, G.heat - 1);
  rollWx();
  const sNew =
    seasonIdx() !== sBefore ? `<br><b>Наступила ${season().name.toLowerCase()}.</b> ${season().line}` : "";
  const due = G.antDue || 0;
  G.money += due;
  G.antDue = 0;
  rollAnt();
  const exc = vitIncome();
  G.money += exc;
  G.msgBad = false;
  const dtxt = debtTick();
  G.msg = `${text}${due ? ` Антиквар продал вещи с комиссии: <b>+${rub(due)}</b>.` : ""}${exc ? ` Экскурсии по витрине: +${rub(exc)}.` : ""}${dtxt} Находок за поездку: ${n}.${dirty ? ` Неочищенных вещей: ${dirty} — почистите, чтобы узнать, что это.` : ""}${sNew}${rumorLine()}`;
  G.msgBad = dtxt.includes("коллектор");
  if (wasManor) {
    G.manorN = (G.manorN || 0) + 1;
    if (G.manorN === 2 && legFree("box"))
      G.msg += `<br><b>Дед вспомнил:</b> «В той усадьбе, говорят, барыня в восемнадцатом году перед отъездом что-то зарыла у липовой аллеи. Глубоко зарыла, на совесть».`;
  }
  tab = "sell";
  path = [];
  dest = null;
  save();
  showBase();
}
$("home").onclick = () => {
  if (T && !paused && digT <= 0) endTrip("Вы вернулись домой.");
};
// окно «День окончен»: чтобы переход в гараж не выглядел как вылет игры
function duskPic() {
  const c = document.createElement("canvas");
  c.width = 160;
  c.height = 64;
  const g = c.getContext("2d");
  const sky = ["#2a2440", "#4a3352", "#7a4a58", "#b8644e", "#e08a4a", "#f0b060"];
  sky.forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(0, i * 7, 160, 7);
  });
  for (let y = 0; y < 42; y++)
    for (let x = 0; x < 160; x++)
      if ((x * 7 + y * 13) % 11 === 0 && y % 7 > 4) {
        g.fillStyle = sky[Math.min(5, Math.floor(y / 7) + 1)];
        g.fillRect(x, y, 1, 1);
      }
  g.fillStyle = "#f8d890";
  g.beginPath();
  g.arc(112, 42, 9, Math.PI, 0);
  g.fill();
  g.fillStyle = "#fce8b0";
  g.beginPath();
  g.arc(112, 42, 6, Math.PI, 0);
  g.fill();
  [
    [20, 6],
    [38, 3],
    [64, 9],
    [90, 5],
    [140, 8]
  ].forEach(([x, y]) => {
    g.fillStyle = "#f4eedc";
    g.fillRect(x, y, 1, 1);
  });
  g.fillStyle = "#1e1a24";
  for (let x = 0; x < 160; x += 3) {
    const h = 4 + ((x * 37) % 7);
    g.fillRect(x, 42 - h, 3, h);
  }
  for (let i = 0; i < 9; i++) {
    const x = 6 + i * 19,
      h = 10 + ((i * 13) % 9);
    g.beginPath();
    g.moveTo(x, 42 - h);
    g.lineTo(x + 5, 42);
    g.lineTo(x - 5, 42);
    g.fill();
  }
  g.fillStyle = "#2a2014";
  g.fillRect(0, 42, 160, 22);
  g.fillStyle = "#3a2c1c";
  for (let y = 44; y < 64; y += 3) g.fillRect(0, y, 160, 1);
  g.fillStyle = "#141018";
  g.fillRect(52, 45, 26, 6);
  g.fillRect(56, 41, 16, 5);
  g.fillStyle = "#f6e08a";
  g.fillRect(76, 46, 3, 2);
  g.fillStyle = "#3a3040";
  g.fillRect(58, 42, 5, 3);
  g.fillRect(65, 42, 5, 3);
  g.fillStyle = "#0a0a0e";
  g.beginPath();
  g.arc(57, 51, 2.5, 0, 7);
  g.arc(73, 51, 2.5, 0, 7);
  g.fill();
  g.fillStyle = "#141018";
  g.fillRect(42, 38, 2, 9);
  g.fillRect(41, 36, 4, 3);
  g.fillRect(44, 40, 1, 6);
  g.fillStyle = "#141018";
  g.fillRect(38, 44, 1, 3);
  g.fillRect(37, 39, 1, 6);
  return c.toDataURL();
}
function dayOverPopup(n, end, se, wt) {
  const show = () => {
    if (!$("comic").hidden) {
      setTimeout(show, 400);
      return;
    }
    const box = $("evt");
    const dirty = G.inv.filter(i => !i.clean).length,
      S = SEASONS.find(x => x.id === se) || season();
    box.innerHTML = `<div class="sheet dayover"><img class="do-pic" src="${duskPic()}" alt=""><h2>День окончен</h2>
      <p>${end} — стемнело. ${S.name}, ${WEATHER[wt || "clear"].name}. Вы сложили лопату и поехали домой.</p>
      <ul><li><span>Находок за поездку</span><b>${n}</b></li>${dirty ? `<li><span>Ждут чистки</span><b>${dirty}</b></li>` : ""}<li><span>Деньги</span><b>${rub(G.money)}</b></li></ul>
      <p class="dim">Фонарь в мастерской даёт ещё 2 часа светлого времени.</p>
      <button class="btn" onclick="$('evt').hidden=true">В гараж</button></div>`;
    if (own("lamp")) box.querySelector(".dim").remove();
    box.hidden = false;
    SFX.story();
  };
  setTimeout(show, 60);
}
