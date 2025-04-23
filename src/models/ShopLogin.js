import mongoose from 'mongoose'

const ShopLoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true, select: false }
}, {
    timestamps: true
})

const ShopLogin = mongoose.models.ShopLogin || mongoose.model('ShopLogin', ShopLoginSchema)

export default ShopLogin