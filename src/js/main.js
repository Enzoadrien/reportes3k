// ✅ Evita que el script se ejecute más de una vez
if (window.__MAIN_LOADED__) {
  console.log("main.js ya estaba cargado, se evita duplicar ejecución.");
} else {
  window.__MAIN_LOADED__ = true;
  console.log("main.js cargado una sola vez");

  /**
   *Función para cargar vistas dinámicamente dentro del <main>
   * Solo carga desde /src/views/ (no accesibles directamente por URL)
   */
  window.loadView = async function (viewName) {
    const main = document.getElementById("main-content");
    if (!main) return console.error("No se encontró el contenedor <main>");

    main.innerHTML = "<p>Cargando...</p>";

    try {
      // Carga las vistas desde src/views, no desde /views/
      const res = await fetch(`/src/views/${viewName}.html`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Vista "${viewName}" no encontrada`);

      const html = await res.text();
      main.innerHTML = html;

      // Ejecutar scripts (inline o externos) incluidos en la vista
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const scripts = Array.from(tempDiv.querySelectorAll("script"));

      for (const oldScript of scripts) {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          // Cargar script externo
          await new Promise((resolve) => {
            newScript.src = oldScript.src;
            if (oldScript.type) newScript.type = oldScript.type;
            newScript.onload = resolve;
            newScript.onerror = () => {
              console.error("Error al cargar script:", oldScript.src);
              resolve();
            };
            document.body.appendChild(newScript);
          });
        } else {
          // Ejecutar script inline
          if (oldScript.type) newScript.type = oldScript.type;
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        }
      }

      console.log(`Vista "${viewName}" cargada correctamente`);
    } catch (err) {
      console.error(`Error al cargar vista "${viewName}":`, err);
      main.innerHTML = "<p>Error al cargar la vista.</p>";
    }
  };

  /**
   *  Inicialización principal
   * - Verifica sesión
   * - Carga la vista inicial (dashboard)
   * - Configura navegación
   * - Activa logout
   */
  (async () => {
    try {
      const res = await fetch("/api/auth/verify", { credentials: "include" });
      if (!res.ok) {
        console.warn("No autenticado → redirigiendo a login...");
        window.location.href = "/login.html";
        return;
      }

      console.log("🔓 Usuario autenticado");

      // Cargar la vista inicial (dashboard)
      await loadView("dashboard");

      // Configurar navegación del header
      const nav = document.querySelector("nav");
      if (nav) {
        nav.addEventListener("click", (e) => {
          if (e.target.tagName !== "BUTTON") return;
          const view = e.target.textContent.trim().toLowerCase();
          switch (view) {
            case "inicio":
              loadView("dashboard");
              break;
            case "usuarios":
              loadView("usuarios");
              break;
            case "reportes":
              loadView("reportes");
              break;
          }
        });
      }

      // Botón de logout
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
          try {
            await fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            });
          } catch (err) {
            console.error("Error al cerrar sesión:", err);
          } finally {
            window.location.href = "/login.html";
          }
        });
      }

      const menuRoggle = document.getElementById(menuToggle);
      const mainNav = document.querySelector("nav");

      if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", (e) => {
          e.preventDefault(); 
          mainNav.classList.toggle("hidden"); 
        });
      }

    } catch (err) {
      console.error("Error al verificar autenticación:", err);
      window.location.href = "/login.html";
    }
  })();
}
