import {Router} from 'express'
import {getProducts, createProduct, updateProduct, deleteProduct, uploadImageProduct, getProductBySlug, getProductByCategory, updateStockProduct} from '../controllers/products.controllers.js'

const router = Router()

router.get('/products', getProducts)

router.post('/products', createProduct)

router.put('/products/:id', updateProduct)

router.delete('/products/:id', deleteProduct)

router.post('/product-image-upload', uploadImageProduct)

router.get('/products/:id', getProductBySlug)

router.put('/product/:id', updateStockProduct)

router.get('/products-category/:id', getProductByCategory)

export default router