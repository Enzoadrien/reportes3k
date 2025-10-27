const form = document.getElementById("forgotForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
e.preventDefault();
const correo = document.getElementById("correo").value;
msg.style.color = "";
msg.textContent = "Enviando correo...";

try {
    const res = await fetch("/api/password/forgot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo }),
    });

    const data = await res.json();
    msg.style.color = data.ok ? "green" : "red";
    msg.textContent = data.message || "Error al enviar el correo.";
} catch {
    msg.style.color = "red";
    msg.textContent = "❌ Error del servidor.";
}
});
