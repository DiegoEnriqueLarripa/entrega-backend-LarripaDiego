import { Router } from 'express';
import { carritoDAO } from '../dao/carrito.dao.js';

const enrutador = Router();

enrutador.get('/', async (peticion, respuesta) => {
    try {
        const carritos = await carritoDAO.obtenerCarritos();
        respuesta.status(200).json({ status: "success", payload: carritos });
    } catch (error) {
        respuesta.status(500).json({ status: "error", error: error.message });
    }
});

enrutador.post('/', async (peticion, respuesta) => {
    try {
        const nuevoCarrito = await carritoDAO.crearCarrito();
        respuesta.status(201).json({ status: "success", payload: nuevoCarrito });
    } catch (error) {
        respuesta.status(500).json({ status: "error", error: error.message });
    }
});

enrutador.get('/:cid', async (peticion, respuesta) => {
    try {
        const carrito = await carritoDAO.obtenerCarritoPorId(peticion.params.cid);
        respuesta.status(200).json({ status: "success", payload: carrito });
    } catch (error) {
        respuesta.status(404).json({ status: "error", error: error.message });
    }
});

enrutador.post('/:cid/product/:pid', async (peticion, respuesta) => {
    try {
        const { cid, pid } = peticion.params;
        const carritoActualizado = await carritoDAO.agregarProductoAlCarrito(cid, pid);
        respuesta.status(200).json({ status: "success", payload: carritoActualizado });
    } catch (error) {
        respuesta.status(404).json({ status: "error", error: error.message });
    }
});

enrutador.delete('/:cid/products/:pid', async (peticion, respuesta) => {
    try {
        const { cid, pid } = peticion.params;
        const carritoActualizado = await carritoDAO.eliminarProductoDelCarrito(cid, pid);
        respuesta.status(200).json({ status: "success", message: "Producto eliminado del carrito", payload: carritoActualizado });
    } catch (error) {
        respuesta.status(500).json({ status: "error", error: error.message });
    }
});

enrutador.put('/:cid', async (peticion, respuesta) => {
    try {
        const { cid } = peticion.params;
        const productos = peticion.body;

        if (!Array.isArray(productos)) {
            return respuesta.status(400).json({ status: "error", error: "El body debe ser un array de productos." });
        }
        const carritoActualizado = await carritoDAO.actualizarProductosDelCarrito(cid, productos);
        respuesta.status(200).json({ status: "success", payload: carritoActualizado });
    } catch (error) {
        respuesta.status(500).json({ status: "error", error: error.message });
    }
});

enrutador.put('/:cid/products/:pid', async (peticion, respuesta) => {
    try {
        const { cid, pid } = peticion.params;
        const { quantity } = peticion.body;

        if (typeof quantity !== 'number' || quantity < 0) {
            return respuesta.status(400).json({ status: "error", error: "La cantidad (quantity) debe ser un número positivo." });
        }

        const carritoActualizado = await carritoDAO.actualizarCantidadProducto(cid, pid, quantity);
        respuesta.status(200).json({ status: "success", payload: carritoActualizado });
    } catch (error) {
        respuesta.status(500).json({ status: "error", error: error.message });
    }
});

enrutador.delete('/:cid', async (peticion, respuesta) => {
    try {
        const { cid } = peticion.params;
        await carritoDAO.vaciarCarrito(cid);
        respuesta.status(200).json({ status: "success", message: "Todos los productos han sido eliminados del carrito" });
    } catch (error) {
        respuesta.status(500).json({ status: "error", error: error.message });
    }
});

export default enrutador;