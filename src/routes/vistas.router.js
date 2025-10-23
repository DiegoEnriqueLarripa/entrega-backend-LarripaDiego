import { Router } from 'express';
import { ProductoDAO } from '../dao/producto.dao.js';

const enrutador = Router();
const productoDAO = new ProductoDAO('src/data/productos.json');

enrutador.get('/', async (req, res) => {
    try {
        const productos = await productoDAO.obtenerProductos();
        res.render('home', { productos, titulo: "Home - Productos" });
    } catch (error) {
        res.status(500).send("Error al cargar la página");
    }
});

enrutador.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { titulo: "Tiempo Real - Productos" });
    } catch (error) {
        res.status(500).send("Error al cargar la página");
    }
});

export default enrutador;
