const {faker} = require("@faker-js/faker");
const generateFakeQuote = (provider= faker.database.mongodbObjectId(),state,  date = new Date()) => {
    return {
        device: faker.database.mongodbObjectId(),
        provider: provider,
        value: faker.number.int({ min: 0, max: 500 }),
        state: state,
        url: faker.internet.url(),
        expiry: date,
        confirmation_details: {
            final_price: faker.number.int({ min: 0, max: 500 }),
            receipt_id: faker.number.int({ min: 1000, max: 5000}).toString() ,
            receipt_date: faker.date.recent(),
            receipt_image: {
                img_type: "image/jpeg",
                img_data: Buffer.from(faker.image.dataUri().split(',')[1], 'base64')
            }
        }
    };
};

module.exports = {
    generateFakeQuote
};
