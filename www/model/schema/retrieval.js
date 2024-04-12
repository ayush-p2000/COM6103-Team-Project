const mongoose = require('mongoose');

const retrievalSchema = new mongoose.Schema({
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true
        },
        data: [
            {
                name: {
                    type: String,
                    required: true
                },
                value: {
                    type: String,
                    required: true
                },
                data_type: {
                    type: Number,
                    required: true
                }
            }
        ],
        retrieval_state: {
            type: Number,
            required: true
        },
        expiry: {
            type: Date,
            required: true
        },
        transaction: {
            value: {
                type: Number,
                required: true
            },
            transaction_state: {
                type: Number,
                required: true
            },
            payment_date: {
                type: Date,
                required: false
            },
        },
        extension_transaction: {
            value: {
                type: Number,
                required: false
            },
            transaction_state: {
                type: Number,
                required: false
            },
            payment_date: {
                type: Date,
                required: false
            },
            length : {
                type: Number,
                required: false
            }
        },
        is_extended: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    Retrieval: mongoose.model('Retrieval', retrievalSchema)
}