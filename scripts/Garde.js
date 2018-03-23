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

const DBL_PROB_DROP = 1 / (60 * 10);

class Garde extends EntiteDynamique{

    constructor(posInitX, posInitY, intNbGarde) {
        super(posInitX,posInitY,enumGardeMap, preloadImage('http://www.antoinebl.com/Lode-Runner/assets/img/guard.png'));
        this.intNbGarde;
        this.dblAnimFrame = 0;
        this.pathToPlayer = null;
    }

    mettreAJourAnimation () {
        try {
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
            console.warn('MICHAEL IS WACK')
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
        super.dessiner();
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
 * 
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