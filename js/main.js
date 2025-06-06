import { Volume } from "./Volume.js";

const textInput = document.querySelector(".text-input");
const submitButton = document.querySelector('[type="submit"]');

let synth; // objeto synth gera os sons da biblioteca Tone.js

submitButton.addEventListener('click', async(event) => {
    event.preventDefault(); //evita que a pagina recarregue (o que impedia o som de tocar)

    await Tone.start();

    if (!synth) {
        synth = new Tone.Synth().toDestination();
        Volume.currentVolume = synth.volume.value; // volume é inicializado no zero (nao significa mudo, é só o valor "neutro")
    }

    // esses ifs sao só pra testar o som e o volume

    if (textInput.value == "a") {
        Volume.up(synth);
        synth.triggerAttackRelease("C4", "8n");
    }
    
    if (textInput.value == "b") {
        Volume.down(synth);
        synth.triggerAttackRelease("C4", "8n");
    }

    if (textInput.value == "c") {
        console.log(Volume.currentVolume);
        synth.triggerAttackRelease("C4", "8n");
    }

    if (textInput.value == "d") { 
        console.log(Volume.currentVolume);
        Volume.double(synth);
        synth.triggerAttackRelease("C4", "8n");
    }
});

// submitButton.addEventListener("click", function(e) {
//     console.log(textInput.value);
// })