// ================= ДЕТЕКТОР =================
function signal(pt) {
  const D0 = DET[G.det],
    D = Object.assign({}, D0, {
      depth: D0.depth + (own("coil") ? 15 : 0),
      r: D0.r + (own("phones") ? 4 : 0) - (T && T.fog ? 5 : 0)
    });
  let best = { s: 0, it: null, left: 0 };
  for (const it of items) {
    if (it.found) continue;
    const left = Math.max(0, it.depth - holeAt(it.tx, it.ty));
    if (left > D.depth && !it.story) continue;
    const d0 = Math.hypot(it.x - pt.x, it.y - pt.y),
      pl = COIL_W[G.det];
    if (d0 > D.r + pl) continue;
    const d = Math.max(0, d0 - pl);
    const s = (1 - d / (D.r + 4)) * (1 - (0.55 * Math.min(left, D.depth)) / D.depth);
    if (s > best.s) best = { s, it, left };
  }
  if (DET[G.det].noise) best.s = Math.max(0, Math.min(1, best.s + noise));
  return best;
}
const COIL_W = [0, 16, 15, 14, 11, 9, 7]; // ширина «пятна» катушки: над соседними клетками пищит почти так же
const barsEl = $("bars");
const LCD_NAME = [null, "САМОДЕЛКА", "БЮДЖЕТНЫЙ", "ДИСКРИМИНАТОР", "ПРОФИ", "ГЛУБИННЫЙ", "ГЕОРАДАР"];
function buildBars() {
  // ровная лесенка: одинаковая ширина, высота растёт равномерно, цвет от зелёного к оранжевому
  const n = [0, 6, 8, 12, 14, 16, 20][G.det];
  barsEl.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const b = document.createElement("i"),
      k = i / (n - 1);
    b.style.height = Math.round(5 + k * 19) + "px";
    if (G.det > 1) b.style.setProperty("--c", `hsl(${Math.round(95 - k * 65)} 70% ${Math.round(55 + k * 5)}%)`);
    barsEl.appendChild(b);
  }
  $("lcd").className = "lcd lv" + Math.min(3, G.det === 1 ? 1 : G.det <= 3 ? 2 : 3);
  $("lname").textContent = LCD_NAME[G.det];
}
// ВДИ: «номер» цели. У одинаковых вещей он всегда похож — игрок учится читать сигнал
const VDI_CL = [
    [36, 18],
    [40, 24],
    [56, 28],
    [50, 30],
    [66, 29]
  ],
  VDI_J = [0, 0, 0, 7, 5, 3, 2],
  VDI_NM = ["мусор", "бытовое", "монета", "военное", "редкое"];
function vdiOf(it) {
  if (it._v != null) return it._v;
  let h = 7;
  for (const ch of it.name) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  let v;
  if (it.leg) v = 88 + (h % 8);
  else if (it.story) v = 64 + (h % 10);
  else if (it.iron) v = it.w < 0.1 ? 6 + (h % 12) : it.w < 1 ? 12 + (h % 16) : 22 + (h % 16);
  else {
    const r = VDI_CL[it.c] || VDI_CL[1];
    v = r[0] + (h % r[1]);
  }
  return (it._v = Math.min(99, v));
}
let vdiCur = null;
function vdiShown(it, s) {
  const now = performance.now();
  if (!vdiCur || vdiCur.it !== it || now - vdiCur.t > 450) {
    const J = VDI_J[G.det] * (1.6 - Math.min(1, s));
    vdiCur = {
      it,
      t: now,
      v: Math.max(1, Math.min(99, vdiOf(it) + Math.round((Math.random() * 2 - 1) * J)))
    };
  }
  return vdiCur.v;
}
function vdiGuess(v) {
  const L = (G.vdiLog || []).filter(e => Math.abs(e[0] - v) <= 4);
  if (L.length < 2) return "";
  const n = [0, 0, 0, 0, 0];
  L.forEach(e => n[e[1]]++);
  return VDI_NM[n.indexOf(Math.max(...n))] + "?";
}
let lcdKey = "";
function updateLcd(sig) {
  const bars = barsEl.children,
    n = Math.round(sig.s * bars.length);
  let type = "Тишина",
    sub = "";
  if (sig.s > 0.08) {
    type = sig.s < 0.35 ? "Слабый сигнал" : sig.s < 0.65 ? "Сигнал" : "Сильный сигнал";
    if (DET[G.det].disc && sig.it && sig.s > 0.2) {
      const v = vdiShown(sig.it, sig.s);
      type = "ВДИ " + v;
      sub = vdiGuess(v) || (v < 38 ? "железо" : "цветной");
      if (!G.vdiTip) {
        G.vdiTip = 1;
        setTimeout(() => {
          toast(
            "<b>ВДИ</b> — номер цели. У одной и той же вещи он всегда похож: пробка всегда около одного числа, монета — около своего. Запоминайте, что выкопали на каком номере, — детектор начнёт подсказывать «монета?» и «мусор?». Ниже 38 — обычно железо."
          );
        }, 50);
        save();
      }
    } else if (DET[G.det].disc) sub = !sig.it ? "помеха" : sig.it.iron ? "железо" : "цветной металл";
    else if (DET[G.det].noise) sub = "может быть помехой";
    if (DET[G.det].showDepth && sig.it && sig.s > 0.35) sub += " · " + Math.round(sig.left / 5) * 5 + " см";
  }
  const t = pTile(),
    h = holeAt(t.tx, t.ty),
    mx = shovelMax();
  const key = n + "|" + type + "|" + sub + "|" + h + "|" + mx + "|" + t.tx + "," + t.ty;
  if (key === lcdKey) return;
  lcdKey = key;
  [...bars].forEach((b, i) => b.classList.toggle("on", i < n));
  $("ltype").textContent = type;
  $("ldepth").textContent = sub;
  $("dNow").textContent = h + " см";
  $("dMax").textContent = mx + " см";
  $("depthRow").style.setProperty("--dp", Math.min(100, Math.round((h / mx) * 100)) + "%");
  $("depthRow").classList.toggle("max", h >= mx);
}
let actx = null,
  osc = null,
  gain = null,
  soundOn = false,
  unlockEl = null;
let detVol = (() => {
  try {
    const v = +localStorage.getItem("seryi-detvol");
    return localStorage.getItem("seryi-detvol") == null || isNaN(v) ? 50 : v;
  } catch (e) {
    return 50;
  }
})();
function syncDvol() {
  const w = $("dvol");
  if (!w) return;
  w.hidden = !soundOn;
  $("dvolR").value = detVol;
  $("dvolV").textContent = detVol + "%";
}
$("dvolR").addEventListener("input", e => {
  detVol = +e.target.value;
  $("dvolV").textContent = detVol + "%";
  try {
    localStorage.setItem("seryi-detvol", detVol);
  } catch (er) {}
  if (soundOn && actx) {
    const t = actx.currentTime;
    const o = actx.createOscillator(),
      g = actx.createGain();
    o.type = "square";
    o.frequency.value = 900;
    g.gain.setValueAtTime((0.1 * detVol) / 100, t);
    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.08);
    o.connect(g).connect(actx.destination);
    o.start(t);
    o.stop(t + 0.1);
  }
});
$("dvol").addEventListener("pointerdown", e => e.stopPropagation());
// тишина в формате WAV: проигрывание <audio> на iPhone переводит страницу в режим «плеер», и писк слышен даже в беззвучном режиме
function silentWav() {
  const n = 800,
    b = new Uint8Array(44 + n),
    v = new DataView(b.buffer),
    w = (o, t) => [...t].forEach((c, i) => (b[o + i] = c.charCodeAt(0)));
  w(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  w(36, "data");
  v.setUint32(40, n, true);
  b.fill(128, 44);
  let s = "";
  b.forEach(x => (s += String.fromCharCode(x)));
  return "data:audio/wav;base64," + btoa(s);
}
function audioUnlock() {
  try {
    if (navigator.audioSession) navigator.audioSession.type = "playback";
  } catch (e) {}
  try {
    if (!unlockEl) {
      unlockEl = new Audio(silentWav());
      unlockEl.loop = true;
      unlockEl.setAttribute("playsinline", "");
    }
    const pr = unlockEl.play();
    if (pr && pr.catch) pr.catch(() => {});
  } catch (e) {}
  makeCtx();
}
function makeCtx() {
  try {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      osc = actx.createOscillator();
      gain = actx.createGain();
      osc.type = "square";
      gain.gain.value = 0;
      const lp = actx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;
      osc.connect(lp).connect(gain).connect(actx.destination);
      osc.start();
    }
    if (actx.state !== "running") actx.resume();
  } catch (e) {}
  return actx;
}
