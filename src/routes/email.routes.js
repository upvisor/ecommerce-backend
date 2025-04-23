import { Router } from 'express'
import { sendEmail } from '../controllers/email.controllers.js'

const router = Router()

router.post('/email/:id', sendEmail)

export default router