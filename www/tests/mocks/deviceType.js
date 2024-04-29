const {faker} = require('@faker-js/faker');

const generateFakeDeviceType = () => {
    return {
        name: faker.string.alpha(10),
        description: faker.lorem.sentence(),
        is_deleted: false
    };
};

const generateFakeDeviceTypes = (count) => {
    const fakeDeviceTypes = [];
    for (let i = 0; i < count; i++) {
        fakeDeviceTypes.push(generateFakeDeviceType());
    }
    return fakeDeviceTypes;
};

module.exports = {
    generateFakeDeviceType,
    generateFakeDeviceTypes
};