import mongoose from 'mongoose'

const ChatSchema = mongoose.Schema({
    senderId: { type: String, required: true },
    message: { type: String },
    response: { type: String },
    agent: { type: Boolean, required: true },
    adminView: { type: Boolean },
    userView: { type: Boolean },
    shop: { type: Number }
}, {
    timestamps: true
})

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatSchema)

export default ChatMessage