// ================= ГАРДЕРОБ: вкладка «Снаряжение» → «Гардероб» =================
function wdCount() {
  wearSync();
  const all = Object.values(WEAR).flat(),
    got = all.filter(w => (G.lvl || 1) >= w.l).length;
  return got + "/" + all.length;
}
function wearPreview() {
  const im = heroImg(G.det),
    S = 4,
    c = document.createElement("canvas");
  c.width = 80 * S;
  c.height = 34 * S;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  if (im && im.complete !== false && im.naturalWidth !== 0) {
    g.drawImage(im, 0, 2, 40, 34, 0, 0, 40 * S, 34 * S); // анфас
    g.drawImage(im, 0, 2 * 42 + 2, 40, 34, 40 * S, 0, 40 * S, 34 * S); // в профиль
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
        return `<button class="wd-o${w === on ? " on" : ""}${open ? "" : " lock"}" ${open ? `onclick="SK.wearPick('${s}','${w.id}')"` : "disabled"}><img src="${w.ic}" alt=""><span>${w.n}<small>${w === on ? "надето" : open ? "надеть" : `с ${w.l}-го уровня`}</small></span></button>`;
      })
      .join("")}</div></div>`;
  }).join("");
  return `<section class="eco wd"><div class="eco-h"><h2>Гардероб</h2></div><div class="wd-prev"><img src="${wearPreview()}" alt="Серый в выбранной одежде"></div>${rows}<p class="dim">Новая одежда открывается с уровнями и надевается сама — снять или сменить можно здесь.</p></section>`;
}
function wearPick(s, id) {
  const w = WEAR[s] && WEAR[s].find(x => x.id === id);
  if (!w || (G.lvl || 1) < w.l) return;
  wearSync();
  G.wear[s] = id;
  save();
  renderBase();
}
