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
        expiry: {
            type: Date,
            required: true
        },
        confirmation_details: {
            final_price: {
                type: Number,
                required: true
            },
            receipt_id: {
                type: String,
                required: true
            },
            receipt_date: {
                type: Date,
                required: true
            },
            receipt_image: {
                type: String,
                required: true
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    Quote: mongoose.model('Quote', quoteSchema)
}