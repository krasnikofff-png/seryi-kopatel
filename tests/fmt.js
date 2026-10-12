const prettier=require('/home/claude/node_modules/prettier');const fs=require('fs');const o=JSON.parse(fs.readFileSync('src/order.json'));
(async()=>{for(const f of o.js){const p='src/'+f;const t=fs.readFileSync(p,'utf8');fs.writeFileSync(p,await prettier.format(t,{parser:'babel',printWidth:110,trailingComma:'none',arrowParens:'avoid'}))}
for(const f of o.css){const p='src/'+f;const t=fs.readFileSync(p,'utf8');fs.writeFileSync(p,await prettier.format(t,{parser:'css',printWidth:110}))}console.log('ok')})();
