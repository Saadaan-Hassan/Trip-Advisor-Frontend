import React, { useState, useEffect } from "react";
import UserImage from "../components/UserImage";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import useToken from "../hooks/useToken";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardNavigation from "../components/DashboardNavigation";
import { Eye } from "lucide-react";

export default function Dashboard() {
  const { user } = useUserContext();
  const [hotelBookings, setHotelBookings] = useState([]);
  const [restaurantBookings, setRestaurantBookings] = useState([]);
  const { token } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (user === null || !user) {
      return navigate("/login");
    }
    const fetchBookings = async () => {
      try {
        const hotelData = await axios.get(
          `hotel-room-bookings/user/${user.userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const restaurantData = await axios.get(
          `restaurant-reservations/user/${user.userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { count, hotelRoomBookings } = hotelData.data;

        setHotelBookings(
          hotelRoomBookings.map((booking) => ({
            ...booking,
            bookingstarttime: new Date(
              booking.bookingstarttime
            ).toLocaleDateString(),
            bookingtimeend: new Date(
              booking.bookingtimeend
            ).toLocaleDateString(),
          }))
        );

        setRestaurantBookings(
          restaurantData.data.restaurantReservations.map((booking) => ({
            ...booking,
            bookingtimestart: new Date(
              booking.bookingtimestart
            ).toLocaleDateString(),
            bookingtimeend: new Date(
              booking.bookingtimeend
            ).toLocaleDateString(),
          }))
        );
      } catch (error) {
        toast.error("Error fetching bookings");
      }
    };

    fetchBookings();

    return () => {
      setHotelBookings([]);
      setRestaurantBookings([]);
    };
  }, [user]);

  if (user === null || !user) return;

  return (
    <div className='container mx-auto mt-10 grid grid-cols-3 grid-rows-2 h-min'>
      <div className='col-span-1 row-span-2 justify-self-center space-y-20'>
        <UserImage />
        <DashboardNavigation />
      </div>

      {/* Hotel Bookings Table */}
      <div className='col-span-2 row-span-2'>
        <div className='flex flex-col'>
          <p className='text-4xl font-bold text-center'>Hotel Bookings</p>
          <div className='flex flex-col my-10 shadow-lg'>
            <div className='overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-300 uppercase bg-green-900'>
                  <tr className='text-left'>
                    <th scope='col' className='px-6 py-3'>
                      Hotel Name
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Check In
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Check Out
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Room Type
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Room Price
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Hotel
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loop through user bookings and display them in the table */}
                  {hotelBookings.map((booking) => (
                    <tr key={booking.bookid} className=' text-green-900'>
                      <td className='px-6 py-4 text-sm font-medium '>
                        {booking.hoteltitle}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium '>
                        {booking.bookingstarttime}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium '>
                        {booking.bookingtimeend}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium '>
                        {booking.category}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium '>
                        {booking.priceperday}
                      </td>

                      <td className='px-6 py-4 text-xs font-medium '>
                        <button
                          className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2'
                          onClick={() => navigate(`/hotels/${booking.hotelid}`)}
                        >
                          <Eye size={16} />
                          View Hotel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Display a message if user has no bookings */}
              {hotelBookings.length === 0 && (
                <div className='text-center text-gray-500 mt-3'>
                  You have no bookings
                  <Link
                    to='/'
                    className='text-green-500 hover:text-green-600 underline ps-2'
                  >
                    Search for hotels
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className='text-4xl font-bold text-center'>
          Restaurant Reservations
        </h2>
        <div className='flex flex-col my-10 shadow-lg'>
          <div className='overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-sm text-left text-gray-500'>
              <thead className='text-xs text-gray-300 uppercase bg-green-900'>
                <tr className='text-left'>
                  <th scope='col' className='px-6 py-3'>
                    Restaurant Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Date
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Time
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Guests
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Restaurant
                  </th>
                </tr>
              </thead>
              <tbody>
                {console.log(restaurantBookings)}
                {restaurantBookings.map((booking) => (
                  <tr key={booking.resvid} className='text-green-900'>
                    <td className='px-6 py-4 text-sm font-medium '>
                      {booking.restauranttitle}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium '>
                      {booking.bookingtimestart}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium '>
                      {booking.bookingtimeend}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium '>
                      {booking.guests}
                    </td>

                    <td className='px-6 py-4 text-sm font-medium '>
                      <button
                        className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2'
                        onClick={() =>
                          navigate(`/restaurants/${booking.restaurantid}`)
                        }
                      >
                        <Eye size={16} />
                        View Restaurant
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {restaurantBookings.length === 0 && (
              <div className='p-5 text-center text-green-900'>
                You have no bookings
                <Link
                  to='/'
                  className='text-green-500 hover:text-green-600 underline ps-2'
                >
                  Search for restaurants
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
