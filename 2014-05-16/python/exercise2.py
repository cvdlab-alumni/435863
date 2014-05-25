'''
Created on 17/mag/2014

@author: Salvati Danilo
'''
from pyplasm import S1, S2;
from mapper import larScale, larTranslate, larMap, larDomain
from exercise1 import house, DRAW, height, mergeModelsList, wall_thickness, \
    mergeModels
from architectural import spiralStair
from largrid import larModelProduct
from sysml import assemblyDiagramInit
from exercise3 import merging_numbering_elimination
from splines import larBezier



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

shape = [3, 3, 1];
sizePatterns = [[1.2, 1.0, 0.2], [2.5, 1, 8.5], [0.20]];
diagram = assemblyDiagramInit(shape)(sizePatterns);
V, CV = diagram;
V = larTranslate([11.3, -1.0, 0.0])(V);
basement = V, CV;

# Creo lo spazio per la scala
basement = merging_numbering_elimination(basement)()()([4]);
# Creo i muri del corridoio


shape = [9, 2, 4];
sizePatterns = [[0.01, 5.25, 1.0, 0.25, 1.0, 0.25, 1.0, 5.25, 0.01], [wall_thickness, 2.5], [0.20, 1.5, height - 2, 0.51]];
wall = assemblyDiagramInit(shape)(sizePatterns);


V, CV = wall;

V = larTranslate([5.0 + wall_thickness, -2.0, 0.0])(V);
wall = V, CV;
# Creo le finestre
wall = merging_numbering_elimination(wall)()()([13, 14, 18, 21, 22, 29, 30, 34, 37, 38, 45, 46, 50, 53, 54, 61, 62]);


wall2 = assemblyDiagramInit([1, 1, 1])([[2.4], [wall_thickness], [height + 0.2]]);

V, CV = wall2;

V = larTranslate([11.3, 11.0 - wall_thickness, 0.0])(V);
wall2 = V, CV;

# Assemblo tutti i componenti
floor = mergeModelsList(house)([mirrored_house, basement, wall, wall2]);

##############################################################################
################################### BALCONI ##################################
##############################################################################

# Creo dei balconi

# Costruisco una superficie con larBezier
domain = larDomain([24, 24]);

controlPoints1 = [[0.0, 0], [1.8, 0], [3.6, 0]];
controlPoints2 = [[0.0, -0.5], [1.8, -0.5], [3.6, -0.5]];
controlPoints3 = [[0.0, -1], [1.8, -2], [3.6, -1]];

b1 = larBezier(S1)(controlPoints1);
b2 = larBezier(S1)(controlPoints2);
b3 = larBezier(S1)(controlPoints3);

mapping0 = larBezier(S2)([b1, b2, b3]);
surface0 = larMap(mapping0)(domain);

balcony_wall_V = [[0], [-0.8]];

balcony_wall_CV = [[0, 1]];

balcony_wall = balcony_wall_V, balcony_wall_CV;

# Passo dalla superficie ad un solido tridimensionale
balcony1 = larModelProduct([surface0, balcony_wall]);

balcony_wall2_V = [[0.0], [-0.2]];
balcony_wall2 = balcony_wall2_V, balcony_wall_CV;
balcony1_2 = larModelProduct([surface0, balcony_wall2]);
V, CV = balcony1_2;
V = larTranslate([0.0, 0.0, -0.8])(V);

balcony1_2 = V, CV;

# Unisco le due meta'
balcony1 = mergeModels(balcony1)(balcony1_2);

toRemove = sum([range(i * 24, i * 24 + 22) for i in range(1, 23)], []);

# Svuoto il blocco
balcony1 = merging_numbering_elimination(balcony1)()()(toRemove);

V, CV = balcony1;
V = larTranslate([1.2, 0.0, 1.0])(V);
balcony1 = V, CV;


V = larTranslate([19.0, 0.0, 0.0])(V);
balcony2 = V, CV;


# Ora disegno i balconi della parte posteriore

domain = larDomain([48, 24]);

controlPoints1 = [[0, 0.5], [0, 0], [6, 6], [0, 10], [-7, 7.5], [-4.2, 5]];
controlPoints2 = [[0, 0.5], [0.2, 0], [6.4, 6.2], [0.2, 10], [-7.2, 7.5], [-4.2, 5]];
controlPoints3 = [[0, 5], [-4.2, 5]];

b1 = larBezier(S1)(controlPoints1);
b2 = larBezier(S1)(controlPoints2);
b3 = larBezier(S1)(controlPoints3);

mapping0 = larBezier(S2)([b1, b2, b3]);
surface0 = larMap(mapping0)(domain);

# Passo dalla superficie ad un solido tridimensionale
balcony3 = larModelProduct([surface0, balcony_wall]);

balcony3_2 = larModelProduct([surface0, balcony_wall2]);
V, CV = balcony3_2;
V = larTranslate([0.0, 0.0, -0.8])(V);

balcony3_2 = V, CV;

# Unisco le due meta'
balcony3 = mergeModels(balcony3)(balcony3_2);


# Per comodita' (poiche' vi sono molte celle) svuoto il balcone in due passate

toRemove = sum([range(i * 24 + 5, i * 24 + 20) for i in range(0, 45)], []);

# Svuoto il blocco
balcony3 = merging_numbering_elimination(balcony3)()()(toRemove);

toRemove = sum([range(5 + i * 9, 9 + i * 9) for i in range(0, 45)], []);

balcony3 = merging_numbering_elimination(balcony3)()()(toRemove);

V, CV = balcony3;
# Definisco i vertici del balcone speculare
V2 = larScale([-1, 1, 1])(V);
V2 = larTranslate([0.0, 6.0, 1.0])(V2);
V = larTranslate([25.0, 6.0, 1.0])(V);
balcony3 = V, CV;
balcony4 = V2, CV;

floor = mergeModelsList(floor)([balcony1, balcony2, balcony3, balcony4]);

##############################################################################
################################ GROUND FLOOR ################################
##############################################################################

ground_floor = assemblyDiagramInit([3, 4, 4])([[11, 3, 11], [0.01, 5, 6, 0.01], [0.01, 1.8, height - 1.8, 0.01]]);

V, CV = ground_floor;

V = larTranslate([0.0, 0.0, -height])(V);
ground_floor = V, CV;
# Creo lo spazio per la porta
ground_floor = merging_numbering_elimination(ground_floor)()()([7, 11, 17, 18, 19, 21, 22, 23, 25, 26, 27, 39, 43]);

# Adesso costruisco la hall

# Costruisco una superficie con larBezier
domain = larDomain([24, 24]);

controlPoints1 = [[10, 0], [12.5, 0], [15, 0]];
controlPoints2 = [[10, -1], [12.5, -1], [15, -1]];
controlPoints3 = [[10, -3], [12.5, -4], [15, -3]];

b1 = larBezier(S1)(controlPoints1);
b2 = larBezier(S1)(controlPoints2);
b3 = larBezier(S1)(controlPoints3);

mapping0 = larBezier(S2)([b1, b2, b3]);
surface0 = larMap(mapping0)(domain);

hall_wall_V = [[0], [-1]];

hall_wall_CV = [[0, 1]];

hall_wall = hall_wall_V, hall_wall_CV;

# Passo dalla superficie ad un solido tridimensionale
hall = larModelProduct([surface0, hall_wall]);

# Creo la seconda meta' della hall
hall_wall2_V = [[0.0], [-1.8]];
hall_wall2 = hall_wall2_V, hall_wall_CV;
hall2 = larModelProduct([surface0, hall_wall2]);
V, CV = hall2;
V = larTranslate([0.0, 0.0, -1.0])(V);

hall2 = V, CV;

# Unisco le due meta'
hall = mergeModels(hall)(hall2);

# Creo lo spazio per la porta
hall = merging_numbering_elimination(hall)()()(range(768, 960));

##############################################################################
#################################### SCALA ###################################
##############################################################################


stair = spiralStair(0.2, 1., 0.5, 0.1, height, 10., 18);

V, CV = stair;

V = larTranslate([12.5, 2.5, -2.8])(V);
stair = V, CV;
##############################################################################
#################################### TETTO ###################################
##############################################################################

roof = assemblyDiagramInit([3, 3, 3])([[1, 23, 1], [1, 9, 1], [0.5, 1.5, 0.01]]);
V, CV = roof;
V = larTranslate([0.0, 0.0, height * 5])(V);
roof = V, CV;
roof = merging_numbering_elimination(roof)()()([13, 14]);

##############################################################################
################################### PALAZZO ##################################
##############################################################################

floors = [build_floor(floor)(i) for i in range(1, 5)];
palace = mergeModelsList(floor)(floors + [stair, ground_floor, hall, roof]);

DRAW(palace);
