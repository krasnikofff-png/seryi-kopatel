// ================= ВВОД В ПОЛЕ =================
const keys = new Set();
const KM = {
  arrowup: "u",
  w: "u",
  ц: "u",
  arrowdown: "d",
  s: "d",
  ы: "d",
  arrowleft: "l",
  a: "l",
  ф: "l",
  arrowright: "r",
  d: "r",
  в: "r"
};
addEventListener("keydown", e => {
  if (screen !== "field") return;
  const k = e.key.toLowerCase();
  if (k === "escape") {
    closeBag();
    return;
  }
  if (KM[k]) {
    keys.add(KM[k]);
    e.preventDefault();
    return;
  }
  if (k === " ") {
    e.preventDefault();
    if (!$("intro").hidden) {
      closeIntro();
      return;
    }
    dig(false);
    return;
  }
  if (k === "f" || k === "а") dig(true);
  else if (k === "b" || k === "и") openBag();
});
addEventListener("keyup", e => {
  const k = KM[e.key.toLowerCase()];
  if (k) keys.delete(k);
});
addEventListener("blur", () => keys.clear());
$("touch").addEventListener("pointerdown", e => {
  if (screen !== "field" || paused || digT > 0 || !T) return;
  const tx = Math.floor((e.clientX / S + CX) / TS),
    ty = Math.floor((e.clientY / S + CY) / TS),
    cur = pTile();
  if (tx === cur.tx && ty === cur.ty && !path.length) return;
  if (blocked(tx, ty)) {
    mark = { tx, ty, t: 0.5 };
    return;
  }
  const start = path.length ? path[0] : cur,
    p = findPath(start, { tx, ty });
  if (!p) {
    mark = { tx, ty, t: 0.5 };
    return;
  }
  path = path.length ? [path[0]].concat(p) : p;
  dest = { tx, ty };
  mark = null;
});
function closeIntro() {
  $("intro").hidden = true;
  G.seenIntro = true;
  save();
  showEvent();
}
$("go").onclick = closeIntro;
