/**
 * IMPORTANT: Il y a deux hauteurs différentes de sprite!
 * 1. pour DESTROY_[LR], la hauteur de chaque frame = 2 * dblHautCase
 * 2. pour NORMAL, la hauteur de chaque frame = dblHautCase
 */
const enumMapBrique = {
    DESTROY_R : [[0, 0],[1, 0],[2, 0],[3, 0],[4, 0],[5, 0],[6, 0],[7, 0]],        
    DESTROY_L : [[0, 1],[1, 1],[2, 1],[3, 1],[4, 1],[5, 1],[6, 1],[7, 1]],
    RESTORE : [[8, 0], [8, 1], [8, 2], [8, 3]]
}

const FPS_ANIM_BRIQUE = 0.2;

class Brique extends Case{
    constructor (intPosX, intPosY) {
        super(intPosX, intPosY, enumTypesBlocs.objBrique);
        this.objSpriteSheet = preloadImage('./assets/img/hole.png');
        this.tabEtatAnim = enumMapBrique.RESTORE;
        this.dblAnimFrame = enumMapBrique.RESTORE.length - 1;
        this.binEnDestruction = false;
        this.binDetruit = false;
        this.intTimeoutID = null;
    }

    updateNav(tabGrilleNav) {
        if (this.intPosY > 0) {
            tabGrilleNav[this.intPosY - 1][this.intPosX] = true;                    
        }
    }

    mettreAJourAnimation () {
        this.dblAnimFrame += FPS_ANIM_BRIQUE;
        if (Math.floor(this.dblAnimFrame) >= this.tabEtatAnim.length) {
            this.dblAnimFrame = this.tabEtatAnim.length - 1;
        }
    }

    dessiner () {
        let intFrameExact = Math.floor(this.dblAnimFrame);

        let intHauteur = this.tabEtatAnim === enumMapBrique.RESTORE ? 1 : 2;

        objC2D.drawImage(this.objSpriteSheet, 
            dblLargCase * this.tabEtatAnim[intFrameExact][0], dblHautCase * this.tabEtatAnim[intFrameExact][1] * intHauteur,
            dblLargCase, dblHautCase * intHauteur,
            this.intPosX * dblLargCase, (this.intPosY - intHauteur + 1) * dblHautCase,
            dblLargCase, dblHautCase * intHauteur);
    }
    
    /**
     * Detruit le bloc. Celui-ci revient dans 8 secondes.
     * @param {boolean} binDroite 
     */
    detruire(binDroite) {
        this.dblAnimFrame = 0;
        this.tabEtatAnim = binDroite ? enumMapBrique.DESTROY_R : enumMapBrique.DESTROY_L;
        this.intIDDestructionFinie = window.setTimeout(() => {
            this.binEnDestruction = false; 
            this.binDetruit = true;
        }, this.tabEtatAnim.length / FPS_ANIM_BRIQUE / 60 * 1000);
        this.intTimeoutID = window.setTimeout(() => this.restore(), 8000);
    }

    /**
     * Débute l'animation de restoration.
     */
    restore() {
        if (this.binDetruit) {
            this.binDetruit = false;
            this.tabEtatAnim = enumMapBrique.RESTORE;
            this.dblAnimFrame = 0;
        }
        instanceMoteurSon.jouerSon(2, false, true);
    }

    /**
     * Interrompt la destruction du bloc
     */
    interrompreDestruction () {
        window.clearTimeout(this.intTimeoutID);
        this.tabEtatAnim = enumMapBrique.RESTORE;
        this.dblAnimFrame = enumMapBrique.RESTORE.length - 1;
    }
}