async function loadHTML(id, url) {
    const response = await fetch(url);
    document.getElementById(id).innerHTML = await response.text();
}

loadHTML("header", "/components/header.html");
loadHTML("footer", "/components/footer.html");


fetch('/resources/json/categories.json')
    .then(response => response.json())
    .then(data => {
        const category_data = data.data;
        const categoryLinks = document.querySelectorAll('.categories ul li a, .short-size li a');
        
        // Create a map of category names to their documentIds
        const categoryMap = {};
        category_data.forEach(cat => {
            categoryMap[cat.name] = cat.documentId;
        });

        // Update each link with its corresponding category ID
        categoryLinks.forEach(link => {
            const categoryName = link.textContent;
            if (categoryMap[categoryName]) {
                link.href = `/templates/categories/index.html?category=${categoryMap[categoryName]}`;
            }
        });
    })
    .catch(error => {
        console.error('Error loading categories:', error);
    });