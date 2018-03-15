/**
 * Classe qui charge une liste de fichiers audio dans des AudioBuffer pour etre utilise avec WAAPI
 */
class ChargeurAudioBuffer {
    /**
     * @param {AudioContext} ctx 
     * @param {Array<string>} urls 
     * @param {Function} callback 
     */
    constructor(ctx, urls, callback) {
        this.ctxAudio = ctx;
        this.lstURLs = urls;
        this.evenementFiniCharger = callback;
        /**
         * @type {Array<AudioBuffer>}
         */
        this.lstAudioBuffer = new Array();
        this.nbSonsCharges = 0;

        this.lstURLs.forEach((x, index) => {
            this.chargerSon(x, index)
        })

    }

    /**
     * 
     * @param {string} src 
     * @param {number} index
     */
    chargerSon(src, index){
        let requete = new XMLHttpRequest();
        let chargeur = this;
        
        requete.open('GET', src, true);
        requete.responseType = "arraybuffer";

        requete.onload = () => {
            chargeur.ctxAudio.decodeAudioData(requete.response, chargeur.chargerBuffer, erreurChargement)
        }

        requete.onerror = () => {
            chargeur.erreurChargement(index);
        }
        
        requete.send();
    }

    /**
     * 
     * @param {AudioBuffer} buffer 
     * @param {number} index
     */
    chargerBuffer(buffer, index){
        if(!buffer){
            erreurChargement();
        }else{
            this.lstAudioBuffer[index] = buffer;
            if(this.nbSonsCharges == this.lstURLs.length){
                this.evenementFiniCharger(this.lstAudioBuffer)
            }
            this.nbSonsCharges++;
        }
    }

    erreurChargement(numSon){
        console.error("[ChargeurAudioBuffer] Erreur de chargement du son " + this.lstURLs[numSon])
    }

}