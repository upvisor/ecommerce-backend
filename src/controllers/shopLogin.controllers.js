import ShopLogin from '../models/ShopLogin.js'
import bcrypt from 'bcryptjs'

export const createAccount = async (req, res) => {
    try {
        const { email, password } = req.body
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) return res.send({ message: 'El email no es valido' })
        if (password.length < 6) return res.send({ message: 'La contraseña tiene que tener minimo 6 caracteres' })
        const user = await ShopLogin.findOne({ email: email })
        if (user) return res.send({ message: 'El email ya esta registrado' })
        const hashedPassword = await bcrypt.hash(password, 12)
        const newAccount = new ShopLogin({ email, password: hashedPassword })
        const accountSave = await newAccount.save()
        return res.send({ email: accountSave.email, _id: accountSave._id })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getAccountData = async (req, res) => {
    try {
        const accountData = await ShopLogin.findById(req.params.id).lean()
        if (!accountData) return res.sendStatus(404)
        return res.send(accountData)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const editAccountData = async (req, res) => {
    try {
        const editAccountData = await ShopLogin.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.send(editAccountData)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
  }