const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    state: {
        type: Number,
        required: true
    },
    date_created: {
        type: Date,
        required: true
    },
    date_modified: {
        type: Date,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
});

module.exports = {
    quoteSchema
}