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
}

mock_user.toJSON = function () {
    return {
        _id: this._id,
        role: this.role,
        active: this.active,
        first_name: this.first_name,
        last_name: this.last_name,
        date_of_birth: this.date_of_birth,
        email: this.email,
        phone_number: this.phone_number,
        address: this.address,
        savedCo2: this.savedCo2,
        listed_devices: this.listed_devices,
        avatar: this.avatar,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        verified: this.verified,
    }
}

module.exports = {
    mock_user
}