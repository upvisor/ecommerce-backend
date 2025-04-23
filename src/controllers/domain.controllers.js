import Domain from '../models/Domain.js'

export const createDomain = async (req, res) => {
    try {
        await Domain.findOneAndRemove().lean()
        const newDomain = new Domain(req.body)
        await newDomain.save()
        return res.send(newDomain)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getDomain = async (req, res) => {
    try {
        const domain = await Domain.findOne().lean()
        return res.send(domain)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}