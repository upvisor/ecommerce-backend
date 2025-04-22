import { Router } from 'express'
import { createClient, updatedClient, getClients, getClient } from '../controllers/clients.controllers.js'

const router = Router()

router.post('/client', createClient)

router.put('/client/:email', updatedClient)

router.get('/clients', getClients)

router.get('/client/:email', getClient)

export default router