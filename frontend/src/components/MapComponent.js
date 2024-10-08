import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { fetchParks } from '../services/ParkService';

const MapComponent = () => {
    const [userLocation, setUserLocation] = useState();
    const [parks, setParks] = useState([]);
    const [selectedRadius, setSelectedRadius] = useState(10);
    const [nearestPark, setNearestPark] = useState(null);

    useEffect(() => {
        // Get user's current location
        navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    }, []);

    useEffect(() => {
        if (userLocation) {

            // Fetch parks data
            fetchParks(
                userLocation.lat,
                userLocation.lng,
                selectedRadius * 1000,
            )
                .then((response) => {
                    setParks(response.data);
                    const filteredParks = response.data.filter((park) => {
                        // Calculate distance between user's location and park
                        const distance = calculateDistance(userLocation, park.geometry.location);

                        return distance <= selectedRadius * 1000;
                    });

                    // Sort parks by distance
                    filteredParks.sort((a, b) => {
                        const distanceA = calculateDistance(userLocation, a.geometry.location);
                        const distanceB = calculateDistance(userLocation, b.geometry.location);
                        return distanceA - distanceB;
                    });

                    setNearestPark(filteredParks[0]);
                })
                .catch((error) => {
                    console.error('Error fetching parks:', error);
                });

        }
    }, [userLocation, selectedRadius]);


    const calculateDistance = (location1, location2) => {
        const lat1 = location1.lat;
        const lat2 = location2.lat;
        const lon1 = location1.lng;
        const lon2 = location2.lng;

        const R = 6371e3; // Radius of the Earth in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in meters
        return d;
    };


    const handleRadiusChange = (event) => {
        setSelectedRadius(parseInt(event.target.value));
    };

    const mapContainerStyle = {
        width: '100%',
        height: '800px',
    };

    const options = {
        zoom: 14,
        center: userLocation,
    };

    return (
        <div>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap mapContainerStyle={mapContainerStyle} options={options}>
                    {userLocation && (
                        <Marker position={userLocation} />
                    )}
                    {nearestPark && (
                        <Marker position={nearestPark.geometry.location} />
                    )}
                    {nearestPark && (
                        <Polyline
                            path={[userLocation, nearestPark.geometry.location]}
                            options={{ strokeColor: '#FF0000', strokeOpacity: 0.8, strokeWeight: 2 }}
                        />
                    )}
                    {parks.map((park) => (
                        <Marker key={park.place_id} position={park.geometry.location} />
                    ))}
                </GoogleMap>
            </LoadScript>
            <select value={selectedRadius} onChange={handleRadiusChange}>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={30}>30 km</option>
                <option value={40}>40 km</option>
            </select>
        </div>
    );
};

export default MapComponent;
