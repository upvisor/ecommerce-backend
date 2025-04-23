import Session from '../models/Session.js'

export const createSession = async (req, res) => {
    try {
        const newSession = new Session(req.body)
        const newSessionSave = await newSession.save()
        return res.json(newSessionSave)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
        return res.json(sessions)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}