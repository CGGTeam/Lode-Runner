class Brique extends Case{
    constructor (intPosX, intPosY) {
        super(intPosX, intPosY, enumTypesBlocs.objBrique);
    }

    updateNav(tabGrilleNav) {
        if (this.intPosY > 0) {
            tabGrilleNav[this.intPosY - 1][this.intPosX] = true;                    
        }
    }
}