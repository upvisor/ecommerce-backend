import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String },
  slug: { type: String, required: true, unique: true },
  image: { public_id: { type: String }, url: { type: String } },
  banner: { public_id: { type: String }, url: { type: String } },
  titleSeo: { type: String },
  descriptionSeo: { type: String }
}, {
  timestamps: true
})

const Category = mongoose.models.Categories || mongoose.model('Categories', categorySchema)

export default Category
