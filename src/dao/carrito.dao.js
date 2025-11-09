import Cart from '../models/carrito.model.js';

class CarritoDAO {
    async crearCarrito() {
        try {
            return await Cart.create({ products: [] });
        } catch (error) {
            console.error("Error al crear carrito en el DAO:", error);
            throw new Error("Error al crear el carrito");
        }
    }

    async obtenerCarritoPorId(id) {
        try {
            const carrito = await Cart.findById(id).populate('products.product').lean();
            if (!carrito) {
                throw new Error("Carrito no encontrado.");
            }
            return carrito;
        } catch (error) {
            console.error(`Error al obtener carrito por ID ${id}:`, error);
            throw new Error("Error al obtener el carrito por ID");
        }
    }

    async agregarProductoAlCarrito(idCarrito, idProducto) {
        try {
            const carrito = await Cart.findById(idCarrito);
            if (!carrito) {
                throw new Error("Carrito no encontrado.");
            }

            const productoExistente = carrito.products.find(item => item.product.toString() === idProducto);

            if (productoExistente) {

                productoExistente.quantity += 1;
            } else {

                carrito.products.push({ product: idProducto, quantity: 1 });
            }

            return await carrito.save();
        } catch (error) {
            console.error(`Error al agregar producto al carrito ${idCarrito}:`, error);
            throw new Error("Error al agregar producto al carrito");
        }
    }

    async obtenerCarritos() {
        try {
            return await Cart.find().lean();
        } catch (error) {
            throw new Error("Error al obtener los carritos");
        }
    }

    async eliminarProductoDelCarrito(idCarrito, idProducto) {
        try {
            const carrito = await Cart.findById(idCarrito);
            if (!carrito) {
                throw new Error("Carrito no encontrado.");
            }

            carrito.products.pull({ product: idProducto });
            
            return await carrito.save();
        } catch (error) {
            console.error(`Error al eliminar producto del carrito ${idCarrito}:`, error);
            throw new Error("Error al eliminar producto del carrito");
        }
    }

    async actualizarProductosDelCarrito(idCarrito, nuevosProductos) {
        try {
            const carritoActualizado = await Cart.findByIdAndUpdate(
                idCarrito,
                { products: nuevosProductos },
                { new: true }
            ).populate('products.product').lean();

            if (!carritoActualizado) {
                throw new Error("Carrito no encontrado.");
            }
            return carritoActualizado;
        } catch (error) {
            console.error(`Error al actualizar productos del carrito ${idCarrito}:`, error);
            throw new Error("Error al actualizar productos del carrito");
        }
    }

    async actualizarCantidadProducto(idCarrito, idProducto, nuevaCantidad) {
        try {
            const carritoActualizado = await Cart.findOneAndUpdate(
                { _id: idCarrito, 'products.product': idProducto },
                { $set: { 'products.$.quantity': nuevaCantidad } },
                { new: true }
            ).populate('products.product').lean();
            
            if (!carritoActualizado) {
                throw new Error("Carrito o producto en el carrito no encontrado.");
            }
            return carritoActualizado;
        } catch (error) {
            console.error(`Error al actualizar cantidad del producto ${idProducto}:`, error);
            throw new Error("Error al actualizar la cantidad del producto");
        }
    }

    async vaciarCarrito(idCarrito) {
        try {
            const carritoVaciado = await Cart.findByIdAndUpdate(
                idCarrito,
                { products: [] },
                { new: true }
            );

            if (!carritoVaciado) {
                throw new Error("Carrito no encontrado.");
            }
            return carritoVaciado;
        } catch (error) {
            console.error(`Error al vaciar el carrito ${idCarrito}:`, error);
            throw new Error("Error al vaciar el carrito");
        }
    }
}

export const carritoDAO = new CarritoDAO();