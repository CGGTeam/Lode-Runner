var objCanvas; 
var objC2D;
const dblLargCase = 20;
const dblHautCase = 22;
var objJeu;

window.onload = function () {
    //Main / point d'entrée
    objCanvas = document.getElementById('cvJeu');
    objC2D = objCanvas.getContext('2d');
    objJeu = new Jeu();
}
