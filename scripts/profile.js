document.getElementById("options").addEventListener("click", function() {
    show(".options", "flex");
    hide(".activity");
});

document.getElementById("activity").addEventListener("click", function() {
    show(".activity", "block");    
    hide(".options");
});

document.getElementById("activity").addEventListener("click", function() {
    show(".activity", "block");    
    hide(".options");
});

document.getElementById("edit-profile").addEventListener("click", function() {
    show(".edit-profile", "flex");    
    hide(".interface-navigation");
});

document.getElementById("interface-navigation").addEventListener("click", function() {
    hide(".edit-profile");
    show(".interface-navigation", "flex");    
});

function show(elementClass, displayType) {
    document.querySelectorAll(elementClass).forEach(element => {
        element.style.display = displayType;
    });
} 


function hide(elementClass) {
    document.querySelectorAll(elementClass).forEach(element => {
        element.style.display = "none";
    });
} 