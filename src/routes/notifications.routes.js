import {Router} from 'express'
import { createNotification, getNotifications, getUltimateNotifications, viewNotification } from '../controllers/notifications.controllers.js'

const router = Router ()

router.post('/notification', createNotification)

router.get('/notifications', getNotifications)

router.get('/notifications/ultimate', getUltimateNotifications)

router.put('/notifications/:id', viewNotification)

export default router