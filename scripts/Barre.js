class Barre extends Case{ 
    constructor (intPosX, intPosY) {
        super(intPosX, intPosY, enumTypesBlocs.objGrimpe.objImage);
    }

    updateNav(tabGrilleNav) {
        tabGrilleNav[this.intPosY][this.intPosX] = true;
    }
}