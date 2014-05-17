'''
Created on 17/mag/2014

@author: Salvati Danilo
'''
from numpy import zeros
from mapper import larApply
from boolean import vertexSieve

# Bozza dell'esercizio 4

def diagram2cellMatrix(diagram):
    def diagramToCellMatrix0(master, cell):
        wdw = min(diagram[0]) + max(diagram[0])  # window3D
        cV = [master[0][v] for v in master[1][cell]]
        vpt = min(cV) + max(cV)  # viewport3D
        print "\n window3D =", wdw
        print "\n viewport3D =", vpt

        mat = zeros((4, 4))
        mat[0, 0] = (vpt[3] - vpt[0]) / (wdw[3] - wdw[0])
        mat[0, 3] = vpt[0] - mat[0, 0] * wdw[0]
        mat[1, 1] = (vpt[4] - vpt[1]) / (wdw[4] - wdw[1])
        mat[1, 3] = vpt[1] - mat[1, 1] * wdw[1]
        mat[2, 2] = (vpt[5] - vpt[2]) / (wdw[5] - wdw[2])
        mat[2, 3] = vpt[2] - mat[2, 2] * wdw[2]
        mat[3, 3] = 1
        print "\n mat =", mat
        return mat
    return diagramToCellMatrix0


def diagram2cell(diagram, master, cell):
    mat = diagram2cellMatrix(diagram)(master, cell)
    diagram = larApply(mat)(diagram)

    # Prendo questa funzione dal pacchetto boolean che elimina
    # i vertici duplicati (si segua il test02.py di boolean)
    V, CV1, CV2, n12 = vertexSieve(master, diagram)
    master = V, (CV1 + CV2)
    return master;