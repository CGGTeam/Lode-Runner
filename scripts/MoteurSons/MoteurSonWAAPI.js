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

    this.ListeSons.push('https://antoine-bl.github.io/Lode-Runner/assets/sound/echelle.mp3');
    this.ListeSons.push('https://antoine-bl.github.io/Lode-Runner/assets/sound/dead.mp3');
    this.callbackFiniChargerMoteur = callbackFiniChargerMoteur;

    this.chargeurSons = new ChargeurAudioBuffer(this.audioCtx, this.ListeSons, this.finiChargement)
  }

  /**
   * 
   * @param {Array<AudioBuffer>} lstAudioBuffer 
   */
  finiChargement(lstAudioBuffer) {
    this.ListeAudioBuffer = lstAudioBuffer;
    this.callbackFiniChargerMoteur();
  }

  /**
   * 
   * @param {number} numSon 
   * @param {boolean} booLoop
   */
  jouerSon(numSon, booLoop = false) {
    let source = this.audioCtx.createBufferSource();
    source.buffer = this.ListeAudioBuffer[numSon];
    source.connect(this.audioCtx.destination);
    source.start(0);
    source.loop = booLoop;
  }

}