import { Volume } from "./Volume.js";

export class Interpreter {

    static currentInstrument;
    static audioContext;
    static currentNote;
    static currentOctave;
    static playbackQueue = [];
    static isPlaying = false;
    static currentBPM = 60;
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


    static buildQueue(text) {
        for (let char of text) {
            if (char === "a") {
                this.playbackQueue.push("guitarra");
                this.playbackQueue.push("A4");
            }
            else if (char === "b") {
                this.playbackQueue.push("piano");
                this.playbackQueue.push("C4");
            }
            else if (char === " ") {
                this.playbackQueue.push("REST");
            }
        }
        return this.playbackQueue;
    }


    static async playQueue(text) {
        if (this.playbackQueue.length === 0) {
            console.log("Fila vazia");
            return;
        }

        this.isPlaying = true;
        const beatDuration = 60 / this.currentBPM;

        console.log(`Tocando ${this.playbackQueue.length} notas:`, this.playbackQueue);

        for (let item of this.playbackQueue) {
            if (!this.isPlaying) {
                break;
            }

            if (item.length > 2) {
                await this.setInstrument(item);
            }

            else if (item !== "REST") {
                this.playNote(item, beatDuration * 0.8);
            }
            
            await new Promise(resolve => setTimeout(resolve, beatDuration * 100));
        }

        this.isPlaying = false;
        console.log("Reproduction finished");
    }


    static clearQueue() {
        this.playbackQueue = [];
    }


    static async playText(text) { // metodo principal
        this.buildQueue(text);
        await this.playQueue();
        this.clearQueue();
    }


    static setBPM(bpm) {
        if (bpm >= 240) {
            this.currentBPM = 240;
        }
        
        this.currentBPM = bpm;

        console.log(`BPM definido para: ${bpm}`);
    }


    static stopPlaying() {
        this.isPlaying = false;
        console.log("Reprodution stopped.");
    }
}