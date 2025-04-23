import { Router } from 'express'
import { createDomain, getDomain } from '../controllers/domain.controllers.js'

const router = Router()

router.post('/domain', createDomain)

router.get('/domain', getDomain)

export default router