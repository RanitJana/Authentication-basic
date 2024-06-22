const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is needed!!"],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, "Email is needed"],
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password is required!!"]
        },
        avater: {
            type: String
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// contains more info and short lived
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            email: this.email
        },
        process.env.JWT_ACCESSTOKEN_SIGN,
        {
            expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRY
        }
    )
}

// contains less info and long lived
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.JWT_REFRESHTOKEN_SIGN,
        {
            expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRY
        }
    )
}


module.exports = mongoose.model('User', userSchema);