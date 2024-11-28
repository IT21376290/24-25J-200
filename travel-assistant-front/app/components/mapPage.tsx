import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Popular Landmarks</h1>
        <p className="text-gray-600">
          Explore Sri Lanka&apos;s iconic landmarks, from ancient temples to
          breathtaking natural wonders, and uncover the rich history and beauty
          of each destination.
        </p>
      </header>

      {/* Map Section */}
      <div className="mt-8 relative bg-white shadow rounded-lg overflow-hidden">
        <Image
          src="/landmarks-map.png"
          alt="Landmarks Map"
          className="w-full h-auto"
        />

        {/* Marker Overlays */}
        <div className="absolute top-1/3 left-1/4">
          <div className="bg-red-500 text-white p-2 rounded-full text-xs">
            Dambulla Royal Cave
          </div>
        </div>
        <div className="absolute top-1/4 left-1/3">
          <div className="bg-red-500 text-white p-2 rounded-full text-xs">
            Pidurangala Rock
          </div>
        </div>
        {/* Add similar marker elements */}
      </div>
    </div>
  );
}
