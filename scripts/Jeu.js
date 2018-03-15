//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        this.counter = 0;
        this.tabObjets = [];
        this.tabObjets.push(new Niveau('niv1.txt'));
        this.initialiserObjets();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    initialiserObjets() {

    }

    bouclePrincipale () {
        this.effacerEcran();
        this.mettreAJourAnimation();
        this.dessiner();
        this.counter++;
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