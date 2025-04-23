import AddCart from '../models/AddCart.js'
import ViewContent from '../models/ViewContent.js'
import Information from '../models/Information.js'
import Sell from '../models/Sell.js'
import Session from '../models/Session.js'

export const getStadistics = async (req, res) => {
  try {
    const sell = await Sell.find().select('total state -_id').lean()
    const sellFilter = sell.filter(sel => sel.state !== 'Pedido realizado').filter(sel => sel.state !== 'Cancelado')
    const totalSell = sellFilter.reduce((prev, curr) => prev + curr.total, 0)
    const viewContents = await ViewContent.countDocuments()
    const addCarts = await AddCart.countDocuments()
    const informations = await Information.countDocuments()
    const sessions = await Session.countDocuments()
    const sells = sellFilter.length
    return res.send({ totalSell: totalSell, viewContents: viewContents, addCarts: addCarts, informations: informations, sells: sells, sessions: sessions })
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

export const getStadisticsFiltered = async (req, res) => {
  try {
    const {dateInitial, dateLast} = req.body
    const dateInitialFormat = new Date(dateInitial)
    const dateLastFormat = new Date(dateLast)
    let stadistics = { totalSell: 0, viewContents: 0, addCarts: 0, informations: 0, sells: 0 }
    const sell = await Sell.find({ createdAt: { $gte: dateInitialFormat, $lte: dateLastFormat } }).select('total -_id').lean()
    const totalSell = sell.reduce((prev, curr) => prev + curr.total, 0)
    if (totalSell) {
      stadistics.totalSell = totalSell
    }
    const viewContents = await ViewContent.countDocuments({ createdAt: { $gte: dateInitialFormat, $lte: dateLastFormat } })
    if (viewContents) {
      stadistics.viewContents = viewContents
    }
    const addCarts = await AddCart.countDocuments({ createdAt: { $gte: dateInitialFormat, $lte: dateLastFormat } })
    if (addCarts) {
      stadistics.addCarts = addCarts
    }
    const informations = await Information.countDocuments({ createdAt: { $gte: dateInitialFormat, $lte: dateLastFormat } })
    if (informations) {
      stadistics.informations = informations
    }
    const sells = await Sell.countDocuments({ createdAt: { $gte: dateInitialFormat, $lte: dateLastFormat } })
    if (sells) {
      stadistics.sells = sells
    }
    return res.send(stadistics)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}