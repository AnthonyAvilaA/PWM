async function loadHTML(id, url) {
    const response = await fetch(url);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;
}

loadHTML("article", "components/article.html");