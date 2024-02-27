/*
 * This controller should handle any operations related to the checkout process or payment processing
 */

function getCheckout(req, res, next) {
    res.render('payment/checkout', {})
}

function getCheckoutCompleted (req, res, next) {
    res.render('payment/checkout_complete', {title: 'Payment Completed', order: getMockPurchaseData()});
}

//TODO: Remove these once real retrieval is available
function getMockPurchaseData() {
    const {faker} = require('@faker-js/faker');

    const data = [];

    const devices = [
        'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
        'Samsung Galaxy S21', 'Samsung Galaxy S21+', 'Samsung Galaxy S21 Ultra', 'Samsung Galaxy Note20', 'Samsung Galaxy Note20 Ultra',
        'Google Pixel 5', 'Google Pixel 4a', 'Google Pixel 4a 5G',
        'Dell XPS 13', 'MacBook Pro', 'Lenovo ThinkPad X1', 'HP Spectre x360',
        'OnePlus 9', 'OnePlus 9 Pro', 'OnePlus 8T', 'OnePlus Nord',
        'Huawei P40', 'Huawei P40 Pro', 'Huawei Mate 40 Pro'
    ];

    const choices = [ "CEX", "GAME", "eBay", "Recycling"]

    const paymentMethod = ["PayPal", "Stripe"]

    const order = {
        id: faker.string.alpha(10),
        amount: faker.finance.amount(),
        referral_amount: faker.finance.amount({min: 1, max: 35}),
        currency: "£",
        date: faker.date.recent(),
        endpoint: faker.helpers.arrayElement(choices),
        paymentMethod: faker.helpers.arrayElement(paymentMethod),
        products: [
            {
                id: faker.string.uuid(),
                name: faker.helpers.arrayElement(devices),
                price: faker.finance.amount(),
                data_retrieval: faker.datatype.boolean(),
            },
        ],
    };

    return order;
}

module.exports = {
    getCheckout,
    getCheckoutCompleted
}