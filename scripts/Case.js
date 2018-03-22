const enumTypesBlocs = Object.freeze({
    objBrique: preloadImage('./assets/img/brick.png'),
    objEchelle: preloadImage('./assets/img/ladder.png'),
    objGrimpe: preloadImage('./assets/img/rope.png'),
    objLingot: preloadImage('./assets/img/gold.png'),
    objBloc: preloadImage('./assets/img/block.png')
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

    
    updateNav(tabGrilleNav) {
        throw 'updateNav() non implémenté';
    }

    /**
     * Voir Brique.js pour la véritable utilité de cette fonction
     * @param {Array<Case>} tabGrille 
     * @param {Map<number, Array<number>>} mapSpawn 
     */
    updateSpawn(tabGrille, mapSpawn){}
}