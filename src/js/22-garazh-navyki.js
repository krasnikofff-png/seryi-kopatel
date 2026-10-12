// ================= ГАРАЖ: НАВЫКИ =================
const skillPicCache = {};
function skillPic(id) {
  // пиксельные иконки навыков, 24×24
  if (skillPicCache[id]) return skillPicCache[id];
  const c = document.createElement("canvas");
  c.width = c.height = 24;
  const g = c.getContext("2d"),
    R = (x, y, w, h, col) => {
      g.fillStyle = col;
      g.fillRect(x, y, w, h);
    };
  if (id === "torg") {
    const coin = (x, y) => {
      disc(g, x, y + 1, 5, 2, "#7a5418");
      disc(g, x, y, 5, 2, "#b8892a");
      disc(g, x, y - 1, 5, 2, "#e9c54a");
      R(x - 3, y - 2, 3, 1, "#fff0a8");
    };
    for (let i = 0; i < 5; i++) coin(8, 20 - i * 3);
    for (let i = 0; i < 3; i++) coin(16, 21 - i * 3);
    coin(19, 22);
  } else if (id === "karto") {
    R(2, 5, 20, 15, "#6b5636");
    R(3, 6, 18, 13, "#e6d3a2");
    R(9, 6, 1, 13, "#c4ae7c");
    R(15, 6, 1, 13, "#c4ae7c");
    disc(g, 6, 10, 2, 2, "#7fa34a");
    disc(g, 12, 15, 3, 2, "#7fa34a");
    disc(g, 18, 15, 2, 1, "#7fa34a");
    [
      [5, 15],
      [7, 14],
      [9, 13],
      [11, 12],
      [13, 11],
      [15, 10]
    ].forEach(([x, y]) => R(x, y, 1, 1, "#c4553a"));
    [
      [16, 7],
      [18, 9],
      [17, 8],
      [16, 9],
      [18, 7]
    ].forEach(([x, y]) => R(x, y, 1, 1, "#c42a1a"));
    R(16, 7, 1, 1, "#c42a1a");
  } else if (id === "master") {
    for (let i = 0; i < 9; i++) R(18 - i, 3 + i, 2, 2, i < 2 ? "#5e3a1e" : "#8a5a32");
    R(8, 12, 3, 3, "#b8b8b0");
    R(9, 12, 1, 1, "#e8e8e0");
    for (let y = 0; y < 6; y++)
      R(3 + Math.max(0, 3 - y), 15 + y, 6 - Math.abs(3 - y) + 2, 1, y % 2 ? "#d9b04a" : "#e9c54a");
    [
      [18, 15],
      [17, 16],
      [19, 16],
      [18, 17],
      [18, 16]
    ].forEach(([x, y]) => R(x, y, 1, 1, "#fff3b0"));
    R(21, 11, 1, 1, "#fff3b0");
    R(14, 19, 1, 1, "#fff3b0");
  } else {
    R(0, 9, 6, 7, "#5d7d38");
    R(0, 9, 6, 1, "#7f9c40");
    R(18, 8, 6, 7, "#4a6a9e");
    R(18, 8, 6, 1, "#6a8ac0");
    R(6, 10, 7, 5, "#e2b48a");
    R(11, 8, 7, 5, "#c98e66");
    R(10, 12, 6, 3, "#e2b48a");
    [
      [12, 11],
      [14, 11],
      [16, 11]
    ].forEach(([x, y]) => R(x, y, 1, 3, "#a8704a"));
    R(6, 10, 7, 1, "#f0c8a0");
  }
  return (skillPicCache[id] = c.toDataURL());
}
const plural = (n, a, b, c) => {
  const m = n % 10,
    h = n % 100;
  return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c;
};
const pct = n => (n > 0 ? "+" : "") + n + "%";
function kartoPic(lv) {
  // кольцо с карты «Слух»: радиус и сдвиг до и после
  const sh = l => 9 * (1 - l * 0.07),
    of = l => 4.5 * (1 - l * 0.09),
    K = 4.2; // схема: разница между уровнями нарочно заметнее, точные числа — под картинкой
  const panel = (x0, l, label, g) => {
    const cx = x0 + 75,
      cy = 50,
      ox = of(l) * K,
      gx = g != null ? of(g) * K : 0;
    return `<g>
    <rect x="${x0}" y="0" width="150" height="100" rx="6" fill="#2b3520"/>
    <path d="M${x0 + 108} 0 C${x0 + 96} 30 ${x0 + 128} 55 ${x0 + 112} 100" stroke="#3d5866" stroke-width="7" fill="none"/>
    ${[
      [14, 18],
      [30, 80],
      [128, 22],
      [136, 74],
      [20, 52],
      [60, 12],
      [95, 88]
    ]
      .map(([x, y]) => `<path d="M${x0 + x} ${y - 6}l5 9h-10z" fill="#3c4a2a"/>`)
      .join("")}
    ${g != null ? `<circle cx="${cx + gx}" cy="${cy - gx * 0.6}" r="${sh(g) * K}" fill="none" stroke="#9a8a6a" stroke-width="1.5" stroke-dasharray="3 4" opacity=".7"/>` : ""}
    <circle cx="${cx + ox}" cy="${cy - ox * 0.6}" r="${sh(l) * K}" fill="rgba(233,197,74,.08)" stroke="#e9c54a" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M${cx - 5} ${cy - 5}l10 10M${cx + 5} ${cy - 5}l-10 10" stroke="#f4ead0" stroke-width="2.5" stroke-linecap="round"/>
    <text x="${cx}" y="94" text-anchor="middle" font-size="12" font-weight="700" fill="#f4ead0" style="paint-order:stroke" stroke="#1d1710" stroke-width="3">${label}</text></g>`;
  };
  return `<svg class="karto" viewBox="0 0 340 100" role="img" aria-label="Кольцо на карте до и после улучшения">${panel(0, lv, "Сейчас")}<text x="170" y="56" text-anchor="middle" font-size="22" fill="#e9c54a">→</text>${panel(190, Math.min(SKMAX, lv + 1), lv >= SKMAX ? "Максимум" : "После", lv >= SKMAX ? null : lv)}</svg>`;
}
function renderSkills() {
  const need = xpNeed(G.lvl),
    R0 = rank(),
    up = RANKS.filter(r => r.min > G.rep).slice(-1)[0];
  const spBox =
    G.sp > 0
      ? `<div class="sp-box on"><span class="sp-num">${G.sp}</span><span>${plural(G.sp, "свободное очко", "свободных очка", "свободных очков")} навыка — вложите в навык ниже ↓</span></div>`
      : `<div class="sp-box">Очков навыка нет — следующее на ${G.lvl + 1}-м уровне</div>`;
  const lvl = `<section class="lvbox"><div class="lv-h"><h2>Уровень ${G.lvl}</h2><span>${G.xp} / ${need} опыта</span></div>
    <div class="lv-bar"><i style="width:${Math.min(100, Math.round((G.xp / need) * 100))}%"></i></div>${spBox}
    <p>Опыт дают найденные вещи: чем ценнее, тем больше.${G.lvl < ANT_LVL ? ` На ${ANT_LVL}-м уровне откроется антиквар.` : ""}</p></section>`;
  const eff = {
    torg: l => [["Цена продажи", pct(l * 2)]],
    master: l => [
      ["Риск испортить", 35 - l * 3 + "%"],
      ["Бонус к состоянию", pct(l * 2)]
    ],
    svyazi: l => [["Взятки и облавы", l ? "−" + l * 8 + "%" : "0%"]]
  };
  const note = {
    torg: "При любой продаже.",
    karto: "Кольцо купленной карты ближе к хутору и уже.",
    master: "Когда чистите находки сами.",
    svyazi: "Дешевле договориться на посту ДПС, реже облавы на чёрном рынке."
  };
  const cards = SKILLS.map(S => {
    const l = sk(S.id),
      max = l >= SKMAX;
    const boxes = [...Array(SKMAX).keys()].map(i => `<i class="${i < l ? "on" : ""}"></i>`).join("");
    let body;
    if (S.id === "karto")
      body = `<p class="sk-d">Точнее обозначает область поиска.</p>${kartoPic(l)}<p class="sk-n">${l >= SKMAX ? `Кольцо: ${String(+(11 - l * 0.25).toFixed(2)).replace(".", ",")} клетки, сдвиг ${String(+(3 * (1 - l * 0.08)).toFixed(2)).replace(".", ",")} — точнее не бывает (для карты «Слух»).` : `Кольцо: ${String(+(11 - l * 0.25).toFixed(2)).replace(".", ",")} → ${String(+(11 - Math.min(SKMAX, l + 1) * 0.25).toFixed(2)).replace(".", ",")} клетки, сдвиг ${String(+(3 * (1 - l * 0.08)).toFixed(2)).replace(".", ",")} → ${String(+(3 * (1 - Math.min(SKMAX, l + 1) * 0.08)).toFixed(2)).replace(".", ",")} (для карты «Слух»).`}</p>`;
    else
      body =
        eff[S.id](l)
          .map(
            ([n, v], k) =>
              `<p class="sk-e"><span>${n}</span><b>${v}</b>${max ? "" : `<em>→</em><b class="up">${eff[S.id](l + 1)[k][1]}</b>`}</p>`
          )
          .join("") + `<p class="sk-n">${note[S.id]}</p>`;
    const btn = max
      ? `<button class="buy" disabled>Максимум</button>`
      : G.sp < 1
        ? `<button class="buy" disabled>Нужно очко навыка</button>`
        : `<button class="buy" onclick="SK.learn('${S.id}')">Улучшить · 1 очко</button>`;
    return `<section class="skc"><div class="sk-top"><img src="${skillPic(S.id)}" alt=""><div class="sk-hd"><h3>${S.name}</h3><span class="sk-lv">${l}/${SKMAX}<span class="boxes">${boxes}</span></span></div></div>${body}${btn}</section>`;
  }).join("");
  const rankBox = `<section class="rkbox"><div class="rk-top"><div><small>Звание</small><h3>${R0.name}</h3></div><span class="rk-chip">Совесть ${G.rep > 0 ? "+" : ""}${G.rep}</span></div>
    <p class="rk-p">${R0.perk[0].toUpperCase() + R0.perk.slice(1)}.</p><p class="rk-p">${up ? `До «${up.name}» — ${up.min - G.rep} ${plural(up.min - G.rep, "очко", "очка", "очков")} совести.` : "Это высшее звание."}</p>
    <details><summary>Все звания</summary><ul class="rk-list">${RANKS.map(r => `<li class="${r === R0 ? "cur" : ""}"><span>${r.range}</span><b>${r.name}</b><small>${r.perk}</small></li>`).join("")}</ul></details>
    <details><summary>Как меняется совесть? <span class="q">?</span></summary><div class="rk-how"><p>Дар музею: +1 за бытовое и монеты, +2 за военное из слоя империи и старины и за редкое, +3 за редкое из старины.</p><p>Чёрный рынок: −1 совести за любую вещь, плюс растёт внимание полиции.</p><p>Скупщик и антиквар совесть не меняют.</p></div></details></section>`;
  return lvl + `<div class="sk-title"><h2>Навыки</h2><span></span></div>` + cards + rankBox;
}
