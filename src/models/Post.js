import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    state: { type: Boolean, required: true },
    image: { public_id: '', url: '' },
    description: { type: String, required: true },
    titleSeo: { type: String },
    descriptionSeo: { type: String }
}, {
    timestamps: true
})

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema)

export default Post