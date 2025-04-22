import Login from '../models/Login.js'
import bcrypt from 'bcryptjs'

export const createLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(email)) return res.send({ message: 'El email no es valido' })
        if (password.length < 6) return res.send({ message: 'La contraseña tiene que tener minimo 6 caracteres' })
        const user = await Login.findOne({ email: email })
        if (user) return res.send({ message: 'El email ya esta registrado' })
        const hashedPassword = await bcrypt.hash(password, 12)
        const newAccount = new Login({ email, password: hashedPassword })
        const accountSave = await newAccount.save()
        return res.json(accountSave)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const verificationLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const findData = await Login.findOne({ email: email.toLowerCase() }).select('+password')
        if (!findData) return res.status(401).json({ error: 'Credenciales invalidas' })
        const passwordMatch = await bcrypt.compare(password, findData.password)
        if (!passwordMatch) return res.status(401).json({ error: 'Credenciales invalidas' })
        const { password: pwd, ...dataWithoutPassword } = findData._doc;
        return res.json(dataWithoutPassword)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}