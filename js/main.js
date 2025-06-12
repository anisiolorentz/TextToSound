import { Volume } from "./Volume.js";

const textInput = document.querySelector(".text-input");
const submitButton = document.querySelector('[type="submit"]');
const fileInput = document.querySelector(".upload-file-input");

fileInput.addEventListener("change", () => { // funcao que lê o arquivo txt entrado e coloca na textarea
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        const text = event.target.result;
        textInput.value = text; // coloca o conteudo na textarea
    };

    reader.readAsText(file);
});

// let synth; // objeto synth gera os sons da biblioteca Tone.js
let currentInstrument;
let audioContext;

const gmInstruments = {
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

async function loadInstrument(instrumentName) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.resume(); // Necessário para alguns navegadores
    }
    
    const gmName = gmInstruments[instrumentName] || 'flute';
    
    try {
        currentInstrument = await Soundfont.instrument(audioContext, gmName);
        console.log(`Instrumento carregado: ${gmName}`);
        return currentInstrument;
    } catch (error) {
        console.error('Erro ao carregar instrumento:', error);
        return null;
    }
}

function playNote(note, duration = 0.5) {
    if (currentInstrument) {
        const when = audioContext.currentTime;
        const gain = Volume.getGainValue(); // Converter dB para gain
        
        currentInstrument.play(note, when, { 
            duration: duration,
            gain: gain 
        });
    }
}

submitButton.addEventListener('click', async(event) => {
    event.preventDefault(); //evita que a pagina recarregue (o que impedia o som de tocar)

    if (!currentInstrument) {
        await loadInstrument('guitarra');
        // Volume.currentVolume = 0; // Volume inicial
    }

    // Trocar instrumentos
    if (textInput.value == "piano") {
        await loadInstrument('piano');
        playNote('C4');
    }

    if (textInput.value == "guitarra") {
        await loadInstrument('guitarra');
        playNote('A4');
    }

    if (textInput.value == "violino") {
        await loadInstrument('violino');
        playNote('C4');
    }

    if (textInput.value == "flauta") {
        await loadInstrument('flauta');
        console.log(currentInstrument);
        playNote('C4');
    }

    if (textInput.value == "bandoneon") {
        await loadInstrument('bandoneon');
        playNote('C4');
        console.log(currentInstrument);
    }

    if (textInput.value == "baixo") {
        await loadInstrument('baixo');
        playNote('C2'); // Baixo uma oitava abaixo
    }

    if (textInput.value == "bateria") {
        await loadInstrument('bateria');
        playNote('C4');
    }
});
    // esses ifs sao só pra testar o som e o volume

//     if (textInput.value == "a") {
//         Volume.up(synth);
//         synth.play("A4");
//     }
    
//     if (textInput.value == "b") {
//         Volume.down(synth);
//         synth.play("C4");
//     }

//     if (textInput.value == "c") {
//         console.log(Volume.currentVolume);
//         synth.play("C4", "8n");
//     }

//     if (textInput.value == "d") { 
//         console.log(Volume.currentVolume);
//         Volume.double(synth);
//         synth.play("C4", "8n");
//     }
// });