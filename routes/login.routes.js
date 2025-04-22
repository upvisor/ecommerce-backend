import { Router } from 'express'
import { createLogin, verificationLogin } from '../controllers/login.controllers.js'

const router = Router()

router.post('/login-create', createLogin)

router.post('/login', verificationLogin)

export default router