import StoreData from '../models/StoreData.js'
import { sendEmail } from '../utils/sendEmail.js'

export const createSubscription = async (req, res) => {
    try {
        const storeData = await StoreData.findOne().lean()
        sendEmail({ address: req.body.email, affair: '¡Te damos la bienvenida a Blaspod Store!', paragraph: '¡Hola! Te queremos dar las gracias por suscribirte a nuestra lista, nos hace muy felices tenerte con nosotros.', buttonText: 'Visitar tienda', title: 'Te has suscrito a nuestra lista con exito', name: '', storeData: storeData, url: 'https://tienda-1.vercel.app/tienda' })
        return res.sendStatus(200)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}