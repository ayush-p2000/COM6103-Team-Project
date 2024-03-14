const fixedToCurrency = (value, currency, places = 2) => {
    if (typeof value !== 'number') {
        return value;
    }

    const stringValue = value.toString();
    const integer = stringValue.slice(0, -places);
    const decimal = stringValue.slice(-places);

    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const formatted = `${currency}${formattedInteger}.${decimal}`;

    return formatted;
}

module.exports = fixedToCurrency;