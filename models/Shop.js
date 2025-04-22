import mongoose from 'mongoose'

const ShopSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    logo: { public_id: { type: String }, url: { type: String } },
    logoWhite: { public_id: { type: String }, url: { type: String } },
    bank: { bank: { type: String }, name: { type: String }, account: { type: String }, accountNumber: { type: Number }, rut: { type: String }, email: { type: String } }
}, {
    timestamps: true
})

const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema)

export default Shop