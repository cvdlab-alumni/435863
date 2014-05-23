'''
Created on 17/mag/2014

@author: Salvati Danilo
'''
# Definisco un'interfaccia automatica per il loop merging-numbering-elimination
from pyplasm import SKEL_1, VIEW, STRUCT, CYAN;
from sysml import diagram2cell, cellNumbering
from lar2psm import MKPOLS


# Ridefinisco questa funzione di utilita'
def mergeModels(lar1):
    def mergeModels0(lar2):
        V1, CV1 = lar1;
        V2, CV2 = lar2;
        CV2 = [[j + len(V1) for j in i]for i in CV2]
        V1 = V1 + V2;
        CV1 = CV1 + CV2;
        return V1, CV1
    return mergeModels0;



def merging_numbering_elimination(master):
    def merging_numbering_elimination0 (diagram=None):
        def merging_numbering_elimination1(toMerge=None):
            def merging_numbering_elimination2(toRemove):
                if (toMerge == None):
                    # Se entro qui voglio fare una eliminazione senza merge
                    return master[0], [cell for k, cell in enumerate(master[1]) if not (k in toRemove)]
                master2 = diagram2cell(diagram, master, toMerge);
                master2 = master2[0], [cell for k, cell in enumerate(master2[1]) if not (k in toRemove)];
                return master2;
            return merging_numbering_elimination2;
        return merging_numbering_elimination1;
    return merging_numbering_elimination0;

# Non ho capito bene il testo dell'esercizio ed in particolare come passare la cella da rimuovere
# all'interfaccia (e' sufficiente specificare il numero di cella?)



# Metodo per visualizzare rapidamente il diagramma con la numerazione delle celle
def drawCells(master, NumbersDimension=2, diagram=([], []), toMerge=None):
    if (toMerge == None) :
        # Se entro qui vuol dire che non mi interessa muovere il diagramma in una determinata cella
        blocks = mergeModels(master)(diagram);
    else :
        blocks = diagram2cell(diagram, master, toMerge);
    V, CV = blocks;
    hpc = SKEL_1(STRUCT(MKPOLS(blocks)));
    hpc = cellNumbering (blocks, hpc)(range(len(CV)), CYAN, NumbersDimension);
    VIEW(hpc);


