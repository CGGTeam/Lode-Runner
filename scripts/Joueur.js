const VITESSE_JOUEUR = 1/120;  // U/s
const KEYS_PER_SECONDS = 30;

class Joueur extends EntiteDynamique {

    constructor(posInitX, posInitY) {
        super(posInitX, posInitY);
        console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        this.score = 0;
        document.addEventListener('keydown', (event) => {
            this.setKeyDown(true,event.keyCode);
        });
        document.addEventListener('keyup', () => {
            this.setKeyDown(false);
        });
        this.objImage = new Image();
        this.objImage.src = 'assets/img/perso.png';
        this.binKeyDown = false;
        this.presentKey = null;
        this.delta = 0;
        this.lastCalled = null;
        this.binBriqueGauche = false;
        this.binBriqueDroite = false;
        this.binBriqueHaut = false;
        this.binBriqueBas = true;
        this.binUp = false;
        this.binDown = false;
    }

    mettreAJourAnimation() {
        if(this.binKeyDown){
            this.delta = (this.lastCalled) ? Date.now() - this.lastCalled : 1/40;
            this.lastCalled = Date.now();
            this.joueurOnKeyDown();
        }else {
            this.lastCalled = null;
        }
        this.setColBin();
        if(!this.binBriqueBas && !this.binUp && !this.binDown){
            console.log("fall");
            this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta*10 /2)/10);
            console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        }
    }

    dessiner() {
        objC2D.drawImage(this.objImage, this.intPosX * dblLargCase,
            this.intPosY * dblHautCase, dblLargCase, dblHautCase);
    }

    /**
     * Change l'etat keyDown
     * @param newValue (binKeyDown)
     * @param newKey (key)
     */
    setKeyDown(newValue, newKey = null){
        this.binKeyDown = newValue;
        this.presentKey = newKey;
    }


    /**
     * Appele a chaque frame de mouvement
     */
    joueurOnKeyDown() {

        //this.setColBin();
        //DEBUG GAME
        console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        console.log(this.getCollisions());
        console.log([this.binBriqueBas, this.binBriqueHaut, this.binBriqueGauche, this.binBriqueDroite]);


        switch (this.presentKey) {
            //Left
            case 37:
                if(!this.binBriqueGauche && (this.binBriqueBas || this.binDown))
                    this.deplacer(-VITESSE_JOUEUR * this.delta, 0);
                break;
            //Up
            case 38:
                if (this.binUp) {
                    console.log(-Math.round(VITESSE_JOUEUR * this.delta*10)/10);
                    this.intPosX = Math.round(this.intPosX);
                    this.deplacer(0, -Math.round(VITESSE_JOUEUR * this.delta*10)/10);
                }else {
                    this.intPosY = Math.ceil(this.intPosY);
                }
                break;
            //Right
            case 39:
                if(!this.binBriqueDroite && (this.binBriqueBas || this.binDown))
                    this.deplacer(VITESSE_JOUEUR * this.delta, 0);
                break;
            //Down
            case 40:
                if (this.binDown) {
                    this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta*10)/10);
                    this.intPosX = Math.round(this.intPosX);
                }else{
                    this.intPosY = Math.floor(this.intPosY);
                }
                break;
        }
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
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.floor(this.intPosX)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.floor(this.intPosX)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.ceil(this.intPosX)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.ceil(this.intPosX)], comparateur);

        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY + 1)][Math.floor(this.intPosX)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY - 1)][Math.floor(this.intPosX)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY + 1)][Math.ceil(this.intPosX)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY - 1)][Math.ceil(this.intPosX)], comparateur);

        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.floor(this.intPosX + 1)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.floor(this.intPosX + 1)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.floor(this.intPosY)][Math.ceil(this.intPosX - 1)], comparateur);
        tabObjCollisions.pushIfNotExist(objJeu.tabObjets[0].tabGrilleNiveau[Math.ceil(this.intPosY)][Math.ceil(this.intPosX - 1)], comparateur);

        return tabObjCollisions;
    }

    setColBin(){
//Check si on peut aller vers le haut ou bas d'une echelle
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