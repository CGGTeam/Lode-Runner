//@ts-check

class Scoreboard{

    constructor(){
        /**
         * @type {HTMLCanvasElement}
         */
        //@ts-ignore
        this.canvas = window.objCanvas;
        this.ScoreboardWidth = this.canvas.width;
        this.ScoreboardHeigt = Math.round(this.canvas.height*0.05);
        this.ScoreboardColor = "#0da1ff"

    }

}