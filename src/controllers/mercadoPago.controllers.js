import mercadopage from "mercadopago"

export const createOrder = async (req, res) => {
  mercadopage.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
  })

  try {
    const result = await mercadopage.preferences.create({
      items: req.body,
      back_urls: {
        success: `${process.env.WEB_URL}/procesando-pago`,
        pending: `${process.env.WEB_URL}/procesando-pago`,
        failure: `${process.env.WEB_URL}/procesando-pago`,
      },
    })

    // res.json({ message: "Payment creted" })
    res.json(result.body)
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" })
  }
}

export const receiveWebhook = async (req, res) => {
  try {
    return res.json({
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something goes wrong" })
  }
}