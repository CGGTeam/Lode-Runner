export class Bloc {
    constructor(posXGauche, posY, intLongueur, intHauteur = 1, tEchelles = []){
        this.posXGauche = posXGauche;
        this.posY = posY;
        this.intLongueur = intLongueur;
        this.intHauteur = intHauteur;
        this.tEchelles = tEchelles;
        for(let i = 0; i<this.tEchelles.length; i++){
            this.tEchelles[i].blocOrigine = this;
        }
    }
}