import captainModel from '../models/captain.model.js';

// register a new captain
// It validates the input, checks if the captain already exists, hashes the password, and creates
// a new captain with the provided details
const createCaptain = async ({ firstname, lastname, email, password, color, model, plate, capacity, type }) => {
    const captain = new captainModel({
        fullname: {
            firstname: firstname,
            lastname: lastname || ''
        },
        email,
        password,
        vehicle: {
            color,
            model,
            plate,
            capacity,
            type
        }
    });
    await captain.save();
    return captain;
}

export default {createCaptain}