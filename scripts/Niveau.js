class Niveau extends Dessinable{
  constructor(fichierNiveau) {
    super();
    this.enumTypesBlocs = Object.freeze([
      '',
      '../assets/img/brick.png',
      '../assets/img/crate.png',
      '../assets/img/ladder.png',
      '../assets/img/climb.png',
      '../assets/img/lingot.png',
      '../assets/img/bloc.png'
    ]);
    this.tabNiveau = [];
    this.fichierNiveau = fichierNiveau;
    this.lireFichierNiveau();
  }

  lireFichierNiveau() {
    console.log('lireFichier');
    fetch(this.fichierNiveau)
    .then(response => response.text())
    .then(text => console.log(text));
  }
}