class Bloc extends Dessinable{
    /**
     * Blocs de jeu (separes par trous ou fin de carte)
     * @param {Number} posXGauche - Position de la coordonnes la plus a gauche
     * @param {Number} posY - Position Y la plus pres du bas
     * @param {Number} intLongueur
     * @param {Array} [mapPasserelles=[]] - Map des positions de début et de fin des passerelles de ce
     * bloc. Key = valeur x qui = limite à gauche, Value = valeur x qui = limite à droite
     * @param {Array} [tEchelles=[]] - Tableau d'objets echelles
     */
    constructor(posXGauche, posY, intLongueur, mapPasserelles=[], tEchelles = []){
        super();

        this.posXGauche = posXGauche;
        this.posY = posY;
        this.intLongueur = intLongueur;
        // this.intHauteur = intHauteur;
        this.mapPasserelles = mapPasserelles;
        this.tEchelles = tEchelles;
        for(let i = 0; i<this.tEchelles.length; i++){
            this.tEchelles[i].blocOrigine = this;
        }
    }

    dessiner() {
        let tPositionsEchelles = this.tEchelles.map(e => e.intX);

        for (var i = this.posXGauche; i < this.posXGauche + this.intLongueur; i++) {
            if (tPositionsEchelles.indexOf(i) == -1) {
                let binBarre;
                this.mapPasserelles.forEach(element => {
                    if (i >= element[0] && i <= element[1]){
                        binBarre = true;
                    }
                });
                
                //Brique normale
                if (binBarre){
                    dessinerCase(i, this.posY - 1, enumTypesBlocs.objGrimpe);
                } else {
                    dessinerCase(i, this.posY, enumTypesBlocs.objBrique);
                }
            }
        }
    }

    mettreAJourAnimation() {

    }

    /**
     * Fusionne deux blocs ensemble
     * @param {Bloc} objAutreBloc 
     */
    merge (objAutreBloc) {
        this.mapPasserelles = this.mapPasserelles.concat(objAutreBloc.mapPasserelles);
        this.posXGauche = Math.min(objAutreBloc.posXGauche, this.posXGauche);
        this.intLongueur = Math.max(objAutreBloc.posXGauche + objAutreBloc.intLongueur, this.posXGauche + this.intLongueur) - this.posXGauche;
    }
}