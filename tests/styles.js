// Снимок вычисленных стилей всех элементов в разных состояниях игры: node tests/styles.js <game.html> <out.json>
const {chromium}=require('/home/claude/node_modules/playwright');const fs=require('fs');
const [,,GAME,OUT]=process.argv;
const SAVE={money:60000,trips:12,det:4,shovel:4,transport:3,rep:20,heat:1,lvl:5,seenIntro:true,vdiTip:1,pinTip:1,forestSeen:1,ploughSeen:1,manorSeen:1,swampSeen:1,msg:"Тест.",wx:"clear",debt:120000,debtTrip:10,debtV:3,debtM:3,debtMiss:1,own:{pin:1},dex:{"Пятак 1811":1},story:{st:3,clues:["letter","pp"]},
 inv:[{name:"Пятак 1811",c:2,era:2,w:.05,base:1200,cond:.9,depth:20,clean:true,gr:2},{name:"Кокарда",c:3,era:2,w:.02,base:3000,cond:.9,depth:30,clean:false}]};
const seed=`<script>(function(){let s=12345;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648}})()</script>`;
const page='/tmp/claude-0/-home-claude/dd913fc0-e3b9-5ed3-baf8-756070468c49/scratchpad/sty_page.html';
fs.writeFileSync(page,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+seed+'</head><body>'+fs.readFileSync(GAME,'utf8').replace('<link href="https://fonts.googleapis.com','<link data-x="x')+'</body></html>');
const dump=()=>{const out={};const all=document.querySelectorAll('body *');const path=e=>{let p=[];while(e&&e!==document.body){let i=0,s=e;while(s=s.previousElementSibling)i++;p.unshift(e.tagName+(e.id?'#'+e.id:'')+':'+i);e=e.parentElement}return p.join('>')};
  for(const e of all){if(e.tagName==='SCRIPT'||e.tagName==='STYLE')continue;const cs=getComputedStyle(e);const o={};for(let i=0;i<cs.length;i++){const k=cs[i];o[k]=cs.getPropertyValue(k)}
   for(const ps of ['::before','::after']){const c2=getComputedStyle(e,ps);if(c2.content&&c2.content!=='none'){for(let i=0;i<c2.length;i++){const k=c2[i];o[ps+k]=c2.getPropertyValue(k)}}}
   out[path(e)]=o}return out};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const res={};
 for(const W of [390,360,1100]){const p=await b.newPage({viewport:{width:W,height:844}});await p.clock.install({time:new Date('2026-10-13T10:00:00')});
  await p.goto('file://'+page);await p.evaluate(s=>localStorage.setItem('seryi-kopatel-pole-v1',JSON.stringify(s)),SAVE);await p.reload();await p.clock.runFor(600);
  const snap=async n=>{await p.clock.runFor(200);res[W+'/'+n]=await p.evaluate(dump)};
  for(const t of ['maps','sell','gear','skills','ded']){await p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),t);await snap('tab-'+t)}
  await p.evaluate(()=>SK.debtHelp());await snap('debt');await p.evaluate(()=>document.getElementById('debtOver').hidden=true);
  await p.evaluate(()=>{document.querySelector('#tabs button[data-tab=sell]').click();SK.openFind(1)});await snap('find');await p.evaluate(()=>SK.closeFind());
  await p.evaluate(()=>SK.clean(1,true));await snap('scrub');await p.evaluate(()=>SK.scrubCancel&&SK.scrubCancel());
  await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(800);await snap('field');
  await p.evaluate(()=>document.getElementById('bagBtn').click());await snap('bag');await p.evaluate(()=>document.getElementById('bagClose').click());
  await p.close()}
 fs.writeFileSync(OUT,JSON.stringify(res));await b.close();console.log('снимков',Object.keys(res).length)})();
