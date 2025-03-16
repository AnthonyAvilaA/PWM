// Fetch the JSON data
fetch('/resources/json/news.json')
    .then(response => response.json())
    .then(data => {
        const news_data = data.data; // Access the "data" array in the JSON
        const top_stories_section = document.querySelector('.top-stories');
        const suggested_content_section = document.querySelector('#suggested-content');

    len_data = news_data.length;
    
    while (len_data > 0) {
        for (news_article of top_stories_section.querySelectorAll('.article')) {
            data = news_data[news_data.length-1];
            
            article_content = news_article.querySelector('.article-text-content');
            article_content.querySelector('.title').innerHTML = `${data.Title}`;
            article_content.querySelector('.extract').innerHTML = `${data.short_description}`;            

            image_container = news_article.querySelector('.image-container img').src = `${data.image_url}`;
            
            news_data.pop();
            len_data--;
            if (len_data == 0) break;
        }

        for (news_article of suggested_content_section.querySelectorAll('.side_article')) {
            data = news_data[news_data.length-1];
            
            article_content = news_article.querySelector('.side-article .side-text-content');
            article_content.querySelector('.title').innerHTML = `${data.Title}`;
            article_content.querySelector('.extract').innerHTML = `${data.short_description}`;            

            image_container = news_article.querySelector('.image-container img').src = `${data.image_url}`;
            
            news_data.pop();
            len_data--;
            if (len_data == 0) break;
        }
    }
    
})
.catch(error => console.error('Error loading news:', error));

/*
// Loop through the news items
    newsData.forEach((newsItem, index) => {
        // Create a container for the news article
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        // Add content to the article
        articleDiv.innerHTML = `
            <img src="${newsItem.image_url}" alt="${newsItem.Title}" />
            <h2>${newsItem.Title}</h2>
            <p>${newsItem.short_description}</p>
        `;

        // Append to the appropriate section
        if (index < 3) {
            // Add to "Top Stories" (first 3 items)
            topStoriesSection.appendChild(articleDiv);
        } else {
            // Add to "Suggested Content" (remaining items)
            const sideArticleDiv = document.createElement('div');
            sideArticleDiv.classList.add('side_article');
            sideArticleDiv.innerHTML = `
            <img src="${newsItem.image_url}" alt="${newsItem.Title}" />
            <h3>${newsItem.Title}</h3>
            `;
            suggestedContentSection.appendChild(sideArticleDiv);
        }
    });
*/