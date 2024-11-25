"use client"; // Add this line

import React from "react";
import header_image1 from "../../public/images/1.png";
import header_image2 from "../../public/images/2.png";
import header_image3 from "../../public/images/3.png";
import header_image4 from "../../public/images/4.png";
import Event_Image1 from "../../public/images/event01.png";
import Event_Image2 from "../../public/images/event02.png";
import Event_Image3 from "../../public/images/event03.png";
import Chickn from "../../public/images/Image.png";
import Image from "next/image";
import Link from "next/link";
import MapComponent from "../components/googleMap";


export default function HomePage() {
  
  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-white ">



        <section
          className="relative flex items-center justify-center h-screen bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/homePage.png')",
          }}
        >
          <div className="absolute inset-0"></div>

          <div className="relative z-10 text-center px-4 md:px-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-green-400">
              Explore Sri Lanka Like Never Before!
            </h1>
            <p className="mt-4 text-sm sm:text-md md:text-xl text-white max-w-2xl mx-auto">
              Welcome to Sri Lanka! Our travel app is your gateway to exploring
              this stunning island. With personalized itineraries, budget tips,
              local recipes, and immersive experiences, we’re here to help you
              create unforgettable memories. Let the adventure begin!
            </p>
          </div>
        </section>
      </div>

      <div className="bg-white text-gray-800 min-h-screen px-6 md:px-12 py-10 ">
        <div className="relative lg:absolute text-left mb-12 w-full lg:w-[45%]">
          <h2 className="text-lg font-bold text-green-500">About Us</h2>
          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold mb-4">
            Let’s know about us
          </h1>
          <p className="text-sm sm:text-base md:text-lg max-w-3xl">
            Welcome to your ultimate travel companion for exploring Sri Lanka!
            Our app is designed to make your trip planning smooth, enjoyable,
            and culturally enriching. With a range of exciting features, we
            ensure that your experience is personalized, fun, and informative.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="mt-10 lg:mt-64 xl:mt-40 2xl:mt-0">
            <h2 className="text-2xl font-bold mb-6">Main Features:</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 12.75l3 3 4.5-6"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">
                    Personalized Trip Planning
                  </h3>
                  <p className="text-gray-600">
                    Tailored itineraries based on your preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">Local Recipes</h3>
                  <p className="text-gray-600">
                    Discover authentic Sri Lankan recipes and flavors.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 6.75h.008v.008H9.75V6.75zm4.5 0h.008v.008h-.008V6.75zM9.75 17.25h.008v.008H9.75v-.008zm4.5 0h.008v.008h-.008v-.008zM6 12h12"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">
                    AI-Powered Landmark Identification
                  </h3>
                  <p className="text-gray-600">
                    Use AI to explore and learn about landmarks in real-time.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-gray-700">
              Our app is here to guide you every step of the way, making travel
              planning easy, fun, and enriching.
            </p>
            <p className="font-bold mt-4">
              Start your <span className="text-green-500">adventure</span> with
              us today and <span className="text-green-500">explore</span> Sri
              Lanka like <span className="text-green-500">never before!</span>
            </p>
            <Link
              href="#"
              className="text-green-500 font-semibold hover:underline mt-2 inline-block"
            >
              Learn more...
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden">
              <Image
                src={header_image1}
                alt="Feature 1"
                width={400}
                height={400}
                className="w-full h-full"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <Image
                src={header_image4}
                alt="Feature 2"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <Image
                src={header_image3}
                alt="Feature 3"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <Image
                src={header_image2}
                alt="Feature 4"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <section className="p-8 text-left">
        <h1 className="text-2xl sm-text-4xl md:text-5xl font-bold mb-5">
          Essential Tools for Travelers
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Essential Tools for Travelers: Plan your perfect itinerary, explore
          upcoming events, and discover popular local recipes to make the most
          of your trip
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <Image
              src={Event_Image1}
              alt="Travel Itinerary"
              width={600}
              height={400}
              className="rounded-t-lg object-cover"
            />
            <div className="bg-green-200 text-center py-2 rounded-b-lg text-lg font-semibold">
              Make Your Own Itinerary
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <Image
              src={Event_Image2}
              alt="Upcoming Events"
              width={600}
              height={400}
              className="rounded-t-lg object-cover"
            />
            <div className="bg-green-200 text-center py-2 rounded-b-lg text-lg font-semibold">
              Upcoming Events
            </div>
          </div>

          <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <Image
              src={Event_Image3}
              alt="Popular Recipes"
              width={600}
              height={400}
              className="rounded-t-lg object-cover"
            />
            <div className="bg-green-200 text-center py-2 rounded-b-lg text-lg font-semibold">
              Popular Recipes
            </div>
          </div>
        </div>
      </section>

      <div className="p-8">
        <div className="text-left mb-12">
          <h1 className="text-2xl sm-text-4xl md:text-5xl font-bold mb-4">Flavors of Sri Lanka</h1>
          <p className="text-lg text-gray-600">
            Sri Lankan cuisine is a vibrant blend of bold spices, fresh
            ingredients, and diverse cultural influences, creating unforgettable
            flavors. From spicy curries to sweet desserts, each dish reflects
            the island&apos;s rich heritage and unique cooking traditions. Explore
            beloved recipes that bring the authentic tastes of Sri Lanka to your
            kitchen!
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {/* Card 1 */}
          <div className="border rounded-lg shadow-md overflow-hidden w-[400px] h-[500px]">
            <div className="relative w-full h-48">
              <Image
                src={Chickn} // Replace with actual image path
                alt="Sri Lankan Chicken Curry"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                Sri Lankan Chicken Curry (Kukul Mas Curry)
              </h3>
              <p className="text-gray-600 mb-4">
                Sri Lankan Chicken Curry, or Kukul Mas Curry, is a rich and
                aromatic dish made with a blend of spices, coconut milk, and
                tender chicken, embodying the vibrant flavors of Sri Lankan
                cuisine.
              </p>
              <Link
                href="#"
                className="text-green-600 font-semibold hover:underline"
              >
                Learn More....
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border rounded-lg shadow-md overflow-hidden w-[400px] h-[500px]">
            <div className="relative w-full h-48">
              <Image
                src={Chickn} // Replace with actual image path
                alt="Sri Lankan Chicken Curry"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                Sri Lankan Chicken Curry (Kukul Mas Curry)
              </h3>
              <p className="text-gray-600 mb-4">
                Sri Lankan Chicken Curry, or Kukul Mas Curry, is a rich and
                aromatic dish made with a blend of spices, coconut milk, and
                tender chicken, embodying the vibrant flavors of Sri Lankan
                cuisine.
              </p>
              <Link
                href="#"
                className="text-green-600 font-semibold hover:underline"
              >
                Learn More....
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border rounded-lg shadow-md overflow-hidden w-[400px] h-[500px]">
            <div className="relative w-full h-48">
              <Image
                src={Chickn}
                alt="Sri Lankan Chicken Curry"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                Sri Lankan Chicken Curry (Kukul Mas Curry)
              </h3>
              <p className="text-gray-600 mb-4">
                Sri Lankan Chicken Curry, or Kukul Mas Curry, is a rich and
                aromatic dish made with a blend of spices, coconut milk, and
                tender chicken, embodying the vibrant flavors of Sri Lankan
                cuisine.
              </p>
              <Link
                href="#"
                className="text-green-600 font-semibold hover:underline"
              >
                Learn More....
              </Link>
            </div>
          </div>

          <div className="border rounded-lg shadow-md overflow-hidden w-[400px] h-[500px]">
            <div className="relative w-full h-48">
              <Image
                src={Chickn}
                alt="Sri Lankan Chicken Curry"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                Sri Lankan Chicken Curry (Kukul Mas Curry)
              </h3>
              <p className="text-gray-600 mb-4">
                Sri Lankan Chicken Curry, or Kukul Mas Curry, is a rich and
                aromatic dish made with a blend of spices, coconut milk, and
                tender chicken, embodying the vibrant flavors of Sri Lankan
                cuisine.
              </p>
              <Link
                href="#"
                className="text-green-600 font-semibold hover:underline"
              >
                Learn More....
              </Link>
            </div>
          </div>
        </div>
        <div className="text-right mt-8">
          <Link
            href="#"
            className="text-lg font-semibold text-green-600 hover:underline"
          >
            More Recipes →
          </Link>
        </div>
      </div>

      <section className="bg-gray-100 min-h-screen p-8">
        <div className="text-left mb-12">
          <h1 className="text-2xl sm-text-4xl md:text-5xl font-bold mb-4">Popular Landmarks</h1>
          <p className="text-lg text-gray-600">
            Explore Sri Lanka&apos;s iconic landmarks, from ancient temples to
            breathtaking natural wonders, and uncover the rich history and
            beauty of each destination.
          </p>
        </div>
        <MapComponent/>
      </section>
    </div>
  );
}
