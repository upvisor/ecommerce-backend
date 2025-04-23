import mongoose from 'mongoose'

const PoliticsSchema = new mongoose.Schema({
    terms: { type: String },
    shipping: { type: String },
    privacy: { type: String },
    devolutions: { type: String }
}, {
    timestamps: true
})

const Politics = mongoose.models.Politics || mongoose.model('Politics', PoliticsSchema)

export default Politics