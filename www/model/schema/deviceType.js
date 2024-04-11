const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        is_deleted: {
            type: mongoose.Schema.Types.Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = {
    DeviceType: mongoose.model('DeviceType', deviceTypeSchema)
}