import Shop from '../models/Shop.js'

export const createShopData = async (req, res) => {
    try {
        const newShopData = new Shop(req.body)
        const newShopDataSave = await newShopData.save()
        return res.json(newShopDataSave)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const editShopData = async (req, res) => {
    try {
        const editShopData = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.json(editShopData)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getShopData = async (req, res) => {
    try {
        const shopData = await Shop.findOne().lean()
        return res.json(shopData)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}