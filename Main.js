var objCanvas; 
var objC2D;
const dblLargCase = 20;
const dblHautCase = 22;
var objJeu;
var objScore;
var instanceMoteurSon;

function apresInitSonEtWindowLoad() {
    objCanvas = document.getElementById('cvJeu');
    objC2D = objCanvas.getContext('2d');
    objJeu = new Jeu();
    objScore = new Scoreboard(objCanvas, objC2D);
}

window.onload = function () {
    //Main / point d'entrée
    instanceMoteurSon = new MoteurSonsWAAPI(apresInitSonEtWindowLoad);
}
