import {Dessinable, dessinable} from './Dessinable'

export class Niveau extends dessinable{
  enumTypesBlocs = Object.freeze([
    '',
    '../assets/img/brick.png',
    '../assets/img/crate.png',
    '../assets/img/ladder.png',
    '../assets/img/climb.png',
    '../assets/img/lingot.png',
    '../assets/img/bloc.png'
  ]);
  tabNiveau = [];

  constructor() {
    
  }

  lireFichierNiveau() {
      fetch('../assets/maps/niv1txt')
      .then(response => response.text())
      .then(text => console.log(text));
  }
}