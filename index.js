const textInput = document.querySelector(".text-input");
const submitButton = document.querySelector('[type="submit"]');

submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    const textoDigitado = textInput.value;
    console.log(textoDigitado);
});