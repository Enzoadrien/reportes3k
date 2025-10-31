const form = document.getElementById("resetForm");
const msg = document.getElementById("msg");

function showMsg(text, color = "black") {
    msg.textContent = text;
    msg.style.color = color;
}

// Extraer token de la URL (si lo envías como query string ?token=...)
const urlParams = new URLSearchParams(window.location.search);
const resetToken = urlParams.get("token");

if (!resetToken) {
    showMsg("❌ Token de restablecimiento no proporcionado.", "red");
    form.querySelector("button").disabled = true;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
        showMsg("⚠️ Las contraseñas no coinciden.", "red");
        return;
    }

    showMsg("Procesando...");

    try {
        const res = await fetch("/api/password/reset", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${resetToken}` // enviar token en header
            },
            body: JSON.stringify({ nuevaContrasena: password }),
        });

        const data = await res.json();
        showMsg(data.message || "Operación completada", data.ok ? "green" : "red");

        if (data.ok) form.reset();
    } catch (err) {
        console.error(err);
        showMsg("❌ Error del servidor.", "red");
    }
});
