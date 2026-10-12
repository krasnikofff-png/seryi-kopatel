# Одноразовый разбор kopatel-v-pole.html на исходники в src/
import re,os,base64,json,sys
SRC='/mnt/user-data/outputs/kopatel-v-pole.html'
OUT='/home/claude/seryi-kopatel/src'
s=open(SRC,encoding='utf-8').read()
TR=dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя","a b v g d e yo zh z i j k l m n o p r s t u f h c ch sh sch  y  e yu ya".split(' ')))
def slug(t):
    t=t.lower();r=''.join(TR.get(c,c) for c in t)
    r=re.sub(r'[^a-z0-9]+','-',r).strip('-');return r or 'x'
used=set()
def save_img(group,key,data):
    m=re.match(r'data:image/([a-z]+);base64,(.*)',data);ext=m.group(1);raw=base64.b64decode(m.group(2))
    # проверка: перекодировка должна совпасть байт в байт
    assert base64.b64encode(raw).decode()==m.group(2)
    name=f'{group}/{slug(str(key))}';n=name;k=2
    while n in used:n=f'{name}-{k}';k+=1
    used.add(n);p=f'{OUT}/art/{n}.{ext}';os.makedirs(os.path.dirname(p),exist_ok=True);open(p,'wb').write(raw)
    return f'@art({n}.{ext})'
IMG=re.compile(r'data:image/[a-z]+;base64,[A-Za-z0-9+/=]+')
def extract(text,default_group):
    lines=text.split('\n');out=[]
    for ln in lines:
        if 'data:image' not in ln:out.append(ln);continue
        g=re.match(r'\s*(?:const|let)\s+([A-Za-z_]+)\s*=',ln) or re.match(r'\s*Object\.assign\(([A-Za-z_]+)',ln)
        group=(g.group(1).lower().replace('_','-') if g else default_group)
        idx=[0]
        def rp(m):
            pre=ln[max(0,m.start()-120):m.start()]
            k=re.search(r'["\']?([^"\'{,:\[]+?)["\']?\s*:\s*["\']?$',pre)
            if g and k: key=k.group(1)
            else: idx[0]+=1;key=str(idx[0]) if g else f'{default_group}-{len(used)}'
            return save_img(group,key,m.group(0))
        out.append(IMG.sub(rp,ln))
    return '\n'.join(out)
# части файла
i_style=s.index('<style>');j_style=s.index('</style>')
head=s[:i_style];css=s[i_style+7:j_style]
rest=s[j_style+8:]
i1=rest.index('<script>');body=rest[:i1]
r2=rest[i1+8:];j1=r2.index('</script>');boot=r2[:j1]
r3=r2[j1+9:];assert r3.startswith('\n<script>'),r3[:20]
r3=r3[9:];j2=r3.index('</script>');main=r3[:j2];tail=r3[j2+9:]
os.makedirs(OUT,exist_ok=True)
parts={'head.html':head,'body.html':extract(body,'ui'),'boot.js':boot,'tail.html':tail}
# CSS: по разделам-комментариям верхнего уровня
css=extract(css,'css')
# JS: по разделам «// =====»
main=extract(main,'misc')
mlines=main.split('\n');secs=[];cur=[];title='00-start'
for ln in mlines:
    m=re.match(r'^// =+ ?(.*?) ?=*\s*$',ln) if ln.startswith('// =') else None
    if m and cur:
        secs.append((title,cur));cur=[];title=f'{len(secs):02d}-'+slug(m.group(1))[:40]
    elif m: title=f'{len(secs):02d}-'+slug(m.group(1))[:40]
    cur.append(ln)
secs.append((title,cur))
os.makedirs(OUT+'/js',exist_ok=True);order=[]
for t,c in secs:
    fn=f'js/{t}.js';open(f'{OUT}/{fn}','w',encoding='utf-8').write('\n'.join(c));order.append(fn)
# CSS: делим по комментариям вида /* ... */ в начале строки
cl=css.split('\n');cs=[];cur=[];n=0
for ln in cl:
    if re.match(r'^/\* .{3,}\*/\s*$',ln) and cur and len('\n'.join(cur))>3000:
        cs.append(cur);cur=[]
    cur.append(ln)
cs.append(cur);os.makedirs(OUT+'/css',exist_ok=True);corder=[]
for k,c in enumerate(cs):
    m=re.match(r'^/\* (.*?)\*/',c[0]);nm=slug(m.group(1))[:30] if m else 'base'
    fn=f'css/{k:02d}-{nm}.css';open(f'{OUT}/{fn}','w',encoding='utf-8').write('\n'.join(c));corder.append(fn)
for k,v in parts.items():open(f'{OUT}/{k}','w',encoding='utf-8').write(v)
json.dump({'css':corder,'js':order},open(f'{OUT}/order.json','w'),ensure_ascii=False,indent=1)
print(len(order),'js',len(corder),'css',len(used),'картинок')
# --- картинки из многострочного FIND_IMG: misc → find-img/<название>
p=OUT+'/js/02-dannye-igry.js';t=open(p,encoding='utf-8').read()
have=set(os.listdir(OUT+'/art/find-img'))
def rp2(m):
    key,old=m.group(1),m.group(2);n=slug(key)+'.png';k=2
    while n in have:n=f'{slug(key)}-{k}.png';k+=1
    have.add(n);os.rename(f'{OUT}/art/misc/{old}',f'{OUT}/art/find-img/{n}');return f'"{key}":"@art(find-img/{n})"'
t=re.sub(r'"([^"]+)":"@art\(misc/(misc-\d+\.png)\)"',rp2,t);open(p,'w',encoding='utf-8').write(t)
if os.path.isdir(OUT+'/art/misc') and not os.listdir(OUT+'/art/misc'):os.rmdir(OUT+'/art/misc')
# --- обёртка (function(){ ... })() уходит в сборку
o=json.load(open(OUT+'/order.json'));o['js'].remove('js/00-start.js');os.remove(OUT+'/js/00-start.js')
q=OUT+'/js/42-start.js';t=open(q).read();assert t.endswith('\n})();\n');open(q,'w').write(t[:-len('})();\n')])
json.dump(o,open(OUT+'/order.json','w'),ensure_ascii=False,indent=1)
