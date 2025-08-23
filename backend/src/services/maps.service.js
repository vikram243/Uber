import axios from 'axios';

// Get coordinates for a given address
// It validates the input, checks if the address is provided, and returns the coordinates
const getCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(`Geocoding failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching address coordinates:', error);
        throw error;
    }   
}

// Get distance and time between two locations
// It validates the input, checks if both origin and destination are provided, and returns the distance
const getDistanceTime = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];
            if (element.status === 'OK') {
                return {
                    distance: element.distance.text,
                    duration: element.duration.text
                };
            } else {
                throw new Error(`Distance matrix failed: ${element.status}`);
            }
        } else {
            throw new Error(`Distance matrix API failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        throw error;
    }
}

// Get suggestions for a given input
// It validates the input, checks if the input is provided, and returns suggestions based on the
// Google Places API Autocomplete service
const getSuggestions = async (input) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions.map(prediction => ({
                description: prediction.description,
                place_id: prediction.place_id
            }));
        } else {
            throw new Error(`Autocomplete failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
}

export default {
    getCoordinates,
    getDistanceTime,
    getSuggestions
}