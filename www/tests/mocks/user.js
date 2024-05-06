const {faker} = require('@faker-js/faker');

const mock_user = {
    _id: faker.database.mongodbObjectId(),
    role: 0,
    active: true,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    date_of_birth: faker.date.past(),
    email: faker.internet.email(),
    phone_number: faker.phone.number(),
    address: {
        address_1: faker.location.streetAddress(),
        address_2: faker.location.secondaryAddress(),
        postcode: faker.location.zipCode(),
        city: faker.location.city(),
        county: faker.location.county(),
        country: faker.location.country()
    },
    savedCo2: 0,
    listed_devices: [],
    avatar: faker.image.avatar(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    verified: true,
    toJSON: () => {
        //Return the user object without the toJSON function
        return this;
    }
}

module.exports = {
    mock_user
}