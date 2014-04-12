'''
Created on 11/apr/2014

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

##############################################################################
############################ FUNZIONI DI UTILITA' ############################
##############################################################################


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

def build_doors (i) :
    return ROTATE([1, 2])(i * PI / 4)

# A partire dal modello di torretta genero le basi delle otto torri del perimetro
def build_tower_basement(i): return T([1, 2])([external_octagon_radius * COS(i * PI / 4),
                                      external_octagon_radius * SIN(i * PI / 4)])



##############################################################################
####################### FINE DELLE FUNZIONI DI UTILITA' ######################
##############################################################################



##############################################################################
################################# PAVIMENTO ##################################
##############################################################################

floor0 = JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius))))  # Pianta dell'ottagono esterno

# Assegno uno spessore di 40 cm al pavimento

floor0_3D = PROD([floor0, Q(0.4)])


##############################################################################
################################ BASE TORRETTE ###############################
##############################################################################

# Pavimento della base della torretta
tower_basement0 = (JOIN (STRUCT(AA (MK) (octagon(tower_radius)))))

# Assegno uno spessore di 1,5 metri alla base

tower_basement0_3D = PROD([tower_basement0, Q(1.5)])

towers_basement0_3D = STRUCT ([build_tower_basement(i) (tower_basement0_3D) for i in range(8)])  # Costruisco le otto torrette laterali

base = STRUCT (([floor0_3D, towers_basement0_3D]))

##############################################################################
################################ PRIMO PIANO #################################
##############################################################################

# Cortile interno
courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius + wall_thickness - 2.8))))

# Primo piano
floor1 = JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius + 1))))
floor1 = DIFFERENCE([floor1, courtyard])
floor1 = PROD([floor1, Q(0.8)])  # Assegno uno spessore di 80 cm
floor1 = T(3)(height / 2)(floor1)  # Pavimento del corpo centrale

# Costruisco i piani intermedi delle torrette
# Creo il modello della torretta
tower1 = JOIN (STRUCT(AA (MK) (octagon(tower_radius))))
tower1 = PROD([tower1, Q(0.8)])  # Do uno spessore di 80 cm

towers_floor1 = STRUCT ([build_tower_basement(i) (tower1) for i in range(8)])  # Costruisco le otto torrette laterali
towers_floor1 = T(3)(height / 2)(towers_floor1)  # Pavimento delle torri

intermediate = STRUCT([floor1, towers_floor1])  # Piano intermedio


##############################################################################
################################### TETTO ####################################
##############################################################################

# Costruisco il terzo piano (tetto)
internal_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius))))
floor2 = DIFFERENCE ([JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius)))), internal_courtyard])
floor2 = PROD([floor2, Q(0.4)])
floor2 = T(3)(height)(floor2)

towers_floor2 = JOIN (STRUCT(AA (MK) (octagon(tower_radius - 1))))
towers_floor2 = STRUCT ([build_tower_basement(i) (towers_floor2) for i in range(8)])  # Costruisco le otto torrette laterali
towers_floor2 = T(3)(tower_height)(towers_floor2)

roof = STRUCT([floor2, towers_floor2])

h_partitions = STRUCT([base, intermediate, roof])
h_partitions = ROTATE([1, 2])(PI / 8) (h_partitions)

##############################################################################
################################### MURI #####################################
##############################################################################

# Per prima cosa costruisco lo spessore del muro esterno

external_wall = JOIN (STRUCT(AA (MK) (octagon(external_octagon_radius - wall_thickness))))
external_wall = DIFFERENCE([floor0, external_wall])
# Sviluppo in altezza il muro
external_wall = PROD([external_wall, Q(height)])

# Costruisco il muro del cortile interno
external_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius + wall_thickness))))
internal_courtyard = JOIN (STRUCT(AA (MK) (octagon(courtyard_radius))))

internal_building = PROD ([DIFFERENCE ([external_courtyard, internal_courtyard]), Q(height + 1)])

# Definisco i muri delle torrette
towers_floor = JOIN (STRUCT(AA (MK) (octagon(tower_radius - 2))))
towers_wall = JOIN (STRUCT(AA (MK) (octagon(tower_radius - 1))))
towers_wall = DIFFERENCE([towers_wall, towers_floor])

# Aggiungo l'altezza ai muri
towers_wall = PROD([towers_wall, Q(tower_height)])
towers_wall = STRUCT ([build_tower_basement(i) (towers_wall) for i in range(8)])


# Ora definisco i muri dei corridoi

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


##############################################################################
############################# PORTE DEL CORTILE ##############################
##############################################################################

courtyard_door_model = PROD([QUOTE([4]), QUOTE([5])])
courtyard_door_model = PROD([courtyard_door_model, QUOTE([3.5])])
courtyard_door_model = MAP ([S3, S1, S2])(courtyard_door_model)
courtyard_door_model = T([1, 2])([courtyard_radius - 1.5, -2])(courtyard_door_model)

courtyard_doors = STRUCT([build_doors(i)(courtyard_door_model) for i in [1, 3, 6]])


v_partitions = STRUCT([external_wall, internal_building, towers_wall, corridor])
v_partitions = ROTATE([1, 2])(PI / 8) (v_partitions)
v_partitions = DIFFERENCE([v_partitions, courtyard_doors])


assembly_3D = STRUCT([h_partitions, v_partitions])

# Ridefinisco il colore per il castello

CASTLE_COLOR = Color4f([1, 0.93, 0.84, 1.0])
assembly_3D = COLOR (CASTLE_COLOR)(assembly_3D)
VIEW(assembly_3D)