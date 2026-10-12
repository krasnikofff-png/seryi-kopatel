import json,sys,collections
a=json.load(open(sys.argv[1]));b=json.load(open(sys.argv[2]));n=0;props=collections.Counter();ex=[]
for st in a:
    A=a[st];B=b.get(st,{})
    for el in set(A)|set(B):
        x=A.get(el,{});y=B.get(el,{})
        for k in set(x)|set(y):
            if x.get(k)!=y.get(k):n+=1;props[k]+=1;len(ex)<12 and ex.append((st,el[-70:],k,x.get(k),y.get(k)))
print('отличий',n);print(props.most_common(10));[print(e) for e in ex];sys.exit(1 if n else 0)
