import {Router} from 'express'
import { createSeo } from '../controllers/aiProductSeo.controllers.js'

const router = Router()

router.post('/ai-product-seo', createSeo)

export default router