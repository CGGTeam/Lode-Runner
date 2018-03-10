class Jeu {
    constructor() {
        //initAnimation
        this.counter = 0;
        this.tabObjets = [];
        console.log('push')
        this.tabObjets.push(new Niveau('niv1.txt'));
        console.log('after push');
        this.initialiserObjets();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    initialiserObjets() {

    }

    bouclePrincipale () {
        //console.log('bouclePrincipale()');
        this.effacerEcran();
        this.mettreAJourAnimation();
        this.dessiner();
        this.counter++;
       // if (this.counter < 30) {
       //     console.log('wtf')
            window.requestAnimationFrame(() => this.bouclePrincipale());
       // }
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