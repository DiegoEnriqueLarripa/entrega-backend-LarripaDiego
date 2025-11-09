// src/dao/producto.dao.js
import Product from '../models/producto.model.js';

class ProductoDAO {

    async obtenerProductosPaginados(limit = 10, page = 1, sort, query) {
        try {
            const options = {
                page,
                limit,
                lean: true
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            const resultado = await Product.paginate(query, options);
            return resultado;
        } catch (error) {
            console.error("Error al obtener productos paginados en el DAO:", error);
            throw new Error("Error al obtener productos paginados");
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await Product.findById(id).lean();
            if (!producto) {
                throw new Error("Producto no encontrado.");
            }
            return producto;
        } catch (error) {
            console.error(`Error al obtener producto por ID ${id}:`, error);
            throw new Error("Error al obtener producto por ID");
        }
    }

    async agregarProducto(productoData) {
        try {
            return await Product.create(productoData);
        } catch (error) {
            console.error("Error al agregar producto en el DAO:", error);
            throw new Error("Error al agregar el producto");
        }
    }

    async actualizarProducto(id, camposAActualizar) {
        try {
            const productoActualizado = await Product.findByIdAndUpdate(id, camposAActualizar, { new: true }).lean();
            if (!productoActualizado) {
                throw new Error("Producto no encontrado para actualizar.");
            }
            return productoActualizado;
        } catch (error) {
            console.error(`Error al actualizar producto ${id}:`, error);
            throw new Error("Error al actualizar el producto");
        }
    }

    async eliminarProducto(id) {
        try {
            const productoEliminado = await Product.findByIdAndDelete(id);
            if (!productoEliminado) {
                throw new Error("Producto no encontrado para eliminar.");
            }
            return productoEliminado;
        } catch (error) {
            console.error(`Error al eliminar producto ${id}:`, error);
            throw new Error("Error al eliminar el producto");
        }
    }
}

export const productoDAO = new ProductoDAO();