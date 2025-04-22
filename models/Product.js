import mongoose from 'mongoose'

const ProductSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    images: [{ public_id: { type: String }, url: { type: String } }],
    price: { type: Number, required: true },
    beforePrice: { type: Number },
    stock: [{ date: { type: Date }, stock: { type: Number } }],
    stockReset: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    variations: [{ name: { type: String, required: true }, image: { public_id: { type: String }, url: { type: String } }, stock: [{ date: { type: Date }, stock: { type: Number } }], stockReset: { type: Number, required: true } }],
    packs: [{ quantity: { type: Number, required: true }, price: { type: Number, required: true }, image: { public_id: { type: String }, url: { type: String } } }],
    hour: { type: String, required: true },
    state: { type: Boolean, required: true }
}, {
    timestamps: true
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

export default Product