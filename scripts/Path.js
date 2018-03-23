class Path{
    
    constructor(intY, intX, initIntersection){
        this.initPosX = Math.round(intX);
        this.initPosY = Math.round(intY);
        this.tabIntersections = [initIntersection];
        this.lastIntersection = initIntersection;
    }

    addPosition(intersection){
        let binExisteDeja = false;
        for(let i = 0; i < this.tabIntersections.length; i++)
            binExisteDeja = binExisteDeja || this.tabIntersections[i] == intersection;
        if(!binExisteDeja){
            this.tabIntersections.push(intersection);
            this.lastIntersection = intersection;
        }
        return this;
    }

    clone(){
        let obj = new Path();
        Object.assign(obj,this);
        obj.tabIntersections = this.tabIntersections.slice(0);
        return obj;
    }
}