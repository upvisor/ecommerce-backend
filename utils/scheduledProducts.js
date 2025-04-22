import Product from '../models/Product.js'
import cron from 'node-cron'
import scheduledTasks from './scheduledTasks.js'

export const scheduleStockReset = (productId, hour) => {
    const id = productId.toString();

    if (scheduledTasks.hasTask(id)) {
        scheduledTasks.getTask(id).stop();
        scheduledTasks.deleteTask(id);
    }

    const [hours, minutes] = hour.split(':').map(Number);

    const task = cron.schedule(`${minutes} ${hours} * * *`, async () => {
        try {
            const product = await Product.findById(productId);
            if (product) {
                // Actualizar el stock del producto principal
                const lastStockDay = new Date(product.stock[product.stock.length - 1].date);
                lastStockDay.setDate(lastStockDay.getDate() + 2);
                product.stock.push({
                    date: lastStockDay,
                    stock: product.stockReset
                });

                // Limitar el stock a los últimos 5 días
                if (product.stock.length > 5) {
                    product.stock.shift();
                }

                // Actualizar el stock de cada variación
                for (const variation of product.variations) {
                    if (variation.stock.length > 0) {
                        const lastVariationStockDay = new Date(variation.stock[variation.stock.length - 1].date);
                        lastVariationStockDay.setDate(lastVariationStockDay.getDate() + 2);
                        variation.stock.push({
                            date: lastVariationStockDay,
                            stock: variation.stockReset
                        });

                        // Limitar el stock de la variación a los últimos 5 días
                        if (variation.stock.length > 5) {
                            variation.stock.shift();
                        }
                    }
                }

                await product.save();
                console.log(`New stock day added for product ${product.name} and its variations at ${hours}:${minutes}`);
            }
        } catch (error) {
            console.error(`Error adding new stock day for product ${productId} and its variations:, error`);
        }
    });

    scheduledTasks.setTask(id, task);
};

export const initializeScheduledTasks = async () => {
    try {
      const products = await Product.find();
      for (const product of products) {
        scheduleStockReset(product._id, product.hour);
      }
    } catch (error) {
      console.error('Error initializing scheduled tasks:', error);
    }
  };
