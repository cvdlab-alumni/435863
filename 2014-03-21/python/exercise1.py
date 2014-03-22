'''
Created on 21/mar/2014

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
internal_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius))))
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

VIEW (two_and_half_model)
