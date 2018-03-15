class TypeBloc { 
    constructor(strUrl) {
        this.objImage = new Image();
        this.objImage.src = strUrl;
    }
}

const enumTypesBlocs = Object.freeze({
    objBrique: new TypeBloc('./assets/img/brick.png'),
    objEchelle: new TypeBloc('./assets/img/ladder.png'),
    objGrimpe: new TypeBloc('./assets/img/rope.png'),
    objLingot: new TypeBloc('./assets/img/gold.png'),
    objBloc: new TypeBloc('./assets/img/block.png'),
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
                         this.intPosY * dblHautCase);
    }

    updateNav(tabGrilleNiveau) {
        throw 'updateNav() non implémenté';
    }
}