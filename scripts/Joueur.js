const VITESSE_JOUEUR = 7.0;  // U/s
const KEYS_PER_SECONDS = 30;

class Joueur extends EntiteDynamique{
    constructor(posInitX, posInitY) {
        super(posInitX, posInitY);
        console.log('JOUEUR X: ' + this.posX + ' Y: ' + this.posY);
        this.score = 0;
        document.addEventListener('keydown', (event) => {
            this.joueurOnKeyDown(event.keyCode);
        });
        this.objImage = new Image();
        this.objImage.src = 'assets/img/perso.png';
    }

    mettreAJourAnimation(){
        if(this.getBloc() === null && this.getEchelle() === null){
            this.deplacer(0, 0.05);
        }
    }

    /**
     *
     * @param keyCode
     */
    joueurOnKeyDown(keyCode){
        console.log(keyCode);
        //if(this.getBloc() !== null || this.getEchelle() !== null) {
            switch (keyCode) {
                //Left
                case 37:
                    this.deplacer(-VITESSE_JOUEUR / KEYS_PER_SECONDS, 0);
                    break;
                //Up
                case 38:
                    console.log(this.getBloc());
                    console.log(this.getEchelle());
                    let echelleU = this.getEchelle();
                    if (echelleU !== null && Math.round(this.posY * 100) / 100 !== echelleU.intY1 - 1) {
                        this.deplacer(0, -0.1);
                    }
                    break;
                //Right
                case 39:
                    this.deplacer(VITESSE_JOUEUR / KEYS_PER_SECONDS, 0);
                    break;
                //Down
                case 40:
                    console.log(this.getBloc());
                    console.log(this.getEchelle());
                    let echelleD = this.getEchelle();
                    if (echelleD !== null && Math.round(this.posY * 100) / 100 !== echelleD.intY2) {
                        this.deplacer(0, 0.1);
                    }
                    break;
            }
            console.log('JOUEUR X: ' + this.posX + ' Y: ' + this.posY);
        //}
    }

    getEchelle(){
        let echelleCourante = null;
        objJeu.tabObjets[0].tabEchelles.forEach(o => {
            if(o.intY1 <= Math.round(this.posY*100)/100 + 1 && o.intY2 >= Math.round(this.posY*100)/100 && Math.round(this.posX) === o.intX){
                echelleCourante = o;
            }
        });
        return echelleCourante;
    }

    getBloc(){
        let blocCourant = null;
        objJeu.tabObjets[0].tabBlocs.forEach(o => {
            if(o.posXGauche-0.5 <= this.posX && (o.posXGauche + o.intLongueur + 0.5) >= this.posX && o.posY-1 === Math.round(this.posY*100)/100){
                blocCourant = o;
            }
        });
        return blocCourant;
    }

    dessiner () {
        objC2D.drawImage(this.objImage, this.posX * dblLargCase,
            this.posY * dblHautCase, dblLargCase, dblHautCase);
    }
}