import Sell from '../models/Sell.js'
import Product from '../models/Product.js'

export const createSell = async (req, res) => {
    try {
        const sells = await Sell.countDocuments()
        const newSell = new Sell({ ...req.body, buyOrder: `BELUD-${sells + 1000}` })
        const newSellSave = await newSell.save()
        res.json(newSellSave)
        setTimeout(async () => {
            const sell = await Sell.findById(newSellSave._id)
            if (sell.pay.state !== 'Pago realizado') {
                const product = await Product.findOne({ name: sell.product })

                // Actualizar el stock general del producto
                const generalStock = product.stock.find(stk => 
                    new Date(stk.date).getDate() === new Date(sell.date).getDate()
                )
                if (generalStock) {
                    generalStock.stock += 1 * Number(sell.pack.quantity)
                }

                // Actualizar el stock de cada variación
                sell.pack.variations.forEach(variationReq => {
                    const variation = product.variations.find(vari => vari.name === variationReq.name)
                    if (variation) {
                        const variationStock = variation.stock.find(stk => 
                            new Date(stk.date).getDate() === new Date(sell.date).getDate()
                        );
                        if (variationStock) {
                            // Ajustar el stock de cada variación individualmente
                            variationStock.stock += 1 * (Number(sell.pack.quantity) / sell.pack.variations.length)
                        }
                    }
                })

                await Product.findByIdAndUpdate(product._id, product, { new: true })
            }
        }, 10 * 60 * 1000)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const editSell = async (req, res) => {
    try {
        const editSell = await Sell.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.json(editSell)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getSells = async (req, res) => {
    try {
        const sells = await Sell.find().lean()
        return res.json(sells)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getSell = async (req, res) => {
    try {
        const sell = await Sell.findById(req.params.id)
        return res.json(sell)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getSellsClient = async (req, res) => {
    try {
        const sells = await Sell.find({ email: req.params.email })
        return res.json(sells)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}