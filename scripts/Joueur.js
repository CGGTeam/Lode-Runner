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
    }

    mettreAJourAnimation() {

        if(this.binKeyDown){
            this.delta = (this.lastCalled) ? Date.now() - this.lastCalled : 1/40;
            this.lastCalled = Date.now();
            this.joueurOnKeyDown();
        }else {
            this.lastCalled = null;
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

        //Check si on peut aller vers le haut ou bas d'une echelle
        let binUp = false;
        let binDown = false;
        this.getCollisions().forEach(value => {
            if(Echelle.prototype.isPrototypeOf(value)){
                binUp = (binUp || (this.intPosX - 0.25 < value.intPosX && this.intPosX + 0.25 > value.intPosX && this.intPosY > value.intPosY - 1));
                binDown = (binDown || (this.intPosX - 0.25 < value.intPosX && this.intPosX + 0.25 > value.intPosX && this.intPosY < value.intPosY));
            }
        });

        //DEBUG GAME
        console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        console.log(this.getCollisions());

        switch (this.presentKey) {
            //Left
            case 37:
                this.deplacer(-VITESSE_JOUEUR * this.delta, 0);
                break;
            //Up
            case 38:
                if (binUp) {
                    this.deplacer(0, -Math.round(VITESSE_JOUEUR * this.delta*10)/10 /2);
                    instanceMoteurSon.jouerSon(0,true);
                }
                break;
            //Right
            case 39:
                this.deplacer(VITESSE_JOUEUR * this.delta, 0);
                break;
            //Down
            case 40:
                if (binDown) {
                    this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta*10)/10 /2);
                    instanceMoteurSon.jouerSon(0,true);
                }
                break;
        }

        if(this.presentKey != 38 && this.presentKey != 40){
            objJeu.instanceMoteurSon.stopperSon(0);
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
}