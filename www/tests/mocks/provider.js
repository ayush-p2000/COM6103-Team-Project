const {faker} = require("@faker-js/faker");
const mongoose = require("mongoose");
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
    generateFakeProvider,
    generateFakeProviders
};