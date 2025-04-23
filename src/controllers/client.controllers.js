import Client from '../models/Client.js'
import Automatization from '../models/Automatization.js'
import StoreData from '../models/StoreData.js'
import Account from '../models/Account.js'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../utils/sendEmail.js'

export const createClient = async (req, res) => {
  try {
    const client = await Client.findOne({email: req.body.email}).lean()
    if (client) {
      const clientTagsSet = new Set(client.tags)
      const reqBodyTagsSet = new Set(req.body.tags)
      reqBodyTagsSet.forEach(tag => clientTagsSet.add(tag))
      const updatedTags = Array.from(clientTagsSet)
      client.tags = updatedTags
      const editClien = await Client.findByIdAndUpdate(client._id, client, { new: true })
      const automatizations = await Automatization.find().lean()
      const automatizationsClient = automatizations.filter(automatization => req.body.tags?.includes(automatization.address))
      let emails = []
      automatizationsClient.map(async (automatization) => {
          let previousDate = new Date()
          previousDate.setMinutes(previousDate.getMinutes() + 2)
          for (const email of automatization.automatization) {
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
          emails.map(async (email) => {
            const storeData = await StoreData.findOne().lean()
            sendEmail({ affair: email.affair, buttonText: email.buttonText, paragraph: email.paragraph, storeData: storeData, subscribers: [{ email: client.email, name: client.firstName }], title: email.title, url: email.url, date: email.date })
          })
      })
      return res.send(editClien)
    } else {
      const newClient = new Client(req.body)
      await newClient.save()
      const automatizations = await Automatization.find().lean()
      const automatizationsClient = automatizations.filter(automatization => req.body.tags?.includes(automatization.address) || automatization.address === 'Todos los suscriptores')
      let emails = []
      automatizationsClient.map(async (automatization) => {
          let previousDate = new Date()
          previousDate.setMinutes(previousDate.getMinutes() + 2)
          for (const email of automatization.automatization) {
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
          emails.map(async (email) => {
            const storeData = await StoreData.findOne().lean()
            sendEmail({ affair: email.affair, buttonText: email.buttonText, paragraph: email.paragraph, storeData: storeData, subscribers: [{ email: client.email, name: client.firstName }], title: email.title, url: email.url, date: email.date })
          })
      })
      return res.json(newClient)
    }
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find()

    if (!clients) {
      return undefined
    }

    return res.json(clients)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const updateClient = async (req, res) => {
  try {
    const updateClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.send(updateClient)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const updateClientEmail = async (req, res) => {
  try {
    const updateClient = await Client.findOneAndUpdate({ email: req.params.id }, req.body, { new: true })
    return res.send(updateClient)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)

    if (!client) {
      return undefined
    }

    return res.send(client)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getClientByEmail = async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.params.id }).lean()
    if (!client) return res.sendStatus(404)
    return res.send(client)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id)
    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const emailLower = email.toLowerCase()
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!regex.test(emailLower)) return res.send({ message: 'El email no es valido' })
    if (password.length < 6) return res.send({ message: 'La contraseña tiene que tener minimo 6 caracteres' })
    const user = await Account.findOne({ email: emailLower })
    if (user) return res.send({ message: 'El email ya esta registrado' })
    const hashedPassword = await bcrypt.hash(password, 12)
    const newAccount = new Account({ firstName, lastName, email: emailLower, password: hashedPassword })
    const accountSave = await newAccount.save()
    return res.send({ firstName: accountSave.firstName, lastName: accountSave.lastName, email: accountSave.email, _id: accountSave._id })
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getAccountData = async (req, res) => {
  try {
    const accountData = await Account.findById(req.params.id).lean()
    if (!accountData) return res.sendStatus(404)
    return res.send(accountData)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const editAccountData = async (req, res) => {
  try {
    const editAccountData = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.send(editAccountData)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}