import StoreData from '../models/StoreData.js'
import {uploadImage, deleteImage} from '../libs/cloudinary.js'

export const createStoreData = async (req, res) => {
    try {
        const data = await StoreData.findOne().lean()
        if (data) {
            const deleteStoreData = await StoreData.findOneAndDelete(data._id)
            if (deleteStoreData.logo.url) {
                await deleteImage(deleteStoreData.logo.public_id)
            }
            if (deleteStoreData.logoWhite.url) {
                await deleteImage(deleteStoreData.logoWhite.public_id)
            }
        }
        const storeData = new StoreData(req.body)
        await storeData.save()
        return res.json(storeData)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getStoreData = async (req, res) => {
    try {
        const storeData = await StoreData.findOne().lean()
        return res.json(storeData)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}