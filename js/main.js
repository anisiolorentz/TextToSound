import { Interpreter } from "./Interpreter.js";

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

submitButton.addEventListener('click', async(event) => {
    event.preventDefault(); //evita que a pagina recarregue (o que impedia o som de tocar)
    if (Interpreter.isPlaying) {
        const result = Interpreter.togglePlayback();

        if (result === "paused") {
            submitButton.value = "RESUME";
        } else if (result === "resumed") {
            submitButton.value = "PAUSE";
        }
        return;
    }

    if (!Interpreter.currentInstrument) {
        await Interpreter.setInstrument("guitarra");
    }

    submitButton.value = "PAUSE";

    await Interpreter.playText(textInput.value);

    submitButton.value = "PLAY";
});