const jwt = require('jsonwebtoken')
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
});

UserSchema.methods.generateAuthToken = function() {
    const  token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'))
    return token
}

const User = mongoose.model('User', UserSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;