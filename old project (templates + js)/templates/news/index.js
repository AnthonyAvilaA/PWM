// Fetch the JSON data
fetch('/resources/json/news.json')
    .then(response => response.json())
    .then(data => {
        data = data.data; // Access the "data" array in the JSON
        const principal_news_html = document.querySelector('.principal_news');

        // Load main content
        const news_id = new URLSearchParams(window.location.search).get("id");
        news_data = null;
        author_data = null;
        for (news of data) {
            if (news.documentId == news_id) {
                news_data = news;
                author_data = news.user;
                break;
            }
        }
        news_content = "";
        for (content of news_data.Content) {
            paragraph = content.children[0].text
            if (paragraph == "") continue;
            news_content += `<p>${paragraph}</p>`;
        }

        principal_news_html.querySelector('h1').innerHTML = `${news_data.Title}`;
        principal_news_html.querySelector('img').src = `${news_data.image_url}`;

        const author_html = document.querySelector('.author-info')
        author_html.querySelector('h4').innerHTML = `${author_data.name} \ EE.UU.`;
        author_html.querySelector('p').innerHTML = `Actualizado - ${news_data.updatedAt.substring(0, 10)} ${news_data.updatedAt.substring(11, 19)}`;

        principal_news_html.querySelector('.content').innerHTML = news_content;

        // load comments
        document.querySelector('#news-forum').href = `/templates/forum/index.html?id=${news_id}`;

        comments = news_data.comments;
        fetch('/resources/json/comments.json')
            .then(response => response.json())
            .then(comments_data => {
                comments_data = comments_data.data; // Access the "data" array in the JSON
                for (comment of document.querySelectorAll(".comment")) {
                    comment_id = comments[comments.length - 1].documentId;
                    for (comment_data of comments_data) {
                        if (comment_data.documentId == comment_id) {
                            comment.querySelector('h3').innerHTML =  `${comment_data.users_permissions_user.username} ${comment_data.publishedAt.substring(0, 10)}`;
                            comment.querySelector('p').innerHTML = comment_data.Content;
                        }
                    }

                    comments.pop();
                    if (comments.length == 0) break;
                }
            }
            )
            .catch(error => console.error('Error loading news:', error));

        // Load related news
        len_data = data.length;
        related = document.querySelectorAll('.related');
        for (news of related) {
            news_data = data[data.length - 1];
            if (news_data.documentId == news_id) {
                data.pop();
                len_data--;
                if (len_data == 0) break;
                news_data = data[data.length - 1];
            }
            news.querySelector('h3').innerHTML = `${news_data.Title}`;
            news.querySelector('img').src = `${news_data.image_url}`;
            news.querySelector('p').innerHTML = `<a href="/templates/news/index.html?id=${news_data.documentId}">${news_data.short_description}<a>`;

            data.pop();
            len_data--;
            if (len_data == 0) break;
        };

    })
    .catch(error => console.error('Error loading news:', error));
