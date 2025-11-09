const socket = io();

const listaProductos = document.getElementById('lista-productos');
const formAgregar = document.getElementById('form-agregar-producto');
const formEliminar = document.getElementById('form-eliminar-producto');

// Función para renderizar la lista de productos (sin cambios)
const renderizarProductos = (productos) => {
    listaProductos.innerHTML = '';
    if (!productos || productos.length === 0) {
        listaProductos.innerHTML = '<p>No hay productos en tiempo real.</p>';
        return;
    }
    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.style = "border: 1px solid #ccc; padding: 1rem; border-radius: 8px;";
        productoDiv.innerHTML = `
            <h2>${producto.title}</h2>
            <p><strong>ID:</strong> ${producto._id}</p>
            <p><strong>Precio:</strong> $${producto.price}</p>
        `;
        listaProductos.appendChild(productoDiv);
    });
};

socket.on('actualizarProductos', (productos) => {
    renderizarProductos(productos);
});

formAgregar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoProducto = {
        title: e.target.title.value,
        description: e.target.description.value,
        code: e.target.code.value,
        price: Number(e.target.price.value),
        stock: Number(e.target.stock.value),
        category: e.target.category.value,
    };
    
    try {
        const respuesta = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoProducto)
        });
        if (respuesta.ok) {
            formAgregar.reset();
        } else {
            const error = await respuesta.json();
            alert('Error al crear el producto: ' + (error.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert('Hubo un error de conexión al intentar crear el producto.');
    }
});

formEliminar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    
    if (!id) {
        alert('Por favor, ingresa un ID para eliminar.');
        return;
    }
    
    try {
        const respuesta = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        if (respuesta.ok) {
            formEliminar.reset();
        } else {
            const error = await respuesta.json();
            alert('Error al eliminar el producto: ' + (error.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert('Hubo un error de conexión al intentar eliminar el producto.');
    }
});

socket.emit('pedirProductosIniciales');