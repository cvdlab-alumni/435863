'''
Created on 22/mar/2014

@author: Salvati Danilo
'''
from pyplasm import *
# Non riutilizzo completamente tutte le strutture dell'esercizio 2 per sfruttare meglio la simmetria dell'edificio

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

# Definisco la parte esterna del castello

floor0 = JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius))))  # Pianta dell'ottagono esterno
floor0_internal = JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius - wall_thickness))))

external_building = PROD ([DIFFERENCE ([floor0, floor0_internal]), Q(height)])

# Definisco il cortile interno
external_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius + wall_thickness))))
internal_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius))))

internal_building = PROD ([DIFFERENCE ([external_courtyard, internal_courtyard]), Q(height)])


# Costruisco le otto torrette (per il modello 3D abbellisco leggermente le torrette)

tower_basement0 = JOIN (STRUCT(AA (MK) (octagon(tower_radius))))
# La torretta e' un pochino piu' stretta della base
tower0 = JOIN (STRUCT(AA (MK) (octagon(tower_radius - 1))))

def build_tower(i): return T([1, 2])([external_octagon_radius * COS(i * PI / 4),
                                external_octagon_radius * SIN(i * PI / 4)]) (tower0)

# Costruisco le basi per le torri
def build_tower_basement(i): return T([1, 2])([external_octagon_radius * COS(i * PI / 4),
                                      external_octagon_radius * SIN(i * PI / 4)]) (tower_basement0)

towers_floor0 = STRUCT ([build_tower(i) for i in range(8)])  # Costruisco le otto torrette laterali
towers_basement0 = STRUCT ([build_tower_basement(i) for i in range(8)])  # Costruisco le otto torrette laterali

towers_basement_3D = PROD([towers_basement0, QUOTE([1.5, -1.5 - height / 2, 0.8])])

towers_3D = STRUCT([towers_basement_3D, PROD([towers_floor0, QUOTE([-1.5, tower_height - 1.5])])])


# Aggiungo i pavimenti alla mia struttura

floor1 = DIFFERENCE([JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius + 1)))), external_courtyard])
# Assegno a floor1 uno spessore
floor1 = PROD ([floor1, Q(1)])
floor1 = T(3)((height / 2) + 2.5)(floor1)  # Pavimento del corpo centrale

towers_floor1 = T(3)((height / 2) + 1.5)(towers_floor0)  # Pavimento delle torri

# Costruisco il terzo piano (tetto)
floor2 = DIFFERENCE ([JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius)))), internal_courtyard])
floor2 = T(3)(height)(floor2)
towers_floor2 = T(3)(tower_height)(towers_floor0)

# Aggiundo i muri dei corridoi

def build_corridor (i):
    corridor_wall1 = JOIN ([MK([COS(i * PI / 4) * (courtyard_radius + wall_thickness) - (wall_thickness / 4), SIN(i * PI / 4) * (courtyard_radius + wall_thickness) - (wall_thickness / 2) + 1]),
                            MK([COS(i * PI / 4) * (external_octagon_radius - wall_thickness) - (wall_thickness / 4), SIN(i * PI / 4) * (external_octagon_radius - wall_thickness) - (wall_thickness / 2) + 1])])
    corridor_wall2 = JOIN ([MK([COS(i * PI / 4) * (courtyard_radius + wall_thickness) + (wall_thickness / 4), SIN(i * PI / 4) * (courtyard_radius + wall_thickness) - (wall_thickness / 2) + 1]),
                            MK([COS(i * PI / 4) * (external_octagon_radius - wall_thickness) + (wall_thickness / 4), SIN(i * PI / 4) * (external_octagon_radius - wall_thickness) - (wall_thickness / 2) + 1])])
    return JOIN ([corridor_wall1, corridor_wall2])


# Per problemi di approssimazione con le misure, disegno a parte i due corridoi a est e ad ovest
east_corridor_wall1 = JOIN ([MK([courtyard_radius + wall_thickness, -wall_thickness / 4]),
                            MK([external_octagon_radius - wall_thickness, -wall_thickness / 4])])
east_corridor_wall2 = JOIN ([MK([courtyard_radius + wall_thickness, wall_thickness / 4]),
                            MK([external_octagon_radius - wall_thickness, wall_thickness / 4])])

west_corridor_wall1 = JOIN ([MK([-courtyard_radius - wall_thickness, wall_thickness / 4]),
                            MK([-external_octagon_radius + wall_thickness, wall_thickness / 4])])
west_corridor_wall2 = JOIN ([MK([-courtyard_radius - wall_thickness, -wall_thickness / 4]),
                            MK([-external_octagon_radius + wall_thickness, -wall_thickness / 4])])

east_corridor_wall = JOIN ([east_corridor_wall1, east_corridor_wall2])
west_corridor_wall = JOIN ([west_corridor_wall1, west_corridor_wall2])


corridor = STRUCT ([east_corridor_wall, build_corridor(1), build_corridor(2), build_corridor(3), west_corridor_wall, build_corridor(5), build_corridor(6), build_corridor(7)])
corridor = PROD ([corridor, Q(height)])

VIEW(STRUCT([external_building, internal_building,towers_3D,corridor]))

# Aggiungo la porta di ingresso

verts = [[18.20, 6.4], [17.4, 8.4]]
cells = [[1, 2]]
pols = None


door = PROD ([MKPOL ([verts, cells, pols]), Q(4)])

# Aggiungo una finestra

window = PROD ([MKPOL ([verts, cells, pols]), QUOTE([-15, 3])])

# Ridefinisco il colore per il portone di ingresso
BROWN = Color4f([0.64, 0.32, 0, 1.0])

# Ridefinisco il colore per il castello

CASTLE_COLOR = Color4f([1, 0.93, 0.84, 1.0])

# Ridefinisco il colore per le finestre
SKY_BLUE = Color4f([0.8, 0.95, 1, 1.0])

door = COLOR (BROWN) (door)
window = COLOR (SKY_BLUE) (window)

castle = COLOR (CASTLE_COLOR) (STRUCT([external_building, internal_building, towers_3D, floor0, floor1, towers_floor1, floor2, corridor]))

# Genero il modello finale tridimensionale
solid_model_3D = STRUCT ([door, window, castle])
# solid_model_3D = COLOR(RED)(solid_model_3D)

VIEW (solid_model_3D)
