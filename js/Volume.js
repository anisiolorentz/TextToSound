// export class Volume { // fazer o indicador de volume alterar na página
//     static currentVolume;

//     static up(synth) {
//         this.currentVolume += 2
//         synth.volume.value = this.currentVolume;
//     }

//     static down(synth) {
//         this.currentVolume -= 2;
//         synth.volume.value = this.currentVolume;

//     }

//     static double(synth) { 
//         if (this.currentVolume < 0) { // existe volume negativo (acho que devem existir solucoes melhores)
//             let absVolume = Math.abs(this.currentVolume);
//             this.currentVolume += absVolume;
//         }
//         else if (this.currentVolume == 0) { // se volume for zero (valor incial) dobrar iria continuar zero, entao aumenta 6
//             this.currentVolume += 2
//         }
//         else {
//             this.currentVolume = this.currentVolume * 2;
//         }
//         synth.volume.value = this.currentVolume;
//     }

//     static getCurrentVolume() { // na vdd nao ta sendo utilizado pq currentVolume é publico
//         return this.currentVolume;
//     }
// }

export class Volume {
    static currentVolume = 0; // Em dB

    static up() {
        this.currentVolume += 6;
        this.currentVolume = Math.min(this.currentVolume, 12); // Máximo +12dB
        console.log(`Volume aumentado para: ${this.currentVolume}dB`);
    }

    static down() {
        this.currentVolume -= 6;
        this.currentVolume = Math.max(this.currentVolume, -60); // Mínimo -60dB
        console.log(`Volume diminuído para: ${this.currentVolume}dB`);
    }

    static double() {
        if (this.currentVolume < 0) {
            let absVolume = Math.abs(this.currentVolume);
            this.currentVolume += absVolume;
        }
        else if (this.currentVolume == 0) {
            this.currentVolume += 6;
        }
        else {
            this.currentVolume = Math.min(this.currentVolume * 2, 12);
        }
        console.log(`Volume dobrado para: ${this.currentVolume}dB`);
    }

    static default() {
        this.currentVolume = 0;
    }
    
    // Converter dB para gain (0-1) para Soundfont
    static getGainValue() {
        // Converter dB para linear (0-1)
        return Math.pow(10, this.currentVolume / 20);
    }

    static getCurrentVolume() {
        return this.currentVolume;
    }
}