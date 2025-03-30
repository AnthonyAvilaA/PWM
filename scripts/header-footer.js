// Function to load HTML components
async function loadHTML(id, url) {
    const response = await fetch(url);
    document.getElementById(id).innerHTML = await response.text();
}

// Check session state and update UI accordingly
function checkSession() {
    const session_id = localStorage.getItem('session_id');
    
    if (session_id) { // If session exists
        // Hide login and register buttons
        const loginRegisterButtons = document.getElementsByClassName('login-register');
        for (let button of loginRegisterButtons) {
            button.style.visibility = 'hidden';
        }

        // Hide login and register links in burger menu
        const loginRegisterLinks = document.querySelectorAll('#burger-login, #burger-register');
        loginRegisterLinks.forEach(link => {
            link.style.display = 'none'; // Hides the links completely
        });
        
        // Show logout button if session is active
        const logoutButtons = document.querySelectorAll('.logout');
        for (let button of logoutButtons) {
            button.style.display = 'block';
        }
    } else {
        // Hide logout button if no session
        const logoutButtons = document.querySelectorAll('.logout');
        for (let button of logoutButtons) {
            button.style.display = 'none';
        }
    }
}

// Logout function: clears the session and redirects to the login page
function logout() {
    // Clear session from localStorage
    localStorage.removeItem('session_id');
    
    // Redirect to login page
    window.location.href = '/templates/login/index.html'; // Redirect to login page after logout
}

// Load components like header and footer
loadHTML("header", "/components/header.html");
loadHTML("footer", "/components/footer.html").then(() => {
    checkSession(); // Run session check when the page loads
});

// Fetch categories (this part seems fine, no changes needed)
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
