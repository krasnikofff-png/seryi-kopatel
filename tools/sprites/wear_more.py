# Гардероб: слои одежды поверх шести листов копателя (src/art/hero-det/1..6.png, 120×168, кадры 40×42).
# Каждая вещь — функция, которая перекрашивает или дорисовывает пиксели кадра по палитре базового листа:
# шапка (кепка), куртка, штаны, ботинки, рюкзак. В слой попадают только пиксели, одинаковые на всех шести листах,
# поэтому одна картинка-слой подходит к любому детектору.
# Запуск: python3 tools/sprites/wear_more.py [папка-для-превью]
from PIL import Image
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = ROOT + '/src/art/hero-det/'
OUT = (23, 18, 13)
CAP = {(118, 133, 63), (82, 94, 42)}
VISOR = (82, 94, 42)
JK, JKD = (93, 125, 56), (68, 96, 42)
PANTS = {(75, 108, 158), (56, 85, 127)}
PD = (56, 85, 127)
BOOT, SOLE = (113, 71, 42), (75, 46, 25)
PACK, PACKD = (142, 94, 51), (102, 64, 32)
HAIR = (59, 42, 31)
SKIN, SKIND = (234, 181, 140), (201, 142, 102)


def frames():
    for fy in range(4):
        for fx in range(3):
            yield fx, fy, fx * 40, fy * 42


class F:
    """Один кадр: маски частей тела и запись новых пикселей."""

    def __init__(s, px, fx, fy, ox, oy):
        s.px, s.fx, s.fy, s.ox, s.oy = px, fx, fy, ox, oy
        box = [(x, y) for y in range(oy, oy + 42) for x in range(ox, ox + 40)]
        s.col = {p: px[p][:3] for p in box if px[p][3]}
        s.new = {}
        pick = lambda cs: [p for p, c in s.col.items() if c in cs]
        s.cap = pick(CAP)
        s.jk = pick({JK, JKD})
        s.pants = pick(PANTS)
        s.boots = pick({BOOT, SOLE})
        s.pack = pick({PACK, PACKD}) if fy else []  # анфас: коричневое — лямки, не рюкзак
        s.side = fy in (1, 2)
        s.face = -1 if fy == 1 else 1 if fy == 2 else 0  # куда смотрит: влево −1, вправо +1

    def put(s, x, y, c):
        s.new[(x, y)] = c

    def rows(s, pts):
        r = {}
        for x, y in pts:
            r.setdefault(y, []).append(x)
        return {y: sorted(xs) for y, xs in sorted(r.items())}

    def free(s, x, y):
        return (x, y) not in s.col and (x, y) not in s.new

    def commit(s, outline=True):
        added = [p for p in s.new if p not in s.col]
        for p, c in s.new.items():
            s.px[p] = c + (255,)
        if outline:
            for x, y in added:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    q = (x + dx, y + dy)
                    if s.ox <= q[0] < s.ox + 40 and s.oy <= q[1] < s.oy + 42 and s.free(*q) and s.px[q][3] == 0:
                        s.px[q] = OUT + (255,)


def each(fn):
    def run(im):
        px = im.load()
        for fx, fy, ox, oy in frames():
            f = F(px, fx, fy, ox, oy)
            fn(f)
            f.commit()
        return im
    return run


def capbox(f):
    xs = [x for x, y in f.cap]
    ys = [y for x, y in f.cap]
    return min(xs), max(xs), min(ys), max(ys)


def visor_side(f):
    """В профиль козырёк кепки торчит вперёд — лишние пиксели перед лицом закрашиваем волосами/полями шапки."""
    return [p for p in f.cap if f.col[p] == VISOR]


# ---------------- ШАПКИ ----------------
@each
def helmet(f):
    if not f.cap:
        return
    H = [(46, 56, 40), (70, 84, 58), (98, 112, 80), (136, 150, 108)]
    x0, x1, top, bot = capbox(f)
    for x in range(x0 + 1, x1):
        f.put(x, top - 1, H[1])
    for x, y in f.cap:
        f.put(x, y, H[1])
    for y, xs in f.rows(f.cap).items():
        f.put(xs[0], y, H[2] if y < bot else H[0])
        f.put(xs[-1], y, H[0])
    # блик слева сверху
    f.put(x0 + 2, top, H[3])
    f.put(x0 + 1, top + 1, H[2])
    # поля каски — тёмный обод, по бокам чуть шире
    for x in range(x0 - 1, x1 + 2):
        f.put(x, bot, H[0])
    if not f.side:
        f.put(x0 - 1, bot + 1, H[0])
        f.put(x1 + 1, bot + 1, H[0])


@each
def panama(f):
    if not f.cap:
        return
    K = [(98, 90, 56), (140, 130, 84), (176, 164, 112), (206, 196, 146)]
    x0, x1, top, bot = capbox(f)
    for x, y in f.cap:
        f.put(x, y, K[2] if (x + y) % 5 else K[3])
    for y, xs in f.rows(f.cap).items():
        f.put(xs[-1], y, K[1])
    # тесьма над полями
    for x in range(x0 + 1, x1):
        f.put(x, bot - 1, K[0])
    # широкие мягкие поля по кругу
    for x in range(x0 - 1, x1 + 2):
        f.put(x, bot, K[1] if (x - x0) % 3 else K[2])
    f.put(x0 - 2, bot + 1, K[1])
    f.put(x1 + 2, bot + 1, K[1])
    for x in (x0 - 1, x1 + 1):
        f.put(x, bot + 1, K[0])


@each
def petushok(f):
    if not f.cap:
        return
    RED, REDD, WH, BL, BLD = (198, 54, 42), (148, 36, 30), (236, 230, 214), (52, 78, 156), (36, 54, 112)
    x0, x1, top, bot = capbox(f)
    for x, y in f.cap:
        f.put(x, y, WH if (y - top) == 1 else RED)
    for y, xs in f.rows(f.cap).items():
        f.put(xs[-1], y, REDD if (y - top) != 1 else (200, 196, 182))
    # отворот — синий, в рубчик
    for x, y in f.cap:
        if y == bot:
            f.put(x, y, BL if x % 2 else BLD)
    # острая макушка-«гребешок», в профиль заваливается назад
    mid = (x0 + x1) // 2
    back = -f.face
    if f.side:
        mid += back
    for x in (mid, mid + 1):
        f.put(x, top - 1, RED)
    f.put(mid + (1 if back >= 0 else 0), top - 2, REDD)
    f.put(mid + (1 if back >= 0 else 0) + (back if f.side else 0), top - 3, WH)


@each
def bandana(f):
    if not f.cap:
        return
    BK, BKD, WH = (44, 42, 48), (24, 24, 28), (232, 230, 220)
    x0, x1, top, bot = capbox(f)
    for x, y in f.cap:
        f.put(x, y, BK if (x * 3 + y) % 7 else (96, 94, 104))
    for y, xs in f.rows(f.cap).items():
        f.put(xs[-1], y, BKD)
    for x in range(x0, x1 + 1):
        if (x, bot) in f.col:
            f.put(x, bot, BKD)
    if f.side:
        # козырька нет: торчащие вперёд пиксели — чёлка из-под банданы
        for p in visor_side(f):
            if (p[0], p[1] + 1) not in f.col or f.col[(p[0], p[1] + 1)] in (OUT,):
                f.put(*p, HAIR)
        # хвостики узла на затылке
        bx = x1 if f.face < 0 else x0
        d = -f.face
        f.put(bx + d, bot, BK)
        f.put(bx + 2 * d, bot + 1, BK)
        f.put(bx + d, bot + 1, BKD)
    elif f.fy == 3:
        m = (x0 + x1) // 2
        f.put(m, bot + 1, BK)
        f.put(m + 1, bot + 1, BK)
        f.put(m, bot + 2, BKD)
        f.put(m + 1, bot + 3, BK)
    else:
        # череп спереди: белая «маска» с тёмными глазницами
        m = (x0 + x1) // 2
        for x in (m, m + 1):
            f.put(x, top + 1, WH)
            f.put(x, top + 2, WH)
        f.put(m, top + 2, BKD)
        f.put(m + 1, top + 2, BKD)


@each
def forester(f):
    if not f.cap:
        return
    G = [(26, 46, 32), (40, 68, 48), (58, 92, 66), (84, 120, 90)]
    VIS, GOLD = (22, 20, 18), (236, 196, 84)
    x0, x1, top, bot = capbox(f)
    rows = f.rows(f.cap)
    brim = rows[bot]
    if f.side:
        # тулья — ровный прямоугольник, козырёк — чёрный
        vis = set(visor_side(f))
        crown = [p for p in f.cap if p not in vis]
        cx0 = min(x for x, y in crown)
        cx1 = max(x for x, y in crown)
        for y in range(top - 1, bot):
            for x in range(cx0, cx1 + 1):
                f.put(x, y, G[2] if y == top - 1 else G[1])
        for x in range(cx0, cx1 + 1):
            f.put(x, bot - 1, G[0])
        for p in vis:
            f.put(*p, VIS)
        for x in range(cx0, cx1 + 1):
            if (x, bot) in f.col:
                f.put(x, bot, G[0])
        f.put(cx1 if f.face > 0 else cx0, bot - 1, GOLD)
    else:
        cx0, cx1 = brim[0], brim[-1]
        for y in range(top - 1, bot):
            for x in range(cx0, cx1 + 1):
                f.put(x, y, G[2] if y == top - 1 else G[1])
            f.put(cx1, y, G[0])
        for x in range(cx0, cx1 + 1):
            f.put(x, bot - 1, G[0])
        for x in brim:
            f.put(x, bot, VIS if f.fy == 0 else G[0])
        if f.fy == 0:
            m = (cx0 + cx1) // 2
            f.put(m, bot - 1, GOLD)
            f.put(m + 1, bot - 1, GOLD)
            f.put(m, top, (220, 60, 40))  # кокарда-звёздочка лесхоза


@each
def headlamp(f):
    if not f.cap:
        return
    K = [(44, 46, 52), (66, 68, 76), (92, 94, 104)]
    LAMP, LAMPD, BAND = (255, 236, 140), (60, 60, 64), (30, 30, 34)
    x0, x1, top, bot = capbox(f)
    for x, y in f.cap:
        f.put(x, y, K[1] if x % 2 else K[2])
    for y, xs in f.rows(f.cap).items():
        f.put(xs[-1], y, K[0])
    for x in range(x0 + 1, x1):
        f.put(x, top - 1, K[1])
    # резинка фонаря
    for x in range(x0, x1 + 1):
        if (x, bot) in f.col:
            f.put(x, bot, BAND)
    if f.side:
        for p in visor_side(f):
            f.put(*p, BAND)
        fx_ = min(x for x, y in visor_side(f)) if f.face < 0 else max(x for x, y in visor_side(f))
        f.put(fx_, bot, LAMP)
        f.put(fx_ - f.face, bot, LAMPD)
        f.put(fx_, bot - 1, LAMPD)
    elif f.fy == 0:
        m = (x0 + x1) // 2
        f.put(m, bot, LAMP)
        f.put(m + 1, bot, LAMP)
        f.put(m, bot - 1, LAMPD)
        f.put(m + 1, bot - 1, LAMPD)
    else:
        m = (x0 + x1) // 2
        f.put(m, bot, LAMPD)
        f.put(m + 1, bot, LAMPD)


# ---------------- КУРТКИ ----------------
def recolor_jk(f, fn):
    if not f.jk:
        return
    ys = [y for x, y in f.jk]
    top, bot = min(ys), max(ys)
    rows = f.rows(f.jk)
    for x, y in f.jk:
        xs = rows[y]
        fn(x, y, f.col[(x, y)] == JKD, top, bot, x == xs[0] or x == xs[-1])


@each
def vatnik(f):
    C, D, S = (70, 78, 92), (48, 54, 66), (56, 62, 76)
    recolor_jk(f, lambda x, y, d, t, b, e: f.put(x, y, D if d else (S if (y - t) % 2 == 1 else C)))


@each
def telnyashka(f):
    W, WD, B, BD = (236, 236, 240), (190, 192, 204), (44, 64, 132), (30, 44, 98)
    recolor_jk(f, lambda x, y, d, t, b, e: f.put(x, y, (BD if d else B) if (y - t) % 2 else (WD if d else W)))


@each
def ozk(f):
    C, D, L = (98, 112, 80), (70, 82, 56), (130, 144, 104)
    recolor_jk(f, lambda x, y, d, t, b, e: f.put(x, y, D if d else (L if (x + y) % 6 == 0 else C)))
    if not f.jk or not f.pants:
        return
    # плащ длиннее куртки: закрывает верх штанов на два ряда
    pr = f.rows(f.pants)
    ptop = min(pr)
    for y in (ptop, ptop + 1):
        if y in pr:
            xs = pr[y]
            for x in range(xs[0], xs[-1] + 1):
                f.put(x, y, D if x in (xs[0], xs[-1]) or y == ptop + 1 else C)
    if not f.side:
        xs = pr[ptop + 1] if ptop + 1 in pr else pr[ptop]
        f.put(xs[0] - 1, ptop + 1, D)
        f.put(xs[-1] + 1, ptop + 1, D)


@each
def olimpiyka(f):
    B, BD, W = (42, 66, 160), (28, 44, 112), (236, 236, 240)
    recolor_jk(f, lambda x, y, d, t, b, e: f.put(x, y, W if e and y > t else (BD if d else B)))
    if f.fy == 0 and f.jk:
        ys = [y for x, y in f.jk]
        xs = [x for x, y in f.jk]
        m = (min(xs) + max(xs)) // 2
        for y in range(min(ys), max(ys) + 1):
            if (m, y) in f.col and f.col[(m, y)] in (JK, JKD):
                f.put(m, y, (200, 200, 210))
        # воротник-стойка
        for x, y in f.jk:
            if y == min(ys):
                f.put(x, y, W)


@each
def vest(f):
    K, KD, PK = (170, 154, 100), (124, 110, 66), (92, 80, 46)

    def go(x, y, d, t, b, e):
        if e:
            return
        f.put(x, y, KD if d else (PK if (y - t) in (2, 4) and x % 2 else K))

    recolor_jk(f, go)


@each
def deer(f):
    R, RD, W = (180, 46, 44), (130, 30, 32), (236, 230, 220)

    def go(x, y, d, t, b, e):
        r = y - t
        if r == 2 and x % 2 == 0:
            f.put(x, y, W if not d else (200, 192, 182))
        elif r == 0 and not e:
            f.put(x, y, W)
        else:
            f.put(x, y, RD if d else R)

    recolor_jk(f, go)


@each
def gimnast(f):
    K, KD, BELT, BUCK, COL = (150, 140, 92), (112, 104, 64), (88, 56, 30), (226, 186, 84), (124, 114, 72)
    recolor_jk(f, lambda x, y, d, t, b, e: f.put(x, y, BELT if y == b and not e else (COL if y == t else (KD if d else K))))
    if f.jk and f.fy == 0:
        ys = [y for x, y in f.jk]
        xs = [x for x, y in f.jk]
        m = (min(xs) + max(xs)) // 2
        f.put(m, max(ys), BUCK)
        f.put(m + 1, max(ys), BUCK)


# ---------------- ШТАНЫ ----------------
def prow(f):
    return f.rows(f.pants)


@each
def flora(f):
    C = [(110, 122, 74), (84, 98, 56), (136, 108, 66), (64, 76, 46)]
    for x, y in f.pants:
        d = f.col[(x, y)] == PD
        k = (x + (y // 2)) % 3
        f.put(x, y, C[3] if d else C[2] if k == 0 else C[0] if k == 1 else C[1])


@each
def treniki(f):
    B, BD, W = (40, 46, 82), (28, 30, 56), (236, 236, 240)
    r = prow(f)
    for x, y in f.pants:
        d = f.col[(x, y)] == PD
        xs = r[y]
        lamp = (x in (xs[0], xs[-1])) if not f.side else d
        f.put(x, y, W if lamp else (BD if d else B))


@each
def zabrody(f):
    R, RD, RL, SO = (62, 72, 48), (42, 50, 32), (90, 102, 68), (28, 30, 22)
    for x, y in f.pants + f.boots:
        c = f.col[(x, y)]
        f.put(x, y, SO if c == SOLE else RD if c in (PD, BOOT) and (x + y) % 2 else RL if (x * 5 + y) % 9 == 0 else R)
    if f.pants:
        r = prow(f)
        top = min(r)
        # нагрудник поверх куртки
        for x in r[top][1:-1]:
            if (x, top - 1) in f.col and f.col[(x, top - 1)] in (JK, JKD):
                f.put(x, top - 1, R)


@each
def shorts(f):
    K, KD = (176, 156, 104), (134, 116, 74)
    r = prow(f)
    if not r:
        return
    top = min(r)
    for x, y in f.pants:
        d = f.col[(x, y)] == PD
        if y - top < 2:
            f.put(x, y, KD if d else K)
        else:
            f.put(x, y, SKIND if d else SKIN)


@each
def galife(f):
    K, KD, BK, BKL = (134, 124, 80), (100, 92, 56), (36, 32, 30), (74, 68, 64)
    r = prow(f)
    if not r:
        return
    top, low = min(r), max(r)
    for x, y in f.pants:
        d = f.col[(x, y)] == PD
        f.put(x, y, BK if y == low else (KD if d else K))
    for x, y in f.boots:
        f.put(x, y, BKL if (x + y) % 4 == 0 and f.col[(x, y)] == BOOT else BK)
    # «уши» галифе — расширение на бёдрах
    y = top + 1
    if y in r:
        xs = r[y]
        if f.side:
            bx = xs[-1] + 1 if f.face < 0 else xs[0] - 1
            f.put(bx, y, K)
        else:
            f.put(xs[0] - 1, y, K)
            f.put(xs[-1] + 1, y, KD)


# ---------------- РЮКЗАКИ (видно сбоку и со спины) ----------------
def packbox(f):
    xs = [x for x, y in f.pack]
    ys = [y for x, y in f.pack]
    return min(xs), max(xs), min(ys), max(ys)


@each
def meshok(f):
    if not f.pack:
        return
    K, KD, RP = (146, 134, 88), (108, 98, 60), (60, 44, 26)
    x0, x1, top, bot = packbox(f)
    for x, y in f.pack:
        f.put(x, y, KD if f.col[(x, y)] == PACKD or y == bot else K)
    # горловина на завязке
    m = (x0 + x1) // 2
    if f.side:
        f.put(m, top - 1, K)
        f.put(m, top - 2, RP)
    else:
        for x in range(x0 + 1, x1):
            f.put(x, top, KD)
        f.put(m, top - 1, RP)
        f.put(m + 1, top - 1, K)


@each
def ermak(f):
    if not f.pack:
        return
    O, OD, ST, MAT, MATD = (214, 98, 40), (152, 62, 26), (44, 36, 30), (92, 136, 196), (60, 96, 150)
    x0, x1, top, bot = packbox(f)
    for x, y in f.pack:
        f.put(x, y, OD if f.col[(x, y)] == PACKD else O)
    # выше на ряд и пенка-«коврик» сверху
    for x in range(x0, x1 + 1):
        f.put(x, top - 1, O)
    for x in range(x0 - 1, x1 + 2):
        f.put(x, top - 2, MAT if x % 2 else MATD)
    if f.side:
        bx = x1 + 1 if f.face < 0 else x0 - 1
        for y in range(top - 1, bot + 1):
            f.put(bx, y, OD)
    else:
        for y in range(top, bot + 1):
            f.put(x0 + 1, y, ST)
            f.put(x1 - 1, y, ST)


@each
def baul(f):
    if not f.pack:
        return
    R, B, W = (190, 52, 50), (54, 76, 158), (236, 232, 224)
    x0, x1, top, bot = packbox(f)
    pts = list(f.pack)
    for x in range(x0, x1 + 1):
        pts.append((x, bot + 1))
    if f.side:
        bx = x1 + 1 if f.face < 0 else x0 - 1
        pts += [(bx, y) for y in range(top, bot + 2)]
    for x, y in pts:
        f.put(x, y, [[R, W], [B, R]][y % 2][x % 2])


ITEMS = {
    'ov-helmet': helmet, 'ov-panama': panama, 'ov-petushok': petushok, 'ov-bandana': bandana,
    'ov-forester': forester, 'ov-headlamp': headlamp,
    'ov-vatnik': vatnik, 'ov-telnyashka': telnyashka, 'ov-ozk': ozk, 'ov-olimpiyka': olimpiyka,
    'ov-vest': vest, 'ov-deer': deer, 'ov-gimnast': gimnast,
    'ov-flora': flora, 'ov-treniki': treniki, 'ov-zabrody': zabrody, 'ov-shorts': shorts, 'ov-galife': galife,
    'ov-meshok': meshok, 'ov-ermak': ermak, 'ov-baul': baul,
}

if __name__ == '__main__':
    base = [Image.open(SRC + f'{n}.png').convert('RGBA') for n in range(1, 7)]
    W, H = base[0].size
    B = [b.load() for b in base]

    def stable(x, y):
        p = B[0][x, y]
        return all(b[x, y] == p for b in B[1:])

    prev = sys.argv[1] if len(sys.argv) > 1 else None
    for name, fn in ITEMS.items():
        m = fn(base[0].copy()).load()
        o = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        op = o.load()
        n = 0
        for y in range(H):
            for x in range(W):
                if m[x, y] != B[0][x, y] and stable(x, y):
                    op[x, y] = m[x, y]
                    n += 1
        o.save(SRC + name + '.png')
        print(name, n)
