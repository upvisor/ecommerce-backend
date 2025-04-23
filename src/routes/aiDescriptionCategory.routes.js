import {Router} from 'express'
import { createDescription } from '../controllers/aiDescriptionCategory.controllers.js'

const router = Router()

router.post('/ai-description-category', createDescription)

export default router