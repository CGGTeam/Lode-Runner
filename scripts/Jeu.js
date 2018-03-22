//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        objScore = this.objScoreBoard;
        this.intScore = 0;
        this.intVies = 5;
        this.intNiveau = 0;
        this.objScoreBoard = new Scoreboard(objCanvas, objC2D, 0, this.intVies, this.intNiveau);
        this.creerNiveau();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    creerNiveau() {
        this.objNiveau = new Niveau('niv1.txt', this.intNiveau);
    }

    ramasseLingot(){
        this.intScore += 250;
        this.objNiveau.intNbLingots -= 1;
        this.updateScore();
        if(this.objNiveau.intNbLingots === 0){
            this.objNiveau.binEchelleFin = true;
        }
    }

    updateScore(){
        this.objScoreBoard.currentScore = this.intScore;
    }

    prochainNiveau(){
        instanceMoteurSon.stopperToutSon();
        instanceMoteurSon.jouerSon(5);
        this.intScore += 1500;
        this.updateScore();
        this.intNiveau ++;
        this.intNiveau = Math.min(10, this.intNiveau);
        this.objScoreBoard.currentLevel = this.intNiveau;
        this.creerNiveau();
    }

    jouerMort(){
        this.vies -= 1;
        this.updateVies();
        this.creerNiveau();
    }

    updateVies(){
        this.objScoreBoard.currentLives = this.intVies;
        if(this.intVies === 0){
            this.gameOver();
            return false;
        }
        return true;
    }

    gameOver(){
        //Jouer son: (fall)
        //DrawText (Game Over, Try Again? [yes] [no])
        //Reset stats
        this.creerNiveau(); //tempo
    }

    bouclePrincipale () {
        this.effacerEcran();
        this.mettreAJourAnimation();
        this.dessiner();
        this.objScoreBoard.ctxDrawScoreboard();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    effacerEcran() {
        objC2D.clearRect(0, 0, objCanvas.width, objCanvas.height);
    }

    mettreAJourAnimation () {
        this.objNiveau.mettreAJourAnimation();
    }

    dessiner () {
        this.objNiveau.dessiner();
    }
}