import { Volume } from "./Volume.js";

export class Interpreter {

    static audioContext;
    static currentInstrument;
    static currentNote;
    static currentOctave = 4;
    static playbackQueue = [];
    static isPlaying = false;
    static isPaused = false
    static currentBPM = 120;
    

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
    'clarinete': 'clarinet',
    '125': 'telephone_ring',
    };


    static charMapping = {
        'a': { type: 'note', value: 'A' },
        'A': { type: 'note', value: 'A' },
        'b': { type: 'note', value: 'B' },
        'B': { type: 'note', value: 'B' },
        'c': { type: 'note', value: 'C' },
        'C': { type: 'note', value: 'C' },
        'd': { type: 'note', value: 'D' },
        'D': { type: 'note', value: 'D' },
        'e': { type: 'note', value: 'E' },
        'E': { type: 'note', value: 'E' },
        'f': { type: 'note', value: 'F' },
        'F': { type: 'note', value: 'F' },
        'g': { type: 'note', value: 'G' },
        'G': { type: 'note', value: 'G' },
        ' ': { type: 'rest' },

        'i': { type: 'check' },
        'I': { type: 'check' },
        'o': { type: 'check' },
        'O': { type: 'check' },
        'u': { type: 'check' },
        'U': { type: 'check' },

        '+': { type: 'volume', value: 'double' },
        '-': { type: 'volume', value: 'default' },

        'R+': { type: 'octave', value: 'up' },
        'R-': { type: 'octave', value: 'down' },

        '?': { type: 'note', value: 'random' },

        '\n': { type: 'instrument', value: 'piano' },

        'BPM+': { type: 'bpm', value: 'increase' },
        'BPM-': { type: 'bpm', value: 'decrease' },
        ';': { type: 'bpm', value: 'random' },
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
            const gain = Volume.getCurrentVolume(); 
            
            this.currentInstrument.play(note, when, { 
                duration: duration,
                gain: gain 
            });
        }
    }


    static buildQueue(text) {
        this.currentOctave = 4; // inicia sempre com a oitava default 
        this.currentBPM = 120;

        for (let i = 0; i < text.length; i++) {
            let char = text[i];

            if (text[i] === "R") { // avalia se vai ser R+ ou R-
                if (text[i + 1] === "+") {
                    char = "R+";
                    i++;
                }
                else if (text[i + 1] === "-") {
                    char = "R-";
                    i++;
                }
            }

            if (text[i] === "B") {
                if (text [i + 1] === "P" && text[i + 2] === "M") {
                    if (text[i + 3] === "+") {
                        char = "BPM+";
                        i += 3;
                    }
                    else {
                        char = "BPM-";
                        i += 3;
                    }
                }
            }
            let command = this.charMapping[char];

            if (!command) {
                console.log("Char nao reconhecido");
                continue;
            }

            switch (command.type) {
                case 'instrument':
                    this.playbackQueue.push(command.value);
                    break;

                case 'note':
                    if (command.value === "random") {
                        const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                        this.currentNote = notes[Math.floor(Math.random() * 7)] + this.currentOctave;
                    } else {
                        this.currentNote = command.value + this.currentOctave; // se a nota nao é aleatoria (caso mais comum)
                    }
                    this.playbackQueue.push(this.currentNote);
                    break;

                case 'check':
                    if (i > 0) {
                        command = this.charMapping[text[i - 1]];
                        if (command && command.type === 'note') {
                            this.playbackQueue.push(this.currentNote);
                        } else {
                            this.playbackQueue.push('125'); // nao entendi se é pra tocar uma vez o som ou trocar o instrumento
                        }
                    }
                    break;

                case 'octave':
                    if (command.value === "up") {
                        if (this.currentOctave < 7) {
                            this.currentOctave++;
                        }
                    } else if (this.currentOctave > 0) {
                        this.currentOctave--;
                    }
                    break;

                case 'volume':
                    if (command.value === "default") {
                        this.playbackQueue.push("vol-default");
                    } else {
                        this.playbackQueue.push("vol-double");
                    }
                    break;

                case 'bpm':
                    if (command.value === "increase") {
                        this.playbackQueue.push("bpm-up");
                    } 
                    else if (command.value === "decrease") {
                        this.playbackQueue.push("bpm-down");
                    } else {
                        this.playbackQueue.push("bpm-random");
                    }
                    break;

                case 'rest':
                    this.playbackQueue.push("REST");
                    break;
            }
        }
        return this.playbackQueue;
    }


    static async playQueue() {
        if (this.playbackQueue.length === 0) {
            console.log("Fila vazia");
            return;
        }

        this.isPlaying = true;
        this.isPaused = false;
        Volume.default();

        console.log(`Tocando ${this.playbackQueue.length} notas:`, this.playbackQueue);

        for (let i = 0; i < this.playbackQueue.length; i++) {
            const beatDuration = 60 / this.currentBPM;
            
            while (this.isPaused && this.isPlaying) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (!this.isPlaying) {
                break;
            }

            const item = this.playbackQueue[i];
            document.querySelector(".note-display").innerHTML = item;

            if (item === 'vol-default') {
                Volume.default();
                continue;
            }

            if (item === 'vol-double') {
                Volume.double();
                continue;
            }

            if (item === 'bpm-up') {
                this.setBPM(this.currentBPM + 60); // enunciado manda +80, mas pra mim +60 faz mais sentido
                continue;
            }

            if (item === 'bpm-down') {
                this.setBPM(this.currentBPM - 60);
                continue;
            }

            if (item === 'bpm-random') {
                this.setBPM(Math.floor(Math.random() * 240));
                continue;
            }

            if (item.length > 4) { // se tem mais que 4 letras, é instrumento (PENSAR NUMA MANEIRA MELHOR PRA ISSO)
                await this.setInstrument(item);
                continue;
            }

            if (item !== "REST") {
                this.playNote(item, beatDuration * 0.8);

                const noteDisplay = document.querySelector(".note-display");
                noteDisplay.classList.add('pulse');

                setTimeout(() => {
                    noteDisplay.classList.remove('pulse');
                }, 300);
            }
            
            document.querySelector(".bpm-value").innerHTML = this.currentBPM;
            await new Promise(resolve => setTimeout(resolve, beatDuration * 1000));
        }

        this.isPlaying = false;
        this.isPaused = false;
        console.log("Reproduction finished");
    }


    static pausePlayback() {
        if (this.isPlaying && !this.isPaused) {
            this.isPaused = true;
            console.log("Playback paused");
            document.querySelector(".note-display").innerHTML = "Paused"
            return "paused";
        }

        return "not_playing";
    }


    static resumePlayback() {
        if (this.isPlaying && this.isPaused) {
            this.isPaused = false;
            console.log("Playback resumed");
            return "resumed";
        }

        return "not_paused";
    }


    static togglePlayback() {
        if (!this.isPlaying) {
            return "not_playing";
        }

        if (this.isPaused) {
            return this.resumePlayback();
        } else {
            return this.pausePlayback();
        }
    }


    static clearQueue() {
        this.playbackQueue = [];
    }


    static async playText(text) { // metodo principal
        Volume.updateVolumeDisplay();

        if (!this.currentInstrument) {
            await this.setInstrument("guitarra");
        }

        this.buildQueue(text);
        await this.playQueue();
        this.clearQueue();

        document.querySelector(".note-display").innerHTML = ""
        await this.setInstrument("guitarra"); // reseta para o instrumento padrao para uma proxima execucao (da pra mudar)
    }


    static setBPM(bpm) {
        if (bpm >= 240) {
            this.currentBPM = 240;
        } else {
            this.currentBPM = bpm;
        }

        console.log(`BPM definido para: ${this.currentBPM}`);
    }
}