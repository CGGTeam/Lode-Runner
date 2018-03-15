class EntiteDynamique extends Dessinable{
    /**
     * Base pour entites dynamiques
     * @param posInitX position initiale
     * @param posInitY position initiale
     * @param {Object} enumAnim - État d'animation possibles
     * @param {Image} objSpriteSheet - spritesheet qui contient les animations
     */
    constructor(posInitX, posInitY, enumAnim, objSpriteSheet){
        super();
        this.intPosX = posInitX;
        this.intPosY = posInitY;
        this.objSpriteSheet = objSpriteSheet;
        this.or = 0;
        this.etatVie = true;
        this.enumAnim = enumAnim
        this.tabEtatAnim = this.enumAnim.RUN_R;
        this.binMoving = false;
    }

    dessiner() {
        let intFrameExact = Math.round(this.intAnimFrame)
        objC2D.drawImage(this.objSpriteSheet, dblLargCase * this.tabEtatAnim[intFrameExact][0], 
                         dblHautCase * this.tabEtatAnim[intFrameExact][1], dblLargCase, dblHautCase,
                         this.intPosX * dblLargCase, this.intPosY * dblHautCase, dblHautCase, dblLargCase, dblHautCase);
    }

    deplacer(intDeplX, intDeplY){
        this.binMoving = true;
        this.intPosX = Math.round((intDeplX+this.intPosX)*1000)/1000;
        this.intPosY = Math.round((intDeplY+this.intPosY)*1000)/1000;
        this.binBriqueGauche = false;
        this.binBriqueDroite = false;
        this.binBriqueHaut = false;
        this.binBriqueBas = true;
        this.binUp = false;
        this.binDown = false;
        this.binFalling = false;

    }

    deplacer(intDeplX, intDeplY){
        this.intPosX = Math.round((intDeplX+this.intPosX)*10000)/10000;
        this.intPosY = Math.round((intDeplY+this.intPosY)*10000)/10000;

        this.binMoveUp = intDeplY < 0 ? true : (intDeplX > 0 ? false : this.binMoveUp);
        this.binMoveRight = intDeplX > 0 ? true : (intDeplX < 0 ? false : this.binMoveRight);

        this.binMoving = true;
    }

    /**
     * Retourne les collisions
     * @returns {Array}
     */
    getCollisions() {
        let tabObjCollisions = [];
        let comparateur = function (e, element) {
            if(!e || !element)
                return true;
            return e.intPosX === element.intPosX && e.intPosY === element.intPosY;
        };
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.ceil(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.ceil(this.intPosX)], comparateur);}catch(e){}

        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY + 1)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY - 1)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY + 1)][Math.ceil(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY - 1)][Math.ceil(this.intPosX)], comparateur);}catch(e){}

        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.floor(this.intPosX + 1)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.floor(this.intPosX + 1)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.ceil(this.intPosX - 1)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.ceil(this.intPosX - 1)], comparateur);}catch(e){}

        return tabObjCollisions;
    }

    setColBin(){
        this.binUp = false;
        this.binDown = false;
        this.binBriqueGauche = false;
        this.binBriqueDroite = false;
        this.binBriqueHaut = false;
        this.binBriqueBas = false;
        this.getCollisions().forEach(value => {
            if(value instanceof Echelle){
                this.binUp = (this.binUp || (this.intPosX - 0.5 < value.intPosX && this.intPosX + 0.5 > value.intPosX && this.intPosY > value.intPosY - 1));
                this.binDown = (this.binDown || (this.intPosX - 0.5 < value.intPosX && this.intPosX + 0.5 > value.intPosX && this.intPosY < value.intPosY));
            }
            if( value instanceof Brique){
                this.binBriqueBas = (this.binBriqueBas || (this.intPosY + 1 > value.intPosY - 0.25 && this.intPosY + 1 < value.intPosY + 0.25 ));
                this.binBriqueHaut = (this.binBriqueHaut || (this.intPosY - 1 === value.intPosY));
                this.binBriqueGauche = (this.binBriqueGauche || (this.intPosX - 1 < value.intPosX + 0.3 && this.intPosX - 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1);
                this.binBriqueDroite = (this.binBriqueDroite || (this.intPosX + 1 < value.intPosX + 0.3 && this.intPosX + 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1);
            }
        });
    }
}