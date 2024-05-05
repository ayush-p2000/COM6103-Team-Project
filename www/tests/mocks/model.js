const {faker} = require('@faker-js/faker');

const generateFakeModel = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        name: faker.string.alpha(10),
        brand: faker.database.mongodbObjectId(),
        deviceType: faker.database.mongodbObjectId(),
        properties: [
            {
                name: "picture",
                value: faker.image.url()
            },
            {
                name: "specifications",
                value: null
            },
            {
                name: "released",
                value: 2023
            },
        ],
        category: 2
    };
};

const generateFakeModels = (count) => {
    const fakeModels = [];
    for (let i = 0; i < count; i++) {
        fakeModels.push(generateFakeModel());
    }
    return fakeModels;
};

module.exports = {
    generateFakeModel,
    generateFakeModels
};