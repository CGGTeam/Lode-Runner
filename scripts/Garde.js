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

        let playerPath = null;
        let paths = [];
        let newPaths = [];
        let comparateurCroissant = function (e, element){
            return e.tabIntersections.length > element.length;
        }
        for(let i = 0; i < Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)].length; i++){
            paths.pushCroissant(new Path(this.dblPosY, this.dblPosX, Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)][i]), comparateurCroissant);
        }
        while(!playerPath){
            for(let i = 0; i < paths.length && !playerPath; i++){
                let nextInters = paths[i].lastIntersection.nextIntersections();
                for(let j = 0; j < nextInters.length && !playerPath; j++){
                    let tempo = paths[i].clone();
                    tempo.addPosition(nextInters[j]);
                    newPaths.pushCroissant(tempo, comparateurCroissant);
                    if(nextInters[j].playerPos)
                        playerPath = tempo;
                }
            }
            paths = newPaths;
        }

        console.log(playerPath);
        /*
        let path = [];
        let toCheck = Garde.tabIntersections[this.dblPosY][this.dblPosX];
        let nextCheck;
        let lastIntersection;
        do{
            nextCheck = [];
            for(let i = 0; i < toCheck.length && !(lastIntersection instanceof Joueur); i++){
                lastIntersection = toCheck[i].nextIntersections();
                nextCheck = nextCheck.concat(lastIntersection);
            }
            toCheck = nextCheck;
        }while(!(lastIntersection instanceof Joueur));
        console.log()
        */
    }

/**
 0* 
 * @param {Path} path 
 */
    nextPaths(path){
        let binAccessible = true;
        /*
        while(binAccessible && !Garde.tabIntersections[path.lastPosY][path.lastPosX] && !this.pathToPlayer){
            path.addPosition(path.lastPosX + path.horizontal, path.lastPosY + path.vertical)
            binAccessible = path.lastPosY < Garde.tabIntersections.length && path.lastPosX < Garde.tabIntersections[0].length 
                && objJeu.objNiveau.tabGrilleNav[path.lastPosY][path.lastPosX];
            if(objJeu.objNiveau.objJoueur.dblPosX < path.lastPosX + 0.5 && objJeu.objNiveau.objJoueur.dblPosX > path.lastPosX - 0.5
                && objJeu.objNiveau.objJoueur.dblPosY < path.lastPosY + 0.25 && objJeu.objNiveau.objJoueur.dblPosY > path.lastPosY - 0.25){
                    this.pathToPlayer = path;
                }
        }
        */
        
    }

    static setIntersections(params) {
        Garde.tabIntersections = [];
        Garde.lstIntersections = [];
        for(let i = 0; i < objJeu.objNiveau.tabGrilleNiveau.length; i++){
            Garde.tabIntersections[i] = [];
            for(let j = 0; j < objJeu.objNiveau.tabGrilleNiveau[i].length; j++){
                Garde.tabIntersections[i][j] = null;
            }
        }
        for(let i = 0; i < objJeu.objNiveau.tabGrilleNiveau.length; i++){
            for(let j = 0; j < objJeu.objNiveau.tabGrilleNiveau[i].length; j++){
                if(
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
                    )){
                        Garde.tabIntersections[i][j] = new Intersection(j,i);
                        Garde.lstIntersections.push(Garde.tabIntersections[i][j]);
                        //Up
                        for(let k = i-1; objJeu.objNiveau.tabGrilleNav[k][j]; k--){
                            if(objJeu.objNiveau.tabGrilleNav[k][j]){
                                if(Garde.tabIntersections[k][j] instanceof Array){
                                    Garde.tabIntersections[k][j].push(Garde.tabIntersections[i][j]);
                                }else if (!(Garde.tabIntersections[k][j] instanceof Intersection)){
                                    Garde.tabIntersections[k][j] = [Garde.tabIntersections[i][j]];
                                }
                            }
                        }
                        //Down
                        for(let k = i+1; objJeu.objNiveau.tabGrilleNav[k][j]; k++){
                            if(objJeu.objNiveau.tabGrilleNav[k][j]){
                                if(Garde.tabIntersections[k][j] instanceof Array){
                                    Garde.tabIntersections[k][j].push(Garde.tabIntersections[i][j]);
                                }else if (!(Garde.tabIntersections[k][j] instanceof Intersection)){
                                    Garde.tabIntersections[k][j] = [Garde.tabIntersections[i][j]];
                                }
                            }
                        }
                        //Left
                        for(let k = j-1; objJeu.objNiveau.tabGrilleNav[i][k]; k--){
                            if(objJeu.objNiveau.tabGrilleNav[i][k]){
                                if(Garde.tabIntersections[i][k] instanceof Array){
                                    Garde.tabIntersections[i][k].push(Garde.tabIntersections[i][j]);
                                }else if (!(Garde.tabIntersections[i][k] instanceof Intersection)){
                                    Garde.tabIntersections[i][k] = [Garde.tabIntersections[i][j]];
                                }
                            }
                        }
                        //Right
                        for(let k = j+1; objJeu.objNiveau.tabGrilleNav[i][k]; k++){
                            if(objJeu.objNiveau.tabGrilleNav[i][k]){
                                if(Garde.tabIntersections[i][k] instanceof Array){
                                    Garde.tabIntersections[i][k].push(Garde.tabIntersections[i][j]);
                                }else if (!(Garde.tabIntersections[i][k] instanceof Intersection)){
                                    Garde.tabIntersections[i][k] = [Garde.tabIntersections[i][j]];
                                }
                            }
                        }
                    }

                    

                   // console.log(Garde.tabIntersections);

                   /*
                    if(Garde.tabIntersections[i][j] instanceof Intersection){
                        objC2D.save();
                        objC2D.fillStyle = "#FF0000";
                        //console.log(objC2D.fillStyle);
                        objC2D.fillRect(j * dblLargCase, i * dblHautCase, 5, 5);
                        //objC2D.fill();
                        objC2D.restore();
                    }*/
        }

        let comparateurInters = function (e, element) {
            if(!e || !element)
                return true;

            return e.intPosX === element.intPosX && e.intPosY === element.intPosY;
        };
        Garde.lstIntersections.forEach(inters => {
                        
                        //Left
                        if(Garde.tabIntersections[inters.intPosY][inters.intPosX - 1]){
                            if(Garde.tabIntersections[inters.intPosY][inters.intPosX - 1] instanceof Array){
                                for(let l = 0; l < Garde.tabIntersections[inters.intPosY][inters.intPosX - 1].length; l++){
                                    if(Garde.tabIntersections[inters.intPosY][inters.intPosX - 1][l] != inters) 
                                        inters.tabNextIntersections.pushIfNotExist(Garde.tabIntersections[inters.intPosY][inters.intPosX - 1][l], comparateurInters);
                                }
                            }else{
                               // for(let l = 0; l < Garde.tabIntersections[inters.intPosY][inters.intPosX - 1].length; l++){
                               //     if(Garde.tabIntersections[inters.intPosY][inters.intPosX - 1][l] != inters) 
                               //         inters.tabNextIntersections.push(Garde.tabIntersections[inters.intPosY][inters.intPosX - 1][l]);
                               // }
                            }
                        }

                        //Right
                        if(Garde.tabIntersections[inters.intPosY][inters.intPosX + 1]){
                            if(Garde.tabIntersections[inters.intPosY][inters.intPosX + 1] instanceof Array){
                                for(let l = 0; l < Garde.tabIntersections[inters.intPosY][inters.intPosX + 1].length; l++){
                                    if(Garde.tabIntersections[inters.intPosY][inters.intPosX + 1][l] != inters) 
                                        inters.tabNextIntersections.pushIfNotExist(Garde.tabIntersections[inters.intPosY][inters.intPosX + 1][l], comparateurInters);
                                }
                            }else{
                              //  for(let l = 0; l < Garde.tabIntersections[inters.intPosY][inters.intPosX + 1].length; l++){
                              //      if(Garde.tabIntersections[inters.intPosY][inters.intPosX + 1][l] != inters) 
                              //          inters.tabNextIntersections.push(Garde.tabIntersections[inters.intPosY][inters.intPosX + 1][l]);
                              //  }
                            }
                        }

                        //Down
                        if(Garde.tabIntersections[inters.intPosY + 1][inters.intPosX]){
                            if(Garde.tabIntersections[inters.intPosY + 1][inters.intPosX] instanceof Array){
                                for(let l = 0; l < Garde.tabIntersections[inters.intPosY + 1][inters.intPosX].length; l++){
                                    if(Garde.tabIntersections[inters.intPosY + 1][inters.intPosX][l] != inters) 
                                        inters.tabNextIntersections.pushIfNotExist(Garde.tabIntersections[inters.intPosY + 1][inters.intPosX][l], comparateurInters);
                                }
                            }else{
                               // for(let l = 0; l < Garde.tabIntersections[inters.intPosY + 1][inters.intPosX].length; l++){
                               //     if(Garde.tabIntersections[inters.intPosY + 1][inters.intPosX][l] != inters) 
                               //         inters.tabNextIntersections.push(Garde.tabIntersections[inters.intPosY + 1][inters.intPosX][l]);
                               // }
                            }
                        }

                        //Up
                        if(Garde.tabIntersections[inters.intPosY  - 1][inters.intPosX]){
                            if(Garde.tabIntersections[inters.intPosY - 1][inters.intPosX] instanceof Array){
                                for(let l = 0; l < Garde.tabIntersections[inters.intPosY - 1][inters.intPosX].length; l++){
                                    if(Garde.tabIntersections[inters.intPosY - 1][inters.intPosX][l] != inters) 
                                        inters.tabNextIntersections.pushIfNotExist(Garde.tabIntersections[inters.intPosY - 1][inters.intPosX][l], comparateurInters);
                                }
                            }else{
                              //  for(let l = 0; l < Garde.tabIntersections[inters.intPosY - 1][inters.intPosX].length; l++){
                              //      if(Garde.tabIntersections[inters.intPosY - 1][inters.intPosX][l] != inters) 
                              //          inters.tabNextIntersections.push(Garde.tabIntersections[inters.intPosY - 1][inters.intPosX][l]);
                              //  }
                            }
                        }
                        
                    });

        }
        console.log(Garde.tabIntersections);
    }
}