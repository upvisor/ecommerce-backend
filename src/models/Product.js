import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ public_id: { type: String }, url: { type: String } }],
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  beforePrice: { type: Number },
  cost: { type: Number },
  timeOffer: { type: String },
  variations: { nameVariation: { type: String }, formatVariation: { type: String }, nameVariations: [{ variation: { type: String }, colorVariation: { type: String } }], nameSubVariation: { type: String }, formatSubVariation: { type: String }, nameSubVariations: [{ subVariation: { type: String }, colorSubVariation: { type: String } }], nameSubVariation2: { type: String }, formatSubVariation2: { type: String }, nameSubVariations2: [{ subVariation2: { type: String }, colorSubVariation2: { type: String } }], variations: [{ variation: { type: String }, subVariation: { type: String }, subVariation2: { type: String }, stock: { type: Number }, sku: { type: String }, image: { public_id: { type: String }, url: { type: String } } }] },
  productsOffer: [{ productsSale: [], price: { type: Number, required: true } }],
  slug: { type: String, required: true, unique: true },
  tags: [{ type: String }],
  category: { category: { type: String, required: true }, slug: { type: String, required: true } },
  reviews: [{ calification: { type: Number, required: true }, name: { type: String, required: true }, email: { type: String }, title: { type: String }, review: { type: String, required: true }, createdAt: { type: Date } }],
  state: { type: Boolean, required: true },
  titleSeo: { type: String },
  descriptionSeo: { type: String },
  nameVariations: { type: String },
  quantityOffers: [{ quantity: { type: Number }, descount: { type: Number } }],
  informations: [{ title: { type: String }, description: { type: String }, image: { public_id: { type: String }, url: { type: String } }, align: { type: String, required: true } }]
},{
  timestamps: true
})

productSchema.index({ name: 'text', tags: 'text' })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product