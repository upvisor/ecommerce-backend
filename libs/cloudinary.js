import { v2 } from 'cloudinary'

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadImage = async filePath => {
    return await v2.uploader.upload(filePath, {
        folder: 'Belen'
    })
}

export const deleteImage = async id => {
    return await v2.uploader.destroy(id)
}