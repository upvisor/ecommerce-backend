import mongoose from 'mongoose'

const SellSchema = mongoose.Schema({
    buyOrder: { type: String, required: true, unique: true },
    product: { type: String, required: true },
    variation: { name: { type: String }, image: { type: String } },
    pack: [{ quantity: { type: Number }, image: { type: String }, price: { type: Number }, variations: [{ name: { type: String }, image: { type: String } }] }],
    date: { type: Date, required: true },
    pay: { method: { type: String }, state: { type: String } },
    shipping: { method: { type: String }, price: { type: Number }, state: { type: String } },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    detail: { type: String },
    city: { type: String, required: true },
    region: { type: String, required: true }
}, {
    timestamps: true
})

const Sell = mongoose.models.Sell || mongoose.model('Sell', SellSchema)

export default Sell