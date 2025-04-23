import { Router } from 'express'
import { createPolitics, getPolitics, getPolitic } from '../controllers/politics.controllers.js'

const router = Router()

router.post('/politics', createPolitics)

router.get('/politics', getPolitics)

router.get('/politics/:id', getPolitic)

export default router