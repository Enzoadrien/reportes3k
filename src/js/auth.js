const loginForm = document.getElementById("loginForm");
const loginButton = loginForm.querySelector(".button-primary");
const btnText = loginButton.querySelector(".btn-text");
const spinner = loginButton.querySelector(".spinner");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  // Activar animación del botón
  loginButton.classList.add("loading");
  spinner.style.display = "inline-block";
  btnText.textContent = "Ingresando...";

  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
      credentials: "include", // necesario para cookies
    });

    const data = await res.json();

    if (res.ok && data.ok) {
      console.log("✅ Login exitoso, redirigiendo...");
      window.location.href = "/index.html"; // redirige a tu frontend
    } else {
      alert(data.message || "❌ Credenciales inválidas");
    }
  } catch (err) {
    console.error("Error en login:", err);
    alert("⚠️ Error de conexión con el servidor");
  } finally {
    // Restaurar el botón aunque haya error o éxito
    loginButton.classList.remove("loading");
    spinner.style.display = "none";
    btnText.textContent = "Ingresar";
  }
});
