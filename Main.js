var objCanvas; 
var objC2D;
var dblLargCase;
var dblHautCase;
var objJeu;

window.onload = function () {
    //Main / point d'entrée
    objCanvas = document.getElementById('cvJeu');
    objC2D = objCanvas.getContext('2d');
    dblLargCase = objCanvas.width / 28;
    dblHautCase = objCanvas.height / 17;
    objJeu = new Jeu();
}
