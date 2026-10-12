import sys,os
from PIL import Image,ImageChops
a,b=sys.argv[1],sys.argv[2];bad=0
for f in sorted(os.listdir(a)):
    if not f.endswith('.png'):continue
    A=Image.open(f'{a}/{f}').convert('RGB');B=Image.open(f'{b}/{f}').convert('RGB')
    d=ImageChops.difference(A,B).getbbox();n=0
    if d:
        px=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>16 else 0);n=sum(1 for v in px.getdata() if v)
    print(f'{f:28s}', 'одинаково' if not d else f'РАЗНИЦА {n} пикс в {d}');bad+=bool(n)
sa=open(f'{a}/state.json').read();sb=open(f'{b}/state.json').read();print('состояние', 'одинаково' if sa==sb else 'РАЗНОЕ');sys.exit(1 if bad or sa!=sb else 0)
