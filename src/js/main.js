// 🌐 Verifica si el usuario está autenticado y carga la vista inicial

(async () => {
  try {
    const res = await fetch("/api/auth/verify", { credentials: "include" });
    if (!res.ok) {
      window.location.href = "/login.html";
      return;
    }

    // ✅ Carga la vista inicial (dashboard)
    await loadView("dashboard");
  } catch (err) {
    console.error("Error de autenticación:", err);
    window.location.href = "/login.html";
  }
})();

/**
 * Carga una vista HTML en el <main> y su script asociado.
 */
async function loadView(viewName) {
  const main = document.getElementById("main-content");
  try {
    // ✅ Quita "src" del path
    const res = await fetch(`/views/${viewName}.html`, { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo cargar la vista: ${viewName}`);

    main.innerHTML = await res.text();
    await loadViewScript(viewName);

    console.log(`✅ Vista cargada: ${viewName}`);
  } catch (err) {
    console.error("❌ Error cargando vista:", err);
    main.innerHTML = `<p>Error cargando vista: ${viewName}</p>`;
  }
}

/**
 * Carga el script JS asociado a la vista (si existe).
 */
async function loadViewScript(viewName) {
  const oldScript = document.getElementById("dynamic-script");
  if (oldScript) oldScript.remove();

  // ✅ Quita "src" también aquí
  const scriptPath = `/js/${viewName}.js`;

  try {
    const check = await fetch(scriptPath, { method: "HEAD" });
    if (!check.ok) {
      console.warn(`⚠️ No hay script asociado para la vista "${viewName}"`);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptPath;
    script.id = "dynamic-script";
    script.defer = true;
    document.body.appendChild(script);
  } catch (err) {
    console.warn(`⚠️ No se pudo cargar el script: ${scriptPath}`);
  }
}

/**
 * Cerrar sesión
 */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/login.html";
  } catch (err) {
    alert("⚠️ Error al cerrar sesión");
    console.error("Logout error:", err);
  }
});
