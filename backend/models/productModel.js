import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    featured: { type: Boolean, default: false },
    description: { type: String, required: true },
    details: [{
        key: { type: String, required: true },
        value: { type: String, required: true },
    }],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;