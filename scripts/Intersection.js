class Intersection{
    constructor(intPosX, intPosY){
        this.intPosX = intPosX;
        this.intPosY = intPosY;
        this.playerPos = null;
        this.tabNextIntersections = [];
    }

    nextIntersections(){
        if(this.playerPos){
            let tempo = this.playerPos;
            this.playerPos = null;
            return tempo;
        }else{
            return this.tabNextIntersections
        }
    }
}