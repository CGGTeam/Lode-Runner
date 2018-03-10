class Lingot extends Dessinable{
    constructor(posx, posy){
        super();
        this.posx;
        this.posy;
    }

    dessiner () {
        dessinerCase(this.posx, this.posy, enumTypesBlocs.objLingot);
    }
}