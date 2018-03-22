const VITESSE_JOUEUR = 5;  // U/s
const FPS_ANIMATION = 0.25;
const KEYS_PER_SECONDS = 30;

/**
 * Arrays de positions (index) dans le spritesheet, utiliser sx, sy de drawImage
 */
const enumMapJoueur = Object.freeze({
    RUN_R: [[0, 0], [1, 0], [2, 0]],
    RUN_L: [[3, 0], [4, 0], [5, 0]],
    FALL_R: [[8, 0]],
    FALL_L: [[8, 1]],
    CLIMB_R: [[0, 1], [1, 1], [2, 1]],
    CLIMB_L: [[3, 1], [4, 1], [5, 1]],
    CLIMB_U: [[6, 0], [7, 0]],
    CLIMB_D: [[7, 0], [6, 0]],
    DIG_R: [[6, 1]],
    DIG_L: [[7, 1]]
});

class Joueur extends EntiteDynamique {

    /**
     * @param {number} intPosInitX position initiale x dans la grille
     * @param {number} intPosInitY position initiale y dans la grille
     */
    constructor(intPosInitX, intPosInitY) {
        super(intPosInitX, intPosInitY, enumMapJoueur, preloadImage('./assets/img/runner.png'));
        this.score = 0;
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    event.preventDefault();
                    break;
            }
            this.setKeyDown(true, event.key);
        });
        document.addEventListener('keyup', () => {
            this.setKeyDown(false);
        });

        this.tabEtatAnimPrev = this.enumAnim.RUN_L;
        this.tabEtatAnim = this.enumAnim.RUN_L;
        this.dblAnimFrame = 0;
        this.binMoving = false;
        this.binMoveRight = true;
        this.binClimb = false;
        this.objCaseCreusee = null;
        this.intNbSonJoueur = null;

        this.binKeyDown = false;
        this.presentKey = null;
        this.delta = 0;
        this.lastCalled = null;
        this.lastDescBarre = null;
    }

    mettreAJourAnimation() {
        if (this.dblPosY <= 0) {
            objJeu.prochainNiveau();
        }
        
        let binChange = false;
        if (this.tabEtatAnimPrev != this.tabEtatAnim) {
            this.tabEtatAnimPrev = this.tabEtatAnim;
            binChange = true;
        }

        this.delta = (this.lastCalled) ? Date.now() - this.lastCalled : 1 / 40;
        this.lastCalled = Date.now();
        if (this.binKeyDown && !this.binFalling) {
            this.joueurOnKeyDown();
        } else {
            //this.lastCalled = null;
        }

        this.setColBin();

        let binLoop;
        let intAncienSon = this.intNbSonJoueur;
        switch(this.tabEtatAnim){
            case enumMapJoueur.FALL_L:
            case enumMapJoueur.FALL_R:
                this.intNbSonJoueur = 3;
                binLoop = false;
                break;
            case enumMapJoueur.CLIMB_L:
            case enumMapJoueur.CLIMB_R:
                this.intNbSonJoueur = 0;
                binLoop = true;
                break;
            case enumMapJoueur.CLIMB_D:
            case enumMapJoueur.CLIMB_U:
                this.intNbSonJoueur = 0;
                binLoop = true;
                break;
            case enumMapJoueur.DIG_R:
            case enumMapJoueur.DIG_L:
                instanceMoteurSon.jouerSon(2, false);
                break;
            case enumMapJoueur.RUN_L:
            case enumMapJoueur.RUN_R:
                this.intNbSonJoueur = null;
                break;
        }


        if (this.intNbSonJoueur !== null && this.intNbSonJoueur !== intAncienSon){
            instanceMoteurSon.stopperSon(intAncienSon);
            instanceMoteurSon.jouerSon(this.intNbSonJoueur, binLoop);
        } else if (this.intNbSonJoueur === null || (!this.binMoving && !this.binFalling)) {
            instanceMoteurSon.stopperSon(intAncienSon);
            this.intNbSonJoueur = null;
        }

        if((this.lastDescBarre && this.dblPosY - this.lastDescBarre <= 1) || !this.binBriqueBas && !this.binUp && !this.binDown && !this.binBarre){
            this.binFalling = true;
            this.binMoving = false;
            this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta / 100) / 10);
            this.tabEtatAnim = this.binMoveRight ?
                this.enumAnim.FALL_R : this.enumAnim.FALL_L;
        } else {
            this.lastDescBarre = null;
            if(this.binFalling && this.binBarre)
                this.tabEtatAnim = this.enumAnim.CLIMB_R
            else if(this.binFalling)
                this.tabEtatAnim = this.enumAnim.RUN_L;
            this.binFalling = false;
            if (this.objCaseCreusee) {
                this.tabEtatAnim = this.binMoveRight ? enumMapJoueur.DIG_R : enumMapJoueur.DIG_L;
                if (this.objCaseCreusee.binDetruit) {
                    this.objCaseCreusee = null;
                    this.tabEtatAnim = this.binMoveRight ? enumMapJoueur.RUN_R : enumMapJoueur.RUN_L;
                }
            } else if (!this.binUp && !this.binDown) {
                this.dblPosY = Math.round(this.dblPosY);
            }
        }
        if (this.binMoving || this.binFalling) {
            if (this.objCaseCreusee) {
                this.objCaseCreusee.interrompreDestruction();
                this.objCaseCreusee = null;
            }
            this.binMoving = false;
            this.dblAnimFrame += FPS_ANIMATION;
        }

        if (Math.round(this.dblAnimFrame) >= this.tabEtatAnim.length) {
            this.dblAnimFrame = 0;
        }
    }

    /**
     * Change l'etat keyDown
     * @param {boolean} newValue (binKeyDown)
     * @param {string} newKey (key)
     */
    setKeyDown(newValue, newKey = null) {
        this.binKeyDown = newValue;
        this.presentKey = newKey;
    }

    /**
     * Appele a chaque frame de mouvement
     */
    joueurOnKeyDown() {
        switch (this.presentKey) {
            //Left
            case 'ArrowLeft':
                if((!this.binBriqueGauche && (this.binBriqueBas || this.binDown)) || this.binBarre)
                    this.deplacer(-VITESSE_JOUEUR * this.delta /1000, 0);
                if(this.binBarre)
                    this.tabEtatAnim = this.enumAnim.CLIMB_L;
                else
                    this.tabEtatAnim = this.enumAnim.RUN_L;
                this.binMoveRight = false;  
                break;
            //Up
            case 'ArrowUp':
                if (this.binUp) {
                    this.dblPosX = Math.round(this.dblPosX);
                    this.deplacer(0, -Math.round(VITESSE_JOUEUR * this.delta / 100) / 10);
                    this.tabEtatAnim = this.enumAnim.CLIMB_U;
                    this.binClimb = true;
                    this.binMoveRight = true;
                } else if (!this.binFalling) {
                    this.dblPosY = Math.ceil(this.dblPosY);
                }
                break;
            //Right
            case 'ArrowRight':
                if((!this.binBriqueDroite && (this.binBriqueBas || this.binDown)) || this.binBarre)
                    this.deplacer(VITESSE_JOUEUR * this.delta / 1000, 0);
                if(this.binBarre)
                    this.tabEtatAnim = this.enumAnim.CLIMB_R;
                else
                    this.tabEtatAnim = this.enumAnim.RUN_R;  
                this.binMoveRight = true;                                        
                break;
            //Down
            case 'ArrowDown':
                if(this.binBarre && !this.binBriqueBas)
                    this.lastDescBarre = this.dblPosY;
                if (this.binDown) {
                    this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta / 100) / 10);
                    this.dblPosX = Math.round(this.dblPosX);
                    this.tabEtatAnim = this.enumAnim.CLIMB_D;
                } else if (!this.binFalling) {
                    this.dblPosY = Math.floor(this.dblPosY);
                }
                break;
            case 'x':
            case 'z':
                console.log('dig');
                this.binMoveRight = this.presentKey === 'x';
                let objCase = objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.dblPosY) + 1]
                    [Math.floor(this.dblPosX) - (this.presentKey === 'z' ? 1 : -1)];
                if (this.objCaseCreusee) {
                    this.objCaseCreusee.interrompreDestruction();
                    this.objCaseCreusee = null;
                }

                if (!this.binFalling && objCase && objCase instanceof Brique) {
                    this.dblPosX = Math.floor(this.dblPosX);
                    this.dblPosY = Math.floor(this.dblPosY);
                    objCase.detruire();
                    this.dblAnimFrame = 0;
                    this.objCaseCreusee = objCase;
                }
                break;
            case 'p':
                objJeu.objNiveau.tabGardes[0].pathFinding();
                break;
        }

        this.getCollisions().forEach((x) => {
            if (x instanceof Lingot) {
                instanceMoteurSon.jouerSon(4);
                objJeu.objNiveau.tabGrilleNiveau[x.intPosY][x.intPosX] = null;
                objJeu.ramasseLingot();
            }
        });
    }

    mourir(){
        console.log("hes dead jim")
        //Play ded sound
        instanceMoteurSon.jouerSon(1);
        //Take off life
        //Reset level
        objJeu.jouerMort();
    }

}