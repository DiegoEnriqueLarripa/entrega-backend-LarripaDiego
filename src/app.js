import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import enrutadorProductos from './routes/productos.router.js';
import enrutadorCarritos from './routes/carritos.router.js';
import vistasRouter from './routes/vistas.router.js';
import { ProductoDAO } from './dao/producto.dao.js';

const aplicacion = express();
const PUERTO = 8080;
const servidorHttp = createServer(aplicacion);
const io = new Server(servidorHttp);
const __dirname = path.resolve();

aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));
aplicacion.use(express.static(path.join(__dirname, 'public')));
aplicacion.engine('handlebars', engine({
    defaultLayout: 'main'
}));
aplicacion.set('view engine', 'handlebars');
aplicacion.set('views', path.join(__dirname, 'src/views'));

aplicacion.use((req, res, next) => {
    req.io = io;
    next();
});

aplicacion.use('/api/products', enrutadorProductos);
aplicacion.use('/api/carts', enrutadorCarritos);
aplicacion.use('/', vistasRouter);

servidorHttp.listen(PUERTO, () => {
    console.log(`Servidor activo en http://localhost:${PUERTO}`);
});

const productoDAO = new ProductoDAO('src/data/productos.json');

io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    socket.on('pedirProductosIniciales', async () => {
        try {
            const productos = await productoDAO.obtenerProductos();
            socket.emit('actualizarProductos', productos);
        } catch (error) {
            console.error("Error al enviar productos iniciales:", error.message);
        }
    });

    socket.on('agregarProducto', async (producto) => {
        try {
            await productoDAO.agregarProducto(producto);
            const productosActualizados = await productoDAO.obtenerProductos();
            io.emit('actualizarProductos', productosActualizados); 
        } catch (error) {
            console.error("Error al agregar producto por socket:", error.message);
        }
    });

    socket.on('eliminarProducto', async (id) => {
        try {
            await productoDAO.eliminarProducto(id);
            const productosActualizados = await productoDAO.obtenerProductos();
            io.emit('actualizarProductos', productosActualizados); 
        } catch (error) {
            console.error("Error al eliminar producto por socket:", error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});