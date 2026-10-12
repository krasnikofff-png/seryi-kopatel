// ================= ИГРОК =================
// копатель как на референсе: оливковая кепка, тёмные волосы, зелёная куртка, светлая рубашка, коричневый рюкзак, джинсы, ботинки; чёрный контур дорисовывается автоматически
const PAL = {
  c: "#76853f",
  C: "#525e2a",
  h: "#3b2a1f",
  s: "#eab58c",
  S: "#c98e66",
  e: "#1e1a16",
  j: "#5d7d38",
  J: "#44602a",
  w: "#efe2c1",
  b: "#8e5e33",
  B: "#664020",
  n: "#4b6c9e",
  N: "#38557f",
  o: "#71472a",
  O: "#4b2e19"
};
const BODY = {
  down: [
    "...cccc...",
    "..cccccc..",
    ".CCCCCCCC.",
    "..hsssshh.",
    "..sesses..",
    "...sSSs...",
    ".jbwwwwbj.",
    "jJbwwwwbJj",
    "jJjjwwjjJj",
    "sJjjjjjjJs",
    ".jjjjjjjj.",
    "..nnnnnn.."
  ],
  up: [
    "...cccc...",
    "..cccccc..",
    "..cccccc..",
    "..hhhhhh..",
    "..hhhhhh..",
    "...hsSh...",
    ".jbbbbbbj.",
    "jJbBBBBbJj",
    "jJbbbbbbJj",
    "sJbBBBBbJs",
    ".jbbbbbbj.",
    "..nnnnnn.."
  ],
  side: [
    "..cccc....",
    ".cccccc...",
    ".ccccCCCC.",
    "..hhsss...",
    "..hhsse...",
    "..hhsSs...",
    ".bbjjwj...",
    "bBbjjwjss.",
    "bBbjjjj...",
    "bBbjjjj...",
    ".bbjjjj...",
    "...nnnn..."
  ]
};
const LEGS = {
  front: [
    ["..nn..nn..", "..nN..Nn..", "..oo..oo..", "..OO..OO.."],
    ["..nn..nn..", "..oo..nN..", "..OO..oo..", "......OO.."],
    ["..nn..nn..", "..Nn..oo..", "..oo..OO..", "..OO......"]
  ],
  side: [
    ["...nnNn...", "...nnNn...", "...oooo...", "...OOooo.."],
    ["..nnN.nn..", "..nN...nN.", "..oo...oo.", "..OO...OO."],
    ["...nnNn...", "...nnNn...", "...oooo...", "...OOooo.."]
  ]
};
const P = { x: 0, y: 0, dir: "up", walk: 0, moving: false };
const sprCache = {};
function playerSprite(key, fr, flip) {
  const id = key + fr + flip;
  if (sprCache[id]) return sprCache[id];
  const rows = BODY[key].concat(
    LEGS[key === "side" ? "side" : "front"][key === "side" ? (fr === 2 ? 0 : fr) : fr]
  );
  const c = document.createElement("canvas");
  c.width = 12;
  c.height = 18;
  const g = c.getContext("2d");
  const at = (i, j) => j >= 0 && j < 16 && i >= 0 && i < 10 && rows[j][flip ? 9 - i : i] !== ".";
  g.fillStyle = "#17120d";
  for (let j = -1; j <= 16; j++)
    for (let i = -1; i <= 10; i++)
      if (!at(i, j) && (at(i - 1, j) || at(i + 1, j) || at(i, j - 1) || at(i, j + 1)))
        g.fillRect(i + 1, j + 1, 1, 1);
  for (let j = 0; j < 16; j++)
    for (let i = 0; i < 10; i++)
      if (at(i, j)) {
        g.fillStyle = PAL[rows[j][flip ? 9 - i : i]];
        g.fillRect(i + 1, j + 1, 1, 1);
      }
  return (sprCache[id] = c);
}
function drawPlayer(x, y) {
  const flip = P.dir === "left",
    key = P.dir === "down" ? "down" : P.dir === "up" ? "up" : "side";
  const fr = P.moving ? [0, 1, 0, 2][((Math.floor(P.walk * 8) % 4) + 4) % 4] : 0;
  const ox = Math.round(x) - 5,
    oy = Math.round(y) - 16 - (P.moving && fr !== 0 ? 1 : 0);
  disc(ctx, x, y + 1, 5, 1, "rgba(20,30,10,.35)");
  ctx.drawImage(playerSprite(key, fr, flip), ox - 1, oy - 1);
}
const FACE = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
