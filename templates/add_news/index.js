document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.querySelector("#title");
    const urlInput = document.querySelector("#url");
    const placeInput = document.querySelector("#place");
    const descriptionInput = document.querySelector("#description")
    const contentInput = document.querySelector("#content");
    const categoryInput = document.querySelector("#category");
    const form = document.querySelector("form");
    const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
    const regex_2 = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,:!?'"()\n]+$/;

    function loadNews() {
        const news = JSON.parse(localStorage.getItem("news")) || [];
        return news;
    }

    function saveNews(news) {
        localStorage.setItem("news", JSON.stringify(news));
    }

    async function TitleVerify(title) {
        const noticias = loadNews();
        return noticias.some(news => news.Title.toLowerCase() === title.toLowerCase());
    }

    titleInput.addEventListener("input", async function () {
        const DuplicateTitle = await TitleVerify(titleInput);
        if(DuplicateTitle){
            titleInput.setCustomValidity("El titulo ya ha sido usado");
        } else if (!regex.test(titleInput.value)) {
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
            contentInput.setCustomValidity("No puede contener más de 2000 caracteres.");
        } else {
            contentInput.setCustomValidity("");
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
        
        const news = loadNews();

        const newNews = {
            id: news.length + 1,
            documentId: crypto.randomUUID(),
            Title: titleInput.value,
            Content: [{ type: "text", text: contentInput.value }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
            short_description: descriptionInput.value,
            category1: categoryInput.value,
            category2: null,
            category3: null,
            image_url: urlInput.value,
        }

        news.push(newNews);
        saveNews(news);
    
        alert("Su noticia ha sido agregada");
    
        // Redirecciona a otra página
        window.location.href = "/templates/profile/";
    });
});