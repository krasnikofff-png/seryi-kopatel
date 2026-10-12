#!/usr/bin/env python3
"""Сборка игры из src/ в один файл. Запуск: python3 build.py [путь_вывода]"""
import re,base64,json,os,sys
ROOT=os.path.dirname(os.path.abspath(__file__));SRC=os.path.join(ROOT,'src')
MIME={'png':'png','gif':'gif','jpeg':'jpeg','jpg':'jpeg','webp':'webp'}
def rd(p):return open(os.path.join(SRC,p),encoding='utf-8').read()
def art(m):
    p=m.group(1);ext=p.rsplit('.',1)[1]
    return f'data:image/{MIME[ext]};base64,'+base64.b64encode(open(os.path.join(SRC,'art',p),'rb').read()).decode()
def inline(t):return re.sub(r'@art\(([^)]+)\)',art,t)
def build():
    o=json.load(open(os.path.join(SRC,'order.json')))
    css='\n'.join(rd(f) for f in o['css']);js='\n(function(){\n"use strict";\n'+'\n'.join(rd(f) for f in o['js'])+'})();\n'
    return inline(rd('head.html')+'<style>'+css+'</style>'+rd('body.html')+'<script>'+rd('boot.js')+'</script>\n<script>'+js+'</script>'+rd('tail.html'))
if __name__=='__main__':
    h=build()
    if '--friends' in sys.argv:  # версия для друзей (GitHub Pages): заглушка «включите JavaScript» вокруг игры
        out=os.path.join(ROOT,'index.html');h=rd('friends/prefix.html')+h+rd('friends/suffix.html')
    else:
        args=[a for a in sys.argv[1:] if not a.startswith('--')]
        out=args[0] if args else os.path.join(ROOT,'dist','kopatel-v-pole.html')
    os.makedirs(os.path.dirname(out),exist_ok=True);open(out,'w',encoding='utf-8').write(h);print(out,len(h.encode())//1024,'KB')
