// src/models/producto.model.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productoSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    thumbnails: { type: [String], default: [] }
});

productoSchema.plugin(mongoosePaginate);

const Product = mongoose.model('products', productoSchema);

export default Product;