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
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    effacerEcran() {
        objC2D.clearRect(0, 0, objCanvas.width, objCanvas.height);
    }

    mettreAJourAnimation () {
        this.tabObjets.forEach(o => o.mettreAJourAnimation());
    }

    dessiner () {
        this.tabObjets.forEach(o => o.dessiner());
    }
}