import Automatization from '../models/Automatization.js'
import Client from '../models/Client.js'
import StoreData from '../models/StoreData.js'
import { sendEmail } from '../utils/sendEmail.js'

export const createAutomatization = async (req, res) => {
    try {
        const { address, name, automatization } = req.body
        const emails = []
        let previousDate = new Date()
        previousDate.setMinutes(previousDate.getMinutes() + 2)
        for (const email of automatization) {
            const currentDate = new Date(previousDate)
            if (email.time === 'Días') {
                currentDate.setDate(currentDate.getDate() + Number(email.number))
            } else if (email.time === 'Horas') {
                currentDate.setHours(currentDate.getHours() + Number(email.number))
            } else if (email.time === 'Minutos') {
                currentDate.setMinutes(currentDate.getMinutes() + Number(email.number))
            }
            email.date = currentDate
            emails.push(email)
            previousDate = currentDate
        }
        const newAutomatization = new Automatization({ address, name, automatization: emails })
        await newAutomatization.save()
        let subscribers = []
        if (address === 'Todos los suscriptores') {
            subscribers = await Client.find().lean()
        } else {
            subscribers = await Client.find({ tags: address }).lean()
        }
        emails.map(async (email) => {
            const storeData = await StoreData.findOne().lean()
            sendEmail({ affair: email.affair, buttonText: email.buttonText, paragraph: email.paragraph, storeData: storeData, subscribers: subscribers, title: email.title, url: email.url, date: email.date })
        })
        return res.send(newAutomatization)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getAutomatizations = async (req, res) => {
    try {
        const automatizations = await Automatization.find().lean()
        return res.send(automatizations)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getAutomatization = async (req, res) => {
    try {
        const automatization = await Automatization.findById(req.params.id).lean()
        if (!automatization) {
            return res.sendStatus(404)
        }
        return res.send(automatization)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const deleteAutomatization = async (req, res) => {
    try {
        const automatizationDelete = await Automatization.findByIdAndDelete(req.params.id)
        return res.send(automatizationDelete)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}