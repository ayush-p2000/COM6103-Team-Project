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
        required: true
    },
    data_type: {
        type: Number,
        required: true
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
        locked: {
            type: Boolean,
            required: true,
            default: false
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

retrievalSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
    Retrieval: mongoose.model('Retrieval', retrievalSchema)
}