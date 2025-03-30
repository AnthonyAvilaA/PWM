document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("input[type='email']");
    const passwordInput = document.querySelector("input[type='password']");
    const form = document.querySelector("form");

    function loadUsers() {
        return JSON.parse(localStorage.getItem("users")) || [];
    }
    
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

        const users = loadUsers();
        const user = users.find(u => u.email === emailInput.value);

        if (!user) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        // ⚠️ Asegúrate de comparar la contraseña correctamente
        if (user.password !== passwordInput.value) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        // Generar un session_id único (puede ser cualquier identificador o token que uses)
        const sessionId = generateSessionId(); // Esta es una función que podrías implementar

        // Guardar el session_id en localStorage
        localStorage.setItem('session_id', sessionId);
        
        alert("Inicio de sesión exitoso");
        window.location.href = "/templates/home/";
    });

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});

// Función para generar un session_id único (puedes usar un UUID o algo similar)
function generateSessionId() {
    // Puedes usar un UUID para generar un identificador único
    // Aquí se genera un simple valor basado en la fecha y un valor aleatorio
    return 'session_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000);
}