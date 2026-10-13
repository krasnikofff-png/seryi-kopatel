import lib
lib.N=64
from lib import *
import sys,math
P['teal']=[(24,70,72),(36,104,104),(58,140,136),(110,190,180)]
P['rub']=[(20,20,22),(38,38,42),(60,60,66),(92,92,100)]
P['mred']=[(110,22,20),(176,36,30),(220,62,48),(246,120,96)]
P['chrome']=[(70,74,80),(130,136,144),(184,190,198),(232,236,240)]
P['orange']=[(130,60,14),(200,100,28),(236,140,48),(250,190,110)]
P['crim']=[(80,14,24),(130,24,40),(170,40,58),(214,90,104)]
P['tan']=[(130,112,82),(180,162,126),(212,196,160),(236,226,200)]
P['khaki']=[(52,60,30),(82,94,46),(110,124,64),(146,158,92)]
P['sky']=[(54,100,150),(92,146,200),(130,182,226),(186,218,242)]
P['glass']=[(40,64,80),(70,104,124),(110,150,170),(170,206,220)]
P['dgreen']=[(20,64,36),(34,96,52),(52,128,70),(96,170,110)]
P['cream']=[(170,150,100),(214,198,150),(232,220,180),(246,240,214)]
P['beige']=[(132,110,78),(184,162,124),(214,196,160),(238,228,204)]
P['ash']=[(120,96,62),(166,132,84),(196,164,112),(222,196,148)]
SCR=(120,240,160)

# ---------- детекторы ----------
def det(c,box='teal',coil='teal',kind=0):
    # kind: 0 обычный, 1 самодельный (изолента), 5 глубинный (большая катушка), 6 георадар
    shaft_end=(46,48) if kind!=6 else (44,44)
    c.line(14,10,*shaft_end,3.2,'rub')
    c.line(28,27,40,41,2,'chrome' if kind!=1 else 'wood')
    c.ring(9,9,6,6,2,'rub');c.erase(lambda x,y:y<8 and abs(x-9)<4);c.line(12,12,16,15,2.6,'rub')
    if kind==6:
        c.rrect(15,12,31,26,2,box);c.rect(18,14,28,22,'black',flat=True)
        for x in range(19,28):c.dot(x,18+round(2*math.sin(x*1.3)),SCR)
        c.dots([(19,15),(20,15),(21,15)],(250,220,120))
    elif kind==1:
        c.rrect(17,15,30,23,1,box)
        c.rect(23,15,24,23,'black',flat=True)                    # изолента
        c.ell(20.5,19,1.6,1.6,'chrome',flat=True);c.ell(27,19,1.6,1.6,'chrome',flat=True)
    else:
        c.rrect(17,14,31,24,2,box);c.rect(20,16,28,20,'black',flat=True)
        c.dots([(21,17),(22,17),(23,18),(25,17),(26,19)],SCR if kind!=3 else (250,200,90))
        c.rect(20,21,22,22,'chrome',flat=True);c.rect(24,21,26,22,'chrome',flat=True)
    c.line(14,16,19,24,2.6,'rub')
    if kind==1:
        for (x,y) in ((23,31),(35,45)):c.line(x-2.2,y+2.2,x+2.2,y-2.2,2.2,'lead',flat=True)
    if kind==6:
        c.poly([(34,46),(58,46),(60,52),(32,52)],box)            # салазки антенны
        c.rect(36,47,56,48,'iron',flat=True)
        c.line(43,42,46,47,2.4,'rub')
    elif kind==5:
        c.ell(47,52,15,7,'rub');c.ell(47,51,11,4.4,coil,flat=True);c.ell(47,51,7.5,2.4,'rub',flat=True)
        c.line(44,46,47,51,2.4,'rub')
    elif kind==1:
        c.ell(48,52,12,5.5,'iron');c.ell(48,51,8.5,3,'copper',flat=True);c.ell(48,51,5.6,1.8,'iron',flat=True)
        c.line(45,47,48,51,2.2,'rub')
    else:
        c.ell(48,52,13,6,'rub');c.ell(48,51,9,3.4,coil,flat=True);c.ell(48,51,6,2,'rub',flat=True)
        c.line(45,47,48,51,2.2,'rub')

# ---------- лопаты: локальная система u вдоль черенка, v поперёк ----------
D=(1/math.sqrt(2),1/math.sqrt(2));NV=(-1/math.sqrt(2),1/math.sqrt(2))
def T(o,pts):return [(o[0]+u*D[0]+v*NV[0],o[1]+u*D[1]+v*NV[1]) for u,v in pts]
def seg(c,o,u0,u1,w,mat,v=0,**k):
    (a,b),(x,y)=T(o,[(u0,v),(u1,v)]);c.line(a,b,x,y,w,mat,**k)
def dgrip(c,o,u,mat,w=8):
    a=T(o,[(u-3.5,0)])[0];c.ring(a[0],a[1],4.6,4.6,1.9,mat)
    (p,q),(x,y)=T(o,[(u-7,-3.2),(u-7,3.2)]);c.line(p,q,x,y,2.4,mat)
def tgrip(c,o,u,mat,w=10):
    (a,b),(x,y)=T(o,[(u,-w/2),(u,w/2)]);c.line(a,b,x,y,3.4,mat)
def blade(c,o,u0,L,w,mat,tip=.35,serr=False,step=False):
    pts=[(u0,-w/2),(u0+L*(1-tip),-w/2),(u0+L,0),(u0+L*(1-tip),w/2),(u0,w/2)]
    c.poly(T(o,pts),mat)
    seg(c,o,u0+1,u0+L*.75,1.2,mat,flat=True)                  # ребро
    if step:
        (a,b),(x,y)=T(o,[(u0,-w/2-2.5),(u0,w/2+2.5)]);c.line(a,b,x,y,2.6,'iron')
    if serr:
        for i in range(4):
            uu=u0+2+i*3.4;c.poly(T(o,[(uu,w/2-.5),(uu+3,w/2-.5),(uu+1,w/2+2.2)]),mat,flat=True)
def socket(c,o,u0,u1,w,mat):seg(c,o,u0,u1,w,mat)

def shovel(c,n):
    if n==1:      # сапёрная лопатка
        o=(14,14)
        tgrip(c,o,-3,'wood',8)
        seg(c,o,-3,24,4.2,'wood');socket(c,o,20,27,5.2,'iron')
        blade(c,o,26,24,17,'iron',tip=.42)
    elif n==2:    # штыковая
        o=(9,9)
        dgrip(c,o,4,'rub')
        seg(c,o,3,46,3,'wood');socket(c,o,42,49,4.4,'steel')
        blade(c,o,48,22,13,'steel',tip=.38)
    elif n==3:    # с упором
        o=(9,9)
        dgrip(c,o,4,'rub')
        seg(c,o,3,46,3,'khaki');socket(c,o,42,49,4.4,'khaki')
        blade(c,o,48,22,13,'steel',tip=.38,step=True)
    elif n==4:    # профессиональная
        o=(9,9)
        dgrip(c,o,4,'teal')
        seg(c,o,3,46,3,'rub');seg(c,o,10,40,1.2,'teal',flat=True);socket(c,o,42,49,4.4,'teal')
        blade(c,o,48,22,14,'steel',tip=.38,serr=True)
    elif n==5:    # археологическая
        o=(8,8)
        dgrip(c,o,4,'ash')
        seg(c,o,3,50,3,'ash');socket(c,o,46,53,3.8,'iron')
        blade(c,o,52,22,8,'silver',tip=.5)
    elif n==6:    # ручной бур и щуп
        # щуп (тонкий, левее)
        o=(8,22)
        tgrip(c,o,0,'mred',9);seg(c,o,0,46,1.6,'steel');seg(c,o,44,49,1.2,'steel')
        # бур
        o=(20,6)
        tgrip(c,o,0,'mred',12);seg(c,o,0,40,2.4,'steel')
        for i in range(5):
            u=40+i*3.4
            (a,b),(x,y)=T(o,[(u,-5+i*.6),(u+2,5-i*.6)]);c.line(a,b,x,y,2.2,'iron')
        seg(c,o,40,58,2,'steel')
    elif n==7:    # мотобур
        o=(6,6)
        (a,b),(x,y)=T(o,[(7,-11),(7,11)]);c.line(a,b,x,y,3.4,'mred')    # руль
        for v in (-10,10):
            (a,b),(x,y)=T(o,[(7,v),(7,v)]);c.ell(a,b,2.4,2.4,'rub')
        p=T(o,[(15,0)])[0];c.ell(p[0],p[1],10,10,'orange')               # двигатель
        q=T(o,[(13,-3)])[0];c.ell(q[0],q[1],4,4,'iron',flat=True)
        for i in range(-2,3):
            (a,b),(x,y)=T(o,[(9+i*2.2,4),(9+i*2.2,7)]);c.line(a,b,x,y,1,'black',flat=True)
        seg(c,o,24,30,6,'iron')                                          # редуктор
        seg(c,o,28,70,3,'steel')
        for i in range(7):
            u=34+i*5;w=6.5 if i<6 else 4
            (a,b),(x,y)=T(o,[(u,-w),(u+3,w)]);c.line(a,b,x,y,1.8,'iron')

# ---------- транспорт (вид сбоку, нос вправо) ----------
def wheel(c,x,y,r,hub='chrome'):
    c.ell(x,y,r,r,'rub');c.ell(x,y,r*.6,r*.6,hub);c.ell(x,y,r*.38,r*.38,hub,flat=True);c.ell(x,y,max(1,r*.16),max(1,r*.16),'rub')
def transport(c,n):
    if n==1:      # электричка
        c.line(30,8,24,14,1.4,'iron');c.line(30,8,36,14,1.4,'iron');c.line(22,8,38,8,1.6,'iron')   # токоприёмник
        c.rect(22,14,38,16,'iron')
        c.rrect(2,16,61,22,3,'lead')                               # крыша
        c.rect(2,20,61,46,'dgreen')
        c.rect(2,35,61,38,'cream',flat=True)                       # полоса
        for x in (6,15,24,40,49):c.rect(x,24,x+6,31,'glass')
        c.rect(32,23,37,44,'dgreen');c.rect(33,24,36,31,'glass',flat=True)  # дверь
        c.rect(56,24,61,31,'glass')                                # лобовое
        c.rect(57,40,59,42,'gold',flat=True)
        c.rect(4,46,59,49,'iron')                                  # тележки
        for x in (10,20,43,53):wheel(c,x,51,3.6,'iron')
        c.rect(0,55,63,56,'steel',flat=True)                      # рельс
    elif n==2:    # велосипед с багажником
        for x in (13,51):
            c.ring(x,44,11,11,2.2,'rub');c.ring(x,44,8.8,8.8,1,'chrome',flat=True)
            for a in range(0,180,30):
                r=math.radians(a);c.line(x-8*math.cos(r),44-8*math.sin(r),x+8*math.cos(r),44+8*math.sin(r),.9,'alu',flat=True)
            c.ell(x,44,1.6,1.6,'chrome')
        c.line(13,44,30,44,2.2,'blue');c.line(13,44,25,25,2.2,'blue')       # перья
        c.line(25,25,30,44,2.6,'blue');c.line(30,44,45,23,2.8,'blue');c.line(25,26,45,23,2.6,'blue')
        c.line(45,21,51,44,2.4,'blue')                                       # вилка
        c.line(44,22,43,15,2,'iron');c.line(38,15,47,14,2.2,'rub')         # руль
        c.ell(30,44,3,3,'chrome')
        c.line(24,24,23,20,1.8,'iron');c.rrect(17,17,28,20,2,'rub')         # седло
        c.line(4,29,22,29,1.6,'iron');c.line(6,29,12,40,1.4,'iron')         # багажник
        c.rrect(4,20,20,28,3,'ash');c.rect(11,20,12,28,'wood',flat=True)    # рюкзак/торба
        c.line(4,22,1,27,1.4,'olive')                                       # торчит лопатка
    elif n==3:
        moped(c)
    elif n==4:    # «Москвич» без прицепа
        c.poly([(2,34),(14,32),(20,22),(42,22),(50,32),(62,34),(62,45),(2,45)],'sky')
        c.poly([(22,24),(31,24),(31,32),(18,32)],'glass');c.poly([(33,24),(41,24),(47,32),(33,32)],'glass')
        c.rect(2,35,62,35,'white',flat=True)
        c.rect(1,42,10,44,'chrome');c.rect(54,42,63,44,'chrome')          # бамперы
        c.rect(59,36,62,38,'gold',flat=True);c.rect(2,36,4,38,'mred',flat=True)
        c.line(29,37,32,37,1,'chrome',flat=True);c.line(40,37,43,37,1,'chrome',flat=True)
        c.line(32,25,32,44,1,'sky',flat=True)
        wheel(c,14,45,7);wheel(c,50,45,7)
    elif n==5:    # «Нива»
        c.poly([(5,30),(6,18),(10,15),(40,15),(48,27),(60,29),(61,46),(5,46)],'khaki')
        c.poly([(9,18),(19,18),(19,27),(8,27)],'glass');c.poly([(22,18),(38,18),(45,27),(22,27)],'glass')
        c.rect(3,41,10,44,'iron');c.rect(55,41,62,44,'iron')
        c.rect(58,31,61,35,'chrome',flat=True);c.rect(59,32,60,34,'gold',flat=True)
        c.line(37,31,40,31,1,'iron',flat=True);c.line(36,28,36,44,1,'khaki',flat=True)
        c.rect(3,30,5,33,'mred',flat=True)
        wheel(c,17,45,8.5,'iron');wheel(c,48,45,8.5,'iron')
    elif n==6:    # УАЗ «буханка»
        c.rrect(3,12,61,46,8,'beige')
        for x in (8,20,32):c.rrect(x,17,x+9,25,2,'glass')
        c.poly([(46,17),(55,17),(59,25),(46,25)],'glass')
        c.rect(3,30,61,31,'ash',flat=True)
        c.line(43,15,43,44,1,'ash',flat=True);c.line(31,27,31,44,1,'ash',flat=True)
        c.rect(57,34,61,38,'chrome',flat=True);c.ell(59,36,1.4,1.4,'gold',flat=True)
        c.rect(1,42,7,45,'iron');c.rect(57,42,63,45,'iron')
        wheel(c,16,46,7.5,'iron');wheel(c,48,46,7.5,'iron')

def moped(c):
    for x in (14,50):
        c.ell(x,46,10,10,'rub');c.ell(x,46,6.5,6.5,'chrome');c.ell(x,46,4.5,4.5,'chrome',flat=True);c.ell(x,46,2,2,'rub')
    c.poly([(3,40),(6,34),(14,31),(24,34),(18,37),(10,37),(6,42)],'mred')
    c.poly([(42,38),(46,34),(54,34),(60,40),(56,39),(50,37),(45,39)],'mred')
    c.rect(22,36,32,44,'chrome');c.rect(24,38,30,42,'iron',flat=True)
    c.line(26,44,6,45,2.2,'chrome')
    c.poly([(12,27),(36,27),(34,35),(26,38),(16,36)],'mred')
    c.line(32,30,45,16,3.4,'mred')
    c.line(45,15,50,45,2.6,'chrome')
    c.rrect(10,21,32,27,3,'rub')
    c.line(39,12,51,12,2.2,'rub');c.line(45,12,45,16,2,'rub')
    c.ell(49,20,3.2,3.2,'chrome');c.ell(49.5,20,2,2,'gold',flat=True)
    c.rect(13,30,15,33,'gold',flat=True)

DETS={1:dict(box='olive',coil='iron',kind=1),2:dict(box='blue',coil='rub',kind=2),3:dict(box='orange',coil='orange',kind=3),
      4:dict(box='teal',coil='teal',kind=4),5:dict(box='crim',coil='crim',kind=5),6:dict(box='beige',coil='beige',kind=6)}
out=sys.argv[1]
import os
for d in ('det-img','shovel-img','transport-img'):os.makedirs(f'{out}/{d}',exist_ok=True)
for i,k in DETS.items():
    cc=C(seed=i);det(cc,**k);cc.img().save(f'{out}/det-img/{i}.png')
for i in range(1,8):
    cc=C(seed=10+i);shovel(cc,i);cc.img().save(f'{out}/shovel-img/{i}.png')
for i in range(1,7):
    cc=C(seed=20+i);transport(cc,i);cc.img().save(f'{out}/transport-img/{i}.png')
