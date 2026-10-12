// ================= ОБЛАВА: ОКНО С ПРОТОКОЛОМ
let raidInfo = null;
let COP_IMG = null;
function copPic() {
  if (COP_IMG) return COP_IMG;
  const W = 48,
    H = 46,
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  const R = (col, a, b, w, h) => {
    x.fillStyle = col;
    x.fillRect(a, b, w, h);
  };
  const E = (col, cx, cy, rx, ry) => {
    x.fillStyle = col;
    for (let j = -ry; j <= ry; j++)
      for (let i = -rx; i <= rx; i++)
        if ((i * i) / (rx * rx + 0.5) + (j * j) / (ry * ry + 0.5) <= 1) x.fillRect(cx + i, cy + j, 1, 1);
  };
  // плечи и китель
  E("#2b3546", 24, 46, 23, 11);
  E("#3d4a5e", 24, 46, 22, 10);
  R("#4c5b72", 6, 40, 8, 2);
  R("#4c5b72", 34, 40, 8, 2);
  R("#283141", 4, 38, 11, 3);
  R("#283141", 33, 38, 11, 3); // погоны
  R("#d9b84a", 8, 39, 1, 1);
  R("#d9b84a", 11, 39, 1, 1);
  R("#d9b84a", 36, 39, 1, 1);
  R("#d9b84a", 39, 39, 1, 1);
  R("#a9bed3", 19, 36, 10, 4);
  R("#8ea4bb", 19, 39, 10, 1); // рубашка
  R("#2a3140", 23, 37, 2, 9);
  R("#1d2330", 23, 37, 2, 1); // галстук
  R("#3d4a5e", 16, 37, 4, 9);
  R("#3d4a5e", 28, 37, 4, 9); // лацканы
  R("#2b3546", 19, 42, 1, 4);
  R("#2b3546", 28, 42, 1, 4);
  R("#d9b84a", 15, 42, 2, 2); // значок
  // шея
  R("#b97b55", 20, 30, 8, 7);
  R("#a86b48", 20, 34, 8, 2);
  // голова
  E("#a86b48", 14, 23, 2, 3);
  E("#a86b48", 34, 23, 2, 3); // уши
  E("#e0a77a", 24, 22, 10, 11);
  for (let j = 12; j < 34; j++)
    for (let i = 27; i < 35; i++) {
      const d = ((i - 24) * (i - 24)) / 110 + ((j - 22) * (j - 22)) / 132;
      if (d <= 1 && d > 0.55) R("#c98b62", i, j, 1, 1);
    }
  R("#c98b62", 15, 28, 18, 1);
  // фуражка
  E("#2f3b52", 24, 9, 14, 5);
  R("#2f3b52", 10, 9, 28, 5);
  E("#3c4a66", 23, 7, 11, 3);
  R("#a8322a", 11, 12, 26, 3);
  R("#7d231d", 11, 14, 26, 1); // красный околыш
  R("#d9b84a", 22, 7, 4, 4);
  R("#f2d36a", 23, 8, 2, 2); // кокарда
  R("#15181f", 12, 15, 24, 2);
  R("#2a2f3a", 14, 15, 20, 1); // козырёк
  R("#000000", 12, 17, 24, 1);
  x.globalAlpha = 0.25;
  R("#000", 13, 17, 22, 2);
  x.globalAlpha = 1;
  // брови и глаза
  R("#4a3324", 17, 19, 6, 2);
  R("#4a3324", 26, 19, 6, 2);
  R("#4a3324", 21, 20, 2, 1);
  R("#4a3324", 26, 20, 2, 1);
  R("#f4efe0", 18, 21, 4, 2);
  R("#f4efe0", 27, 21, 4, 2);
  R("#2a1d14", 20, 21, 2, 2);
  R("#2a1d14", 29, 21, 2, 2);
  // нос, щёки, усы, рот
  R("#c98b62", 24, 22, 2, 5);
  R("#b97b55", 23, 26, 4, 1);
  R("#e88f7a", 16, 25, 3, 2);
  R("#e88f7a", 30, 25, 3, 2);
  R("#4a3324", 19, 28, 12, 2);
  R("#4a3324", 18, 29, 2, 1);
  R("#4a3324", 30, 29, 2, 1);
  R("#3a2618", 21, 28, 8, 1);
  R("#8a4a3a", 22, 31, 6, 1);
  R("#c98b62", 22, 33, 6, 1);
  return (COP_IMG = c.toDataURL());
}
const COP_LINES = [
  "Гражданин, пройдёмте.",
  "Документы на находку есть? Нет? Распишитесь.",
  "Чёрный рынок, значит? Изымаем.",
  "Откуда монетка? В огороде нашли, говорите? Ну-ну.",
  "Это у нас называется «незаконный оборот». Подписывайте.",
  "Третий копатель за неделю. Вы что, сговорились?",
  "Вещь — в вещдоки, вы — в протокол. Всё по закону.",
  "Не дёргайтесь, гражданин. Тут расписаться, тут — дату.",
  "Давай автограф. А эту штучку я изымаю.",
  "Протокол в трёх экземплярах. Пишите разборчиво."
];
function showRaid() {
  const r = raidInfo;
  if (!r) return;
  const it = r.it,
    el = $("raid");
  const d = new Date(),
    dt =
      String(d.getDate()).padStart(2, "0") +
      "." +
      String(d.getMonth() + 1).padStart(2, "0") +
      "." +
      d.getFullYear();
  const line = COP_LINES[Math.floor(Math.random() * COP_LINES.length)];
  const ticks = [1.9, 1.8, 1.7, 1.6, 1.5].map(v => `<span>${v.toFixed(1)}</span>`).join("");
  el.innerHTML = `<div class="rd" role="dialog" aria-label="Облава">
    <div class="rd-scene">
      <div class="rd-ruler">${ticks}</div>
      <img class="rd-cop" src="${copPic()}" alt="Полицейский">
      <div class="rd-say">${line}</div>
      <div class="rd-counter"><i></i><i></i><i></i></div>
    </div>
    <div class="rd-desk">
      <div class="rd-paper">
        <div class="rd-head"><small>Отдел полиции</small><h3>Протокол изъятия</h3><small>№ ${r.no} · ${dt}</small></div>
        <div class="rd-tag"><b>Вещдок</b><img src="${findPic(it)}" alt=""><span>№ ${r.no}</span></div>
        <dl class="rd-f">
          <dt>Гражданин</dt><dd>Копатель</dd>
          <dt>Изъято</dt><dd>${it.name}</dd>
          <dt>Оценка</dt><dd>${rub(r.price)}</dd>
          <dt>Основание</dt><dd>сбыт на чёрном рынке</dd>
          <dt>Штраф</dt><dd class="red">${rub(r.fine)}</dd>
          <dt>Внимание</dt><dd>повышено на 1</dd>
        </dl>
        <div class="rd-sign"><span>Подпись</span><svg viewBox="0 0 120 30" aria-hidden="true"><path d="M4 20c8-14 12-14 10 0s10-16 16-10-2 14 6 8 10-12 14-6 0 10 8 6 8-10 14-8 4 8 10 6 10-6 18-4"/></svg></div>
        <div class="rd-stamp">Изъято</div>
      </div>
    </div>
    <div class="rd-foot"><p>−${rub(r.fine)} · вещь изъята · внимание полиции +1</p><button class="rd-btn" onclick="SK.signRaid()">Подписать</button></div>
  </div>`;
  el.hidden = false;
}
function signRaid() {
  const el = $("raid"),
    rd = el.querySelector(".rd");
  if (!rd || rd.classList.contains("signed")) {
    return;
  }
  rd.classList.add("signed");
  const dk = rd.querySelector(".rd-desk");
  if (dk) dk.scrollTo({ top: dk.scrollHeight, behavior: "smooth" });
  try {
    if (soundOn && actx) {
      const t = actx.currentTime + 0.02;
      blip(330, t, 0.06);
      blip(220, t + 0.5, 0.12);
    }
  } catch (e) {}
  setTimeout(() => {
    el.hidden = true;
    el.innerHTML = "";
    raidInfo = null;
  }, 1400);
}
