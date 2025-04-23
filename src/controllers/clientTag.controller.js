import ClientTag from '../models/ClientTag.js'

export const createTag = async (req, res) => {
  try {
    const newClientTag = new ClientTag(req.body)
    await newClientTag.save()
    return res.json(newClientTag)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getTags = async (req, res) => {
  try {
    const clientTags = await ClientTag.find()

    if (!clientTags) {
      return undefined
    }

    return res.json(clientTags)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}