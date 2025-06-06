export class Volume { // fazer o indicador de volume alterar na página
    static currentVolume;

    static up(synth) {
        this.currentVolume += 6
        synth.volume.value = this.currentVolume;
    }

    static down(synth) {
        this.currentVolume -= 6;
        synth.volume.value = this.currentVolume;

    }

    static double(synth) { 
        if (this.currentVolume < 0) { // existe volume negativo (acho que devem existir solucoes melhores)
            let absVolume = Math.abs(this.currentVolume);
            this.currentVolume += absVolume;
        }
        else if (this.currentVolume == 0) { // se volume for zero (valor incial) dobrar iria continuar zero, entao aumenta 6
            this.currentVolume += 6
        }
        else {
            this.currentVolume = this.currentVolume * 2;
        }
        synth.volume.value = this.currentVolume;
    }

    static getCurrentVolume() { // na vdd nao ta sendo utilizado pq currentVolume é publico
        return this.currentVolume;
    }
}