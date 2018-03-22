class Path{
    
    constructor(intX, intY, horizontal, vertical){
        this.tabPositionsX = [intX];
        this.tabPositionsY = [intY];
        this.horizontal = horizontal;
        this.vertical = vertical;
        this.lastPosX = intX;
        this.lastPosY = intY;
    }

    addPosition(intX, intY){
        this.tabPositionsX.push(intX);
        this.tabPositionsY.push(intY);
        this.lastPosX = intX;
        this.lastPosY = intY;
    }
}