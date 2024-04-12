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
            payment_date: {
                type: Date,
                required: false
            },
            payment_method: {
                type:String
            }
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
            },
            payment_method: {
                type:String
            }
        },
        is_extended: {
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
    Retrieval: mongoose.model('Retrieval', retrievalSchema)
}