export const setProductStockForDate = async (product, referenceDate) => {
    // Calcular la fecha de referencia considerando la hora del producto
    const referenceDateCalculated = calculateReferenceDate(referenceDate, product.hour);

    // Obtener solo la parte de la fecha en la zona horaria local
    const getLocalDateString = (date) => {
        const localDate = new Date(date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
        const day = String(localDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const referenceDateString = getLocalDateString(referenceDateCalculated);

    // Ajustar el stock del producto principal
    const mainStockForDate = product.stock.find(stockEntry => {
        const stockDateString = getLocalDateString(stockEntry.date);
        return stockDateString === referenceDateString;
    });

    product.stock = mainStockForDate ? mainStockForDate.stock : 0;

    // Ajustar el stock de cada variación
    for (const variation of product.variations) {
        const variationStockForDate = variation.stock.find(stockEntry => {
            const stockDateString = getLocalDateString(stockEntry.date);
            return stockDateString === referenceDateString;
        });
        variation.stock = variationStockForDate ? variationStockForDate.stock : 0;
    }

    return product;
};

export const getProductStockForDate = async (item, referenceDate) => {
    const getLocalDateString = (date) => {
        const localDate = new Date(date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
        const day = String(localDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const referenceDateString = getLocalDateString(referenceDate);

    const stockEntry = item.stock.find(stockItem => {
        const stockDateString = getLocalDateString(stockItem.date);
        return stockDateString === referenceDateString;
    });

    return stockEntry ? stockEntry.stock : 0;
};

export const calculateReferenceDate = (now, hour) => {
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes()
    const [targetHour, targetMinute] = hour.split(':').map(Number); // Extraer la hora y los minutos
    const referenceDate = new Date(now);

    if (Number(`${currentHour}${currentMinutes >= 10 ? currentMinutes : `0${currentMinutes}`}`) >= Number(`${targetHour}${targetMinute >= 10 ? targetMinute : `0${targetMinute}`}`)) {
        // Pasado de la hora límite, calcular para pasado mañana
        referenceDate.setDate(now.getDate() + 2);
    } else {
        // Antes de la hora límite, calcular para mañana
        referenceDate.setDate(now.getDate() + 1);
    }

    return referenceDate;
};