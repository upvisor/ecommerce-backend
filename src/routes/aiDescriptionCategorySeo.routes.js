import {Router} from 'express'
import { createDescriptionSeo } from '../controllers/aiDescriptionCategorySeo.controllers.js'

const router = Router()

router.post('/ai-description-category-seo', createDescriptionSeo)

export default router