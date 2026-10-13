// ================= ДОМ ПОД СНОС (11-й уровень) =================
// Расселённый дом: детектор почти бесполезен (гвозди везде), ищут руками — чердак, печь, красный угол, стены, подпол, порог.
// До приезда экскаватора не успеть всё: надо выбирать, где копать глубже.
const HOUSE_IMG = new Image();
HOUSE_IMG.src = "@art(house/house.png)";
const HOUSE_UNIQ = [
  [2, 0, "Жестянка с заначкой", 1, 0.3],
  [4, 2, "Икона-складень", 1, 0.4],
  [1, 0, "Газета 1937 года", 0, 0.05],
  [2, 2, "Пачка керенок", 0, 0.05],
  [3, 1, "Портсигар «За оборону»", 1, 0.15],
  [1, 0, "Ёлочная игрушка «Космонавт»", 0, 0.03]
];
Object.assign(FIND_IMG, {
  "Жестянка с заначкой": "@art(find-img/zhestyanka-s-zanachkoj.png)",
  "Икона-складень": "@art(find-img/ikona-skladen.png)",
  "Газета 1937 года": "@art(find-img/gazeta-1937-goda.png)",
  "Пачка керенок": "@art(find-img/pachka-kerenok.png)",
  "Портсигар «За оборону»": "@art(find-img/portsigar-za-oboronu.png)",
  "Ёлочная игрушка «Космонавт»": "@art(find-img/yolochnaya-igrushka-kosmonavt.png)"
});
Object.assign(FIND_DESC, {
  "Жестянка с заначкой":
    "Банка из-под монпансье, набитая монетами шестидесятых. Хозяин копил на «Москвич» и спрятал от жены в подполе.",
  "Икона-складень": "Медный трёхстворчатый складень — такие брали в дорогу. Стоял в красном углу за большой иконой.",
  "Газета 1937 года":
    "«Правда» за июль 1937-го, вклеенная под обои. Половина фамилий на первой полосе замазана чернилами.",
  "Пачка керенок":
    "Деньги Временного правительства. В 1918-м ими топили печь — а эту пачку зачем-то спрятали в печурку.",
  "Портсигар «За оборону»":
    "Серебряный портсигар с красной звездой и гравировкой «За оборону Москвы. 1941». Чей-то трофей памяти.",
  "Ёлочная игрушка «Космонавт»":
    "Стеклянный космонавт 1961 года. Висел на ёлке в год Гагарина, потом сорок лет пролежал на чердаке."
});
ALB.push(HOUSE_UNIQ.map(q => ({ c: q[0], era: q[1], name: q[2], house: 1 })));
ALB_ROW.push("Из старого дома");
// места в доме: прямоугольник на картинке 240×176 и слои — куда можно залезть глубже
const HS_SPOTS = [
  {
    id: "attic",
    n: "Чердак",
    d: "Шлак, старые газеты, сундук. Сюда тащили всё, что жалко выбросить.",
    r: [26, 36, 186, 52],
    L: ["сверху, в хламе", "в сундуке", "под шлаком"],
    t: 30,
    cls: [0.25, 0.5, 0.15, 0.1, 0],
    era: [0.6, 0.3, 0.1, 0, 0],
    uq: ["Ёлочная игрушка «Космонавт»", "Газета 1937 года"]
  },
  {
    id: "stove",
    n: "Печь",
    d: "Русская печь 1912 года. В печурках и под шестком прятали деньги: огонь чужого не пустит.",
    r: [34, 98, 50, 52],
    L: ["в печурках", "под шестком"],
    t: 40,
    cls: [0.05, 0.2, 0.6, 0.1, 0.05],
    era: [0.2, 0.3, 0.5, 0, 0],
    uq: ["Пачка керенок"]
  },
  {
    id: "corner",
    n: "Красный угол",
    d: "Божница над столом. За иконой хранили самое дорогое.",
    r: [170, 84, 34, 28],
    L: ["за божницей"],
    t: 15,
    cls: [0, 0.3, 0.3, 0.1, 0.3],
    era: [0.1, 0.2, 0.7, 0, 0],
    uq: ["Икона-складень"]
  },
  {
    id: "wall",
    n: "Стены",
    d: "Под обоями — газеты, под газетами — пакля. В щели между брёвен засовывали всякое.",
    r: [88, 92, 36, 40],
    L: ["под обоями", "в пазах между брёвен"],
    t: 30,
    cls: [0.2, 0.5, 0.25, 0.05, 0],
    era: [0.5, 0.3, 0.2, 0, 0],
    uq: ["Газета 1937 года"]
  },
  {
    id: "cellar",
    n: "Подпол",
    d: "Банки с огурцами и земляной пол. Тут закапывали то, что надо спрятать надёжно.",
    r: [66, 150, 98, 26],
    L: ["на полках", "под ящиком", "в земляном полу"],
    t: 40,
    cls: [0.15, 0.3, 0.3, 0.2, 0.05],
    era: [0.3, 0.45, 0.25, 0, 0],
    uq: ["Жестянка с заначкой", "Портсигар «За оборону»"]
  },
  {
    id: "porch",
    n: "Порог",
    d: "По обычаю под порог клали монету — на счастье и достаток.",
    r: [200, 128, 40, 24],
    L: ["под порогом"],
    t: 20,
    cls: [0, 0, 1, 0, 0],
    era: [0.3, 0.3, 0.4, 0, 0]
  }
];
const HS_DEADLINE = 300, // экскаватор приезжает в 13:00
  HS_LISTEN = 10,
  HS_MULT = 4; // дома под снос — редкость, вещи в них ценятся как в глуши
const HS_STREETS = [
  "ул. Садовая, 14",
  "Заречная, 3",
  "пер. Кузнечный, 7",
  "ул. Луговая, 22",
  "Овражная, 9",
  "ул. Колхозная, 5"
];
const HS_OWNER = [
  "Хозяйка отдала ключ: «Всё равно снесут, берите что найдёте».",
  "Внук бывшего хозяина махнул рукой: «Бабкино барахло, мне не надо».",
  "Прораб пустил до обеда: «В час приедет техника — чтоб духу не было»."
];
function hsItem(q, uniqRow) {
  const it = uniqRow
    ? { c: q[0], era: q[1], name: q[2], iron: q[3], w: q[4] }
    : (() => {
        const f = fleaItem(q.c, q.era);
        return { c: f.c, era: f.era, name: f.name, iron: f.iron, w: f.w };
      })();
  it.base = econBase(it.c, it.era, HS_MULT);
  it.metal = uniqRow ? !!q[3] || q[2] === "Икона-складень" || q[2] === "Портсигар «За оборону»" : true;
  return it;
}
function newHouseState() {
  const sp = {};
  HS_SPOTS.forEach(s => {
    sp[s.id] = {
      done: 0,
      layers: s.L.map(() => {
        if (Math.random() > (s.id === "porch" ? 0.75 : 0.7)) return null;
        return hsItem({ c: pickW(s.cls), era: s.era });
      })
    };
  });
  // особые находки дома: одна-две, в своих местах и поглубже
  const pool = HOUSE_UNIQ.slice(),
    n = Math.random() < 0.3 ? 2 : 1;
  for (let k = 0; k < n && pool.length; k++) {
    const q = pool.splice(Math.floor(Math.random() * pool.length), 1)[0],
      spots = HS_SPOTS.filter(s => s.uq && s.uq.includes(q[2])),
      s = pick(spots),
      li = s.L.length - 1 - (Math.random() < 0.4 && s.L.length > 1 ? 1 : 0);
    sp[s.id].layers[li] = hsItem(q, true);
  }
  return {
    sp,
    sel: null,
    heard: null,
    last: null,
    street: (G.house && G.house.street) || pick(HS_STREETS),
    owner: pick(HS_OWNER),
    got: []
  };
}
// объявление о доме: появляется изредка, ждёт несколько поездок
function houseTick() {
  if (!perk("house")) return "";
  if (G.house) {
    G.house.left--;
    if (G.house.left <= 0) {
      const s = G.house.street;
      G.house = null;
      return `<br>Дом на ${s} снесли — не успели.`;
    }
    return "";
  }
  if (G.houseFirst && Math.random() > 0.35) return "";
  G.houseFirst = 1;
  G.house = { street: pick(HS_STREETS), left: 3 };
  return `<br><b>Объявление:</b> расселённый дом, ${G.house.street}, идёт под снос. Можно успеть обыскать — смотрите «Карты».`;
}
function houseNb() {
  if (!perk("house")) return "";
  if (!G.house && !G.houseFirst) {
    G.houseFirst = 1;
    G.house = { street: pick(HS_STREETS), left: 3 };
  }
  if (!G.house) return "";
  const h = G.house;
  return `<div class="nbc house"><div class="nbc-pic hs-pic"><img src="${HOUSE_IMG.src}" alt=""></div><div class="nbc-b"><span class="nbc-hand">под снос</span><h3>Старый дом</h3><p>${h.street}. Жильцов расселили, в пятницу приедет экскаватор. Детектор тут почти бесполезен — гвозди везде. Ищете руками.</p><ul><li>${NBI.box}<span>Чердак, печь, красный угол, стены, подпол, порог</span></li><li>${NBI.acc}<span>Время до 13:00 — всё не успеть</span></li><li>${NBI.road}<span>В пригороде · снесут через ${h.left} ${plural(h.left, "поездку", "поездки", "поездок")}</span></li></ul><button class="nb-btn" onclick="SK.goHouse()">Ехать в дом</button></div></div>`;
}
function goHouse() {
  if (!G.house) return;
  G.inv.forEach(i => delete i._new);
  G.msg = "";
  T = { id: G.trips + 1, found: 0, map: 7, region: 1, minutes: 0, hs: newHouseState() };
  G.house = null;
  save();
  openHouse();
}
let hsAnim = null;
function openHouse() {
  if (!T || !T.hs) return;
  $("houseOver").hidden = false;
  renderHouse();
  if (!openHouse.run) {
    openHouse.run = 1;
    requestAnimationFrame(hsLoop);
  }
}
const hsClock = m => hhmmAbs(480 + m);
function hsSpot(id) {
  return HS_SPOTS.find(s => s.id === id);
}
function renderHouse() {
  const H = T.hs,
    s = $("houseSheet");
  s.innerHTML = `<div class="hs-top"><h2>Дом под снос</h2><span class="hs-clock"><span id="hsClk">${hsClock(T.minutes)}</span><small>снос в ${hsClock(HS_DEADLINE)}</small></span></div><p class="hs-sub">${H.street}. ${H.owner}</p><canvas id="hsCv" width="240" height="176"></canvas><div id="hsUi"></div>`;
  $("hsCv").addEventListener("pointerdown", e => {
    const c = e.currentTarget.getBoundingClientRect(),
      x = ((e.clientX - c.left) / c.width) * 240,
      y = ((e.clientY - c.top) / c.height) * 176;
    const s2 = HS_SPOTS.find(q => x >= q.r[0] && x <= q.r[0] + q.r[2] && y >= q.r[1] && y <= q.r[1] + q.r[3]);
    if (s2) hsSelect(s2.id);
  });
  hsUi();
}
function hsSelect(id) {
  if (hsAnim) return;
  T.hs.sel = id;
  T.hs.last = null;
  SFX.click && SFX.click();
  hsUi();
}
function hsLeft(id) {
  const st = T.hs.sp[id];
  return hsSpot(id).L.length - st.done;
}
function hsUi() {
  const u = $("hsUi"),
    H = T.hs;
  if (!u) return;
  const ck = $("hsClk");
  if (ck) ck.textContent = hsClock(T.minutes);
  const over = T.minutes >= HS_DEADLINE;
  const chips = `<div class="hs-chips">${HS_SPOTS.map(s => {
    const left = hsLeft(s.id);
    return `<button class="${H.sel === s.id ? "on" : ""}${left ? "" : " done"}" onclick="SK.hsSelect('${s.id}')">${s.n}${H.heard && H.heard[s.id] && left ? " 〰" : ""}${left ? "" : " ✓"}</button>`;
  }).join("")}</div>`;
  const got = H.got.length
    ? `<div class="hs-got"><b>Нашли (${H.got.length}):</b> ${H.got.map(it => `<img src="${FIND_IMG[it.name] || ""}" alt="${it.name}" title="${it.name}">`).join("")}</div>`
    : "";
  if (over) {
    u.innerHTML = `<div class="hs-box"><p><b>Подъехал экскаватор.</b> Прораб машет: «Всё, выходим!» Дальше искать нельзя.</p></div>${got}<button class="btn" onclick="SK.hsLeave()">Домой</button>`;
    return;
  }
  let box;
  if (!H.sel)
    box = `<div class="hs-box"><p>Нажмите на место в доме — чердак, печь, красный угол, стены, подпол или порог. Каждый осмотр — время, а в ${hsClock(HS_DEADLINE)} приедет экскаватор.</p></div>`;
  else {
    const s = hsSpot(H.sel),
      st = H.sp[s.id],
      left = hsLeft(s.id),
      heard = H.heard && H.heard[s.id];
    const last = H.last
      ? H.last.it
        ? `<div class="hs-find"><img src="${FIND_IMG[H.last.it.name] || ""}" alt=""><div><b>${H.last.it.name}</b><small class="k${H.last.it.c}">${CLASSES[H.last.it.c].name}${H.last.it.c ? " · почистите дома" : " · только в металлолом"}</small></div></div>`
        : `<p class="hs-empty">${pick(["Пусто: пыль, паутина и мышиный помёт.", "Ничего. Только труха и старые гвозди.", "Пусто — кто-то побывал тут раньше."])}</p>`
      : "";
    const fits = T.minutes + s.t <= HS_DEADLINE + 15;
    box = `<div class="hs-box"><h3>${s.n}${st.done ? ` <small>осмотрено ${st.done} из ${s.L.length}</small>` : ""}</h3><p>${s.d}</p>${heard !== undefined && heard !== null && left ? `<p class="hs-det">Детектор: ${heard ? "звенит — но в старом доме везде гвозди" : "тихо"}.</p>` : ""}${last}${left ? `<button class="btn" ${fits ? "" : "disabled"} onclick="SK.hsSearch()">Искать ${s.L[st.done]} · ${s.t} мин</button>${fits ? "" : `<p class="hs-det">Не успеть до экскаватора.</p>`}` : `<p class="hs-det">Тут всё осмотрено.</p>`}</div>`;
  }
  u.innerHTML = `${chips}${box}${got}<div class="row hs-row"><button class="btn ghost" ${H.heard || T.minutes + HS_LISTEN > HS_DEADLINE ? "disabled" : ""} onclick="SK.hsListen()">Прослушать детектором · ${HS_LISTEN} мин</button><button class="btn ghost" onclick="SK.hsLeave()">Уехать домой</button></div>`;
}
function hsListen() {
  const H = T.hs;
  if (H.heard || hsAnim) return;
  T.minutes += HS_LISTEN;
  H.heard = {};
  HS_SPOTS.forEach(s => {
    const st = H.sp[s.id],
      metal = st.layers.slice(st.done).some(it => it && it.metal);
    H.heard[s.id] = metal ? Math.random() < 0.8 : Math.random() < 0.35;
  });
  SFX.click && SFX.click();
  save();
  hsUi();
}
function hsSearch() {
  const H = T.hs,
    s = hsSpot(H.sel);
  if (!s || hsAnim || !hsLeft(s.id) || T.minutes + s.t > HS_DEADLINE + 15) return;
  const st = H.sp[s.id];
  T.minutes += s.t;
  hsAnim = { s, t: 0, parts: [] };
  SFX.dig(false);
  setTimeout(() => {
    const q = st.layers[st.done];
    st.done++;
    hsAnim = null;
    if (q) {
      const it = {
        tid: T.id,
        name: q.name,
        c: q.c,
        iron: q.iron,
        era: q.era,
        w: q.w,
        base: q.base,
        cond: Math.round(rnd(0.6, 1) * 100) / 100,
        depth: 0,
        clean: false,
        house: 1
      };
      if (it.c === 0) {
        it.clean = true;
        it.gr = 2;
      } else dexAdd(it.name);
      G.inv.push(it);
      T.found++;
      H.got.push(it);
      H.last = { it };
      if (gainXp(CLASSES[it.c].xp)) H.up = 1;
      SFX.clink();
    } else {
      H.last = { it: null };
      SFX.thud();
    }
    if (H.heard) delete H.heard[s.id];
    save();
    hsUi();
  }, 700);
  hsUi();
}
function hsLeave() {
  if (hsAnim) return;
  const H = T.hs,
    n = H.got.length,
    up = H.up;
  $("houseOver").hidden = true;
  endTrip(
    `${T.minutes >= HS_DEADLINE ? "Экскаватор снёс дом, вы уехали с тем, что успели." : "Вы уехали из старого дома."} Из дома вынесли вещей: ${n}.${up ? ` <b>Новый уровень ${G.lvl}!</b> Очко навыка ждёт.` : ""}`
  );
}
function hsLoop() {
  if ($("houseOver").hidden || !T || !T.hs) {
    openHouse.run = 0;
    return;
  }
  requestAnimationFrame(hsLoop);
  const cv = $("hsCv");
  if (!cv) return;
  const g = cv.getContext("2d"),
    H = T.hs,
    t = performance.now() / 1000;
  g.imageSmoothingEnabled = false;
  if (HOUSE_IMG.complete && HOUSE_IMG.naturalWidth) g.drawImage(HOUSE_IMG, 0, 0);
  // осмотренные места темнеют, следы поиска
  HS_SPOTS.forEach(s => {
    const st = H.sp[s.id],
      [x, y, w, h] = s.r;
    if (st.done) {
      g.fillStyle = hsLeft(s.id) ? "rgba(40,30,20,.18)" : "rgba(30,22,14,.42)";
      g.fillRect(x, y, w, h);
    }
    if (H.heard && H.heard[s.id] && hsLeft(s.id)) {
      const a = 0.5 + 0.5 * Math.sin(t * 4 + x);
      g.fillStyle = `rgba(246,220,106,${a.toFixed(2)})`;
      const cx = x + w - 8,
        cy = y + 6;
      for (let k = 0; k < 3; k++) g.fillRect(cx + k * 2, cy + (k % 2 ? 1 : 0) - k * 2, 1, 2 + k * 2);
    }
  });
  if (H.sel) {
    const s = hsSpot(H.sel),
      [x, y, w, h] = s.r;
    g.strokeStyle = `rgba(246,220,106,${(0.6 + 0.4 * Math.sin(t * 5)).toFixed(2)})`;
    g.lineWidth = 1;
    g.setLineDash([3, 2]);
    g.lineDashOffset = -t * 8;
    g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    g.setLineDash([]);
  }
  if (hsAnim) {
    const [x, y, w, h] = hsAnim.s.r;
    if (hsAnim.parts.length < 40)
      hsAnim.parts.push({
        x: x + Math.random() * w,
        y: y + h * (0.4 + Math.random() * 0.6),
        vy: -10 - Math.random() * 20,
        a: 1
      });
    hsAnim.parts.forEach(p => {
      p.y += p.vy / 60;
      p.a -= 0.02;
      g.fillStyle = `rgba(200,180,140,${Math.max(0, p.a).toFixed(2)})`;
      g.fillRect(p.x, p.y, 2, 2);
    });
  }
  // часы на картинке
  const k = Math.min(1, T.minutes / HS_DEADLINE);
  g.fillStyle = "rgba(20,16,10,.65)";
  g.fillRect(4, 4, 72, 8);
  g.fillStyle = k > 0.8 ? "#d84a32" : k > 0.55 ? "#e2ae44" : "#7f9c40";
  g.fillRect(5, 5, 70 * (1 - k), 6);
}
