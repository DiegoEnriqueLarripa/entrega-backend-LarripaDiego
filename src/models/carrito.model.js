import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: { type: Number, required: true }
            }
        ],
        default: []
    }
});

const Cart = mongoose.model('carts', carritoSchema);

export default Cart;