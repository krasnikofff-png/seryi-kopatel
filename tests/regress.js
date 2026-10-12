// Регрессия: одинаковый случай (seed) + замороженное время → скриншоты и состояние.
// node tests/regress.js <game.html> <outdir>
const {chromium}=require('/home/claude/node_modules/playwright');const fs=require('fs');const path=require('path');
const SP='/tmp/claude-0/-home-claude/dd913fc0-e3b9-5ed3-baf8-756070468c49/scratchpad/',F=SP+'fonts/node_modules/@fontsource/';
const [,,GAME,OUT]=process.argv;fs.mkdirSync(OUT,{recursive:true});
let html=fs.readFileSync(GAME,'utf8').replace('<link href="https://fonts.googleapis.com','<link data-x="https://fonts.googleapis.com');
const ff=[['Press Start 2P','press-start-2p/files/press-start-2p'],['PT Sans Narrow','pt-sans-narrow/files/pt-sans-narrow'],['Tiny5','tiny5/files/tiny5'],['Caveat','caveat/files/caveat']];
let css='';for(const[n,f]of ff)for(const sub of['cyrillic','latin']){const p=F+f+'-'+sub+'-400-normal.woff2';if(fs.existsSync(p))css+=`@font-face{font-family:"${n}";src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')})}`}
for(const sub of['cyrillic','latin']){const p=F+'pt-sans-narrow/files/pt-sans-narrow-'+sub+'-700-normal.woff2';if(fs.existsSync(p))css+=`@font-face{font-family:"PT Sans Narrow";font-weight:700;src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')})}`}
const seed=`<script>(function(){let s=12345;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648}})()</script>`;
const page=OUT+'/page.html';
fs.writeFileSync(page,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style>'+seed+'</head><body>'+html+'</body></html>');
const SAVE={money:60000,trips:12,det:4,shovel:4,transport:3,rep:20,heat:1,lvl:5,seenIntro:true,vdiTip:1,pinTip:1,forestSeen:1,ploughSeen:1,manorSeen:1,swampSeen:1,msg:"Тестовое сообщение.",wx:"clear",debt:120000,debtTrip:10,debtV:3,debtM:3,debtMiss:1,own:{pin:1},
 dex:{"Пятак 1811":1,"Кокарда":1,"Каска СШ-40":1},story:{st:3,clues:["letter","pp"]},
 inv:[{name:"Пятак 1811",c:2,era:2,w:.05,base:1200,cond:.9,depth:20,clean:true,gr:2},{name:"Кокарда",c:3,era:2,w:.02,base:3000,cond:.9,depth:30,clean:false},{name:"Каска СШ-40",c:3,era:1,w:1.2,base:2500,cond:.8,depth:35,clean:true,gr:3}]};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.clock.install({time:new Date('2026-10-13T10:00:00')});
await p.goto('file://'+page);await p.evaluate(s=>localStorage.setItem('seryi-kopatel-pole-v1',JSON.stringify(s)),SAVE);await p.reload();await p.clock.runFor(800);
const shot=async n=>{await p.clock.runFor(400);await p.screenshot({path:`${OUT}/${n}.png`})};
const tab=async t=>{await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),t);await shot('tab-'+t)};
for(const t of ['maps','sell','gear','skills','ded'])await tab(t);
await p.evaluate(()=>SK.debtHelp&&SK.debtHelp());await shot('debt-help');await p.evaluate(()=>{const o=document.getElementById('debtOver');if(o)o.hidden=true});
await p.evaluate(()=>document.querySelector('#tabs button[data-tab=sell]').click());await p.evaluate(()=>SK.openFind(1));await shot('find-sheet');await p.evaluate(()=>SK.closeFind&&SK.closeFind());
await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await shot('field-start');
await p.evaluate(()=>{const e=document.getElementById('evt');if(e&&!e.hidden){const b=e.querySelector('button');b&&b.click()}});await shot('field-after-event');
await p.evaluate(()=>document.getElementById('digCare').click());await p.clock.runFor(1500);await shot('field-dig');
await p.evaluate(()=>document.getElementById('bagBtn').click());await shot('field-bag');await p.evaluate(()=>document.getElementById('bagClose').click());
await p.evaluate(()=>document.getElementById('home').click());await p.clock.runFor(1200);await shot('back-home');
const st=await p.evaluate(()=>localStorage.getItem('seryi-kopatel-pole-v1'));fs.writeFileSync(OUT+'/state.json',st);
fs.writeFileSync(OUT+'/errors.txt',errs.join('\n'));console.log('errors:',errs.length,errs.slice(0,3));await b.close()})();
