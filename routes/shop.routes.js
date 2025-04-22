import { Router } from 'express'
import { createShopData, editShopData, getShopData } from '../controllers/shop.controllers.js'

const router = Router()

router.post('/shop-data', createShopData)

router.put('/shop-data/:id', editShopData)

router.get('/shop-data', getShopData)

export default router