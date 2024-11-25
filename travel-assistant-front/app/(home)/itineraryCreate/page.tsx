"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function ItineraryPage() {
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLocationOn, setIsLocationOn] = useState(true);
  const [userPreferences, setUserPreferences] = useState(false);
  const [tokenError, setTokenError] = useState(false);

  const router = useRouter();

  const handleNavigate = () => {
    router.push("/"); // Navigate to the homepage
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("UserData") || "{}");

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserPreferences(response.data.preferences);
        }
      } catch (error) {
        const err = error as AxiosError;
        if (err.response && (err.response.status === 401 || err.response.status === 422)) {
          setTokenError(true);
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

    fetchUser();
  }, [router]);

  const handleCreate = async () => {
    if (!startDate || !endDate || !budget) {
      Swal.fire({
        title: "Empty Fields",
        text: "Please fill in all required fields.",
        icon: "info",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Please provide valid start and end dates.",
        icon: "error",
      });
      return;
    }
    
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      Swal.fire({
        title: "Invalid Date!",
        text: "End date must be later than start date.",
        icon: "info",
      });
      return;
    }

    let latitudeValue = latitude;
    let longitudeValue = longitude;

    if (isLocationOn && navigator.geolocation) {
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            latitudeValue = (position.coords.latitude).toString();
            longitudeValue = position.coords.longitude.toString();
            resolve();
          },
          (error) => {
            console.error("Error fetching location:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to get location. Using manual input instead.",
              icon: "warning",
            });
            resolve();
          }
        );
      });
    }

    if (!latitudeValue || !longitudeValue) {
      Swal.fire({
        title: "Location Required",
        text: "Please provide valid latitude and longitude values.",
        icon: "error",
      });
      return;
    }

    const itinerary_data = {
      total_budget: budget,
      start_date: startDate,
      end_date: endDate,
    };

    localStorage.setItem("itineraryData", JSON.stringify(itinerary_data));

    const payload = {
      location: [parseFloat(latitudeValue), parseFloat(longitudeValue)],
      budget: parseInt(budget),
      categories: userPreferences || null,
      days: days,
    };


    if (tokenError) {
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
      return
    }

    fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {

        localStorage.setItem("itinerary", JSON.stringify(data));

        Swal.fire({
          title: "Success!",
          text: "Itinerary created successfully and saved locally!",
          icon: "success",
        });

        setTimeout(() => {
          router.push('/itinerarySave');
        }, 1500);
      })
      .catch((error) => {
        console.error("Error calling API:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to create itinerary. Please try again.",
          icon: "error",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-50  pt-24">
      <main className="container mx-auto mt-10 px-4 pb-10">

        <div className="bg-white p-6 rounded-lg shadow-lg border flex items-center justify-between py-3 mt-6 mx-auto w-full">
          <button
            className="bg-black text-white px-2 rounded hover:bg-red-600 transition duration-200"
            onClick={handleNavigate} // Add onClick to navigate to homepage
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

        <div className="pt-24"></div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold">Make Your Own Itinerary Here</h2>
        </div>

        <form className="bg-white shadow-md rounded-lg p-8 border-2 border-green-500">
          <div className="flex justify-between items-center mb-4">
            {!isLocationOn && (
              <label className="text-sm font-bold text-red-500">
                <span>❗ Make sure your location is on</span>
              </label>
            )}
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-bold">Location</label>
              <div className="relative">
                <span
                  onClick={() => setIsLocationOn((prev) => !prev)}
                  className={`flex items-center justify-center cursor-pointer w-10 h-6 rounded-full ${isLocationOn ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transform duration-200 ${isLocationOn ? "translate-x-2" : "-translate-x-2"
                      }`}
                  ></div>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 mb-4">
            {!isLocationOn ? (
              <div className="w-full md:w-1/2 flex justify-between items-center space-x-2">
                <div className="w-full md:w-1/2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="latitude"
                  >
                    Your Location Latitude *
                  </label>
                  <input
                    id="latitude"
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    placeholder="Enter location latitude"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="longitude"
                  >
                    Your Location Longitude*
                  </label>
                  <input
                    id="longitude"
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    placeholder="Enter location longitude"
                  />
                </div>
              </div>
            ) : null}

            <div className="w-full md:w-1/2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="budget"
              >
                Enter your budget (in RS) *
              </label>
              <input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                placeholder="Enter your budget"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Select a time period
            </label>
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
              <div className="w-full">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="start-date"
                >
                  Start Date *
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              <span className="hidden md:block text-xl font-semibold text-gray-700">
                To
              </span>

              <div className="w-full">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="end-date"
                >
                  End Date *
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCreate}
              type="button"
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
            >
              Create Itinerary
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
