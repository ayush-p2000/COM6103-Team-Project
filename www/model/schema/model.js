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
        is_deleted: {
            type: mongoose.Schema.Types.Boolean,
            required: true,
            default: false
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
    },
    {
        timestamps: true
    }
);

module.exports = {
    Model: mongoose.model('Model', modelSchema)
}