let datamario = {
    category_name: null,
};

async function loadHTMLByClass(className, url) {
    const response = await fetch(url);
    const content = await response.text();
    const elements = document.getElementsByClassName(className);
    for (let element of elements) {
        element.innerHTML = content;
    }
}

// Main function to coordinate all fetches
async function initializePage() {    
    // Load categories and set category name
    try {
        const categoryResponse = await fetch('/resources/json/categories.json');
        const categoryData = await categoryResponse.json();
        const categories = categoryData.data;
        
        const category_id = new URLSearchParams(window.location.search).get("category");
        for (const category of categories) {
            if (category.documentId == category_id) {
                datamario.category_name = category.name;
                break;
            }
        }
        
        // Update the page title with category name
        document.querySelector('h1').innerHTML = datamario.category_name;
        
        // Now that we have the category name, load the news
        const newsResponse = await fetch('/resources/json/news.json');
        const newsData = await newsResponse.json();
        const news_data = newsData.data;
        let category_news = [];
        
        // Filter articles by category
        for (let news of news_data) {
            if ([news.category1, news.category2, news.category3].includes(datamario.category_name.toLowerCase())) {
                category_news.push(news);
            }
        }
        
        // Function to update articles
        function fillArticles(selector, newsArray) {
            document.querySelectorAll(selector).forEach((news_article) => {
                if (newsArray.length > 0) {
                    let data = newsArray.pop();
                    
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
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Start the page initialization
initializePage();