"use client"

import Image from "next/image";
import React, { useState, useEffect } from "react";
import icon from "../../../../public/images/icons/empty-image.png";
import ToggleButton from "@/app/components/toggle-button";
import Swal from 'sweetalert2';
import axios from "axios";
import { useRouter } from "next/navigation";


function ProfileCreationPage() {

  const [user, setUser] = useState(null); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("UserData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);
 

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    birth_of_date: "",
    contact_number: "",
    country_of_orgin: "",
    postal_zip: "",
    city: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const [imageLink, setImageLink] = useState(null);

  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      setFileToUpload(file);
      reader.onload = () => {
        setProfileImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };


  const updateUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePreferenceToggle = (preference) => {
    setUserPreferences((prevPreferences) => {
      const isPreferenceAdded = prevPreferences.includes(preference);

      if (isPreferenceAdded) {
        return prevPreferences.filter((item) => item !== preference);
      } else {
        return [...prevPreferences, preference];
      }
    });
  };

  const handleSendUserData = async (data) => {

    const token = user.access_token

    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user.user_id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
      }
    } catch (error) {
      const { response } = error;
      console.log(response.data);
    }
  }


  const handleUserData = async (e) => {
    e.preventDefault();

    // Check for empty user inputs
    const missingFields = Object.keys(userData).filter(
      (key) => !userData[key].trim()
    );

    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Information',
        text: `Please fill in the following fields: ${missingFields.join(', ')}`,
      });
      return;
    }

    // Check if image is uploaded
    if (!fileToUpload && !imageLink) {
      Swal.fire({
        icon: 'warning',
        title: 'Image Missing',
        text: 'Please upload your profile image before submitting.',
      });
      return;
    }

    // Proceed with form submission
    let finalData = {
      ...userData,
      preferences: userPreferences,
    };

    const data = new FormData();
    if (fileToUpload) {
      data.append('image', fileToUpload);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/upload_image', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const imageURL = response.data.image_url;
        setImageLink(imageURL);

        const updatedData = {
          ...finalData,
          profile_image: imageURL,
        };

        await handleSendUserData(updatedData);
        Swal.fire({
          icon: 'success',
          title: 'Profile Created',
          text: 'Your profile has been successfully created.',
        });

        setTimeout(() => {
          router.push('/');
        }, 1500)

      }
    } catch (error) {
      const { response } = error;
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: response?.data?.message || 'An error occurred. Please try again later.',
      });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md w-full mx-auto px-10 py-5 rounded-[10px] bg-white">
        <h1 className="text-[25px] sm:text-[31px] font-[600]  mb-12">
          Let&apos;s create your profile
        </h1>

        <form className="space-y-7 mb-5">
          <div className="flex justify-center">
            <label
              htmlFor="dropzone-file"
              className="flex items-center justify-center rounded-full w-[200px] sm:h-[285px] h-[200px] sm:w-[285px] cursor-pointer hover:bg-[#b8b6b6] bg-[#D9D9D9] dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500"
            >
              <div>
                {profileImage ? (
                  <Image src={profileImage} alt="Profile" className="rounded-full w-[200px] sm:h-[285px] h-[200px] sm:w-[285px]" />
                ) : (
                  <Image src={icon} alt="Empty image icon" />
                )}

              </div>
              <input
                accept="image/*"
                onChange={handleImageChange}
                id="dropzone-file"
                type="file"
                className="hidden" />
            </label>
          </div>

          <div>
            <label
              htmlFor="firstName"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Frist Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              value={userData.first_name}
              onChange={updateUserData}
              className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              value={userData.last_name}
              onChange={updateUserData}
              className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Birth Day *
            </label>

            <div className="relative">
              <input
                type="date"
                name="birth_of_date"
                value={userData.birth_of_date}
                onChange={updateUserData}
                className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Select date"
              />

              {/* <div className="absolute inset-y-3 start-[345px] text-[#C8C8C8] flex items-center hover:cursor-pointer hover:text-black">
              <Calender />
            </div> */}
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-number"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contact Number *
            </label>
            <input
              type="tel"
              id="contact-number"
              name="contact_number"
              value={userData.contact_number}
              onChange={updateUserData}
              className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your contact number "
              required
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Country Of Orgin *
            </label>
            <input
              type="text"
              id="country"
              name="country_of_orgin"
              value={userData.country_of_orgin}
              onChange={updateUserData}
              className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              placeholder="Enter your contact number "
              required
            />
          </div>

          <div className="flex gap-7">
            <div className="flex-grow">
              <label
                htmlFor="address"
                className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="city"
                value={userData.city}
                onChange={updateUserData}
                className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter your address"
                required
              />
            </div>

            <div>
              <label
                htmlFor="postal-zip"
                className="ps-1 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Postal\Zip *
              </label>
              <input
                type="text"
                id="postal-zip"
                name="postal_zip"
                value={userData.postal_zip}
                onChange={updateUserData}
                className="border border-[#D0D5DD] text-gray-900 text-[16px] rounded-[8px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="Enter your postal code"
                required
              />
            </div>
          </div>
        </form>

        <div className="mt-7">
          <h1 className="text-[20px] font-[600] mb-5">
            Tell us what you love.......
          </h1>

          <div className="flex flex-wrap">
            <ToggleButton onClick={() => { handlePreferenceToggle("Adventure") }} name="Adventure" />
            <ToggleButton onClick={() => { handlePreferenceToggle("Natural") }} name="Natural" />
            <ToggleButton onClick={() => { handlePreferenceToggle("Religious") }} name="Religious" />
            <ToggleButton onClick={() => { handlePreferenceToggle("Mountain") }} name="Mountain" />
            <ToggleButton onClick={() => { handlePreferenceToggle("Wildlife") }} name="Wildlife" />
            <ToggleButton onClick={() => { handlePreferenceToggle("History") }} name="History" />
            <ToggleButton onClick={() => { handlePreferenceToggle("Beach") }} name="Beach" />
          </div>
        </div>

        <div className="flex justify-end mt-20 mb-5">
          <button
            onClick={handleUserData}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-[600] rounded-lg text-[16px] px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCreationPage;