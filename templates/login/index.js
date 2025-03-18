document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const form = document.querySelector("form");

    // Validación en tiempo real del email
    emailInput.addEventListener("input", function () {
        if (!validarEmail(emailInput.value)) {
            emailInput.setCustomValidity("Por favor, ingrese un email válido.");
        } 
        else {
            emailInput.setCustomValidity("");
        }
    });

    // Validación en tiempo real de la contraseña
    passwordInput.addEventListener("input", function () {
        if (passwordInput.value.length < 6) {
            passwordInput.setCustomValidity("La contraseña debe tener al menos 6 caracteres.");
        }
        else if (passwordInput.value.includes(" ")){
            passwordInput.setCustomValidity("La contraseña no puede tener espacios")
        }
        else {
            passwordInput.setCustomValidity("");
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío automático del formulario

        // Simulación de autenticación
        if (emailInput.value === "rubengc2120@gmail.com" && passwordInput.value === "123456") {
            window.location.href = "/templates/home/"; // Redirige a la página principal
        } else {
            alert("Correo o contraseña incorrectos.");
        }
    });

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});