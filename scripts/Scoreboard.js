//@ts-check

class Scoreboard{

    /**
     * 
     * @param {HTMLCanvasElement} Canvas 
     * @param {CanvasRenderingContext2D} objC2D
     * @param {number} score
     * @param {number} lives
     * @param {number} level
     */
    constructor(Canvas, objC2D, score = 0, lives = 3, level = 1){

        this.currentScore = score;
        this.currentLives = lives;
        this.currentLevel = level;
        
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas = Canvas;

        /**
         * @type {CanvasRenderingContext2D}
         */
        this.objC2D = objC2D;

        this.ScoreboardWidth = this.canvas.width;
        this.ScoreboardHeigt = Math.round(this.canvas.height*0.05);
        this.ScoreboardFieldTextColor = "#0da1ff";
        this.ScoreboardValueTextColor = "#db553d";
        this.ScoreboardFont = "Lode";
        this.ScoreboardFontSize = "15.5px";
        this.ScoreboardLocation = [0,410];
        this.ScoreboardTextOffset = 10;

        //this.ctxClearScoreboard();

    }

    /**
     * 
     * @param {number} nb Nombre
     * @param {number} nbCar Nombre de characteres
     */
    ajouteZeros(nb, nbCar) {
        return new Array(+nbCar + 1 - (nb + '').length).join('0') + nb;
    }

    /**
     * 
     * @param {string} text
     * @param {string} color
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    ctxDrawText(text, color, x, y){
        this.objC2D.font = (this.ScoreboardFontSize + " " + this.ScoreboardFont);
        this.objC2D.fillStyle = color;
        this.objC2D.scale(1,2);
        let ret = this.objC2D.measureText(text);
        this.objC2D.fillText(text, x, y/2);
        this.objC2D.scale(1,0.5);
        return ret.width;
    }

    /**
     * 
     * @param {Array<string>} textArr 
     * @param {Array<string>} colorArr 
     * @param {number} startX 
     * @param {number} startY 
     */
    ctxDrawMultiText(textArr, colorArr, startX, startY){
        if(textArr.length == colorArr.length){
            let lenghtArr = [];
            textArr.forEach((x, i) => {
                let textX = startX;
                if(i!=0){
                    for(let a=(i-1);a>-1;a--){
                        textX += lenghtArr[a];
                    }
                }
                lenghtArr[i] = this.ctxDrawText(x, colorArr[i], textX, startY);
            })
        }
    }

    ctxDrawScoreboard(){

        let scoreTextArr = ["SCORE", ""+this.ajouteZeros(this.currentScore, 7) + " ", "MEN", ""+this.ajouteZeros(this.currentLives,3) + " ", "LEVEL", ""+this.ajouteZeros(this.currentLevel,3)];
        let scoreColrArr = [this.ScoreboardFieldTextColor, this.ScoreboardValueTextColor, this.ScoreboardFieldTextColor, this.ScoreboardValueTextColor, this.ScoreboardFieldTextColor, this.ScoreboardValueTextColor];
        this.ctxDrawMultiText(scoreTextArr, scoreColrArr, this.ScoreboardLocation[0]+this.ScoreboardTextOffset,this.ScoreboardLocation[1]+this.ScoreboardTextOffset);

    }

    ctxClearScoreboard(){
        this.objC2D.fillStyle = "black"
        this.objC2D.fillRect(this.ScoreboardLocation[0], this.ScoreboardLocation[1], this.ScoreboardWidth, this.ScoreboardHeigt);
    }   

}