// Fetch the JSON data
fetch('/resources/json/news.json')
    .then(response => response.json())
    .then(data => {
        data = data.data; // Access the "data" array in the JSON

        // Load main content
        const news_id = new URLSearchParams(window.location.search).get("id");
        let news_data = null;
        let author_data = null;
        for (let news of data) {
            if (news.documentId == news_id) {
                news_data = news;
                author_data = news.user;
                break;
            }
        }

        document.querySelector('#title').innerHTML = `${news_data.Title}`;
        document.querySelector('#author').innerHTML = `${news_data.user.username} \\ EE.UU.`;
        document.querySelector('#news-image').src = `${news_data.image_url}`;

        // Load comments
        let comments_loaded = 0;
        let comments = [...news_data.comments]; // Clone the comments array

        document.querySelector("#number-of-comments p").innerHTML = `Hay ${comments.length} comentarios`;

        fetch('/resources/json/comments.json')
            .then(response => response.json())
            .then(comments_data => {
                comments_data = comments_data.data; // Access the "data" array in the JSON

                const loadComment = () => {
                    if (comments.length === 0) {
                        document.querySelector('#more_info').style.display = 'none'; // Hide button
                        return;
                    }

                    const comment_id = comments.pop().documentId;
                    const comment_data = comments_data.find(c => c.documentId === comment_id);

                    if (comment_data) {
                        const publicaciones = document.querySelector('.publicaciones');

                        // Create a new comment element
                        const newComment = document.createElement('div');
                        newComment.classList.add('publicacion');
                        newComment.innerHTML = `
                            <span class="linea-horizontal"></span>
                            <div class="author">
                                <img src="/resources/images/user.png" height="40" width="40" alt="user">
                                <h3>${comment_data.users_permissions_user.username} ${comment_data.publishedAt.substring(0, 10)}</h3>
                            </div>
                            <p>${comment_data.Content}</p>
                        `;

                        publicaciones.appendChild(newComment);
                        comments_loaded++;
                    }

                    if (comments.length === 0) {
                        document.querySelector('#more_info').style.display = 'none';
                        return;
                    }
                };

                // Load initial comments
                for (let i = 0; i < 2 && comments.length > 0; i++) {
                    loadComment();
                }

                // Add event listener to the button
                document.querySelector('#more_info').addEventListener('click', loadComment);
            })
            .catch(error => console.error('Error loading comments:', error));
    })
    .catch(error => console.error('Error loading news:', error));