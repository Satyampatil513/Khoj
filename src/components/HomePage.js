import React, { useState, useEffect } from 'react';
import TripCard from './TripCard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import { sendTripFormData, sendSuggestedPlacesRequest } from '../api/api';

const HomePage = () => {
    const [startLocation, setStartLocation] = useState('');
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [tripType, setTripType] = useState([]);
    const [transportMode, setTransportMode] = useState([]);
    const [trips, setTrips] = useState([]);
    const [showForm, setShowForm] = useState(true);
    const [isSurprise, setIsSurprise] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [currentTripIndex, setCurrentTripIndex] = useState(0); // Current trip index
    const [suggestedPlaces, setSuggestedPlaces] = useState([]);

    const transportOptions = [
        { value: 'Car', label: 'Car' },
        { value: 'Plane', label: 'Plane' },
        { value: 'Train', label: 'Train' }
    ];

    const tripTypeOptions = [
        { value: 'Adventure', label: 'Adventure' },
        { value: 'Historical', label: 'Historical' },
        { value: 'Leisure', label: 'Leisure' }
    ];

    // useEffect(() => {

    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             async (position) => {
    //                 const userLocation = {
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude
    //                 };
    //                 setLocation(userLocation);
    //                 console.log('User Location:', userLocation);
    //                 const response = await sendSuggestedPlacesRequest(userLocation);
    //                 const placesData = typeof response === 'string' ? JSON.parse(response) : response;
    //                 setSuggestedPlaces(placesData.places);

    //             },
    //             (error) => {
    //                 console.error('Error getting location:', error);
    //                 fetchSuggestedPlaces(null); // Fetch suggested places without location
    //             }
    //         );
    //     } else {
    //         console.error('Geolocation is not supported by this browser.');
    //         fetchSuggestedPlaces(null); // Fetch suggested places without location
    //     }
    // }, []);

    const onDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            setShowDatePicker(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            startLocation,
            destination: isSurprise ? "" : destination,
            startDate,
            endDate,
            tripType: tripType.map(type => type.value),
            transportMode: transportMode.map(mode => mode.value),
        };
    
        setLoading(true); // Set loading to true
        try {
            const response = await sendTripFormData(formData);
 
            // const cleanResponse = response
            // .replace(/^``json\s*/i, '') // Remove starting ```json
            // .replace(/``$/, '');       // Remove ending ```

        // Parse the cleaned JSON string
            const tripsData = JSON.parse(response.data);
            console.log(tripsData);
            // log the type of response
            console.log(typeof response);
            // Clean the response if it contains "```json" and "```"
            // let cleanedResponse = response;
            // cleanedResponse = cleanedResponse.slice(7, -3).trim();
            
    
            // const tripsData = JSON.parse(cleanedResponse) ;
            console.log(tripsData)
    
            setTrips(tripsData);
            setCurrentTripIndex(0); // Reset to the first trip
            setShowForm(false);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    

    const handleSurpriseChange = (checked) => {
        setIsSurprise(checked);
        if (checked) {
            setDestination(''); // Clear destination when surprise is checked
        }
    };

    const nextTrip = () => {
        if (currentTripIndex < trips.length - 1) {
            setCurrentTripIndex(currentTripIndex + 1);
        }
    };

    const prevTrip = () => {
        if (currentTripIndex > 0) {
            setCurrentTripIndex(currentTripIndex - 1);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
            style={{
                backgroundImage: "url('/3375963.png')",
                backgroundSize: "80%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center bottom",
            }}>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text animate-bounce">GET A TRIP</h1>
            <h2 className="text-xl md:text-3xl font-light mt-2 text-gray-200 font-condensed p-4 rounded-lg bg-black">Find your next best trip!</h2>

            {showForm ? (
                <form className="mt-10 flex flex-col items-center space-y-6 w-full max-w-lg" onSubmit={handleSubmit}>
                    {/* Start Location Input */}
                    <div className={`relative transition-all duration-500 w-full`}>
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Start Location"
                            className="bg-white text-black border border-gray-300 p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                        />
                    </div>
                    
                    {/* Destination Input */}
                    <div className="flex items-center w-full">
                        {!isSurprise && (
                            <div className="relative flex-grow mr-2">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Destination (optional)"
                                    className="bg-white text-black border border-gray-300 p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Surprise Me Checkbox */}
                        <label className="flex items-center text-sm text-gray-300 bg-black">
                            <input type="checkbox" onChange={(e) => handleSurpriseChange(e.target.checked)} checked={isSurprise} />
                            <span className="ml-2">Surprise Me!</span>
                        </label>
                    </div>

                    {/* Date Picker Button */}
                    {!showDatePicker ? (
                        <button
                            type="button"
                            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full transition duration-200"
                            onClick={() => setShowDatePicker(true)}
                        >
                            Choose Dates
                        </button>
                    ) : (
                        <FaTimes className="text-red-500 cursor-pointer" onClick={() => setShowDatePicker(false)} />
                    )}

                    {showDatePicker && (
                        <DatePicker
                            selected={startDate}
                            onChange={onDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            inline
                            className="bg-gray-800 border border-gray-700 rounded-lg p-2"
                        />
                    )}

                    {startDate && endDate && (
                        <div className="bg-white text-black rounded-full p-2 text-center">
                            <p>
                                From {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {/* Transport Modes and Trip Types Multiselect in One Row */}
                    <div className="flex flex-wrap justify-between w-full">
                        <Select
                            isMulti
                            name="transportModes"
                            options={transportOptions}
                            className="basic-multi-select w-full md:w-1/2 pr-2"
                            classNamePrefix="select"
                            placeholder="Transport Mode"
                            value={transportMode}
                            onChange={(selectedOptions) => setTransportMode(selectedOptions || [])}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#1f2937',
                                    borderRadius: '9999px',
                                    border: '1px solid #475569',
                                    color: 'white',
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#374151',
                                    borderRadius: '9999px',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: 'gray',
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#4b5563' : '#1f2937',
                                    color: 'white',
                                }),
                            }}
                        />

                        <Select
                            isMulti
                            name="tripTypes"
                            options={tripTypeOptions}
                            className="basic-multi-select w-full md:w-1/2 pl-2"
                            classNamePrefix="select"
                            placeholder="Trip Type"
                            value={tripType}
                            onChange={(selectedOptions) => setTripType(selectedOptions || [])}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#1f2937',
                                    borderRadius: '9999px',
                                    border: '1px solid #475569',
                                    color: 'white',
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#374151',
                                    borderRadius: '9999px',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: 'gray',
                                }),
                                option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#4b5563' : '#1f2937',
                                    color: 'white',
                                }),
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-full transition duration-200">
                        Find Trips
                    </button>
                </form>
                      
            ) 
            : (
                <>
                    {loading ? (
                        <div className="text-xl">Loading...</div> // Show loading state
                    ) : (
                        <>
                            {/* Navigation Buttons above the TripCard */}
                            

                            {/* Current Trip Display */}
                            <TripCard trip={trips[currentTripIndex]} />
                            <div className="flex justify-between w-full mb-4">
                                <button
                                    onClick={prevTrip}
                                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                                    disabled={currentTripIndex === 0}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextTrip}
                                    className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                                    disabled={currentTripIndex === trips.length - 1}
                                >
                                    Next
                                </button>
                            </div> 
                        </>
                    )}
                </>
            )}

            {showForm && !loading && suggestedPlaces.length > 0 && (
                <div className="flex space-x-4 mt-6">
                    {suggestedPlaces.map((place, index) => (
                        <div key={index} className="bg-gray-200 rounded-lg shadow-lg p-4 w-1/4">
                            <img src={place.image} alt={place.name} className="rounded-lg mb-2" />
                            <h3 className="text-xl font-bold">{place.name}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
