
Array.prototype.inArray = function(comparer, element) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i], element)) return true;
    }
    return !Boolean(element);
};


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

function preloadImage (strUrl) {
    var objImage = new Image();
    objImage.src = strUrl;
    return objImage;
}

function preloadImage1 (strUrl) {
    console.log(strUrl);
    let objImage;     
    fetch(strUrl).then(img => {
        objImage = img;
        return objImage;
    });
}