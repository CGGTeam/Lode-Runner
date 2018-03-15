var objCanvas; 
var objC2D;
var dblLargCase;
var dblHautCase;
var objJeu;
var instanceMoteurSon;

function apresInitSonEtWindowLoad() {
    objCanvas = document.getElementById('cvJeu');
    objC2D = objCanvas.getContext('2d');
    dblLargCase = objCanvas.width / 28;
    dblHautCase = objCanvas.height / 17;
    objJeu = new Jeu();
}

window.onload = function () {
    //Main / point d'entrée
    instanceMoteurSon = new MoteurSonsWAAPI(apresInitSonEtWindowLoad);
}
