const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        is_deleted: {
            type: mongoose.Schema.Types.Boolean,
            required: true,
            default: false
        },
        models: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Model',
            }
        ]
    }, {
        timestamps: true
    }
);

module.exports = {
    Brand: mongoose.model('Brand', brandSchema)
}