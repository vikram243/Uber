import axios from "axios";
import captainModel from "../models/captain.model.js";

// Get coordinates for a given address
const getCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } else {
            throw new Error(`Geocoding failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error("Error fetching address coordinates:", error);
        throw error;
    }
};

// Get distance and time between two locations
const getDistanceTime = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
    )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const element = response.data.rows[0].elements[0];
            if (element.status === "OK") {
                // element.distance.value is in meters, element.duration.value is in seconds
                const distanceMeters = element.distance.value;
                const durationSeconds = element.duration.value;
                const distanceKm = Number((distanceMeters / 1000).toFixed(3));
                const durationMin = Number((durationSeconds / 60).toFixed(2));
                return {
                    distance: element.distance.text,
                    duration: element.duration.text,
                    distanceMeters,
                    durationSeconds,
                    distanceKm,
                    durationMin,
                };
            } else {
                throw new Error(`Distance matrix failed: ${element.status}`);
            }
        } else {
            throw new Error(`Distance matrix API failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error("Error fetching distance and time:", error);
        throw error;
    }
};

// Get suggestions for a given input
const getSuggestions = async (input) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
    )}&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            return response.data.predictions.map((prediction) => ({
                description: prediction.description,
                place_id: prediction.place_id,
            }));
        } else {
            throw new Error(`Autocomplete failed: ${response.data.status}`);
        }
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        throw error;
    }
};

// Get captains within a radius (in kilometers) of a given location
const getCaptainInTheRadius = async (lat, lng, radius, vehicleType) => {
    try {
        // Validate inputs
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            throw new Error("Invalid latitude or longitude");
        }
        if (
            !vehicleType ||
            !["car", "bike", "auto"].includes(vehicleType.toLowerCase())
        ) {
            throw new Error("Invalid vehicle type");
        }

        // Query captains with matching vehicle type and within radius
        const captains = await captainModel
            .find({
                "vehicle.type":
                    vehicleType.charAt(0).toUpperCase() +
                    vehicleType.slice(1).toLowerCase(),
                status: "active",
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius / 6371], // [longitude, latitude], radius in radians
                    },
                },
            })
            .select("fullname vehicle location socketId status");

        console.log(`Found ${captains.length} captains in radius`);
        return captains;
    } catch (error) {
        console.error("Error fetching captains in radius:", error);
        throw error;
    }
};

export default {
    getCoordinates,
    getDistanceTime,
    getSuggestions,
    getCaptainInTheRadius,
};