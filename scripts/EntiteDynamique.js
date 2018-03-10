class EntiteDynamique extends Dessinable{
    /**
     * Base pour entites dynamiques
     * @param posInitX position initiale
     * @param posInitY position initiale
     * @param dessiner
     */
    constructor(posInitX, posInitY){
        super();
        this.posX = posInitX;
        this.posY = posInitY;
        this.or = 0;
        this.etatVie = true;
        this.etatAnim = AnimEnum.DEFAULT;

    }

    deplacer(intDeplX, intDeplY){
        this.posX += intDeplX;
        this.posY += intDeplY;
    }

}