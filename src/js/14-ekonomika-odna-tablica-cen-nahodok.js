// ===== ЭКОНОМИКА: одна таблица цен находок =====
// базовая цена = коридор класса × слой × регион, но не выше потолка. Дальше её умножают сохранность (×0,3…×2,5, ★ ×2–5) и покупатель (скупщик ×0,5, антиквар ×1, чёрный рынок ×2).
const ECON = {
  cls: [
    [0, 50],
    [80, 350],
    [200, 1800],
    [500, 6000],
    [3000, 20000]
  ], // мусор, бытовое, монета, военное, редкое — в Пригороде, советский слой
  era: [1, 1.25, 1.5, 1.8, 2.1], // слой: советский, войны, империи, старины, древности
  reg: { 1: 1, 2: 1.35, 4: 2.3 }, // Пригород, Область, Глушь
  cap: 25000, // потолок обычной находки (легенды — отдельно, 200–500 тыс.)
  pricey: 0.65
}; // шанс, что вещь дороже 10 тыс. заменится классом попроще
function econBase(c, era, mult) {
  const r = ECON.cls[c] || ECON.cls[1];
  return Math.min(
    ECON.cap,
    Math.round((rnd(r[0], r[1]) * ECON.era[era || 0] * (ECON.reg[mult] || mult)) / 10) * 10
  );
}
function makeItem(c, eraW, mult, forceEra, noBoost) {
  let e = forceEra !== undefined ? forceEra : pickW(regW(eraW, "era")),
    pool = CAT.filter(q => q[0] === c && q[1] === e);
  while (!pool.length && e > 0) {
    e--;
    pool = CAT.filter(q => q[0] === c && q[1] === e);
  }
  if (!pool.length) pool = CAT.filter(q => q[0] === c);
  const q = pick(pool),
    E = ERAS[q[1]];
  let base = econBase(c, q[1], mult);
  if (base > 10000 && c > 1 && R() < ECON.pricey) return makeItem(c - 1, eraW, mult, forceEra); // дорогие вещи (>10 тыс.) — реже
  if (!noBoost && base <= 3000 && c >= 1 && R() < EXP_BOOST) {
    const re = makeItem(Math.min(4, c + 1), eraW, mult, forceEra, true);
    if (re.base > 3000) return re;
  }
  if (!noBoost && curReg === 1 && base < 3000 && c >= 1 && R() < SUB_MID) {
    for (let k = 0; k < 12; k++) {
      const re = makeItem(R() < 0.85 ? 3 : 4, eraW, mult, forceEra, true);
      if (re.base >= 3000 && re.base <= 5000) return re;
    }
  } // пригород: чаще вещи за 3–5 тыс.
  return {
    c,
    era: q[1],
    name: q[2],
    iron: q[3],
    w: q[4],
    depth: Math.round(E.d[0] + R() * (E.d[1] - E.d[0])),
    base,
    found: false
  };
}
const ZLM = { plough: "хутора", forest: "поляны", swamp: "острова", manor: "усадьбы" };
const ZDIR = [
  "к востоку",
  "к юго-востоку",
  "к югу",
  "к юго-западу",
  "к западу",
  "к северо-западу",
  "к северу",
  "к северо-востоку"
];
function zoneSpot(zr) {
  // точки вокруг приметы, где хватает земли под копку
  const c = [{ x: ZONE.x, y: ZONE.y, dir: -1 }];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    [1.05, 1.4].forEach(k =>
      c.push({ x: ZONE.x + Math.cos(a) * ZONE.r * k, y: ZONE.y + Math.sin(a) * ZONE.r * k * 0.85, dir: i })
    );
  }
  const ok = c.filter(p => {
    if (p.x < zr * 0.55 || p.x > WW - zr * 0.55 || p.y < 90 + zr * 0.3 || p.y > WH - zr * 0.55) return false;
    let n = 0,
      g = 0;
    for (let a = 0; a < 48; a++) {
      const an = a * 2.4,
        rr = Math.sqrt((a + 0.5) / 48) * zr * 0.9,
        tx = Math.floor((p.x + Math.cos(an) * rr) / TS),
        ty = Math.floor((p.y + Math.sin(an) * rr) / TS);
      n++;
      if (diggable(tx, ty)) g++;
    }
    return g / n >= 0.6;
  });
  if (!ok.length) return c[0];
  const last = G.lastZ && G.lastZ[worldKind];
  const fresh = ok.filter(p => p.dir !== last);
  return pick(fresh.length ? fresh : ok);
}
function newTrip(map, region) {
  ensureWorld(LOC(region, map.id));
  const forest = worldKind === "forest";
  const karto = sk("karto"),
    mult = REGIONS[region].mult;
  curReg = region;
  const t = {
    id: G.trips + 1,
    map: map.id,
    mapName: map.name + " · " + REGIONS[region].name,
    region,
    items: [],
    holes: {},
    minutes:
      REG_INFO[region].start +
      (season().id === "spring" && region === 3 ? 30 : 0) +
      (G.wx === "frost" ? 30 : 0),
    wx: G.wx || "clear",
    season: season().id,
    digBonus: G.wx === "rain" ? 5 : 0,
    fog: G.wx === "fog" ? 1 : 0,
    event: null,
    found: 0,
    shown: null,
    real: null
  };
  ZC = { x: ZONE.x, y: ZONE.y };
  if (!map.free && ZLM[worldKind]) {
    const p = zoneSpot(map.zoneR * TS);
    ZC = { x: Math.round(p.x), y: Math.round(p.y) };
    G.lastZ = G.lastZ || {};
    G.lastZ[worldKind] = p.dir;
    const lm = ZLM[worldKind],
      where = p.dir < 0 ? `прямо на месте ${lm}` : `${ZDIR[p.dir]} от ${lm}`;
    t.zHint =
      map.id === 1
        ? `Местные говорят: искать ${where}. Жёлтая стрелка у края экрана покажет, куда идти.`
        : map.id === 2
          ? `На схеме крестик — ${where}. Стрелка у края экрана покажет направление.`
          : `На штабной карте отмечено: ${where}. Стрелка у края экрана покажет направление.`;
  }
  t.zc = ZC;
  if (!map.free) {
    t.real = { x: ZC.x, y: ZC.y, r: map.zoneR * TS };
    const ang = R() * Math.PI * 2,
      off = map.offset * TS * (1 - karto * 0.08);
    t.shown = {
      x: ZC.x + Math.cos(ang) * off,
      y: ZC.y + Math.sin(ang) * off,
      r: Math.max(t.real.r + 6, (map.shownR - karto * 0.25) * TS)
    };
  }
  const used = new Set();
  function put(tx, ty, it) {
    used.add(tx + "," + ty);
    t.items.push(Object.assign({ tx, ty, x: tx * TS + 4 + R() * 8, y: ty * TS + 4 + R() * 8 }, it));
  }
  function place(inZone) {
    for (let a = 0; a < 200; a++) {
      let x, y;
      if (inZone) {
        const an = R() * Math.PI * 2,
          rr = Math.sqrt(R()) * t.real.r * 0.92;
        x = t.real.x + Math.cos(an) * rr;
        y = t.real.y + Math.sin(an) * rr;
      } else {
        x = 24 + R() * (WW - 48);
        y = 96 + R() * (WH - 120);
        if (t.real && Math.hypot(x - t.real.x, y - t.real.y) < t.real.r + 8) continue;
      }
      const tx = Math.floor(x / TS),
        ty = Math.floor(y / TS);
      if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
      let c = pickW(regW(inZone || map.free ? map.probs : OUT_P, "cls"));
      if (inZone && region === 3 && (map.id === 1 || map.id === 2) && c <= 1 && R() < 0.35) c = 2;
      if (inZone && region === 3 && map.id === 2 && c === 2 && R() < 0.3) c = 3; // глушь: меньше мусора, больше монет и военного
      put(
        tx,
        ty,
        makeItem(
          c,
          inZone
            ? map.eraW
            : map.free
              ? forest
                ? [0.3, 0.6, 0.1, 0]
                : map.eraW
              : forest
                ? [0.35, 0.6, 0.05, 0]
                : OUT_E,
          mult
        )
      );
      return;
    }
  }
  if (map.free) {
    for (let i = 0; i < map.n; i++) place(false);
  } else {
    const nZ = Math.round(map.n * (region === 3 && (map.id === 1 || map.id === 2) ? 1.4 : 1)); // глушь: на «Слухе» и «Схеме» вещей больше
    for (let i = 0; i < nZ; i++) place(true);
    for (let i = 0; i < 10; i++) place(false);
  }
  if (
    map.cache &&
    R() <
      Math.min(
        1,
        map.cache.chance * (region === 3 ? 1.5 : 1) * (region === 3 && season().id === "winter" ? 1.5 : 1)
      )
  ) {
    const cx = Math.floor(ZC.x / TS),
      cy = Math.floor(ZC.y / TS);
    outer: for (let r = 0; r < 4; r++)
      for (let dx = -r; dx <= r; dx++)
        for (let dy = -r; dy <= r; dy++) {
          const tx = cx + dx,
            ty = cy + dy;
          if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
          const it = makeItem(map.cache.c, null, mult, pick([1, 2, 3]));
          it.base = Math.round((it.base * 1.5) / 10) * 10;
          it.cache = true;
          put(tx, ty, it);
          break outer;
        }
  }
  // слоистые ямы: под частью находок лежит вещь другой эпохи — глубже или мельче
  {
    const base = t.items.filter(i => !i.cache),
      nStack = Math.round(base.length * 0.22);
    for (let k = 0; k < nStack && base.length; k++) {
      const b = base.splice(Math.floor(R() * base.length), 1)[0],
        inZ = t.real && Math.hypot(b.x - t.real.x, b.y - t.real.y) < t.real.r;
      const eraW = inZ
        ? map.eraW
        : map.free
          ? forest
            ? [0.3, 0.6, 0.1, 0]
            : map.eraW
          : forest
            ? [0.35, 0.6, 0.05, 0]
            : OUT_E;
      let e = b.era;
      for (let a = 0; a < 12 && e === b.era; a++) e = pickW(eraW);
      if (e === b.era) e = b.era < 4 ? b.era + 1 : b.era - 1;
      const it = makeItem(pickW(inZ || map.free ? map.probs : OUT_P), null, mult, e);
      if (e > b.era && it.depth < b.depth + 12)
        it.depth = Math.min(e === 4 ? 155 : 125, b.depth + 12 + Math.floor(R() * 10));
      if (e < b.era && it.depth > b.depth - 12) it.depth = Math.max(3, b.depth - 12 - Math.floor(R() * 6));
      if (Math.abs(it.depth - b.depth) < 10) continue;
      t.items.push(
        Object.assign(
          { tx: b.tx, ty: b.ty, x: b.x + (R() - 0.5) * 4, y: b.y + (R() - 0.5) * 4, stack: true },
          it
        )
      );
    }
  }
  const st = { tx: Math.floor((roadX(580) + 20) / TS), ty: 36 };
  while (blocked(st.tx, st.ty)) st.tx++;
  const f = tileFeet(st);
  t.px = f.x;
  t.py = f.y;
  t.dir = "up";
  if (worldKind === "swamp") {
    const dd = map.id === 1 || map.id === 2 ? 5 : 15;
    t.items.forEach(i => {
      i.depth = Math.min(160, i.depth + dd);
    });
  }
  if (worldKind === "plough")
    t.items.forEach(i => {
      i.depth = Math.max(5, i.depth - 10);
    });
  if (season().id === "spring" && region === 1)
    t.items.forEach(i => {
      if (!i.story) i.depth = Math.max(4, i.depth - 10);
    });
  if (worldKind === "flooded")
    t.items.forEach(i => {
      if (!i.story && !i.leg) i.depth = Math.max(3, Math.round(i.depth * 0.55));
    });
  if (worldKind === "hillfort") {
    const nB = t.wx === "rain" || season().id === "spring" ? 7 : 4;
    let k = 0; // река подмывает обрыв
    for (let a = 0; a < 600 && k < nB; a++) {
      const x = 24 + R() * (WW - 48),
        y = 70 + R() * (WH - 140);
      if (!hfBank(x, y)) continue;
      const tx = Math.floor(x / TS),
        ty = Math.floor(y / TS);
      if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
      used.add(tx + "," + ty);
      const it = makeItem(pickW(map.probs), null, mult, 4);
      it.depth = 8 + Math.floor(R() * 12);
      it.bank = 1;
      t.items.push(Object.assign({ tx, ty, x: tx * TS + 4 + R() * 8, y: ty * TS + 4 + R() * 8 }, it));
      k++;
    }
  }
  // «говорящие» места: у ориентиров находки гуще, у чужих ям — пусто
  {
    const near = (cx, cy, rad, cls, era, dep) => {
      for (let a = 0; a < 120; a++) {
        const an = R() * 6.28,
          rr = R() * rad,
          tx = Math.floor((cx + Math.cos(an) * rr) / TS),
          ty = Math.floor((cy + Math.sin(an) * rr) / TS);
        if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
        used.add(tx + "," + ty);
        const it = makeItem(cls, null, mult, era);
        if (dep) it.depth = dep;
        t.items.push(
          Object.assign({ tx, ty, x: tx * TS + 4 + R() * 8, y: ty * TS + 4 + R() * 8, spot: 1 }, it)
        );
        return;
      }
    };
    if (worldKind === "hillfort") {
      t.items = t.items.filter(
        i => !HF_PITS.some(([x, y]) => Math.hypot(i.x - x, i.y - y) < 30) || i.leg || i.story
      ); // конкуренты уже всё выбрали
      for (let k = 0; k < 3; k++)
        near(
          HF_RK.x + HF_RK.w / 2,
          HF_RK.y + HF_RK.h / 2,
          40,
          pickW([0, 0.2, 0.35, 0.3, 0.15]),
          R() < 0.6 ? 4 : 3
        ); // археологи не докопали
      if (R() < 0.5) near(HF_BL.x, HF_BL.y, 24, R() < 0.5 ? 4 : 3, 4); // тайник у валуна
      for (let k = 0; k < 2; k++) near(HF_TW.x, HF_TW.y, 24, 3, 4);
      t.items = t.items.filter(
        i => !HF_PITS.some(([x, y]) => Math.hypot(i.x - x, i.y - y) < 30) || i.leg || i.story
      );
    } // у башни — наконечники, оружие
    if (worldKind === "flooded") {
      for (let k = 0; k < 3; k++)
        near(
          FLD_CHURCH.x + FLD_CHURCH.w / 2,
          FLD_CHURCH.y + FLD_CHURCH.h / 2,
          46,
          R() < 0.5 ? 2 : 4,
          pickW([0, 0.2, 0.5, 0.3])
        ); // у церкви — монеты, образки
      [
        [268, 306],
        [498, 306]
      ].forEach(([x, y]) => {
        for (let k = 0; k < 2; k++) near(x, y, 22, 2, pickW([0.3, 0.3, 0.3, 0.1]));
      }); // в колодцы бросали монеты
      FLD_HOUSES.forEach(([hx, hy]) => {
        if (R() < 0.45) near(hx + 15, hy + 12, 14, pickW([0, 0.6, 0.3, 0.1]), pickW([0.3, 0.4, 0.25, 0.05]));
      });
    }
  } // в избах — быт
  if (worldKind === "flooded" && !G.nyuraB && !G.inv.some(i => i.nyura) && R() < 0.35) {
    for (let a = 0; a < 300; a++) {
      const an = R() * 6.28,
        rr = Math.sqrt(R()) * ZONE.r * 0.8,
        tx = Math.floor((ZONE.x + Math.cos(an) * rr) / TS),
        ty = Math.floor((ZONE.y + Math.sin(an) * rr) / TS);
      if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
      used.add(tx + "," + ty);
      t.items.push({
        tx,
        ty,
        x: tx * TS + 8,
        y: ty * TS + 8,
        c: 1,
        era: 1,
        name: "Брошка-ласточка «Нюра»",
        iron: false,
        w: 0.01,
        base: 200,
        depth: 8 + Math.floor(R() * 8),
        found: false,
        nyura: 1
      });
      break;
    }
  }
  placeLegends(t, used);
  placeStory(t, used);
  if (!map.free && (map.id === 2 || map.id === 3)) t.pz = makePuzzle(t, map, used);
  t.event = rollEvent(t);
  if (G.story && G.story.st === 4 && G.story.clues.includes("kotelok") && G.story.clues.includes("flyaga"))
    t.event = "nyura";
  if (G.stashOwner) t.event = "stashOwner";
  if (G.debt > 0 && (G.debtMiss || 0) >= 2) t.event = "collector";
  if (
    G.story &&
    G.story.st === 5 &&
    !(G.debt > 0) &&
    worldKind === "swamp" &&
    !G.inv.some(i => i.story === "medal")
  )
    t.event = season().id === "winter" ? "ice" : "gat";
  return t;
}
