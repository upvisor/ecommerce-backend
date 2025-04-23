import {Router} from 'express'
import {getStadistics, getStadisticsFiltered} from '../controllers/stadistics.controllers.js'

const router = Router()

router.get('/stadistics', getStadistics)

router.post('/stadistics', getStadisticsFiltered)

export default router