import axios from 'axios';

const API_URL = 'https://3g6hvwstwyahfk2aa7catz7doa0bxwok.lambda-url.ap-southeast-2.on.aws/';


export const sendTripFormData = async (formData) => {
    try {
        console.log(formData)
        const response = await axios.post(API_URL, formData, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
        console.log(response)
        
        return response.data;
    } catch (error) {
        console.error('Error sending form data:', error);
        throw error;
    }
};
export const sendSuggestedPlacesRequest = async (location) => {
    try {
        console.log(location)
        const response = await axios.post(`${API_URL}/gemini/suggestPlaces`, location);
        console.log(response)
        
        return response.data;
    } catch (error) {
        console.error('Error sending location data:', error);
        throw error;
    }
};
export const sendDetailedItineraryRequest = async (tripData) => {
    const response = await fetch('/api/detailed-itinerary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};
