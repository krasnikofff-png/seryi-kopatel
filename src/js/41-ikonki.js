// ================= ИКОНКИ =================
// маленькие пиксельные картинки для плашек: строки символов → SVG из квадратиков
const ICONS = {
  clock: [
    [
      "..rrrrr..",
      ".rfffffr.",
      "rfffhfffr",
      "rfffhfffr",
      "rfffhhhfr",
      "rfffffffr",
      "rfffffffr",
      ".rfffffr.",
      "..rrrrr.."
    ],
    { r: "#e9c54a", f: "#f4ead0", h: "#3a2e1e" }
  ],
  coin: [
    [
      "..ddddd..",
      ".dyyyyyd.",
      "dyywyyyyd",
      "dywyyyyyd",
      "dywyyyyyd",
      "dyyyyyyyd",
      "dyyyyyydd",
      ".dyyyyyd.",
      "..ddddd.."
    ],
    { d: "#a8781e", y: "#e9c54a", w: "#fff3b0" }
  ],
  sndOn: [
    [
      "....g.....",
      "...gg...w.",
      "gggfg.w..w",
      "gffff..w.w",
      "gffff..w.w",
      "gggfg.w..w",
      "...gg...w.",
      "....g....."
    ],
    { g: "#cbbd95", f: "#f4ead0", w: "#e9c54a" }
  ],
  sndOff: [
    [
      "....g.....",
      "...gg.....",
      "gggfg.r..r",
      "gffff..rr.",
      "gffff..rr.",
      "gggfg.r..r",
      "...gg.....",
      "....g....."
    ],
    { g: "#cbbd95", f: "#f4ead0", r: "#d9583a" }
  ],
  map: [
    [
      "ppqqqppqqq",
      "rpqqqppqqq",
      "prqqqprqrq",
      "ppqrqrpqxq",
      "ppqqrppxqx",
      "ppqqqppqqq",
      "ppqqqppqqq",
      "ppqqqppqqq"
    ],
    { p: "#efe2c1", q: "#c9b383", r: "#c4553a", x: "#d9382a" }
  ],
  ring: [
    [
      "...yyy...",
      ".y.....y.",
      "y.......y",
      "....r....",
      "y..rrr..y",
      "....r....",
      "y.......y",
      ".y.....y.",
      "...yyy..."
    ],
    { y: "#e9c54a", r: "#d9483a" }
  ],
  pin: [
    ["..rrr..", ".rrrrr.", "rrrwrrr", "rrwwwrr", "rrrwrrr", ".rrrrr.", "..rrr..", "...r...", "...r..."],
    { r: "#d9483a", w: "#fff3e0" }
  ],
  bag: [
    [
      "...BBB...",
      "..B...B..",
      ".BBBBBBB.",
      "BbbbbbbbB",
      "BbbBBBbbB",
      "BbbbybbbB",
      "BbbbbbbbB",
      "BbBBBBBbB",
      "BbbbbbbbB",
      ".BBBBBBB."
    ],
    { b: "#a8784a", B: "#6b4a2a", y: "#e9c54a" }
  ],
  car: [
    [
      "...BBBBB....",
      "..BwwBwwB...",
      ".BBwwBwwBBB.",
      "BBBBBBBBBBBY",
      "BbbbbbbbbbbB",
      "BkkkBBBBkkkB",
      ".kgk....kgk."
    ],
    { B: "#3f74b8", b: "#5a92d6", w: "#cfe6f5", Y: "#ffd86a", k: "#1e1e22", g: "#9a9aa0" }
  ]
};
function iconSvg(name) {
  const [rows, pal] = ICONS[name],
    h = rows.length,
    w = rows[0].length;
  let r = "";
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (pal[ch]) r += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${pal[ch]}"/>`;
    })
  );
  return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
function setIcon(el, name) {
  el.dataset.ic = name;
  el.innerHTML = iconSvg(name);
}
document.querySelectorAll(".ic[data-ic]").forEach(el => setIcon(el, el.dataset.ic));

// камера держит копателя посередине между верхней и нижней панелью
let viewMidY = 0,
  viewTop = 0,
  viewBot = 0;
function measureHud() {
  const top = document.querySelector(".top"),
    act = document.querySelector(".actions");
  if (!top || !act || $("hud").hidden) return;
  const tb = top.getBoundingClientRect().bottom,
    ab = act.getBoundingClientRect().top;
  viewTop = tb / S;
  viewBot = (innerHeight - ab) / S;
  viewMidY = (tb + ab) / 2 / S;
  document.documentElement.style.setProperty("--botH", Math.round(innerHeight - ab + 8) + "px");
}
addEventListener("resize", measureHud);
if (window.ResizeObserver) {
  const ro = new ResizeObserver(measureHud);
  ro.observe(document.querySelector(".top"));
  ro.observe(document.querySelector(".actions"));
}
