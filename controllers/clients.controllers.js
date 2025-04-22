import Client from '../models/Client.js'

export const createClient = async (req, res) => {
    try {
        const client = await Client.findOne({ email: req.body.email })
        if (client) {
            const clientTagsSet = new Set(client.tags)
            const reqBodyTagsSet = new Set(req.body.tags)
            reqBodyTagsSet.forEach(tag => clientTagsSet.add(tag))
            const updatedTags = Array.from(clientTagsSet)
            client.tags = updatedTags
            const editClient = await Client.findByIdAndUpdate(client._id, { ...req.body, tags: updatedTags }, { new: true })
            return res.json(editClient)
        } else {
            const newClient = new Client(req.body)
            const newClientSave = await newClient.save()
            return res.json(newClientSave)
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updatedClient = async (req, res) => {
    try {
        const client = await Client.findOne({ email: req.params.email })
        const clientTagsSet = new Set(client.tags)
        const reqBodyTagsSet = new Set(req.body.tags)
        reqBodyTagsSet.forEach(tag => clientTagsSet.add(tag))
        const updatedTags = Array.from(clientTagsSet)
        const editClient = await Client.findByIdAndUpdate(client._id, { ...req.body, tags: updatedTags }, { new: true })
        return res.json(editClient)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getClients = async (req, res) => {
    try {
        const clients = await Client.find().lean()
        return res.json(clients)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getClient = async (req, res) => {
    try {
        const client = await Client.findOne({ email: req.params.email })
        return res.json(client)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}