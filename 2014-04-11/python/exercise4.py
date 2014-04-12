'''
Created on 12/apr/2014

@author: Salvati Danilo
'''
# from simplexn import *
# from larcc import *
# from lar2psm import *
# from largrid import *
from pyplasm import *
# from morph import *
from mapper import *
from exercise3 import scene

##############################################################################
################################# LAMPIONE ###################################
##############################################################################

# Costruisco un modello di lampione con LAR

lar_street_lamp = larRod([.10, 3.5])([40, 1])

lar_light = larBall(.30)([18, 36])
C, CV = lar_light
C = translatePoints(C, [0, 0, 3.35])

lar_light = C, CV


plasm_street_lamp = STRUCT(MKPOLS(lar_street_lamp))
plasm_street_lamp = COLOR(BLACK)(plasm_street_lamp)

plasm_light = STRUCT(MKPOLS(lar_light))
plasm_light = COLOR(YELLOW)(plasm_light)

street_lamp = STRUCT([plasm_street_lamp, plasm_light])


##############################################################################
################################# ALBERI #####################################
##############################################################################

# Costruisco alcuni modelli di alberi

lar_trunk = larRod([.25, 2.5])([40, 1])

lar_leafs1 = larBall(1)([18, 36])
C, CV = lar_leafs1
C = translatePoints(C, [0, 0, 2.20])
lar_leafs1 = C, CV

lar_leafs2 = larPizza([0.05, 1])([8, 48])
C, CV = lar_leafs2
C = translatePoints(C, [0, 0, 2.20])
lar_leafs2 = C, CV

BROWN = Color4f([0.72, 0.54, 0, 1.0])
plasm_trunk = STRUCT(MKPOLS(lar_trunk))
plasm_trunk = COLOR(BROWN)(plasm_trunk)

plasm_leafs1 = STRUCT(MKPOLS(lar_leafs1))
plasm_leafs1 = COLOR(GREEN)(plasm_leafs1)

plasm_leafs2 = JOIN([STRUCT(MKPOLS(lar_leafs2)), MK([0, 0, 4.5])])
plasm_leafs2 = COLOR(GREEN)(plasm_leafs2)


tree1 = STRUCT([plasm_trunk, plasm_leafs1])
tree2 = STRUCT([plasm_trunk, plasm_leafs2])

##############################################################################
############################### CESPUGLI #####################################
##############################################################################


lar_bush = larBall(1)([18, 36])

bush = STRUCT(MKPOLS(lar_bush))
bush = COLOR(GREEN)(bush)

##############################################################################
############################# COSTRUZIONE ####################################
##############################################################################

# A questo punto prendo i modelli creati e li inserisco all'interno della scena

# Sistemo le lampade
pair_y = [T(2)(14), street_lamp]
lampRow = STRUCT(NN(3)(pair_y))

lampRow = T([1, 2, 3])([67.5, 42, 1])(lampRow)
lampRow2 = T([1])([5])(lampRow)

lamps = STRUCT([lampRow, lampRow2])

# Sistemo gli alberi
pair_y = [T(1)(3), tree1]
tree1Row = STRUCT(NN(5)(pair_y))

tree1Row = T([1, 2, 3])([55, 27.5, 1])(tree1Row)

pair_y = [T(1)(3), tree2]
tree2Row = STRUCT(NN(4)(pair_y))

tree2Row = T([1, 2, 3])([55, 32.5, 1])(tree2Row)

# Creo una piccola foresta sparsa

forest = STRUCT([T([1, 2, 3])([35, 65, 1])(tree1),
                 T([1, 2, 3])([38, 64, 1])(tree1),
                 T([1, 2, 3])([25, 63, 1])(tree1),
                 T([1, 2, 3])([35, 78, 1])(tree1),
                 T([1, 2, 3])([32, 79, 1])(tree1),
                 T([1, 2, 3])([38, 73, 1])(tree1),
                 T([1, 2, 3])([32, 89, 1])(tree1)])



trees = STRUCT([tree1Row, tree2Row, forest])


# Distribuisco dei cespugli in giro

bushes = STRUCT([T([1, 2, 3])([55, 25, 1])(bush),
                 T([1, 2, 3])([55, 36, 1])(bush),
                 T([1, 2, 3])([35, 74, 1])(bush),
                 T([1, 2, 3])([32, 84, 1])(bush),
                 T([1, 2, 3])([38, 76, 1])(bush),
                 T([1, 2, 3])([32, 69, 1])(bush),
                 T([1, 2, 3])([59, 83, 1])(bush)])

# Visualizzo la scena

improved_scene = STRUCT([trees, lamps, scene, bushes])
VIEW(improved_scene)
