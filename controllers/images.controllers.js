import { uploadImage, deleteImage } from '../libs/cloudinary.js'
import fs from 'fs-extra'

export const newImage = async (req, res) => {
    try {
        let image
        if (req.files?.image) {
            const result = await uploadImage(req.files.image.tempFilePath)
            console.log(result)
            await fs.remove(req.files.image.tempFilePath)
            image = {
                url: result.secure_url,
                public_id: result.public_id
            }
            return res.json({image: image})
        } else {
            console.log('no llega la imagen')
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const ImageDelete = async (req, res) => {
    try {
        await deleteImage(req.body.public_id)
        return res.status(200)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}