//@ts-check

class MoteurSons {

    constructor(){
        /**
         * @type {Array<HTMLAudioElement>}
         */
        this.ListeSons = [];
        
        this.ListeSons.push(this.createAudioElement('echelle', 'assets/sound/echelle.mp3'));
        this.ListeSons.push(this.createAudioElement('mort', 'assets/sound/dead.mp3'));
    }

    /**
     * @param {string} nom 
     * @param {string} src
     * @returns {HTMLAudioElement}
     */
    createAudioElement(nom, src){
        let elemAudio = document.createElement('audio');
        elemAudio.style.display = "none";
        elemAudio.src = src;
        elemAudio.id = nom
        elemAudio.autoplay = false;
        elemAudio.setAttribute('controls', 'none');
        elemAudio.setAttribute('preload', 'auto');
        document.body.appendChild(elemAudio);
        return elemAudio;
    }

    /**
     * @param {number} numSon 
     * @param {boolean} booLoop
     */
    jouerSon(numSon, booLoop = false){
        this.ListeSons[numSon].currentTime = 0;
        this.ListeSons[numSon].loop = booLoop;
        this.ListeSons[numSon].play();
    }

    /**
     * @param {number} numSon 
    */
    stopperSon(numSon){
        this.ListeSons[numSon].pause();
    }

    stopperToutSon(){
        this.ListeSons.forEach(elemSon => {
            elemSon.pause();
        });
    }
}