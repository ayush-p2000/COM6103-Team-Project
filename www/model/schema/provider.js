const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    does_wiping: {
        type: Boolean,
        required: true
    },
});

module.exports = {
    providerSchema
}