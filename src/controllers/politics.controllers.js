import Politics from '../models/Politics.js'

export const createPolitics = async (req, res) => {
    try {
        const data = await Politics.findOne().lean()
        if (data) {
            await Politics.findOneAndDelete(data._id)
        }
        const newPolitics = new Politics(req.body)
        await newPolitics.save()
        return res.send(newPolitics)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getPolitics = async (req, res) => {
    try {
        const politics = await Politics.findOne().lean()
        if (!politics) return res.sendStatus(204)
        return res.send(politics)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getPolitic = async (req, res) => {
    try {
        const politic = await Politics.findOne().select(`${req.params.id}`).lean()
        if (!politic) return res.sendStatus(204)
        return res.send(politic)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}