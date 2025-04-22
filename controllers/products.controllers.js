import Product from '../models/Product.js'
import { scheduleStockReset } from '../utils/scheduledProducts.js'
import { setProductStockForDate, getProductStockForDate, calculateReferenceDate } from '../utils/productsStock.js'

export const getProductsAdmin = async (req, res) => {
    try {
        const now = new Date(); // Fecha y hora actuales

        // Determinar la fecha de referencia para el stock
        const referenceDate = new Date(now);
        const productPromises = [];

        // Consultar productos y ajustar el stock según la fecha de referencia
        const products = await Product.find().lean();
        
        for (const product of products) {
            productPromises.push(setProductStockForDate(product, referenceDate));
        }

        const updatedProducts = await Promise.all(productPromises);

        return res.send(updatedProducts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        const productStock = req.body.stock; // Stock del producto principal
        const today = new Date();

        // Inicializar el stock del producto principal
        if (!Array.isArray(productData.stock)) {
            productData.stock = [];
        }

        // Inicializar el array de variaciones si no es un array
        if (!Array.isArray(productData.variations)) {
            productData.variations = [];
        }

        // Rellenar el stock del producto principal
        for (let i = 0; i < 5; i++) {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + i + 1);
            productData.stock.push({
                date: futureDate,
                stock: i === 0 ? productStock : productData.stockReset // Aplicar el stock inicial el primer día
            });
        }

        // Rellenar el stock de cada variación
        for (const variation of productData.variations) {
            const variationStock = Number(variation.stock) || variation.stockReset; // Stock inicial de la variación
            if (!Array.isArray(variation.stock)) {
                variation.stock = [];
            }
            for (let i = 0; i < 5; i++) {
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + i + 1);
                variation.stock.push({
                    date: futureDate,
                    stock: i === 0 ? variationStock : variation.stockReset // Aplicar el stock inicial el primer día
                });
            }
        }

        // Crear y guardar el nuevo producto
        const newProduct = new Product(productData);
        const newProductSave = await newProduct.save();

        // Programar el reseteo del stock
        scheduleStockReset(newProductSave._id, newProductSave.hour);

        return res.json(newProductSave);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productData = req.body;
        const productStock = req.body.stock;
        const [targetHour, targetMinute] = req.body.hour.split(':').map(Number)
        const today = new Date();
        
        // Asegurarse de que los valores de stockReset sean números
        productData.stockReset = Number(productData.stockReset);
        for (const variation of productData.variations) {
            variation.stockReset = Number(variation.stockReset);
        }
        
        // Inicializar el stock del producto principal si no es un array
        if (!Array.isArray(productData.stock)) {
            productData.stock = [];
        }

        // Inicializar el array de variaciones si no es un array
        if (!Array.isArray(productData.variations)) {
            productData.variations = [];
        }

        // Rellenar o actualizar el stock del producto principal
        const initialProductStock = Number(productStock) || productData.stockReset;
        if (productData.stock.length === 0) {
            for (let i = 0; i < 5; i++) {
                const futureDate = new Date(today);
                if (Number(`${today.getHours()}${today.getMinutes() >= 10 ? today.getMinutes() : `0${today.getMinutes()}`}`) >= Number(`${targetHour}${Number(targetMinute) >= 10 ? targetMinute : `0${targetMinute}`}`)) {
                    futureDate.setDate(today.getDate() + i + 2);
                    productData.stock.push({
                        date: futureDate,
                        stock: i === 0 ? initialProductStock : productData.stockReset // Aplicar el stock inicial el primer día
                    });
                } else {
                    futureDate.setDate(today.getDate() + i + 1);
                    productData.stock.push({
                        date: futureDate,
                        stock: i === 0 ? initialProductStock : productData.stockReset // Aplicar el stock inicial el primer día
                    });
                }
            }
        } else {
            for (let i = 0; i < productData.stock.length; i++) {
                productData.stock[i].stock = i === 0 ? initialProductStock : productData.stockReset; // Aplicar el stock inicial el primer día
            }
        }

        // Rellenar o actualizar el stock de cada variación
        for (const variation of productData.variations) {
            const initialVariationStock = Number(variation.stock) || variation.stockReset;
            if (!Array.isArray(variation.stock)) {
                variation.stock = [];
            }
            if (variation.stock.length === 0) {
                for (let i = 0; i < 5; i++) {
                    const futureDate = new Date(today);
                    if (Number(`${today.getHours()}${today.getMinutes() >= 10 ? today.getMinutes() : `0${today.getMinutes()}`}`) >= Number(`${targetHour}${Number(targetMinute) >= 10 ? targetMinute : `0${targetMinute}`}`)) {
                        futureDate.setDate(today.getDate() + i + 2);
                        variation.stock.push({
                            date: futureDate,
                            stock: i === 0 ? initialVariationStock : variation.stockReset // Aplicar el stock inicial el primer día
                        });
                    } else {
                        futureDate.setDate(today.getDate() + i + 1);
                        variation.stock.push({
                            date: futureDate,
                            stock: i === 0 ? initialVariationStock : variation.stockReset // Aplicar el stock inicial el primer día
                        });
                    }
                }
            } else {
                for (let i = 0; i < variation.stock.length; i++) {
                    variation.stock[i].stock = i === 0 ? initialVariationStock : variation.stockReset; // Aplicar el stock inicial el primer día
                }
            }
        }

        // Actualizar el producto en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });

        // Programar el reseteo del stock
        scheduleStockReset(updatedProduct._id, updatedProduct.hour);

        return res.json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateStockProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const operation = req.body.stock === 'add' ? 1 : -1;

        // Actualizar el stock general del producto
        const generalStock = product.stock.find(stk => 
            new Date(stk.date).getDate() === new Date(req.body.date).getDate()
        );
        if (generalStock) {
            generalStock.stock += operation * Number(req.body.pack.quantity);
        }

        // Actualizar el stock de cada variación
        req.body.pack.variations.forEach(variationReq => {
            const variation = product.variations.find(vari => vari.name === variationReq.name);
            if (variation) {
                const variationStock = variation.stock.find(stk => 
                    new Date(stk.date).getDate() === new Date(req.body.date).getDate()
                );
                if (variationStock) {
                    // Ajustar el stock de cada variación individualmente
                    variationStock.stock += operation * (Number(req.body.pack.quantity) / req.body.pack.variations.length);
                }
            }
        });

        const updateProduct = await Product.findByIdAndUpdate(req.params.id, product, { new: true });
        return res.json(updateProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productRemoved = await Product.findByIdAndDelete(req.params.id)
        if (!productRemoved) return res.sendStatus(404)
        if (productRemoved.images.length) {
            productRemoved.images.map(async (image) => await deleteImage(image.public_id))
        }
        if (productRemoved.variations.variations.length) {
            productRemoved.variations.variations.map(async (variation) => await deleteImage(variation.image.public_id))
        }
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getProductBySlugAdmin = async (req, res) => {
    try {
        const now = new Date(); // Fecha y hora actuales

        const product = await Product.findOne({ slug: req.params.slug }).lean(); // Usar lean() para obtener un objeto plano

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Determinar la fecha de referencia para el stock
        const referenceDate = calculateReferenceDate(now, product.hour);

        // Ajustar el stock del producto para la fecha de referencia
        product.stock = await getProductStockForDate(product, referenceDate);

        // Ajustar el stock de las variaciones del producto
        if (product.variations && product.variations.length > 0) {
            for (let i = 0; i < product.variations.length; i++) {
                product.variations[i].stock = await getProductStockForDate(product.variations[i], referenceDate);
            }
        }

        return res.send(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).lean()
        return res.json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getProductByName = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name }).lean()
        return res.json(product)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}