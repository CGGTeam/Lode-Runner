const enumGardeMap = Object.freeze({
    RUN_R : [[0, 0],[1, 0], [2, 0]],
    RUN_L : [[3, 0],[4, 0], [5, 0]],
    FALL_R : [[8, 0]],
    FALL_L : [[8, 1]],
    CLIMB_R : [[0, 1],[1, 1], [2, 1]],
    CLIMB_L : [[3, 1],[4, 1], [5, 1]],
    CLIMB_U : [[6, 0],[7, 0]],
    CLIMB_D : [[7, 0],[6, 0]],
    PIEGE_R : [[8, 0], [9, 0],[10, 0]],
    PIEGE_L : [[8, 1], [9, 1],[10, 1]],
    REVIVE : [[6, 0], [7, 0]]
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
const VITESSE_GARDE = 2.945;  // U/s
const DBL_FPS_GARDE = 0.25;

class Garde extends EntiteDynamique{

    constructor(posInitX, posInitY, intNbGarde) {
        super(posInitX,posInitY,enumGardeMap, preloadImage('https://cggteam.github.io/Lode-Runner/assets/img/guard.png'));
        this.intNbGarde = intNbGarde;
        this.dblAnimFrame = 0;
        this.pathToPlayer = null;
        this.delta = 0;
        this.lastCalled = null;
        this.comparateurCases = function(e, element){
            return e.x == element.x && e.y == element.y;
        }
    }

    mettreAJourAnimation () {

        this.delta = (this.lastCalled) ? Date.now() - this.lastCalled : 1 / 40;
        this.lastCalled = Date.now();

        this.tabEtatAnim = this.enumAnim.RUN_R;
        this.binLiberation = false;
        this.binPiege = false;
        this.intShakeCount = 0;
        this.binInvincible = false;
        this.dblAncienX = 0;
        this.binRevive = false;
    }

    mettreAJourAnimation () {
        let intFrameExact = Math.floor(this.dblAnimFrame);
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

        this.pathFinding();
        // var map = objC2D.getImageData(0,0,320,240);
        // var imdata = map.data;

        this.getCollisions().forEach((x) => {
            if (x instanceof Lingot && this != x.objAncienGarde) {
                instanceMoteurSon.jouerSon(4);
                this.objLingot = objJeu.objNiveau.tabGrilleNiveau[x.intPosY][x.intPosX];
                objJeu.objNiveau.tabGrilleNiveau[x.intPosY][x.intPosX] = null;
            }
        });
        this.setColBin();
        try {
            let objCollisionCentre = objJeu.objNiveau.tabGrilleNiveau[Math.round(this.dblPosY)][Math.round(this.dblPosX)];
            let objCollisionBas =  objJeu.objNiveau.tabGrilleNiveau[Math.round(this.dblPosY) + 1][Math.round(this.dblPosX)];
            if (objCollisionCentre instanceof Echelle && Math.round(this.dblPosY) != this.dblPosY &&
                !(objCollisionBas instanceof Brique) || objCollisionBas instanceof Echelle) {
                this.tabEtatAnim = this.binMoveUp ? enumGardeMap.CLIMB_U : enumGardeMap.CLIMB_D;
            } else if (objCollisionCentre instanceof Barre) {
                this.tabEtatAnim = this.binMoveRight ? enumGardeMap.CLIMB_R : enumGardeMap.CLIMB_L;
            } else if (objCollisionBas instanceof Brique) {
                this.tabEtatAnim = this.binMoveRight ? enumGardeMap.RUN_R : enumGardeMap.RUN_L;
            }

            if (objCollisionBas instanceof Brique && objCollisionBas.binDetruit &&
                !this.binPiege && !this.binLiberation && !this.binInvincible) {
               this.binPiege = true;
               window.setTimeout( () => {
                   this.binPiege = false;
                   this.binLiberation = true;W
               }, 2000);
               this.dblPosX = Math.round(this.dblPosX);
               this.dblPosY++;
               this.tabEtatAnim = this.binMoveRight ? enumGardeMap.PIEGE_R : enumGardeMap.PIEGE_L;
               if (this.objLingot) {
                   objJeu.objNiveau.tabGrilleNiveau[Math.round(this.dblPosY - 1)][Math.round(this.dblPosX)] = this.objLingot
               }
           } else if (this.binLiberation && intFrameExact == this.tabEtatAnim.length - 1) {
               this.intShakeCount++;
               if (this.intShakeCount > 4) {
                   this.intShakeCount = 0;
                   this.binLiberation = false;
                   this.binInvincible = true;
                   this.dblAncienX = this.dblPosX;
                   this.tabEtatAnim = this.binMoveRight ? enumGardeMap.RUN_R : enumGardeMap.RUN_L;
                   this.dblPosY--;
               }
           } else if (this.binRevive && intFrameExact == this.tabEtatAnim.length - 1) {
               this.binEtatVie = true;
               this.binRevive = false;
               this.tabEtatAnim = enumGardeMap.RUN_R;
               this.binMoveRight = true;
           }
   
           this.binInvincible = this.binInvincible && Math.abs(this.dblAncienX - this.dblPosX) < 1;
   
           if (this.objLingot && Math.random() <= DBL_PROB_DROP && this.binBriqueBas){
               objJeu.objNiveau.tabGrilleNiveau[Math.round(this.dblPosY)][Math.round(this.dblPosX)] = this.objLingot;
               this.objLingot.objAncienGarde = this;
               let objLingotSave = this.objLingot;
               let fctTimeout = (objLingot) => {
                   objLingotSave.objAncienGarde = null;
               }
               window.setTimeout(() => fctTimeout(this.objLingot), 2000);
               this.objLingot = null;
           }
           
           if (this.binMoving || this.binLiberation || this.binRevive) {
               this.dblAnimFrame += DBL_FPS_GARDE;            
           }
   
           if (intFrameExact >= this.tabEtatAnim.length - 1) {
               this.dblAnimFrame = 0;
           }
   
           this.binMoving = false;       
        } catch (e){

        } 
    }

    /**
     * Version custom du dessiner() de Entité Dynamique. Dessine le garde sur un
     * canvas séparé. Ensuite, prend le image data, change les couleurs selon l'état
     * et mets le image data dans le canvas principal.
     */
    dessiner() {
        if (this.binEtatVie) {
            let objC2D2 = document.getElementById('cvDessin').getContext('2d');
            let intFrameExact = Math.floor(this.dblAnimFrame);
            objC2D2.clearRect(0, 0, dblLargCase, dblHautCase);
            objC2D2.fillRect(0, 0, dblLargCase, dblHautCase);
            objC2D2.drawImage(this.objSpriteSheet, dblLargCase * this.tabEtatAnim[intFrameExact][0], 
                            dblHautCase * this.tabEtatAnim[intFrameExact][1], dblLargCase, dblHautCase,
                            0, 0, dblLargCase, dblHautCase);
            //Source
            let objImageDataS = objC2D2.getImageData(0, 0, dblLargCase, dblHautCase);
            //Destination
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
    }

    pathFinding(){

        let tabPremieresCases = [];
        let tabCasesDejaCheck = [];
        let tabLastChecked = [];
        let intX = Math.round(this.dblPosX);
        let intY = Math.floor(this.dblPosY);
        let tabJeu = objJeu.objNiveau.tabGrilleNiveau;
        let tabNav = objJeu.objNiveau.tabGrilleNav;

        if(tabNav[intY + 1][intX]){
            let tempo = {x: intX, y: intY + 1};
            tempo.objFirst = tempo;
            tabPremieresCases.push(tempo);
            tabCasesDejaCheck.push(tempo);
        }
        if(tabNav[intY - 1][intX]){
            let tempo = {x: intX, y: intY - 1};
            tempo.objFirst = tempo;
            tabPremieresCases.push(tempo);
            tabCasesDejaCheck.push(tempo);
        }
        if(tabNav[intY][intX + 1]){
            let tempo = {x: intX + 1, y: intY};
            tempo.objFirst = tempo;
            tabPremieresCases.push(tempo);
            tabCasesDejaCheck.push(tempo);
        }
        if(tabNav[intY][intX - 1]){
            let tempo = {x: intX - 1, y: intY};
            tempo.objFirst = tempo;
            tabPremieresCases.push(tempo);
            tabCasesDejaCheck.push(tempo);
        }

        tabLastChecked = tabPremieresCases.splice(0);

        while(tabLastChecked.length > 1){
            
            let tabTempo = [];
            for(let i = 0; i < tabLastChecked.length; i++){
            
                let objLast = tabLastChecked[i]; 
                if(Math.round(objJeu.objNiveau.objJoueur.dblPosX) == objLast.x 
                    && Math.floor(objJeu.objNiveau.objJoueur.dblPosY) == objLast.y){
                    tabTempo = [objLast];
                    break;
                }

                if(tabNav[objLast.y + 1][objLast.x]){
                    let objTempo = {x: objLast.x, y: objLast.y + 1, objFirst: objLast.objFirst};
                    if(!tabCasesDejaCheck.inArray(this.comparateurCases, objTempo)){
                        tabTempo.push(objTempo);
                        tabCasesDejaCheck.push(objTempo);
                    }
                }
                if(tabNav[objLast.y - 1][objLast.x]){
                    let objTempo = {x: objLast.x, y: objLast.y - 1, objFirst: objLast.objFirst};
                    if(!tabCasesDejaCheck.inArray(this.comparateurCases, objTempo)){
                        tabTempo.push(objTempo);
                        tabCasesDejaCheck.push(objTempo);
                    }
                }
                if(tabNav[objLast.y][objLast.x + 1]){
                    let objTempo = {x: objLast.x + 1, y: objLast.y, objFirst: objLast.objFirst};
                    if(!tabCasesDejaCheck.inArray(this.comparateurCases, objTempo)){
                        tabTempo.push(objTempo);
                        tabCasesDejaCheck.push(objTempo);
                    }
                }
                if(tabNav[objLast.y][objLast.x - 1]){
                    let objTempo = {x: objLast.x - 1, y: objLast.y, objFirst: objLast.objFirst};
                    if(!tabCasesDejaCheck.inArray(this.comparateurCases, objTempo)){
                        tabTempo.push(objTempo);
                        tabCasesDejaCheck.push(objTempo);
                    }
                }
            }
            tabLastChecked = tabTempo;
        }


        this.goToNext(tabLastChecked[0].objFirst);


                /*
                if(tabNav[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX]){
                    if(!tabCasesDejaCheck.refInArray(tabJeu[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX])){
                        tabTempo.push(tabJeu[tabLastChecked[i].intPosY + 1 - j][tabLastChecked[i].intPosX]);
                        tabCasesDejaCheck.push(tabJeu[tabLastChecked[i].intPosY + 1 - j][tabLastChecked[i].intPosX]);
                    }
                }
                if(tabNav[tabLastChecked[i].intPosY - 2][tabLastChecked[i].intPosX]){
                    if(!tabCasesDejaCheck.refInArray(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX])){
                        tabTempo.push(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX]);
                        tabCasesDejaCheck.push(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX]);
                    }
                }
                if(tabNav[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX + 1]){
                    if(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX + 1] instanceof Barre && 
                        !tabCasesDejaCheck.refInArray(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX + 1])){
                            tabTempo.push(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX + 1]);
                            tabCasesDejaCheck.push(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX + 1]);
                    }
                    else if(!tabCasesDejaCheck.refInArray(tabJeu[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX + 1])){
                        tabTempo.push(tabJeu[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX + 1]);
                        tabCasesDejaCheck.push(tabJeu[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX + 1]);
                    }
                }
                if(tabNav[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX - 1]){
                    if(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX - 1] instanceof Barre && 
                        !tabCasesDejaCheck.refInArray(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX - 1])){
                            tabTempo.push(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX - 1]);
                            tabCasesDejaCheck.push(tabJeu[tabLastChecked[i].intPosY - 1][tabLastChecked[i].intPosX - 1]);
                    }
                    else if(!tabCasesDejaCheck.refInArray(tabJeu[tabLastChecked[i].intPosY + 1][tabLastChecked[i].intPosX])){
                        tabTempo.push(tabJeu[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX - 1]);
                        tabCasesDejaCheck.push(tabJeu[tabLastChecked[i].intPosY][tabLastChecked[i].intPosX - 1]);
                    }
                }
            }
            tabLastChecked = tabTempo;
            */
        //}

       // this.goToInters(tabLastChecked[0]);

        /*
        let playerPath = null;
        let paths = [];
        let newPaths = [];
        let comparateurCroissant = function (e, element){
            return e.tabIntersections.length > element.length;
        }
        if(Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)] instanceof Array){
        for(let i = 0; i < Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)].length; i++){
            paths.pushCroissant(new Path(this.dblPosY, this.dblPosX, Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)][i]), comparateurCroissant);
        }}else if(Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)] instanceof Intersection){
            let tabNextsTempo = Garde.tabIntersections[Math.round(this.dblPosY)][Math.round(this.dblPosX)].nextIntersections();
            for(let i = 0; i < tabNextsTempo.length; i++){
                paths.pushCroissant(new Path(this.dblPosY, this.dblPosX, tabNextsTempo[i]), comparateurCroissant);
            }
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

        this.goToInters(playerPath.tabIntersections[0]);

        */
    }

    goToNext(prochain){
        if(prochain.x < this.dblPosX){
            this.deplacer(-Math.round(VITESSE_GARDE * this.delta / 100) / 10,0);
        }else if(prochain.x > this.dblPosX){
            this.deplacer(Math.round(VITESSE_GARDE * this.delta / 100) / 10,0);
        }else if(prochain.y + 1 < this.dblPosY){
            this.deplacer(0,-Math.round(VITESSE_GARDE * this.delta / 100) / 10);
        }else if(prochain.y + 1> this.dblPosY){
            this.deplacer(0,Math.round(VITESSE_GARDE * this.delta / 100) / 10);
        }
    }

    goToInters(intersection){
        if(intersection.intPosX < this.dblPosX){
            this.deplacer(-0.1,0);
        }else if(intersection.intPosX > this.dblPosX){
            this.deplacer(0.1,0);
        }else if(intersection.intPosY + 1< this.dblPosY){
            this.deplacer(0,-0.1);
        }else if(intersection.intPosY + 1 > this.dblPosY){
            this.deplacer(0,0.1);
        }
    }

/**
 * 
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
    }

    mourir() {
        this.binEtatVie = false;
        instanceMoteurSon.jouerSon(1);
        window.setTimeout(() => this.revivre(), 1000);
    }

    revivre() {
        objJeu.objNiveau.placerGarde(this);
        this.binRevive = true;
    }
}