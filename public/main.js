const API_URL = "/api/producto";

const productosContainer = document.getElementById("productosContainer");
const form = document.querySelector("#productoForm");


const idInput = document.querySelector("#id");
const nombreInput = document.querySelector("#nombre");
const descripcionInput = document.querySelector("#descripcion");
const precioInput = document.querySelector("#precio");
const stockInput = document.querySelector("#stock");
const categoriaInput = document.querySelector("#categoria");
const categoriaSelect = document.querySelector("#categoriaSelect");

const btnGuardar = document.querySelector("#btnGuardar");
const addBtn = document.querySelector('button[data-bs-target="#modalProducto"]');

const modalEl = document.getElementById("modalProducto");
const modalProducto = new bootstrap.Modal(modalEl);

const nombreFiltro = document.getElementById("filtroNombre");
const categoriaFiltro = document.getElementById("filtroCategoria");
const precioFiltro = document.getElementById("filtroPrecio");

let productosGlobal = [];
let paginaActual = 1;
const productosPorPagina = 6;

function resetFormToCreate() {
    form.reset();
    idInput.value = "";
    categoriaSelect.value = "";
    categoriaInput.value = "";
    document.getElementById("modalProductoLabel").textContent = "Añadir Producto";
    btnGuardar.textContent = "Guardar";
}

async function cargarProductos() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        productosGlobal = Array.isArray(data) ? data : (Array.isArray(data.productos) ? data.productos : []);
        paginaActual = 1;
        renderizarProductos();
        cargarCategorias();
    } catch (err) {
        console.error("Error cargando productos:", err);
    }
}

function renderizarProductos() {
    const nombreVal = nombreFiltro ? nombreFiltro.value.toLowerCase() : "";
    const categoriaVal = categoriaFiltro ? categoriaFiltro.value : "";
    const precioVal = precioFiltro ? parseFloat(precioFiltro.value) : null;

    let filtrados = productosGlobal.filter(p => {
        return (!nombreVal || p.nombre.toLowerCase().includes(nombreVal))
            && (!categoriaVal || p.categoria === categoriaVal)
            && (!precioVal || p.precio <= precioVal);
    });

    const totalPaginas = Math.ceil(filtrados.length / productosPorPagina);
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = filtrados.slice(inicio, fin);

    productosContainer.innerHTML = "";
    const row = document.createElement("div");
    row.className = "row";

    productosPagina.forEach((p, index) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text"><strong>Descripción:</strong> ${p.descripcion}</p>
                    <p class="card-text"><strong>Precio:</strong> $${Number(p.precio).toFixed(2)}</p>
                    <p class="card-text"><strong>Stock:</strong> ${p.stock}</p>
                    <p class="card-text"><strong>Categoría:</strong> ${p.categoria ?? "-"}</p>
                    <p class="card-text"><strong>Disponible:</strong> ${p.disponible ? "Sí" : "No"}</p>
                    <div class="mt-auto d-flex justify-content-between">
                        <button class="btn btn-outline-success" onclick="editarProducto('${p._id}')">Editar</button>
                        <button class="btn btn-outline-danger" onclick="eliminarProducto('${p._id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        row.appendChild(col);
    });

    productosContainer.appendChild(row);

    // Paginación
    const pagDiv = document.getElementById("paginacion");
    pagDiv.innerHTML = "";
    if (totalPaginas > 1) {
        if (paginaActual > 1) {
            const prevBtn = document.createElement("button");
            prevBtn.className = "btn btn-outline-primary me-2";
            prevBtn.textContent = "Anterior";
            prevBtn.onclick = () => { paginaActual--; renderizarProductos(); };
            pagDiv.appendChild(prevBtn);
        }
        if (paginaActual < totalPaginas) {
            const nextBtn = document.createElement("button");
            nextBtn.className = "btn btn-outline-primary";
            nextBtn.textContent = "Siguiente";
            nextBtn.onclick = () => { paginaActual++; renderizarProductos(); };
            pagDiv.appendChild(nextBtn);
        }
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoriaFinal =
        categoriaSelect && categoriaSelect.value !== ""
            ? categoriaSelect.value
            : categoriaInput.value;

    const producto = {
        nombre: nombreInput.value,
        descripcion: descripcionInput.value,
        precio: Number(precioInput.value),
        stock: Number(stockInput.value || 0),
        categoria: categoriaFinal
    };

    let method = "POST";
    let url = API_URL;
    if (idInput.value) {
        method = "PUT";
        url = `${API_URL}/${idInput.value}`;
    }

    try {
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!res.ok) throw new Error("Error en la operación");

        await cargarProductos();
        modalProducto.hide();
        resetFormToCreate();
    } catch (err) {
        console.error("Error guardando producto:", err);
    }
});

async function editarProducto(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        const p = data.producto ?? data;

        idInput.value = p._id;
        nombreInput.value = p.nombre ?? "";
        descripcionInput.value = p.descripcion ?? "";
        precioInput.value = p.precio ?? "";
        stockInput.value = p.stock ?? 0;

        const option = categoriaSelect ? [...categoriaSelect.options].find(opt => opt.value === p.categoria) : null;
        if (option) {
            categoriaSelect.value = p.categoria;
            categoriaInput.value = "";
        } else {
            if (categoriaSelect) categoriaSelect.value = "";
            categoriaInput.value = p.categoria ?? "";
        }

        document.getElementById("modalProductoLabel").textContent = "Editar Producto";
        btnGuardar.textContent = "Actualizar";
        modalProducto.show();
    } catch (err) {
        console.error(err);
    }
}
window.editarProducto = editarProducto;

async function eliminarProducto(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        await cargarProductos();
    } catch (err) {
        console.error(err);
    }
}
window.eliminarProducto = eliminarProducto;

async function cargarCategorias() {
    try {
        const categorias = [...new Set(
            productosGlobal.filter(p => p.categoria && p.categoria.trim() !== "").map(p => p.categoria)
        )];

        if (categoriaSelect) {
            categoriaSelect.innerHTML = `<option value="">-- Seleccionar categoría existente --</option>`;
            categorias.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat;
                option.textContent = cat;
                categoriaSelect.appendChild(option);
            });
        }

        if (categoriaFiltro) {
            categoriaFiltro.innerHTML = `<option value="">-- Todas las categorías --</option>`;
            categorias.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat;
                option.textContent = cat;
                categoriaFiltro.appendChild(option);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

modalEl.addEventListener('hidden.bs.modal', () => resetFormToCreate());

if (addBtn) {
    addBtn.addEventListener("click", resetFormToCreate);
}

if (nombreFiltro) nombreFiltro.addEventListener("input", renderizarProductos);
if (categoriaFiltro) categoriaFiltro.addEventListener("change", renderizarProductos);
if (precioFiltro) precioFiltro.addEventListener("input", renderizarProductos);

cargarProductos();
