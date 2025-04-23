import { Router } from 'express'
import { createPayment, getPayments } from '../controllers/paymentGateway.controllers.js'

const router = Router()

router.post('/payment-gateway', createPayment)

router.get('/payment-gateway', getPayments)

export default router