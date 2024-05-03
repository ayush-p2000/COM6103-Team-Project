const {faker} = require('@faker-js/faker');

const {generateFakeModel} = require("../mocks/model")

const generateFakeDevice = (user = faker.database.mongodbObjectId(),
                            state = 3) => {
    return {
        _id: faker.database.mongodbObjectId(),
        device_type: faker.database.mongodbObjectId(),
        brand: faker.database.mongodbObjectId(),
        model: generateFakeModel(),
        color: "Black",
        capacity: "128 Gb",
        years_used: faker.number.toString(),
        details: [
            {
                name: "functionality",
                value: faker.number.int({ min: 1, max: 5 }),
            },
            {
                name: "button",
                value: faker.number.int({ min: 1, max: 5 }),
            },
            {
                name: "camera",
                value: faker.number.int({ min: 1, max: 5 }),
            },
            {
                name: "battery",
                value: faker.number.int({ min: 1, max: 5 }),
            },
            {
                name: "body",
                value: faker.number.int({ min: 1, max: 5 }),
            },
            {
                name: "touchscreen",
                value: faker.number.int({ min: 1, max: 5 }),
            },
            {
                name: "display",
                value: faker.number.int({ min: 1, max: 5 }),
            },
        ],
        category: faker.number.int({ min: 0, max: 3 }),
        good_condition: false,
        state: state,
        data_service: faker.number.int({ min: 0, max: 2 }),
        additional_details: faker.lorem.sentence(),
        listing_user: user,
        photos: [
            {
                img_type: "image/jpeg",
                img_data: Buffer.from(faker.image.dataUri().split(',')[1], 'base64')
            },
        ],
        visible: true
    };
};

const generateFakeDevices = (count,user = faker.database.mongodbObjectId(),state) => {
    const fakeDevices = [];
    for (let i = 0; i < count; i++) {
        fakeDevices.push(generateFakeDevice(user,state));
    }
    return fakeDevices;
};



module.exports = {
    generateFakeDevice,
    generateFakeDevices
}