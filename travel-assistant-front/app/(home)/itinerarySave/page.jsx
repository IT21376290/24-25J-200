"use client";

// import React from "react";
import VR from "../../../public/images/icons/VR_Icon.png";
import Popup from "../../components/Modals/saveItineraryModal";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import VR360Image from "../../components/Modals/vrModal";
import axios from "axios";
import Swal from "sweetalert2";
import MapComponent from "../../components/googleMapItineraryAll";
import { useRouter } from "next/navigation";


export default function ItineraryPage_02() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState("");
  const [itineraryData, setItineraryData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [location, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {

    const user = JSON.parse(localStorage.getItem('UserData') || '{}');

    let locations = [];

    const fetchAllLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/locations', {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        if (response.status === 200) {
          locations = response.data.locations;
        }
      } catch (error) {
        const { response } = error;
        if (response.status === 401 || response.status === 422) {
          Swal.fire({
            title: "Token Error",
            text: "Please login to continue.",
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "Go to Login",
            customClass: {
              confirmButton: "swal-login-button"
            }
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/account/sign-in");
            }
          });
        }
      }
    };

    const savedData = localStorage.getItem("itinerary");
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      setLocations(parsedData)
      setIsLoading(false);

      // Fetch all locations first
      fetchAllLocations().then(() => {
        const transformedData = parsedData.map((item) => ({
          locations: item.sub_places.map((place, index) => {
            // Find the matching location from the database
            const matchedLocation = locations?.find(
              (dbLocation) => dbLocation.name.toLowerCase() === place.name.toLowerCase()
            );


            // Return the complete object by merging predicted data with database data
            return {
              id: index + 1,
              name: place.name,
              description: matchedLocation?.description || `Lat: ${place.latitude}, Lon: ${place.longitude}`,
              latitude: matchedLocation?.latitude || place.latitude,
              longitude: matchedLocation?.longitude || place.longitude,
              location_image: matchedLocation?.location_image || "Default_Image_URL", // Use a default if not found
              budget: `Approx Rs ${item.cost}`,
              type: matchedLocation?.type || "Unknown",
              location_id: matchedLocation?.id || "Unknown",
            };
          }),
          totalBudget: item.cost,
        }));


        setItineraryData(transformedData);
      });

    }
  }, [router]);


  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleImageModal = (imageURL) => {
    setSelectedImageURL(imageURL);
    setOpenModal(true);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("itinerary");
    setItineraryData([]);
    Swal.fire({
      title: "Data Cleared",
      text: "Itinerary data cleared!",
      icon: "success"
    });
  };

  const handleSaveItinerary = async (item) => {
    setItemData(item);
    openPopup();
  }


  const handleShowAlert = () => {
    setShowAlert(true);
  }

  return (
    (!isLoading &&
      <div className="min-h-screen bg-gray-50 pt-6">


        {showAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[60%] md:w-[40%] flex flex-col text-center">
              <h2 className="text-xl font-semibold text-green-600">
                Itinerary Created Successfully!
              </h2>
              <p className="text-gray-500 mt-2">
                Your itinerary has been successfully created and saved.
              </p>

              <div className="mt-4">
                <span
                  className="text-green-600 font-bold"
                  onClick={() => setShowAlert(false)}
                >
                  Close
                </span>
              </div>
            </div>
          </div>
        )}

        <main className="container mx-auto mt-6 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="pt-24"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Itinerary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {itineraryData.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-lg p-4 flex flex-col relative"
              >
                {location[index]?.sub_places && <MapComponent locations={location[index].sub_places} />}
                <div className="mb-4">
                  {item.locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center justify-between mb-2"
                    >
                      <label className="flex items-center text-gray-700 space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-green-300"
                        >
                          <circle cx="12" cy="12" r="8" />
                        </svg>
                        <span>
                          {loc.name}{" "}
                          <span className="text-sm">({loc.description})</span>
                        </span>
                      </label>
                      <span className="text-gray-500">
                        <Image
                          onClick={() => {
                            handleImageModal(loc.location_image);
                          }}
                          src={VR}
                          alt="Location Icon"
                          className="min-w-5 min-h-5 cursor-pointer"
                        />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center sm:items-start mt-4">
                  <p className="text-gray-700 font-semibold text-center sm:text-left">
                    Total Budget
                  </p>
                  <p className="text-xl font-bold text-green-600 text-center sm:text-left">
                    RS {item.totalBudget}
                  </p>
                </div>
                <div className="relative mt-4 sm:mt-6 flex justify-end w-full">
                  <button onClick={() => { handleSaveItinerary(item) }} className="bg-green-500 text-white py-2 px-4 w-40 rounded-md hover:bg-green-600 transition">
                    SAVE
                  </button>
                </div>
              </div>
            ))}
          </div>
          {openModal && (
            <VR360Image
              imageURL={selectedImageURL}
              onClose={() => setOpenModal(false)}
            />
          )}
        </main>


        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={clearLocalStorage}
            className="bg-red-500 text-white px-6 py-2 rounded shadow-md hover:bg-red-600 transition"
          >
            Clear Data
          </button>
        </div>
        {isPopupOpen && (
          <Popup
            onClose={closePopup}
            onItemData={itemData}
            onSuccess={handleShowAlert}
          />
        )}

      </div>)
  );
}
