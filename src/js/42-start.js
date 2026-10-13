// ================= СТАРТ =================
if (G.trip && G.trip.hs) {
  T = G.trip;
  showBase();
  openHouse();
} else if (G.trip) {
  loadTrip(G.trip);
  showField();
} else showBase();
requestAnimationFrame(frame);
window.__gameOk = 1;
{
  const b = document.getElementById("boot");
  if (b) b.remove();
}
