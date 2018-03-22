//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        objScore = this.scoreBoard;
        this.score = 0;
        this.vies = 5;
        this.niveau = 1;
        this.numLingots = 6;
        this.scoreBoard = new Scoreboard(objCanvas, objC2D, 0, this.vies, this.niveau);
        this.creerNiveau();
        window.requestAnimationFrame(() => this.bouclePrincipale());
    }

    creerNiveau() {
        this.objNiveau = new Niveau('niv1.txt', this.niveau);
    }

    ramasseLingot(){
        this.score += 250;
        this.numLingots -= 1;
        this.updateScore();
        if(this.numLingots === 0){
            this.objNiveau.binEchelleFin = true;
        }
    }

    updateScore(){
        console.log('UpdateScore: ');
        console.log('previous: ' + this.scoreBoard.currentScore);
        console.log('current: ' + this.score);
        this.scoreBoard.currentScore = this.score;
    }

    prochainNiveau(){
        console.log('next level');
        instanceMoteurSon.stopperToutSon();
        instanceMoteurSon.jouerSon(5);
        this.score += 1500;
        this.updateScore();
        this.niveau += 1;
        this.scoreBoard.currentLevel = this.niveau;
        this.creerNiveau();
    }

    updateVies(){
        console.log('update vies');
        this.scoreBoard.currentLives = this.vies;
        if(this.vies === 0){
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
        this.scoreBoard.ctxDrawScoreboard();
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