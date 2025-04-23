import { Router } from 'express'
import { createSubscription } from '../controllers/subscription.controllers.js'

const router = Router()

router.post('/subscription', createSubscription)

export default router