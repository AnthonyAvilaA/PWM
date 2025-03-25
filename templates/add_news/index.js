document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.querySelector("#title");
    const imageInput = document.querySelector("img");
    const placeInput = document.querySelector("#place");
    const descriptionInput = document.querySelector("#description")
    const contentInput = document.querySelectorAll("content");
    const categoryInput = document.querySelector("#category");
    const form = document.querySelector("form");
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
    const regex_2 = /^[A-Za-zÀ-ÖØ-öø-ÿ\s.,]+$/;

    titleInput.addEventListener("input", function () {

        if (!regex.test(titleInput.value)) {
            titleInput.setCustomValidity("No puede contener símbolos.");
        } else if (titleInput.value.length == 50) {
            titleInput.setCustomValidity("No puede contener mas de 50 caracteres")
        } else {
            titleInput.setCustomValidity("");
        }
    });

    placeInput.addEventListener("input", function () {
        const countries = [
            "albania", "alemania", "andorra", "armenia", "austria", "azerbaiyán",
            "bélgica", "bosnia y herzegovina", "bulgaria", "chipre", "croacia", "dinamarca",
            "eslovaquia", "eslovenia", "españa", "estonia", "finlandia", "francia",
            "georgia", "grecia", "hungría", "irlanda", "islandia", "italia", "kazajistán",
            "kosovo", "letonia", "liechtenstein", "lituania", "luxemburgo", "malta",
            "moldavia", "mónaco", "montenegro", "noruega", "países bajos", "polonia",
            "portugal", "reino unido", "república checa", "rumanía", "rusia", "san marino",
            "serbia", "suecia", "suiza", "tailandia", "turquía", "ucrania", "vaticano", "otros"
        ];
        const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

        if (!countries.includes(placeInput.value.trim().toLowerCase())) {
            placeInput.setCustomValidity("El país debe ser europeo y escribirse correctamente. Ej.: Alemania u otros");
        } else if (!regex.test(placeInput.value)) {
            placeInput.setCustomValidity("No puede contener símbolos");
        } else {
            placeInput.setCustomValidity("");
        }
    });

    contentInput.addEventListener("input", function(){
        if (!regex_2.test(contentInput.value)) {
            contentInput.setCustomValidity("No puede contener símbolos.");
        } else if (contentInput.value.length > 1999) {
            contentInputInput.setCustomValidity("No puede contener más de 2000 caracteres.");
        } else {
            contentInputInput.setCustomValidity("");
        }
    });

    descriptionInput.addEventListener("input", function (){
    
        if (!regex_2.test(descriptionInput.value)) {
            descriptionInput.setCustomValidity("No puede contener símbolos.");
        } else if (descriptionInput.value.length > 249) {
            descriptionInput.setCustomValidity("No puede contener más de 250 caracteres.");
        } else {
            descriptionInput.setCustomValidity("");
        }
    });

    categoryInput.addEventListener("input", function() {
        if (categoryInput.value == ""){
            categoryInput.setCustomValidity("Debes seleccionar una categoria");
        } else{
            categoryInput.setCustomValidity("");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        form.submit();
        window.location.href = "/templates/home/";
    });
});