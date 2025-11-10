console.log("✅ Script usuarios.js cargado correctamente");

const form = document.getElementById("userForm");
const tableBody = document.querySelector("#usersTable tbody");

if (!form) {
console.error("No se encontró el formulario userForm");
} else {
console.log("Formulario detectado, agregando listener...");

// 🔹 Cargar usuarios al iniciar
loadUsers();

// 🔹 Crear usuario nuevo
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();
    const id_empresa = document.getElementById("empresaSelect").value;
    const tipo_usuario = document.getElementById("tipo_usuario").value;

    console.log("📦 Enviando datos:", { nombre, correo, contrasena, id_empresa, tipo_usuario });

    if (!nombre || !correo || !contrasena) {
    return alert("⚠️ Todos los campos son obligatorios.");
    }

    try {
    const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nombre, correo, contrasena, id_empresa, tipo_usuario })
    });

    const data = await res.json();

    if (res.ok && data.ok) {
        alert("Usuario creado correctamente");
        form.reset();
        loadUsers();
    } else {
        alert(`${data.message || "Error al crear usuario"}`);
    }
    } catch (err) {
    console.error("Error al crear usuario:", err);
    alert("Error de conexión con el servidor");
    }
});
}

// 🔹 Función: cargar usuarios
async function loadUsers() {
if (!tableBody) return;
tableBody.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

try {
    const res = await fetch("/api/users", {
    method: "GET",
    credentials: "include"
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
    tableBody.innerHTML = "<tr><td colspan='5'> No autorizado o error al obtener usuarios</td></tr>";
    return;
    }

    tableBody.innerHTML = "";
    if (data.users.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='5'>No hay usuarios registrados</td></tr>";
    return;
    }

    data.users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${user.nombre}</td>
        <td>${user.correo}</td>
        <td>${user.id_empresa || "-"}</td>
        <td>${user.tipo_usuario}</td>
        <td>${user.activo ? "✅" : "❌"}</td>
    `;
    tableBody.appendChild(tr);
    });
} catch (err) {
    console.error("Error al cargar usuarios:", err);
    tableBody.innerHTML = "<tr><td colspan='5'> Error de conexión</td></tr>";
}
}
