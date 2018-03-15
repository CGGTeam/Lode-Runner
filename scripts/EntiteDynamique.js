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
        this.binMoving = false;
    }

    deplacer(intDeplX, intDeplY){
        this.binMoving = true;
        this.intPosX = Math.round((intDeplX+this.intPosX)*1000)/1000;
        this.intPosY = Math.round((intDeplY+this.intPosY)*1000)/1000;
    }

}