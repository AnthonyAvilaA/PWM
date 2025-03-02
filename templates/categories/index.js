async function loadHTMLByClass(className, url) {
    const response = await fetch(url);
    const content = await response.text();
    const elements = document.getElementsByClassName(className);
    for (let element of elements) {
        element.innerHTML = content;
    }
}

loadHTMLByClass("basic-news", "/components/basic-news.html");