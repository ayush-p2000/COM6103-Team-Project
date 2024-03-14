const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
            autopopulate: true
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider',
            required: true,
            autopopulate: true
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
                img_type: {
                    type: String,
                    required: true
                },
                img_data: {
                    type: Buffer,
                    required: true
                }
            }
        }
    },
    {
        timestamps: true
    }
);

quoteSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
    Quote: mongoose.model('Quote', quoteSchema)
}