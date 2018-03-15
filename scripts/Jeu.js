//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        this.tabObjets = [];
        this.tabObjets.push(new Niveau('niv1.txt'));
        this.initialiserObjets();
        this.instanceMoteurSon = new MoteurSons();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    initialiserObjets() {

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