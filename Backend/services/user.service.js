const userModel = require('../models/user.model');

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