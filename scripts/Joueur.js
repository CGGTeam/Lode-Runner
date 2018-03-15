const VITESSE_JOUEUR = 5;  // U/s
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
        this.setColBin();
        this.binFalling = false;
        if(!this.binBriqueBas && !this.binUp && !this.binDown){
            console.log("fall");
            this.binFalling = true;
            this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta/100)/10);
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
                    this.deplacer(-VITESSE_JOUEUR * this.delta /1000, 0);
                break;
            //Up
            case 38:
                if (this.binUp) {
                    console.log(-Math.round(VITESSE_JOUEUR * this.delta/100)/10);
                    this.intPosX = Math.round(this.intPosX);
                    this.deplacer(0, -Math.round(VITESSE_JOUEUR * this.delta/100)/10);
                }else if(!this.binFalling){
                    this.intPosY = Math.ceil(this.intPosY);
                }
                break;
            //Right
            case 39:
                if(!this.binBriqueDroite && (this.binBriqueBas || this.binDown))
                    this.deplacer(VITESSE_JOUEUR * this.delta / 1000, 0);
                break;
            //Down
            case 40:
                if (this.binDown) {
                    this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta/100)/10);
                    this.intPosX = Math.round(this.intPosX);
                }else if(!this.binFalling){
                    this.intPosY = Math.floor(this.intPosY);
                }
                break;
        }
    }


}