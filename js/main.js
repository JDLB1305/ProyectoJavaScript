// Array de libros
let catalogoLibros = [];
let totalCompra = 0;

// Cargar catálogo de libros desde LocalStorage o usar el predeterminado
function cargarCatalogo() {
    const catalogoJSON = localStorage.getItem("catalogoLibros");
    if (catalogoJSON) {
        catalogoLibros = JSON.parse(catalogoJSON);
    } else {
        catalogoLibros = [
            { titulo: "Satanas", precio: 10000 },
            { titulo: "Cien años de soledad", precio: 25000 },
            { titulo: "El crimen del siglo", precio: 30000 },
            { titulo: "El olvido que seremos", precio: 20000 },
            { titulo: "Rebelión en la granja", precio: 50000 }
        ];
        guardarCatalogo(); // Guardar el catálogo inicial en LocalStorage
    }
}

// Guardar catálogo en LocalStorage
function guardarCatalogo() {
    localStorage.setItem("catalogoLibros", JSON.stringify(catalogoLibros));
}

// Cargar catálogo al iniciar la aplicación
cargarCatalogo();

// Función de inicio de sesión
// Simula una validación remota de usuario con una promesa
function validarCredenciales(user, password) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if ((user === "admin01" && password === "PlatLibros") || (user === "JuanMecanico21" && password === "JuanCaballo")) {
              resolve("Credenciales correctas");
          } else {
              reject("Credenciales inválidas");
          }
      }, 4000); // Simulamos retraso de 1.5 segundos
  });
}

// Hacemos async la función login
async function login() {
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;

  // Muestra el mensaje de validación en proceso
  Swal.fire({
      title: 'Validando Información',
      text: 'Por favor, espera...',
      allowOutsideClick: false,  // Evita que se cierre al hacer clic fuera del modal
      didOpen: () => {
          Swal.showLoading();  // Muestra la animación de carga
      }
  });

  try {
      const mensaje = await validarCredenciales(user, password);
      
      Swal.close(); // Cierra el mensaje de "Validando Información" una vez que la promesa se resuelve

      Swal.fire({
          title: 'Éxito',
          text: mensaje,
          icon: 'success'
      });

      // Mostrar panel correspondiente después del login
      if (user === "admin01") {
          document.getElementById("loginPanel").classList.add("hidden");
          document.getElementById("adminPanel").classList.remove("hidden");
          mostrarCRUDLibros();
      } else if (user === "JuanMecanico21") {
          document.getElementById("loginPanel").classList.add("hidden");
          document.getElementById("clientePanel").classList.remove("hidden");
          mostrarCatalogo();
      }

  } catch (error) {
      Swal.close(); // Cierra el mensaje de "Validando Información" si hay un error

      Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error'
      });
  }
}


// Mostrar los libros en el panel de administración
function mostrarCRUDLibros() {
    const crudLibrosElement = document.getElementById("crudLibros");
    crudLibrosElement.innerHTML = "";
    catalogoLibros.forEach((libro, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" value="${libro.titulo}" id="editTitulo${index}"></td>
            <td><input type="number" value="${libro.precio}" id="editPrecio${index}"></td>
            <td>
                <button onclick="guardarEdicionLibro(${index})">Guardar</button>
                <button onclick="eliminarLibro(${index})">Eliminar</button>
            </td>
        `;
        crudLibrosElement.appendChild(row);
    });
}

// Mostrar el catálogo de libros al cliente
function mostrarCatalogo() {
    const catalogoBodyElement = document.getElementById("catalogo");
    catalogoBodyElement.innerHTML = ""; // Limpiar el contenido de la tabla

    catalogoLibros.forEach((libro, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${libro.titulo}</td>
            <td>$${libro.precio}</td>
        `;
        catalogoBodyElement.appendChild(row);
    });

    document.getElementById("compraForm").style.display = "block"; // Mostrar formulario de compra
}

// Funciones para buscar y filtrar
function buscarPorTitulo() {
    const tituloBusqueda = document.getElementById("buscarTitulo").value.toLowerCase();
    const librosFiltrados = catalogoLibros.filter(libro => libro.titulo.toLowerCase().includes(tituloBusqueda));
    actualizarVistaCRUD(librosFiltrados);
}

function filtrarPorPrecio() {
    const precioBusqueda = parseFloat(document.getElementById("filtrarPrecio").value);
    const librosFiltrados = catalogoLibros.filter(libro => libro.precio <= precioBusqueda);
    actualizarVistaCRUD(librosFiltrados);
}

function actualizarVistaCRUD(libros) {
    const crudLibrosElement = document.getElementById("crudLibros");
    crudLibrosElement.innerHTML = "";
    libros.forEach((libro, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${libro.titulo}</td>
            <td>${libro.precio}</td>
            <td>
                <button onclick="editarLibro(${index})">Editar</button>
                <button onclick="eliminarLibro(${index})">Eliminar</button>
            </td>
        `;
        crudLibrosElement.appendChild(row);
    });
}

// Agregar, editar y eliminar libros
function agregarLibro() {
    const titulo = document.getElementById("nuevoTitulo").value;
    const precio = parseFloat(document.getElementById("nuevoPrecio").value);
    if (titulo && !isNaN(precio)) {
        catalogoLibros.push({ titulo, precio });
        guardarCatalogo(); // Guardar el catálogo actualizado
        mostrarCRUDLibros();
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Digite todos los campos por favor',
            icon: 'error'
        });
    }
}

// Guardar el catálogo actualizado en LocalStorage
function guardarCatalogoEnLocalStorage() {
    localStorage.setItem('catalogoLibros', JSON.stringify(catalogoLibros));
}

// Función para guardar los cambios al editar un libro
function guardarEdicionLibro(index) {
    const nuevoTitulo = document.getElementById(`editTitulo${index}`).value;
    const nuevoPrecio = parseFloat(document.getElementById(`editPrecio${index}`).value);
    if (nuevoTitulo && !isNaN(nuevoPrecio)) {
        catalogoLibros[index].titulo = nuevoTitulo;
        catalogoLibros[index].precio = nuevoPrecio;
        guardarCatalogoEnLocalStorage(); // Actualizar el almacenamiento en LocalStorage
        mostrarCRUDLibros();
        Swal.fire({
            title: 'Éxito',
            text: 'El libro ha sido actualizado correctamente.',
            icon: 'success'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un título válido y un precio numérico.',
            icon: 'error'
        });
    }
}

// Función para eliminar libros y actualizar el almacenamiento
function eliminarLibro(index) {
    // Eliminamos el libro del catálogo
    catalogoLibros.splice(index, 1);
    
    // Actualizamos el almacenamiento en LocalStorage
    guardarCatalogoEnLocalStorage();
    
    // Refrescamos la vista del CRUD de libros
    mostrarCRUDLibros();
}

// Comprar libros
function comprarLibros() {
    const libroNumero = parseInt(document.getElementById("libroNumero").value) - 1;
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!isNaN(libroNumero) && !isNaN(cantidad) && libroNumero >= 0 && libroNumero < catalogoLibros.length) {
        totalCompra += catalogoLibros[libroNumero].precio * cantidad;
        document.getElementById("resultado").textContent = `Total parcial de su compra: $${totalCompra}`;

        Swal.fire({
            title: '¿Desea comprar más libros?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById("libroNumero").value = "";
                document.getElementById("cantidad").value = "";
            } else {
                guardarCompraUsuario(); // Guardar compra en LocalStorage
                Swal.fire({
                    title: 'Compra finalizada',
                    text: `El total de su compra es: $${totalCompra}. Gracias por visitar nuestra tienda. ¡Hasta luego!`,
                    icon: 'success'
                });
                document.getElementById("compraForm").style.display = "none";
            }
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Selección inválida. Por favor, ingrese un número de libro válido y una cantidad.',
            icon: 'error'
        });
    }
}

// Guardar la compra del usuario en LocalStorage
function guardarCompraUsuario() {
    const compras = JSON.parse(localStorage.getItem("comprasUsuario")) || [];
    compras.push({ totalCompra });
    localStorage.setItem("comprasUsuario", JSON.stringify(compras));
}

// Función de cierre de sesión
function cerrarSesion() {
    document.getElementById("loginPanel").classList.remove("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("clientePanel").classList.add("hidden");
    totalCompra = 0; // Resetear el total de compra al cerrar sesión
    document.getElementById("resultado").textContent = "";
}

function obtenerLibrosDeLocalStorage() {
  let libros = JSON.parse(localStorage.getItem('catalogoLibros')) || [];
  return libros;
}


function buscarLibroPorAPI(titulo) {
  const url = `https://gutendex.com/books?search=${encodeURIComponent(titulo)}`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Verificación en la consola
      mostrarLibrosDeAPI(data.results); // Los libros están en 'data.results'
    })
    .catch(error => {
      console.error("Error al buscar libros:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron obtener los libros de la API.',
        icon: 'error',
      });
    });
}

// Función para generar un precio aleatorio entre 10 y 100
function generarPrecioAleatorio() {
  return (Math.random() * (100 - 10) + 10).toFixed(2);
}

function mostrarLibrosDeAPI(librosAPI) {
  const clienteCatalogo = document.getElementById('catalogo');
  clienteCatalogo.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

  // Obtener los libros del LocalStorage
  const librosLocal = obtenerLibrosDeLocalStorage();

  // Combinar los libros de la API con los de LocalStorage
  const todosLosLibros = [...librosLocal, ...librosAPI.map(libro => ({
      id: libro.id,
      title: libro.title,
      price: generarPrecioAleatorio() // Generamos un precio para los libros de la API
  }))];

  // Mostrar todos los libros en la tabla de cliente
  todosLosLibros.forEach(libro => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
          <td>${libro.id}</td>
          <td>${libro.title}</td>
          <td>$${libro.price}</td>
      `;
      clienteCatalogo.appendChild(fila);
  });
}


// Modificar la búsqueda en tiempo real
document.getElementById('buscarTitulo').oninput = function () {
  const query = this.value;
  if (query.length > 2) {
      buscarLibroPorAPI(query);
  }
};





