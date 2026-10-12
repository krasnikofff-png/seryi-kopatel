// Снимок всех кадров комикса (dataURL) — для проверки, что кадры не изменились: node tests/panels.js game.html out.json
const {chromium}=require('/home/claude/node_modules/playwright');const fs=require('fs');const [,,GAME,OUT]=process.argv;
const page='/tmp/claude-0/-home-claude/dd913fc0-e3b9-5ed3-baf8-756070468c49/scratchpad/pn_page.html';
let h=fs.readFileSync(GAME,'utf8').replace('let comicQ = null;','window.__P=()=>{const o={};for(const k in PANELS)o[k]=panelPic(k);return o};let comicQ = null;');
fs.writeFileSync(page,h);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+page);await p.waitForTimeout(500);const r=await p.evaluate(()=>__P());fs.writeFileSync(OUT,JSON.stringify(r));console.log('кадров',Object.keys(r).length,'ошибок',errs.length,errs[0]||'');await b.close()})();
