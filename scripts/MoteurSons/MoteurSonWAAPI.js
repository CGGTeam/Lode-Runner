//@ts-check

//import { ChargeurAudioBuffer } from "./ChargeurAudioBuffer.js";

class MoteurSonsWAAPI {

    /**
     *
     * @param {Function} callbackFiniChargerMoteur
     */
    constructor(callbackFiniChargerMoteur) {
        /**
         * @type {AudioContext}
         */
        //@ts-ignore
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.ListeSons = [];
        /**
         * @type {Array<AudioBuffer>}
         */
        this.ListeAudioBuffer = [];

        /**
         * @type {Array<AudioBufferSourceNode>}
         */
        this.ListeSonsEnCours = [];

        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/echelle.mp3');
        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/dead.mp3');
        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/dig.mp3');
        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/fall.mp3');
        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/getGold.mp3');
        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/goldFinish1.mp3');
        this.ListeSons.push('http://www.antoinebl.com/Lode-Runner/assets/sound/trap.mp3');
        this.callbackFiniChargerMoteur = callbackFiniChargerMoteur;

        /**
         *
         * @param {Array<AudioBuffer>} lstAudioBuffer
         */
        this.finiChargement = (lstAudioBuffer) => {
            this.ListeAudioBuffer = lstAudioBuffer;
            this.callbackFiniChargerMoteur();
        }

        this.chargeurSons = new ChargeurAudioBuffer(this.audioCtx, this.ListeSons, this.finiChargement)
    }

    /**
     *
     * @param {number} numSon
     * @param {boolean} booLoop
     * @param {boolean} reverse
     */
    jouerSon(numSon, booLoop = false, reverse = false) {
        if (!this.ListeSonsEnCours[numSon]) {
            let source = this.audioCtx.createBufferSource();
            let soundBuffer;

            if (reverse) {

                //Copy audio data
                let chOneReverse = new Float32Array(this.ListeAudioBuffer[numSon].length);
                let chTwoReverse = new Float32Array(this.ListeAudioBuffer[numSon].length);
                this.ListeAudioBuffer[numSon].copyFromChannel(chOneReverse, 0);
                this.ListeAudioBuffer[numSon].copyFromChannel(chTwoReverse, 0);
                soundBuffer = this.audioCtx.createBuffer(2, chOneReverse.length, this.ListeAudioBuffer[numSon].sampleRate);

                //Reverse audio data
                chOneReverse.reverse();
                chTwoReverse.reverse();

                //Put audio data into new AudioBuffer
                soundBuffer.copyToChannel(chOneReverse,0);
                soundBuffer.copyToChannel(chTwoReverse,1);

            } else {
                soundBuffer = this.ListeAudioBuffer[numSon];
            }


            source.buffer = soundBuffer;
            source.connect(this.audioCtx.destination);
            source.loop = booLoop;
            source.onended = (!booLoop) ? () => {
                this.stopperSon(numSon)
            } : null;
            source.start(0);
            source.addEventListener('start', (e) => {
                console.log(e);
            });
            this.ListeSonsEnCours[numSon] = source;
        }
    }

    stopperSon(numSon) {
        let source = this.ListeSonsEnCours[numSon];
        if (source) {
            source.stop();
            this.ListeSonsEnCours[numSon] = null;
        }
    }

    stopperToutSon() {
        this.ListeSonsEnCours.forEach((x, i) => {
            if (x != null) {
                x.stop();
                this.ListeSonsEnCours[i] = null;
            }
        })
    }

}