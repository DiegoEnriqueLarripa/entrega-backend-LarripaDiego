import express from 'express';
import dbConnection from './config/dbConfig.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import enrutadorProductos from './routes/productos.router.js';
import enrutadorCarritos from './routes/carritos.router.js';
import vistasRouter from './routes/vistas.router.js';
import { productoDAO } from './dao/producto.dao.js';

const aplicacion = express();
dbConnection();
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

io.on('connection', (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    socket.on('pedirProductosIniciales', async () => {
        try {
            const resultado = await productoDAO.obtenerProductosPaginados(100, 1, null, {});
            socket.emit('actualizarProductos', resultado.docs);
        } catch (error) {
            console.error("Error al enviar productos iniciales por socket:", error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
    });
});