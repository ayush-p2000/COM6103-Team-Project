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

        google_id:{
            type: String,
            required: false,
            default: null
        },
        facebook_id:{
            type: String,
            required: false,
            default: null
        },

        first_name: {
            type: String,
            default: null,
            required: false
        },
        last_name: {
            type: String,
            default: null,
            required: false
        },
        date_of_birth: {
            type: Date,
            default: null,
            required: false
        },
        email: {
            type: String,
            required: false,
            default: null
        },
        phone_number: {
            type: String,
            required: false,
            default: null
        },
        avatar: {
          type: String,
          default: null
        },
        address: {
            address_1: {
                type: String,
                default: null,
                required: false
            },
            address_2: {
                type: String,
                default: null,
                required: false
            },
            city: {
                type: String,
                default: null,
                required: false
            },
            county: {
                type: String,
                default: null,
                required: false
            },
            country: {
                type: String,
                default: null,
                required: false
            },
            postcode: {
                type: String,
                default: null,
                required: false
            },
        },
        password: {
            type: Buffer,
            required: false,
            default: null
        },
        salt: {
            type: Buffer,
            required: false,
            default: null
        },
        token: {
            type: String,
            default: null
        },
        savedCo2: {
            type: Number,
            required: false,
            default: 0,
            min: 0
        },
        listed_devices:
            [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Device',
                    autopopulate: true
                }
            ],
    },
    {
        timestamps: true
    }
);

// Define a pre-save hook to generate the avatar URL based on first name and last name


userSchema.pre('save', function(next) {
    if(this.google_id == null && this.facebook_id == null) {
        this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.first_name)}+${encodeURIComponent(this.last_name)}`;
        next();
    }
    else
    {
        next();
    }
});

userSchema.plugin(require('mongoose-autopopulate'));

module.exports = {
    User: mongoose.model('User', userSchema)
}