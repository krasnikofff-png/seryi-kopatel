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
let skTab = "sk";
// ближайшая награда пути — видна в карточке уровня, ведёт на вкладку «Путь копателя»
function nextReward() {
  const nx = TRACK.find(t => t.l > G.lvl);
  if (!nx) return `<p class="lv-next-t">Весь путь копателя пройден.</p>`;
  return `<button class="lv-next" onclick="SK.skTab('tr')"><span class="lv-next-l">${nx.l}</span><span class="lv-next-b"><small>Следующая награда</small><b>${nx.n}</b></span><em aria-hidden="true">${pxi("arrow", 16)}</em></button>`;
}
function renderSkills() {
  const need = xpNeed(G.lvl),
    R0 = rank(),
    up = RANKS.filter(r => r.min > G.rep).slice(-1)[0];
  const spBox =
    G.sp > 0
      ? `<div class="sp-box on"><span class="sp-num">${G.sp}</span><span>${plural(G.sp, "свободное очко", "свободных очка", "свободных очков")}${skTab === "sk" ? ": нажмите «+1» у навыка" : ""}</span>${skTab === "sk" ? "" : `<button class="sp-go" onclick="SK.skTab('sk')">Вложить</button>`}</div>`
      : `<div class="sp-box">Очков навыка нет — следующее на ${G.lvl + 1}-м уровне</div>`;
  const lvl = `<section class="lvbox"><div class="lv-h"><h2>Уровень ${G.lvl}</h2><span>${G.xp} из ${need} опыта</span></div>
    <div class="lv-bar"><i style="width:${Math.min(100, Math.round((G.xp / need) * 100))}%"></i></div>${spBox}
    <p>Опыт дают найденные вещи: чем ценнее, тем больше.</p>${nextReward()}</section>`;
  const pc = v => `+${String(Math.round(v * 10) / 10).replace(".", ",")}%`,
    fx = (id, l) => {
      const e = (l * 10) / SKMAX; // сила навыка на уровне l
      return {
        torg: ["Цена продажи", pc(e * 2)],
        karto: ["Кольцо карты", `${String(+(11 - e * 0.25).toFixed(1)).replace(".", ",")} кл.`],
        master: ["Риск испортить", `${Math.round(35 - e * 3)}%`],
        svyazi: ["Взятки и облавы", e ? `−${Math.round(e * 8)}%` : "0%"]
      }[id];
    };
  const note = {
    torg: "При любой продаже.",
    karto: "Кольцо купленной карты ближе к хутору и уже.",
    master: "Когда чистите находки сами.",
    svyazi: "Дешевле договориться на посту ДПС, реже облавы на чёрном рынке."
  };
  const cards = SKILLS.map(S => {
    const l = skl(S.id),
      max = l >= SKMAX,
      [n, v] = fx(S.id, l),
      boxes = [...Array(SKMAX).keys()].map(i => `<i class="${i < l ? "on" : ""}"></i>`).join("");
    const btn = max
      ? `<span class="sk-max">${pxi("check", 18)}</span>`
      : `<button class="sk-plus" ${G.sp < 1 ? "disabled" : ""} onclick="SK.learn('${S.id}')" aria-label="Улучшить: ${S.name}">+1</button>`;
    return `<section class="skc"><div class="sk-top"><span class="sk-ic"><img src="${skillPic(S.id)}" alt=""></span><div class="sk-hd"><span class="sk-row"><h3>${S.name}</h3><span class="sk-lv">${l} из ${SKMAX}</span></span><span class="boxes" aria-hidden="true">${boxes}</span><p class="sk-e">${n} <b>${v}</b>${max ? "" : ` → <b class="up">${fx(S.id, l + 1)[1]}</b>`}</p></div>${btn}</div><p class="sk-n">${note[S.id]}</p></section>`;
  }).join("");
  const rankBox = `<section class="rkbox"><div class="rk-top"><div><small>Звание</small><h3>${R0.name}</h3></div><span class="rk-chip">${pxi("heart", 16)}${G.rep > 0 ? "+" : ""}${G.rep}</span></div>
    <p class="rk-p">${R0.perk[0].toUpperCase() + R0.perk.slice(1)}.</p><p class="rk-p">${up ? `До «${up.name}» — ${up.min - G.rep} ${plural(up.min - G.rep, "очко", "очка", "очков")} совести.` : "Это высшее звание."}</p>
    <details><summary>Все звания</summary><ul class="rk-list">${RANKS.map(r => `<li class="${r === R0 ? "cur" : ""}"><span>${r.range}</span><b>${r.name}</b><small>${r.perk}</small></li>`).join("")}</ul></details>
    <details><summary>Как меняется совесть? <span class="q">?</span></summary><div class="rk-how"><p>Дар музею: +1 за бытовое и монеты, +2 за военное из слоя империи и старины и за редкое, +3 за редкое из старины.</p><p>Чёрный рынок: −1 совести за любую вещь, плюс растёт внимание полиции.</p><p>Скупщик и антиквар совесть не меняют.</p></div></details></section>`;
  const done = TRACK.filter(t => G.lvl >= t.l).length;
  const tabs = `<div class="subtabs sk-tabs" role="tablist"><button role="tab" aria-selected="${skTab === "sk"}" onclick="SK.skTab('sk')">Навыки${G.sp > 0 ? `<i class="sk-badge">${G.sp}</i>` : ""}</button><button role="tab" aria-selected="${skTab === "tr"}" onclick="SK.skTab('tr')">Путь копателя<i class="sk-cnt">${done} из ${TRACK.length}</i></button></div>`;
  return lvl + tabs + (skTab === "tr" ? trackBox() : cards + rankBox);
}
