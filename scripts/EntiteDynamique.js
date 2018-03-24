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
        this.dblPosX = posInitX;
        this.dblPosY = posInitY;
        this.objSpriteSheet = objSpriteSheet;
        this.or = 0;
        this.binEtatVie = true;
        this.enumAnim = enumAnim
        this.tabEtatAnim = this.enumAnim.RUN_R;
        this.binMoving = false;
        this.binMoveRight = true;
    }

    dessiner() {
        let intFrameExact = Math.floor(this.dblAnimFrame);
        objC2D.drawImage(this.objSpriteSheet, dblLargCase * this.tabEtatAnim[intFrameExact][0], 
                         dblHautCase * this.tabEtatAnim[intFrameExact][1], dblLargCase, dblHautCase,
                         this.dblPosX * dblLargCase, this.dblPosY * dblHautCase, dblHautCase, dblLargCase, dblHautCase);
    }

    deplacer(intDeplX, intDeplY){
        this.binMoving = true;
        this.dblPosX = Math.round((intDeplX+this.dblPosX)*1000)/1000;
        this.dblPosY = Math.round((intDeplY+this.dblPosY)*1000)/1000;
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
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY)][Math.floor(this.dblPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.dblPosY)][Math.floor(this.dblPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY)][Math.ceil(this.dblPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.dblPosY)][Math.ceil(this.dblPosX)], comparateur);}catch(e){}

        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY + 1)][Math.floor(this.dblPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.dblPosY - 1)][Math.floor(this.dblPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY + 1)][Math.ceil(this.dblPosX)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.dblPosY - 1)][Math.ceil(this.dblPosX)], comparateur);}catch(e){}

        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY)][Math.floor(this.dblPosX + 0.5)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.dblPosY)][Math.floor(this.dblPosX + 0.5)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY)][Math.ceil(this.dblPosX - 0.5)], comparateur);}catch(e){}
        try{tabObjCollisions.pushIfNotExist(objJeu.objNiveau.tabGrilleNiveau[Math.ceil(this.dblPosY)][Math.ceil(this.dblPosX - 0.5)], comparateur);}catch(e){}

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
                this.binUp = (this.binUp || (this.dblPosX - 0.5 < value.intPosX && this.dblPosX + 0.5 > value.intPosX && this.dblPosY > value.intPosY - 1));
                this.binDown = (this.binDown || (this.dblPosX - 0.5 < value.intPosX && this.dblPosX + 0.5 > value.intPosX && this.dblPosY < value.intPosY));

            } else if( value instanceof Brique){
                this.binBriqueBas = (this.binBriqueBas || (this.dblPosY + 1 > value.intPosY - 0.25 && this.dblPosY + 1 < value.intPosY + 0.25 ) && !value.binDetruit);
                this.binBriqueHaut = (this.binBriqueHaut || (this.dblPosY - 1 === value.intPosY));
                this.binBriqueGauche = (this.binBriqueGauche || (this.dblPosX - 1 < value.intPosX + 0.3 && this.dblPosX - 1 > value.intPosX - 0.3)
                    && this.dblPosY < value.intPosY + 1 && this.dblPosY > value.intPosY - 1  && !value.binDetruit);
                this.binBriqueDroite = (this.binBriqueDroite || (this.dblPosX + 1 < value.intPosX + 0.3 && this.dblPosX + 1 > value.intPosX - 0.3)
                    && this.dblPosY < value.intPosY + 1 && this.dblPosY > value.intPosY - 1)  && !value.binDetruit;

                this.binBriqueLive = ((this.dblPosY > value.intPosY - 0.5 && this.dblPosY < value.intPosY + 0.5 ) && (this.dblPosX < value.intPosX + 0.5 && this.dblPosX > value.intPosX - 0.5)) && !value.binDetruit;
                //console.log(this.binBriqueLive);
                //console.log(value);
                if(this.binBriqueLive){
                    console.log(this.binBriqueLive);
                    this.mourir();
                }

            } else if (value instanceof Bloc) {

                this.binBriqueBas = (this.binBriqueBas || (this.dblPosY + 1 > value.intPosY - 0.25 && this.dblPosY + 1 < value.intPosY + 0.25 ));
                this.binBriqueHaut = (this.binBriqueHaut || (this.dblPosY - 1 === value.intPosY));
                this.binBriqueGauche = (this.binBriqueGauche || (this.dblPosX - 1 < value.intPosX + 0.3 && this.dblPosX - 1 > value.intPosX - 0.3)
                    && this.dblPosY < value.intPosY + 1 && this.dblPosY > value.intPosY - 1);
                this.binBriqueDroite = (this.binBriqueDroite || (this.dblPosX + 1 < value.intPosX + 0.3 && this.dblPosX + 1 > value.intPosX - 0.3)
                    && this.dblPosY < value.intPosY + 1 && this.dblPosY > value.intPosY - 1);

            }else if ( value instanceof Barre){
                this.binBarre = (value.intPosY == Math.round(this.dblPosY));
            }
        });
    }

    mourir(){

    }
}