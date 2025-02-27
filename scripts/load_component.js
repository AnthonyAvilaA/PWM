async function loadHTML(className, url) {
    const response = await fetch(url);
    const content = await response.text();
    
    // Seleccionar todos los elementos con la clase especificada
    const articles = document.querySelectorAll(`.${className}`);
    
    // Insertar el contenido en cada elemento
    articles.forEach(article => {
        article.innerHTML = content;
    });
}

// Llamar a la función para cargar el contenido en todos los elementos con la clase 'article'
loadHTML("article", "/components/article.html")
loadHTML("side_article", "/components/side_article.html")
loadHTML("live_headline", "/components/live_headline.html")
