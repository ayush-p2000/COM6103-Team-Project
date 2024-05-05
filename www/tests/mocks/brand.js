const {faker} = require('@faker-js/faker');

const generateFakeBrand = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        name: faker.string.alpha(10),
        model: [],
    };
};

const generateFakeBrands = (count) => {
    const fakeBrands = [];
    for (let i = 0; i < count; i++) {
        fakeBrands.push(generateFakeBrand());
    }
    return fakeBrands;
};

module.exports = {
    generateFakeBrand,
    generateFakeBrands
};