const {faker} = require("@faker-js/faker");
const generateFakeQuote = () => {
    return {
        device: faker.database.mongodbObjectId(),
        provider: faker.database.mongodbObjectId(),
        value: faker.number.int({ min: 0, max: 500 }),
        state: faker.number.int({ min: 0, max: 5 }),
        url: faker.internet.url(), // 示例 URL
        expiry: faker.date.future(), // 当前日期作为到期日期
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