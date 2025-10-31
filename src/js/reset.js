const form = document.getElementById("resetForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
e.preventDefault();
const password = document.getElementById("password").value;
const confirm = document.getElementById("confirm").value;

if (password !== confirm) {
    msg.style.color = "red";
    msg.textContent = "⚠️ Las contraseñas no coinciden.";
    return;
}

msg.textContent = "Procesando...";

try {
    const res = await fetch("/api/password/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nuevaContrasena: password }),
    });

    const data = await res.json();
    msg.style.color = data.ok ? "green" : "red";
    msg.textContent = data.message;
    if (data.ok) form.reset();
} catch {
    msg.style.color = "red";
    msg.textContent = "❌ Error del servidor.";
}
});
