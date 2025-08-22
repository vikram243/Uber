const userModel = require('../models/user.model');

// register a new user
// It validates the input, checks if the user already exists, hashes the password, and creates
// a new user with the provided details
module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    const user = new userModel({
        fullname: {
            firstname: firstname,
            lastname: lastname || ''
        },
        email,
        password
    });
    await user.save();
    return user;
};