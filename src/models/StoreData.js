import mongoose from 'mongoose'

const StoreDataSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  address: { type: String },
  departament: { type: String },
  region: { type: String },
  city: { type: String },
  schedule: {
    monday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
    tuesday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
    wednesday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
    thursday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
    friday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
    saturday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
    sunday: { state: { type: Boolean, required: true }, open: { type: String }, close: { type: String } },
  },
  logo: { public_id: { type: String }, url: { type: String } },
  logoWhite: { public_id: { type: String }, url: { type: String } },
  instagram: { type: String },
  facebook: { type: String },
  tiktok: { type: String },
  whatsapp: { type: String }
}, {
  timestamps: true
})

const StoreData = mongoose.models.StoreData || mongoose.model('StoreData', StoreDataSchema)

export default StoreData