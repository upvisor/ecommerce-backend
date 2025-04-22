import {Router} from 'express'
import {commit, create, refund, status} from '../controllers/transbank.controllers.js'
import pkg from 'transbank-sdk'
const { WebpayPlus } = pkg

const router = Router()

router.use(function (req, res, next) {
  if (process.env.WPP_CC && process.env.WPP_KEY) {
    WebpayPlus.configureForProduction(process.env.WPP_CC, process.env.WPP_KEY)
  } else {
    WebpayPlus.configureForTesting()
  }
  next()
})

router.post("/transbank/create", create)

router.post("/transbank/commit", commit)

router.post("/transbank/status", status)

router.post("/transbank/refund", refund)

export default router