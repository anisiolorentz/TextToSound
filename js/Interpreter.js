import { Volume } from "./Volume.js";

export class Interpreter {

    static currentInstrument;
    static audioContext;
    static currentNote;
    static currentOctave;
    // le o caractere e devolve: - o instrumento
    //                           - a nota
    //vai ter que guardar a oitava atual para poder saber como aumentar ou diminuir
    
    static gmInstruments = {
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

    static async loadInstrument(instrumentName) {
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

    static playNote(note, duration = 0.5) {
        if (this.currentInstrument) {
            const when = this.audioContext.currentTime;
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
            this.playNote("C4");
        }
    }
}