'''
Created on 16/mag/2014

@author: Salvati Danilo
'''
from pyplasm import COMP, VIEW, STRUCT, SKEL_1;
from lar2psm import MKPOLS;
from mapper import larTranslate, checkModel;
from sysml import assemblyDiagramInit;
from exercise3 import merging_numbering_elimination;
from exercise3 import drawCells


height = 2.80;  # Altezza di casa
wall_thickness = 0.5;  # Spessore dei muri
basement_thickness = 0.20;  # Spessore del pavimento

door_width = 0.75;  # larghezza della porta
door_height = 2.00;  # Altezza della porta


##############################################################################
############################ FUNZIONI DI UTILITA' ############################
##############################################################################

# Funzione per disegnare agevolmente modelli lar
DRAW = COMP([VIEW, STRUCT, MKPOLS]);
# Funzione per disegnare gli scheletri di modelli lar
DRAW_SKEL = COMP([VIEW, SKEL_1, STRUCT, MKPOLS]);

# Funzione per aggiungere un modello ad un altro

def mergeModels(lar1):
    def mergeModels0(lar2):
        V1, CV1 = lar1;
        V2, CV2 = lar2;
        CV2 = [[j + len(V1) for j in i]for i in CV2]
        V1 = V1 + V2;
        CV1 = CV1 + CV2;
        return V1, CV1
    return mergeModels0;

# Funzione per aggiungere una lista di modelli ad un altro

def mergeModelsList(lar1):
    def mergeModelsList0(lst):
        l = len(lst);
        lar = lar1;
        for i in range(l):
            lar = mergeModels(lar)(lst[i]);
        return lar;
    return mergeModelsList0;

##############################################################################
####################### FINE DELLE FUNZIONI DI UTILITA' ######################
##############################################################################


##############################################################################
################################### SALOTTO ##################################
##############################################################################

shape = [3, 4, 3];
sizePatterns = [[0.5, 5.1 - wall_thickness, wall_thickness], [wall_thickness, 1.0, 3.5, wall_thickness], [basement_thickness, height, 0.01]];
living_room = assemblyDiagramInit(shape)(sizePatterns);

# Tolgo il soffitto e alcuni muri
living_room = merging_numbering_elimination(living_room)()()([16, 17, 19, 20, 31, 32]);

# Aggiungo un secondo blocco alla stanza
shape = [1, 3, 3];
sizePatterns = [[1.7 - wall_thickness], [wall_thickness, 3.5, 2.4], [basement_thickness, height - 0.5, 0.51]];
living_room2 = assemblyDiagramInit(shape)(sizePatterns);
V, CV = living_room2;
V = larTranslate([5.0 + wall_thickness, 1.0, 0.0])(V);
living_room2 = V, CV;

living_room = mergeModels(living_room)(living_room2);
# Elimino altre parti superflue relative al nuovo blocco
living_room = merging_numbering_elimination(living_room)()()([34, 35, 37, 38]);

shape = [3, 1, 3];
sizePatterns = [[0.225, door_width, 0.225], [wall_thickness], [basement_thickness, door_height, height - door_height]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la porta
living_room = merging_numbering_elimination(living_room)(diagram)(31)([37, 38, 39]);

shape = [5, 1, 3];
sizePatterns = [[0.75 + wall_thickness, 0.80, 0.45, 1.0, 0.75], [wall_thickness], [1.5, height - 2, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la finestra
living_room = merging_numbering_elimination(living_room)(diagram)(13)([42, 43, 49]);

shape = [1, 5, 3];
sizePatterns = [[wall_thickness], [1.37 + wall_thickness, 1.0, 0.25, 1.0, 1.38], [1.5, height - 2, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo un'altra finestra
living_room = merging_numbering_elimination(living_room)(diagram)(7)([60, 54]);

# DRAW(living_room);

##############################################################################
################################### CUCINA ###################################
##############################################################################

shape = [3, 3, 3];
sizePatterns = [[wall_thickness, 4.1 - wall_thickness, wall_thickness], [0.5, 2.4, 0.2], [basement_thickness, height, 0.01]];
kitchen = assemblyDiagramInit(shape)(sizePatterns);

V, CV = kitchen;

# Tolgo il soffitto
kitchen = merging_numbering_elimination(kitchen)()()([13, 14]);

shape = [1, 3, 3];
sizePatterns = [[wall_thickness], [1 + wall_thickness, door_width, 0.85], [basement_thickness, door_height, height - door_height]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la porta
kitchen = merging_numbering_elimination(kitchen)(diagram)(4)([27, 28]);

V, CV = kitchen;
V = larTranslate([6.7, 1.0, 0.0])(V);
kitchen = V, CV;

# DRAW(kitchen);

##############################################################################
#################################### BAGNO ###################################
##############################################################################

shape = [3, 3, 3];
sizePatterns = [[wall_thickness , 4.1 - wall_thickness, wall_thickness], [0.2, 1.6, wall_thickness], [basement_thickness, height, 0.01]];
bathroom = assemblyDiagramInit(shape)(sizePatterns);
V, CV = bathroom;

# Tolgo il soffitto
bathroom = merging_numbering_elimination(bathroom)()()([13, 14]);

shape = [1, 3, 3];
sizePatterns = [[wall_thickness], [0.75, door_width, 0.8], [basement_thickness, door_height, height - door_height]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la porta
bathroom = merging_numbering_elimination(bathroom)(diagram)(4)([27, 28]);

V, CV = bathroom;

V = larTranslate([6.7, 3.4 + wall_thickness, 0.0])(V);
bathroom = V, CV;

# DRAW(bathroom);

##############################################################################
############################### 1a CAMERA LETTO ##############################
##############################################################################

shape = [3, 3, 3];
sizePatterns = [[wall_thickness, 4.9, 0.2], [wall_thickness, 4.5, wall_thickness], [basement_thickness, height, 0.01]];
bedroom1 = assemblyDiagramInit(shape)(sizePatterns);

V, CV = bedroom1;

# Tolgo il soffitto
bedroom1 = merging_numbering_elimination(bedroom1)()()([13, 14]);

shape = [1, 3, 3];
sizePatterns = [[0.2], [0.15, door_width, 3.1], [basement_thickness, door_height, height - door_height]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la porta
bedroom1 = merging_numbering_elimination(bedroom1)(diagram)(20)([27, 28]);

shape = [3, 1, 3];
sizePatterns = [[1.7 + wall_thickness, 1.0, 1.7], [wall_thickness], [1.5, height - 2, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la finestra
bedroom1 = merging_numbering_elimination(bedroom1)(diagram)(14)([34]);


shape = [1, 5, 3];
sizePatterns = [[wall_thickness], [1.0 + wall_thickness, 0.75, 0.50, 1.0, 1.25], [1.5, height - 2, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo un'altra finestra
bedroom1 = merging_numbering_elimination(bedroom1)(diagram)(4)([41,46, 47]);

V, CV = bedroom1;

V = larTranslate([0.0, 5.0 + wall_thickness, 0.0])(V);
bedroom1 = V, CV;

# DRAW(bedroom1);

##############################################################################
############################### 2a CAMERA LETTO ##############################
##############################################################################

shape = [3, 3, 3];
sizePatterns = [[wall_thickness, 4.1 - wall_thickness, wall_thickness], [wall_thickness, 4.5, wall_thickness], [basement_thickness, height, 0.01]];
bedroom2 = assemblyDiagramInit(shape)(sizePatterns);

V, CV = bedroom2;

# Tolgo il soffitto
bedroom2 = merging_numbering_elimination(bedroom2)()()([13, 14]);

shape = [1, 3, 3];
sizePatterns = [[0.2], [0.35, door_width, 2.9], [basement_thickness, door_height, height - door_height]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la porta
bedroom2 = merging_numbering_elimination(bedroom2)(diagram)(4)([27, 28]);

shape = [3, 1, 3];
sizePatterns = [[1.55 + wall_thickness, 1.0, 1.55], [wall_thickness], [1.5, height - 2, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la finestra
bedroom2 = merging_numbering_elimination(bedroom2)(diagram)(13)([34]);

V, CV = bedroom2;

V = larTranslate([6.7, 4.5 + 2 * wall_thickness, 0.0])(V);
bedroom2 = V, CV;

# DRAW(bedroom2);

##############################################################################
################################# RIPOSTIGLIO ################################
##############################################################################

shape = [3, 3, 3];
sizePatterns = [[0.2, 1, wall_thickness], [0.2, 2.9, wall_thickness], [basement_thickness, height, 0.01]];
closet = assemblyDiagramInit(shape)(sizePatterns);

V, CV = closet;

# Tolgo il soffitto
closet = merging_numbering_elimination(closet)()()([13, 14]);

shape = [3, 1, 3];
sizePatterns = [[0.15, 0.75, 0.1], [0.2], [basement_thickness, height - 0.5, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la porta
closet = merging_numbering_elimination(closet)(diagram)(10)([27, 28]);

shape = [3, 1, 3];
sizePatterns = [[0.4, 0.5, 0.8], [wall_thickness], [1.5, height - 2, 0.5]];
diagram = assemblyDiagramInit(shape)(sizePatterns);

# Creo la finestra
closet = merging_numbering_elimination(closet)(diagram)(13)([34]);

V, CV = closet;

V = larTranslate([5.0 + wall_thickness, 6.9 + wall_thickness, 0.0])(V);
closet = V, CV;

# DRAW(closet);


##############################################################################
#################################### CASA ####################################
##############################################################################


house = mergeModelsList(living_room)([kitchen, bathroom, bedroom1, bedroom2, closet]);

# Ottimizzo il modello
house = checkModel(house);

# DRAW_SKEL(house);
# DRAW(house);
