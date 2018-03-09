import {EntiteDynamique} from "./EntiteDynamique";

export class Joueur extends EntiteDynamique{
    constructor(posInitX, posInitY) {
        super(posInitX, posInitY);
        this.score = 0;
    }
}