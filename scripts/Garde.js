const enumGardeMap = Object.freeze({
    RUN_R : [[0, 0],[1, 0], [2, 0]],
    RUN_L : [[3, 0],[4, 0], [5, 0]],
    FALL_R : [[8, 0]],
    FALL_L : [[8, 1]],
    CLIMB_R : [[0, 0],[1, 0], [2, 0]],
    CLIMB_L : [[3, 0],[4, 0], [5, 0]],
    CLIMB_U : [[6, 0],[7, 0]],
    CLIMB_D : [[7, 0],[6, 0]],
    DED : [[6, 1], [7, 1]]
})

class Garde extends EntiteDynamique{

    constructor(posInitX, posInitY, intNbGarde) {
        super(posInitX,posInitY,enumGardeMap, preloadImage('./assets/img/guard' + intNbGarde + '.png'));
        this.dblAnimFrame = 0;
    }

    pathFinding(){
        let startPath = new Path(this.dblPosX, this.dblPosY, 1, 0);
        console.log(this.nextPaths(startPath));
    }

/**
 * 
 * @param {Path} path 
 */
    nextPaths(path){
        let binAccessible = true;
        while(binAccessible && !Garde.tabIntersections[path.lastPosY][path.lastPosX]){
            path.addPosition(path.lastPosX + path.horizontal, path.lastPosY + path.vertical)
            binAccessible = path.lastPosY < Garde.tabIntersections.length && path.lastPosX < Garde.tabIntersections[0].length 
                && objJeu.objNiveau.tabGrilleNav[path.lastPosY][path.lastPosX];
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
                tempo.vertical = -1;
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