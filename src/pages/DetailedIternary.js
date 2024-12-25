import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendDetailedItineraryRequest } from '../api/api'; // Import your API function

const DetailedItinerary = () => {
    const location = useLocation();
    const { title, trip } = location.state;
    const [itinerary, setItinerary] = useState([]);
    const [preferences, setPreferences] = useState({
        startTime: "08:00",
        endTime: "18:00",
        restTime: "12:00"
    });

    useEffect(() => {
        const fetchItineraryDetails = async () => {
            try {
                // const response = await sendDetailedItineraryRequest({ ...trip, ...preferences });
                const response = {"itinerary": [{"day": "2024-11-07", "activities": [{"start_time": "08:00", "end_time": "09:00", "activity": "Travel from Bangalore to Ramanagara", "location": {"name": "Bangalore", "latitude": "12.9716", "longitude": "77.5946"}, "description": "Travel by car from Bangalore to Ramanagara.", "mode": "Car", "distance": "50 km", "duration": "1 hour"}, {"start_time": "09:00", "end_time": "12:00", "activity": "Biking and Trekking in Ramanagara", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Explore the rocky terrain of Ramanagara by bike and trek through scenic trails.", "mode": "Biking and Trekking", "distance": "15 km", "duration": "3 hours"}, {"start_time": "12:00", "end_time": "13:00", "activity": "Lunch Break", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Enjoy a relaxing lunch break at a local restaurant.", "mode": "Rest", "distance": "0 km", "duration": "1 hour"}, {"start_time": "13:00", "end_time": "16:00", "activity": "Rock Climbing in Ramanagara", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Experience the thrill of rock climbing at Ramanagara's renowned climbing spots.", "mode": "Rock Climbing", "distance": "5 km", "duration": "3 hours"}, {"start_time": "16:00", "end_time": "17:00", "activity": "Return to Bangalore", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Travel back to Bangalore by car.", "mode": "Car", "distance": "50 km", "duration": "1 hour"}]}, {"day": "2024-11-08", "activities": [{"start_time": "08:00", "end_time": "10:00", "activity": "Explore the Kaveri River", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Enjoy a scenic boat ride on the Kaveri River.", "mode": "Boat", "distance": "10 km", "duration": "2 hours"}, {"start_time": "10:00", "end_time": "11:00", "activity": "Visit the Pandavagutta Caves", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Explore the ancient Pandavagutta Caves, a fascinating historical site.", "mode": "Walking", "distance": "2 km", "duration": "1 hour"}, {"start_time": "11:00", "end_time": "12:00", "activity": "Relaxation and Refreshments", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Enjoy some refreshments and relaxation at a local café.", "mode": "Rest", "distance": "0 km", "duration": "1 hour"}, {"start_time": "12:00", "end_time": "14:00", "activity": "Visit the Ramdevara Betta Hill", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Hike to the top of Ramdevara Betta Hill for breathtaking panoramic views.", "mode": "Hiking", "distance": "3 km", "duration": "2 hours"}, {"start_time": "14:00", "end_time": "15:00", "activity": "Lunch Break", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Enjoy a delicious lunch at a local restaurant.", "mode": "Rest", "distance": "0 km", "duration": "1 hour"}, {"start_time": "15:00", "end_time": "16:00", "activity": "Return to Bangalore", "location": {"name": "Ramanagara", "latitude": "12.8447", "longitude": "77.4132"}, "description": "Travel back to Bangalore by car.", "mode": "Car", "distance": "50 km", "duration": "1 hour"}]}]}
                setItinerary(response.itinerary); // Set itinerary response
                console.log('Detailed Itinerary Response:', response);
            } catch (error) {
                console.error('Error fetching detailed itinerary:', error);
            }
        };

        fetchItineraryDetails();
    }, [trip, preferences]);

    const handlePreferenceChange = (e) => {
        const { name, value } = e.target;
        setPreferences((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteNode = (dayIndex, activityIndex) => {
        setItinerary((prev) => 
            prev.map((day, dIdx) => 
                dIdx === dayIndex
                    ? { ...day, activities: day.activities.filter((_, aIdx) => aIdx !== activityIndex) }
                    : day
            )
        );
    };

    const handleSuggestAlternative = (activity) => {
        alert(`Suggesting alternative for: ${activity.activity}`);
    };

    return (
        <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-white">{title}</h1>

            {/* Preferences Form */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg">
                <label className="block mb-2 text-gray-300">Start of the Day:</label>
                <input
                    type="time"
                    name="startTime"
                    value={preferences.startTime}
                    onChange={handlePreferenceChange}
                    className="mb-2 p-2 bg-gray-700 text-gray-200 rounded"
                />
                <label className="block mb-2 text-gray-300">End of the Day:</label>
                <input
                    type="time"
                    name="endTime"
                    value={preferences.endTime}
                    onChange={handlePreferenceChange}
                    className="mb-2 p-2 bg-gray-700 text-gray-200 rounded"
                />
                <label className="block mb-2 text-gray-300">Rest Time:</label>
                <input
                    type="time"
                    name="restTime"
                    value={preferences.restTime}
                    onChange={handlePreferenceChange}
                    className="p-2 bg-gray-700 text-gray-200 rounded"
                />
            </div>

            {/* Display Itinerary */}
            {itinerary.map((day, dayIndex) => (
                <div key={day.day} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-200">Day {dayIndex + 1} - {day.day}</h2>
                    {day.activities.map((activity, activityIndex) => (
                        <div key={activity.start_time} className="mb-4 p-4 bg-gray-800 rounded-lg">
                            <p><strong>Activity:</strong> {activity.activity}</p>
                            <p><strong>Time:</strong> {activity.start_time} - {activity.end_time}</p>
                            <p><strong>Description:</strong> {activity.description}</p>
                            <p><strong>Location:</strong> {activity.location.name} ({activity.location.latitude}, {activity.location.longitude})</p>
                            <p><strong>Mode:</strong> {activity.mode} - <strong>Distance:</strong> {activity.distance}</p>
                            
                            {/* Delete and Suggest Alternative buttons */}
                            <div className="mt-2">
                                <button
                                    onClick={() => handleDeleteNode(dayIndex, activityIndex)}
                                    className="mr-2 p-2 bg-red-600 text-white rounded-md"
                                >
                                    Delete Activity
                                </button>
                                <button
                                    onClick={() => handleSuggestAlternative(activity)}
                                    className="p-2 bg-blue-600 text-white rounded-md"
                                >
                                    Suggest Alternative
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DetailedItinerary;
