import {Router} from 'express'
import { createStoreData, getStoreData } from '../controllers/storeData.controllers.js'

const router = Router()

router.post('/store-data', createStoreData)

router.get('/store-data', getStoreData)

export default router