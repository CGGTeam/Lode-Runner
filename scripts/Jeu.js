//@ts-check

class Jeu {
    constructor() {
        //initAnimation
        this.intScore = 0;
        this.intVies = 1;
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
        this.intNiveau++;
        this.intNiveau = Math.min(10, this.intNiveau);
        this.updateNiveau();
        this.creerNiveau();
    }

    updateNiveau(){
        this.objScoreBoard.currentLevel = this.intNiveau;
    }

    jouerMort(){
        this.intVies --;
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
        window.cancelAnimationFrame(this.animationHandle);
        this.intScore = 0;
        this.intVies = 5;
        this.intNiveau = 0;
        //Jouer son: (fall)
        instanceMoteurSon.jouerSon(3);
        //DrawText (Game Over, Try Again? [yes] [no])
        objC2D.save();
        objC2D.fillStyle = "red";
        objC2D.font = "Lode";
        objC2D.translate(objCanvas.width/2, objCanvas.height/2);
        objC2D.fillRect(-50,-30,100,60);
        objC2D.scale(0,2);
        objC2D.fillText("GAME OVER", -20, -10);
        objC2D.fillText("Try Again?", -20, 10);
        objC2D.restore();

        window.addEventListener("onKeyDown", (e) => {
            //Reset stats, restart game
            if(e.keyCode === "Enter"){
                this.updateVies();
                this.updateScore();
            }
        });
    }

    bouclePrincipale () {
        this.animationHandle = window.requestAnimationFrame(() => this.bouclePrincipale());
        this.effacerEcran();
        this.mettreAJourAnimation();
        this.dessiner();
        this.objScoreBoard.ctxDrawScoreboard();
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