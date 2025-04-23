import Design from '../models/Design.js'

export const createDesign = async (req, res) => {
    try {
        const design = await Design.findOne()
        if (design) {
            await Design.findByIdAndDelete(design._id)
        }
        const newDesign = new Design(req.body)
        await newDesign.save()
        return res.send(newDesign)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getDesign = async (req, res) => {
    try {
        const design = await Design.findOne().lean()
        if (design === null) {
            return res.send([])
        }
        return res.send(design)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updateDesign = async (req, res) => {
    try {
        const updateDesign = await Design.findOneAndUpdate(req.body, { new: true })
        return res.send(updateDesign)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}