// ================= ГАРДЕРОБ: вкладка «Снаряжение» → «Гардероб» =================
function wdCount() {
  wearSync();
  const all = Object.values(WEAR).flat(),
    got = all.filter(w => (G.lvl || 1) >= w.l).length;
  return got + "/" + all.length;
}
// превью в гардеробе: Серый анфас, без детектора, на тёмном фоне.
// В спрайте детектор в правой руке — правую половину зеркалим с левой и убираем всё ниже ботинок.
function wearPreview() {
  const im = heroImg(G.det),
    S = 6,
    c = document.createElement("canvas");
  c.width = 40 * S;
  c.height = 30 * S;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  if (im && im.complete !== false && im.naturalWidth !== 0) {
    const t = document.createElement("canvas");
    t.width = 40;
    t.height = 30;
    const tg = t.getContext("2d");
    tg.drawImage(im, 0, 0, 40, 30, 0, 0, 40, 30);
    const d = tg.getImageData(0, 0, 40, 30);
    for (let y = 0; y < 30; y++)
      for (let x = 20; x < 40; x++) {
        const a = (y * 40 + x) * 4,
          b = (y * 40 + (39 - x)) * 4;
        for (let k = 0; k < 4; k++) d.data[a + k] = d.data[b + k];
      }
    tg.putImageData(d, 0, 0);
    g.drawImage(t, 0, 0, 40, 30, 0, 0, 40 * S, 30 * S);
  }
  return c.toDataURL();
}
function wardrobeBox() {
  wearSync();
  const rows = WEAR_SLOTS.map(([s, nm]) => {
    const on = wearOn(s);
    return `<div class="wd-slot"><h3>${nm}</h3><div class="wd-opts">${WEAR[s]
      .map(w => {
        const open = (G.lvl || 1) >= w.l;
        return `<button class="wd-o${w === on ? " on" : ""}${open ? "" : " lock"}" ${open ? `onclick="SK.wearPick('${s}','${w.id}')"` : "disabled"}><img src="${w.ic}" alt=""><span>${w.n}<small>${w === on ? `${pxi("check", 11)}надето` : open ? "надеть" : `${pxi("lock", 10)}${w.l}-й уровень`}</small></span></button>`;
      })
      .join("")}</div></div>`;
  }).join("");
  return `<section class="eco wd"><div class="eco-h"><h2>Гардероб</h2><b>открыто ${wdCount().replace("/", " из ")}</b></div><div class="wd-prev"><img src="${wearPreview()}" alt="Серый в выбранной одежде"></div><div class="wd-grid">${rows}</div><p class="dim">Новая одежда открывается с уровнями и надевается сама.</p></section>`;
}
function wearPick(s, id) {
  const w = WEAR[s] && WEAR[s].find(x => x.id === id);
  if (!w || (G.lvl || 1) < w.l) return;
  wearSync();
  G.wear[s] = id;
  save();
  renderBase();
}
