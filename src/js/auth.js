
document.getElementById("loginForm").addEventListener("submit", async (e) => {
e.preventDefault();

const correo = document.getElementById("correo").value.trim();
const contrasena = document.getElementById("contrasena").value.trim();

try {
    const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
    credentials: "include" // ⚠️ Necesario para enviar/recibir cookies
    });

    const data = await res.json();

    if (res.ok && data.ok) {
    alert("✅ Login exitoso");
    // Redirigir a la página principal
    window.location.href = "/index.html";
    } else {
    alert(data.message || "❌ Credenciales inválidas");
    }
} catch (err) {
    console.error("Error en login:", err);
    alert("⚠️ Error de conexión con el servidor");
}
});
