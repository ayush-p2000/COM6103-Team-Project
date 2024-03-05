const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    state: {
        type: Number,
        required: true
    },
});

module.exports = {
    transactionSchema
}