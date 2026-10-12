const acorn=require('/home/claude/node_modules/acorn');const fs=require('fs');const o=JSON.parse(fs.readFileSync('src/order.json'));
let bad=[];for(const f of o.js){try{acorn.parse(fs.readFileSync('src/'+f,'utf8'),{ecmaVersion:2022,allowReturnOutsideFunction:true})}catch(e){bad.push(f+': '+e.message)}}console.log(bad.length?bad.join('\n'):'все разделы читаются по отдельности');
