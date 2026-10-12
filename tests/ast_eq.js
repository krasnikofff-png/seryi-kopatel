// Сравнивает смысл программы (AST) в двух собранных файлах, без учёта пробелов, кавычек и переносов.
const acorn=require('/home/claude/node_modules/acorn');const fs=require('fs');
const main=f=>{const s=fs.readFileSync(f,'utf8');const m=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);return m.sort((a,b)=>b.length-a.length)[0]};
const norm=n=>{if(Array.isArray(n))return n.map(norm);if(n&&typeof n==='object'){const o={};for(const k in n){if(['start','end','loc','raw','range'].includes(k))continue;o[k]=norm(n[k])}if(o.type==='TemplateElement')delete o.value.raw;if(o.type==='Property'&&!o.computed&&o.key&&o.key.type==='Identifier')o.key={type:'Literal',value:o.key.name};if(o.type==='Property'&&!o.computed&&o.key&&o.key.type==='Literal')o.key={type:'Literal',value:String(o.key.value)};return o}return n};
const a=JSON.stringify(norm(acorn.parse(main(process.argv[2]),{ecmaVersion:2022})));const b=JSON.stringify(norm(acorn.parse(main(process.argv[3]),{ecmaVersion:2022})));
if(a===b)console.log('AST одинаковый');else{let i=0;while(a[i]===b[i])i++;console.log('AST РАЗНЫЙ около',a.slice(i-200,i+100),'\n---\n',b.slice(i-200,i+100));process.exit(1)}
