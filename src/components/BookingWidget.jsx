import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function BookingWidget({ hotelRooms, place, isRestaurant }) {
  const { user, token } = useUserContext();
const navigate = useNavigate();
  const [bookingStartTime, setBookingStartTime] = useState("");
  const [bookingEndTime, setBookingEndTime] = useState("");
  const [reservationStartTime, setReservationStartTime] = useState("");
  const [reservationEndTime, setReservationEndTime] = useState("");
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState("");

  const [availableCategories, setAvailableCategories] = useState([]);
  const [maxPersons, setMaxPersons] = useState(100000);
  // State to store the price of the selected room
  const [selectedRoomPriceDisplay, setSelectedRoomPriceDisplay] = useState("");

  if (!isRestaurant) {
    useEffect(() => {
      if (hotelRooms.length === 0) {
        return;
      }
      const maxPersons = Math.max(...hotelRooms.map((room) => room.noofperson));
      setMaxPersons(maxPersons);
      setNumberOfPersons(maxPersons);
      updateAvailableCategories(maxPersons);

      const firstRoom = hotelRooms[0];
      setSelectedRoomCategory(
        `${firstRoom.category} - Rs.${firstRoom.priceperday}`
      );
      setSelectedRoomPriceDisplay(`Rs.${firstRoom.priceperday}`);
    }, [hotelRooms]);

    useEffect(() => {
      if (hotelRooms.length === 0) {
        return;
      }
      setSelectedRoomCategory(availableCategories[0]);
    }, [availableCategories]);
  }
  const updateAvailableCategories = (persons) => {
    const filteredRooms = hotelRooms.filter(
      (room) => room.noofperson >= persons && room.resvstatus === false
    );
    const categories = [
      ...new Set(
        filteredRooms.map((room) => `${room.category} - Rs.${room.priceperday}`)
      ),
    ];
    setAvailableCategories(categories);
  };

  const handleNumberOfPersonsChange = (e) => {
    const persons = parseInt(e.target.value);
    setNumberOfPersons(persons);
    if (!isRestaurant) {
      updateAvailableCategories(persons);
    }
  };

  const handleRoomCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedRoomCategory(selectedCategory);

    // Extract the price from the selected category
    const priceMatch = selectedCategory.match(/Rs\.(\d+)/);
    if (priceMatch) {
      setSelectedRoomPriceDisplay(`Rs.${priceMatch[1]}`);
    }
  };

  const getSelectedRoomId = () => {
    const category = selectedRoomCategory.split(" - ")[0];
    const room = hotelRooms?.find(
      (room) =>
        room.category === category &&
        room.noofperson >= numberOfPersons &&
        room.resvstatus === false
    );
    return room ? room.roomid : null;
  };

  const bookThisPlace = async () => {
    try {
      if (isRestaurant) {
        if (!reservationStartTime || !reservationEndTime) {
          toast.error("Please select reservation start and end time.");
          return;
        }

        // Construct the reservation data
        const reservationData = {
          restaurantId: place.restaurantid,
          userId: user.userid,
          paymentType: 2,
          guests: numberOfPersons,
          reservationStartTime,
          reservationEndTime,
        };

        // Send the booking data to the server
        const response = await axios.post(
          "/restaurant-reservations",
          reservationData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(response.data.message);
      } else {
        const selectedRoomId = getSelectedRoomId();
        if (!selectedRoomId) {
          toast.error("No available room found for the selected category.");
          return;
        }
        if (!bookingStartTime || !bookingEndTime) {
          toast.error("Please select booking start and end time.");
          return;
        }

        // Construct the booking data
        const bookingData = {
          hotelRoomId: selectedRoomId,
          userId: user.userid,
          paymentType: 2,
          bookingStartTime,
          bookingEndTime,
        };

        // Send the booking data to the server
        const response = await axios.post(
          "/hotel-room-bookings/",
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(response.data.message);
      }

      //Reset the form
      setBookingStartTime("");
      setBookingEndTime("");
      setReservationStartTime("");
      setReservationEndTime("")
      setNumberOfPersons(1)
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (!place) return "";

  return (
    <div className='bg-white p-6'>
      <h2 className='text-md font-semibold text-center mb-4'>
        {isRestaurant
          ? "Reserve Tables"
          : `Price: ${selectedRoomPriceDisplay} /per day`}
      </h2>

      <div className='py-2'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Number of Persons:
        </label>
        <input
          type='number'
          value={numberOfPersons}
          min='1'
          max={maxPersons}
          className='border border-gray-300 rounded-md w-full p-2'
          onChange={handleNumberOfPersonsChange}
        />
      </div>

      {isRestaurant ? null : (
        <div className='py-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Rooms
          </label>
          {availableCategories.length === 1 ? (
            <input
              type='text'
              value={availableCategories[0]}
              readOnly
              className='border border-gray-300 rounded-md w-full p-2'
            />
          ) : (
            <select
              value={selectedRoomCategory}
              onChange={handleRoomCategoryChange}
              className='border border-gray-300 rounded-md w-full p-2'
            >
              {availableCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className='mt-4 space-y-3'>
        {/* Booking/Reservation Time Inputs */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {isRestaurant ? "Reservation Start Time:" : "Booking Start Time"}
          </label>
          <input
            type='datetime-local'
            value={isRestaurant ? reservationStartTime : bookingStartTime}
            className='border border-gray-300 rounded-md w-full p-2'
            onChange={(e) =>
              isRestaurant
                ? setReservationStartTime(e.target.value)
                : setBookingStartTime(e.target.value)
            }
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {isRestaurant ? "Reservation End Time:" : "Booking End Time"}
          </label>
          <input
            type='datetime-local'
            value={isRestaurant ? reservationEndTime : bookingEndTime}
            className='border border-gray-300 rounded-md w-full p-2'
            onChange={(e) =>
              isRestaurant
                ? setReservationEndTime(e.target.value)
                : setBookingEndTime(e.target.value)
            }
          />
        </div>
      </div>

{user ? (
      <button
        onClick={bookThisPlace}
        className='mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300'
      >
        {isRestaurant ? "Reserve" : "Book this place"}
      </button>)
      : <button
      onClick={() => navigate("/login")}
      className='mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300'
    >
      Login
    </button>}
    </div>
  );
}
