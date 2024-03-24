const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    DeviceType: mongoose.model('DeviceType', deviceTypeSchema)
}