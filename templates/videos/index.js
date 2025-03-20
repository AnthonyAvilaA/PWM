// Fetch the JSON data
fetch('/resources/json/videos.json')
    .then(response => response.json())
    .then(data => {
        const videos = data.data;

        // Load the main video
        const main_video = document.querySelector('.main-video');
        const main_video_info = videos[videos.length - 1];
        videos.pop();
        main_video.querySelector('.video-title').innerHTML = `${main_video_info.Title}`;
        main_video.querySelector('.video-author').innerHTML = `${main_video_info.author.username} \\ EE.UU.`;
        main_video.querySelector('.video-description').innerHTML = `${main_video_info.description}`;
        main_video.querySelector('.video-content').src = `${main_video_info.video_url}`;

        // Group videos by category
        const categories = {
            tecnología: [],
            política: [],
            otros: []
        };

        videos.forEach(video => {
            if (categories[video.category]) {
                categories[video.category].push(video);
            }
        });

        // Load videos into sub-categories
        Object.keys(categories).forEach(category => {
            const subCategory = document.querySelector(`.sub-category.${category}`);
            const videoSections = subCategory.querySelectorAll('.basic-video');
            const leftButton = subCategory.querySelector(`#${category}-left-button`);
            const rightButton = subCategory.querySelector(`#${category}-right-button`);

            let currentIndex = 0;

            // Function to load videos into the visible slots
            const loadVideos = () => {
                videoSections.forEach((section, index) => {
                    const video = categories[category][(currentIndex + index) % categories[category].length];
                    if (video) {
                        section.innerHTML = `
                            <div class="video">
                                <h3 class="video-title">${video.Title}</h3>
                                <iframe class="video-content" width="240" height="140" hspace="0" vspace="0" src="${video.video_url}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                                <p class="video-author">${video.author.username} / ${video.category}</p>
                                <p class="video-description">${video.description}</p>
                            </div>
                        `;
                    } else {
                        section.innerHTML = ''; // Clear if no video is available
                    }
                });
            };

            // Initialize the first set of videos
            loadVideos();

            // Add event listeners for navigation buttons
            leftButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + categories[category].length) % categories[category].length; // Move back and loop
                loadVideos();
            });

            rightButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % categories[category].length; // Move forward and loop
                loadVideos();
            });
        });
    })
    .catch(error => console.error('Error loading videos:', error));