// src/app.js
const express = require('express');
const enrutadorProductos = require('./routes/productos.router.js');
const enrutadorCarritos = require('./routes/carritos.router.js');

const aplicacion = express();
const PUERTO = 8080;

// Middlewares
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

// Rutas
aplicacion.use('/api/products', enrutadorProductos);
aplicacion.use('/api/carts', enrutadorCarritos);

aplicacion.get('/', (peticion, respuesta) => {
    respuesta.send(`
        <h1>¡Bienvenido a mi servidor, Profe!</h1>
        <p>¡Hola! El proyecto ya está listo y funcional. Estuve probando todo con Postman y las rutas principales quedaron así:</p>
        <ul>
            <li><strong><code>GET /api/products</code></strong> - Para ver todos los productos.</li>
            <li><strong><code>POST /api/products</code></strong> - Para crear un producto nuevo.</li>
            <li><strong><code>GET /api/carts</code></strong> - Para ver los carritos.</li>
            <li><strong><code>POST /api/carts</code></strong> - Para crear un carrito.</li>
            <li><em>(Y las demás rutas de la consigna también están listas).</em></li>
        </ul>
        <p><strong>Un dato extra:</strong> Para la entrega usé <strong>CommonJS </strong>. Al principio lo había armado con <strong>ES Modules</strong>, así que aproveché para practicar un poco y asegurarme de que entiendo un poco cómo funcionan los dos sistemas.Además, para asegurar que los IDs de los productos y carritos fueran siempre únicos, integré la librería <strong><code>uuid</code></strong>.. Espero que le parezca interesante, Saludos Cordiales. Larripa Diego Enrique </p>
    `);
});

// Iniciar servidor
aplicacion.listen(PUERTO, () => {
    console.log(`Servidor activo en http://localhost:${PUERTO}`);
});