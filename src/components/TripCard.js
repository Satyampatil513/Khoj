import React, { useEffect, useRef } from 'react';
import './TripCard.css'; // Import CSS for styling
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import an arrow icon

// Set your Mapbox token
const getRoute = (edges, map, nodes) => {
    if (edges.length === 0) return;

    // Collect all coordinates to create a cyclic route
    const coordinates = [];
    let initialNode = nodes[edges[0].from];

    // Add each edge's 'from' location, ensuring all waypoints are covered
    edges.forEach((edge) => {
        const fromLocation = nodes[edge.from];
        if (fromLocation) {
            coordinates.push(`${fromLocation.longitude},${fromLocation.latitude}`);
        }
    });

    // Ensure the route returns back to the initial starting point
    if (initialNode) coordinates.push(`${initialNode.longitude},${initialNode.latitude}`);

    const coordinateString = coordinates.join(';');

    // Example API call to fetch route data (cyclic route)
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinateString}?access_token=${mapboxgl.accessToken}&geometries=geojson`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.waypoints || !data.waypoints[0]) {
                console.error('No route found');
                return;
            }

            const route = data.routes[0].geometry.coordinates;
            const geojson = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: route,
                        },
                    },
                ],
            };
            const markerFeatures = [];
            Object.values(nodes).forEach((node, index) => {
                markerFeatures.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [node.longitude, node.latitude],
                    },
                    properties: {
                        label: `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Stop`,
                    },
                });
            });

            // Add route to the map
            if (map.getSource('route')) {  
                map.getSource('route').setData(geojson);  
            } else {  
                map.addLayer({  
                    id: 'route',  
                    type: 'line',  
                    source: {  
                        type: 'geojson',  
                        data: geojson  
                    },  
                    layout: {  
                        'line-join': 'round',  
                        'line-cap': 'round'  
                    },  
                    paint: {  
                        'line-color': '#3887be',  
                        'line-width': 5,  
                        'line-opacity': 0.75  
                    }  
                });  
                map.addLayer({
                    "id": "points",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "FeatureCollection",
                            "features": markerFeatures 
                        }
                    },
                    layout: {
                        'icon-image': 'marker-15', // Built-in Mapbox marker icon
                        'icon-size': 1.5, // Adjust size if needed
                        'text-field': ['get', 'label'],
                        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                        'text-offset': [0, 0.6],
                        'text-anchor': 'top',
                        'text-size': 12,
                    },
                });
            } 
        })
        .catch(error => console.error('Error fetching route:', error));
};

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F0eWFtNTEzIiwiYSI6ImNtMmYza28zNDA1MGIyanNjdHB3aTdrbGEifQ.wtdN6U9U7PD-xitMvwapSQ';

const TripCard = ({ trip }) => {
    const { title, edges, nodes } = trip;
    const mapRefs = useRef({});
    const navigate = useNavigate();
     // Store references to the maps for each edge
    const handleShowEditItinerary = () => {
        // Navigate to Detailed Itinerary page with trip data
        navigate("/detailed-iternary", {state:{title, trip}});
    };
    useEffect(() => {
        if (trip.edges.length > 0) {
            const mapContainerId = `map-cyclic`;

            // Check if the map has already been initialized
            if (mapRefs.current[mapContainerId]) {
                return;
            }

            const nodeValues = Object.values(trip.nodes);
            const avgLat = nodeValues.reduce((sum, node) => sum + node.latitude, 0) / nodeValues.length;
            const avgLon = nodeValues.reduce((sum, node) => sum + node.longitude, 0) / nodeValues.length;

            const map = new mapboxgl.Map({
                container: mapContainerId,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [avgLon, avgLat], // Set the map center to the average coordinates
                zoom: 7,
            });

            map.on('load', () => {
                getRoute(trip.edges, map, trip.nodes); // Function to get the cyclic route and add it to the map
            });

            // Save the map reference
            mapRefs.current[mapContainerId] = map;

            // Cleanup on component unmount
            return () => {
                Object.values(mapRefs.current).forEach(map => {
                    if (map) {
                        map.remove();
                    }
                });
                mapRefs.current = {}; // Reset the map references
            };
        }
    }, [trip.edges, trip.nodes]);

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white w-full animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-white text-center">{title}</h2>
            <div className="flex space-x-4">
                <div className="flex-1 space-y-4">
                    {edges.map((edge, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-900 rounded-md p-3 shadow-sm">
                            <div className="flex-1 text-center">
                                <span className="font-semibold">{edge.from}</span>
                            </div>
                            <FaArrowRight className="text-yellow-400 mx-2" />
                            <div className="flex-1 text-center">
                                <span className="font-semibold">{edge.to}</span>
                            </div>
                            <div className="flex flex-col text-sm text-gray-400 ml-4">
                                <span>{edge.mode}</span>
                                <span>{edge.distance}</span>
                                <span>{edge.duration}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div id="map-cyclic" className="map-container h-64 w-1/2 rounded-lg"></div> {/* Adjusted width for the map */}
            </div>
            {/* <button 
                onClick={handleShowEditItinerary} 
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
                Make Detailed Itinerary
            </button> */}
        </div>
    );
};

export default TripCard;
