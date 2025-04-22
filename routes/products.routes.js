import { Router } from 'express'
import { createProduct, deleteProduct, getProductBySlugAdmin, getProductsAdmin, updateProduct, getProductBySlug, updateStockProduct, getProductByName } from '../controllers/products.controllers.js'

const router = Router()

router.post('/product', createProduct)

router.put('/product/:id', updateProduct)

router.put('/product-stock/:id', updateStockProduct)

router.delete('/product/:id', deleteProduct)

router.get('/products-admin', getProductsAdmin)

router.get('/product/:slug', getProductBySlug)

router.get('/product-name/:name', getProductByName)

router.get('/product-admin/:slug', getProductBySlugAdmin)

export default router