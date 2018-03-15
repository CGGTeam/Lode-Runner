class EntiteDynamique extends Dessinable{
    /**
     * Base pour entites dynamiques
     * @param posInitX position initiale
     * @param posInitY position initiale
     * @param dessiner
     */
    constructor(posInitX, posInitY){
        super();
        this.intPosX = posInitX;
        this.intPosY = posInitY;
        this.or = 0;
        this.etatVie = true;
        this.etatAnim = AnimEnum.DEFAULT;
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
                this.binBriqueBas = (this.binBriqueBas || (this.intPosY + 1 === value.intPosY));
                this.binBriqueHaut = (this.binBriqueHaut || (this.intPosY - 1 === value.intPosY));
                this.binBriqueGauche = (this.binBriqueGauche || (this.intPosX - 1 < value.intPosX + 0.3 && this.intPosX - 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1);
                this.binBriqueDroite = (this.binBriqueDroite || (this.intPosX + 1 < value.intPosX + 0.3 && this.intPosX + 1 > value.intPosX - 0.3)
                    && this.intPosY < value.intPosY + 1 && this.intPosY > value.intPosY - 1);

            }
        });
    }
}