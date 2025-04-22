import { Router } from 'express'
import { createSell, editSell, getSells, getSell, getSellsClient } from '../controllers/sells.controllers.js'

const router = Router()

router.post('/sell', createSell)

router.put('/sell/:id', editSell)

router.get('/sells', getSells)

router.get('/sell/:id', getSell)

router.get('/sells-client/:email', getSellsClient)

export default router