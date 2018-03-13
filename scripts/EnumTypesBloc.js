<<<<<<< HEAD
=======
class TypeBloc { 
    constructor(strUrl) {
        this.objImage = new Image();
        this.objImage.src = strUrl;
    }
}

var enumTypesBlocs = Object.freeze({
    objBrique: new TypeBloc('./assets/img/brick.png'),
    objEchelle: new TypeBloc('./assets/img/ladder.png'),
    objGrimpe: new TypeBloc('./assets/img/climb.png'),
    objLingot: new TypeBloc('./assets/img/lingot.png'),
    objBloc: new TypeBloc('./assets/img/bloc.png'),
    objJoueur: new TypeBloc('assets/img/perso.png')
});
>>>>>>> 13d5fd3cdb9d1a74bda873661a204f6c445dbc18
