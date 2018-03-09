class Joueur extends EntiteDynamique{
    constructor(posInitX, posInitY) {
        super(posInitX, posInitY, function dessiner() {

        });
        this.score = 0;
    }
}