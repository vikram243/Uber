const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ firstname, lastname, email, password, color, model, plate, capacity, type }) => {
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