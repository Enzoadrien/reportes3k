const form = document.getElementById("forgotForm");
const forgotButton = form.querySelector(".button-primary");
const btnText = forgotButton.querySelector(".btn-text");
const spinner = forgotButton.querySelector(".spinner");

const errorBox = document.querySelector(".ms-error");
const errorText = errorBox.querySelector(".p-error");

const successView = document.getElementById("successView");
const correoEnviado = document.getElementById("correoEnviado");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const correo = document.getElementById("correo").value.trim();

    // Animación
    forgotButton.classList.add("loading");
    spinner.style.display = "inline-block";
    btnText.textContent = "Enviando...";
    errorBox.style.display = "none";

    try {
        const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
        });

        const data = await res.json();

        if (data.ok) {
        correoEnviado.innerHTML = `Hemos enviado un enlace de recuperación a <strong>${correo}</strong>`;
        form.style.display = "none";
        successView.style.display = "flex"; // muestra la vista de éxito
        } else {
        errorText.textContent = data.message || "Error al enviar el correo.";
        errorBox.style.display = "flex";
        }
    } catch {
        errorText.textContent = "Error del servidor. Inténtalo nuevamente.";
        errorBox.style.display = "flex";
    } finally {
        forgotButton.classList.remove("loading");
        spinner.style.display = "none";
        btnText.textContent = "Enviar enlace";
    }
});
