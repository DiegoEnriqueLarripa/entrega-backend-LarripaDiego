import { Router } from 'express';
import { productoDAO } from '../dao/producto.dao.js';

const enrutador = Router();

enrutador.get('/', async (peticion, respuesta) => {
    try {
        const { limit = 10, page = 1, sort, query } = peticion.query;
        const filtro = {};
        if (query) {
            const campo = query.toLowerCase() === 'true' || query.toLowerCase() === 'false' ? 'status' : 'category';
            filtro[campo] = query;
        }
        const productosPaginados = await productoDAO.obtenerProductosPaginados(parseInt(limit), parseInt(page), sort, filtro);
        const respuestaFormateada = {
            status: 'success',
            payload: productosPaginados.docs,
            totalPages: productosPaginados.totalPages,
            prevPage: productosPaginados.prevPage,
            nextPage: productosPaginados.nextPage,
            page: productosPaginados.page,
            hasPrevPage: productosPaginados.hasPrevPage,
            hasNextPage: productosPaginados.hasNextPage,
            prevLink: productosPaginados.hasPrevPage ? `/api/products?page=${productosPaginados.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: productosPaginados.hasNextPage ? `/api/products?page=${productosPaginados.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
        };
        respuesta.status(200).json(respuestaFormateada);
    } catch (error) {
        respuesta.status(500).json({ status: 'error', error: "Error al obtener los productos: " + error.message });
    }
});

enrutador.get('/:pid', async (peticion, respuesta) => {
    try {
        const producto = await productoDAO.obtenerProductoPorId(peticion.params.pid);
        respuesta.status(200).json({ status: "success", payload: producto });
    } catch (error) {
        respuesta.status(404).json({ status: "error", error: error.message });
    }
});

enrutador.post('/', async (peticion, respuesta) => {
    try {
        const nuevoProducto = await productoDAO.agregarProducto(peticion.body);
        const productosActualizados = await productoDAO.obtenerProductosPaginados(100, 1, null, {}); // Pedimos un límite alto para actualizar la vista
        peticion.io.emit('actualizarProductos', productosActualizados.docs);
        respuesta.status(201).json({ status: "success", payload: nuevoProducto });
    } catch (error) {
        respuesta.status(400).json({ status: "error", error: error.message });
    }
});

enrutador.put('/:pid', async (peticion, respuesta) => {
    try {
        const productoActualizado = await productoDAO.actualizarProducto(peticion.params.pid, peticion.body);
        const productosActualizados = await productoDAO.obtenerProductosPaginados(100, 1, null, {});
        peticion.io.emit('actualizarProductos', productosActualizados.docs);
        respuesta.status(200).json({ status: "success", payload: productoActualizado });
    } catch (error) {
        respuesta.status(404).json({ status: "error", error: error.message });
    }
});

enrutador.delete('/:pid', async (peticion, respuesta) => {
    try {
        await productoDAO.eliminarProducto(peticion.params.pid);
        const productosActualizados = await productoDAO.obtenerProductosPaginados(100, 1, null, {});
        peticion.io.emit('actualizarProductos', productosActualizados.docs);
        respuesta.status(200).json({ status: "success", message: 'Producto eliminado exitosamente' });
    } catch (error) {
        respuesta.status(404).json({ status: "error", error: error.message });
    }
});

export default enrutador;