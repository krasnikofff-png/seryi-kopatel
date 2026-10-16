# Иконки гардероба 32×32 (в интерфейсе — 34 px). Рисуются тем же набором, что и иконки находок (lib.py).
# Запуск: python3 tools/sprites/wear_icons.py
import os, sys
sys.path.insert(0, '/home/claude/spr')
from lib import C, P

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = ROOT + '/src/art/ui'


def pal(name, *cols):
    P[name] = list(cols)
    return name


KH = pal('kh', (98, 90, 56), (140, 130, 84), (176, 164, 112), (206, 196, 146))
HE = pal('he', (46, 56, 40), (70, 84, 58), (98, 112, 80), (136, 150, 108))
RD = pal('rd', (120, 30, 26), (180, 46, 40), (210, 70, 56), (236, 120, 100))
BL = pal('bl', (30, 44, 98), (44, 64, 132), (70, 96, 170), (120, 146, 210))
WH = pal('wh', (170, 170, 176), (214, 214, 220), (236, 236, 240), (250, 250, 252))
BK = pal('bk', (20, 20, 24), (40, 40, 46), (62, 62, 70), (96, 96, 106))
FG = pal('fg', (26, 46, 32), (40, 68, 48), (58, 92, 66), (84, 120, 90))
VT = pal('vt', (40, 44, 54), (60, 66, 80), (78, 86, 100), (104, 112, 128))
OZ = pal('oz', (56, 66, 44), (82, 96, 66), (106, 120, 86), (140, 154, 114))
GY = pal('gy', (40, 42, 48), (62, 64, 72), (88, 90, 100), (120, 122, 132))
RB = pal('rb', (30, 36, 24), (48, 56, 38), (66, 76, 52), (96, 108, 74))
SK = pal('sk', (160, 104, 72), (201, 142, 102), (234, 181, 140), (246, 210, 176))
OR = pal('or', (120, 50, 20), (170, 74, 30), (214, 98, 40), (240, 140, 80))
MT = pal('mt', (44, 70, 120), (60, 96, 150), (92, 136, 196), (140, 176, 226))


def jacket_shape(c, mat):
    c.poly([(8, 6), (24, 6), (28, 10), (28, 29), (4, 29), (4, 10)], mat, flat=True)
    c.rect(1, 10, 5, 27, mat, flat=True)
    c.rect(27, 10, 31, 27, mat, flat=True)


def pants_shape(c, mat):
    c.rect(7, 3, 25, 7, mat, flat=True)
    return c.poly([(7, 7), (25, 7), (26, 29), (18, 29), (16, 13), (14, 29), (6, 29)], mat, flat=True)


# ---- шапки ----
def helmet(c):
    c.ell(16, 17, 12, 11, HE)
    c.erase(lambda x, y: y > 19)
    c.rect(2, 19, 29, 21, HE, flat=True)
    c.segs(3, 21, 28, 21, HE, 0)
    c.dots([(10, 9), (11, 8), (12, 8)], P[HE][3])
    c.ell(22, 14, 1.5, 1.5, HE, flat=True)


def panama(c):
    c.ell(16, 15, 9, 8, KH)
    c.erase(lambda x, y: y > 17)
    c.rect(7, 15, 25, 17, KH, flat=True)
    c.segs(7, 16, 25, 16, KH, 0)
    c.ell(16, 20, 15, 4, KH)
    c.ell(16, 18.5, 9, 2, KH, flat=True)
    c.dots([(11, 10), (20, 12)], P[KH][3])


def petushok(c):
    c.poly([(5, 26), (8, 12), (13, 5), (17, 2), (20, 6), (25, 13), (27, 26)], RD, flat=True)
    for y in (12, 13, 18, 19):
        c.segs(4, y, 28, y, WH, 2)
    c.rect(4, 22, 28, 28, BL, flat=True)
    for x in range(5, 28, 2):
        c.segs(x, 22, x, 28, BL, 0)
    c.dots([(17, 2), (18, 3)], P[WH][3])


def bandana(c):
    c.ell(16, 16, 12, 10, BK)
    c.erase(lambda x, y: y > 20)
    c.rect(4, 18, 28, 21, BK, flat=True)
    c.poly([(26, 18), (31, 25), (28, 27), (25, 21)], BK, flat=True)
    c.poly([(24, 19), (27, 28), (24, 29), (22, 21)], BK, flat=True)
    # череп
    c.ell(14, 12, 4, 3.5, WH, flat=True)
    c.rect(12, 15, 16, 17, WH, flat=True)
    c.dots([(12, 12), (13, 12), (15, 12), (16, 12)], P[BK][0])
    c.dots([(13, 16), (15, 16)], P[BK][1])
    for x, y in ((6, 19), (9, 20), (20, 19), (24, 20), (8, 8), (22, 8)):
        c.dot(x, y, P[BK][3])


def forester(c):
    c.poly([(2, 7), (30, 7), (27, 17), (5, 17)], FG)
    c.rect(5, 15, 27, 19, FG, flat=True)
    c.segs(5, 16, 27, 16, FG, 0)
    c.poly([(6, 19), (26, 19), (24, 25), (8, 25)], BK, flat=True)
    c.segs(8, 21, 24, 21, BK, 3)
    c.star(16, 12, 3.2, 1.4, 'gold')
    c.dot(16, 12, (220, 60, 40))


def headlamp(c):
    c.ell(16, 16, 11, 10, GY)
    c.erase(lambda x, y: y > 20)
    for x in range(6, 27, 2):
        c.segs(x, 7, x, 20, GY, 3)
    c.rect(4, 18, 28, 21, BK, flat=True)
    c.rrect(11, 16, 21, 24, 2, 'steel', flat=True)
    c.ell(16, 20, 3, 3, 'gold', flat=True)
    c.dots([(15, 19), (16, 19)], (255, 250, 210))


# ---- куртки ----
def vatnik(c):
    jacket_shape(c, VT)
    for y in range(9, 29, 3):
        c.segs(1, y, 31, y, VT, 0)
    c.segs(16, 7, 16, 29, VT, 0)
    c.poly([(9, 6), (16, 10), (23, 6), (23, 4), (9, 4)], VT, flat=True)
    c.dots([(14, 13), (14, 19), (14, 25)], P[BK][1])


def telnyashka(c):
    jacket_shape(c, WH)
    for y in range(7, 30, 3):
        c.segs(1, y, 31, y, BL, 1)
        c.segs(1, y + 1, 31, y + 1, BL, 1)
    c.poly([(12, 6), (16, 10), (20, 6)], SK, flat=True)


def ozk(c):
    c.poly([(9, 3), (23, 3), (28, 9), (30, 30), (2, 30), (4, 9)], OZ)
    c.ell(16, 5, 7, 4, OZ)
    c.ell(16, 7, 4, 2.5, BK, flat=True)
    c.segs(16, 10, 16, 30, OZ, 0)
    c.dots([(14, 14), (14, 20), (14, 26)], P[OZ][0])
    c.segs(9, 12, 7, 28, OZ, 3)


def olimpiyka(c):
    jacket_shape(c, BL)
    for x in (2, 4, 28, 30):
        c.segs(x, 11, x, 27, WH, 2)
    c.segs(16, 6, 16, 29, WH, 1)
    c.rect(9, 3, 23, 6, BL, flat=True)
    c.segs(9, 3, 23, 3, WH, 2)
    c.rect(4, 27, 28, 29, BL, flat=True)


def vest(c):
    c.rect(1, 10, 5, 27, 'olive', flat=True)
    c.rect(27, 10, 31, 27, 'olive', flat=True)
    c.poly([(8, 6), (24, 6), (28, 10), (28, 29), (4, 29), (4, 10)], KH, flat=True)
    c.poly([(12, 6), (16, 13), (20, 6)], 'olive', flat=True)
    c.segs(16, 13, 16, 29, KH, 0)
    for x0 in (6, 19):
        for y0 in (14, 21):
            c.rect(x0, y0, x0 + 6, y0 + 4, KH, flat=True)
            c.segs(x0, y0, x0 + 6, y0, KH, 0)


def deer(c):
    jacket_shape(c, RD)
    c.rect(9, 3, 23, 6, RD, flat=True)
    c.segs(9, 4, 23, 4, WH, 2)
    for x in range(2, 31, 2):
        c.dot(x, 12, P[WH][2])
        c.dot(x + 1, 13, P[WH][2])
    # олень
    c.rect(11, 18, 20, 21, WH, flat=True)
    c.segs(12, 22, 12, 25, WH, 2, only=False)
    c.segs(19, 22, 19, 25, WH, 2, only=False)
    c.segs(20, 17, 22, 15, WH, 2, only=False)
    c.dots([(22, 14), (21, 13), (23, 13), (23, 12)], P[WH][2])
    for x in range(2, 31, 2):
        c.dot(x, 28, P[WH][2])


def gimnast(c):
    jacket_shape(c, KH)
    c.rect(10, 3, 22, 6, KH, flat=True)
    c.segs(10, 3, 22, 3, KH, 0)
    c.segs(16, 6, 16, 14, KH, 0)
    c.dots([(15, 8), (15, 11)], P['brass'][2])
    c.rect(4, 22, 28, 24, 'wood', flat=True)
    c.rect(14, 21, 18, 25, 'brass', flat=True)
    c.dot(16, 16, (200, 40, 40))
    for x0 in (6, 20):
        c.rect(x0, 10, x0 + 5, 13, KH, flat=True)
        c.segs(x0, 10, x0 + 5, 10, KH, 0)


# ---- штаны ----
def flora(c):
    m = pants_shape(c, 'olive')
    for x, y in m:
        k = (x + y // 2) % 6
        if k < 2:
            c.px[y][x] = (136, 108, 66)
        elif k == 3:
            c.px[y][x] = (64, 76, 46)
    c.rect(7, 3, 25, 4, 'wood', flat=True)


def treniki(c):
    pants_shape(c, BL)
    c.mark([(x, y) for y in range(3, 30) for x in range(6, 27) if c.px[y][x] is not None], BL, 0)
    c.segs(7, 7, 6, 29, WH, 2)
    c.segs(25, 7, 26, 29, WH, 2)
    c.rect(7, 3, 25, 5, BL, flat=True)
    c.segs(16, 3, 16, 7, WH, 3)


def zabrody(c):
    c.rect(9, 1, 23, 9, RB, flat=True)
    c.segs(10, 0, 8, 0, RB, 1, only=False)
    c.line(10, 1, 7, -2, 1.5, RB, flat=True)
    c.line(22, 1, 25, -2, 1.5, RB, flat=True)
    c.poly([(7, 8), (25, 8), (26, 25), (18, 25), (16, 13), (14, 25), (6, 25)], RB)
    c.rect(4, 25, 15, 30, RB, flat=True)
    c.rect(17, 25, 28, 30, RB, flat=True)
    c.segs(4, 30, 15, 30, BK, 0)
    c.segs(17, 30, 28, 30, BK, 0)
    c.dots([(15, 4), (17, 4)], P['brass'][2])


def shorts(c):
    c.rect(7, 3, 25, 7, KH, flat=True)
    c.poly([(7, 7), (25, 7), (27, 19), (18, 19), (16, 12), (14, 19), (5, 19)], KH, flat=True)
    c.segs(16, 8, 16, 12, KH, 0)
    c.rect(7, 3, 25, 4, 'wood', flat=True)
    c.rect(7, 12, 11, 15, KH, flat=True)
    c.segs(7, 12, 11, 12, KH, 0)
    c.rect(7, 20, 13, 28, SK, flat=True)
    c.rect(19, 20, 25, 28, SK, flat=True)


def galife(c):
    c.rect(9, 2, 23, 6, KH, flat=True)
    c.poly([(9, 6), (23, 6), (29, 13), (25, 21), (18, 21), (16, 12), (14, 21), (7, 21), (3, 13)], KH)
    c.rect(6, 21, 14, 30, BK, flat=True)
    c.rect(18, 21, 26, 30, BK, flat=True)
    c.segs(7, 22, 7, 29, BK, 3)
    c.segs(19, 22, 19, 29, BK, 3)
    c.rect(9, 2, 23, 3, 'wood', flat=True)


# ---- рюкзаки ----
def pack(c):
    c.rrect(6, 6, 26, 30, 4, 'wood')
    c.rrect(8, 3, 24, 12, 3, 'wood')
    c.segs(8, 12, 24, 12, 'wood', 0)
    c.rect(10, 17, 22, 24, 'wood', flat=True)
    c.segs(10, 17, 22, 17, 'wood', 0)
    c.rect(15, 11, 17, 14, 'brass', flat=True)


def meshok(c):
    c.ell(16, 20, 12, 10, KH)
    c.poly([(10, 12), (22, 12), (19, 6), (13, 6)], KH, flat=True)
    c.segs(11, 9, 21, 9, 'wood', 1, only=False)
    c.line(21, 9, 26, 4, 1.5, 'wood', flat=True)
    c.ell(13, 4, 2, 2, KH, flat=True)
    c.ell(19, 4, 2, 2, KH, flat=True)
    c.segs(8, 22, 24, 22, KH, 0)


def ermak(c):
    c.rrect(5, 8, 27, 30, 3, OR)
    c.rect(3, 2, 29, 7, MT, flat=True)
    for x in range(4, 29, 2):
        c.segs(x, 2, x, 7, MT, 0)
    c.segs(10, 8, 10, 30, BK, 1)
    c.segs(22, 8, 22, 30, BK, 1)
    c.rect(9, 18, 23, 26, OR, flat=True)
    c.segs(9, 18, 23, 18, OR, 0)


def baul(c):
    m = c.rect(2, 9, 30, 29, RD, flat=True)
    for x, y in m:
        c.px[y][x] = [[P[RD][1], P[WH][2]], [P[BL][1], P[RD][1]]][(y // 2) % 2][(x // 2) % 2]
    c.segs(2, 9, 30, 9, 'black', 1)
    c.line(9, 9, 12, 3, 2, BK, flat=True)
    c.line(23, 9, 20, 3, 2, BK, flat=True)
    c.segs(12, 3, 20, 3, BK, 1)


ICONS = {
    'w-helmet': (helmet, 41), 'w-panama': (panama, 42), 'w-petushok': (petushok, 43), 'w-bandana': (bandana, 44),
    'w-forester': (forester, 45), 'w-headlamp': (headlamp, 46),
    'w-vatnik': (vatnik, 47), 'w-telnyashka': (telnyashka, 48), 'w-ozk': (ozk, 49), 'w-olimpiyka': (olimpiyka, 50),
    'w-vest': (vest, 51), 'w-deer': (deer, 52), 'w-gimnast': (gimnast, 53),
    'w-flora': (flora, 54), 'w-treniki': (treniki, 55), 'w-zabrody': (zabrody, 56), 'w-shorts': (shorts, 57),
    'w-galife': (galife, 58), 'w-pack': (pack, 59), 'w-meshok': (meshok, 60), 'w-ermak': (ermak, 61), 'w-baul': (baul, 62),
}
if __name__ == '__main__':
    for n, (fn, seed) in ICONS.items():
        cc = C(seed=seed)
        fn(cc)
        cc.img().save(f'{OUT}/{n}.png')
    print(len(ICONS), 'icons')
