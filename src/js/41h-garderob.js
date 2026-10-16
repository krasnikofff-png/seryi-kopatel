// ================= ГАРДЕРОБ: вкладка «Снаряжение» → «Одежда» =================
let wdSel = null; // какая вещь раскрыта в карточке: "hat:cap"
function wdAll() {
  wearSync();
  const all = [];
  WEAR_SLOTS.forEach(([s]) => WEAR[s].forEach(w => all.push([s, w])));
  return all;
}
function wdCount() {
  const all = wdAll();
  return all.filter(([s, w]) => wearOpen(s, w)).length + "/" + all.length;
}
// кадр 40×42 из листа: анфас (детектор спрятан — правую половину зеркалим с левой)
// или со спины (катушку над головой убираем — оставляем только то, что дорисовала одежда)
function wdFrame(im, row) {
  const t = document.createElement("canvas");
  t.width = 40;
  t.height = 42;
  const tg = t.getContext("2d");
  tg.drawImage(im, 0, row * 42, 40, 42, 0, 0, 40, 42);
  const d = tg.getImageData(0, 0, 40, 42);
  if (row === 0) {
    for (let y = 0; y < 42; y++)
      for (let x = 20; x < 40; x++) {
        const a = (y * 40 + x) * 4,
          b = (y * 40 + (39 - x)) * 4;
        for (let k = 0; k < 4; k++) d.data[a + k] = d.data[b + k];
      }
  } else {
    const base = HERO_DET[G.det],
      bt = document.createElement("canvas");
    bt.width = 40;
    bt.height = 42;
    const bg = bt.getContext("2d");
    bg.drawImage(base, 0, row * 42, 40, 42, 0, 0, 40, 42);
    const bd = bg.getImageData(0, 0, 40, 42).data;
    // катушка над головой (ряды до 12) и рука с ручкой детектора слева (ряды 18–20)
    for (let y = 0; y <= 20; y++)
      for (let x = 0; x < 40; x++) {
        if (y === 12 && x !== 17) continue;
        if (y > 12 && y < 18) continue;
        if (y >= 18 && !(x <= 13 || (y === 19 && x === 14))) continue;
        const a = (y * 40 + x) * 4;
        if (d.data[a] === bd[a] && d.data[a + 1] === bd[a + 1] && d.data[a + 2] === bd[a + 2]) d.data[a + 3] = 0;
      }
  }
  tg.putImageData(d, 0, 0);
  return t;
}
// превью: Серый анфас и со спины, без детектора; ws — примерить другую одежду
function wearPreview(ws, back = true) {
  const im = heroImg(G.det, ws),
    S = 6,
    W = 24,
    H = 23,
    n = back ? 2 : 1,
    c = document.createElement("canvas");
  c.width = W * S * n + (n - 1) * 12;
  c.height = H * S;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  if (im && im.complete !== false && im.naturalWidth !== 0)
    [0, 3]
      .slice(0, n)
      .forEach((row, i) => g.drawImage(wdFrame(im, row), 8, 8, W, H, i * (W * S + 12), 0, W * S, H * S));
  return c.toDataURL();
}
function wdStatus(s, w) {
  const open = wearOpen(s, w),
    on = wearOn(s) === w;
  if (on) return `<span class="wd-st on">${pxi("check", 12)}надето</span>`;
  if (open) return `<span class="wd-st">в шкафу</span>`;
  return `<span class="wd-st lock">${pxi("lock", 11)}${w.l ? `${w.l}-й уровень` : "закрыто"}</span>`;
}
function wdCard() {
  const [s, id] = (wdSel || "hat:" + wearOn("hat").id).split(":"),
    w = WEAR[s].find(x => x.id === id) || wearOn(s),
    open = wearOpen(s, w),
    on = wearOn(s) === w,
    pr = !open && w.pr ? w.pr() : null;
  const how = open ? "" : w.l ? `Откроется на ${w.l}-м уровне.` : w.how ? w.how + "." : "";
  return `<div class="wd-card"><img src="${w.ic}" alt=""><div class="wd-cb"><b>${w.n}</b>${wdStatus(s, w)}${how ? `<p>${how}</p>` : ""}${pr ? `<span class="wd-pr"><span class="alb-bar"><i style="width:${Math.min(100, Math.round((pr[0] / pr[1]) * 100))}%"></i></span><em>${Math.min(pr[0], pr[1])} из ${pr[1]}</em></span>` : ""}${w.fx ? `<p class="wd-fx">${pxi("star", 13)}${w.fx}</p>` : ""}</div>${open && !on ? `<button class="btn wd-on" onclick="SK.wearPick('${s}','${w.id}')">Надеть</button>` : ""}</div>`;
}
function wdSets() {
  return WEAR_SETS.map(S => {
    const parts = Object.entries(S.w).map(([s, id]) => [s, WEAR[s].find(w => w.id === id)]),
      got = parts.filter(([s, w]) => wearOpen(s, w)).length,
      on = setOn(S.id);
    return `<div class="wd-set${on ? " on" : ""}"><span class="wd-si">${parts.map(([s, w]) => `<img src="${w.ic}" alt="${w.n}"${wearOpen(s, w) ? "" : ` class="lock"`}>`).join("")}</span><span class="wd-sb"><b>${S.n}</b><small>${S.fx}</small></span>${on ? `<span class="wd-st on">${pxi("check", 12)}надет</span>` : got === parts.length ? `<button class="btn y wd-son" onclick="SK.wearSet('${S.id}')">Надеть</button>` : `<span class="wd-st lock">${got} из ${parts.length}</span>`}</div>`;
  }).join("");
}
function wardrobeBox() {
  wearSync();
  const slots = WEAR_SLOTS.map(([s, nm]) => {
    const on = wearOn(s),
      got = WEAR[s].filter(w => wearOpen(s, w)).length;
    return `<div class="wd-slot"><h3>${nm}<small>${got} из ${WEAR[s].length}</small></h3><div class="wd-tiles">${WEAR[s]
      .map(w => {
        const k = s + ":" + w.id,
          open = wearOpen(s, w);
        return `<button class="wd-t${w === on ? " on" : ""}${open ? "" : " lock"}${wdSel === k ? " sel" : ""}" onclick="SK.wdTap('${s}','${w.id}')" aria-label="${w.n}${open ? "" : ", закрыто"}"><img src="${w.ic}" alt="">${open ? "" : `<i>${pxi("lock", 11)}</i>`}</button>`;
      })
      .join("")}</div></div>`;
  }).join("");
  const S = WEAR_SETS.find(x => setOn(x.id));
  return `<section class="eco wd"><div class="eco-h"><h2>Гардероб</h2><b>открыто ${wdCount().replace("/", " из ")}</b></div><div class="wd-prev"><img src="${wearPreview()}" alt="Серый в выбранной одежде: анфас и со спины">${S ? `<span class="wd-say">${S.say}</span>` : ""}</div>${wdCard()}${slots}<h3 class="wd-h">Комплекты</h3><div class="wd-sets">${wdSets()}</div></section>`;
}
function wdTap(s, id) {
  const w = WEAR[s] && WEAR[s].find(x => x.id === id);
  if (!w) return;
  wdSel = s + ":" + id;
  if (wearOpen(s, w) && wearOn(s) !== w) {
    G.wear[s] = id;
    save();
  }
  renderBase();
}
function wearPick(s, id) {
  const w = WEAR[s] && WEAR[s].find(x => x.id === id);
  if (!w || !wearOpen(s, w)) return;
  wearSync();
  G.wear[s] = id;
  save();
  renderBase();
}
function wearSet(id) {
  const S = WEAR_SETS.find(x => x.id === id);
  if (
    !S ||
    !Object.entries(S.w).every(([s, v]) =>
      wearOpen(
        s,
        WEAR[s].find(w => w.id === v)
      )
    )
  )
    return;
  Object.assign(G.wear, S.w);
  save();
  renderBase();
}
// окно «Обновка»: новая вещь в гардеробе — показать на Сером и предложить надеть
function wearNewShow() {
  if (screen !== "base" || !(G.wearNew || []).length) return;
  if (document.querySelector(".over:not([hidden])") || !$("comic").hidden) return;
  const k = G.wearNew[0],
    [s, id] = k.split(":"),
    w = WEAR[s] && WEAR[s].find(x => x.id === id);
  if (!w) {
    G.wearNew.shift();
    return wearNewShow();
  }
  let o = $("wdNew");
  if (!o) {
    o = document.createElement("div");
    o.id = "wdNew";
    o.className = "over";
    o.style.zIndex = 90;
    document.body.appendChild(o);
  }
  const worn = wearOn(s) === w,
    from = w.flea ? "Нашлась в лоте на барахолке" : w.l ? `Награда за ${w.l}-й уровень` : w.how,
    more = G.wearNew.length - 1;
  o.innerHTML = `<div class="sheet plank wdn"><h2>Обновка в гардеробе</h2><div class="wdn-pic"><img src="${wearPreview({ [s]: w.id }, false)}" alt="Серый: ${w.n}"><img class="wdn-ic" src="${w.ic}" alt=""></div><p class="wdn-n"><b>${w.n}</b><small>${from}</small></p>${w.fx ? `<p class="wd-fx">${pxi("star", 13)}${w.fx}</p>` : ""}<div class="row">${worn ? `<button class="btn" onclick="SK.wearNewOk(0)">Уже надето${more ? ` · дальше ${more}` : ""}</button>` : `<button class="btn" onclick="SK.wearNewOk(1)">Надеть</button><button class="btn ghost" onclick="SK.wearNewOk(0)">В гардероб${more ? ` · ещё ${more}` : ""}</button>`}</div></div>`;
  o.hidden = false;
  SFX.story();
}
function wearNewOk(put) {
  const k = (G.wearNew || []).shift();
  if (put && k) {
    const [s, id] = k.split(":");
    G.wear[s] = id;
  }
  $("wdNew").hidden = true;
  save();
  renderBase();
}
