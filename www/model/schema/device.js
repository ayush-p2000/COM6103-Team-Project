const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");

const deviceSchema = new mongoose.Schema({
        device_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeviceType',
            required: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true
        },
        model: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Model',
        },
        details: [
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
        ],
        category: {
            type: Number,
            required: true
        },
        good_condition: {
            type: Boolean,
            required: true
        },
        state: {
            type: Number,
            required: true
        },
        data_service: {
            type: Number,
            required: true,
            min: 0,
        },
        additional_details: {
            type: String,
            required: true
        },
        listing_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        photos: [
            {
                type: String,
                required: true
            }
        ],
        visible: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true
    }
);

module.exports = {
    deviceSchema
}