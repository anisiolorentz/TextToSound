import { Volume } from "./Volume.js";

export class Interpreter {

    static currentInstrument;
    static audioContext;
    static currentNote;
    static currentOctave;
    static playbackQueue = [];
    static isPlaying = false;
    static currentBPM = 40;
    // le o caractere e devolve: - o instrumento
    //                           - a nota
    //vai ter que guardar a oitava atual para poder saber como aumentar ou diminuir
    
    static gmInstruments = { // trocar nomes para os numeros correspondentes do General MIDI
    'piano': 'acoustic_grand_piano',
    'guitarra': 'acoustic_guitar_nylon', 
    'violino': 'violin',
    'flauta': 'flute',
    'trompete': 'trumpet',
    'baixo': 'acoustic_bass',
    'bateria': 'synth_drum',
    'orgao': 'church_organ',
    'saxofone': 'alto_sax',
    'clarinete': 'clarinet'
};

    static async setInstrument(instrumentName) {
    if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await this.audioContext.resume(); // Necessário para alguns navegadores
    }
    
    const gmName = this.gmInstruments[instrumentName] || 'flute';
    
    try {
        this.currentInstrument = await Soundfont.instrument(this.audioContext, gmName);
        console.log(`Instrumento carregado: ${gmName}`);
        return this.currentInstrument;
    } catch (error) {
        console.error('Erro ao carregar instrumento:', error);
        return null;
    }
}

    static playNote(note, duration = 0.5, delay = 0) {
        if (this.currentInstrument) {
            const when = this.audioContext.currentTime + delay;
            const gain = Volume.getGainValue(); // Converter dB para gain
            
            this.currentInstrument.play(note, when, { 
                duration: duration,
                gain: gain 
            });
        }
    }
    
    static playSound(char) {
        if (char === "a") {
            this.playNote("A4");
        }

        if (char === "b") {
            this.setInstrument("piano"); // atualmente o ultimo instrumento tocado é o que fica para começar a proxima reprodução
            this.playNote("C4");
        }

        if (char === " ") {
            return "REST";
        }

        return null;
    }

    static async playText(text) {
        this.isPlaying = true;
        const beatDuration = 60 / this.currentBPM;
        let currentTime = 0;

        for (let i = 0; i < text.length; i++) {
            if (!this.isPlaying) {
                break;
            }

            const note = this.playSound(text[i]);

            if (note && note !== "REST") {
                this.playNote(note, beatDuration * 0.8, currentTime);
            }

            currentTime += beatDuration;

            await new Promise(resolve => setTimeout(resolve, beatDuration * 100));
        }

        this.isPlaying = false;
        console.log("Reproduction finished");
    }

    static setBPM(bpm) {
        this.currentBPM = bpm;
        console.log(`BPM definido para: ${bpm}`);
    }

    static stopPlaying() {
        this.isPlaying = false;
        console.log("Reprodution stopped.");
    }
}