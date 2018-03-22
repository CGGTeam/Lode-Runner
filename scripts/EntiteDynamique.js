class EntiteDynamique extends Dessinable{
    /**
     * Base pour entites dynamiques
     * @param {Number} posInitX position initiale
     * @param {Number} posInitY position initiale
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
        let intFrameExact = Math.floor(this.dblAnimFrame)
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
        this.binBriqueLive = false;
        this.binUp = false;
        this.binDown = false;
        this.binMoveUp = intDeplY < 0 ? true : (intDeplX > 0 ? false : this.binMoveUp);
        this.binMoveRight = intDeplX > 0 ? true : (intDeplX < 0 ? false : this.binMoveRight);
    }

    /**
     * Retourne les collisions
     * @returns {Array<Case>}
     */
    getCollisions() {
        let tabObjCollisions = [];
        let comparateur = function (e, element) {
            if(!e || !element)
                return true;

            return e.intPosX === element.intPosX && e.intPosY === element.intPosY;
        };
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.intPosY)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY)][Math.ceil(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.intPosY)][Math.ceil(this.intPosX)], comparateur);}catch(e){}

        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY + 1)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.intPosY - 1)][Math.floor(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY + 1)][Math.ceil(this.intPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.intPosY - 1)][Math.ceil(this.intPosX)], comparateur);}catch(e){}

        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY)][Math.floor(this.intPosX + 0.5)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.intPosY)][Math.floor(this.intPosX + 0.5)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY)][Math.ceil(this.intPosX - 0.5)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.intPosY)][Math.ceil(this.intPosX - 0.5)], comparateur);}catch(e){}

        return tabObjCollisions;
    }

    setColBin(){
        this.binUp = false;
        this.binDown = false;
        this.binBriqueGauche = false;
        this.binBriqueDroite = false;
        this.binBriqueHaut = false;
        this.binBriqueBas = false;
        this.binBarre = false;
        this.binBriqueLive = false;
        this.getCollisions().forEach(value => {
            if(value instanceof Echelle){
                this.binUp = (this.binUp || (this.intPosX - 0.5 < value.intPosX && this.intPosX + 0.5 > value.intPosX && this.intPosY > value.intPosY - 1));
                this.binDown = (this.binDown || (this.intPosX - 0.5 < value.intPosX && this.intPosX + 0.5 > value.intPosX && this.intPosY < value.intPosY));

            } else if( value instanceof Brique){
                this.binBriqueBas = (this.binBriqueBas || (this.intPosY + 1 > value.intPosY - 0.25 && this.intPosY + 1 < value.intPosY + 0.25 ) && !value.binDetruit);
                this.binBriqueHaut = (this.binBriqueHaut || (this.intPosY - 1 === value.intPosY));
                this.binBriqueGauche = (this.binBriqueGauche || (this.intPosX - 1 < value.intPosX + 0.3 && this.intPosX - 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1  && !value.binDetruit);
                this.binBriqueDroite = (this.binBriqueDroite || (this.intPosX + 1 < value.intPosX + 0.3 && this.intPosX + 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1)  && !value.binDetruit;

                this.binBriqueLive = ((this.intPosY > value.intPosY - 0.5 && this.intPosY < value.intPosY + 0.5 ) && (this.intPosX < value.intPosX + 0.5 && this.intPosX > value.intPosX - 0.5)) && !value.binDetruit;
                if(this.binBriqueLive){
                    this.mourrir();
                }

            } else if (value instanceof Bloc) {

                this.binBriqueBas = (this.binBriqueBas || (this.intPosY + 1 > value.intPosY - 0.25 && this.intPosY + 1 < value.intPosY + 0.25 ));
                this.binBriqueHaut = (this.binBriqueHaut || (this.intPosY - 1 === value.intPosY));
                this.binBriqueGauche = (this.binBriqueGauche || (this.intPosX - 1 < value.intPosX + 0.3 && this.intPosX - 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1);
                this.binBriqueDroite = (this.binBriqueDroite || (this.intPosX + 1 < value.intPosX + 0.3 && this.intPosX + 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1);

            }else if ( value instanceof Barre){
                this.binBarre = (value.intPosY == Math.round(this.intPosY));
            }
        });
    }

    mourrir(){

    }
}