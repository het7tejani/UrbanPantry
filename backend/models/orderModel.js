import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
        },
    }],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;