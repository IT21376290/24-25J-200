"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import header_image from "../../public/images/homePage.png";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const getUserData = () => {
    try {
      const data = localStorage.getItem("UserData");
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Error parsing user data:", err);
      return null;
    }
  };

  useEffect(() => {
    const storedUser = getUserData();
    setUser(storedUser);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("UserData"); // Clear user data from localStorage
    router.push("/account/sign-in"); // Redirect to login page
  };

  const handleItineraryClick = () => {
    if (!user) {
      router.push("/account/sign-in");
    }
  };

  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen((prev) => !prev);
  // };

  return (
    <>
      <header className="fixed left-1/2 transform -translate-x-1/2 w-[96vw] h-16 bg-black text-white shadow-lg z-50 mt-5 rounded-lg py-3 mx-auto">
        <div className="absolute inset-0">
          <Image
            src={header_image}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative container mx-auto flex justify-between items-center px-4 z-10">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-500 rounded-full w-10 h-10"></div>
            <h1 className="text-2xl font-bold hidden lg:block">ITINERARY</h1>
          </div>

          {/* Navigation for larger screens */}
          <nav className="hidden lg:flex space-x-6">
            <Link href="/" className="hover:text-gray-300 text-lg">
              Home
            </Link>
            <Link
              href="/itineraryCreate"
              className="hover:text-gray-300 text-lg"
              onClick={handleItineraryClick}
            >
              Itinerary
            </Link>
            <Link
              href="/itineraryView"
              className="hover:text-gray-300 text-lg"
              onClick={handleItineraryClick}
            >
              View Itineraries
            </Link>
            <Link href="/events" className="hover:text-gray-300 text-lg">
              Events
            </Link>
            <Link href="/recipes" className="hover:text-gray-300 text-lg">
              Recipes
            </Link>
            <Link href="/emergency" className="hover:text-gray-300 text-lg">
              Emergency
            </Link>
            <Link href="/about" className="hover:text-gray-300 text-lg">
              About Us
            </Link>
          </nav>

          {/* Icons for mobile and desktop */}
          <div className="flex items-center space-x-4">
            {/* Menu Icon */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden bg-gray-800 p-2 rounded-full hover:bg-gray-700"
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
                  d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5"
                />
              </svg>
            </button>

            {/* Profile Icon */}
            <div className="relative flex justify-between items-center">
              <button className="bg-gray-800 p-2 rounded-full hover:bg-gray-700">
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
                    d="M15.75 6.75A3.75 3.75 0 1112 3a3.75 3.75 0 013.75 3.75zM3 21a9 9 0 1118 0H3z"
                  />
                </svg>
              </button>

              {/* Logout Button - visible only when user is logged in */}
              {typeof window !== "undefined" && user && (
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

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
          <Link href="/" className="block hover:text-gray-300">
            Home
          </Link>
          <Link
            href="/itineraryCreate"
            className="block hover:text-gray-300"
            onClick={handleItineraryClick}
          >
            Itinerary
          </Link>
          <Link
            href="/itineraryView"
            className="block hover:text-gray-300"
            onClick={handleItineraryClick}
          >
            View Itineraries
          </Link>
          <Link href="/events" className="block hover:text-gray-300">
            Events
          </Link>
          <Link href="/recipes" className="block hover:text-gray-300">
            Recipes
          </Link>
          <Link href="/emergency" className="block hover:text-gray-300">
            Emergency
          </Link>
          <Link href="/about" className="block hover:text-gray-300">
            About Us
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
