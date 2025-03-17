// Fetch the JSON data
fetch('/resources/json/news.json')
    .then(response => response.json())
    .then(data => {
        const news_data = data.data; // Access the "data" array in the JSON
        const top_stories_section = document.querySelector('.top-stories');
        const suggested_content_section = document.querySelector('#suggested-content');

        len_data = news_data.length;

        for (news_article of top_stories_section.querySelectorAll('.article')) {
            data = news_data[news_data.length - 1];

            article_content = news_article.querySelector('.article-text-content');
            article_content.querySelector('.title').innerHTML = `${data.Title}`;
            article_content.querySelector('.extract').innerHTML = `${data.short_description}`;
            article_content.querySelector('.read-more').href = `/templates/news/index.html?id=${data.documentId}`;

            image_container = news_article.querySelector('.image-container img').src = `${data.image_url}`;

            news_data.pop();
            len_data--;
            if (len_data == 0) break;
        }

        for (news_article of suggested_content_section.querySelectorAll('.side_article')) {
            data = news_data[news_data.length - 1];

            article_content = news_article.querySelector('.side-article .side-text-content');
            article_content.querySelector('.title').innerHTML = `${data.Title}`;
            article_content.querySelector('.extract').innerHTML = `${data.short_description}`;
            article_content.querySelector('.read-more').href = `/templates/news/index.html?id=${data.documentId}`;

            image_container = news_article.querySelector('.image-container img').src = `${data.image_url}`;

            news_data.pop();
            len_data--;
            if (len_data == 0) break;
        }

    })
    .catch(error => console.error('Error loading news:', error));