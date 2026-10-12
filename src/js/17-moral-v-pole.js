// ===== МОРАЛЬ В ПОЛЕ =====
function invAdd(name, m) {
  const q = CAT.find(x => x[2] === name);
  const c = m ? m.c : q ? q[0] : 2,
    era = m ? m.era : q ? q[1] : 1;
  const it = {
    wet: 0,
    tid: T.id,
    name,
    c,
    iron: m ? m.iron : q ? q[3] : 0,
    era,
    w: m ? m.w : q ? q[4] : 0.02,
    base: m ? m.base : econBase(c, era, REGIONS[T.region].mult),
    cond: Math.round(rnd(0.7, 1) * 100) / 100,
    depth: m ? m.depth : 30,
    clean: false
  };
  G.inv.push(it);
  dexAdd(name);
  T.found++;
  updateHud();
  return it;
}
function nearFree(cx, cy, r0, r1) {
  for (let a = 0; a < 200; a++) {
    const an = Math.random() * 6.28,
      d = r0 + Math.random() * (r1 - r0),
      tx = Math.floor((cx + Math.cos(an) * d) / TS),
      ty = Math.floor((cy + Math.sin(an) * d) / TS);
    if (diggable(tx, ty) && !items.some(i => !i.found && i.tx === tx && i.ty === ty)) return { tx, ty };
  }
  return null;
}
function placeRing() {
  const p = nearFree(P.x, P.y - 5, 3 * TS, 7 * TS);
  if (!p) return;
  items.push({
    tx: p.tx,
    ty: p.ty,
    x: p.tx * TS + 8,
    y: p.ty * TS + 8,
    c: 4,
    era: 0,
    name: "Обручальное кольцо 583 пробы",
    iron: 0,
    w: 0.01,
    base: 3000,
    depth: 10 + Math.floor(Math.random() * 12),
    found: false,
    ring: 1
  });
}
function tipCache() {
  const z = T.real || { x: P.x, y: P.y, r: 6 * TS },
    p = nearFree(z.x, z.y, 0, z.r * 0.8);
  if (!p) return "";
  const m = makeItem(pickW([0, 0, 0.35, 0.45, 0.2]), [0.2, 0.4, 0.3, 0.1, 0], REGIONS[T.region].mult);
  m.cache = true;
  m.depth = Math.min(m.depth, 45);
  items.push(Object.assign({ tx: p.tx, ty: p.ty, x: p.tx * TS + 8, y: p.ty * TS + 8 }, m));
  return " Где-то рядом теперь лежит тайник — детектор подскажет.";
}
const moralOk = () => T && !T.moralDone && G.trips - (G.moralTrip == null ? -9 : G.moralTrip) >= 2;
function moralFire(id) {
  T.moralDone = 1;
  G.moralTrip = G.trips;
  T.event = id;
  setTimeout(showEvent, 350);
  save();
}
function rollEvent(t) {
  if (R() > (t.wx === "fog" ? 0.25 : 0.5)) return null;
  const r = t.region,
    S = season().id,
    pool = [];
  if (t.shown) pool.push("ded");
  if (S === "summer") {
    if (r === 1) pool.push("dacha", "dacha", "rivals");
    if (r === 2) pool.push("grib", "grib", "rivals");
  }
  if (S === "spring" && r === 3) pool.push("stuck", "stuck");
  if (G.rep >= 15) pool.push("tip");
  if (G.rep >= 40) pool.push("tip", "tip");
  if (G.rep <= -5) pool.push("snitch");
  if (G.rep <= -15) pool.push("snitch", "snitch");
  if (r <= 2 && G.rep > -15) pool.push("babka");
  if (r === 1) {
    pool.push("rivals", "rivals", "dacha", "dog");
    if (G.transport === 1) pool.push("train", "train");
    else pool.push("breakdown");
  }
  if (r === 2) {
    pool.push("rivals", "gai", "gai", "shell", "shell", "grib", "grib");
    if (G.transport !== 1) pool.push("breakdown");
  }
  if (r === 3) {
    pool.push("stuck", "stuck", "elk", "village");
    if (G.transport !== 1) pool.push("gai");
  }
  return pick(pool);
}
function showEvent() {
  const ev = T && T.event ? EVENTS[T.event] : null,
    box = $("evt");
  if (!ev) {
    box.hidden = true;
    paused = false;
    return;
  }
  paused = true;
  SFX.paper();
  box.innerHTML = `<div class="sheet"><h2>${ev.title}</h2><p>${ev.text()}</p><div class="row">${ev.opts.map(o => `<button class="btn" data-o="${o.id}" ${o.ok && !o.ok() ? "disabled" : ""}>${o.label()}${o.sub ? `<small class="esub">${o.sub()}</small>` : ""}</button>`).join("")}</div></div>`;
  box.hidden = false;
  box.querySelectorAll("button").forEach(
    b =>
      (b.onclick = () => {
        const res = ev.opts.find(o => o.id === b.dataset.o).run();
        T.event = null;
        box.hidden = true;
        paused = false;
        updateHud();
        toast(res);
        save();
      })
  );
}
