const FPS_ANIMATION = 0.25;
const KEYS_PER_SECONDS = 30;


Array.prototype.inArray = function(comparer, element) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i], element)) return true;
    }
    return !Boolean(element);
};

Array.prototype.refInArray = function(element){
    for(var i=0; i < this.length; i++) {
        if(this[i] == element) return true;
    }
    return false;
}

Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer, element)) {
        this.push(element);
    }
};

Array.prototype.pushIfNoNull = function(element){
    if(element !== null){
        this.push(element);
    }
}

Array.prototype.pushCroissant = function(element, comparer, binCroissant){
    for(let i = 0; i < this.length; i++){
        if(comparer(this[i], element)){
            this.splice(i,0,element);
            return;
        }
    }
    this.push(element);
}

function preloadImage (strUrl) {
    var objImage = new Image();
    objImage.crossOrigin = 'Anonymous';
    objImage.src = strUrl;
    return objImage;
}