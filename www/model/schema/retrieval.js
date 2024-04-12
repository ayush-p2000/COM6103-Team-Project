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
                    required: false
                },
                value: {
                    type: String,
                    required: false
                },
                data_type: {
                    type: Number,
                    required: false
                }
            }
        ],
        retrieval_state: {
            type: Number,
            default: 0,
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
        },
        extension_transaction : {
            value : {
                type: Number,
            },
            transaction_state: {
                type: Number
            },
            payment_date: {
                type: Date
            },
            length: {
                type: Number
            }
        },
        is_extended: {
                type: Boolean,
                default: false,
                required: true
        },
        payment_method: {
            type:String
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    Retrieval: mongoose.model('Retrieval', retrievalSchema)
}