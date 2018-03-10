class Niveau extends Dessinable{
  /**
   * Initialise un niveau à partir de fichierNiveau. Ce fichier
   * est cherché par défaut à l'adresse suivante: 
   * @param {String} strFichierNiveau 
   */
  constructor(strFichierNiveau) {
    super();
    console.log('waack');
    //Ceci est la valeur par défaut qui est utilisée s'il n'y a pas de connexion Internet
    this.niveauDefaut =
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

    this.tabBlocs = [];
    this.tabEchelles = [];
    this.tabLingots = [];
    this.tabCasesImbrisables = [];
    this.strFichierNiveau = strFichierNiveau;
    this.strCouleurFond = 'black';
    this.lireFichierNiveau();
  }

  lireFichierNiveau() {
   // fetch('https://antoine-bl.github.io/Lode-Runner/assetsads/maps/' + this.strFichierNiveau)
   // .then(response => response.text())
  //  .catch((err) => {
   //   console.error(err);
  //    console.warn('Fichier ' + this.strFichierNiveau + ' absent du serveur. Niveau par défaut utilisé');
      this.traiterFichier(this.niveauDefaut);
   // })
   // .then(text => this.traiterFichier(text))
   // .catch((err) => console.error(err));
    
    console.log('https://antoine-bl.github.io/Lode-Runner/assets/maps/' + this.strFichierNiveau);
  }
  
  traiterFichier (contenuFichier) {
    let tabLignes = contenuFichier.split('\n');
    let mapEchelles = new Map(); //Key: position x de l'échelle, Value: tableau d'échelles qui ont cette position x
    let tabBlocsLus = [];
    let tabBlocsBarre = [];

    for (let i = 0; i < tabLignes.length; i++) {
      let binBloc = false; //booléen qui détermine si le caret est dans un bloc ou non
      let binBlocBarre = false; //Même idée que binBloc mais pour des blocs de barres de franchissement

      for (let j = 0; j < tabLignes[i].length; j++) {
        let char = tabLignes[i].charAt(j);
        switch (char) {
          case '0':
            if (binBloc) {
              binBloc = false;
              let objDernierBloc = tabBlocsLus.slice(-1)[0];
              objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
            } else if (binBlocBarre) {
              binBlocBarre = false;
              let objDernierBloc = tabBlocsBarre.slice(-1)[0];
              objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
            }
            break;
          case '1':
            if (!binBloc) {
              binBloc = true;
              tabBlocsLus.push(new Bloc(j, i, 1));
              if (binBlocBarre) {
                binBlocBarre = false;
                let objDernierBloc = tabBlocsBarre.slice(-1)[0];
                objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
              }
            }
            break;
          case '2':
            let echelleCourante;
            if (mapEchelles.has(j)) {
              let tabEchellesAuDessus = mapEchelles.get(j);
              let intIndexTrouve = tabEchellesAuDessus.findIndex(echelle => echelle.intY2 + 1 == i);
              if (intIndexTrouve == -1) {
                echelleCourante = new Echelle(j, i, i, null);
                tabEchellesAuDessus.push(echelleCourante);
              } else {
                echelleCourante = tabEchellesAuDessus[intIndexTrouve];
                tabEchellesAuDessus[intIndexTrouve].intY2 = i;
              }
            } else {
              echelleCourante = new Echelle(j, i, i, null);
              mapEchelles.set(j, [echelleCourante]);
            }

            if (binBloc) {
              tabBlocsLus.slice(-1)[0].tEchelles.push(echelleCourante);
            }
            if (binBlocBarre) {
              binBlocBarre = false;
              let objDernierBloc = tabBlocsBarre.slice(-1)[0];
              objDernierBloc.intLongueur = objDernierBloc.posXGauche - j;
            }
            break;
          case '3':
            if (!binBlocBarre) {
              binBlocBarre = true;
              tabBlocsBarre.push(new Bloc(j, i, 1));
              if (binBloc) {
                binBloc = false;
                let objDernierBloc = tabBlocsLus[tabBlocsLus.length - 1];
                objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
              }
            }
            break;
          case '4':
            this.tabLingots.push(new Lingot(j, i));
            break;
          case '5':
            this.tabCasesImbrisables.push(new CaseImbrisable(j, i));
            break;
          case '6':
            this.objJoueur = new Joueur(j,i);
            break;
        }
        if (binBloc) {
          let objDernierBloc = tabBlocsLus.slice(-1)[0];
          objDernierBloc.intLongueur = j - objDernierBloc.posXGauche + 1;
        } else if (binBlocBarre) {
          let objDernierBloc = tabBlocsBarre.slice(-1)[0];
          objDernierBloc.intLongueur = j - objDernierBloc.posXGauche + 1;
        }
      }
    }

    this.tabBlocs = tabBlocsLus;
    mapEchelles.forEach(tabE => tabE.forEach(e => this.tabEchelles.push(e)));
  }

  dessiner () {
    objC2D.save();
    objC2D.fillStyle = this.strCouleurFond;
    objC2D.rect(0, 0, objCanvas.width, objCanvas.height);
    objC2D.fill();
    objC2D.restore();

    this.tabBlocs.forEach(b => b.dessiner());
    this.tabCasesImbrisables.forEach(c => c.dessiner());
    this.tabEchelles.forEach(e => e.dessiner());
    this.tabLingots.forEach(l => l.dessiner());
    this.objJoueur.dessiner();
  }

  mettreAJourAnimation() {
    this.tabBlocs.forEach(b => b.mettreAJourAnimation());
    this.tabCasesImbrisables.forEach(c => c.mettreAJourAnimation());
    this.tabEchelles.forEach(e => e.mettreAJourAnimation());
    this.tabLingots.forEach(l => l.mettreAJourAnimation());
  }
}