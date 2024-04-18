const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");

const deviceSchema = new mongoose.Schema({
        device_type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeviceType',
            required: true,
            autopopulate: true
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
            autopopulate: true
        },
        model: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Model',
            required: true,
            autopopulate: true
        },
        color: {
            type: String,
            required: true
        },
        capacity: {
            type: String,
            required: true
        },
        years_used: {
            type: String,
            required: true
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
            required: true,
            autopopulate: true
        },
        photos: [
            {
                img_type: {
                    type: String,
                    required: false
                },
                img_data: {
                    type: Buffer,
                    required: false
                }
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

deviceSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
    Device: mongoose.model('Device', deviceSchema)
}