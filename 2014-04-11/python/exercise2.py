'''
Created on 11/apr/2014

@author: Salvati Danilo
'''
from pyplasm import *
# Importo alcune cose utili dall'esercizio precedente
from exercise1 import assembly_3D, courtyard_radius
from exercise1 import external_octagon_radius, wall_thickness

##############################################################################
############################ FUNZIONI DI UTILITA' ############################
##############################################################################

def disk2D(p):
    u, v = p
    return [-v * COS(u), v * SIN(u)]


def domain2D (radius) :
    return PROD([INTERVALS(PI)(30), INTERVALS(radius)(7)])

def build_windows (i) :
    return ROTATE([1, 2])(i * PI / 4)


# Definisco il colore per le finestre
SKY_BLUE = Color4f([0.8, 0.95, 1, 1.0])

# Definisco il colore per il castello
CASTLE_COLOR = Color4f([1, 0.93, 0.84, 1.0])



##############################################################################
####################### FINE DELLE FUNZIONI DI UTILITA' ######################
##############################################################################


##############################################################################
################################### PORTA ####################################
##############################################################################


# Costruisco il portone interno

door = T([1])([-1]) (PROD([QUOTE([2]), QUOTE([4])]))
door = MAP ([lambda x: 0, S1, S2])(door)
BROWN = Color4f([0.64, 0.32, 0, 1.0])
door = COLOR (BROWN) (door)


# Costruisco la parte esterna
external_door = PROD([QUOTE([4]), QUOTE([5])])

# Creo un semicerchio

half_circle = MAP(disk2D)((domain2D)(2))

# Adesso creo uno spessore per la parte esterna
# external_door2 = T([1])([1])(PROD([QUOTE([4]), QUOTE([5])]))
# half_circle2 = MAP(disk2D)((domain2D)(2))

# external_door = DIFFERENCE([external_door, external_door2])

# half_circle = DIFFERENCE([half_circle, half_circle2])
half_circle = T([1, 2])([2, 5])(half_circle)

# Aggiungo il semicerchio alla parte esterna

external_door = STRUCT([external_door, half_circle])
external_door = PROD([external_door, QUOTE([1.5])])
external_door = T([1])([-2])(external_door)

cuboid = CUBOID([6, 9, 1.5])
cuboid = T(1)(-3)(cuboid)

external_door = DIFFERENCE([cuboid, external_door])

# Ruoto la porta
external_door = MAP ([S3, S1, S2])(external_door)

# Creo un cuboide all'interno del quale metto la mia cavita'



door = STRUCT([door, external_door])


# Costruisco il fregio triangolare

verts = [[0, 0], [7, 0], [3.5, 2.5]]
cells = [[1, 2, 3]]
pols = None
triangle = MKPOL([verts, cells, pols])

verts = [[1, 0], [6, 0], [3.5, 1.8]]
cells = [[1, 2, 3]]
pols = None
triangle2 = MKPOL([verts, cells, pols])

triangle = DIFFERENCE([triangle, triangle2])

triangle = PROD([triangle, Q(1)])

triangle = STRUCT([triangle, T([3])([0.90])(triangle2)])

# A questo punto traslo il fregio sopra il portone

triangle = MAP ([S3, S1, S2])(triangle)
triangle = T([2, 3])([-3.5, 9])(triangle)

door = STRUCT([door, triangle])

# Sposto la porta sul muro esterno
door = T([1])([external_octagon_radius - wall_thickness / 2 - 0.3])(door)

door = COLOR (CASTLE_COLOR)(door)



##############################################################################
################################## FINESTRA ##################################
##############################################################################

window_model = T([1])([-0.5]) (PROD([QUOTE([1]), QUOTE([4])]))
half_circle_window = T([2])([4])(MAP(disk2D)((domain2D)(0.5)))
half_circle_window = ROTATE([1, 3])(PI)(half_circle_window)
window_model = STRUCT([window_model, half_circle_window])
window_model = STRUCT([T(1)(-0.5)(window_model), T(1)(0.5)(window_model)])

# Definisco un bordo per la finestra
# Costruisco la parte esterna
window_border = PROD([QUOTE([3]), QUOTE([4.5])])

# Creo un semicerchio

half_circle = MAP(disk2D)((domain2D)(1.5))

# Adesso creo uno spessore per la parte esterna
window_border2 = T([1])([0.5])(PROD([QUOTE([2]), QUOTE([4.5])]))
half_circle2 = MAP(disk2D)((domain2D)(1))

window_border = DIFFERENCE([window_border, window_border2])

half_circle = DIFFERENCE([half_circle, half_circle2])
half_circle = T([1, 2])([1.5, 4.5])(half_circle)

# Aggiungo il semicerchio alla parte esterna

window_border = STRUCT([window_border, half_circle])
window_border = PROD([window_border, QUOTE([0.2])])
window_border = T([1])([-1.5])(window_border)
window_border = COLOR (CASTLE_COLOR) (window_border)

# Collego la finestra al bordo

# window_model = STRUCT([window_model, window_border])

window0 = T([3])([external_octagon_radius - wall_thickness / 2 - 0.3])(window_model)

window0 = MAP ([S3, S1, S2])(window0)
window0 = T([3])([12])(window0)
window0 = COLOR (SKY_BLUE) (window0)

window_border0 = T([3])([external_octagon_radius - wall_thickness / 2 - 0.3])(window_border)
window_border0 = MAP ([S3, S1, S2])(window_border0)
window_border0 = T([3])([12])(window_border0)
window_border0 = COLOR (CASTLE_COLOR) (window_border0)

# Costruisco tutte le altre finestre
window1 = ROTATE([1, 2])(PI / 4) (window0)
external_windows = STRUCT([build_windows(i)(window0) for i in range(0, 8)])
windows_borders = STRUCT([build_windows(i)(window_border0) for i in range(0, 8)])


# Costruisco ora le finestre in basso
lower_window0 = T([3])([-8])(window0)
lower_window_border0 = T([3])([-8])(window_border0)

lower_windows = STRUCT([build_windows(i)(lower_window0) for i in range(1, 8)])
lower_windows_borders = STRUCT([build_windows(i)(lower_window_border0) for i in range(1, 8)])

# Ora costruisco le finestre del cortile interno
internal_window_model = ROTATE([1, 3])(PI) (window_model)  # La faccia e' rivolta verso l'interno
internal_window0 = T([3])([courtyard_radius - wall_thickness / 2 + 0.55])(internal_window_model)
internal_window0 = MAP ([S3, S1, S2])(internal_window0)
internal_window0 = T([3])([12])(internal_window0)
internal_window0 = COLOR (SKY_BLUE) (internal_window0)

internal_windows = STRUCT([build_windows(i)(internal_window0) for i in [0, 4, 5]])


internal_window_border0 = T([3])([courtyard_radius - wall_thickness / 2])(window_border)
internal_window_border0 = MAP ([S3, S1, S2])(internal_window_border0)
internal_window_border0 = T([3])([12])(internal_window_border0)
internal_window_border0 = COLOR (CASTLE_COLOR) (internal_window_border0)

internal_windows_borders = STRUCT([build_windows(i)(internal_window_border0) for i in [0, 4, 5]])

windows = STRUCT([external_windows,
                  lower_windows,
                  internal_windows,
                  windows_borders,
                  lower_windows_borders,
                  internal_windows_borders])


# Mostro il modello completo del castello

castle_3D = STRUCT([assembly_3D, door, windows])
VIEW(castle_3D)
