import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import Swal from "sweetalert2";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

const MapComponent = ({ locations }) => {
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          Swal.fire({
            icon: "warning",
            title: "Location Disabled",
            text: "We couldn't access your location. Using default location (Colombo).",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Geolocation Not Supported",
        text: "Your browser does not support geolocation. Using default location (Colombo).",
      });
    }
  }, []);

  useEffect(() => {
    if (isLoaded && locations.length > 0 && currentLocation) {
      const directionsService = new google.maps.DirectionsService();

      // Function to calculate the distance between two coordinates
      const calculateDistance = (a, b) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (b.lat - a.lat) * (Math.PI / 180);
        const dLng = (b.lng - a.lng) * (Math.PI / 180);
        const lat1 = a.lat * (Math.PI / 180);
        const lat2 = b.lat * (Math.PI / 180);

        const aCalc =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
        return R * c; // Distance in km
      };

      // Sort locations by distance from the current location
      const sortedWaypoints = locations
        .slice(0, -1) // Exclude the last location (destination)
        .sort((loc1, loc2) => {
          const dist1 = calculateDistance(currentLocation, {
            lat: loc1.latitude,
            lng: loc1.longitude,
          });
          const dist2 = calculateDistance(currentLocation, {
            lat: loc2.latitude,
            lng: loc2.longitude,
          });
          return dist1 - dist2; // Sort ascending by distance
        })
        .map((loc) => ({
          location: { lat: loc.latitude, lng: loc.longitude },
          stopover: true,
        }));

      // Define the destination as the last location
      const destination = {
        lat: locations[locations.length - 1].latitude,
        lng: locations[locations.length - 1].longitude,
      };

      // Fetch directions from current location to destination with sorted waypoints
      directionsService.route(
        {
          origin: currentLocation,
          destination: destination,
          waypoints: sortedWaypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed to Fetch Directions",
              text: `Status: ${status}`,
            });
          }
        }
      );
    }
  }, [locations, isLoaded, currentLocation]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation} // Center the map at the current location
      zoom={8}
    >
      {/* Render markers for all locations */}
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={location.name || `Location ${index + 1}`}
        />
      ))}

      {/* Render the calculated directions */}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapComponent;
