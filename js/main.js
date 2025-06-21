import { Interpreter } from "./Interpreter.js";
import { MidiExporter } from "./MidiExporter.js";

const textInput = document.querySelector(".text-input");
const submitButton = document.querySelector('[type="submit"]');
const fileInput = document.querySelector(".upload-file-input");
const saveFile = document.querySelector(".save-file-btn");

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

submitButton.addEventListener('click', async(event) => {
    event.preventDefault(); //evita que a pagina recarregue (o que impedia o som de tocar)
    
    const text = textInput.value.trim();

    if (!text) {
        return;
    }

    if (Interpreter.isPlaying) {
        const result = Interpreter.togglePlayback();

        if (result === "paused") {
            submitButton.value = "RESUME";
        } else if (result === "resumed") {
            submitButton.value = "PAUSE";
        }
        return;
    }

    submitButton.value = "PAUSE";

    await Interpreter.playText(text);

    submitButton.value = "PLAY";
});

saveFile.addEventListener('click', () => {
    const text = textInput.value.trim();
    
    if (!text) {
        alert('You need to type something!');
        return;
    }
    
    if (typeof MidiWriter === 'undefined') {
        alert('Biblioteca MIDI não carregada. Recarregue a página.');
        return;
    }

    // Gerar fila sem tocar
    Interpreter.buildQueue(text);
    
    // Exportar para MIDI
    console.log('Download');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    MidiExporter.downloadMidi(Interpreter.playbackQueue, `music-${timestamp}.mid`);
})