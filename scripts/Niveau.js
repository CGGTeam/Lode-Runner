class Niveau extends Dessinable{
  /**
   * Initialise un niveau à partir de fichierNiveau. Ce fichier
   * est cherché par défaut à l'adresse suivante: 
   * @param {String} strFichierNiveau 
   */
  constructor(strFichierNiveau) {
    super();
    //Ceci est la valeur par défaut qui est utilisée s'il n'y a pas de connexion Internet
    this.strNiveauDefaut =
    '0000000000000000000000000000\n' +
    '0000400007000000000000000000\n' +
    '1111111211111110000000000000\n' +
    '0000000233333333330000040000\n' +
    '0000000200001120001111111211\n' +
    '0000000200001120000000000200\n' +
    '0000000200001120000000400200\n' +
    '1121111100001111111121111111\n' +
    '0020000000000000000020000000\n' +
    '0020000000000000000020000000\n' +
    '1111111112111111111120000000\n' +
    '0000000002000000000020000000\n' +
    '0000000402333333333320004000\n' +
    '0000211111100000000011111112\n' +
    '0000200000000600004000000002\n' +
    '1111111111111111111111111111\n' +
    '5555555555555555555555555555';

    this.tabCodeBlocs = [
      null,
      Brique.prototype.constructor,
      Echelle.prototype.constructor,
      Barre.prototype.constructor,
      Lingot.prototype.constructor,
      Bloc.prototype.constructor,
      Joueur.prototype.constructor,
      Garde.prototype.constructor
    ];

    this.tabBlocs = [];
    this.tabEchelles = [];
    this.tabLingots = [];
    this.tabCasesImbrisables = [];
    this.tabGrilleNiveau = [];
    this.tabGrilleNav = [];
    this.score = 0;
    this.tabGardes = [];
    this.strCouleurFond = 'black';
    this.lireFichierNiveau(strFichierNiveau);
    console.log(this.tabGrilleNav);
    console.log(this.tabGrilleNiveau)
  }
  
  /**
   * Lit le fichier de niveau fourni sur le serveur web du repo github.
   * S'il y a échec lors de la récupération du fichier sur le serveur, on utilise le niveau
   * par défaut défini ci-haut.
   * @param {String} strFichierNiveau nom du fichier à chercher dans /assets/maps
   */
  lireFichierNiveau(strFichierNiveau) {
    fetch('http://www.antoinebl.com/Lode-Runner/assets/maps/' + strFichierNiveau)
    .then(response => response.text())
    .catch((err) => {
      console.warn('Erreur de communication avec le serveur. Niveau par défaut utilisé');
      this.traiterFichier(this.strNiveauDefaut);
    })
    .then(text => this.traiterFichier(text))
    .catch((err) => console.error(err));
  }

  /**
   * Parse un fichier niveau et créé la grille niveau selon celui-ci.
   * Le code utilisé est le suivant:
   * 0: espace vide
   * 1: brique
   * 2: échelle
   * 3: barre de franchissement
   * 4: lingot d'or
   * 5: bloc imbrisable (comme ceux en bas tout à fait)
   * @param {String} strContenuFichier string équivalent au niveau
   */
  traiterFichier (strContenuFichier) { 
    let tabLignes = strContenuFichier.trim().split('\n');
    for (let i = 0; i < tabLignes.length; i++){
      this.tabGrilleNiveau.push([]);
      this.tabGrilleNav.push([]);
      for (let j = 0; j < tabLignes[i].length; j++) {
        this.tabGrilleNav[i].push(false);
        let intNbLu = parseInt(tabLignes[i].trim().charAt(j));
        if (this.tabCodeBlocs[intNbLu]) {
          let objCtor = this.tabCodeBlocs[intNbLu];
          let fctFactory = objCtor.bind(objCtor, j, i);
          let objCase = new fctFactory();
          
          if (intNbLu == 6) {
            this.objJoueur = objCase;
          }else if(intNbLu == 7){
            this.tabGardes.push(objCase);
          }
          else{
              this.tabGrilleNiveau[i][j] = objCase;
              objCase.updateNav(this.tabGrilleNav);
          }
        } else {
          this.tabGrilleNiveau[i].push(null);
        }
      }
    }
  }

  updateScore(){
    document.getElementById("score").innerHTML = this.score;
  }
  
  /**
   * Déssine les cases, puis les gardes et le joueur
   */
  dessiner () {
    objC2D.save();
    objC2D.fillStyle = this.strCouleurFond;
    objC2D.rect(0, 0, objCanvas.width, objCanvas.height);
    objC2D.fill();
    objC2D.restore();

    for (let i = 0; i < this.tabGrilleNiveau.length; i++) {
      for (let j = 0; j < this.tabGrilleNiveau[i].length; j++) {
        if (this.tabGrilleNiveau[i][j]) {
          this.tabGrilleNiveau[i][j].dessiner();
        }
      }
    }

    if(this.objJoueur) this.objJoueur.dessiner();
    this.tabGardes.forEach(obj => obj.dessiner());      
  }

  /**
   * Appelle les fonctions de mise à jour d'animation de tous les objets du niveau
   */
  mettreAJourAnimation() {
    this.tabGrilleNiveau.forEach(l => l.forEach(c => { if (c) c.mettreAJourAnimation() }));
    if(this.objJoueur) this.objJoueur.mettreAJourAnimation();
    this.tabGardes.forEach(obj => obj.mettreAJourAnimation());  
  }    
}