const enumGardeMap = Object.freeze({
    RUN_R : [[0, 0],[1, 0], [2, 0]],
    RUN_L : [[3, 0],[4, 0], [5, 0]],
    FALL_R : [[8, 0]],
    FALL_L : [[8, 1]],
    CLIMB_R : [[0, 1],[1, 1], [2, 1]],
    CLIMB_L : [[3, 1],[4, 1], [5, 1]],
    CLIMB_U : [[6, 0],[7, 0]],
    CLIMB_D : [[7, 0],[6, 0]],
    DIG_R : [6, 0],
    DIG_L : [7, 0],
})

class Garde extends EntiteDynamique{

    constructor(posInitX, posInitY) {
        super(posInitX,posInitY,enumGardeMap, preloadImage('./assets/img/guard.png'));
        this.intAnimFrame = 0;
    }
}