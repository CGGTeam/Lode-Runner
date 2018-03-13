class TypeBloc { 
    constructor(strUrl) {
        this.objImage = new Image();
        this.objImage.src = strUrl;
    }
}

var enumTypesBlocs = Object.freeze({
    objBrique: new TypeBloc('./assets/img/brick.png'),
    objEchelle: new TypeBloc('./assets/img/ladder.png'),
    objGrimpe: new TypeBloc('./assets/img/climb.png'),
    objLingot: new TypeBloc('./assets/img/lingot.png'),
    objBloc: new TypeBloc('./assets/img/bloc.png'),
});

class Case extends Dessinable {
    constructor(intPosX, intPosY, objImage) {
        super();
        this.intPosX = intPosX;
        this.intPosY = intPosY;
        this.objImage = objImage;
    }

    dessiner() {
        objC2D.drawImage(this.objImage, this.intPosX * dblLargCase,
                         this.intPosY * dblHautCase, dblLargCase, dblHautCase);
    }

    updateNav(tabGrilleNiveau) {
        throw 'updateNav() non implémenté';
    }
}