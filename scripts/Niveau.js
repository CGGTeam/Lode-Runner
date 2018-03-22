const DBL_VIT_ECHELLE_FIN = 0.02;
const INT_POS_X_ECHELLE_FIN = 18;

class Niveau extends Dessinable{
  /**
   * Initialise un niveau à partir de fichierNiveau. Ce fichier
   * est cherché par défaut à l'adresse suivante: http://www.antoinebl.com/Lode-Runner/assets/maps/
   * @param {String} strFichierNiveau 
   */
  constructor(strFichierNiveau, intNiveau) {
    super();
    //Ceci est la valeur par défaut qui est utilisée s'il n'y a pas de connexion Internet
    this.strNiveauDefaut =
    '0000000000000000000000000000\n' +
    '0000400000000000000000000000\n' +
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
      Joueur.prototype.constructor
    ];

    this.tabBlocs = [];
    this.tabEchelles = [];
    this.tabLingots = [];
    this.tabCasesImbrisables = [];
    this.tabGrilleNiveau = [];
    this.tabGrilleNav = [];
    this.tabGardes = [];
    this.tabGardes.length = intNiveau + 2;
    this.strCouleurFond = 'black';
    this.binEchelleFin = false;
    this.dblCompteurEchelle = 0;
    this.intLongueurEchelle = 4;
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
    .then(text => {
        this.traiterFichier(text);
        Garde.setIntersections();
      })
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
   * 6: Joueur
   * 7: Garde
   * @param {String} strContenuFichier 
   */
  traiterFichier (strContenuFichier) {
    let mapSpawn = new Map();
    
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
          } else {
              this.tabGrilleNiveau[i][j] = objCase;
              objCase.updateNav(this.tabGrilleNav, this.tabGrilleNiveau);
              objCase.updateSpawn(this.tabGrilleNiveau, mapSpawn);
          }
        } else {
          this.tabGrilleNiveau[i].push(null);
        }
      }
    }

    mapSpawn.delete(Math.round(this.objJoueur.intPosY));
    this.initGardes(mapSpawn);
  }
  
  /**
   * Déssine les cases, puis les gardes et le joueur
   */
  dessiner () {
    objC2D.fillStyle = this.strCouleurFond;
    objC2D.fillRect(0, 0, objCanvas.width, objCanvas.height);

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
    
    if (this.binEchelleFin) {
      this.dblCompteurEchelle += DBL_VIT_ECHELLE_FIN;
      if (this.dblCompteurEchelle >= this.intLongueurEchelle) {
        this.dblCompteurEchelle = this.intLongueurEchelle - 1;
      }

      let intCompteurExact = Math.floor(this.dblCompteurEchelle);
      if (!this.tabGrilleNiveau[intCompteurExact][INT_POS_X_ECHELLE_FIN]) {
        instanceMoteurSon.jouerSon(1);
        this.tabGrilleNiveau[intCompteurExact][INT_POS_X_ECHELLE_FIN] = new Echelle(INT_POS_X_ECHELLE_FIN, intCompteurExact);
      }
    }
  }
  
  /**
   * Créé le bon nombre de gardes selon le niveau
   * @param {Map<number, Array<number>>} mapSpawn 
   */
  initGardes(mapSpawn) {
    for (let i = 0; i < this.tabGardes.length; i++) {
      this.tabGardes[i] = this.genererGarde(mapSpawn, i);
    }
  }

  /**
   * À partir d'une map, génère un garde aléatoirement dans le niveau
   * @param {Map<number, Array<number>>} mapSpawn clé = position y, valeur = tableau des positions x possible pour cet y
   * @param {number} intNbGarde index qui décide la couleur du chandail du garde
   */
  genererGarde(mapSpawn, intNbGarde) {
    let itMap = mapSpawn.entries();
    let intPositionY = Math.floor(Math.random() * mapSpawn.size);
    for (let i = 0; i < intPositionY - 1; i++){
      itMap.next();
    }
    let tabBonneEntree = itMap.next().value;
    let intY = tabBonneEntree[0];
    let tabXPoss = tabBonneEntree[1];
    let intX = tabXPoss.splice(Math.floor(Math.random() * tabXPoss.length), 1)[0];
    return new Garde(intX, intY, intNbGarde);
  }
}