//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        objScore = this.objScoreBoard;
        this.intScore = 0;
        this.intVies = 5;
        this.objNiveau = 1;
        this.intNumLingots = 6;
        this.objScoreBoard = new Scoreboard(objCanvas, objC2D, 0, this.intVies, this.objNiveau);
        this.creerNiveau();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    creerNiveau() {
        this.objNiveau = new Niveau('niv1.txt', this.objNiveau);
    }

    ramasseLingot(){
        this.intScore += 250;
        this.intNumLingots -= 1;
        this.updateScore();
        if(this.intNumLingots === 0){
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
        this.objNiveau += 1;
        this.objScoreBoard.currentLevel = this.objNiveau;
        this.creerNiveau();
    }

    updateVies(){
        this.objScoreBoard.currentLives = this.intVies;
        if(this.intVies === 0){
            this.gameOver();
        }
    }

    gameOver(){
        //Jouer son: (fall)
        //DrawText (Game Over, Try Again? [yes] [no])
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