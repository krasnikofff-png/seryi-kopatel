() => {
 const res=[];const vis=el=>{for(let e=el;e&&e!==document.documentElement;e=e.parentElement){const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||e.hidden)return false}return true};
 const inView=r=>r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
 const blockOf=el=>{while(el&&el!==document.body){const d=getComputedStyle(el).display;if(!d.startsWith('inline')||d==='inline-block'||d==='inline-flex')return el;el=el.parentElement}return document.body};
 const blocks=new Map();const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while(n=tw.nextNode()){if(!n.textContent.trim()||!n.parentElement||['SCRIPT','STYLE'].includes(n.parentElement.tagName))continue;if(!vis(n.parentElement))continue;const b=blockOf(n.parentElement);if(!blocks.has(b))blocks.set(b,[]);blocks.get(b).push(n)}
 const desc=el=>(el.innerText||'').replace(/\s+/g,' ').trim().slice(0,60);
 for(const[b,nodes]of blocks){const chars=[];
  for(const tn of nodes)for(let i=0;i<tn.length;i++){const ch=tn.data[i];if(/\s/.test(ch))continue;const r=document.createRange();r.setStart(tn,i);r.setEnd(tn,i+1);const q=r.getBoundingClientRect();if(!q.width&&!q.height)continue;if(!inView(q))continue;chars.push({ch,top:q.top,bot:q.bottom,x:q.left,right:q.right})}
  if(!chars.length)continue;const lines=[];let cur=null;
  for(const c of chars){if(!cur||c.top>=cur.bot-3&&c.x<cur.lastx){cur={bot:c.bot,s:'',lastx:c.x};lines.push(cur)}cur.s+=c.ch;cur.lastx=c.x;cur.bot=Math.max(cur.bot,c.bot)}
  if(lines.length>1){lines.forEach(L=>{const l=L.s.replace(/[^\p{L}\p{N}₽%]/gu,'');if(l.length<=3)res.push({type:'перенос',text:desc(b),line:L.s})});if(b.tagName==='BUTTON'&&!b.querySelector('small,.cost,.lbl,span[style*=block]'))res.push({type:'кнопка в 2 строки',text:desc(b)})}
  const mx=Math.max(...chars.map(c=>c.right));if(mx>innerWidth+1)res.push({type:'за экраном',text:desc(b)})}
 for(const el of document.querySelectorAll('body *')){if(!vis(el))continue;const r=el.getBoundingClientRect();if(!inView(r))continue;const cs=getComputedStyle(el);if(el.scrollWidth>el.clientWidth+1&&(cs.overflow==='hidden'||cs.overflowX==='hidden')&&el.innerText&&el.innerText.trim()&&el.children.length<3&&!el.querySelector('img,canvas'))res.push({type:cs.textOverflow==='ellipsis'?'многоточие':'обрезано',text:desc(el)})}
 return res}
