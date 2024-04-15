const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: false
    },
    buffer: {
        type: Buffer,
        required: false
    },
    use_buffer: {
        type: Boolean,
        required: false
    },
    data_type: {
        type: Number,
        required: false
    }
});

const retrievalSchema = new mongoose.Schema({
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true,
            autopopulate: true
        },
        data: [fileSchema],
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
                type:Number
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
                type:Number
            }
        },
        is_extended: {
            type: Boolean,
            required: true,
            default: false
        },
        locked: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true
    }
);

retrievalSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
    Retrieval: mongoose.model('Retrieval', retrievalSchema)
}