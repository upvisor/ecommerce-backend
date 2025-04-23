import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to', db.connection.name)
    } catch (error) {
        console.error(error)
    }
}