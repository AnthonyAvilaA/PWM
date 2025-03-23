document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#re-password");
    const userName = document.querySelector("input[type='text']");
    const form = document.querySelector("form");

    emailInput.addEventListener("input", async function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { correoDuplicado } = await emailVerify(emailInput.value, userName.value); // Corregido aquí
    
        if (!emailRegex.test(emailInput.value)) {
            emailInput.setCustomValidity("Por favor, ingrese un email válido.");
        } else if (correoDuplicado) {
            emailInput.setCustomValidity("Este correo ya está registrado.");
        } else {
            emailInput.setCustomValidity("");
        }
        emailInput.reportValidity();
    });

    async function emailVerify(email,username) {
        try {
            const response = await fetch("/resources/json/users.json");
            const usuarios = await response.json();

            const nombreDuplicado = usuarios.some(user => user.username === username);
            const correoDuplicado = usuarios.some(user => user.email === email);

            return {nombreDuplicado,correoDuplicado};
        } catch (error) {
            console.error("Error al cargar los usuarios:", error);
            return {nombreDuplicado:false, correoDuplicado:false};
        }
    }

    passwordInput.addEventListener("input", function () {
        if (passwordInput.value.length < 6) {
            passwordInput.setCustomValidity("La contraseña debe tener al menos 6 caracteres.");
        } else if (passwordInput.value.includes(" ")) {
            passwordInput.setCustomValidity("La contraseña no puede tener espacios.");
        } else {
            passwordInput.setCustomValidity("");
        }
    });

    confirmPasswordInput.addEventListener("input", function () {
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden.");
        } else {
            confirmPasswordInput.setCustomValidity("");
        }
    });

    userName.addEventListener("input", async function () {
        const regex = /^[a-zA-Z_]+$/;
        const { nombreDuplicado } = await emailVerify(emailInput.value, userName.value);
        if (userName.value.length < 4) {
            userName.setCustomValidity("El nombre de usuario debe tener al menos 4 caracteres.");
        } else if (userName.value.includes(" ")) {
            userName.setCustomValidity("El nombre de usuario no puede contener espacios.");
        } else if (!regex.test(userName.value)) {
            userName.setCustomValidity("Solo puede contener letras y guiones bajos (_).");
        } else if (nombreDuplicado){
            userName.setCustomValidity("El nombre de usuario ya esta siendo usado");
        } else {
            userName.setCustomValidity("");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        form.submit();
        window.location.href = "/templates/home/";
   });
});