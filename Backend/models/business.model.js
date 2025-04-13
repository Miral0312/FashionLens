const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const businessUserSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First Name should be at least 3 characters']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last Name should be at least 3 characters']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters'],
    },
    organization: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Designer', 'Editor', 'Manager','Others'],
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
    coins: {
        type: Number,
        default: 100 // Initial value set to 100
    }
});

// Generate authentication token
businessUserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Compare password for login
businessUserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Hash password before saving
businessUserSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const businessModel = mongoose.model('BusinessUser', businessUserSchema);
module.exports = businessModel;
