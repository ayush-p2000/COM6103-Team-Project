const mongoose = require('mongoose');

const retrievalSchema = new mongoose.Schema({
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    data: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            data_type: {
                type: Number,
                required: true
            }
        }
    ],
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
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: true
    }
});

module.exports = {
    retrievalSchema
}