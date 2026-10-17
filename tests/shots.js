// Скриншоты всех экранов игры + проверка текста (переносы 1–3 символа, обрезка, вылезание).
// node tests/shots.js <game.html> <outdir> [фильтр]
const {chromium}=require('/home/claude/node_modules/playwright');const fs=require('fs');
const SP='/tmp/claude-0/-home-claude/dd913fc0-e3b9-5ed3-baf8-756070468c49/scratchpad/',F=SP+'fonts/node_modules/@fontsource/';
const [,,GAME,OUT,FILT]=process.argv;fs.mkdirSync(OUT,{recursive:true});
let html=fs.readFileSync(GAME,'utf8').replace(/<link href="https:\/\/fonts.googleapis.com/g,'<link data-x="https://fonts.googleapis.com').replace('let lcdKey = "";','let lcdKey = ""; window.__X={get G(){return G},get T(){return T},showEvent:()=>showEvent(),showComic:(a,b)=>showComic(a,b),storyChoice:(a,b,c,d)=>storyChoice(a,b,c,d),card:(a,b,c,d)=>card(a,b,c,d),toast:t=>toast(t),dayOver:(a,b,c,d)=>dayOverPopup(a,b,c,d),raid:()=>{raidInfo={it:G.inv[1],fine:5000,price:3400,no:4821};showRaid()},regIntro:r=>showRegionIntro(r)};');
let css='';const face=(n,f,w)=>{for(const sub of['cyrillic','latin']){const p=F+f+'-'+sub+'-'+w+'-normal.woff2';if(fs.existsSync(p))css+=`@font-face{font-family:"${n}";font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')})}`}};
for(const w of [600,700,800,900])face('Nunito','nunito/files/nunito',w);
face('Caveat','caveat/files/caveat',600);face('Caveat','caveat/files/caveat',700);
face('Press Start 2P','press-start-2p/files/press-start-2p',400);face('PT Sans Narrow','pt-sans-narrow/files/pt-sans-narrow',400);face('PT Sans Narrow','pt-sans-narrow/files/pt-sans-narrow',700);face('Tiny5','tiny5/files/tiny5',400);
const seed=`<script>(function(){let s=12345;Math.random=function(){s=(s*1103515245+12345)%2147483648;return s/2147483648}})()</script>`;
const page=OUT+'/page.html';
fs.writeFileSync(page,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style>'+seed+'</head><body>'+html+'</body></html>');
const IT=(name,c,era,base,clean,extra)=>Object.assign({name,c,era,w:.3,base,cond:.85,depth:25,clean,gr:2},extra||{});
const SAVE={money:84500,trips:30,det:4,shovel:4,transport:3,rep:22,heat:2,lvl:13,xp:300,sp:1,seenIntro:true,vdiTip:1,pinTip:1,forestSeen:1,ploughSeen:1,manorSeen:1,swampSeen:1,
 msg:"Вернулся домой. Продал скупщику пять вещей за 4 200 ₽.",wx:"clear",debt:60000,debtTrip:28,debtV:3,debtM:3,debtMiss:0,own:{pin:1,phones:1},
 skills:{torg:3,karto:2,master:1,svyazi:0},wear:{hat:"panama",jacket:"vest",pants:"zabrody",pack:"meshok"},
 wearGot:["hat:panama","pants:zabrody","jacket:olimpiyka"],wst:{rain:4,swamp:12,blk:2},
 wearSeen:["hat:cap","hat:ushanka","hat:helmet","hat:panama","hat:petushok","hat:bandana","hat:forester","hat:headlamp","jacket:green","jacket:gorka","jacket:vest","jacket:vatnik","jacket:telnyashka","jacket:ozk","jacket:olimpiyka","jacket:deer","jacket:gimnast","pants:jeans","pants:gorka","pants:flora","pants:treniki","pants:zabrody","pants:shorts","pants:galife","pack:pack","pack:meshok","pack:ermak","pack:baul"],dex:{"Пятак 1811":1,"Кокарда":1,"Каска СШ-40":1,"Георгиевский крест":1,"Крестик нательный":1},story:{st:3,clues:["letter","pp","zheton","photo"]},
 inv:[IT("Пятак 1811",2,2,1200,true),IT("Каска СШ-40",3,1,2500,true),IT("Крестик нательный",1,2,640,true),IT("Кокарда",3,2,3000,false),IT("Солдатская фляга",3,1,1500,false),IT("Пуговица с орлом",1,2,400,false),IT("Георгиевский крест",4,2,9000,true)]};
const SC=[];const S=(n,f)=>SC.push([n,f]);
const tab=t=>p=>p.evaluate(t=>document.querySelector(`#tabs button[data-tab=${t}]`).click(),t);
S('sell',tab('sell'));S('sell-2',async p=>{await tab('sell')(p);await p.evaluate(()=>document.getElementById('base').scrollTop=700)});
S('find',async p=>{await tab('sell')(p);await p.evaluate(()=>SK.openFind(0))});
S('find-dirty',async p=>{await tab('sell')(p);await p.evaluate(()=>SK.openFind(3))});
for(const g of ['shovel','det','transport','acc','ws','wd'])S('gear-'+g,async p=>{await tab('gear')(p);await p.evaluate(g=>SK.gearTab(g),g)});
S('gear-wd-2',async p=>{await tab('gear')(p);await p.evaluate(()=>{SK.gearTab('wd');SK.wdTap('hat','bandana');document.getElementById('base').scrollTop=520})});
S('gear-wd-try',async p=>{await tab('gear')(p);await p.evaluate(()=>{SK.gearTab('wd');SK.wdTap('hat','helmet');document.getElementById('base').scrollTop=300})});
S('gear-wd-3',async p=>{await tab('gear')(p);await p.evaluate(()=>{SK.gearTab('wd');document.getElementById('base').scrollTop=1100})});
S('wd-new',async p=>{await p.evaluate(()=>{__X.G.wearNew=['jacket:deer'];__X.G.wearGot.push('jacket:deer');SK.gearTab('wd')});await p.clock.runFor(800)});
S('skills',async p=>{await tab('skills')(p);await p.evaluate(()=>SK.skTab('sk'))});
S('path',async p=>{await tab('skills')(p);await p.evaluate(()=>SK.skTab('tr'))});
S('maps',tab('maps'));S('maps-2',async p=>{await tab('maps')(p);await p.evaluate(()=>document.getElementById('base').scrollTop=700)});
S('maps-3',async p=>{await tab('maps')(p);await p.evaluate(()=>document.getElementById('base').scrollTop=1500)});
S('ded',tab('ded'));
S('debt',async p=>{await p.evaluate(()=>SK.debtHelp())});
S('album',async p=>{await tab('sell')(p);await p.evaluate(()=>{const b=[...document.querySelectorAll('#t_sell button,#t_sell [onclick]')].find(x=>/альбом/i.test(x.textContent));b&&b.click()})});
S('flea',async p=>{await p.evaluate(()=>SK.openFlea())});
S('house',async p=>{await p.evaluate(()=>{__X.G.house={street:'ул. Колхозная, 5',left:3};SK.goHouse()})});
S('comic',async p=>{await p.evaluate(()=>__X.showComic('prologue'))});
S('choice',async p=>{await p.evaluate(()=>__X.storyChoice('Глава 2 · Лес','borzy','Борзый ждёт ответа. Сто тысяч — это почти все долги разом.',[{label:'Отказать Борзому',sub:'Жетон останется у Савельича · +2 совести',cls:'green',run:()=>{}},{label:'Продать жетон за 100 000 ₽',sub:'−5 совести · светлый финал закроется',cls:'dark',run:()=>{}}]))});
S('field',async p=>{await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await p.evaluate(()=>{const e=document.getElementById('evt');if(e&&!e.hidden){const b=e.querySelector('button');b&&b.click()}})});
S('event',async p=>{await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await p.evaluate(()=>{__X.T.event='gai';__X.showEvent()})});
S('bag',async p=>{await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await p.evaluate(()=>{const e=document.getElementById('evt');if(e&&!e.hidden){const b=e.querySelector('button');b&&b.click()}document.getElementById('bagBtn').click()})});
S('pz',async p=>{await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await p.evaluate(()=>{const e=document.getElementById('evt');if(e&&!e.hidden){const b=e.querySelector('button');b&&b.click()}SK.openPz()})});
S('settings',async p=>{await p.evaluate(()=>document.getElementById('setBtn').click())});
S('legs',async p=>{await p.evaluate(()=>SK.openLegs())});
S('albitem',async p=>{await p.evaluate(()=>SK.albPick(1,1))});
S('scrub',async p=>{await tab('sell')(p);await p.evaluate(()=>SK.clean(3,true))});
S('intro',async p=>{await p.evaluate(()=>{__X.G.seenIntro=false;SK.go(0)});await p.clock.runFor(1500)});
S('card',async p=>{await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await p.evaluate(()=>{const e=document.getElementById('evt');if(e&&!e.hidden){const b=e.querySelector('button');b&&b.click()}__X.card(Object.assign({},__X.G.inv[3],{clean:false}),true,false,true)})});
S('dayover',async p=>{await p.evaluate(()=>SK.buyGo(2));await p.clock.runFor(1500);await p.evaluate(()=>{const e=document.getElementById('evt');if(e&&!e.hidden){const b=e.querySelector('button');b&&b.click()}__X.dayOver(3,'19:00','summer','clear')})});
S('raid',async p=>{await p.evaluate(()=>__X.raid())});
S('region',async p=>{await p.evaluate(()=>__X.regIntro(2))});
S('maps-place',async p=>{await tab('maps')(p);await p.evaluate(()=>SK.setPlace(4))});
const CHECK=fs.readFileSync(__dirname+'/textcheck.js','utf8');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const rep={};let errsAll=[];
for(const [n,f] of SC){if(FILT&&!n.includes(FILT))continue;
 const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.clock.install({time:new Date('2026-10-13T10:00:00')});
 await p.goto('file://'+page);await p.evaluate(s=>localStorage.setItem('seryi-kopatel-pole-v1',JSON.stringify(s)),SAVE);await p.reload();await p.clock.runFor(900);
 await p.evaluate(()=>{const c=document.getElementById('comic');if(c&&!c.hidden){c.hidden=true;c.innerHTML=''}});
 try{await f(p)}catch(e){errs.push('step: '+e.message)}
 await p.clock.runFor(700);await p.screenshot({path:`${OUT}/${n}.png`});
 rep[n]=await p.evaluate('('+CHECK.trim()+')()');if(errs.length){rep[n].push(...errs.map(e=>({type:'ошибка',text:e})));}
 await p.close()}
await b.close();let tot=0;for(const[k,v]of Object.entries(rep)){if(v.length){tot+=v.length;console.log('## '+k);v.slice(0,12).forEach(x=>console.log('   '+JSON.stringify(x)))}}
console.log('замечаний:',tot);fs.writeFileSync(OUT+'/report.json',JSON.stringify(rep,null,1))})();
