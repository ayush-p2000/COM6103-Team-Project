const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
        role: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 2
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        address: {
            address_1: {
                type: String,
                required: true
            },
            address_2: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: true
            },
            county: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            postcode: {
                type: String,
                required: true
            },
        },
        password: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true,
            minLength: 16,
            maxLength: 24
        },
        listed_devices:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Device'
                }
            ],
    },
    {
        timestamps: true
    }
);

module.exports = {
    userSchema
}