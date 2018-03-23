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
            // console.log(dblBorneG, dblBorneD, dblXJoueur)
            // console.log(dblBorneH, dblBorneB, dblYJoueur)

            if (binTouchX && binTouchY) {
                objJeu.objNiveau.objJoueur.mourir();
            }
        } catch (e) {
            console.warn('MICHAEL IS WACK')
        }
        
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

                    

                   // console.log(Garde.tabIntersections);

                    if(Garde.tabIntersections[i][j] instanceof Intersection){
                        objC2D.save();
                        objC2D.fillStyle = "#FF0000";
                        //console.log(objC2D.fillStyle);
                        objC2D.fillRect(j * dblLargCase, i * dblHautCase, 5, 5);
                        //objC2D.fill();
                        objC2D.restore();
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
        console.log(Garde.tabIntersections);
    }
}