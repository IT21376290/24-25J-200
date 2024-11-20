import axios from "axios";
import { useEffect, useRef, useState } from "react";



const Popup = ({ onClose, onItemData, onSuccess }) => {
  const [itinerary, setItinerary] = useState("");

  const [user, setUser] = useState(null);
  const [ItineraryData, setItineraryData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("UserData");
      const data = localStorage.getItem("itineraryData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (data) {
        setItineraryData(JSON.parse(data));
      }
    }
  }, []);


  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modalRef, onClose]);


  const handleSaveItineraryLocations = async (itinerary_id) => {

    const locationsIDs = onItemData.locations.map(location => location.location_id);

    const headers = {
      'Authorization': `Bearer ${user.access_token}`,
    };

    const body = {
      "distance_from_current_location": 100.0
    }

    try {
      const promises = locationsIDs.map(location_id =>
        axios.post(`http://localhost:5000/api/v1/iterneries/${itinerary_id}/locations/${location_id}/${user.user_id}`, body, { headers })
          .then(response => {
            if (response.status === 201) {
              onSuccess();
            }
          })
          .catch(error => {
            const { response } = error;
            if (response) {
            } else {
              console.error('Error without response:', error.message);
            }
          })
      );

      await Promise.all(promises);

    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };


  const onItinerarySave = async () => {

    const data = {
      "name": itinerary,
      "total_budget": ItineraryData.total_budget,
      "start_date": ItineraryData.start_date,
      "end_date": ItineraryData.end_date,
      "user_id": user.user_id
    }

    try {



      const response = await axios.post('http://localhost:5000/api/v1/itineraries', data, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        }
      });

      if (response.status === 201) {

        const itinerary_id = response.data.itinerary.id

        handleSaveItineraryLocations(itinerary_id)
      }
    } catch (error) {
      const { response } = error;
      console.log(response.data);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-[95%] sm:w-[90%] md:w-[60%] lg:w-[45%] flex flex-col"
      >
        <p className="text-lg mb-4">
          Please enter a name before saving to identify your{" "}
          <span className="text-black font-bold">Itinerary</span>.
        </p>
        <input
          type="text"
          value={itinerary}
          onChange={(e) => setItinerary(e.target.value)}
          placeholder="Enter itinerary name here"
          className="border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full flex justify-end items-center">
          <button
            className="w-36 bg-[#63AB45] text-white font-semibold py-2 rounded hover:bg-green-700 transition-all"
            onClick={onItinerarySave}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
