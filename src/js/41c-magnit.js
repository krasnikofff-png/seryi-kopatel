// ================= ПОИСКОВЫЙ МАГНИТ (6-й уровень) =================
// У воды: закинуть магнит на верёвке и протащить по дну к берегу. Детектор в воде не берёт — магнит берёт только железо.
const MAG = [
  [1, 2, "Лодочная уключина", 1, 0.6],
  [1, 2, "Якорь-кошка", 1, 2],
  [1, 2, "Гирька «1 фунт»", 1, 0.4],
  [3, 1, "Ржавый наган", 1, 0.8],
  [3, 1, "Штык-нож от маузера", 1, 0.4],
  [4, 2, "Сейф купца", 1, 3]
];
Object.assign(FIND_IMG, {
  "Лодочная уключина": "@art(find-img/lodochnaya-uklyuchina.png)",
  "Якорь-кошка": "@art(find-img/yakor-koshka.png)",
  "Гирька «1 фунт»": "@art(find-img/girka-1-funt.png)",
  "Ржавый наган": "@art(find-img/rzhavyj-nagan.png)",
  "Штык-нож от маузера": "@art(find-img/shtyk-nozh-ot-mauzera.png)",
  "Сейф купца": "@art(find-img/sejf-kupca.png)"
});
Object.assign(FIND_DESC, {
  "Лодочная уключина":
    "Кованая уключина от рыбацкой лодки: в неё вставляли весло. Лодка давно сгнила, а железо лежит на дне.",
  "Якорь-кошка": "Четырёхлапая «кошка» — ей цепляли сети и доставали утопленное. Теперь утопленным оказалась она сама.",
  "Гирька «1 фунт»":
    "Торговая гирька с клеймом поверителя. Фунт — 409 граммов: так взвешивали чай и сахар до 1918 года.",
  "Ржавый наган":
    "Револьвер, проржавевший до неузнаваемости: барабан прикипел намертво. Стрелять из такого нельзя — только на полку под стекло.",
  "Штык-нож от маузера":
    "Немецкий штык-нож к винтовке Маузера. В воде сталь сохранилась лучше, чем в земле: ил не пускает кислород.",
  "Сейф купца":
    "Маленький несгораемый ящик. Замок проржавел насквозь, а внутри — слипшиеся ассигнации и пригоршня серебра."
});
ALB.push(MAG.map(q => ({ c: q[0], era: q[1], name: q[2], mag: 1 })));
ALB_ROW.push("Со дна · магнитом");
// какой слой лежит на дне: река у городища старше, пруд усадьбы — имперский, водохранилище — советское
const MAG_ERA = {
  hillfort: [0.15, 0.25, 0.3, 0.3, 0],
  flooded: [0.45, 0.3, 0.25, 0, 0],
  swamp: [0.2, 0.6, 0.2, 0, 0],
  manor: [0.25, 0.2, 0.55, 0, 0]
};
const MAG_PLACE = {
  hillfort: "река под городищем",
  flooded: "водохранилище",
  swamp: "болотное окно",
  manor: "пруд усадьбы"
};
function waterXY(x, y) {
  const w = worldKind;
  return w === "swamp"
    ? waterAt(x, y) > 0.6
    : w === "hillfort"
      ? hfWater(x, y)
      : w === "flooded"
        ? fldWater(x, y)
        : w === "manor"
          ? pondAt(x, y) < 0.85
          : false;
}
function nearWater() {
  if (!MAG_ERA[worldKind]) return false;
  const t = pTile();
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) {
      if (!dx && !dy) continue;
      const tx = t.tx + dx,
        ty = t.ty + dy;
      if (blocked(tx, ty) && waterXY(tx * TS + 8, ty * TS + 8)) return true;
    }
  return false;
}
const MAG_SVG = `<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="10" cy="5" r="3" fill="none" stroke="#c9c2b0" stroke-width="2"/><rect x="3" y="9" width="14" height="8" rx="2" fill="#8c8f96" stroke="#2a2117" stroke-width="1.5"/><rect x="5" y="11" width="10" height="2" fill="#c8ccd2"/></svg>`;
function magBtn() {
  const b = $("magBtn");
  if (!b) return;
  const ok = !!T && screen === "field" && perk("magnet") && nearWater();
  b.hidden = !ok;
  if (!ok) return;
  if (!G.magTip) {
    G.magTip = 1;
    toast("Рядом вода. Детектор под водой не берёт, а поисковый магнит — да. Кнопка «Закинуть магнит» сверху.");
  }
  const left = T.mag ? T.mag.pool.length : -1;
  b.innerHTML = `${MAG_SVG}<span>Закинуть магнит<small>${isWinter() ? "вода подо льдом" : left === 0 ? "здесь всё вытянули" : "10–20 мин за заброс"}</small></span>`;
}
// что лежит на дне у этой воды — одно на поездку
function magCat(c, eraW, mult) {
  const pool = CAT.filter(q => q[0] === c && q[3]),
    ws = pool.map(q => eraW[q[1]] || 0.02),
    q = pool[pickW(ws.map(w => w / ws.reduce((a, b) => a + b, 0)))];
  return { c, era: q[1], name: q[2], w: q[4], base: econBase(c, q[1], mult) };
}
function magPool() {
  const mult = REGIONS[T.region].mult,
    eraW = MAG_ERA[worldKind],
    n = 5 + Math.floor(Math.random() * 3),
    out = [];
  for (let k = 0; k < n; k++) {
    const x = M_T0 + Math.random() * M_TR,
      far = (x - M_T0) / M_TR,
      r = Math.random();
    let it;
    if (r < 0.45 - far * 0.25) it = magCat(0, eraW, mult);
    else if (r < 0.8 - far * 0.15) it = magCat(Math.random() < 0.55 ? 1 : 3, eraW, mult);
    else {
      const q = Math.random() < 0.1 + far * 0.1 ? MAG[5] : pick(MAG.slice(0, 5));
      it = { c: q[0], era: q[1], name: q[2], w: q[4], base: econBase(q[0], q[1], mult) };
    }
    it.x = x;
    out.push(it);
  }
  return out;
}
// ---- сцена: берег слева, вода, дно уходит вглубь вправо ----
const MW_ = 240,
  MH_ = 136,
  M_SURF = 56,
  M_EDGE = 50,
  M_T0 = M_EDGE + 14, // ближе всего бросить
  M_TR = 170, // разброс дальности броска
  M_MAX = 3; // больше трёх железок магнит не удержит
const magBottom = x => M_SURF + 10 + Math.max(0, x - M_EDGE) * 0.3 + Math.sin(x * 0.13) * 2;
const MAG_COL = {
  hillfort: { w: ["#5f8fa6", "#3d6478", "#24404f"], g: "#6f9a48", e: "#7a5a3a", silt: "#4a3c2a" },
  flooded: { w: ["#7d97a4", "#55707e", "#344752"], g: "#8a9a5a", e: "#8a7656", silt: "#5a4c38" },
  swamp: { w: ["#6d7f6a", "#4a5c4c", "#2c3a30"], g: "#5e6c3a", e: "#5a4a30", silt: "#2a2214" },
  manor: { w: ["#5f8a6a", "#41684e", "#284534"], g: "#6a9a44", e: "#6e5236", silt: "#3e3222" }
};
let MG = null;
function openMag() {
  if (!T || !perk("magnet")) return;
  if (isWinter()) {
    toast("Зимой вода подо льдом — магнит подождёт до весны.");
    return;
  }
  if (!T.mag) T.mag = { pool: magPool(), casts: 0 };
  if (!T.mag.pool.length) {
    toast("Магнит приходит пустой — у этой воды всё уже вытянули. Попробуйте в другой поездке.");
    return;
  }
  paused = true;
  MG = {
    ph: "aim",
    t: 0,
    p: 0,
    mx: 0,
    my: 0,
    tx: 0,
    hold: 0,
    ten: 0,
    on: [],
    got: [],
    lost: [],
    snaps: 0,
    bub: [],
    tick: 0
  };
  renderMag();
  $("magOver").hidden = false;
  if (!magLoop.run) {
    magLoop.run = 1;
    magLoop.last = performance.now();
    requestAnimationFrame(magLoop);
  }
}
function magAgain() {
  if (!MG || !T || !T.mag.pool.length) return;
  MG = null;
  openMag();
}
function closeMag() {
  $("magOver").hidden = true;
  MG = null;
  paused = !!(T && T.event);
  magBtn();
  updateHud();
  save();
}
function renderMag() {
  const s = $("magSheet");
  s.innerHTML = `<h2>Поисковый магнит</h2><p class="mg-place">${MAG_PLACE[worldKind]}</p><canvas id="magCv" width="${MW_}" height="${MH_}"></canvas><div id="magUi"></div>`;
  const cv = $("magCv"),
    hold = v => e => {
      e.preventDefault();
      magPress(v);
    };
  cv.addEventListener("pointerdown", hold(1));
  cv.addEventListener("pointerup", hold(0));
  cv.addEventListener("pointerleave", hold(0));
  cv.addEventListener("pointercancel", hold(0));
  magUi();
}
function magUi() {
  const u = $("magUi");
  if (!u || !MG) return;
  if (MG.ph === "done") {
    const up = MG.up ? lvlUpTxt() : "";
    u.innerHTML = `<p class="mg-res">${MG.got.length ? `<b>Вытянули:</b>` : "Магнит пришёл пустой — только тина."}</p>${MG.got.length ? `<ul class="mg-got">${MG.got.map(it => `<li><img src="${FIND_IMG[it.name] || ""}" alt=""><span>${it.name}<small>${it.c === 0 ? "мусор — только в металлолом" : `${CLASSES[it.c].name} · почистите дома`}</small></span></li>`).join("")}</ul>` : ""}${MG.snaps ? `<p class="mg-warn">Что-то тяжёлое сорвалось и ушло обратно на дно. Тяните рывками: держите, пока шкала не покраснеет, и отпускайте.</p>` : ""}${MG.lost.length ? `<p class="mg-warn">${MG.lost.join(" ")}</p>` : ""}<p class="mg-note">Заброс занял ${MG.cost} мин.${up}</p><div class="row">${T.mag.pool.length && T.minutes < dayEnd() ? `<button class="btn" onclick="SK.magAgain()">Закинуть ещё</button>` : `<p class="mg-note">${T.mag.pool.length ? "Темнеет — пора сматывать верёвку." : "Похоже, у этой воды больше ничего нет."}</p>`}<button class="btn ghost" onclick="SK.magClose()">Смотать верёвку</button></div>`;
    return;
  }
  const lab =
    MG.ph === "aim"
      ? ["Бросить", "Нажмите, когда стрелка на нужной дальности. Дальше — глубже и старше, но дольше тянуть."]
      : MG.ph === "pull"
        ? [
            "Тянуть",
            MG.on.some(o => o.heavy)
              ? "<b>Тяжёлое!</b> Тяните рывками: держите, пока шкала натяжения не покраснеет, и отпускайте."
              : MG.snapNow
                ? "<b>Сорвалось!</b> Слишком сильно тянули. Вещь осталась на дне."
                : "Держите кнопку — магнит ползёт по дну к берегу и собирает железо."
          ]
        : ["…", "Магнит летит."];
  u.innerHTML = `<p class="mg-note">${lab[1]}</p><div class="row"><button class="btn mg-act" id="magAct">${lab[0]}</button>${MG.ph === "aim" ? `<button class="btn ghost" onclick="SK.magClose()">Не бросать</button>` : ""}</div>`;
  const a = $("magAct");
  a.disabled = MG.ph === "fly" || MG.ph === "sink";
  a.addEventListener("pointerdown", e => {
    e.preventDefault();
    magPress(1);
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev =>
    a.addEventListener(ev, e => {
      e.preventDefault();
      magPress(0);
    })
  );
  a.addEventListener("contextmenu", e => e.preventDefault());
}
function magPress(v) {
  if (!MG) return;
  if (MG.ph === "aim" && v) {
    MG.ph = "fly";
    MG.t = 0;
    MG.tx = M_T0 + MG.p * M_TR;
    T.mag.casts++;
    magSnd("whoosh");
    magUi();
    return;
  }
  if (MG.ph === "pull") MG.hold = v;
}
function magSnd(k) {
  const c = sfxCtx();
  if (!c) return;
  const t = c.currentTime + 0.02;
  if (k === "whoosh") sNoise(c, t, 0.35, 0.18, "bandpass", 900, 0.8, 0.12);
  else if (k === "splash") {
    sNoise(c, t, 0.45, 0.4, "lowpass", 1100, 0.7, 0.01);
    sNoise(c, t + 0.05, 0.3, 0.15, "bandpass", 2600, 1.2);
  } else if (k === "clank") {
    sTone(c, 210, t, 0.22, 0.35, "square", 150);
    sTone(c, 620, t, 0.18, 0.12, "triangle");
    sNoise(c, t, 0.06, 0.25, "bandpass", 1500, 1.5);
  } else if (k === "tick") sNoise(c, t, 0.025, 0.08, "highpass", 3000, 0.7);
  else if (k === "snap") {
    sNoise(c, t, 0.12, 0.35, "highpass", 1800, 0.8);
    sTone(c, 140, t, 0.2, 0.25, "sine", 70);
  }
}
function magLoop(now) {
  if (!MG) {
    magLoop.run = 0;
    return;
  }
  requestAnimationFrame(magLoop);
  const dt = Math.min(0.05, (now - magLoop.last) / 1000);
  magLoop.last = now;
  try {
    magStep(dt);
    magDraw();
  } catch (e) {
    console.error(e);
  }
}
const M_HAND = { x: 29, y: 42 };
function magStep(dt) {
  MG.t += dt;
  // пузыри из ила — подсказка, где что-то лежит
  if (Math.random() < dt * 1.2 && T.mag.pool.length) {
    const o = pick(T.mag.pool);
    MG.bub.push({ x: o.x + (Math.random() - 0.5) * 6, y: magBottom(o.x) - 3, a: 1 });
  }
  for (let i = MG.bub.length - 1; i >= 0; i--) {
    const b = MG.bub[i];
    b.y -= 16 * dt;
    b.x += Math.sin(b.y * 0.3) * 0.2;
    if (b.y < M_SURF + 1) MG.bub.splice(i, 1);
  }
  if (MG.ph === "aim") {
    const k = (MG.t / 1.7) % 2;
    MG.p = k < 1 ? k : 2 - k;
  } else if (MG.ph === "fly") {
    const k = Math.min(1, MG.t / 0.75);
    MG.mx = M_HAND.x + (MG.tx - M_HAND.x) * k;
    MG.my = M_HAND.y + (M_SURF - M_HAND.y) * k - Math.sin(k * Math.PI) * (22 + MG.p * 22);
    if (k >= 1) {
      MG.ph = "sink";
      MG.t = 0;
      magSnd("splash");
      MG.splash = { x: MG.tx, t: 0 };
    }
  } else if (MG.ph === "sink") {
    const by = magBottom(MG.mx) - 3,
      k = Math.min(1, MG.t / 0.9);
    MG.my = M_SURF + (by - M_SURF) * k;
    if (k >= 1) {
      MG.ph = "pull";
      MG.t = 0;
      magUi();
    }
  } else if (MG.ph === "pull") {
    const heavy = MG.on.some(o => o.heavy);
    if (MG.hold) {
      const sp = heavy ? 8 : 26;
      MG.tick += dt;
      if (MG.tick > 0.13) {
        MG.tick = 0;
        magSnd("tick");
      }
      const nx = MG.mx - sp * dt;
      if (MG.mx > M_EDGE) {
        // проходим над вещами на дне
        for (let i = T.mag.pool.length - 1; i >= 0; i--) {
          const o = T.mag.pool[i];
          if (o.x <= MG.mx && o.x > nx && !o.miss) {
            if (MG.on.length < M_MAX && Math.random() < 0.45) {
              T.mag.pool.splice(i, 1);
              o.heavy = o.w >= 2;
              MG.on.push(o);
              MG.snapNow = 0;
              magSnd("clank");
              MG.jolt = 0.25;
              magUi();
            } else o.miss = MG.tx;
          }
        }
        MG.mx = Math.max(M_EDGE, nx);
        MG.my = magBottom(MG.mx) - 3;
      } else {
        // по откосу к руке
        const k = Math.min(1, (M_EDGE - nx) / 16);
        MG.mx = Math.max(M_HAND.x + 6, nx);
        MG.my = magBottom(M_EDGE) - 3 + (M_HAND.y + 6 - (magBottom(M_EDGE) - 3)) * k;
        if (MG.mx <= M_HAND.x + 6) magFinish();
      }
      if (heavy) {
        MG.ten += dt * 0.6;
        if (MG.ten >= 1) {
          const o = MG.on.find(x => x.heavy);
          MG.on.splice(MG.on.indexOf(o), 1);
          o.x = Math.max(M_EDGE + 6, MG.mx);
          T.mag.pool.push(o);
          MG.ten = 0;
          MG.hold = 0;
          MG.snaps++;
          MG.snapNow = 1;
          magSnd("snap");
          magUi();
        }
      }
    } else MG.ten = Math.max(0, MG.ten - dt * 0.9);
    if (!heavy) MG.ten = Math.max(0, MG.ten - dt * 2);
  }
  if (MG.jolt) MG.jolt = Math.max(0, MG.jolt - dt);
  if (MG.splash) MG.splash.t += dt;
}
function magFinish() {
  MG.ph = "done";
  MG.hold = 0;
  const far = (MG.tx - M_T0) / M_TR;
  MG.cost = 10 + Math.round(far * 10);
  T.minutes += MG.cost;
  T.mag.pool.forEach(o => delete o.miss);
  let xp = 0;
  for (const o of MG.on) {
    if (bagW() + soilW(o.w) > bagCap()) {
      o.x = M_EDGE + 10;
      T.mag.pool.push(o);
      MG.lost.push(
        `${o.c === 0 ? o.name : "Тяжёлая железка"} не влезла в сумку — оставили у воды. Освободите место и закиньте снова.`
      );
      continue;
    }
    const it = {
      wet: 1,
      tid: T.id,
      name: o.name,
      c: o.c,
      iron: 1,
      era: o.era,
      w: o.w,
      base: o.base,
      cond: Math.round(rnd(0.5, 0.95) * 100) / 100,
      depth: 0,
      clean: false,
      mag: 1
    };
    if (it.c === 0) {
      it.clean = true;
      it.gr = 2;
    } else dexAdd(it.name);
    G.inv.push(it);
    T.found++;
    xp += CLASSES[it.c].xp;
    MG.got.push(it);
  }
  MG.on = [];
  MG.up = xp ? gainXp(xp) : false;
  if (MG.got.some(i => i.c > 0)) SFX.clink();
  updateHud();
  save();
  magUi();
}
function magDraw() {
  const cv = $("magCv");
  if (!cv) return;
  const g = cv.getContext("2d"),
    C = MAG_COL[worldKind] || MAG_COL.manor,
    night = T.night;
  g.imageSmoothingEnabled = false;
  // небо
  const sky = g.createLinearGradient(0, 0, 0, M_SURF);
  sky.addColorStop(0, night ? "#0c1430" : "#9cc4dc");
  sky.addColorStop(1, night ? "#1c2444" : "#dfe9d8");
  g.fillStyle = sky;
  g.fillRect(0, 0, MW_, M_SURF);
  // дальний берег
  g.fillStyle = night ? "#1a2a1a" : worldKind === "swamp" ? "#3e5a2e" : "#5a7a40";
  for (let x = 0; x < MW_; x += 2) {
    const h = 6 + Math.sin(x * 0.07) * 3 + Math.sin(x * 0.19) * 2;
    g.fillRect(x, M_SURF - h, 2, h);
  }
  // вода и дно
  const wat = g.createLinearGradient(0, M_SURF, 0, MH_);
  wat.addColorStop(0, C.w[0]);
  wat.addColorStop(0.45, C.w[1]);
  wat.addColorStop(1, C.w[2]);
  g.fillStyle = wat;
  g.fillRect(0, M_SURF, MW_, MH_ - M_SURF);
  g.fillStyle = "rgba(255,255,255,.35)";
  for (let x = (MG.t * 6) % 14; x < MW_; x += 14) g.fillRect(x, M_SURF, 6, 1);
  g.fillStyle = C.silt;
  for (let x = 0; x < MW_; x++) {
    const y = Math.round(magBottom(x));
    g.fillRect(x, y, 1, MH_ - y);
  }
  g.fillStyle = "rgba(255,240,200,.12)";
  for (let x = 0; x < MW_; x++) g.fillRect(x, Math.round(magBottom(x)), 1, 1);
  g.fillStyle = "rgba(0,0,0,.18)";
  for (let x = 3; x < MW_; x += 9) g.fillRect(x, Math.round(magBottom(x)) + 3 + (x % 4), 2, 1);
  // ближний берег (откос)
  g.fillStyle = C.e;
  g.beginPath();
  g.moveTo(0, 50);
  g.lineTo(38, 50);
  g.lineTo(M_EDGE + 4, magBottom(M_EDGE + 4));
  g.lineTo(M_EDGE + 4, MH_);
  g.lineTo(0, MH_);
  g.fill();
  g.fillStyle = C.g;
  g.fillRect(0, 48, 40, 3);
  for (let x = 0; x < 39; x += 3) g.fillRect(x, 46 - (x % 2), 1, 2);
  if (worldKind === "swamp" || worldKind === "manor") {
    g.fillStyle = "#6a7a3a";
    for (const x of [44, 47, 206, 211, 219]) g.fillRect(x, M_SURF - 10 - (x % 3), 1, 12);
  }
  // пузыри
  g.fillStyle = "rgba(220,240,255,.7)";
  for (const b of MG.bub) g.fillRect(Math.round(b.x), Math.round(b.y), 2, 2);
  // копатель
  const im = heroImg(G.det) || HERO_DET[1];
  if (im && im.complete !== false && im.naturalWidth !== 0) g.drawImage(im, 0, 2 * 42, 24, 42, 8, 21, 24, 42);
  // прицел
  if (MG.ph === "aim") {
    const ax = M_T0 + MG.p * M_TR;
    g.fillStyle = "rgba(255,240,180,.9)";
    for (let x = M_HAND.x; x < ax; x += 4) {
      const k = (x - M_HAND.x) / (ax - M_HAND.x);
      g.fillRect(x, Math.round(M_HAND.y + (M_SURF - M_HAND.y) * k - Math.sin(k * Math.PI) * (22 + MG.p * 22)), 1, 1);
    }
    g.fillStyle = "#f6dc6a";
    g.fillRect(ax - 1, M_SURF - 6, 3, 5);
    g.fillRect(ax - 3, M_SURF - 8, 7, 2);
  }
  // всплеск
  if (MG.splash && MG.splash.t < 0.6) {
    const k = MG.splash.t / 0.6;
    g.fillStyle = `rgba(230,245,255,${(1 - k).toFixed(2)})`;
    for (let i = -3; i <= 3; i++)
      g.fillRect(MG.splash.x + i * 3, M_SURF - 2 - Math.abs(3 - Math.abs(i)) * 3 * (1 - k) - 2, 2, 2);
  }
  // верёвка и магнит
  if (MG.ph !== "aim" && MG.ph !== "done") {
    const jx = MG.jolt ? (Math.random() - 0.5) * 2 : 0;
    g.strokeStyle = night ? "#8a8270" : "#e8dcb8";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(M_HAND.x, M_HAND.y);
    if (MG.ph === "fly") g.lineTo(MG.mx, MG.my - 3);
    else {
      // верёвка входит в воду и уходит к магниту
      const ex = Math.min(MG.mx, M_EDGE + 8 + (MG.mx - M_EDGE) * 0.3),
        sag = MG.hold ? 1 : 6;
      g.quadraticCurveTo((M_HAND.x + ex) / 2, (M_HAND.y + M_SURF) / 2 + sag, ex, M_SURF);
      g.lineTo(MG.mx + jx, MG.my - 3);
    }
    g.stroke();
    const mx = Math.round(MG.mx + jx),
      my = Math.round(MG.my);
    MG.on.forEach((o, i) => {
      const fi = magImg(o.name);
      if (fi) g.drawImage(fi, mx - 9 + i * 5, my - 12 + (i % 2) * 3, 18, 18);
    });
    g.fillStyle = "#2a2117";
    g.fillRect(mx - 5, my - 3, 10, 6);
    g.fillStyle = "#9ca0a8";
    g.fillRect(mx - 4, my - 2, 8, 4);
    g.fillStyle = "#d8dce2";
    g.fillRect(mx - 3, my - 2, 6, 1);
    g.fillStyle = "#c9c2b0";
    g.fillRect(mx - 1, my - 5, 2, 2);
  }
  // шкала дальности / натяжения
  if (MG.ph === "aim") {
    g.fillStyle = "rgba(20,16,10,.7)";
    g.fillRect(40, 4, 160, 8);
    const gr = g.createLinearGradient(41, 0, 199, 0);
    gr.addColorStop(0, "#7f9c40");
    gr.addColorStop(1, "#c9a23a");
    g.fillStyle = gr;
    g.fillRect(41, 5, 158 * MG.p, 6);
    g.fillStyle = "#fffbe8";
    g.font = "bold 8px sans-serif";
    g.fillText("берег", 41, 21);
    g.fillText("глубина", 168, 21);
  } else if (MG.ph === "pull" && MG.on.some(o => o.heavy)) {
    g.fillStyle = "rgba(20,16,10,.7)";
    g.fillRect(40, 4, 160, 8);
    g.fillStyle = MG.ten > 0.75 ? "#d84a32" : MG.ten > 0.5 ? "#e2ae44" : "#7f9c40";
    g.fillRect(41, 5, 158 * MG.ten, 6);
    g.fillStyle = "#fffbe8";
    g.font = "bold 8px sans-serif";
    g.fillText("натяжение", 41, 21);
  }
  if (night) {
    g.fillStyle = "rgba(6,10,28,.45)";
    g.fillRect(0, 0, MW_, MH_);
  }
}
const magImgs = {};
function magImg(n) {
  if (!FIND_IMG[n]) return null;
  if (!magImgs[n]) {
    const im = new Image();
    im.src = FIND_IMG[n];
    magImgs[n] = im;
  }
  return magImgs[n].complete && magImgs[n].naturalWidth ? magImgs[n] : null;
}
document.addEventListener(
  "keydown",
  e => {
    if (!MG || (e.code !== "Space" && e.code !== "KeyF") || e.repeat) return;
    e.preventDefault();
    e.stopPropagation();
    magPress(1);
  },
  true
);
document.addEventListener(
  "keyup",
  e => {
    if (!MG || (e.code !== "Space" && e.code !== "KeyF")) return;
    magPress(0);
  },
  true
);
