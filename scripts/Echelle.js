class Echelle extends Case {
    constructor (intPosX, intPosY) {
        super(intPosX, intPosY, enumTypesBlocs.objEchelle);
    }

    updateNav(tabGrilleNav, tabGrilleNiveau) {
        tabGrilleNav[this.intPosY][this.intPosX] = true;
        if (this.intPosY > 0 && (!tabGrilleNiveau[this.intPosY - 1][this.intPosX] || tabGrilleNiveau[this.intPosY - 1][this.intPosX] instanceof Lingot)) {
            tabGrilleNav[this.intPosY - 1][this.intPosX] = true;                    
        }
    }
}