// Удаляет неиспользуемые функции верхнего уровня (по eslint), пока они есть.
const {Linter}=require('/home/claude/node_modules/eslint');const acorn=require('/home/claude/node_modules/acorn');const fs=require('fs');const cp=require('child_process');
const o=JSON.parse(fs.readFileSync('src/order.json'));let total=[];
for(let it=0;it<30;it++){
  const code=o.js.map(f=>fs.readFileSync('src/'+f,'utf8')).join('\n');
  const msgs=new Linter().verify('(function(){'+code+'\n})();',{parserOptions:{ecmaVersion:2022},env:{browser:true,es2022:true},rules:{'no-unused-vars':[2,{vars:'all',args:'none'}]}});
  const names=new Set(msgs.filter(m=>/is defined but never used/.test(m.message)).map(m=>m.message.match(/'([^']+)'/)[1]));
  let removed=0;
  for(const f of o.js){const p='src/'+f;let t=fs.readFileSync(p,'utf8');const ast=acorn.parse(t,{ecmaVersion:2022,allowReturnOutsideFunction:true});
    const cut=ast.body.filter(n=>n.type==='FunctionDeclaration'&&names.has(n.id.name)).sort((a,b)=>b.start-a.start);
    for(const n of cut){t=t.slice(0,n.start)+t.slice(n.end).replace(/^\n/,'');total.push(n.id.name);removed++}
    if(cut.length)fs.writeFileSync(p,t)}
  if(!removed)break}
console.log('удалено функций',total.length,total.join(', '));
