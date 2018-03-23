const enumTypesBlocs = Object.freeze({
    objBrique: preloadImage('https://cggteam.github.io/Lode-Runner/assets/img/brick.png'),
    objEchelle: preloadImage('https://cggteam.github.io/Lode-Runner/assets/img/ladder.png'),
    objGrimpe: preloadImage('https://cggteam.github.io/Lode-Runner/assets/img/rope.png'),
    objLingot: preloadImage('https://cggteam.github.io/Lode-Runner/assets/img/gold.png'),
    objBloc: preloadImage('https://cggteam.github.io/Lode-Runner/assets/img/block.png')
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