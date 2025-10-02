const { Router } = require('express');
const { CarritoDAO } = require('../dao/carrito.dao.js');

const enrutador = Router();
const carritoDAO = new CarritoDAO('src/data/carritos.json');


enrutador.get('/', async (peticion, respuesta) => {
    try {
        const carritos = await carritoDAO.obtenerCarritos();
        respuesta.json(carritos);
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
});

enrutador.post('/', async (peticion, respuesta) => {
    try {
        const nuevoCarrito = await carritoDAO.crearCarrito();
        respuesta.status(201).json(nuevoCarrito);
    } catch (error) {
        respuesta.status(500).json({ error: error.message });
    }
});

enrutador.get('/:cid', async (peticion, respuesta) => {
    try {
        const carrito = await carritoDAO.obtenerCarritoPorId(peticion.params.cid);
        respuesta.json(carrito.products);
    } catch (error) {
        respuesta.status(404).json({ error: error.message });
    }
});

enrutador.post('/:cid/product/:pid', async (peticion, respuesta) => {
    try {
        const { cid, pid } = peticion.params;
        const carritoActualizado = await carritoDAO.agregarProductoAlCarrito(cid, pid);
        respuesta.json(carritoActualizado);
    } catch (error) {
        respuesta.status(404).json({ error: error.message });
    }
});

module.exports = enrutador;