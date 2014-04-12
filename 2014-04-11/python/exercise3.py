'''
Created on 12/apr/2014

@author: Salvati Danilo
'''
from pyplasm import *
# Importo l'esercizio precedente
from exercise2 import castle_3D

SKY_BLUE = Color4f([0.8, 0.95, 1, 1.0])


# Poiche' intorno a Castel Del Monte non vi sono centri abitati, invento un paesaggio

##############################################################################
################################## TERRENO ###################################
##############################################################################

terrain = PROD([QUOTE([100]), QUOTE([100])])

terrain3D = COLOR (GREEN) (PROD([terrain, Q(1)]))

# Ridefinisco il marrone
BROWN = Color4f([0.72, 0.54, 0, 1.0])

terrain3D2 = COLOR (BROWN) (PROD([terrain, Q(3)]))
terrain3D2 = T([3])([-3])(terrain3D2)
terrain3D = STRUCT([terrain3D, terrain3D2])


##############################################################################
################################## CASTELLO ##################################
##############################################################################

# Importo il castello e lo traslo per inserirlo nella scena
castle_3D = T([1, 2, 3]) ([30, 30, 1])(castle_3D)

##############################################################################
################################### STRADA ###################################
##############################################################################

# Definisco una strada che parte dal castello
street = PROD([QUOTE([40]), QUOTE([4])])
street = T([1, 2, 3])([28, 28, 1.1])(street)

# Creo una seconda strada
street2 = PROD([QUOTE([4]), QUOTE([70])])
street2 = T([1, 2, 3])([68, 28, 1.1])(street2)

streets = STRUCT([street, street2])


##############################################################################
################################### PALAZZO ##################################
##############################################################################


# Definisco un modello di palazzo semplificato usando CUBOID


building = CUBOID([10, 6, 8])

# Creo le finestre del palazzo

window0 = COLOR (SKY_BLUE) (PROD([Q(0.3), Q(1)]))
window0 = MAP ([lambda x: 0, S1, S2])(window0)
window0 = ROTATE([1, 2])(3 * PI / 2)(window0)
window0 = T([2, 3])([-0.1, 3])(window0)
window0 = COLOR(SKY_BLUE)(window0)

pair_x = [T(1)(0.60), window0]
windowRow = STRUCT(NN(15)(pair_x))

first_facade = STRUCT([windowRow,
                      T(3)(3)(windowRow)])


second_facade = ROTATE ([1, 2]) (PI) (first_facade)

second_facade = T([1, 2])([10, 6.1]) (second_facade)


window1 = ROTATE ([1, 2])(-PI / 2)(window0)

window1 = T([2])([0.60])(window1)

pair_y = [T(2)(0.60), window1]

windowRow1 = STRUCT(NN(8)(pair_y))

third_facade = STRUCT([windowRow1,
                      T(3)(3)(windowRow1)])

fourth_facade = ROTATE ([1, 2]) (PI) (third_facade)
fourth_facade = T([1, 2])([10, 6.1]) (fourth_facade)

door = T(1)(5)(PROD([Q(0.8), Q(1)]))
door = MAP ([S1, lambda x:-0.1, S2])(door)
door = COLOR (BROWN)(door)

CASTLE_COLOR = Color4f([1, 0.93, 0.84, 1.0])
building = COLOR(CASTLE_COLOR) (building)

building = STRUCT([building, first_facade, second_facade, third_facade, fourth_facade, door])

##############################################################################
################################# QUARTIERE ##################################
##############################################################################

# Prendo il modello di palazzo sin qui realizzato e creo un piccolo quartiere

building = ROTATE([1, 2])(PI / 2)(building)

pair_y = [T(2)(14), building]
buildingRow = STRUCT(NN(4)(pair_y))
# Costruisco una seconda fila di case per ribaltamento
buildingRow2 = S(1)(-1) (buildingRow)

buildingRow = T([1, 2, 3])([68, 30, 1])(buildingRow)
buildingRow2 = T([1, 2, 3])([72, 30, 1])(buildingRow2)

scene = STRUCT([castle_3D, terrain3D, streets, buildingRow, buildingRow2])
VIEW(scene)
