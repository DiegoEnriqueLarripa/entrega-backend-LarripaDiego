const socket = io(); // Conexión con el servidor de sockets

const listaProductos = document.getElementById('lista-productos');
const formAgregar = document.getElementById('form-agregar-producto');
const formEliminar = document.getElementById('form-eliminar-producto');

// Función para renderizar la lista de productos
const renderizarProductos = (productos) => {
    listaProductos.innerHTML = '';
    if (productos.length === 0) {
        listaProductos.innerHTML = '<p>No hay productos en tiempo real.</p>';
        return;
    }
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.style = "border: 1px solid #ccc; padding: 1rem; border-radius: 8px;";
        productoDiv.innerHTML = `
            <h2>${producto.title}</h2>
            <p><strong>ID:</strong> ${producto.id}</p>
            <p><strong>Precio:</strong> $${producto.price}</p>
        `;
        listaProductos.appendChild(productoDiv);
    });
};

// Escuchar el evento 'actualizarProductos' desde el servidor
socket.on('actualizarProductos', (productos) => {
    renderizarProductos(productos);
});

// Enviar evento para agregar un producto
formAgregar.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevoProducto = {
        title: e.target.title.value,
        description: e.target.description.value,
        code: e.target.code.value,
        price: Number(e.target.price.value),
        stock: Number(e.target.stock.value),
        category: e.target.category.value,
    };
    socket.emit('agregarProducto', nuevoProducto);
    formAgregar.reset();
});

// Enviar evento para eliminar un producto
formEliminar.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    socket.emit('eliminarProducto', id);
    formEliminar.reset();
});

// Pedir la lista inicial de productos al conectar
socket.emit('pedirProductosIniciales');