'''
Created on 17/mag/2014

@author: Salvati Danilo
'''
from pyplasm import BEZIER, S1, S2;
from mapper import larScale, larTranslate, larMap, larDomain
from exercise1 import house, DRAW, height, addToModelList, wall_thickness
from architectural import spiralStair
from largrid import larModelProduct
from sysml import assemblyDiagramInit
from exercise3 import merging_numbering_elimination



##############################################################################
############################ FUNZIONI DI UTILITA' ############################
##############################################################################

# Funzione per costruire un generico piano
def build_floor(lar):
    def build_floor0(i):
        V, CV = lar;
        V = larTranslate([0.0, 0.0, i * height])(V);
        return V, CV;
    return build_floor0;


##############################################################################
####################### FINE DELLE FUNZIONI DI UTILITA' ######################
##############################################################################


##############################################################################
############################### PIANO GENERICO ###############################
##############################################################################

# Creo un modello di palazzo riutilizzando l'appartamento dell'esercizio precedente

V, CV = house;

V2 = larScale([-1, 1, 1])(V);

V2 = larTranslate([25.0, 0.0, 0.0])(V2);

mirrored_house = V2, CV;


# Creo il pavimento per ciascun piano

basement_V = [[11.3, 1.0, 0.0],
              [13.7, 1.0, 0.0],
              [11.3, 11, 0.0],
              [13.7, 11, 0.0],
              [5.0 + wall_thickness, 0.0, 0.0],
              [19.5, 0.0, 0.0],
              [19.5, 1.0, 0.0],
              [5.0 + wall_thickness, 1.0, 0.0]];

basement_CV = [[0, 1, 2, 3], [4, 5, 6, 7]];

basement = basement_V, basement_CV;


# Creo i muri del corridoio


shape = [7, 1, 3];
sizePatterns = [[5.25, 1.0, 0.25, 1.0, 0.25, 1.0, 5.25], [wall_thickness], [1.5, height - 2, 0.5]];
wall = assemblyDiagramInit(shape)(sizePatterns);

# Creo le finestre
wall = merging_numbering_elimination(wall)()()([4, 10, 16]);

V, CV = wall;

V = larTranslate([5.0 + wall_thickness, 0.0, 0.0])(V);
wall = V, CV;


wall2 = assemblyDiagramInit([1, 1, 1])([[2.4], [wall_thickness], [height]]);

V, CV = wall2;

V = larTranslate([11.3, 11.0 - wall_thickness, 0.0])(V);
wall2 = V, CV;

floor = addToModelList(house)([mirrored_house, basement, wall, wall2]);

##############################################################################
################################ GROUND FLOOR ################################
##############################################################################

ground_floor = assemblyDiagramInit([1, 1, 1])([[25], [11], [height]]);

V, CV = ground_floor;

V = larTranslate([0.0, 0.0, -height])(V);
ground_floor = V, CV;




# Adesso costruisco la hall

# Costruisco una superficie con Bezier
domain = larDomain([24, 24]);

controlPoints1 = [[10, 0], [12.5, 0], [15, 0]];
controlPoints2 = [[10, -1], [12.5, -1], [15, -1]];
controlPoints3 = [[10, -3], [12.5, -4], [15, -3]];

b1 = BEZIER(S1)(controlPoints1);
b2 = BEZIER(S1)(controlPoints2);
b3 = BEZIER(S1)(controlPoints3);

mapping0 = BEZIER(S2)([b1, b2, b3]);
surface0 = larMap(mapping0)(domain);

hall_wall_V = [[0], [-2.8]];

hall_wall_CV = [[0, 1]];

hall_wall = hall_wall_V, hall_wall_CV;

# Passo dalla superficie ad un solido tridimensionale
hall = larModelProduct([surface0, hall_wall]);

##############################################################################
#################################### SCALA ###################################
##############################################################################


stair = spiralStair(0.2, 1., 0.5, 0.1, height, 10., 18);

V, CV = stair;

V = larTranslate([12.5, 1.5, -2.8])(V);
stair = V, CV;


##############################################################################
#################################### TETTO ###################################
##############################################################################

roof = assemblyDiagramInit([1, 1, 1])([[25], [11], [0.01]]);
V, CV = roof;
V = larTranslate([0.0, 0.0, height * 5])(V);
roof = V, CV;

##############################################################################
################################### PALAZZO ##################################
##############################################################################

floors = [build_floor(floor)(i) for i in range(1, 5)];
palace = addToModelList(floor)(floors + [stair, ground_floor, hall, roof]);
DRAW(palace);