import {Router} from 'express'
import {createMessage, getMessages} from '../controllers/contact.controllers.js'

const router = Router()

router.post('/contact', createMessage)

router.get('/contact', getMessages)

export default router