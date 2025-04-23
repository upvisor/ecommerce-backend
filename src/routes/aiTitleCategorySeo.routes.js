import {Router} from 'express'
import { createTitleSeo } from '../controllers/aiTitleCategorySeo.controllers.js'

const router = Router()

router.post('/ai-title-category-seo', createTitleSeo)

export default router