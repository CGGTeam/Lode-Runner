class Bloc {
    /**
     * Blocs de jeu (separes par trous ou fin de carte)
     * @param posXGauche Position de la coordonnes la plus a gauche
     * @param posY Position Y la plus pres du bas
     * @param intLongueur
     * @param intHauteur
     * @param tEchelles tableau d'objets echelles
     */
    constructor(posXGauche, posY, intLongueur, intHauteur = 1, tEchelles = []){

        super(function dessiner () {

        });


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