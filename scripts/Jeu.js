class Jeu {
    constructor() {
        console.log('Jeu Ctor()');
        this.tabObjets = [];
        this.tabObjets.push(new Niveau());
    }

    bouclePrincipale () {
        console.log('bouclePrincipale()');
        mettreAJourAnimation();
        dessiner();
        window.requestAnimationFrame(this.bouclePrincipale);
    }

    mettreAJourAnimation () {

    }

    dessiner () {

    }
}