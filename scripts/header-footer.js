async function loadHTML(id, url) {
    const response = await fetch(url);
    document.getElementById(id).innerHTML = await response.text();
}

loadHTML("header", "/components/header.html");
loadHTML("footer", "/components/footer.html");