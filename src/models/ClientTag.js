import mongoose from 'mongoose'

const ClientTagSchema = mongoose.Schema({
  tag: { type: String, required: true, unique: true }
}, {
  timestamps: true
})

const ClientTag = mongoose.models.ClientTag || mongoose.model('ClientTag', ClientTagSchema)

export default ClientTag