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
    }

    /**
     *
     * @param keyCode
     */
    joueurOnKeyDown(keyCode){
        console.log(keyCode);
       switch (keyCode){
           //Left
           case 37:
               this.deplacer(-VITESSE_JOUEUR/KEYS_PER_SECONDS, 0);
               break;
           //Up
           case 38:
               console.log(this.getBloc());
               console.log(this.getEchelle());
               let echelleU = this.getEchelle();
               if(echelleU !== null &&  Math.round(this.posY*1000)/1000 !== echelleU.intY1 - 1){
                   this.deplacer(0, -0.1);
               }
               break;
           //Right
           case 39:
               this.deplacer(VITESSE_JOUEUR/KEYS_PER_SECONDS, 0);
               break;
           //Down
           case 40:
               console.log(this.getBloc());
               console.log(this.getEchelle());
               let echelleD = this.getEchelle();
               if(echelleD !== null &&  Math.round(this.posY*1000)/1000 !== echelleD.intY2){
                   this.deplacer(0, 0.1);
               }
               break;
       }
        console.log('JOUEUR X: ' + this.posX + ' Y: ' + this.posY);
    }

    getEchelle(){
        let echelleCourante = null;
        objJeu.tabObjets[0].tabEchelles.forEach(o => {
            if(o.intY1 <= Math.round(this.posY*1000)/1000 + 1 && o.intY2 >= Math.round(this.posY*1000)/1000 && Math.round(this.posX) === o.intX){
                echelleCourante = o;
            }
        });
        return echelleCourante;
    }

    getBloc(){
        let blocCourant = null;
        objJeu.tabObjets[0].tabBlocs.forEach(o => {
            if(o.posXGauche <= this.posX && (o.posXGauche + o.intLongueur) >= this.posX && o.posY-1 === this.posY){
                blocCourant = o;
            }
        });
        return blocCourant;
    }

    dessiner () {
        dessinerCase(this.posX, this.posY, enumTypesBlocs.objJoueur);
    }
}