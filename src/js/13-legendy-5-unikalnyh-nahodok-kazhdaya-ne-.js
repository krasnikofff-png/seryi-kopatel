// ===== ЛЕГЕНДЫ: 5 уникальных находок, каждая — не больше раза за игру =====
const LEGENDS = {
  capsule: {
    name: "Капсула времени 1967 года",
    short: "Капсула",
    c: 1,
    era: 0,
    w: 0.6,
    iron: 0,
    price: 3000,
    hint: "Где-то в пригороде лежит письмо, адресованное нам.",
    desc: "Латунный тубус с крышкой на резьбе. Комсомольцы зарыли его «до 2017 года» — и про него все забыли.",
    letter:
      "«Дорогие товарищи из 2017 года! Пишут вам комсомольцы совхоза „Заря“. У вас, наверное, на Марс летают по расписанию, а коммунизм давно построен. Не забывайте нас — это мы посадили тополя вдоль дороги. 7 ноября 1967 г.»"
  },
  star: {
    name: "Звезда Героя Советского Союза",
    short: "Звезда Героя",
    c: 4,
    era: 1,
    w: 0.03,
    iron: 0,
    price: 200000,
    hint: "В лесу помнят лётчика, который не вернулся.",
    desc: "Золотая звёздочка на колодке. По номеру на обороте Серый нашёл фамилию: старший лейтенант Ковалёв, сбит над этим лесом осенью 1942-го."
  },
  box: {
    name: "Шкатулка барыни Оболенской",
    short: "Шкатулка",
    c: 4,
    era: 2,
    w: 0.8,
    iron: 1,
    price: 300000,
    hint: "Барыня уезжала в спешке и обещала вернуться весной.",
    desc: "Жестяная шкатулка в промасленной коже. Внутри фамильные серьги, золотой крест с гранатами и записка: «Зарыто 3 ноября 1918 г. Вернёмся весной»."
  },
  ruble: {
    name: "Сестрорецкий рубль 1771 года",
    short: "Сестрорецкий рубль",
    c: 2,
    era: 3,
    w: 1,
    iron: 0,
    price: 500000,
    hint: "Самая тяжёлая монета империи — почти килограмм меди.",
    desc: "Медная монета-шайба размером с блюдце, почти килограмм весом. Нумизматическая легенда: таких в мире единицы."
  },
  helm: {
    name: "Княжеский шлем с серебряной насечкой",
    short: "Княжеский шлем",
    c: 4,
    era: 3,
    w: 1.5,
    iron: 1,
    price: 0,
    prize: 150000,
    hint: "Болото хранит то, что потерял князь.",
    desc: "Остроконечный шлем XIII века. На налобнике серебряная пластина с архангелом. Похожий в 1808 году нашла крестьянка в кусте орешника."
  }
};
const legFree = id => !(G.leg && G.leg[id]) && !G.inv.some(i => i.leg === id);
const legItem = id => {
  const L = LEGENDS[id];
  return { c: L.c, era: L.era, name: L.name, iron: !!L.iron, w: L.w, base: L.price || 0, leg: id };
};
function putLeg(t, used, id, depth) {
  for (let a = 0; a < 300; a++) {
    let x, y;
    if (t.real && a < 200) {
      const an = R() * Math.PI * 2,
        rr = Math.sqrt(R()) * t.real.r * 0.9;
      x = t.real.x + Math.cos(an) * rr;
      y = t.real.y + Math.sin(an) * rr;
    } else {
      x = 24 + R() * (WW - 48);
      y = 96 + R() * (WH - 120);
    }
    const tx = Math.floor(x / TS),
      ty = Math.floor(y / TS);
    if (used.has(tx + "," + ty) || !diggable(tx, ty)) continue;
    used.add(tx + "," + ty);
    t.items.push(
      Object.assign(
        {
          tx,
          ty,
          x: tx * TS + 4 + R() * 8,
          y: ty * TS + 4 + R() * 8,
          depth: Math.round(depth),
          found: false
        },
        legItem(id)
      )
    );
    return;
  }
}
function placeLegends(t, used) {
  if (worldKind === "plough" && legFree("capsule") && R() < 0.08) putLeg(t, used, "capsule", 14 + R() * 10);
  if (worldKind === "forest" && G.det >= 4 && legFree("star") && R() < 0.1)
    putLeg(t, used, "star", 40 + R() * 10);
  if (worldKind === "manor" && (G.manorN || 0) >= 2 && legFree("box") && R() < 0.3)
    putLeg(t, used, "box", 62 + R() * 12);
  if (worldKind === "swamp" && legFree("helm") && R() < 0.15) putLeg(t, used, "helm", 101 + R() * 10);
  if (legFree("ruble"))
    for (const i of t.items)
      if (i.c === 2 && i.era === 3 && !i.leg && !i.story && R() < 0.003) {
        Object.assign(i, legItem("ruble"));
        break;
      }
}
