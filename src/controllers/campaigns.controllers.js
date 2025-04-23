import Email from '../models/Email.js'
import Client from '../models/Client.js'
import StoreData from '../models/StoreData.js'
import { sendEmail } from '../utils/sendEmail.js'

export const createCampaign = async (req, res) => {
    try {
        const { address, affair, summary, title, paragraph, buttonText, url, date } = req.body
        const newCampaign = new Email({ address, affair, summary, title, paragraph, buttonText, url, date: date === undefined ? new Date() : date })
        await newCampaign.save()
        let subscribers = []
        if (address === 'Todos los suscriptores') {
            subscribers = await Client.find().lean()
        } else {
            subscribers = await Client.find({ tags: address }).lean()
        }
        const storeData = await StoreData.findOne().lean()
        sendEmail({ affair: affair, buttonText: buttonText, paragraph: paragraph, storeData: storeData, subscribers: subscribers, title: title, url: url, date: date === undefined ? undefined : date })
        return res.send(newCampaign)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Email.find().lean()
        return res.send(campaigns)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getCampaign = async (req, res) => {
    try {
        const campaign = await Email.findById(req.params.id)
        if (!campaign) {
            return res.sendStatus(404)
        }
        return res.send(campaign)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const deleteCampaign = async (req, res) => {
    try {
        const campaignDelete = await Email.findByIdAndDelete(req.params.id)
        return res.send(campaignDelete)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const editCampaign = async (req, res) => {
    try {
        const campaignEdit = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.json(campaignEdit)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}