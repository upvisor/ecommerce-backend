import mongoose from 'mongoose'

const SessionSchema = mongoose.Schema({
    page: { type: String }
}, {
    timestamps: true
})

const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema)

export default Session