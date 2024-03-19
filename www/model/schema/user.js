const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
        role: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            max: 2
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        date_of_birth: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        avatar: {
          type: String,
        },
        address: {
            address_1: {
                type: String,
                required: true
            },
            address_2: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: true
            },
            county: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            postcode: {
                type: String,
                required: true
            },
        },
        password: {
            type: Buffer,
            required: true
        },
        salt: {
            type: Buffer,
            required: true,
        },
        savedCo2: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        listed_devices:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Device'
                }
            ],
    },
    {
        timestamps: true
    }
);

// Define a pre-save hook to generate the avatar URL based on first name and last name
userSchema.pre('save', function(next) {
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.first_name)}+${encodeURIComponent(this.last_name)}`;
    next();
});

module.exports = {
    User: mongoose.model('User', userSchema)
}