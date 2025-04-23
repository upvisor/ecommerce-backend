import PaymentGateway from '../models/PaymentGateway.js'

export const createPayment = async (req, res) => {
    try {
        const newPayment = new PaymentGateway(req.body)
        await newPayment.save()
        return res.send(newPayment)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getPayments = async (req, res) => {
    try {
        const payments = await PaymentGateway.find().lean()
        return res.send(payments)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}