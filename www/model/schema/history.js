const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
            required: true
        },
        history_type: {
            type: Number,
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
        actioned_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = {
    History: mongoose.model('History', historySchema)
}