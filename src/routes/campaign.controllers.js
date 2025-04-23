import { Router } from 'express'
import { createCampaign, getCampaigns, getCampaign, deleteCampaign, editCampaign } from '../controllers/campaigns.controllers.js'

const router = Router()

router.post('/new-campaign', createCampaign)

router.get('/campaigns', getCampaigns)

router.get('/campaign/:id', getCampaign)

router.delete('/campaign/:id', deleteCampaign)

router.put('/campagin/:id', editCampaign)

export default router
