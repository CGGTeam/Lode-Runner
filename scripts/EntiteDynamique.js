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

    }

    deplacer(intDeplX, intDeplY){
        this.intPosX = Math.round((intDeplX+this.intPosX)*10000)/10000;
        this.intPosY = Math.round((intDeplY+this.intPosY)*10000)/10000;
    }

}