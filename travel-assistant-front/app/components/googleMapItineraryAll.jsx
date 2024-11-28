import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 6.9271, 
  lng: 79.8612,
};

const MapComponent = ({ locations }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) {
    return <div>Loading...</div>; 
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={location.name} 
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
