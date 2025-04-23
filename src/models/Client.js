import mongoose from 'mongoose'

const ClientSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: Number },
  address: { type: String },
  departament: { type: String },
  region: { type: String },
  city: { type: String },
  tags: [{ type: String }],
  emails: [{ id: { type: String }, subject: { type: String }, opened: { type: Boolean }, clicked: { type: Boolean } }]
}, {
  timestamps: true
})

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema)

export default Client