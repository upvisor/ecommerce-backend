import {Router} from 'express'
import { createTag, getTags } from '../controllers/clientTag.controller.js'

const router = Router()

router.post('/client-tag', createTag)

router.get('/client-tag', getTags)

export default router