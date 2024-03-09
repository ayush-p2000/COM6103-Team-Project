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
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    Retrieval: mongoose.model('Retrieval', retrievalSchema)
}