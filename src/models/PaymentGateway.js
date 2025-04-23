import mongoose from 'mongoose'

const PaymentGatewaySchema = new mongoose.Schema({
    transbank: { active: { type: Boolean, required: true }, commerceCode: { type: String }, apiKey: { type: String } },
    mercadoPago: { active: { type: Boolean, required: true }, accessToken: { type: String }, publicKey: { type: String } }
})

const PaymentGateway = mongoose.models.PaymentGateway || mongoose.model('PaymentGateway', PaymentGatewaySchema)

export default PaymentGateway