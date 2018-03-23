const enumGardeMap = Object.freeze({
    RUN_R : [[0, 0],[1, 0], [2, 0]],
    RUN_L : [[3, 0],[4, 0], [5, 0]],
    FALL_R : [[8, 0]],
    FALL_L : [[8, 1]],
    CLIMB_R : [[0, 0],[1, 0], [2, 0]],
    CLIMB_L : [[3, 0],[4, 0], [5, 0]],
    CLIMB_U : [[6, 0],[7, 0]],
    CLIMB_D : [[7, 0],[6, 0]],
    REVIVE_R : [[8, 0], [9, 0],[10, 0]],
    REVIVE_L : [[8, 1], [9, 1],[10, 1]],
    MORT : [[6, 0], [7, 0]]
});

const enumCoulsGardes = Object.freeze([
    [0, 97, 255],
    [0, 255, 225],
    [0, 255, 21],
    [208, 255, 0],
    [255, 187, 0],
    [255, 0, 0],
    [255, 0, 199],
    [65, 0, 255],
    [59, 0, 255],
    [102, 226, 255],
    [122, 255, 151],
    [175, 143, 0],
    [0, 175, 35]
]);

const DBL_PROB_DROP = 1 / (60 * 10);
const CHROMA_KEY_CHANDAIL = Object.freeze([186, 219, 239]);
const CHROMA_KEY_PANTALON = Object.freeze([255, 255, 255]);

class Garde extends EntiteDynamique{

    constructor(posInitX, posInitY, intNbGarde) {
        super(posInitX,posInitY,enumGardeMap, preloadImage('http://www.antoinebl.com/Lode-Runner/assets/img/guard.png'));
        this.intNbGarde = intNbGarde;
        this.dblAnimFrame = 0;
        this.pathToPlayer = null;
    }

    mettreAJourAnimation () {
        try { //TODO: solution plus élégante
            let dblBorneG = this.dblPosX - 0.5;
            let dblBorneD = this.dblPosX + 0.5;
            let dblXJoueur = objJeu.objNiveau.objJoueur.dblPosX;
            let binTouchX = dblXJoueur >= dblBorneG && dblXJoueur <= dblBorneD;
            
            let dblBorneH = this.dblPosY - 0.5;
            let dblBorneB = this.dblPosY + 0.5;
            let dblYJoueur = objJeu.objNiveau.objJoueur.dblPosY;
            let binTouchY = dblYJoueur >= dblBorneH && dblYJoueur <= dblBorneB;

            if (binTouchX && binTouchY) {
                objJeu.objNiveau.objJoueur.mourir();
            }
        } catch (e) {
        }

        // var map = objC2D.getImageData(0,0,320,240);
        // var imdata = map.data;

        this.getCollisions().forEach((x) => {
            if (x instanceof Lingot && this != x.objAncienGarde) {
                instanceMoteurSon.jouerSon(4); //REMPLACER AVEC SON DIFFÉRENT
                this.objLingot = objJeu.objNiveau.tabGrilleNiveau[x.intPosY][x.intPosX];
                objJeu.objNiveau.tabGrilleNiveau[x.intPosY][x.intPosX] = null;
            }
        });
        
        if (this.objLingot && Math.random() <= DBL_PROB_DROP){
            objJeu.objNiveau.tabGrilleNiveau[Math.round(this.dblPosY)][Math.round(this.dblPosX)] = this.objLingot;
            this.objLingot.objAncienGarde = this;
            let objLingotSave = this.objLingot;
            let fctTimeout = (objLingot) => {
                objLingotSave.objAncienGarde = null;
            }
            window.setTimeout(() => fctTimeout(this.objLingot), 2000);
            this.objLingot = null;
        }
    }

    dessiner() {
        let objC2D2 = document.getElementById('cvDessin').getContext('2d');
        let intFrameExact = Math.floor(this.dblAnimFrame)
        objC2D2.clearRect(0, 0, dblLargCase, dblHautCase);
        objC2D2.fillRect(0, 0, dblLargCase, dblHautCase);
        objC2D2.drawImage(this.objSpriteSheet, dblLargCase * this.tabEtatAnim[intFrameExact][0], 
                         dblHautCase * this.tabEtatAnim[intFrameExact][1], dblLargCase, dblHautCase,
                         0, 0, dblLargCase, dblHautCase);
        let objImageDataS = objC2D2.getImageData(0, 0, dblLargCase, dblHautCase);
        let objImageDataD = objC2D.getImageData(this.dblPosX * dblLargCase, this.dblPosY * dblHautCase, dblLargCase, dblHautCase);
        
        let tabDonnee = objImageDataS.data;
        for (let i = 0; i < tabDonnee.length; i += 4) {
            let intRouge = objImageDataS.data[i];
            let intGreen = objImageDataS.data[i + 1];
            let intBlue = objImageDataS.data[i + 2];
            let tabVRGB = CHROMA_KEY_CHANDAIL;
            if (intRouge == tabVRGB[0] && intGreen == tabVRGB[1] && intBlue == tabVRGB[2]) {
                objImageDataD.data[i] = enumCoulsGardes[this.intNbGarde][0];
                objImageDataD.data[i + 1] = enumCoulsGardes[this.intNbGarde][1];
                objImageDataD.data[i + 2] = enumCoulsGardes[this.intNbGarde][2];
            } else if (intRouge == intGreen && intGreen == intBlue && intBlue == 255) {
                if (this.objLingot) {
                    objImageDataD.data[i] = 255;
                    objImageDataD.data[i + 1] = 242;
                    objImageDataD.data[i + 2] = 0;
                } else {
                    objImageDataD.data[i] = 255;
                    objImageDataD.data[i + 1] = 255;
                    objImageDataD.data[i + 2] = 255;
                }
            }
        }
        objC2D.putImageData(objImageDataD, this.dblPosX * dblLargCase, this.dblPosY * dblHautCase);
    }

    pathFinding(){
        let currentPaths = [new Path(this.dblPosX, this.dblPosY, 1, 0),new Path(this.dblPosX, this.dblPosY, -1, 0)];
        //while(!this.pathToPlayer){
            this.pathToPlayer = null;
            for(let i = 0; i < currentPaths.length && !this.pathToPlayer; i++){
                let tempoPaths = this.nextPaths(currentPaths[i]);
                if(tempoPaths){
                    currentPaths = currentPaths.concat(tempoPaths);
                }else{
                    currentPaths.splice(i, 1);
                }
           // }
            console.log(currentPaths);
        }
        console.log(this.pathToPlayer);
    }

/**
 0* 
 * @param {Path} path 
 */
    nextPaths(path){
        let binAccessible = true;
        while(binAccessible && !Garde.tabIntersections[path.lastPosY][path.lastPosX] && !this.pathToPlayer){
            path.addPosition(path.lastPosX + path.horizontal, path.lastPosY + path.vertical)
            binAccessible = path.lastPosY < Garde.tabIntersections.length && path.lastPosX < Garde.tabIntersections[0].length 
                && objJeu.objNiveau.tabGrilleNav[path.lastPosY][path.lastPosX];
            if(objJeu.objNiveau.objJoueur.dblPosX < path.lastPosX + 0.5 && objJeu.objNiveau.objJoueur.dblPosX > path.lastPosX - 0.5
                && objJeu.objNiveau.objJoueur.dblPosY < path.lastPosY + 0.25 && objJeu.objNiveau.objJoueur.dblPosY > path.lastPosY - 0.25){
                    this.pathToPlayer = path;
                }
        }
        
        if(binAccessible){
            let tabRetour = [];
            let tempo;
            //Up
            if(objJeu.objNiveau.tabGrilleNav[path.lastPosY-1][path.lastPosX]){
                tempo = Object.assign({},path);
                tempo.vertical = -1;
                tempo.horizontal = 0;
                tabRetour.push(tempo);
            }
            //Down
            if(objJeu.objNiveau.tabGrilleNav[path.lastPosY+1][path.lastPosX]){
                tempo = Object.assign({},path);
                tempo.vertical = 1;
                tempo.horizontal = 0;
                tabRetour.push(tempo);
            }
            //Left
            if(objJeu.objNiveau.tabGrilleNav[path.lastPosY][path.lastPosX-1]){
                tempo = Object.assign({},path);
                tempo.vertical = 0;
                tempo.horizontal = -1;
                tabRetour.push(tempo);
            }
            //Right
            if(objJeu.objNiveau.tabGrilleNav[path.lastPosY][path.lastPosY+1]){
                tempo = Object.assign({},path);
                tempo.vertical = 0;
                tempo.horizontal = 1;
                tabRetour.push(tempo);
            }
            
            return tabRetour;
            
        }else{
            
            return null;
        }
    }

    static setIntersections(params) {
        Garde.tabIntersections = [];
        for(let i = 0; i < objJeu.objNiveau.tabGrilleNiveau.length; i++){
            Garde.tabIntersections[i] = [];
            for(let j = 0; j < objJeu.objNiveau.tabGrilleNiveau[i].length; j++){
                Garde.tabIntersections[i][j] = 
                    objJeu.objNiveau.tabGrilleNav[i][j] && (
                        (objJeu.objNiveau.tabGrilleNiveau[i + 1][j] instanceof Brique && 
                            (objJeu.objNiveau.tabGrilleNiveau[i][j] instanceof Echelle || 
                            objJeu.objNiveau.tabGrilleNiveau[i - 1][j] instanceof Echelle || 
                            objJeu.objNiveau.tabGrilleNiveau[i][j] instanceof Barre ||
                            objJeu.objNiveau.tabGrilleNiveau[i][j + 1] instanceof Barre ||
                            objJeu.objNiveau.tabGrilleNiveau[i][j - 1] instanceof Barre)
                        ) ||
                            (objJeu.objNiveau.tabGrilleNiveau[i][j] instanceof Echelle &&
                            (objJeu.objNiveau.tabGrilleNiveau[i][j + 1] instanceof Barre ||
                            objJeu.objNiveau.tabGrilleNiveau[i][j - 1] instanceof Barre)) ||

                            (objJeu.objNiveau.tabGrilleNiveau[i + 1][j] instanceof Echelle &&
                            !objJeu.objNiveau.tabGrilleNiveau[i][j])
                    );
                    if(Garde.tabIntersections[i][j]){
                        objC2D.save();
                        objC2D.fillStyle = "#FF0000";
                        //console.log(objC2D.fillStyle);
                        objC2D.fillRect(j * dblLargCase, i * dblHautCase, 5, 5);
                        //objC2D.fill();
                        objC2D.restore();
                    }
        }
        }
        //console.log(Garde.tabIntersections);
    }
}