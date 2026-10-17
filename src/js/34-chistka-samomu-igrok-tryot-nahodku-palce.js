// ===== ЧИСТКА САМОМУ: игрок трёт находку пальцем =====
let scrubSt = null;
function openScrub(idx) {
  const it = G.inv[idx];
  if (!it) return;
  const SZ = 288,
    K = SZ / 32,
    el = $("scrub");
  const pic = it.story ? storyItemPic(it.story) : FIND_IMG[it.name] || dirtySprite(it);
  el.innerHTML = `<div class="sc-box"><h3>Чистка: ${shownName(it)}</h3><p class="sc-hint" id="scHint">Водите пальцем по находке, чтобы счистить грязь. Не трите слишком быстро — можно поцарапать.</p>
    <div class="sc-cv"><canvas id="scCv" width="${SZ}" height="${SZ}"></canvas></div>
    <div class="sc-bar"><i id="scBar"></i></div><div class="sc-row"><span id="scPct">0%</span><span id="scScr" class="sc-scr"></span></div>
    <div class="sc-btns"><button class="sc-cancel" onclick="SK.scrubCancel()">Отложить</button><button class="sc-done" id="scDone" disabled onclick="SK.scrubDone()">Готово</button></div></div>`;
  el.hidden = false;
  scrubLock(true);
  const cv = $("scCv"),
    g = cv.getContext("2d");
  g.imageSmoothingEnabled = false;
  const img = new Image(),
    dirt = document.createElement("canvas");
  dirt.width = dirt.height = SZ;
  const d = dirt.getContext("2d");
  const st = (scrubSt = {
    idx,
    it,
    cv,
    g,
    img,
    dirt,
    d,
    pts: [],
    last: null,
    scr: 0,
    done: false,
    pct: 0,
    tick: 0,
    warnT: 0
  });
  img.onload = () => {
    const m = document.createElement("canvas");
    m.width = m.height = 32;
    const mg = m.getContext("2d");
    mg.drawImage(img, 0, 0, 32, 32);
    const md = mg.getImageData(0, 0, 32, 32).data;
    const r = rng(idx * 131 + it.depth * 7 + (it.base | 0)),
      col = it.iron ? ["#6a4426", "#8a5a32", "#5a3a20", "#7a4a2a"] : ["#5e5038", "#6e5e40", "#4e4430", "#7a6a48"];
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 32; x++) {
        let on = false;
        for (let dy = -2; dy <= 2 && !on; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const xx = x + dx,
              yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < 32 && yy < 32 && md[(yy * 32 + xx) * 4 + 3] > 40) {
              on = true;
              break;
            }
          }
        if (!on) continue;
        if (md[(y * 32 + x) * 4 + 3] > 40) st.pts.push([x * K + K / 2, y * K + K / 2]);
        d.fillStyle = col[Math.floor(r() * 4)];
        d.fillRect(x * K, y * K, K, K);
        if (r() < 0.35) {
          d.fillStyle = it.iron ? "#9a5a2a" : "#7a8a4a";
          d.fillRect(x * K + Math.floor((r() * K) / 2), y * K + Math.floor((r() * K) / 2), K / 2, K / 2);
        }
      }
    for (let k = 0; k < 70; k++) {
      const x = r() * SZ,
        y = r() * SZ;
      const a = d.getImageData(x | 0, y | 0, 1, 1).data[3];
      if (!a) continue;
      d.fillStyle = "rgba(40,30,18,.6)";
      d.fillRect(Math.floor(x / K) * K, Math.floor(y / K) * K, K, K);
    }
    drawScrub();
  };
  img.src = pic;
  const pos = e => {
    const b = cv.getBoundingClientRect();
    return [((e.clientX - b.left) * SZ) / b.width, ((e.clientY - b.top) * SZ) / b.height, performance.now()];
  };
  const rub = p => {
    const [x, y, t] = p;
    const L = st.last;
    d.save();
    d.globalCompositeOperation = "destination-out";
    d.lineCap = "round";
    d.lineWidth = 44;
    if (L) {
      d.beginPath();
      d.moveTo(L[0], L[1]);
      d.lineTo(x, y);
      d.stroke();
      const dist = Math.hypot(x - L[0], y - L[1]),
        dt = Math.max(1, t - L[2]),
        v = dist / dt;
      // царапает только очень резкое движение: обычные быстрые взмахи пальцем — без вреда
      if (v > 4.5 && st.pct < 0.98) {
        st.scr += dist;
        st.warnT = t;
      }
    } else {
      d.beginPath();
      d.arc(x, y, 22, 0, 7);
      d.fill();
    }
    d.restore();
    st.last = p;
    if (t - st.tick > 110) {
      st.tick = t;
      SFX.scrub && SFX.scrub();
    }
    drawScrub();
  };
  cv.onpointerdown = e => {
    e.preventDefault();
    cv.setPointerCapture(e.pointerId);
    st.last = null;
    rub(pos(e));
  };
  cv.onpointermove = e => {
    if (!cv.hasPointerCapture(e.pointerId)) return;
    e.preventDefault();
    rub(pos(e));
  };
  cv.onpointerup = cv.onpointercancel = () => {
    st.last = null;
  };
}
function drawScrub() {
  const st = scrubSt;
  if (!st) return;
  const { g, img, dirt, cv } = st,
    SZ = cv.width;
  g.clearRect(0, 0, SZ, SZ);
  g.fillStyle = "#2a2117";
  g.fillRect(0, 0, SZ, SZ);
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 0, 0, SZ, SZ);
  g.drawImage(dirt, 0, 0);
  const scrF = Math.min(1, st.scr / (SZ * 5));
  if (scrF > 0) {
    g.strokeStyle = `rgba(255,240,220,${(0.25 + scrF * 0.5).toFixed(2)})`;
    g.lineWidth = 1;
    const r = rng(st.idx + 3);
    for (let k = 0; k < Math.round(scrF * 14); k++) {
      const x = 40 + r() * (SZ - 80),
        y = 40 + r() * (SZ - 80);
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + 18 - r() * 36, y + 18 - r() * 36);
      g.stroke();
    }
  }
  if (st.pts.length) {
    const dd = st.d.getImageData(0, 0, SZ, SZ).data;
    let c = 0;
    for (const [x, y] of st.pts) if (dd[((y | 0) * SZ + (x | 0)) * 4 + 3] < 60) c++;
    st.pct = c / st.pts.length;
  }
  const p = Math.round(st.pct * 100);
  $("scBar").style.width = p + "%";
  $("scPct").textContent = `Очищено: ${p}%`;
  $("scScr").textContent = scrF > 0 ? `Царапины: ${scrF < 0.2 ? "мелкие" : scrF < 0.5 ? "заметные" : "глубокие"}` : "";
  const warn = performance.now() - st.warnT < 700;
  $("scHint").textContent = warn
    ? "Осторожно! Слишком сильно — царапаете находку."
    : st.pct >= 0.9
      ? "Готово — можно смотреть, что получилось."
      : "Водите пальцем по находке, чтобы счистить грязь. Не трите слишком быстро — можно поцарапать.";
  $("scHint").classList.toggle("warn", warn);
  $("scDone").disabled = st.pct < 0.9;
  if (st.pct >= 0.97 && !st.done) {
    st.done = true;
    setTimeout(scrubDone, 350);
  }
}
// пока открыта чистка, страница под окном не прокручивается (на телефоне палец иначе тянет фон)
const scrubNoScroll = e => e.preventDefault();
function scrubLock(on) {
  document.documentElement.classList.toggle("noscroll", on);
  const el = $("scrub");
  if (on) el.addEventListener("touchmove", scrubNoScroll, { passive: false });
  else el.removeEventListener("touchmove", scrubNoScroll);
}
function scrubDone() {
  const st = scrubSt;
  if (!st || st.pct < 0.9) return;
  scrubSt = null;
  $("scrub").hidden = true;
  $("scrub").innerHTML = "";
  scrubLock(false);
  const scrF = Math.min(1, st.scr / (st.cv.width * 5));
  clean(st.idx, true, 0.25 + 1.5 * scrF, scrF < 0.05);
}
function scrubCancel() {
  scrubSt = null;
  $("scrub").hidden = true;
  $("scrub").innerHTML = "";
  scrubLock(false);
}
function clean(idx, self, rm, careful) {
  const it = G.inv[idx];
  if (!it || it.clean) return;
  if (self && rm == null) {
    openScrub(idx);
    return;
  }
  if (!self) {
    if (G.money < CLEAN_FEE) return;
    G.money -= CLEAN_FEE;
  }
  reveal(it, self, rm, careful);
  SFX.clean(!!it._new.note);
  if (it.leg) setTimeout(() => SFX.legend(), 900);
  else if (it.gr >= 4) setTimeout(() => SFX.levelup(), 1250);
  msg("");
  openFind = it;
  save();
  renderBase();
}
function cleanAll(self) {
  const list = G.inv.filter(i => !i.clean);
  if (!list.length) return;
  if (!self) {
    const c = list.length * CLEAN_FEE;
    if (G.money < c) return;
    G.money -= c;
  }
  list.forEach(i => reveal(i, self));
  const bad = list.filter(i => i._new.note).length,
    top = list.filter(i => i.gr === 4).length,
    rare = list.filter(i => i.gr === 5).length;
  list.forEach(i => (i._new.anim = 0));
  SFX.clean(bad > 0);
  if (top || rare) setTimeout(() => SFX.levelup(), 900);
  msg(
    `${self ? "Почищено" : `Мастер почистил за ${rub(list.length * CLEAN_FEE)}`}: ${list.length} шт.${rare ? ` ★ Редкая разновидность: ${rare}!` : ""}${top ? ` Отличная сохранность: ${top}.` : ""}${bad ? ` Испорчено при чистке: ${bad}.` : ""} Нажмите на находку, чтобы узнать, что с ней делать.`,
    !!bad
  );
  save();
  renderBase();
}
function sellDirty(idx) {
  const it = G.inv[idx];
  const p = dirtyPrice(it);
  G.money += p;
  SFX.coins(4);
  G.inv.splice(idx, 1);
  msg(`Скупщик забрал «${shownName(it)}» в грязи за ${rub(p)}. Какая там была сохранность — уже не узнать.`);
  save();
  renderBase();
}
function sell(idx, chId) {
  const it = G.inv[idx],
    ch = CHANNELS.find(c => c.id === chId);
  if (!it) return;
  const p = ch.id === "mus" ? museumPay(it) : sellPrice(it, ch),
    was = rank().name;
  const raid = G.heat * 0.07 * (1 - sk("svyazi") * 0.08) * (G.rep <= -15 ? 2 : 1);
  if (ch.id === "blk" && Math.random() < raid) {
    const fine = Math.max(2000, Math.round(G.money * 0.3));
    G.money = Math.max(0, G.money - fine);
    G.inv.splice(idx, 1);
    G.heat += 1;
    SFX.thud();
    msg(`Облава! ${it.name} изъяли, штраф ${rub(fine)}.`, true);
    openFind = null;
    raidInfo = { it, fine, price: p, no: 1000 + Math.floor(Math.random() * 9000) };
  } else {
    if (ch.id === "ant") {
      if (antWhy(it)) return;
      G.antDue = (G.antDue || 0) + p;
      G.antLeft--;
    } else G.money += p;
    if (ch.id === "mus") SFX.museum();
    else SFX.coins(ch.id === "ant" ? 3 : p > 5000 ? 8 : 5);
    G.inv.splice(idx, 1);
    G.heat = Math.max(0, G.heat + ch.heat);
    const d = ch.id === "mus" ? giftRep(it) + (setOn("rek") ? 1 : 0) : ch.id === "blk" ? blackRep(it) : 0;
    if (ch.id === "blk") wstAdd("blk");
    G.rep += d;
    msg(
      ch.id === "mus"
        ? `«Спасибо, Серый. В экспозицию пойдёт». ${it.name} — в дар музею. Совесть +${d}${p ? `, премия ${rub(p)}` : ""}.`
        : ch.id === "ant"
          ? `Антиквар взял на комиссию: ${it.name}. ${rub(p)} придут после следующей поездки.`
          : `Продано: ${it.name} за ${rub(p)}.${d ? ` Совесть ${d}.` : ""}`
    );
    if (ch.id === "buy") rumorTry();
    G.msgSav = ch.id === "mus" ? G.msg : "";
    if (rank().name !== was) G.msg += `<br><b>Новое звание: «${rank().name}»</b> — ${rank().perk}.`;
  }
  save();
  renderBase();
  if (raidInfo) showRaid();
  else if (ch.id === "mus" && G.story && G.story.st === 1) setTimeout(storyMuseum, 300);
}
// слухи о том, чего игрок ещё не видел: особые места, легенды, древность, пустые страницы альбома
function rumorLine() {
  if (Math.random() > (perk("forum") ? 0.6 : 0.4)) return "";
  const R = [],
    seen = G.rumSeen || [],
    d = G.dex || {};
  if (!G.hfOwn)
    R.push([
      "hf",
      "На форуме пишут",
      "у городища на мысу над рекой кто-то поднял наконечник стрелы. Отчёт экспедиции 1954 года продаёт вдова археолога — загляните во вкладку «Карты», регион «Область»."
    ]);
  if (!G.fldSeen)
    R.push([
      "fld",
      "Дед вспомнил",
      "«Летом вода в водохранилище уходит — показывается старая деревня. Мы там до затопления жили». Ищите во вкладке «Карты», регион «Пригород», летом и осенью."
    ]);
  if (!ALB[4].some(x => d[x.name]))
    R.push([
      "anc",
      "Савельич рассказывал",
      "«Под слоем старины лежит древность — глубже 120 см. Простой лопатой не взять, нужен мотобур»."
    ]);
  Object.entries(LEGENDS).forEach(([k, L]) => {
    if (!(G.leg && G.leg[k])) R.push(["leg_" + k, "Ходят слухи", L.hint]);
  });
  ALB.forEach((a, e) => {
    const n = a.filter(x => !d[x.name]).length;
    if (e < 5 && n >= 5)
      R.push([
        "alb" + e + "_" + Math.floor(n / 10),
        "В альбоме пусто",
        `не хватает ${n} ${plural(n, "вещи", "вещей", "вещей")} (${ERAS[e].name}). Ищите ${ALB_TIP[e]}.`
      ]);
  });
  const fresh = R.filter(r => !seen.includes(r[0]));
  if (!fresh.length) return "";
  const r = pick(fresh);
  G.rumSeen = seen.concat(r[0]).slice(-40);
  return `<br><b>${r[1]}:</b> ${r[2]}`;
}
function rumorTry() {
  if (G.rumor || Math.random() > RUMOR_CHANCE) return;
  G.rumor = 1;
  G.msg += `<br><b>Скупщик шепнул:</b> «${pick(["На барахолке у вокзала дед продаёт старые схемы — скажи, что от меня", "В архиве знакомая, сделает копию подешевле", "Местные помнят, где хутор стоял, — спроси у них"])}». Следующая карта на 30% дешевле.`;
}
function sellAllBuy() {
  SFX.coins(9);
  let sum = 0,
    n = 0;
  for (let i = G.inv.length - 1; i >= 0; i--) {
    const it = G.inv[i];
    if (!it.clean || it.story || it.leg || it.c === 0) continue; // мусор скупщик не берёт — только металлолом
    sum += sellPrice(it, CHANNELS[0]);
    n++;
    G.inv.splice(i, 1);
  }
  if (!n) return;
  G.money += sum;
  msg(`Скупщик забрал всё оптом: ${n} ${plural(n, "вещь", "вещи", "вещей")} за ${rub(sum)}.`);
  rumorTry();
  save();
  renderBase();
}
function sellJunk() {
  SFX.coins(4);
  let sum = 0,
    n = 0;
  for (let i = G.inv.length - 1; i >= 0; i--) {
    const it = G.inv[i];
    if (it.clean && it.c === 0 && !it._new) {
      sum += Math.round(5 + Math.random() * 15);
      G.inv.splice(i, 1);
      n++;
    }
  }
  G.money += sum;
  msg(`Мусор сдан в металлолом: ${n} шт. за ${rub(sum)}.`);
  save();
  renderBase();
}
function sellOneJunk(i) {
  const it = G.inv[i];
  if (!it || it.c !== 0) return;
  const p = Math.round(5 + Math.random() * 15);
  G.money += p;
  SFX.coins(2);
  G.inv.splice(i, 1);
  msg(`${it.name} — в металлолом за ${rub(p)}.`);
  save();
  renderBase();
}
function buy(kind) {
  const tbl = { shovel: SHOVEL, det: DET, transport: TRANSPORT }[kind],
    nx = tbl[G[kind] + 1];
  if (!nx || G.money < nx.price) return;
  G.money -= nx.price;
  G[kind]++;
  SFX.upgrade();
  const what =
    kind === "det"
      ? `Теперь детектор ${nx.desc}, слышит до ${nx.depth} см. Экран прибора в поле тоже поменялся.`
      : kind === "shovel"
        ? `Теперь яма до ${nx.depth} см, за один копок +${nx.step} см.`
        : `Теперь сумка на ${nx.cap} кг, открыт регион «${REGIONS[nx.region].name}».`;
  const opened = kind === "transport" && nx.region > tbl[G[kind] - 1].region;
  msg(`Куплено: ${nx.name}. ${what}`);
  if (opened) G.region = nx.region;
  save();
  renderBase();
  if (opened) showRegionIntro(nx.region);
}
function learn(id) {
  if (G.sp < 1 || skl(id) >= SKMAX) return;
  G.sp--;
  G.skills[id]++;
  SFX.levelup();
  msg(`Навык «${SKILLS.find(s => s.id === id).name}» — уровень ${G.skills[id]}.`);
  save();
  renderBase();
}
function setRegion(r) {
  if (r <= TRANSPORT[G.transport].region) {
    G.region = r;
    G.place = 0;
    save();
    renderBase();
  }
}
function placeLocked(id) {
  msg(placeLockTxt(id), true);
  save();
  renderBase();
  window.scrollTo(0, 0);
}
function setPlace(id) {
  if (!placeOpen(id)) return placeLocked(id);
  G.place = id;
  save();
  renderBase();
}
function buyPlace(id) {
  const P = PLACES[id];
  if (id !== 4 || G.hfOwn || G.money < P.unlock || G.det < 4) return;
  G.money -= P.unlock;
  G.hfOwn = 1;
  msg(`Куплен отчёт экспедиции 1954 года. Теперь на городище можно ездить сколько угодно.`);
  save();
  renderBase();
}
const mk = (id, r) => id + "@" + r;
function buyMap(id) {
  const m = MAPS.find(x => x.id === id),
    r = G.region,
    price = mapPrice(m, r);
  if (G.money < price || !m.need(G)) return;
  G.money -= price;
  G.maps[mk(id, r)] = (G.maps[mk(id, r)] || 0) + 1;
  const wasRumor = G.rumor;
  G.rumor = 0;
  msg(
    `${wasRumor ? "Слух скупщика пригодился — карта на 30% дешевле. " : ""}Куплена карта «${m.name}» (${REGIONS[r].name}). Можно ехать.`
  );
  save();
  renderBase();
}
function buyGo(id) {
  const m = MAPS.find(x => x.id === id),
    r = G.region,
    price = mapPrice(m, r);
  if (!m || G.money < price || !m.need(G)) return;
  G.money -= price;
  const wasRumor = G.rumor;
  G.rumor = 0;
  G.maps[mk(id, r)] = (G.maps[mk(id, r)] || 0) + 1;
  go(id);
  if (wasRumor) setTimeout(() => toast("Слух скупщика пригодился — карта обошлась на 30% дешевле."), 1500);
}
function go(id) {
  const r = G.region;
  let m;
  let reg = r;
  if (id === 4 || id === 5 || id === 9) {
    m = PLACES[id];
    reg = m.reg;
    if (id === 4 && (!G.hfOwn || G.det < 4)) return;
    if ((id === 5 || id === 9) && !m.need(G)) return;
  } else if (id === 0) m = FREE_MAP;
  else {
    m = MAPS.find(x => x.id === id);
    const k = mk(id, r);
    if (!G.maps[k]) return;
    G.maps[k]--;
    if (!G.maps[k]) delete G.maps[k];
  }
  G.inv.forEach(i => delete i._new);
  G.msg = "";
  loadTrip(newTrip(m, reg));
  save();
  showField();
  if (worldKind === "forest" && !G.forestSeen) {
    G.forestSeen = true;
    save();
    toast("Область — лес: окопы и блиндаж, в земле больше военного. У корней деревьев копать дольше.");
  }
  if (worldKind === "plough" && !G.ploughSeen) {
    G.ploughSeen = true;
    save();
    toast("Пригород — пашня у старого хутора. Плуг поднял всё к поверхности: вещи лежат на 10 см мельче.");
  }
  if (worldKind === "manor" && !G.manorSeen) {
    G.manorSeen = true;
    save();
    toast(
      "Архивная карта привела к руинам барской усадьбы: дом с портиком, липовая аллея, фонтан. Внутри руин копать дольше."
    );
  }
  if (worldKind === "hillfort") {
    G.heat++;
    if (!G.hfSeen) {
      G.hfSeen = true;
      save();
      toast(
        "Городище — памятник археологии: копать тут запрещено, полиция +1 за поездку. Под обрывом река вымывает древние вещи. У старого раскопа археологи не всё докопали, а у свежих ям конкуренты уже всё выбрали."
      );
    } else save();
  }
  if (worldKind === "kurgan") kurganStart();
  if (worldKind === "flooded" && !G.fldSeen) {
    G.fldSeen = true;
    save();
    toast(
      "Вода ушла, и показалась старая улица. Ил размыл слои — всё лежит неглубоко и вперемешку. Ищите у церкви, у колодцев (туда бросали монеты) и внутри фундаментов изб."
    );
  }
  if (T && T.zHint) {
    const pr = toastEl.hidden ? "" : toastEl.innerHTML + "<br><br>";
    toast(pr + T.zHint);
  }
  if (worldKind === "swamp" && !G.swampSeen) {
    G.swampSeen = true;
    save();
    toast(
      "Глушь — болото: в воду не зайти, к острову ведёт гать. Вещи лежат глубже, чем в области, — особенно если ехать наугад."
    );
  }
  questStart();
}
let msgShown = "",
  msgTimer = null;
// сообщение «Вернулся домой…» — полоса над вкладками: висит 6 секунд, по нажатию закрывается
function showMsg() {
  const box = $("bMsg");
  if (!G.msg) {
    box.innerHTML = "";
    box.className = "";
    return;
  }
  if (G.msg === msgShown) return;
  msgShown = G.msg;
  const sav = G.msgSav && G.msg.startsWith(G.msgSav);
  box.innerHTML = `<div class="bmsg${G.msgBad ? " bad" : ""}${sav ? " sav" : ""}">${sav ? `<img src="${savPic()}" alt="Савельич">` : ""}<div>${G.msg}</div><button class="bmsg-x" aria-label="Скрыть сообщение">${pxi("x", 12)}</button></div>`;
  box.className = "on";
  box.onclick = () => (box.className = "");
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => (box.className = ""), G.msgBad ? 9000 : 6000);
}
// подсказки к фишкам уровня, совести и полиции: наведение мышью или касание
function gTipFill() {
  // стрелка подсказки — под своей фишкой
  ["bLvlW", "bRepW", "bHeatW"].forEach(id => {
    const b = $(id);
    if (b.offsetWidth) b.querySelector(".gtip").style.setProperty("--ax", b.offsetLeft + b.offsetWidth / 2 - 6 + "px");
  });
  const need = xpNeed(G.lvl),
    nx = TRACK.find(t => t.l > G.lvl);
  $("tipLvl").innerHTML =
    `<b>Уровень ${G.lvl}</b><span>Опыт ${G.xp} из ${need}. Опыт дают найденные вещи: чем ценнее, тем больше.</span>${G.sp ? `<span>Свободных очков навыка: ${G.sp} — вкладка «Навыки».</span>` : ""}${nx ? `<span>На ${nx.l}-м уровне: ${nx.n.toLowerCase()}.</span>` : ""}`;
  const R0 = rank(),
    up = RANKS.slice()
      .reverse()
      .find(r => r.min > G.rep);
  $("tipRep").innerHTML =
    `<b>Совесть ${G.rep > 0 ? "+" : ""}${G.rep} · «${R0.name}»</b><span>${R0.perk[0].toUpperCase() + R0.perk.slice(1)}.</span>${up ? `<span>До «${up.name}» — ${up.min - G.rep} ${plural(up.min - G.rep, "очко", "очка", "очков")}.</span>` : ""}<span class="gt-how">Растёт: дар музею, перезахоронить бойца, вернуть чужое. Падает: чёрный рынок, могилы, чужие тайники.</span>`;
  const raid = Math.round(G.heat * 7 * (1 - sk("svyazi") * 0.08) * (G.rep <= -15 ? 2 : 1));
  $("tipHeat").innerHTML =
    `<b>Интерес полиции ${G.heat}</b><span>${G.heat ? `Облава при продаже на чёрном <span class="nw">рынке — ${Math.min(100, raid)}%.</span>` : "Полиция вами не интересуется: облав на чёрном рынке не будет."}</span><span>${wearIs("hat", "bandana") ? "В бандане с черепом интерес после поездки не спадает." : "После каждой поездки спадает на 1."}</span><span class="gt-how">Растёт: чёрный рынок, ночная смена, раскопки у памятников, свидетели. Падает: дар музею, время.</span>`;
}
function gTip(b) {
  const was = b.classList.contains("open");
  document.querySelectorAll(".gstat.open").forEach(x => x.classList.remove("open"));
  if (!was) b.classList.add("open");
}
document.addEventListener("pointerdown", e => {
  if (!e.target.closest || !e.target.closest(".tipb"))
    document.querySelectorAll(".gstat.open").forEach(x => x.classList.remove("open"));
});
function renderBase() {
  $("bMoney").textContent = rub(G.money);
  $("bRep").textContent = `${G.rep > 0 ? "+" : ""}${G.rep}`;
  $("bHeat").textContent = `${G.heat}`;
  $("bLvl").innerHTML = `${G.lvl}${G.sp ? `<i class="sp">+${G.sp}</i>` : ""}`;
  $("bLvlW").setAttribute("aria-label", `Уровень ${G.lvl}${G.sp ? `, свободных очков: ${G.sp}` : ""}`);
  gTipFill();
  {
    const d = $("bDebt");
    d.hidden = !(G.debt > 0);
    if (G.debt > 0) {
      $("bDebtT").textContent = `Долг ${rub(G.debt)}`;
      d.classList.toggle("bad", (G.debtMiss || 0) > 0);
    }
  }
  document.querySelectorAll("#tabs button").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === tab));
  {
    const sb = $("spBadge");
    sb.hidden = !((G.sp || 0) > 0);
    sb.textContent = G.sp || "";
  }
  {
    const tb = document.querySelector(`#tabs button[data-tab="${tab}"]`);
    if (tb) {
      $("gTitle").textContent = tb.querySelector("span").textContent;
      $("gIco").src = tb.querySelector("img").src;
    }
  }
  ["sell", "gear", "skills", "maps", "ded"].forEach(t => ($("t_" + t).hidden = tab !== t));
  $("t_ded").innerHTML = renderDed();
  showMsg();
  // находки
  const h = renderFinds();
  $("t_sell").innerHTML = h;
  renderFindSheet();
  // снаряжение
  const GEAR = {
    shovel: {
      tbl: SHOVEL,
      label: "Лопата",
      info: x => `копает до ${x.depth} см, за раз ${x.step} см (быстро — ${x.step * 2})`
    },
    det: {
      tbl: DET,
      label: "Детектор",
      info: x =>
        `${x.desc}, слышит до ${x.depth} см, ловит сигнал за ${{ 20: "1 клетку", 24: "1,5 клетки", 26: "1,5 клетки", 28: "почти 2 клетки", 32: "2 клетки" }[x.r]}`
    },
    transport: { tbl: TRANSPORT, label: "Транспорт", info: x => x.desc }
  };
  $("t_gear").innerHTML = renderGear(GEAR);
  // навыки
  $("t_skills").innerHTML = renderSkills();
  // карты
  $("t_maps").innerHTML = renderMaps();
  wearSync();
  if ((G.wearNew || []).length) setTimeout(wearNewShow, 450);
}
let resetArmed = false,
  resetTimer = null;
$("reset").onclick = () => {
  const b = $("reset");
  if (!resetArmed) {
    resetArmed = true;
    b.textContent = "Точно? Нажмите ещё раз";
    b.classList.add("danger");
    resetTimer = setTimeout(() => {
      resetArmed = false;
      b.textContent = "Начать заново";
      b.classList.remove("danger");
    }, 4000);
    return;
  }
  clearTimeout(resetTimer);
  resetArmed = false;
  b.textContent = "Начать заново";
  b.classList.remove("danger");
  G = fresh();
  T = null;
  tab = "maps";
  $("setOver").hidden = true;
  save();
  showBase();
};
setTimeout(() => {
  const b = $("sfxBtn");
  if (b) b.textContent = sfxOn ? "Звуки: вкл." : "Звуки: выкл.";
}, 0);
window.setSfx = setSfx;
Object.defineProperty(window, "sfxOn", { get: () => sfxOn });
window.$ = $;
window.SK = {
  albPick: (e, k) => albWin(Object.assign({ era: e }, ALB[e][k])),
  openAlb,
  openLegs,
  albRow: e => {
    albRow = e;
    openAlb();
  },
  albOnly: v => {
    albOnly = v;
    openAlb();
  },
  openMag,
  openFlea,
  fleaClose: closeFlea,
  fleaBack: () => {
    fleaOpen = null;
    renderFlea();
  },
  buyLot,
  goLead,
  goHouse,
  goSlet,
  wearPick,
  gTip,
  wdTap,
  wearSet,
  wearNewOk,
  sletInfo,
  hsSelect,
  hsSearch,
  hsListen,
  hsLeave,
  magClose: closeMag,
  magAgain,
  sellOrder,
  albClose: () => ($("albOver").hidden = true),
  scrubDone,
  scrubCancel,
  buyGo,
  setPlace,
  placeLocked,
  buyPlace,
  sellLeg,
  toArch,
  toDed,
  openPz,
  pzClose: closePz,
  pzUnpair,
  pzCheck,
  findFilter: k => {
    findFilter = k;
    renderBase();
  },
  openFind: i => {
    openFind = G.inv[i] || null;
    renderFindSheet();
  },
  closeFind: () => {
    openFind = null;
    renderFindSheet();
  },
  gearTab: k => {
    gearTab = k;
    renderBase();
  },
  skTab: k => {
    skTab = k;
    renderBase();
  },
  gearPick: (k, n) => {
    gearSel[k] = n;
    renderBase();
    const u = document.querySelector(".upg");
    if (u) u.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  sell,
  sellAllBuy,
  payDebt,
  debtHelp,
  buyShop,
  toVit,
  fromVit,
  sellJunk,
  sellOneJunk,
  sellDirty,
  clean,
  cleanAll,
  buy,
  learn,
  setRegion,
  buyMap,
  go,
  signRaid,
  comicNext: () => comicQ && comicQ.next(),
  comicEnd: () => comicQ && comicQ.end(),
  comic: id => showComic(id),
  storyAct: i => storyAct(i),
  choose: k => {
    const o = choiceQ && choiceQ[k];
    if (!o || o.off) return;
    choiceQ = null;
    $("comic").hidden = true;
    $("comic").innerHTML = "";
    o.run();
  },
  keepStory: i => {
    const it = G.inv[i];
    if (!it) return;
    if (!G.story.clues.includes(it.story)) G.story.clues.push(it.story);
    G.inv.splice(i, 1);
    openFind = null;
    tab = "ded";
    save();
    renderBase();
  },
  toTransport: () => {
    tab = "gear";
    gearTab = "transport";
    renderBase();
    window.scrollTo(0, 0);
    const p = document.getElementById("base");
    if (p) p.scrollTop = 0;
  }
};

// свайп вниз закрывает лист находки
(() => {
  const box = $("fsheet");
  let y0 = null,
    dy = 0,
    el = null,
    fromTop = false;
  box.addEventListener(
    "touchstart",
    e => {
      el = e.target.closest(".fs");
      if (!el) {
        y0 = null;
        return;
      }
      fromTop = el.scrollTop <= 0 || !!e.target.closest(".fs-grip");
      y0 = e.touches[0].clientY;
      dy = 0;
      el.classList.remove("snap");
    },
    { passive: true }
  );
  box.addEventListener(
    "touchmove",
    e => {
      if (y0 === null || !el) return;
      const d = e.touches[0].clientY - y0;
      if (d > 0 && fromTop && el.scrollTop <= 0) {
        dy = d;
        el.classList.add("drag");
        el.style.transform = `translateY(${d}px)`;
        e.preventDefault();
      } else if (dy === 0) y0 = null;
    },
    { passive: false }
  );
  box.addEventListener("touchend", () => {
    if (!el) return;
    el.classList.remove("drag");
    if (dy > 90) {
      el.classList.add("snap");
      el.style.transform = "translateY(100%)";
      setTimeout(() => {
        window.SK.closeFind();
      }, 200);
    } else if (dy > 0) {
      el.classList.add("snap");
      el.style.transform = "";
    }
    y0 = null;
    dy = 0;
  });
  box.addEventListener(
    "touchmove",
    e => {
      if (e.target.classList && e.target.classList.contains("fs-back")) e.preventDefault();
    },
    { passive: false }
  );
})();
