// ================= ХОЛСТ =================
const cv = document.getElementById("cv"),
  ctx = cv.getContext("2d");
let S = 3,
  VW = 200,
  VH = 300;
function resize() {
  const w = innerWidth,
    h = innerHeight;
  S = Math.max(2, Math.round(Math.min(w, h) / (w < h ? 200 : 260)));
  VW = Math.ceil(w / S);
  VH = Math.ceil(h / S);
  cv.width = VW;
  cv.height = VH;
  cv.style.width = VW * S + "px";
  cv.style.height = VH * S + "px";
  ctx.imageSmoothingEnabled = false;
}
addEventListener("resize", resize);
resize();
