const loginForm = document.getElementById("loginForm");
const loginButton = loginForm.querySelector(".button-primary");
const btnText = loginButton.querySelector(".btn-text");
const spinner = loginButton.querySelector(".spinner");
// 🔹 Elementos del mensaje de error
const errorBox = document.querySelector(".ms-error"); 
const errorText = errorBox.querySelector(".p-error"); 

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  // Ocultar error previo
  errorBox.style.display = "none";

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
      console.log("Login exitoso, redirigiendo...");
      window.location.href = "/index.html";
    } else {
      errorText.textContent = data.message || "Credenciales inválidas, intenta de nuevo.";
      errorBox.style.display = "flex"; // mostrar el div
    }
  } catch (err) {
    console.error("Error en login:", err);
    errorText.textContent = "Error de conexión con el servidor";
    errorBox.style.display = "flex";
  } finally {
    // Restaurar el botón aunque haya error o éxito
    loginButton.classList.remove("loading");
    spinner.style.display = "none";
    btnText.textContent = "Ingresar";
  }
});
