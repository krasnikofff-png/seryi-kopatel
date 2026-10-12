// ===== ЗВУКИ: синтез на лету, без файлов =====
let sfxOn = (() => {
    try {
      return localStorage.getItem("seryi-sfx") !== "0";
    } catch (e) {
      return true;
    }
  })(),
  sfxBus = null,
  noiseBuf = null;
function sfxCtx() {
  if (!sfxOn) return null;
  if (!unlockEl || unlockEl.paused) audioUnlock();
  const c = makeCtx();
  if (!c) return null;
  if (!sfxBus) {
    sfxBus = c.createGain();
    sfxBus.gain.value = 0.55;
    sfxBus.connect(c.destination);
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return c;
}
function sTone(c, f, t, len, vol, type, f2) {
  const o = c.createOscillator(),
    g = c.createGain();
  o.type = type || "sine";
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + Math.min(0.012, len * 0.2));
  g.gain.exponentialRampToValueAtTime(0.0005, t + len);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + len + 0.02);
}
function sNoise(c, t, len, vol, ftype, freq, q, att) {
  const n = c.createBufferSource(),
    f = c.createBiquadFilter(),
    g = c.createGain();
  n.buffer = noiseBuf;
  n.loop = true;
  f.type = ftype || "bandpass";
  f.frequency.value = freq || 1000;
  f.Q.value = q || 1;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + (att || 0.008));
  g.gain.exponentialRampToValueAtTime(0.0005, t + len);
  n.connect(f).connect(g).connect(sfxBus);
  n.start(t, Math.random() * 0.5);
  n.stop(t + len + 0.02);
  return f;
}
const SFX = {
  // продажа: горсть монет на прилавок и светлое «дзинь»
  coins(n) {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    n = n || 5;
    for (let i = 0; i < n; i++) {
      const s = t + i * 0.055 + Math.random() * 0.025,
        f = 2600 + Math.random() * 2200;
      sTone(c, f, s, 0.12, 0.13, "sine");
      sTone(c, f * 1.48, s, 0.07, 0.05, "sine");
      sNoise(c, s, 0.02, 0.08, "highpass", 5000, 0.7, 0.001);
    }
    const e = t + n * 0.055 + 0.04;
    sTone(c, 1568, e, 0.45, 0.16, "sine");
    sTone(c, 2349, e + 0.06, 0.55, 0.12, "sine");
  },
  // повышение навыка: быстрый взлёт нот и искристое «дзынь» наверху
  upgrade() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    sNoise(c, t, 0.07, 0.22, "bandpass", 2400, 6, 0.002);
    sTone(c, 180, t, 0.12, 0.18, "triangle", 120);
    sTone(c, 1250, t + 0.005, 0.25, 0.05, "square", 1180);
    const n = [392, 523, 659];
    n.forEach((f, i) => {
      const s = t + 0.1 + i * 0.075;
      sTone(c, f, s, 0.2, 0.15, "triangle");
      sTone(c, f * 2, s, 0.16, 0.04, "sine");
    });
    const e = t + 0.33;
    [784, 988, 1175].forEach(f => sTone(c, f, e, 0.55, 0.09, "triangle"));
    sTone(c, 1568, e + 0.02, 0.45, 0.05, "sine");
    sTone(c, 196, e, 0.4, 0.1, "sine");
  },
  legend() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    [392, 523, 659, 784, 1047].forEach((f, i) => {
      const s = t + i * 0.09;
      sTone(c, f, s, 0.3, 0.14, "triangle");
      sTone(c, f * 2, s, 0.25, 0.04, "sine");
    });
    const e = t + 0.5;
    [523, 659, 784, 1047].forEach(f => sTone(c, f, e, 1.2, 0.08, "triangle"));
    sTone(c, 131, e, 1.1, 0.12, "sine");
    for (let i = 0; i < 8; i++) sTone(c, 2093 + i * 260, e + 0.1 + i * 0.07, 0.2, 0.03, "sine");
  },
  scrub() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    sNoise(c, t, 0.09, 0.12, "bandpass", 1800 + Math.random() * 1600, 0.8, 0.01);
  },
  levelup() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    [523, 659, 784].forEach((f, i) => {
      const s = t + i * 0.07;
      sTone(c, f, s, 0.18, 0.16, "square");
      sTone(c, f * 2, s, 0.14, 0.05, "sine");
    });
    const e = t + 0.21;
    sTone(c, 1047, e, 0.7, 0.2, "sine");
    sTone(c, 1568, e, 0.6, 0.09, "sine");
    sTone(c, 2093, e + 0.05, 0.5, 0.08, "sine");
    sTone(c, 3136, e + 0.1, 0.35, 0.05, "sine");
    for (let i = 0; i < 4; i++) sTone(c, 2637 + i * 350, e + 0.12 + i * 0.06, 0.15, 0.035, "sine");
  },
  // дар музею: мягкий колокольчик и тёплый восходящий аккорд
  museum() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    [
      [784, 1],
      [2164, 0.35],
      [4233, 0.12]
    ].forEach(([f, a]) => sTone(c, f, t, 1.6 * (a > 0.5 ? 1 : 0.6), 0.2 * a, "sine"));
    [392, 494, 587, 784].forEach((f, i) => {
      const s = t + 0.18 + i * 0.11;
      sTone(c, f, s, 1.4, 0.11, "triangle");
      sTone(c, f * 2, s, 0.6, 0.03, "sine");
    });
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = "sine";
    o.frequency.value = 196;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0005, t + 2.2);
    o.connect(g).connect(sfxBus);
    o.start(t);
    o.stop(t + 2.3);
  },
  // касса: щелчок ящика, монеты и звонок «дзынь»
  cash() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    sNoise(c, t, 0.05, 0.35, "bandpass", 1200, 2, 0.002);
    sTone(c, 160, t, 0.06, 0.25, "square", 90);
    for (let i = 0; i < 5; i++) {
      const s = t + 0.06 + i * 0.035 + Math.random() * 0.02;
      sTone(c, 3200 + Math.random() * 1800, s, 0.08, 0.06, "sine");
    }
    const b = t + 0.22;
    sTone(c, 2093, b, 1.1, 0.16, "sine");
    sTone(c, 3136, b, 0.9, 0.09, "sine");
    sTone(c, 4186, b, 0.5, 0.04, "sine");
    sTone(c, 2637, b + 0.02, 0.8, 0.06, "sine");
  },
  // шаг: по траве мягко, зимой хруст снега, на болоте чавканье
  step(alt) {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime,
      w = T && T.season === "winter",
      sw = worldKind === "swamp";
    if (w) {
      sNoise(c, t, 0.09, 0.16, "highpass", 2200 + Math.random() * 800, 0.8, 0.004);
      sNoise(c, t + 0.03, 0.06, 0.1, "bandpass", 4000, 1.5);
    } else if (sw) {
      const f = sNoise(c, t, 0.14, 0.18, "lowpass", 500, 3, 0.01);
      f.frequency.linearRampToValueAtTime(1100, t + 0.12);
      sTone(c, 140, t, 0.1, 0.08, "sine", 70);
    } else {
      sTone(c, alt ? 95 : 110, t, 0.06, 0.14, "sine", 60);
      sNoise(c, t, 0.07, 0.09, "bandpass", 1400 + Math.random() * 600, 1, 0.004);
    }
  },
  // кнопка в гараже: короткий деревянный щелчок
  click() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    sTone(c, 340, t, 0.08, 0.72, "sine", 220);
    sTone(c, 680, t, 0.04, 0.18, "triangle", 440);
    sNoise(c, t, 0.03, 0.23, "lowpass", 1200, 0.7, 0.002);
  },
  // штык в землю, хруст, землю в сторону
  dig(fast) {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime,
      n = fast ? 2 : 3,
      gap = fast ? 0.13 : 0.17;
    for (let i = 0; i < n; i++) {
      const s = t + i * gap;
      sNoise(c, s, 0.09, 0.5, "bandpass", 420 + Math.random() * 160, 1.4, 0.004);
      sTone(c, 95, s, 0.08, 0.25, "sine", 55);
      sNoise(c, s + 0.05, 0.12, 0.18, "bandpass", 1800, 2.2);
    }
    sNoise(c, t + n * gap, 0.22, 0.22, "lowpass", 700, 0.7, 0.02);
  },
  // лопата звякнула о металл
  clink() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime + 0.05;
    sTone(c, 1760, t, 0.5, 0.16, "sine");
    sTone(c, 2640, t, 0.35, 0.08, "sine");
    sTone(c, 3950, t, 0.18, 0.05, "sine");
    sNoise(c, t, 0.03, 0.2, "highpass", 4000, 0.7);
  },
  // пустая яма
  thud() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime + 0.05;
    sTone(c, 80, t, 0.18, 0.3, "sine", 45);
    sNoise(c, t, 0.12, 0.12, "lowpass", 500, 0.7);
  },
  // шорох бумаги: страница, письмо, событие
  paper() {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    const f = sNoise(c, t, 0.28, 0.22, "bandpass", 2500, 0.8, 0.06);
    f.frequency.setValueAtTime(1800, t);
    f.frequency.linearRampToValueAtTime(4200, t + 0.25);
    sNoise(c, t + 0.1, 0.16, 0.1, "highpass", 5000, 0.7, 0.03);
  },
  // открывается сюжетный кадр: бумага и тихий аккорд
  story() {
    const c = sfxCtx();
    if (!c) return;
    SFX.paper();
    const t = c.currentTime + 0.08;
    [220, 261.6, 329.6, 440].forEach((f, i) => {
      const o = c.createOscillator(),
        g = c.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * 0.07);
      g.gain.linearRampToValueAtTime(0.07, t + i * 0.07 + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 2.2);
      o.connect(g).connect(sfxBus);
      o.start(t + i * 0.07);
      o.stop(t + 2.3);
    });
  },
  // чистка щёткой и результат
  clean(bad) {
    const c = sfxCtx();
    if (!c) return;
    const t = c.currentTime;
    for (let i = 0; i < 6; i++) {
      const s = t + i * 0.13;
      const f = sNoise(c, s, 0.11, 0.22, "bandpass", 3200 + (i % 2) * 900, 1.2, 0.03);
      f.frequency.linearRampToValueAtTime(i % 2 ? 2600 : 4400, s + 0.1);
    }
    const e = t + 0.85;
    if (bad) {
      sTone(c, 180, e, 0.35, 0.25, "sawtooth", 90);
      sNoise(c, e, 0.2, 0.15, "lowpass", 600);
    } else {
      sTone(c, 1046, e, 0.4, 0.12, "sine");
      sTone(c, 1568, e + 0.1, 0.6, 0.12, "sine");
      sTone(c, 2093, e + 0.2, 0.7, 0.06, "sine");
    }
  }
};
function setSfx(on) {
  sfxOn = on;
  if (!on && !soundOn && unlockEl) {
    try {
      unlockEl.pause();
    } catch (e) {}
  }
  try {
    localStorage.setItem("seryi-sfx", on ? "1" : "0");
  } catch (e) {}
  const b = $("sfxBtn");
  if (b) b.textContent = on ? "Звуки: вкл." : "Звуки: выкл.";
  if (on) SFX.click();
}
// щелчок на любой кнопке вне поля (гараж, окна, комикс)
addEventListener(
  "click",
  e => {
    const b = e.target.closest && e.target.closest("button,[role=button],.cm-frame");
    if (!b || b.disabled) return;
    if (b.closest("#hud")) return;
    if (b.id === "sfxBtn") return;
    if (/SK\.(sell|learn|buy\(|buyShop)/.test(b.getAttribute("onclick") || "")) return;
    if (b.closest("#comic") && !b.classList.contains("cm-skip")) return;
    SFX.click();
  },
  true
);
function blip(f, t0, len) {
  if (!actx) return;
  const o = actx.createOscillator(),
    g = actx.createGain();
  o.type = "square";
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime((0.11 * detVol) / 100, t0 + 0.01);
  g.gain.linearRampToValueAtTime(0, t0 + len);
  o.connect(g).connect(actx.destination);
  o.start(t0);
  o.stop(t0 + len + 0.02);
}
// на телефоне звук может «уснуть» — будим при каждом касании
addEventListener(
  "pointerdown",
  () => {
    if ((soundOn || sfxOn) && actx && actx.state !== "running") {
      try {
        actx.resume();
      } catch (e) {}
    }
    if (sfxOn && unlockEl && unlockEl.paused) {
      try {
        const pr = unlockEl.play();
        if (pr && pr.catch) pr.catch(() => {});
      } catch (e) {}
    }
  },
  true
);
$("snd").onclick = () => {
  audioUnlock();
  soundOn = !soundOn;
  syncDvol();
  const b = $("snd");
  b.classList.toggle("on", soundOn);
  b.setAttribute("aria-pressed", soundOn);
  $("sndTxt").textContent = soundOn ? "вкл." : "выкл.";
  setIcon($("sndIco"), soundOn ? "sndOn" : "sndOff");
  if (soundOn && actx) {
    const t = actx.currentTime + 0.05;
    blip(880, t, 0.08);
    blip(1320, t + 0.12, 0.1);
  } else if (unlockEl && !sfxOn) {
    try {
      unlockEl.pause();
    } catch (e) {}
  }
  toast(
    soundOn
      ? "Писк включён: над металлом детектор пищит, чем ближе — тем чаще и выше. Если не слышно — проверьте громкость."
      : "Писк выключен. Следите за шкалой внизу."
  );
};
function updateSound(sig) {
  if (!gain) return;
  const live = soundOn && screen === "field" && !paused && sig.s > 0.08;
  // как у настоящего детектора: прерывистый писк, чем сильнее сигнал — тем чаще и выше
  const f =
      DET[G.det].disc && sig.it
        ? sig.it.iron
          ? 260 + vdiOf(sig.it) * 5
          : 420 + vdiOf(sig.it) * 10
        : 620 + sig.s * 900,
    per = 0.55 - sig.s * 0.45,
    ph = (performance.now() / 1000) % per;
  const on = live && (sig.s > 0.85 || ph < per * 0.55);
  osc.frequency.setTargetAtTime(f, actx.currentTime, 0.02);
  gain.gain.setTargetAtTime(on ? ((0.056 + sig.s * 0.084) * detVol) / 100 : 0, actx.currentTime, 0.012);
}
