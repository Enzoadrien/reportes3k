document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  try {
    const res = await fetch("http://localhost:4000/api/auth/login", { // 👈 Usa la URL del backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
      credentials: "include", // 👈 Necesario para las cookies
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      console.log("✅ Login exitoso, redirigiendo...");
      window.location.href = "/index.html"; // 👈 va a tu frontend
    } else {
      alert(data.message || "❌ Credenciales inválidas");
    }
  } catch (err) {
    console.error("Error en login:", err);
    alert("⚠️ Error de conexión con el servidor");
  }
});

