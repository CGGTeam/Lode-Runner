class Echelle extends Case {
    constructor (intPosX, intPosY) {
        super(intPosX, intPosY, enumTypesBlocs.objEchelle.objImage);
    }

    updateNav(tabGrilleNav) {
        tabGrilleNav[this.intPosY][this.intPosX] = true;
    }
}