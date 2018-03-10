class CaseImbrisable extends Dessinable{
    constructor (posx, posy) {
        super();
        this.posx = posx;
        this.posy = posy;
    }

    dessiner () {
        dessinerCase(this.posx, this.posy, enumTypesBlocs.objBloc);
    }
}