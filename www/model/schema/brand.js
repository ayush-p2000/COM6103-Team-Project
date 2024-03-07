const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
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
    brandSchema
}