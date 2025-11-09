# Entrega Final - Backend E-commerce (Diego Larripa)

¡Hola, Profe! Este es el repositorio para la entrega final del curso de Backend. A continuación, encontrarás una guía detallada para instalar, ejecutar y probar todas las funcionalidades del proyecto.

---

## ✨ Características Principales

*   **API RESTful Completa:** Endpoints para la gestión de productos y carritos.
*   **Persistencia en MongoDB:** Toda la información se guarda en una base de datos de MongoDB Atlas, utilizando **Mongoose** como ODM.
*   **Consultas Avanzadas:** La API de productos soporta **paginación, filtros por categoría/disponibilidad y ordenamiento por precio**.
*   **Gestión de Carritos Profesional:** Lógica de carritos con **población (`populate`)** para traer los datos completos de los productos.
*   **Vistas Dinámicas:** Interfaz de usuario renderizada desde el servidor con **Handlebars**, incluyendo una vista de productos paginada, detalle de producto y vista de carrito.
*   **Interactividad en Tiempo Real:** Uso de **WebSockets (Socket.IO)** para actualizar la vista de productos en tiempo real cuando se crean o eliminan productos.

## 🛠️ Tecnologías Utilizadas

*   Node.js
*   Express.js
*   MongoDB Atlas
*   Mongoose & Mongoose-Paginate-v2
*   Handlebars
*   Socket.IO

---

## 🚀 Puesta en Marcha y Pruebas

Sigue estos pasos para poner en funcionamiento el servidor y testear todas sus funcionalidades.

### 1. Instalación

1.  **Clonar el Repositorio:**
    
    git clone URLDELREPOSITORIO
    cd nombre-del-repositorio
 

2.  **Instalar Dependencias:**

    npm install

3.  **Configurar la Conexión a MongoDB :**
    *   Ve al archivo `src/config/dbConfig.js`.
    *   Reemplaza la cadena de conexión `URI` con tu propia cadena de MongoDB Atlas, asegurándote de incluir tu **usuario, contraseña y el nombre de la base de datos**.

4.  **Iniciar el Servidor:**

    npm start
    
    En la consola, deberías ver los mensajes de conexión exitosa a la base de datos y "Servidor activo en http://localhost:8080".

### 2. Guía de Pruebas

#### A. Pruebas de la API (Recomendado: Postman)

*   **Crear Productos de Prueba:** Para probar la paginación, se recomienda crear varios productos usando el endpoint `POST /api/products` con un JSON en el body.

*   **Endpoint de Productos (`GET /api/products`):**
    *   **Paginación:** `.../api/products?limit=3&page=2`
    *   **Filtro:** `.../api/products?query=Librería` (por categoría) o `?query=true` (por status).
    *   **Ordenamiento:** `.../api/products?sort=desc` (del más caro al más barato).
    *   **Combinado:** `.../api/products?limit=2&query=Tecnología&sort=asc`

*   **Endpoints de Carritos (`/api/carts`):**
    1.  Crea un carrito con `POST /api/carts` y copia su ID (`cid`).
    2.  Agrega un producto con `POST /api/carts/:cid/product/:pid`.
    3.  **Verifica el `populate`** con `GET /api/carts/:cid`. Verás que los productos se muestran con todos sus detalles.
    4.  Prueba los nuevos endpoints:
        *   `PUT /api/carts/:cid/product/:pid` (con `{"quantity": 10}` en el body) para actualizar la cantidad.
        *   `DELETE /api/carts/:cid/product/:pid` para eliminar un producto.
        *   `DELETE /api/carts/:cid` para vaciar el carrito.

#### B. Pruebas de las Vistas (Navegador Web)

1.  **Vista Principal y Paginación:**
    *   Ve a `http://localhost:8080/`. Serás redirigido a `/products`.
    *   Navega entre las páginas usando los botones "Siguiente" y "Anterior".

2.  **Detalle de Producto:**
    *   En la vista principal, haz clic en el botón **"Ver detalles"** de cualquier producto. Serás llevado a una nueva página con la información completa de ese item.

3.  **Flujo de Carrito Completo:**
    *   En la vista principal o de detalle, haz clic en **"Agregar al Carrito"**. La primera vez, se creará un carrito y se guardará su ID en el `localStorage` del navegador.
    *   Un enlace **"Ver Mi Carrito"** aparecerá en la navegación.
    *   Haz clic en él para ir a la vista del carrito (`/carts/:cid`).
    *   En la vista del carrito, verifica que se listen los productos con sus subtotales, el total final, y prueba el botón **"Eliminar"**.

4.  **Prueba de WebSockets:**
    *   Abre `http://localhost:8080/realtimeproducts` en una pestaña.
    *   En otra pestaña (o en Postman), crea o elimina un producto usando la API (`POST` o `DELETE` a `/api/products`).
    *   **Observa la primera pestaña:** La lista de productos se actualizará automáticamente sin recargar la página.

---

¡Espero que les guste y gracias por la corrección! Diego Enrique Larripa
