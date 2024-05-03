const {faker} = require("@faker-js/faker");
const mongoose = require("mongoose");

const generateFakeEbayProvider = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        name: "ebay",
        logo: faker.lorem.sentence(),
        does_wiping: false
    };
};

const generateFakeCexProvider = () => {
    return {
        name: "cex",
        logo: faker.lorem.sentence(),
        does_wiping: false
    };
};

const generateFakeProvider = () => {
    return {
        name: faker.string.alpha(10),
        logo: faker.lorem.sentence(),
        does_wiping: false
    };
};

const generateFakeProviders = (count) => {
    const fakeProviders = [];
    for (let i = 0; i < count; i++) {
        fakeProviders.push(generateFakeProvider());
    }
    return fakeProviders;
};

module.exports = {
    generateFakeEbayProvider,
    generateFakeCexProvider,
    generateFakeProvider,
    generateFakeProviders
};
