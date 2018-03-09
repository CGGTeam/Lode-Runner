export class EntiteDynamique{
    /**
     * Base pour entites dynamiques
     * @param posInitX position initiale
     * @param posInitY position initiale
     */
    constructor(posInitX, posInitY){
        this.posX = posInitX;
        this.posY = posInitY;
        this.or = 0;
        this.etatVie = true;
        this.etatAnim = AnimEnum.DEFAULT;
    }

    deplacer(intNewPosX, intNewPosY){
    }
}