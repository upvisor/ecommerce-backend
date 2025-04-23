import {Router} from 'express'
import { createDescription } from '../controllers/aiDescriptionProduct.controllers.js'

const router = Router()

router.post('/ai-description-product', createDescription)

export default router