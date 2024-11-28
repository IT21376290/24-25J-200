"use client";

import Link from 'next/link';
import React from 'react'
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/itineraryCreate"); // Navigate to the itineraryCreate Page
  };
  return (
    <footer className="bg-gray-900 text-white py-10">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-6 lg:px-16 space-y-6 md:space-y-0">
      <div className="w-full md:w-1/3 text-center md:text-left space-y-4">
        <div className="bg-gray-500 rounded-full w-10 h-10 mx-auto md:mx-0"></div>
        <h2 className="text-2xl font-bold">Make Your Own</h2>
        <h3 className="text-green-500 text-xl font-bold">Itinerary</h3>
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition-all duration-300">
          Click Here
        </button>
      </div>
      <div className="w-full md:w-1/3 text-center md:text-left space-y-4">
        <h3 className="text-xl font-bold">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="hover:text-green-500 transition-all duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-green-500 transition-all duration-200"
            >
              About Us
            </Link>
          </li>
          <Link
            href="/itineraryCreate"
            className="hover:text-green-500 transition-all duration-200"
            onClick={handleNavigate}
          >
            Itinerary
          </Link>
          <li>
            <Link
              href="/events"
              className="hover:text-green-500 transition-all duration-200"
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              href="/recipes"
              className="hover:text-green-500 transition-all duration-200"
            >
              Recipe
            </Link>
          </li>
        </ul>
      </div>
      <div className="w-full md:w-1/3 text-center md:text-left space-y-4">
        <div>
          <h3 className="font-bold">More Inquiry</h3>
          <p className="text-gray-300">+xxxx xxx xxxx</p>
        </div>
        <div>
          <h3 className="font-bold">Send Mail</h3>
          <p className="text-gray-300">info@example.com</p>
        </div>
        <div>
          <h3 className="font-bold">Address</h3>
          <p className="text-gray-300">Address Line Here</p>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer;
