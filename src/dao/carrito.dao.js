import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class CarritoDAO {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    async #leerArchivo() {
        try {
            const datos = await fs.readFile(this.rutaArchivo, 'utf-8');
            return JSON.parse(datos);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw new Error(`Error al leer el archivo de carritos: ${error.message}`);
        }
    }

    async #escribirArchivo(datos) {
        await fs.writeFile(this.rutaArchivo, JSON.stringify(datos, null, 2));
    }

    async crearCarrito() {
        const carritos = await this.#leerArchivo();
        const nuevoCarrito = { id: uuidv4(), products: [] };
        carritos.push(nuevoCarrito);
        await this.#escribirArchivo(carritos);
        return nuevoCarrito;
    }

    async obtenerCarritos() {
        return await this.#leerArchivo();
    }

    async obtenerCarritoPorId(idCarrito) {
        const carritos = await this.#leerArchivo();
        const carrito = carritos.find(c => c.id === idCarrito);
        if (!carrito) throw new Error("Carrito no encontrado.");
        return carrito;
    }

    async agregarProductoAlCarrito(idCarrito, idProducto) {
        const carritos = await this.#leerArchivo();
        const indiceCarrito = carritos.findIndex(c => c.id === idCarrito);
        if (indiceCarrito === -1) throw new Error("Carrito no encontrado.");

        const carrito = carritos[indiceCarrito];
        const indiceProducto = carrito.products.findIndex(p => p.product === idProducto);

        if (indiceProducto !== -1) {
            carrito.products[indiceProducto].quantity += 1;
        } else {
            carrito.products.push({ product: idProducto, quantity: 1 });
        }
        
        await this.#escribirArchivo(carritos);
        return carrito;
    }
}

