const {faker} = require('@faker-js/faker');

const mock_photo = {
    buffer: Buffer.from(faker.image.dataUri().split(',')[1], 'base64'),
    mimetype: "image/jpeg"
}

module.exports = {
    mock_photo
}