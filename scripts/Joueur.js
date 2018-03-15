const VITESSE_JOUEUR = 1/120;  // U/s
const FPS_ANIMATION = 0.25
const KEYS_PER_SECONDS = 30;
/**
 * Arrays de positions (index) dans le spritesheet, utiliser sx, sy de drawImage
 * EX: drawImage(img, dblLargCase * enumAnimationsJoueur.RUN_R[index][0], 
 *               dblHautCase * enumAnimationsJoueur.RUN_R[index][0], dblLargCase, dblHautCase,
 *               posx, posy);
 */
const enumCharSpriteSheetMap = Object.freeze({
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
})

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

        this.objSpriteSheet = preloadImage('./assets/img/runner.png');
        this.tabEtatAnim = enumCharSpriteSheetMap.RUN_L;
        this.intAnimFrame = 0;
        this.binMoving = false;

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
            this.tabEtatAnim = this.tabEtatAnim === enumCharSpriteSheetMap.RUN_L ? 
                               enumCharSpriteSheetMap.FALL_L : enumCharSpriteSheetMap.FALL_R
            console.log('JOUEUR X: ' + this.intPosX + ' Y: ' + this.intPosY);
        }
        
        if (this.binMoving) {
            this.binMoving = false;                    
            this.intAnimFrame += FPS_ANIMATION;            
        }

        if (Math.round(this.intAnimFrame) >= this.tabEtatAnim.length) {
            this.intAnimFrame = 0;
        }
    }

    dessiner() {
        let intFrameExact = Math.round(this.intAnimFrame)
        objC2D.drawImage(this.objSpriteSheet, dblLargCase * this.tabEtatAnim[intFrameExact][0], 
                         dblHautCase * this.tabEtatAnim[intFrameExact][1], dblLargCase, dblHautCase,
                         this.intPosX * dblLargCase, this.intPosY * dblHautCase, dblHautCase, dblLargCase, dblHautCase);
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
                this.tabEtatAnim = enumCharSpriteSheetMap.RUN_L;
                break;
            //Up
            case 38:
                if (this.binUp) {
                    console.log(-Math.round(VITESSE_JOUEUR * this.delta*10)/10);
                    this.intPosX = Math.round(this.intPosX);
                    this.deplacer(0, -Math.round(VITESSE_JOUEUR * this.delta*10)/10);
                    this.tabEtatAnim = enumCharSpriteSheetMap.CLIMB_U;                    
                }else {
                    this.intPosY = Math.ceil(this.intPosY);
                }
                break;
            //Right
            case 39:
                if(!this.binBriqueDroite && (this.binBriqueBas || this.binDown))
                    this.deplacer(VITESSE_JOUEUR * this.delta, 0);
                this.tabEtatAnim = enumCharSpriteSheetMap.RUN_R;                                          
                break;
            //Down
            case 40:
                if (this.binDown) {
                    this.deplacer(0, Math.round(VITESSE_JOUEUR * this.delta*10)/10);
                    this.intPosX = Math.round(this.intPosX);
                    this.tabEtatAnim = enumCharSpriteSheetMap.CLIMB_D;                                                              
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