import {Router} from 'express'
import { createSession, getSessions } from '../controllers/session.controllers.js'

const router = Router()

router.post('/session', createSession)

router.get('/sessions', getSessions)

export default router