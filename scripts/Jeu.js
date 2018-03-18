//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        this.objNiveau;
        this.initialiserObjets();
        this.score = 0;
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    initialiserObjets() {
        this.objNiveau = new Niveau('niv1.txt');
    }

    bouclePrincipale () {
        this.effacerEcran();
        this.mettreAJourAnimation();
        this.dessiner();
        objScore.ctxDrawScoreboard();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    effacerEcran() {
        objC2D.clearRect(0, 0, objCanvas.width, objCanvas.height);
    }

    mettreAJourAnimation () {
        this.objNiveau.mettreAJourAnimation();
    }

    dessiner () {
        this.objNiveau.dessiner();
    }
}