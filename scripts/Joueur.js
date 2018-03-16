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
    DIG_R : [6, 0],
    DIG_L : [7, 0],
});

class Joueur extends EntiteDynamique {

    constructor(posInitX, posInitY) {
        super(posInitX, posInitY, enumMapJoueur, preloadImage('./assets/img/runner.png'));
        console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        this.score = 0;
        document.addEventListener('keydown', (event) => {
            this.setKeyDown(true,event.keyCode);
        });
        document.addEventListener('keyup', () => {
            this.setKeyDown(false);
        });

        this.tabEtatAnim = this.enumAnim.RUN_L;
        this.intAnimFrame = 0;
        this.binMoving = false;
        this.binMoveRight = true;
        this.binClimb = false;

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
            this.tabEtatAnim = this.binMoveRight ? 
            this.enumAnim.FALL_R : this.enumAnim.FALL_L;
            console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        }else if(!this.binUp && !this.binDown){
            this.intPosY = Math.round(this.intPosY);
        }
        
        if (this.binMoving) {
            this.binMoving = false;                    
            this.intAnimFrame += FPS_ANIMATION;            
        }

        if (Math.round(this.intAnimFrame) >= this.tabEtatAnim.length) {
            this.intAnimFrame = 0;
        }
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
                this.tabEtatAnim = this.enumAnim.RUN_L;
                this.binMoveRight = false;  
                break;
            //Up
            case 38:
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
            case 39:
                if(!this.binBriqueDroite && (this.binBriqueBas || this.binDown))
                    this.deplacer(VITESSE_JOUEUR * this.delta / 1000, 0);
                this.tabEtatAnim = this.enumAnim.RUN_R;  
                this.binMoveRight = true;                                        
                break;
            //Down
            case 40:
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
        }

        if(this.presentKey != 38 && this.presentKey != 40){
            instanceMoteurSon.stopperSon(0);
        }

        this.getCollisions().forEach((x) => {
            if(x instanceof Lingot){
                instanceMoteurSon.jouerSon(4);
                objJeu.tabObjets[0].tabGrilleNiveau[x.intPosY][x.intPosX] = null;
                objJeu.tabObjets[0].score+=10;
                objJeu.tabObjets[0].updateScore();
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