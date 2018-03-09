class Echelle{
    /**
     * Objet Echelle
     * @param intX Pos X
     * @param intY1 Pos Y depart
     * @param intY2 Pos Y fin
     * @param objBlocAcc Bloc accessible via cet objet
     */
    constructor(intX, intY1, intY2, objBlocAcc){

        super();

        this.intX = intX;
        this.intY1 = intY1;
        this.intY2 = intY2;
        this.objBlocAcc = objBlocAcc;
        this.objBlocOrigin = null;
    }

    dessiner () {

    }
}