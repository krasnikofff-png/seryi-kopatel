// Сливает повторяющиеся правила (тот же селектор в том же @media) в последнее вхождение,
// но только если между ними нет правил, которые могут задеть те же элементы и те же свойства.
const postcss=require('/home/claude/node_modules/postcss');const fs=require('fs');
const o=JSON.parse(fs.readFileSync('src/order.json'));const skip=new Set((process.argv[2]||'').split('|').filter(Boolean));
const roots=o.css.map(f=>postcss.parse(fs.readFileSync('src/'+f,'utf8'),{from:f}));
const ctx=r=>{let p=r.parent,c=[];while(p&&p.type!=='root'){if(p.type==='atrule')c.unshift('@'+p.name+' '+p.params);p=p.parent}return c.join('|')};
const all=[];roots.forEach(root=>root.walkRules(r=>{if(r.parent.type==='atrule'&&/keyframes/.test(r.parent.name))return;all.push(r)}));
const sel=r=>r.selectors.map(s=>s.trim()).join(',');
const toks=s=>{const last=s.split(',').map(x=>x.trim().split(/[\s>+~]+/).pop());const t=new Set();for(const l of last)(l.replace(/::?[a-z-]+(\([^)]*\))?/g,'').match(/[.#]?[A-Za-z_][\w-]*/g)||[]).forEach(x=>t.add(x));return t};
const root=p=>p.replace(/^-(webkit|moz)-/,'').split('-')[0].replace(/^(inset|top|left|right|bottom)$/,'pos').replace(/^(width|height|min|max)$/,'size');
const groups=new Map();all.forEach((r,i)=>{const k=ctx(r)+'§'+sel(r);if(skip.has(sel(r)))return;(groups.get(k)||groups.set(k,[]).get(k)).push(i)});
let merged=0,kept=[];
for(const [k,idx] of groups){if(idx.length<2)continue;const rs=idx.map(i=>all[i]);const T=toks(sel(rs[0]));
  // свойства, которые «переедут» вниз
  const moving=new Set();rs.slice(0,-1).forEach(r=>r.each(n=>n.type==='decl'&&moving.add(root(n.prop))));
  let risky=false;for(let i=idx[0]+1;i<idx[idx.length-1]&&!risky;i++){if(idx.includes(i))continue;const r=all[i];const t2=toks(sel(r));if(![...t2].some(x=>T.has(x)))continue;
    r.each(n=>{if(n.type==='decl'&&moving.has(root(n.prop)))risky=true})}
  if(risky){kept.push(sel(rs[0]));continue}
  const last=rs[rs.length-1];const fin=new Map();
  for(const r of rs)r.each(n=>{if(n.type!=='decl')return;const prev=fin.get(n.prop);if(prev&&prev.important&&!n.important)return;fin.delete(n.prop);fin.set(n.prop,n.clone())});
  last.removeAll();for(const d of fin.values())last.append(d);
  for(const r of rs.slice(0,-1)){const p=r.parent;r.remove();if(p.type==='atrule'&&!p.nodes.length)p.remove()}merged+=rs.length-1}
roots.forEach((root,i)=>fs.writeFileSync('src/'+o.css[i],root.toString()));console.log('слито правил',merged,'оставлено как есть',kept.length);
