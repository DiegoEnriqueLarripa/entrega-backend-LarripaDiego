const { Router } = require('express');
const { ProductoDAO } = require('../dao/producto.dao.js');

const enrutador = Router();
const productoDAO = new ProductoDAO('src/data/productos.json');

enrutador.get('/', async (peticion, respuesta) => {
    try {
        const productos = await productoDAO.obtenerProductos();
        respuesta.json(productos);
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
});

enrutador.get('/:pid', async (peticion, respuesta) => {
    try {
        const producto = await productoDAO.obtenerProductoPorId(peticion.params.pid);
        respuesta.json(producto);
    } catch (error) {
        respuesta.status(404).json({ error: error.message });
    }
});

enrutador.post('/', async (peticion, respuesta) => {
    try {
        const nuevoProducto = await productoDAO.agregarProducto(peticion.body);
        respuesta.status(201).json(nuevoProducto);
    } catch (error) {
        respuesta.status(400).json({ error: error.message });
    }
});

enrutador.put('/:pid', async (peticion, respuesta) => {
    try {
        const productoActualizado = await productoDAO.actualizarProducto(peticion.params.pid, peticion.body);
        respuesta.json(productoActualizado);
    } catch (error) {
        respuesta.status(404).json({ error: error.message });
    }
});

enrutador.delete('/:pid', async (peticion, respuesta) => {
    try {
        await productoDAO.eliminarProducto(peticion.params.pid);
        respuesta.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        respuesta.status(404).json({ error: error.message });
    }
});

module.exports = enrutador;