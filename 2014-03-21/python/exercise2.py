'''
Created on 22/mar/2014

@author: Salvati Danilo
'''
from pyplasm import *

# Definisco le misure dell'edificio

external_octagon_radius = 20.82  # Raggio dell'ottagono esterno
wall_thickness = 2.50  # Spessore dei muri perimetrali
tower_radius = 3.95  # Raggio della circonferenza delle torrette
height = 20.50  # Altezza del castello
tower_height = 24  # Altezza delle torri
courtyard_radius = 8.93  # Raggio del cortile

# Definisco alcune utili funzioni per convertire coordinate polari in cartesiane

def x (p):
    u, v = p
    return v * COS(u)

def y (p):
    u, v = p
    return v * SIN(u)


# Costruisco un ottagono lungo la circonferenza di raggio r
def octagon (r):
    return [[x([i * (PI / 4), r]), y([i * (PI / 4), r])] for i in range(8)]

floor0 = JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius))))  # Pianta dell'ottagono esterno

# A questo punto definisco i pavimenti per le otto torrette
tower0 = JOIN (STRUCT(AA (MK) (octagon(tower_radius))))

# Definisco una funzione che crea le torrette nelle corrette posizioni
def build_tower(i): return T([1, 2])([external_octagon_radius * COS(i * PI / 4),
                                external_octagon_radius * SIN(i * PI / 4)]) (tower0)

towers_floor0 = STRUCT ([build_tower(i) for i in range(8)])  # Costruisco le otto torrette laterali

# Adesso costruisco il primo piano

courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius + wall_thickness))))
floor1 = DIFFERENCE([floor0, courtyard])
floor1 = T(3)(height / 2)(floor1)  # Pavimento del corpo centrale
towers_floor1 = T(3)(height / 2)(towers_floor0)  # Pavimento delle torri
# Costruisco il terzo piano (tetto)
internal_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius - wall_thickness))))
floor2 = DIFFERENCE ([JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius)))), internal_courtyard])
floor2 = T(3)(height)(floor2)
towers_floor2 = T(3)(tower_height)(towers_floor0)


# Coloro le varie porzioni fin qui ottenute
floor0 = COLOR (BLUE) (floor0)
towers_floor0 = COLOR (GREEN) (towers_floor0)
floor1 = COLOR (RED) (floor1)
towers_floor1 = COLOR (YELLOW) (towers_floor1)
floor2 = COLOR (ORANGE) (floor2)
towers_floor2 = COLOR (PURPLE) (towers_floor2)

# Definisco il mio modello 2.5D
two_and_half_model = STRUCT ([floor0, towers_floor0, floor1, towers_floor1, floor2, towers_floor2])

# VIEW (two_and_half_model)

# Adesso passiamo a generare i muri


# ## Per prima cosa faccio un modello bidimensionale della facciata est

# Costruisco un ottagono lungo la circonferenza di raggio r prendendo i lati da begin a end
def octagon_between (r, begin, end):
    return [[x([i * (PI / 4), r]), y([i * (PI / 4), r])] for i in range(begin, end)]

# Costruisco solo le torrette ad est
towers_east = STRUCT ([build_tower(i) for i in range(-1, 3)])  # Costruisco le otto torrette laterali
towers_east = PROD([SKELETON (1) (towers_east), Q(tower_height)])  # Trasformo in superficie

east_wall_points = octagon_between(external_octagon_radius, -1, 3)  # Punti delle mura esterne

east_external_wall1 = JOIN ([MK(east_wall_points[0]), MK(east_wall_points[1])])
east_external_wall2 = JOIN ([MK(east_wall_points[1]), MK(east_wall_points[2])])
east_external_wall3 = JOIN ([MK(east_wall_points[2]), MK(east_wall_points[3])])

east_external_wall = STRUCT([east_external_wall1, east_external_wall2, east_external_wall3])  # Costruisco il muro esterno bidimensionale

# Adesso costruisco nello stesso modo il muro interno
east_internal_wall_points = octagon_between(external_octagon_radius - wall_thickness, -1, 3)
east_internal_wall1 = JOIN ([MK(east_internal_wall_points[0]), MK(east_internal_wall_points[1])])
east_internal_wall2 = JOIN ([MK(east_internal_wall_points[1]), MK(east_internal_wall_points[2])])
east_internal_wall3 = JOIN ([MK(east_internal_wall_points[2]), MK(east_internal_wall_points[3])])

east_internal_wall = STRUCT([east_internal_wall1, east_internal_wall2, east_internal_wall3])  # Costruisco il muro esterno bidimensionale

east_wall = PROD ([STRUCT([east_external_wall, east_internal_wall]), Q(height)])

# Costruisco il cortile:

# Muro interno
east_courtyard_internal_wall_points = octagon_between(courtyard_radius - wall_thickness, -1, 3)
east_courtyard_internal_wall1 = JOIN ([MK(east_courtyard_internal_wall_points[0]), MK(east_courtyard_internal_wall_points[1])])
east_courtyard_internal_wall2 = JOIN ([MK(east_courtyard_internal_wall_points[1]), MK(east_courtyard_internal_wall_points[2])])
east_courtyard_internal_wall3 = JOIN ([MK(east_courtyard_internal_wall_points[2]), MK(east_courtyard_internal_wall_points[3])])

internal_courtyard_wall = STRUCT([east_courtyard_internal_wall1, east_courtyard_internal_wall2, east_courtyard_internal_wall3])  # Costruisco il muro esterno bidimensionale

# Muro esterno
east_courtyard_external_wall_points = octagon_between(courtyard_radius + wall_thickness, -1, 3)
east_courtyard_external_wall1 = JOIN ([MK(east_courtyard_external_wall_points[0]), MK(east_courtyard_external_wall_points[1])])
east_courtyard_external_wall2 = JOIN ([MK(east_courtyard_external_wall_points[1]), MK(east_courtyard_external_wall_points[2])])
east_courtyard_external_wall3 = JOIN ([MK(east_courtyard_external_wall_points[2]), MK(east_courtyard_external_wall_points[3])])

external_courtyard_wall = STRUCT([east_courtyard_external_wall1, east_courtyard_external_wall2, east_courtyard_external_wall3])  # Costruisco il muro esterno bidimensionale

east_courtyard_wall = PROD ([STRUCT([external_courtyard_wall, internal_courtyard_wall]), Q(height)])



# Creo le pareti divisorie

def build_corridor (i):
    corridor_wall1 = JOIN ([MK([COS(i * PI / 4) * (courtyard_radius + wall_thickness) - (wall_thickness / 2), SIN(i * PI / 4) * (courtyard_radius + wall_thickness) - (wall_thickness / 2)]),
                            MK([COS(i * PI / 4) * (external_octagon_radius - wall_thickness) - (wall_thickness / 2), SIN(i * PI / 4) * (external_octagon_radius - wall_thickness) - (wall_thickness / 2)])])
    corridor_wall2 = JOIN ([MK([COS(i * PI / 4) * (courtyard_radius + wall_thickness) + (wall_thickness / 2), SIN(i * PI / 4) * (courtyard_radius + wall_thickness) - (wall_thickness / 2)]),
                            MK([COS(i * PI / 4) * (external_octagon_radius - wall_thickness) + (wall_thickness / 2), SIN(i * PI / 4) * (external_octagon_radius - wall_thickness) - (wall_thickness / 2)])])
    corridor_wall1 = PROD([corridor_wall1, Q(height)])
    corridor_wall2 = PROD([corridor_wall2, Q(height)])
    return STRUCT([corridor_wall1, corridor_wall2])



east_corridor_wall1 = JOIN ([MK([courtyard_radius + wall_thickness, -wall_thickness / 2]),
                            MK([external_octagon_radius - wall_thickness, -wall_thickness / 2])])
east_corridor_wall2 = JOIN ([MK([courtyard_radius + wall_thickness, wall_thickness / 2]),
                            MK([external_octagon_radius - wall_thickness, wall_thickness / 2])])
east_corridor_wall1 = PROD([east_corridor_wall1, Q(height)])
east_corridor_wall2 = PROD([east_corridor_wall2, Q(height)])

east_corridor_wall = STRUCT([east_corridor_wall1, east_corridor_wall2])

east_corridor = STRUCT ([east_corridor_wall, build_corridor(1), build_corridor(2), build_corridor(-1)])

east = STRUCT ([east_wall, towers_east, east_courtyard_wall, east_corridor])

# Definisco alcuni elementi aggiuntivi

# Implemento il portone di ingresso

verts = [[18.20, 6.4], [17.4, 8.4]]
cells = [[1, 2]]
pols = None

door = MKPOL ([verts, cells, pols])
door = PROD ([door, Q(4)])

east = STRUCT ([east, door])

# ## Facciamo ora un modello della facciata ovest

towers_west = STRUCT ([build_tower(i) for i in range(3, 7)])  # Costruisco le otto torrette laterali
towers_west = PROD([SKELETON (1) (towers_west), Q(tower_height)])  # Trasformo in superficie

west_wall_points = octagon_between(external_octagon_radius, 3, 7)  # Punti delle mura esterne

west_external_wall1 = JOIN ([MK(west_wall_points[0]), MK(west_wall_points[1])])
west_external_wall2 = JOIN ([MK(west_wall_points[1]), MK(west_wall_points[2])])
west_external_wall3 = JOIN ([MK(west_wall_points[2]), MK(west_wall_points[3])])

west_external_wall = STRUCT([west_external_wall1, west_external_wall2, west_external_wall3])  # Costruisco il muro esterno bidimensionale

# Adesso costruisco nello stesso modo il muro interno
west_internal_wall_points = octagon_between(external_octagon_radius - wall_thickness, 3, 7)
west_internal_wall1 = JOIN ([MK(west_internal_wall_points[0]), MK(west_internal_wall_points[1])])
west_internal_wall2 = JOIN ([MK(west_internal_wall_points[1]), MK(west_internal_wall_points[2])])
west_internal_wall3 = JOIN ([MK(west_internal_wall_points[2]), MK(west_internal_wall_points[3])])

west_internal_wall = STRUCT([west_internal_wall1, west_internal_wall2, west_internal_wall3])  # Costruisco il muro esterno bidimensionale

west_wall = PROD ([STRUCT([west_external_wall, west_internal_wall]), Q(height)])

# Costruisco il cortile:

# Muro interno
west_courtyard_internal_wall_points = octagon_between(courtyard_radius - wall_thickness, 3, 7)
west_courtyard_internal_wall1 = JOIN ([MK(west_courtyard_internal_wall_points[0]), MK(west_courtyard_internal_wall_points[1])])
west_courtyard_internal_wall2 = JOIN ([MK(west_courtyard_internal_wall_points[1]), MK(west_courtyard_internal_wall_points[2])])
west_courtyard_internal_wall3 = JOIN ([MK(west_courtyard_internal_wall_points[2]), MK(west_courtyard_internal_wall_points[3])])

internal_courtyard_wall = STRUCT([west_courtyard_internal_wall1, west_courtyard_internal_wall2, west_courtyard_internal_wall3])  # Costruisco il muro esterno bidimensionale

# Muro esterno
west_courtyard_external_wall_points = octagon_between(courtyard_radius + wall_thickness, 3, 7)
west_courtyard_external_wall1 = JOIN ([MK(west_courtyard_external_wall_points[0]), MK(west_courtyard_external_wall_points[1])])
west_courtyard_external_wall2 = JOIN ([MK(west_courtyard_external_wall_points[1]), MK(west_courtyard_external_wall_points[2])])
west_courtyard_external_wall3 = JOIN ([MK(west_courtyard_external_wall_points[2]), MK(west_courtyard_external_wall_points[3])])

external_courtyard_wall = STRUCT([west_courtyard_external_wall1, west_courtyard_external_wall2, west_courtyard_external_wall3])  # Costruisco il muro esterno bidimensionale

west_courtyard_wall = PROD ([STRUCT([external_courtyard_wall, internal_courtyard_wall]), Q(height)])


# Creo le pareti divisorie

west_corridor_wall1 = JOIN ([MK([-courtyard_radius - wall_thickness, wall_thickness / 2]),
                            MK([-external_octagon_radius + wall_thickness, wall_thickness / 2])])
west_corridor_wall2 = JOIN ([MK([-courtyard_radius - wall_thickness, -wall_thickness / 2]),
                            MK([-external_octagon_radius + wall_thickness, -wall_thickness / 2])])
west_corridor_wall1 = PROD([west_corridor_wall1, Q(height)])
west_corridor_wall2 = PROD([west_corridor_wall2, Q(height)])

west_corridor_wall = STRUCT([west_corridor_wall1, west_corridor_wall2])

west_corridor = STRUCT ([build_corridor(3), west_corridor_wall, build_corridor(5), build_corridor(6)])


west = STRUCT ([west_wall, towers_west, west_courtyard_wall, west_corridor])

# ## Facciamo ora un modello della facciata sud

towers_south = STRUCT ([build_tower(i) for i in [1, 6, 7, 8]])  # Costruisco le otto torrette laterali
towers_south = PROD([SKELETON (1) (towers_south), Q(tower_height)])  # Trasformo in superficie

south_wall_points = octagon_between(external_octagon_radius, -2, 2)  # Punti delle mura esterne

south_external_wall1 = JOIN ([MK(south_wall_points[0]), MK(south_wall_points[1])])
south_external_wall2 = JOIN ([MK(south_wall_points[1]), MK(south_wall_points[2])])
south_external_wall3 = JOIN ([MK(south_wall_points[2]), MK(south_wall_points[3])])

south_external_wall = STRUCT([south_external_wall1, south_external_wall2, south_external_wall3])  # Costruisco il muro esterno bidimensionale

# Adesso costruisco nello stesso modo il muro interno
south_internal_wall_points = octagon_between(external_octagon_radius - wall_thickness, -2, 2)
south_internal_wall1 = JOIN ([MK(south_internal_wall_points[0]), MK(south_internal_wall_points[1])])
south_internal_wall2 = JOIN ([MK(south_internal_wall_points[1]), MK(south_internal_wall_points[2])])
south_internal_wall3 = JOIN ([MK(south_internal_wall_points[2]), MK(south_internal_wall_points[3])])

south_internal_wall = STRUCT([south_internal_wall1, south_internal_wall2, south_internal_wall3])  # Costruisco il muro esterno bidimensionale

south_wall = PROD ([STRUCT([south_external_wall, south_internal_wall]), Q(height)])

# Costruisco il cortile:

# Muro interno
south_courtyard_internal_wall_points = octagon_between(courtyard_radius - wall_thickness, -2, 2)
south_courtyard_internal_wall1 = JOIN ([MK(south_courtyard_internal_wall_points[0]), MK(south_courtyard_internal_wall_points[1])])
south_courtyard_internal_wall2 = JOIN ([MK(south_courtyard_internal_wall_points[1]), MK(south_courtyard_internal_wall_points[2])])
south_courtyard_internal_wall3 = JOIN ([MK(south_courtyard_internal_wall_points[2]), MK(south_courtyard_internal_wall_points[3])])

internal_courtyard_wall = STRUCT([south_courtyard_internal_wall1, south_courtyard_internal_wall2, south_courtyard_internal_wall3])  # Costruisco il muro esterno bidimensionale

# Muro esterno
south_courtyard_external_wall_points = octagon_between(courtyard_radius + wall_thickness, -2, 2)
south_courtyard_external_wall1 = JOIN ([MK(south_courtyard_external_wall_points[0]), MK(south_courtyard_external_wall_points[1])])
south_courtyard_external_wall2 = JOIN ([MK(south_courtyard_external_wall_points[1]), MK(south_courtyard_external_wall_points[2])])
south_courtyard_external_wall3 = JOIN ([MK(south_courtyard_external_wall_points[2]), MK(south_courtyard_external_wall_points[3])])

external_courtyard_wall = STRUCT([south_courtyard_external_wall1, south_courtyard_external_wall2, south_courtyard_external_wall3])  # Costruisco il muro esterno bidimensionale

south_courtyard_wall = PROD ([STRUCT([external_courtyard_wall, internal_courtyard_wall]), Q(height)])

# Creo le pareti divisorie

south_corridor_wall1 = JOIN ([MK([-courtyard_radius - wall_thickness, wall_thickness / 2]),
                            MK([-external_octagon_radius + wall_thickness, wall_thickness / 2])])
south_corridor_wall2 = JOIN ([MK([-courtyard_radius - wall_thickness, -wall_thickness / 2]),
                            MK([-external_octagon_radius + wall_thickness, -wall_thickness / 2])])
south_corridor_wall1 = PROD([south_corridor_wall1, Q(height)])
south_corridor_wall2 = PROD([south_corridor_wall2, Q(height)])

south_corridor_wall = STRUCT([south_corridor_wall1, south_corridor_wall2])

south_corridor = STRUCT ([east_corridor_wall, build_corridor(5), build_corridor(6), build_corridor(7)])


south = STRUCT ([south_wall, towers_south, south_courtyard_wall, south_corridor])


# ## Facciamo ora un modello della facciata nord

towers_north = STRUCT ([build_tower(i) for i in range(1, 5)])  # Costruisco le otto torrette laterali
towers_north = PROD([SKELETON (1) (towers_north), Q(tower_height)])  # Trasformo in superficie

north_wall_points = octagon_between(external_octagon_radius, 1, 5)  # Punti delle mura esterne

north_external_wall1 = JOIN ([MK(north_wall_points[0]), MK(north_wall_points[1])])
north_external_wall2 = JOIN ([MK(north_wall_points[1]), MK(north_wall_points[2])])
north_external_wall3 = JOIN ([MK(north_wall_points[2]), MK(north_wall_points[3])])

north_external_wall = STRUCT([north_external_wall1, north_external_wall2, north_external_wall3])  # Costruisco il muro esterno bidimensionale

# Adesso costruisco nello stesso modo il muro interno
north_internal_wall_points = octagon_between(external_octagon_radius - wall_thickness, 1, 5)
north_internal_wall1 = JOIN ([MK(north_internal_wall_points[0]), MK(north_internal_wall_points[1])])
north_internal_wall2 = JOIN ([MK(north_internal_wall_points[1]), MK(north_internal_wall_points[2])])
north_internal_wall3 = JOIN ([MK(north_internal_wall_points[2]), MK(north_internal_wall_points[3])])

north_internal_wall = STRUCT([north_internal_wall1, north_internal_wall2, north_internal_wall3])  # Costruisco il muro esterno bidimensionale

north_wall = PROD ([STRUCT([north_external_wall, north_internal_wall]), Q(height)])

# Costruisco il cortile:

# Muro interno
north_courtyard_internal_wall_points = octagon_between(courtyard_radius - wall_thickness, 1, 5)
north_courtyard_internal_wall1 = JOIN ([MK(north_courtyard_internal_wall_points[0]), MK(north_courtyard_internal_wall_points[1])])
north_courtyard_internal_wall2 = JOIN ([MK(north_courtyard_internal_wall_points[1]), MK(north_courtyard_internal_wall_points[2])])
north_courtyard_internal_wall3 = JOIN ([MK(north_courtyard_internal_wall_points[2]), MK(north_courtyard_internal_wall_points[3])])

internal_courtyard_wall = STRUCT([north_courtyard_internal_wall1, north_courtyard_internal_wall2, north_courtyard_internal_wall3])  # Costruisco il muro esterno bidimensionale

# Muro esterno
north_courtyard_external_wall_points = octagon_between(courtyard_radius + wall_thickness, 1, 5)
north_courtyard_external_wall1 = JOIN ([MK(north_courtyard_external_wall_points[0]), MK(north_courtyard_external_wall_points[1])])
north_courtyard_external_wall2 = JOIN ([MK(north_courtyard_external_wall_points[1]), MK(north_courtyard_external_wall_points[2])])
north_courtyard_external_wall3 = JOIN ([MK(north_courtyard_external_wall_points[2]), MK(north_courtyard_external_wall_points[3])])

external_courtyard_wall = STRUCT([north_courtyard_external_wall1, north_courtyard_external_wall2, north_courtyard_external_wall3])  # Costruisco il muro esterno bidimensionale

north_courtyard_wall = PROD ([STRUCT([external_courtyard_wall, internal_courtyard_wall]), Q(height)])

# Creo le pareti divisorie

north_corridor_wall1 = JOIN ([MK([-courtyard_radius - wall_thickness, wall_thickness / 2]),
                            MK([-external_octagon_radius + wall_thickness, wall_thickness / 2])])
north_corridor_wall2 = JOIN ([MK([-courtyard_radius - wall_thickness, -wall_thickness / 2]),
                            MK([-external_octagon_radius + wall_thickness, -wall_thickness / 2])])
north_corridor_wall1 = PROD([north_corridor_wall1, Q(height)])
north_corridor_wall2 = PROD([north_corridor_wall2, Q(height)])

north_corridor_wall = STRUCT([north_corridor_wall1, north_corridor_wall2])

north_corridor = STRUCT ([west_corridor_wall, build_corridor(1), build_corridor(2), build_corridor(3)])


north = STRUCT ([north_wall, towers_north, north_courtyard_wall, north_corridor])


mock_up_3D = STRUCT ([two_and_half_model, east, west, south, north])
VIEW (mock_up_3D)

