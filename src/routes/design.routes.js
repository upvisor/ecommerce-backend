import { Router } from 'express'
import { createDesign, getDesign, updateDesign } from '../controllers/design.controllers.js'

const router = Router()

router.post('/design', createDesign)

router.get('/design', getDesign)

router.put('/design', updateDesign)

export default router