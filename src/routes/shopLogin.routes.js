import {Router} from 'express'
import { createAccount, editAccountData, getAccountData } from '../controllers/shopLogin.controllers.js'

const router = Router()

router.post('/shop-login', createAccount)

router.get('/shop-login', getAccountData)

router.put('/shop-login', editAccountData)

export default router