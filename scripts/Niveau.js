class Niveau extends Dessinable{
  /**
   * Initialise un niveau à partir de fichierNiveau. Ce fichier
   * est cherché par défaut à l'adresse suivante: 
   * @param {String} strFichierNiveau 
   */
  constructor(strFichierNiveau) {
    super();
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

    this.tabCodeBlocs = [
      null,
      Brique.prototype.constructor,
      Echelle.prototype.constructor,
      Barre.prototype.constructor,
      Lingot.prototype.constructor,
      Bloc.prototype.constructor
    ];
    this.tabBlocs = [];
    this.tabEchelles = [];
    this.tabLingots = [];
    this.tabCasesImbrisables = [];
    this.tabGrilleNiveau = [];
    this.strFichierNiveau = strFichierNiveau;
    this.strCouleurFond = 'black';
    this.lireFichierNiveau();
  }

  lireFichierNiveau() {
    fetch('https://antoine-bl.github.io/Lode-Runner/assets/maps/' + this.strFichierNiveau)
    .then(response => response.text())
    .catch((err) => {
      console.error(err);
      console.warn('Fichier ' + this.strFichierNiveau + ' absent du serveur. Niveau par défaut utilisé');
      this.traiterFichier(this.strFichierNiveau);
    })
    .then(text => this.traiterFichier(text))
    // .catch((err) => console.error(err));
  }

  traiterFichier (strContenuFichier) { 
    let tabLignes = strContenuFichier.split('\n');
    for (let i = 0; i < tabLignes.length; i++){
      this.tabGrilleNiveau.push([]);
      for (let j = 0; j < tabLignes[i].length; j++) { 
        let intNbLu = parseInt(tabLignes[i].charAt(j));
        if (this.tabCodeBlocs[intNbLu]) {
          let objCtor = this.tabCodeBlocs[intNbLu];
          let fctFactory = objCtor.bind(objCtor);
          this.tabGrilleNiveau[i][j] = new fctFactory(j, i);
        } else {
          this.tabGrilleNiveau[i].push(null);
        }
      }
    }
  }
  
  // traiterFichier (contenuFichier) {
  //   let tabLignes = contenuFichier.split('\n');
  //   let mapEchelles = new Map(); //Key: position x de l'échelle, Value: tableau d'échelles qui ont cette position x
  //   let mapBlocsLus = []; //Key: position y du bloc, Value: tableau des Blocs à ce niveau
  //   let mapBlocsBarre = [[]]; //Key: position y du bloc, Value: tableau des Blocs à ce niveau

  //   for (let i = 0; i < tabLignes.length; i++) {
  //     let binBloc = false; //Booléen qui détermine si le caret est dans un bloc ou non
  //     let binBlocBarre = false; //Même idée que binBloc mais pour des blocs de barres de franchissement
  //     mapBlocsLus.push([]);
  //     mapBlocsBarre.push([]);

  //     for (let j = 0; j < tabLignes[i].length; j++) {
  //       let char = tabLignes[i].charAt(j);
  //       switch (char) {
  //         case '0':
  //           if (binBloc) {
  //             binBloc = false;
  //             let objDernierBloc = mapBlocsLus[i].slice(-1)[0];
  //             objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
  //           } else if (binBlocBarre) {
  //             binBlocBarre = false;
  //             let objDernierBloc = mapBlocsBarre[i + 1].slice(-1)[0];
  //             objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
  //             objDernierBloc.mapPasserelles.push([objDernierBloc.posXGauche, objDernierBloc.posXGauche + objDernierBloc.intLongueur]);
  //           }
  //           break;
  //         case '1':
  //           if (!binBloc) {
  //             binBloc = true;
  //             mapBlocsLus[i].push(new Bloc(j, i, 1));
  //             if (binBlocBarre) {
  //               binBlocBarre = false;
  //               let objDernierBloc = mapBlocsBarre[i + 1].slice(-1)[0];
  //               objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
  //               objDernierBloc.mapPasserelles.push([objDernierBloc.posXGauche, objDernierBloc.posXGauche + objDernierBloc.intLongueur]);
  //             }
  //           }
  //           break;
  //         case '2':
  //           let echelleCourante;
  //           if (mapEchelles.has(j)) {
  //             let tabEchellesAuDessus = mapEchelles.get(j);
  //             let intIndexTrouve = tabEchellesAuDessus.findIndex(echelle => echelle.intY2 + 1 == i);
  //             if (intIndexTrouve == -1) {
  //               echelleCourante = new Echelle(j, i, i, null);
  //               tabEchellesAuDessus.push(echelleCourante);
  //             } else {
  //               echelleCourante = tabEchellesAuDessus[intIndexTrouve];
  //               tabEchellesAuDessus[intIndexTrouve].intY2 = i;
  //             }
  //           } else {
  //             echelleCourante = new Echelle(j, i, i, null);
  //             mapEchelles.set(j, [echelleCourante]);
  //           }

  //           if (binBloc) {
  //             mapBlocsLus[i].slice(-1)[0].tEchelles.push(echelleCourante);
  //           } else if (binBlocBarre) {
  //             binBlocBarre = false;
  //             let objDernierBloc = mapBlocsBarre[i + 1].slice(-1)[0];
  //             objDernierBloc.intLongueur = objDernierBloc.posXGauche - j;
  //             objDernierBloc.mapPasserelles.push([objDernierBloc.posXGauche, objDernierBloc.posXGauche + objDernierBloc.intLongueur]);
  //           }
  //           break;
  //         case '3':
  //           if (!binBlocBarre) {
  //             binBlocBarre = true;
  //             mapBlocsBarre[i + 1].push(new Bloc(j, i, 1));
  //             if (binBloc) {
  //               binBloc = false;
  //               let objDernierBloc = mapBlocsLus[i].slice(-1)[0];
  //               objDernierBloc.intLongueur = j - objDernierBloc.posXGauche;
  //             }
  //           }
  //           break;
  //         case '4':
  //           this.tabLingots.push(new Lingot(j, i));
  //           break;
  //         case '5':
  //           this.tabCasesImbrisables.push(new CaseImbrisable(j, i));
  //           break;
  //       }
  //       if (binBloc) {
  //         let objDernierBloc = mapBlocsLus[i].slice(-1)[0];
  //         objDernierBloc.intLongueur = j - objDernierBloc.posXGauche + 1;
  //       } else if (binBlocBarre) {
  //         let objDernierBloc = mapBlocsBarre[i + 1].slice(-1)[0];
  //         objDernierBloc.intLongueur = j - objDernierBloc.posXGauche + 1;
  //         objDernierBloc.mapPasserelles.push([objDernierBloc.posXGauche, objDernierBloc.posXGauche + objDernierBloc.intLongueur]);
  //       }
  //     }
  //     //Merge
  //     console.log(mapBlocsLus[i]);
  //     console.log(mapBlocsBarre[i]);
  //     console.log('===================')
  //     let tabMerge = mapBlocsLus[i].concat(mapBlocsBarre[i]);
      
  //     tabMerge.sort((a, b) => a.posXGauche - b.posXGauche);
  //     for (let j = 1; j < tabMerge.length; j++){
  //       let intLimGBloc1 = tabMerge[j - 1].posXGauche - 1;
  //       let intLimDBloc1 = intLimGBloc1 + tabMerge[j-1].intLongueur + 1;
  //       let intLimGBloc2 = tabMerge[j].posXGauche - 1;
  //       let intLimDBloc2 = intLimGBloc2 + tabMerge[j].intLongueur + 1;
  //       if (intLimGBloc1 <= intLimDBloc2 && intLimGBloc2 <= intLimDBloc1) {
  //         tabMerge[j].merge(tabMerge[j - 1]);
  //         tabMerge.splice(j - 1, 1);
  //         j--;
  //       }
  //     }
  //     this.tabBlocs = this.tabBlocs.concat(tabMerge);
  //     // Déterminer les limites
  //     // Échelles au dessus
  //   }
  //
  //   console.log(mapBlocsBarre);
  //   console.log(mapBlocsLus);
  //   console.log(this.tabBlocs);
  //   // mapBlocsLus.forEach(e => e.forEach(e1 => this.tabBlocs.push(e1)));
  //   mapEchelles.forEach(e => e.forEach(e1 => this.tabEchelles.push(e1)));
  //   console.log(this.tabEchelles);
  // }

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
  }

  mettreAJourAnimation() {
    this.tabBlocs.forEach(b => b.mettreAJourAnimation());
    this.tabCasesImbrisables.forEach(c => c.mettreAJourAnimation());
    this.tabEchelles.forEach(e => e.mettreAJourAnimation());
    this.tabLingots.forEach(l => l.mettreAJourAnimation());
    this.objJoueur.mettreAJourAnimation();
  }
}