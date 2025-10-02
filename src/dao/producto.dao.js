// src/dao/producto.dao.js
const { promises: fs } = require('fs');
const { v4: uuidv4 } = require('uuid');

class ProductoDAO {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    async #leerArchivo() {
        try {
            const datos = await fs.readFile(this.rutaArchivo, 'utf-8');
            return JSON.parse(datos);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw new Error(`Error al leer el archivo: ${error.message}`);
        }
    }

    async #escribirArchivo(datos) {
        await fs.writeFile(this.rutaArchivo, JSON.stringify(datos, null, 2));
    }

    async obtenerProductos() {
        return await this.#leerArchivo();
    }

    async agregarProducto(producto) {
        const productos = await this.#leerArchivo();
        if (!producto.title || !producto.description || !producto.code || !producto.price || !producto.stock || !producto.category) {
            throw new Error("Faltan campos obligatorios para agregar el producto.");
        }
        const nuevoProducto = {
            id: uuidv4(),
            status: producto.status !== undefined ? producto.status : true,
            thumbnails: producto.thumbnails || [],
            ...producto
        };
        productos.push(nuevoProducto);
        await this.#escribirArchivo(productos);
        return nuevoProducto;
    }

    async obtenerProductoPorId(id) {
        const productos = await this.#leerArchivo();
        const producto = productos.find(p => p.id === id);
        if (!producto) throw new Error("Producto no encontrado.");
        return producto;
    }

    async actualizarProducto(id, camposAActualizar) {
        const productos = await this.#leerArchivo();
        const indice = productos.findIndex(p => p.id === id);
        if (indice === -1) throw new Error("Producto no encontrado para actualizar.");
        
        const productoActualizado = { ...productos[indice], ...camposAActualizar };
        delete productoActualizado.id;
        productos[indice] = { ...productos[indice], ...productoActualizado };
        
        await this.#escribirArchivo(productos);
        return productos[indice];
    }

    async eliminarProducto(id) {
        let productos = await this.#leerArchivo();
        const productosFiltrados = productos.filter(p => p.id !== id);
        if (productos.length === productosFiltrados.length) {
            throw new Error("Producto no encontrado para eliminar.");
        }
        await this.#escribirArchivo(productosFiltrados);
    }
}

module.exports = { ProductoDAO };