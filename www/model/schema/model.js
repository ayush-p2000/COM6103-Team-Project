const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Number,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    deviceType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceType',
        required: true
    },
    properties: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = {
    modelSchema
}