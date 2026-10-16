// ================= ПИКСЕЛЬНЫЕ ИКОНКИ (стиль А) =================
// Иконки рисуются сеткой 12×12 и выводятся как SVG без сглаживания. pxi("clock", 16) → строка <svg>.
const PX_PAL = {
  k: "#3a1d0b",
  y: "#ffcf3d",
  Y: "#c98f12",
  w: "#fff8e2",
  W: "#ffffff",
  g: "#44912a",
  G: "#2c6a18",
  l: "#7cc94f",
  r: "#d4482f",
  R: "#9a2a16",
  s: "#b8bec4",
  S: "#6a6e74",
  b: "#a8622e",
  B: "#6b3612",
  p: "#fbe9c0",
  c: "#9ad0e0",
  C: "#4f8fa8",
  n: "#e8b48c",
  d: "#4a2a12",
  o: "#f2b82a",
  e: "#f6dcae"
};
const PX_ICONS = {
  clock: [
    "....kkkk....",
    "..kkwwwwkk..",
    ".kwwwwkwwwk.",
    ".kwwwwkwwwk.",
    "kwwwwwkwwwwk",
    "kwwwwwkkkkwk",
    "kwwwwwwwwwwk",
    "kwwwwwwwwwwk",
    ".kwwwwwwwwk.",
    ".kwwwwwwwwk.",
    "..kkwwwwkk..",
    "....kkkk...."
  ],
  kg: [
    "....kkkk....",
    "...k....k...",
    "...k....k...",
    "..kkkkkkkk..",
    ".kSSSSSSSSk.",
    "kSsSSSSSSSSk",
    "kSsSSSSSSSSk",
    "kSSSSSSSSSSk",
    "kSSSSSSSSSSk",
    ".kSSSSSSSSk.",
    "..kkkkkkkk.."
  ],
  gear: [
    "....kkkk....",
    ".kk.keek.kk.",
    ".keekeekeek.",
    "..keeeeeek..",
    "kkeeekkeeekk",
    "keeek..keeek",
    "keeek..keeek",
    "kkeeekkeeekk",
    "..keeeeeek..",
    ".keekeekeek.",
    ".kk.keek.kk.",
    "....kkkk...."
  ],
  sound: [
    ".....k......",
    "....kk...e..",
    "...kek..e.e.",
    "kkkkek.e...e",
    "keeeek.e.e.e",
    "keeeek.e.e.e",
    "keeeek.e.e.e",
    "kkkkek.e...e",
    "...kek..e.e.",
    "....kk...e..",
    ".....k......"
  ],
  x: [
    "kk......kk",
    "kkk....kkk",
    ".kkk..kkk.",
    "..kkkkkk..",
    "...kkkk...",
    "...kkkk...",
    "..kkkkkk..",
    ".kkk..kkk.",
    "kkk....kkk",
    "kk......kk"
  ],
  lock: [
    "...kkkk...",
    "..k....k..",
    "..k....k..",
    "..k....k..",
    "kkkkkkkkkk",
    "kyyyyyyyyk",
    "kyyyykyyyk",
    "kyyyykyyyk",
    "kyYYYYYYYk",
    "kkkkkkkkkk"
  ],
  star: [
    ".....kk.....",
    ".....kk.....",
    "....kyyk....",
    "....kyyk....",
    "kkkkkyykkkkk",
    "kyyyyyyyyyyk",
    ".kyyyyyyyyk.",
    "..kyyyyyyk..",
    "..kyyyyyyk..",
    ".kyyykkyyyk.",
    ".kyyk..kyyk.",
    ".kkk....kkk."
  ],
  check: [
    ".........kk",
    "........kgk",
    ".......kggk",
    "kk....kggk.",
    "kgk..kggk..",
    "kggkkggk...",
    ".kgggggk...",
    "..kgggk....",
    "...kkk....."
  ],
  heart: [
    ".kkk..kkk.",
    "kwrrkkrrrk",
    "krrrrrrrrk",
    "krrrrrrrrk",
    ".krrrrrrk.",
    "..krrrrk..",
    "...krrk...",
    "....kk...."
  ],
  shield: [
    "kkkkkkkkkk",
    "kCCCCCCCCk",
    "kCCyyyyCCk",
    "kCCCyyCCCk",
    "kCCCyyCCCk",
    "kCCCCCCCCk",
    ".kCCCCCCk.",
    "..kCCCCk..",
    "...kkkk..."
  ],
  paper: [
    "kkkkkkkk..",
    "kwwwwwwkk.",
    "kwkkkkwwk.",
    "kwwwwwwwk.",
    "kwkkkkkwk.",
    "kwwwwwwwk.",
    "kwkkkkkwk.",
    "kwwwwrrwk.",
    "kwwwwrrwk.",
    "kkkkkkkkk."
  ],
  trash: [
    "...kkkk...",
    "kkkkkkkkkk",
    "kSSSSSSSSk",
    "kkkkkkkkkk",
    ".kssssssk.",
    ".kskssksk.",
    ".kskssksk.",
    ".kskssksk.",
    ".kssssssk.",
    ".kkkkkkkk."
  ],
  up: ["....kk....", "...kggk...", "..kggggk..", ".kggggggk.", "kkkkggkkkk", "...kggk...", "...kggk...", "...kkkk..."],
  pin: ["..kkkk..", ".krrrrk.", "krrWrrrk", "krrrrrrk", ".krrrrk.", "..krrk..", "..krrk..", "...kk..."],
  arrow: ["...kk...", "...kgk..", "kkkkggk.", "kggggggk", "kkkkggk.", "...kgk..", "...kk..."],
  bulb: ["..kkkk..", ".kyyyyk.", "kyyWyyyk", "kyyyyyyk", ".kyyyyk.", "..kssk..", "..kSSk..", "...kk..."],
  phones: [
    "...kkkkkk...",
    "..kSSSSSSk..",
    ".kSk....kSk.",
    ".kSk....kSk.",
    "krrk....krrk",
    "krrrk..krrrk",
    "krrrk..krrrk",
    "krrk....krrk",
    ".kk......kk."
  ],
  lamp: [
    "..........w.",
    ".kkkkk...ww.",
    "kyyyyyk.www.",
    "kyWyyyk.www.",
    "kyyyyyk.www.",
    "kYYYYYk..ww.",
    ".kkkkk....w.",
    ".kBBBk......",
    "kBBBBBk....."
  ],
  pinpointer: [
    "...kk...",
    "..kyyk..",
    "..kyyk..",
    "..kyWk..",
    "..kyyk..",
    "..kyyk..",
    "..kkkk..",
    "..kSSk..",
    "..kSSk..",
    "..kSSk..",
    "...kk..."
  ],
  coil: [
    "..kkkkkkkk..",
    ".kSSSSSSSSk.",
    "kSSkkkkkkSSk",
    "kSkggggggkSk",
    "kSkglggggkSk",
    "kSSkkkkkkSSk",
    ".kSSSSSSSSk.",
    "..kkkkkkkk.."
  ],
  bench: [
    "......kkkk..",
    "......ksSk..",
    "kkkkkkkkkkkk",
    "kbbbbbbbbbbk",
    "kBBBBBBBBBBk",
    "kkkkkkkkkkkk",
    ".kBk....kBk.",
    ".kBk....kBk.",
    ".kBk....kBk.",
    ".kkk....kkk."
  ],
  bath: [
    "...w...w....",
    "..w...w.....",
    "...w...w....",
    "kkkkkkkkkkkk",
    "kcccccccccck",
    "kcCcccCccCck",
    ".kcccccccck.",
    ".kcccccccck.",
    "..kkkkkkkk.."
  ],
  case: [
    "kkkkkkkkkkkk",
    "kcccccccccck",
    "kcyyccrrcGck",
    "kcyycrrrcGck",
    "kkkkkkkkkkkk",
    "kbbbbbbbbbbk",
    "kbbbkkkbbbbk",
    "kbbbbbbbbbbk",
    "kkkkkkkkkkkk"
  ],
  brush: [
    ".........kk.",
    "........kyyk",
    ".......kyyk.",
    "......kyyk..",
    ".....kyyk...",
    "....kSSk....",
    "...kbbSk....",
    "..kbbbk.....",
    ".kbbbk......",
    "kbbbk.......",
    "kkkk........"
  ],
  museum: [
    "....kkkk....",
    "..kkwwwwkk..",
    "kkwwwwwwwwkk",
    "kkkkkkkkkkkk",
    ".kw..kw..kw.",
    ".kw..kw..kw.",
    ".kw..kw..kw.",
    ".kw..kw..kw.",
    "kkkkkkkkkkkk",
    "kwwwwwwwwwwk",
    "kkkkkkkkkkkk"
  ],
  back: ["...kk...", "..kgk...", ".kggkkkk", "kggggggg", ".kggkkkk", "..kgk...", "...kk..."]
};
const pxCache = {};
function pxi(name, size, cls) {
  const key = name + "|" + (size || 20) + "|" + (cls || "");
  if (pxCache[key]) return pxCache[key];
  const rows = PX_ICONS[name];
  if (!rows) return "";
  const h = rows.length,
    w = Math.max(...rows.map(r => r.length)),
    sc = (size || 20) / Math.max(w, h);
  let rects = "";
  rows.forEach((r, y) => {
    let x = 0;
    while (x < r.length) {
      const ch = r[x];
      if (PX_PAL[ch]) {
        const x0 = x;
        while (x < r.length && r[x] === ch) x++;
        rects += `<rect x="${x0}" y="${y}" width="${x - x0}" height="1" fill="${PX_PAL[ch]}"/>`;
      } else x++;
    }
  });
  return (pxCache[key] =
    `<svg class="px${cls ? " " + cls : ""}" width="${Math.round(w * sc)}" height="${Math.round(h * sc)}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`);
}
const COIN_IMG = "@art(ui/ui-0.png)";
// «Купить · 3 500 ₽», «Спорить — 1,5 часа» → подпись + плашка цены/времени
function costPill(t) {
  const money = /₽|руб/.test(t),
    time = /мин|час|\bч\b|день|утр/.test(t);
  return `<span class="cost">${money ? `<img class="px" src="${COIN_IMG}" alt="" width="15" height="15">` : time ? pxi("clock", 14) : ""}${t}</span>`;
}
function lblCost(s) {
  const m = String(s).match(/^(.*?)\s+[·—–]\s+(.+)$/);
  if (!m || !/\d|бесплатно|даром/.test(m[2])) return `<span class="lbl">${s}</span>`;
  return `<span class="lbl">${m[1]}</span>${costPill(m[2])}`;
}
// статичные иконки в разметке: <span data-px="gear" data-s="22"></span>
document.querySelectorAll("[data-px]").forEach(e => (e.innerHTML = pxi(e.dataset.px, +e.dataset.s || 20)));
