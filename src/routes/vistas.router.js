// src/routes/vistas.router.js
import { Router } from 'express';
import { productoDAO } from '../dao/producto.dao.js';
import { carritoDAO } from '../dao/carrito.dao.js';

const enrutador = Router();

enrutador.get('/', (req, res) => {
    res.redirect('/products');
});

enrutador.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filtro = {};
        if (query) {
            const campo = query.toLowerCase() === 'true' || query.toLowerCase() === 'false' ? 'status' : 'category';
            filtro[campo] = query;
        }
        const resultado = await productoDAO.obtenerProductosPaginados(parseInt(limit), parseInt(page), sort, filtro);
        
        res.render('home', {
            titulo: "Listado de Productos",
            productos: resultado.docs,
            totalPages: resultado.totalPages,
            page: resultado.page,
            hasPrevPage: resultado.hasPrevPage,
            hasNextPage: resultado.hasNextPage,
            prevLink: resultado.hasPrevPage ? `/products?page=${resultado.prevPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
            nextLink: resultado.hasNextPage ? `/products?page=${resultado.nextPage}&limit=${limit}&sort=${sort || ''}&query=${query || ''}` : null,
        });
    } catch (error) {
        res.status(500).send("Error al cargar la página de productos: " + error.message);
    }
});

enrutador.get('/products/:pid', async (req, res) => {
    try {
        const producto = await productoDAO.obtenerProductoPorId(req.params.pid);
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render('productDetail', {
            titulo: producto.title,
            producto: producto
        });
    } catch (error) {
        res.status(500).send("Error al cargar la página del producto: " + error.message);
    }
});

enrutador.get('/carts/:cid', async (req, res) => {
    try {
        const carrito = await carritoDAO.obtenerCarritoPorId(req.params.cid);
        if (!carrito) { return res.status(404).send("Carrito no encontrado"); }
        let total = 0;
        const productosConSubtotal = carrito.products.map(item => {
            if (item.product && typeof item.product.price === 'number') {
                const subtotal = item.product.price * item.quantity;
                total += subtotal;
                return { product: item.product, quantity: item.quantity, subtotal: subtotal };
            }
            return item;
        });
        res.render('layouts/cart', {
            titulo: "Vista del Carrito",
            id_carrito: carrito._id,
            productos: productosConSubtotal,
            total: total
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista del carrito: " + error.message);
    }
});

enrutador.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { titulo: "Tiempo Real - Productos" });
    } catch (error) {
        res.status(500).send("Error al cargar la página en tiempo real");
    }
});

export default enrutador;