"use client"; // Required for Next.js apps

import React, { useEffect, useState } from "react";
import delete_image from '../../../public/images/icons/delete.png'
import file_image from '../../../public/images/icons/document.png'
import VR from '../../../public/images/icons/VR_Icon.png'
import Image from "next/image";
import axios from "axios";
import MapComponent from "../../components/googleMapItinerary";
import VR360Image from "../../components/Modals/vrModal";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";

interface Itinerary {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  total_budget: number;
}

interface Location {
  id: number;
  name: string;
  description: string;
  distance_from_current_location: number;
  latitude: number;
  longitude: number;
  location_image: string;
  type: string;
}


export default function ItineraryPage() {


  const [user, setUser] = useState<{ [key: string]: unknown }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("UserData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary[] | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState("");
  // const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);

  const handleNavigate = () => {
    router.push("/itineraryCreate"); // Navigate to the itineraryCreate Page
  };


  useEffect(() => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let locations = [];

    const fetchAllItineraries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/itinerary/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        if (response.status === 200) {
          locations = response.data.itineraries;
          setItinerary(response.data.itineraries);
          setIsLoading(false);
        }
      } catch (error) {
        const err = error as AxiosError;
        if (err.response && (err.response.status === 404)) {
          setItinerary(null);
          setIsLoading(false);
        }
        if (err.response && (err.response.status === 401 || err.response.status === 422)) {
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

    fetchAllItineraries()

  }, [router, user.access_token, user.user_id]);


  const fetchLocationsForItinerary = async (item: Itinerary | null) => {
    if (!item) {
      console.error('Invalid itinerary item');
      return;
    }

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('UserData') || '{}');
    setSelectedItinerary(item);

    // If user data exists and contains user_id
    if (user && user.user_id) {
      try {
        // Send GET request with itinerary id and user id
        const response = await axios.get(
          `http://localhost:5000/api/v1/itinerary_location/${item.id}/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`, // Include the token in headers
            },
          }
        );

        if (response.status === 200) {
          setSelectedLocations(response.data.locations);
        }
      } catch (error) {
        const err = error as Error;
        console.error('Error fetching locations:', err.message);
      }
    } else {
      console.error('User data not found or missing user_id');
    }
  };

  const handleImageModal = (imageURL: string) => {
    setSelectedImageURL(imageURL);
    setOpenModal(true);
  };

  const handleDeleteItinerary = async (id: number) => {
    if (!user) {
      console.error("User not found");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will permanently delete the itinerary.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:5000/api/v1/itineraries/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire("Deleted!", "Itinerary deleted successfully.", "success");
          setItinerary((prev) => prev?.filter((item) => item.id !== id) || []);
        }
      }
    } catch (error) {
      console.error("Error deleting itinerary:", error);
      Swal.fire("Error!", "Failed to delete itinerary.", "error");
    }
  };



  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  const handleImageClick = () => {
    console.log("Image clicked!");
  };

  return (
    (!isLoading &&
      <div className="min-h-screen bg-gray-50 pt-6">

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="p-4 space-y-4">
            <Link href="/" className="block hover:text-gray-300">Home</Link>
            <Link href="/itinerary" className="block hover:text-gray-300">Itinerary</Link>
            <Link href="/events" className="block hover:text-gray-300">Events</Link>
            <Link href="/recipes" className="block hover:text-gray-300">Recipes</Link>
            <Link href="/emergency" className="block hover:text-gray-300">Emergency</Link>
            <Link href="/about" className="block hover:text-gray-300">About Us</Link>
          </nav>
        </div>
        <div className="pt-24"></div>
        {/*back button*/}
        <div className="bg-white p-6 rounded-lg shadow-lg border flex items-center justify-between py-3 mt-6 mx-auto w-full">
          <button
            className="bg-black text-white px-2 rounded hover:bg-red-600 transition duration-200"
            onClick={handleNavigate} // Add onClick to navigate to itineraryCreate
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 transform rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold">My Itinerary</h2>
        </div>


        {/* Itinerary Table Section */}
        {itinerary ? <section className="container mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6 text-left">My Itinerary</h2>
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-[800px] w-full bg-white text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900"></th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Budget</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Start Date</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">End Date</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900"></th>
                </tr>
              </thead>
              <tbody>
                {itinerary.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50" onClick={() => fetchLocationsForItinerary(item)}>
                    {/* Edit Action */}
                    <td>
                      <button className="text-blue-500 hover:text-blue-700">
                        <Image src={file_image} alt="Icon" className="w-6 h-6" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">{item.total_budget}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">{item.start_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">{item.end_date}</td>
                    <td className="px-6 py-4 flex items-center space-x-4">
                      {/* Remove Action */}
                      <button
                        onClick={() => handleDeleteItinerary(item.id)}
                        className="text-red-500 hover:text-red-700">
                        <Image src={delete_image} alt="Icon" className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
          :
          <p className="text-2xl font-semibold text-gray-700 text-center mt-5">No Saved Itineraries</p>
        }

        <main className="container mx-auto mt-6 pb-10 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Preview</h2>

          {/* Card Section */}
          {selectedItinerary ? <div className="bg-white shadow-md rounded-lg p-6 w-full">

            {/* Map Section */}
            <MapComponent locations={selectedLocations} />

            {/* Location and Budget Section */}
            <div className="flex flex-col lg:flex-row justify-between mb-4">
              {/* Locations List */}
              <div className="mb-6 lg:w-2/3">
                {selectedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="flex items-center justify-between mb-3 px-2 py-1 bg-gray-50 rounded hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-2">
                      {/* Label */}
                      <label className="flex items-center text-gray-700 space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-green-400"
                        >
                          <circle cx="12" cy="12" r="8" />
                        </svg>
                        <span>
                          {loc.name}{" "}
                          <span className="text-sm text-gray-500">({loc.description})</span>
                        </span>
                      </label>

                      {/* VR Button */}
                      <button
                        onClick={handleImageClick}
                        className="text-gray-500 hover:text-gray-700 flex items-center"
                      >
                        <Image
                          onClick={() => {
                            handleImageModal(loc.location_image);
                          }}
                          src={VR}
                          alt="VR Icon"
                          className="min-w-5 min-h-5 cursor-pointer"
                        />
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
              {/* Budget Section */}
              <div className="flex flex-col items-center sm:items-start lg:w-1/3 mt-4 lg:mt-0 pt-4">
                <p className="text-gray-700 font-semibold text-center sm:text-left">
                  Total Budget
                </p>
                <p className="text-xl font-bold text-green-600 text-center sm:text-left">
                  RS {selectedItinerary.total_budget}
                </p>
              </div>
            </div>
          </div>
            :
            <p className="text-2xl font-semibold text-gray-500 text-center">Select An Itinerary to preview</p>
          }
        </main>
      </div>)
  );
}
