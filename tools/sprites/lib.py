import math,random
from PIL import Image
N=32
OUT=(31,24,19,255)
P={ # dark, mid, light, highlight
 'rust':[(92,52,30),(140,78,40),(176,104,56),(206,140,80)],
 'iron':[(48,46,46),(78,74,72),(110,104,98),(146,138,128)],
 'steel':[(63,67,74),(95,102,112),(133,141,151),(170,178,187)],
 'silver':[(95,102,112),(170,178,187),(208,214,220),(244,247,249)],
 'tarn':[(70,70,74),(120,122,128),(158,160,166),(196,198,204)],
 'gold':[(150,104,26),(201,162,58),(233,197,74),(252,236,150)],
 'brass':[(120,92,34),(176,140,56),(206,172,78),(234,210,130)],
 'copper':[(104,52,30),(160,86,50),(196,118,68),(226,160,110)],
 'bronze':[(96,66,32),(146,104,50),(182,138,72),(216,180,110)],
 'alu':[(112,116,124),(160,165,172),(196,200,206),(228,231,235)],
 'red':[(122,28,22),(186,50,38),(218,82,60),(240,130,100)],
 'olive':[(50,58,28),(76,90,43),(104,120,60),(136,150,84)],
 'black':[(18,18,20),(34,34,38),(54,54,60),(86,86,94)],
 'wood':[(70,42,26),(104,64,38),(136,88,52),(164,114,70)],
 'blue':[(34,52,110),(56,88,160),(88,122,196),(140,170,230)],
 'lead':[(66,68,74),(104,106,112),(134,136,142),(164,166,172)],
 'zinc':[(84,88,90),(128,132,132),(160,164,162),(196,198,194)],
 'white':[(150,150,140),(206,204,192),(232,230,220),(250,250,244)],
 'paper':[(150,130,90),(196,176,130),(220,204,160),(240,230,196)],
}
GREEN=[(62,120,80),(96,156,104)]
RUSTSP=[(140,78,40),(176,104,56),(110,62,34)]
class C:
    def __init__(s,seed=1):
        s.px=[[None]*N for _ in range(N)];s.rnd=random.Random(seed)
    def _shade(s,mask,mat,light=(-1,-1),flat=False):
        pal=P[mat]
        xs=[x for x,y in mask];ys=[y for x,y in mask]
        if not mask:return
        cx=(min(xs)+max(xs))/2;cy=(min(ys)+max(ys))/2;rx=max(1,(max(xs)-min(xs))/2);ry=max(1,(max(ys)-min(ys))/2)
        M=set(mask)
        for x,y in mask:
            g=((x-cx)/rx+(y-cy)/ry)/2
            i=1
            if not flat:
                if g<-.45:i=2
                if g>.55:i=0
            if (x-1,y) not in M or (x,y-1) not in M:i=min(3,i+1)
            if (x+1,y) not in M or (x,y+1) not in M:i=0
            if not flat and (x-cx+rx*.45)**2/(rx*.22+.6)**2+(y-cy+ry*.45)**2/(ry*.22+.6)**2<1:i=3
            s.px[y][x]=pal[i]
    def shape(s,test,mat,**k):
        mask=[(x,y) for y in range(N) for x in range(N) if test(x+.5,y+.5)]
        s._shade(mask,mat,**k);return mask
    def ell(s,cx,cy,rx,ry,mat,**k):return s.shape(lambda x,y:((x-cx)/rx)**2+((y-cy)/ry)**2<=1,mat,**k)
    def ring(s,cx,cy,rx,ry,t,mat,**k):return s.shape(lambda x,y:((x-cx)/rx)**2+((y-cy)/ry)**2<=1 and ((x-cx)/(rx-t))**2+((y-cy)/(ry-t))**2>1,mat,**k)
    def rect(s,x0,y0,x1,y1,mat,**k):return s.shape(lambda x,y:x0<=x<x1+1 and y0<=y<y1+1,mat,**k)
    def rrect(s,x0,y0,x1,y1,r,mat,**k):
        def t(x,y):
            if not(x0<=x<x1+1 and y0<=y<y1+1):return False
            qx=min(x-x0,x1+1-x);qy=min(y-y0,y1+1-y)
            return not(qx<r and qy<r and (r-qx)**2+(r-qy)**2>r*r)
        return s.shape(t,mat,**k)
    def poly(s,pts,mat,**k):
        def inside(x,y):
            c=False;n=len(pts)
            for i in range(n):
                x1,y1=pts[i];x2,y2=pts[(i+1)%n]
                if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1)+x1:c=not c
            return c
        return s.shape(inside,mat,**k)
    def line(s,x0,y0,x1,y1,w,mat,**k):
        def t(x,y):
            dx,dy=x1-x0,y1-y0;L=dx*dx+dy*dy or 1;u=max(0,min(1,((x-x0)*dx+(y-y0)*dy)/L))
            return (x-x0-u*dx)**2+(y-y0-u*dy)**2<=(w/2)**2
        return s.shape(t,mat,**k)
    def star(s,cx,cy,R,r,mat,n=5,rot=-90,**k):
        pts=[]
        for i in range(n*2):
            a=math.radians(rot+i*180/n);rr=R if i%2==0 else r;pts.append((cx+rr*math.cos(a),cy+rr*math.sin(a)))
        return s.poly(pts,mat,**k)
    def erase(s,test):
        for y in range(N):
            for x in range(N):
                if test(x+.5,y+.5):s.px[y][x]=None
    def hole(s,cx,cy,rx,ry):s.erase(lambda x,y:((x-cx)/rx)**2+((y-cy)/ry)**2<=1)
    def dot(s,x,y,c):
        if 0<=x<N and 0<=y<N:s.px[y][x]=c
    def dots(s,pts,c):
        for x,y in pts:s.dot(x,y,c)
    def mark(s,pts,mat,i=0):
        for x,y in pts:
            if s.px[y][x] is not None:s.px[y][x]=P[mat][i]
    def segs(s,x0,y0,x1,y1,mat,i=0,only=True):
        n=max(abs(x1-x0),abs(y1-y0))
        for k in range(n+1):
            x=round(x0+(x1-x0)*k/(n or 1));y=round(y0+(y1-y0)*k/(n or 1))
            if 0<=x<N and 0<=y<N and (s.px[y][x] is not None or not only):s.px[y][x]=P[mat][i]
    def grime(s,mask,cols,amt=.12,blob=True):
        for x,y in mask:
            if s.px[y][x] is not None and s.rnd.random()<amt:
                c=s.rnd.choice(cols);s.px[y][x]=c
                if blob and s.rnd.random()<.5:
                    nx,ny=x+s.rnd.choice([-1,0,1]),y+s.rnd.choice([-1,0,1])
                    if (nx,ny) in mask and s.px[ny][nx] is not None:s.px[ny][nx]=c
    def img(s):
        im=Image.new('RGBA',(N,N),(0,0,0,0))
        filled=lambda x,y:0<=x<N and 0<=y<N and s.px[y][x] is not None
        for y in range(N):
            for x in range(N):
                if s.px[y][x] is not None:im.putpixel((x,y),s.px[y][x]+(255,))
                elif any(filled(x+dx,y+dy) for dx,dy in((1,0),(-1,0),(0,1),(0,-1),(1,1))):im.putpixel((x,y),OUT)
        return im
