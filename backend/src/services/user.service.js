import userModel from '../models/user.model.js';

// register a new user
// It validates the input, checks if the user already exists, hashes the password, and creates
// a new user with the provided details
const createUser = async ({ firstname, lastname, email, password }) => {
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

export default {createUser}