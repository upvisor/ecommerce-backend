import mongoose from 'mongoose'

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
}, {
    timestamps: true
})

const Login = mongoose.models.Login || mongoose.model('Login', LoginSchema)

export default Login