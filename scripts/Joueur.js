const VITESSE_JOUEUR = 5;  // U/s
const FPS_ANIMATION = 0.25
const KEYS_PER_SECONDS = 30;

/**
 * Arrays de positions (index) dans le spritesheet, utiliser sx, sy de drawImage
 */
const enumMapJoueur = Object.freeze({
    RUN_R : [[0, 0],[1, 0], [2, 0]],
    RUN_L : [[3, 0],[4, 0], [5, 0]],
    FALL_R : [[8, 0]],
    FALL_L : [[8, 1]],
    CLIMB_R : [[0, 1],[1, 1], [2, 1]],
    CLIMB_L : [[3, 1],[4, 1], [5, 1]],
    CLIMB_U : [[6, 0],[7, 0]],
    CLIMB_D : [[7, 0],[6, 0]],
    DIG_R : [[6, 1]],
    DIG_L : [[7, 1]]
});

class Joueur extends EntiteDynamique {

    constructor(posInitX, posInitY) {
        super(posInitX, posInitY, enumMapJoueur, preloadImage('./assets/img/runner.png'));
        console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
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

        this.tabEtatAnim = this.enumAnim.RUN_L;
        this.dblAnimFrame = 0;
        this.binMoving = false;
        this.binMoveRight = true;
        this.binClimb = false;
        this.objCaseCreusee = null;

        this.binKeyDown = false;
        this.presentKey = null;
        this.delta = 0;
        this.lastCalled = null;
    }

    mettreAJourAnimation() {    
        this.delta = (this.lastCalled) ? Date.now() - this.lastCalled : 1/40;
        this.lastCalled = Date.now();
        if(this.binKeyDown && !this.binFalling){
            this.joueurOnKeyDown();
        }else {
            //this.lastCalled = null;
        }
        if (this.objCaseCreusee) {
            console.log(this.objCaseCreusee.binDetruit);
        }
        this.setColBin();
        //this.binFalling = false;
        if(!this.binBriqueBas && !this.binUp && !this.binDown){
            console.log("fall");
            this.binFalling = true;
            this.binMoving = false;
            this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta/100)/10);
            this.tabEtatAnim = this.binMoveRight ? 
            this.enumAnim.FALL_R : this.enumAnim.FALL_L;
            console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        } else {
            if(this.binFalling)
                this.tabEtatAnim = this.enumAnim.RUN_L;
            this.binFalling = false;
            if (this.objCaseCreusee) { 
            this.tabEtatAnim = this.binMoveRight ? enumMapJoueur.DIG_R : enumMapJoueur.DIG_L;
            if (this.objCaseCreusee.binDetruit) {
                this.objCaseCreusee = null;
                this.tabEtatAnim = this.binMoveRight ? enumMapJoueur.RUN_R : enumMapJoueur.RUN_L;
            }
        } else if(!this.binUp && !this.binDown){
            this.intPosY = Math.round(this.intPosY);
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
        // console.log(this.getCollisions());
        // console.log([this.binBriqueBas, this.binBriqueHaut, this.binBriqueGauche, this.binBriqueDroite]);

        switch (this.presentKey) {
            //Left
            case 'ArrowLeft':
                if(!this.binBriqueGauche && (this.binBriqueBas || this.binDown))
                    this.deplacer(-VITESSE_JOUEUR * this.delta /1000, 0);
                this.tabEtatAnim = this.enumAnim.RUN_L;
                this.binMoveRight = false;  
                break;
            //Up
            case 'ArrowUp':
                if (this.binUp) {
                    console.log(-Math.round(VITESSE_JOUEUR * this.delta/100)/10);
                    this.intPosX = Math.round(this.intPosX);
                    this.deplacer(0, -Math.round(VITESSE_JOUEUR * this.delta/100)/10);
                    this.tabEtatAnim = this.enumAnim.CLIMB_U;
                    this.binClimb = true;
                    this.binMoveRight = true;   
                    instanceMoteurSon.jouerSon(0,true);
                }else if(!this.binFalling){
                    this.intPosY = Math.ceil(this.intPosY);               
                }
                break;
            //Right
            case 'ArrowRight':
                if(!this.binBriqueDroite && (this.binBriqueBas || this.binDown))
                    this.deplacer(VITESSE_JOUEUR * this.delta / 1000, 0);
                this.tabEtatAnim = this.enumAnim.RUN_R;  
                this.binMoveRight = true;                                        
                break;
            //Down
            case 'ArrowDown':
                if (this.binDown) {
                    this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta/100)/10);
                    this.intPosX = Math.round(this.intPosX);
                    this.tabEtatAnim = this.enumAnim.CLIMB_D;                                                              
                    instanceMoteurSon.jouerSon(0,true);
                    this.tabEtatAnim = this.enumAnim.CLIMB_D;
                    instanceMoteurSon.jouerSon(0,true);   
                }else if(!this.binFalling){
                    this.intPosY = Math.floor(this.intPosY);                                  
                }
                break;
            case 'x':
            case 'z':
                console.log('dig');
                this.binMoveRight = this.presentKey === 'x'
                let objCase = objJeu.objNiveau.tabGrilleNiveau[Math.floor(this.intPosY) + 1]
                                                              [Math.floor(this.intPosX) - (this.presentKey === 'z' ? 1 : -1)];
                if (this.objCaseCreusee) {
                    this.objCaseCreusee.interrompreDestruction();
                    this.objCaseCreusee = null;
                }
                
                if (!this.binFalling && objCase && objCase instanceof Brique) {
                    this.intPosX = Math.floor(this.intPosX);
                    this.intPosY = Math.floor(this.intPosY);
                    objCase.detruire();
                    this.dblAnimFrame = 0;
                    this.objCaseCreusee = objCase;                    
                }
                break;
        }

        if(this.presentKey != 'ArrowUp' && this.presentKey != 'ArrowDown'){
            instanceMoteurSon.stopperSon(0);
        }

        this.getCollisions().forEach((x) => {
            if(x instanceof Lingot){
                instanceMoteurSon.jouerSon(4);
                objJeu.objNiveau.tabGrilleNiveau[x.intPosY][x.intPosX] = null;
                objJeu.objNiveau.score+=10;
                objJeu.objNiveau.updateScore();
            }
        });

        if(this.getCollisions().length == 0){
            instanceMoteurSon.jouerSon(3);
        }

        if(this.getCollisions().length != 0){
            instanceMoteurSon.stopperSon(3);
        }

    }
}