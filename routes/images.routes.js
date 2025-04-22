import { Router } from 'express'
import { newImage, ImageDelete } from '../controllers/images.controllers.js'

const router = Router()

router.post('/image', newImage)

router.post('/delete-image', ImageDelete)

export default router