async function loadHTMLByClass(className, url) {
    const response = await fetch(url);
    const content = await response.text();
    const elements = document.getElementsByClassName(className);
    for (let element of elements) {
        element.innerHTML = content;
    }
}

loadHTMLByClass("basic-news", "/components/basic-news.html");

// Fetch the JSON data from categories
fetch('/resources/json/categories.json')
    .then(response => response.json())
    .then(data => {
        data = data.data; // Access the "data" array in the JSON

        // Load category name
        const category_id = new URLSearchParams(window.location.search).get("category");
        category_data = null;
        for (category of data) {
            if (category.documentId == category_id) {
                category_name = category.name;
                break;
            }
        }
        document.querySelector('h1').innerHTML = `${category_name}`;
    });

// Fetch the JSON data
fetch('/resources/json/news.json')
    .then(response => response.json())
    .then(data => {
        const news_data = data.data; // Access the "data" array in the JSON
        let category_news = [];

        // Filter articles by category
        for (let news of news_data) {
            if ([news.category1, news.category2, news.category3].includes(category_name.toLowerCase())) {
                category_news.push(news);
            }
        }

        // Function to update articles
        function fillArticles(selector, newsArray) {
            document.querySelectorAll(selector).forEach((news_article) => {
                if (newsArray.length > 0) {
                    let data = newsArray.pop(); // Remove the last item

                    let article_content = news_article.querySelector('.text-content');
                    article_content.querySelector('.title').innerHTML = `${data.Title}`;
                    article_content.querySelector('.extract').innerHTML = `${data.short_description}`;
                    article_content.querySelector('.read-more').href = `/templates/news/index.html?id=${data.documentId}`;

                    news_article.querySelector('.image-container img').src = `${data.image_url}`;
                }
            });
        }
        fillArticles('.article', category_news);
        fillArticles('.side_article', category_news);
    })
    .catch(error => {
        console.error('Error fetching news:', error);
    });

