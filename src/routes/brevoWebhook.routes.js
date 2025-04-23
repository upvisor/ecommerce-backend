import {Router} from 'express'
import { getStatus } from '../controllers/brevoWebhook.controllers.js'

const router = Router()

router.post('/brevo-webhook', getStatus)

export default router