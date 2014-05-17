'''
Created on 17/mag/2014

@author: Salvati Danilo
'''
# Definisco un'interfaccia automatica per il loop merging-numbering-elimination
from pyplasm import *;
from sysml import diagram2cell

def merging_numbering_elimination(master):
    def merging_numbering_elimination0 (diagram=None):
        def merging_numbering_elimination1(toMerge=None):
            def merging_numbering_elimination2(toRemove):
                if (toMerge == None):
                    # Se entro qui voglio fare una eliminazione senza merge
                    return master[0], [cell for k, cell in enumerate(master[1]) if not (k in toRemove)]
                master2 = diagram2cell(diagram, master, toMerge);
                print master2;
                master2 = master2[0], [cell for k, cell in enumerate(master2[1]) if not (k in toRemove)];
                return master2;
            return merging_numbering_elimination2;
        return merging_numbering_elimination1;
    return merging_numbering_elimination0;

# Non ho capito bene il testo dell'esercizio ed in particolare come passare la cella da rimuovere
# all'interfaccia (e' sufficiente specificare il numero di cella?)
