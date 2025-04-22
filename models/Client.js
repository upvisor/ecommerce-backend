import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    details: { type: String },
    city: { type: String },
    region: { type: String },
    tags: [{ type: String }],
    emails: [{ id: { type: String }, subject: { type: String }, opened: { type: Boolean }, clicked: { type: Boolean } }]
}, {
    timestamps: true
})

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema)

export default Client