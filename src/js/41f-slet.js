// ================= СЛЁТ КОПАТЕЛЕЙ (12-й уровень) =================
// Раз в сезон — соревнование на общем поле: три часа, жетоны организаторов и трое соперников, которые копают то же поле.
const SLET_IMG = { cup: "@art(slet/cup.png)", token: "@art(slet/token.png)" };
const SLET_PTS = [0, 1, 3, 5, 10],
  SLET_TOKEN = 10,
  SLET_PRIZE = [30000, 10000, 0, 0],
  SLET_START = 120, // 10:00
  SLET_END = 300; // свисток в 13:00
const SLET_RIVALS = [
  { n: "Митрич", k: 5, hue: 200, skill: 0.5, dig: 18, line: "ветеран, копает с девяностых" },
  { n: "Бульдозер", k: 4, hue: 120, skill: 0.35, dig: 12, line: "копает быстро и много" },
  { n: "Студент", k: 3, hue: 280, skill: 0.25, dig: 14, line: "дорогой детектор, мало опыта" }
];
const SLET_MAP = {
  id: 8,
  name: "Слёт копателей",
  free: true,
  probs: [0.3, 0.36, 0.22, 0.1, 0.02],
  eraW: [0.45, 0.35, 0.2, 0, 0],
  n: 44
};
const sletKey = () => Math.floor((G.trips || 0) / 4);
const sletOpen = () => perk("slet") && G.sletDone !== sletKey();
function sletNb() {
  if (!sletOpen()) return "";
  return `<div class="nbc slet"><div class="nbc-pic spr"><img src="${SLET_IMG.cup}" alt=""></div><div class="nbc-b"><span class="nbc-hand">${season().name.toLowerCase()}</span><h3>Слёт копателей</h3><p>Раз в сезон копатели собираются на общем поле. Организаторы закопали 12 жетонов. Три часа, свисток в 13:00 — у кого больше очков, тот и победил.</p><ul><li>${NBI.bars}<span>Очки: жетон ${SLET_TOKEN}, редкое 10, военное 5, монета 3, бытовое 1</span></li><li>${NBI.box}<span>Призы: 1-е — ${rub(SLET_PRIZE[0])} и кубок, 2-е — ${rub(SLET_PRIZE[1])}</span></li><li>${NBI.acc}<span>Соперники: ${SLET_RIVALS.map(r => r.n).join(", ")}</span></li></ul><button class="nb-btn" onclick="SK.goSlet()">Ехать на слёт</button></div></div>`;
}
function goSlet() {
  if (!sletOpen()) return;
  G.sletDone = sletKey();
  G.inv.forEach(i => delete i._new);
  G.msg = "";
  const t = newTrip(SLET_MAP, 1),
    taken = new Set(t.items.map(i => i.tx + "," + i.ty));
  // жетоны организаторов — неглубоко, по всему полю
  let k = 0;
  for (let a = 0; a < 2000 && k < 12; a++) {
    const tx = 2 + Math.floor(Math.random() * (MW - 4)),
      ty = 6 + Math.floor(Math.random() * (MH - 10));
    if (taken.has(tx + "," + ty) || !diggable(tx, ty)) continue;
    taken.add(tx + "," + ty);
    k++;
    t.items.push({
      tx,
      ty,
      x: tx * TS + 8,
      y: ty * TS + 8,
      c: 1,
      era: 0,
      name: "Жетон слёта №" + k,
      iron: false,
      w: 0.01,
      base: 0,
      depth: 8 + Math.floor(Math.random() * 14),
      found: false,
      token: k
    });
  }
  t.minutes = SLET_START;
  t.event = null;
  const st = { tx: Math.floor(t.px / TS), ty: Math.floor((t.py - 5) / TS) };
  t.slet = {
    end: SLET_END,
    me: 0,
    tok: 0,
    last: SLET_START,
    rivals: SLET_RIVALS.map((r, i) => ({
      n: r.n,
      i,
      pts: 0,
      tok: 0,
      tx: st.tx - 2 + i * 2,
      ty: st.ty - 1,
      tgt: null,
      dl: 0
    }))
  };
  t.slet.rivals.forEach(r => {
    while (blocked(r.tx, r.ty) && r.ty > 2) r.ty--;
  });
  loadTrip(t);
  save();
  showField();
  sletChip();
  toast(
    `Слёт копателей! Организаторы закопали 12 жетонов (по ${SLET_TOKEN} очков), обычные находки тоже идут в зачёт. Свисток в ${hhmmAbs(480 + SLET_END)}. Соперники уже разошлись по полю.`
  );
}
const sletPtsOf = it => (it.token ? SLET_TOKEN : SLET_PTS[it.c] || 0);
function sletTable() {
  const S = T.slet;
  return [{ n: "Вы", pts: S.me, me: 1 }]
    .concat(S.rivals.map(r => ({ n: r.n, pts: r.pts })))
    .sort((a, b) => b.pts - a.pts || (a.me ? -1 : b.me ? 1 : 0));
}
function sletChip() {
  const b = $("sletBtn");
  if (!b) return;
  const S = T && T.slet;
  b.hidden = !S;
  if (!S) return;
  b.innerHTML = `<img src="${SLET_IMG.cup}" alt=""><span>Слёт · свисток в ${hhmmAbs(480 + S.end)}<small>${sletTable()
    .map(x => (x.me ? `<b>Вы ${x.pts}</b>` : `${x.n} ${x.pts}`))
    .join(" · ")}</small></span>`;
}
function sletInfo() {
  toast(
    `Очки: жетон слёта ${SLET_TOKEN}, редкое 10, военное 5, монета 3, бытовое 1, мусор 0. Призы: 1-е — ${rub(SLET_PRIZE[0])} и кубок, 2-е — ${rub(SLET_PRIZE[1])}, за 3-е и 4-е — ничего. Соперники копают то же поле — что выкопали они, вам уже не достанется.`
  );
}
// очки игрока: вызывается из копки
function sletFound(got) {
  const S = T.slet;
  S.me += sletPtsOf(got);
  if (got.token) {
    S.tok++;
    T.found--;
    SFX.levelup && SFX.levelup();
    toast(
      `<img class="tk-ic" src="${SLET_IMG.token}" alt=""> <b>${got.name}!</b> +${SLET_TOKEN} очков. Жетонов у вас: ${S.tok}.`
    );
  }
  sletChip();
}
// соперники живут по игровым минутам, как и сам копатель
function sletTick() {
  const S = T && T.slet;
  if (!S) return;
  let ch = false;
  while (S.last < Math.min(T.minutes, S.end)) {
    S.last++;
    S.rivals.forEach(r => {
      if (rvMinute(r)) ch = true;
    });
  }
  if (ch) sletChip();
}
function rvMinute(r) {
  const R0 = SLET_RIVALS[r.i];
  if (r.dl > 0) {
    r.dl--;
    return r.dl === 0 ? rvDigDone(r) : false;
  }
  if (!r.tgt) r.tgt = rvPick(r);
  if (r.tx === r.tgt.tx && r.ty === r.tgt.ty) {
    r.dl = R0.dig * (isWinter() ? 2 : 1);
    return false;
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
      return false;
    }
  }
  r.tgt = null; // упёрся — выберет другое место
  return false;
}
function rvPick(r) {
  const R0 = SLET_RIVALS[r.i];
  if (Math.random() < R0.skill) {
    const near = items.filter(
      i => !i.found && Math.abs(i.tx - r.tx) + Math.abs(i.ty - r.ty) < 16 && (i.token || i.c > 0)
    );
    if (near.length) {
      const it = Math.random() < 0.4 && near.some(i => i.token) ? pick(near.filter(i => i.token)) : pick(near);
      const off =
        Math.random() < 0.35
          ? pick([
              [1, 0],
              [-1, 0],
              [0, 1],
              [0, -1]
            ])
          : [0, 0];
      const tx = it.tx + off[0],
        ty = it.ty + off[1];
      if (diggable(tx, ty)) return { tx, ty };
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
function rvDigDone(r) {
  const k = r.tx + "," + r.ty;
  if (!holes.has(k)) (T.slet.rh = T.slet.rh || {})[k] = 1;
  holes.set(k, Math.max(holes.get(k) || 0, 30));
  const cand = items
    .filter(i => !i.found && Math.abs(i.tx - r.tx) <= 1 && Math.abs(i.ty - r.ty) <= 1 && i.depth <= 40)
    .sort((a, b) => Math.abs(a.tx - r.tx) + Math.abs(a.ty - r.ty) - (Math.abs(b.tx - r.tx) + Math.abs(b.ty - r.ty)));
  r.tgt = null;
  const it = cand.find(i => i.tx === r.tx && i.ty === r.ty) || (Math.random() < 0.45 ? cand[0] : null);
  if (!it) return false;
  it.found = true;
  it.rv = r.n;
  const p = sletPtsOf(it);
  r.pts += p;
  if (it.token) r.tok++;
  r.pop = { txt: it.token ? "жетон!" : p ? "+" + p : "", t: performance.now() };
  if (it.token && Math.hypot(r.tx * TS - P.x, r.ty * TS - P.y) < 160)
    toast(`${r.n} откопал жетон прямо у вас под носом. «Кто первый встал — того и тапки».`);
  return p > 0;
}
// отрисовка соперников: перекрашенные спрайты копателя
const rvSheets = {};
function rvSheet(i) {
  if (rvSheets[i]) return rvSheets[i];
  const R0 = SLET_RIVALS[i],
    im = HERO_DET[R0.k];
  if (!im || !im.complete || !im.naturalWidth) return null;
  const c = document.createElement("canvas");
  c.width = im.naturalWidth;
  c.height = im.naturalHeight;
  const g = c.getContext("2d");
  g.drawImage(im, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height),
    a = d.data;
  for (let p = 0; p < a.length; p += 4) {
    if (!a[p + 3]) continue;
    const r = a[p] / 255,
      gg = a[p + 1] / 255,
      b = a[p + 2] / 255,
      mx = Math.max(r, gg, b),
      mn = Math.min(r, gg, b),
      l = (mx + mn) / 2,
      dd = mx - mn;
    if (dd < 0.12) continue;
    const s = dd / (1 - Math.abs(2 * l - 1));
    let h = mx === r ? ((gg - b) / dd) % 6 : mx === gg ? (b - r) / dd + 2 : (r - gg) / dd + 4;
    h *= 60;
    if (h < 0) h += 360;
    if (h > 10 && h < 40 && l > 0.6) continue; // кожа
    h = (h + R0.hue) % 360;
    const C = (1 - Math.abs(2 * l - 1)) * s,
      X = C * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - C / 2,
      seg = Math.floor(h / 60),
      [r1, g1, b1] = [
        [C, X, 0],
        [X, C, 0],
        [0, C, X],
        [0, X, C],
        [X, 0, C],
        [C, 0, X]
      ][seg % 6];
    a[p] = Math.round((r1 + m) * 255);
    a[p + 1] = Math.round((g1 + m) * 255);
    a[p + 2] = Math.round((b1 + m) * 255);
  }
  g.putImageData(d, 0, 0);
  return (rvSheets[i] = c);
}
function sletEnts(ents, camX, camY) {
  const S = T && T.slet;
  if (!S) return;
  const now = performance.now();
  S.rivals.forEach(r => {
    const fx = r.tx * TS + 8,
      fy = r.ty * TS + 13;
    if (r.rx == null) {
      r.rx = fx;
      r.ry = fy;
    }
    const dt = Math.min(0.05, (now - (r._t || now)) / 1000);
    r._t = now;
    const dx = fx - r.rx,
      dy = fy - r.ry,
      L = Math.hypot(dx, dy),
      sp = 90 * dt;
    if (L > 240) {
      r.rx = fx;
      r.ry = fy;
    } else if (L > sp) {
      r.rx += (dx / L) * sp;
      r.ry += (dy / L) * sp;
      r.walk = (r.walk || 0) + dt;
    } else {
      r.rx = fx;
      r.ry = fy;
    }
    const moving = L > sp,
      x = Math.round(r.rx - camX),
      y = Math.round(r.ry - camY);
    if (x < -30 || y < -40 || x > VW + 30 || y > VH + 30) return;
    ents.push({
      y: r.ry,
      f: () => {
        disc(ctx, x, y + 1, 5, 1, "rgba(20,30,10,.35)");
        const sh = rvSheet(r.i),
          fr = moving ? [0, 1, 0, 2][Math.floor(r.walk * 8) % 4] : 0,
          bob = r.dl > 0 ? Math.floor(now / 180) % 2 : 0;
        if (sh) ctx.drawImage(sh, fr * 40, HD_ROW[r.dir || "down"] * 42, 40, 42, x - 20, y - 29 + bob, 40, 42);
        if (r.dl > 0 && Math.floor(now / 180) % 2) {
          ctx.fillStyle = "#6a4a2a";
          ctx.fillRect(x + 6, y - 2, 2, 2);
          ctx.fillRect(x + 9, y - 4, 2, 2);
        }
        ctx.font = "bold 7px sans-serif";
        const w = ctx.measureText(r.n).width + 4;
        ctx.fillStyle = "rgba(20,16,10,.7)";
        ctx.fillRect(x - w / 2, y - 34, w, 9);
        ctx.fillStyle = "#f6dc6a";
        ctx.fillText(r.n, x - w / 2 + 2, y - 27);
        if (r.pop && r.pop.txt && now - r.pop.t < 1800) {
          const k = (now - r.pop.t) / 1800;
          ctx.globalAlpha = 1 - k;
          ctx.fillStyle = "#fff6c8";
          ctx.font = "bold 8px sans-serif";
          ctx.fillText(r.pop.txt, x - 8, y - 38 - k * 10);
          ctx.globalAlpha = 1;
        }
      }
    });
  });
}
function sletEnd() {
  const S = T.slet,
    tab = sletTable(),
    place = tab.findIndex(x => x.me) + 1,
    prize = SLET_PRIZE[place - 1] || 0;
  G.money += prize;
  if (place === 1) G.sletWins = (G.sletWins || 0) + 1;
  const tok = S.tok;
  endTrip(
    `Слёт копателей: ${place}-е место из 4${prize ? `, приз ${rub(prize)}` : ""}. Жетонов ваших: ${tok}.${place === 1 ? ` Кубков в гараже: ${G.sletWins}.` : ""}`
  );
  const box = $("evt");
  box.innerHTML = `<div class="sheet slet-res">${place === 1 ? `<img class="sr-cup" src="${SLET_IMG.cup}" alt="">` : ""}<h2>${place === 1 ? "Победа на слёте!" : "Слёт окончен"}</h2><p>${place === 1 ? "Организатор вручает кубок и конверт. Копатели хлопают — кто-то искренне, кто-то сквозь зубы." : place === 4 ? "Последнее место. Митрич хлопает по плечу: «Ничего, в следующий раз»." : "Свисток. Все сходятся к палатке организаторов считать очки."}</p><ol class="sr-tab">${tab.map((x, i) => `<li class="${x.me ? "me" : ""}"><span>${i + 1}. ${x.n}</span><b>${x.pts}</b><em>${SLET_PRIZE[i] ? rub(SLET_PRIZE[i]) : "—"}</em></li>`).join("")}</ol><p class="dim">Находки со слёта — ваши: почистите их в гараже. Следующий слёт — в новом сезоне.</p><button class="btn" onclick="$('evt').hidden=true">В гараж</button></div>`;
  box.hidden = false;
  SFX.story && SFX.story();
}
