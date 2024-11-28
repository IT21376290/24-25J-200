import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 6.9271, // Centering map around Sri Lanka
  lng: 79.8612,
};

// Array of popular locations with coordinates
const locations = [
  { name: "Nine Arches Bridge", latitude: 6.881, longitude: 81.046 },
  { name: "Little Adam's Peak", latitude: 6.872, longitude: 81.049 },
  { name: "Mirissa Beach", latitude: 5.949, longitude: 80.455 },
  { name: "Temple of the Tooth", latitude: 7.294, longitude: 80.641 },
  { name: "Yala National Park", latitude: 6.399, longitude: 81.521 },
];

const MapComponent = () => {
  // Using useLoadScript to load the Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>; 
  }

  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={location.name} // Displays the location name on hover
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
