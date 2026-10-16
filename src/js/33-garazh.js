// ================= ГАРАЖ =================
let tab = "maps",
  gearTab = "shovel";
function showBase() {
  screen = "base";
  paused = true;
  $("base").hidden = false;
  $("hud").hidden = true;
  $("touch").hidden = true;
  cv.hidden = true;
  if (gain) gain.gain.setTargetAtTime(0, actx.currentTime, 0.02);
  if (!G.inv.length && tab === "sell" && G.trips === 0) tab = "maps";
  renderBase();
  $("base").scrollTop = 0;
  if (!G.story || typeof G.story !== "object") G.story = { st: 0, clues: [] };
  if (G.debt == null) {
    G.debt = DEBT0;
    G.debtTrip = G.trips || 0;
    G.debtPaid = 0;
    G.debtV = 3;
  }
  if (!G.debtV) {
    if (G.debt > 0) G.debt += 50000;
    G.debtV = 2;
  }
  if (G.debtV === 2) {
    if (G.debt > 0) G.debt = Math.max(0, G.debt - 50000);
    G.debtV = 3;
  }
  if (!G.own) G.own = {};
  if (!G.skv6 && G.skills) {
    // навыки стали шестиуровневыми: прежние уровни 0…10 → 0…6
    for (const k in G.skills) G.skills[k] = Math.min(SKMAX, Math.round(G.skills[k] * 0.6));
    G.skv6 = 1;
  }
  if (!G.vit) G.vit = [];
  if (!G.wx) rollWx();
  if (!G.antWant) rollAnt();
  if (G.antLeft == null) G.antLeft = ANT_LIMIT;
  if (!G.antDue) G.antDue = 0;
  if (G.story.st === 0 && !comicQ) setTimeout(storyPrologue, 250);
}
function showField() {
  screen = "field";
  $("base").hidden = true;
  $("hud").hidden = false;
  $("touch").hidden = false;
  cv.hidden = false;
  if (!G.seenIntro) {
    paused = true;
    $("intro").hidden = false;
  } else showEvent();
  requestAnimationFrame(measureHud);
}
document.querySelectorAll("#tabs button").forEach(
  b =>
    (b.onclick = () => {
      tab = b.dataset.tab;
      renderBase();
    })
);
function msg(t, bad) {
  G.msg = t;
  G.msgBad = !!bad;
}
function reveal(it, self, rm, careful) {
  const note = it.leg ? "" : rollGrade(it, self, rm, careful);
  it.clean = true;
  it._new = { was: dirtyName(it), note, self: !!self, anim: 1 };
}
