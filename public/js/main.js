
let cartId = localStorage.getItem('cartId');


async function agregarAlCarrito(productoId) {
    if (!cartId) {
        try {
            const response = await fetch('/api/carts', { method: 'POST' });
            const data = await response.json();
            if(data.status === 'success') {
                cartId = data.payload._id;
                localStorage.setItem('cartId', cartId);
                alert('Se ha creado un nuevo carrito para ti.');
            } else {
                throw new Error(data.error || 'Error desconocido al crear carrito');
            }
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            alert('Hubo un error al crear un nuevo carrito.');
            return;
        }
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productoId}`, { method: 'POST' });
        if (response.ok) {
            alert(`¡Producto agregado al carrito! Puedes ver tu carrito en /carts/${cartId}`);
        } else {
            alert('Error al agregar el producto al carrito.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al conectar con el servidor.');
    }
}

function mostrarEnlaceCarrito() {
    const cartIdGuardado = localStorage.getItem('cartId');
    if (cartIdGuardado) {
        const headerNav = document.querySelector('header nav');
        
        if (headerNav && !headerNav.querySelector('a[href*="/carts/"]')) {
            const enlaceCarrito = document.createElement('a');
            enlaceCarrito.href = `/carts/${cartIdGuardado}`;
            enlaceCarrito.innerText = 'Ver Mi Carrito';
            enlaceCarrito.style.marginLeft = '1rem';
            headerNav.appendChild(enlaceCarrito);
        }
    }
}

document.addEventListener('DOMContentLoaded', mostrarEnlaceCarrito);