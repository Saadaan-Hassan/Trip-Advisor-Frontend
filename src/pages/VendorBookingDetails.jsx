import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router-dom";

function VendorBookingDetails() {
  const [hotelBooking, setHotelBooking] = useState([]);
  const [restaurantBooking, setRestaurantBooking] = useState([]);
  const { user, vendor, vendorToken } = useUserContext();
  const navigate = useNavigate();

  // State to manage confirmation modal properties
  const [confirmationModalProps, setConfirmationModalProps] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
    confirmText: "",
    cancelText: "",
    onClose: () => {},
    isOpen: false,
  });

  useEffect(() => {
    if (user === null || user === undefined) {
      return navigate("/login");
    }

    if (vendor === null || vendor === undefined) {
      return navigate("/vendor-welcome");
    }

    const getHotelBooking = async () => {
      try {
        const response = await axios.get(
          `hotel-room-bookings/vendor/${vendor.vendorid}`,
          {
            headers: {
              Authorization: `Bearer ${vendorToken}`,
            },
          }
        );
        setHotelBooking(response.data);
      } catch (error) {
        toast.error("Failed to fetch hotel bookings. Please try again");
      }
    };
    getHotelBooking();

    const getRestaurantBooking = async () => {
      try {
        const response = await axios.get(
          `/restaurant-reservations/vendor/${vendor.vendorid}`,
          {
            headers: {
              Authorization: `Bearer ${vendorToken}`,
            },
          }
        );
        setRestaurantBooking(response.data);
      } catch (error) {
        toast.error("Failed to fetch restaurant bookings. Please try again");
      }
    };
    getRestaurantBooking();
  }, [vendor, vendorToken]);

  const unbookHotelRoom = async (hotel) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      };

      // First PUT request to unbook the room
      await axios.put(`hotel-room-bookings/${hotel.bookid}/unbook`, {}, config);

      // Then DELETE request to remove the booking
      const response = await axios.delete(
        `hotel-room-bookings/${hotel.bookid}`,
        config
      );

      // Assuming hotelBooking is an array of bookings
      const updatedHotelBookings = hotelBooking.hotelRoomBookings.filter(
        (booking) => booking.bookid !== response.data.result.bookid
      );

      setHotelBooking({
        ...hotelBooking,
        hotelRoomBookings: updatedHotelBookings,
      });

      toast.success("Successfully unbooked the room");
    } catch (error) {
      toast.error("Failed to unbook the room. Please try again");
    }
  };

  const unbookRestaurant = async (restaurant) => {
    console.log(restaurant);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      };

      // Then DELETE request to remove the booking
      const response = await axios.delete(
        `restaurant-reservations/${restaurant.resvid}`,
        config
      );

      // Assuming hotelBooking is an array of bookings
      const updatedRestaurantBookings =
        restaurantBooking.restaurantReservations.filter(
          (booking) => booking?.resvid !== response.data.result.resvid
        );

      setRestaurantBooking({
        ...restaurantBooking,
        restaurantReservations: updatedRestaurantBookings,
      });

      toast.success("Successfully unbooked the restaurant");
    } catch (error) {
      console.log(error);
      toast.error("Failed to unbook the restaurant. Please try again");
    }
  };

  if (vendor === null || !vendor) return null;

  return (
    <>
      <div className='container mx-auto mt-10 grid grid-cols-3 grid-rows-2 h-min'>
        <div className='col-span-1 row-span-2 justify-self-center space-y-20'>
          <UserImage />
          <DashboardNavigation />
        </div>

        <div className='col-span-2 row-span-2'>
          <div className='flex flex-col'>
            <h2 className='text-4xl font-bold text-center'>Hotel Bookings</h2>
            <div className='flex flex-col my-10 shadow-lg'>
              <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='w-full text-sm text-left text-gray-500'>
                  <thead className='text-xs text-gray-300 uppercase bg-green-900'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Booking ID
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Customer Name
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Customer Phone
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Hotel
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Room No.
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Check In
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Check Out
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Total Price
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Payment Method
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Edit Booking
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Unbook
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelBooking.count === 0 ? (
                      <tr className='block p-5 text-center text-green-900'>
                        {" "}
                        No Bookings
                      </tr>
                    ) : (
                      hotelBooking.hotelRoomBookings?.map((hotel) => {
                        return (
                          <tr key={hotel.bookid} className=' text-green-900'>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.bookid}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.customer_name}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.phone}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.hotel_title}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.hotelroomid}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {new Date(
                                hotel.bookingstarttime
                              ).toLocaleDateString()}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {new Date(
                                hotel.bookingtimeend
                              ).toLocaleDateString()}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.priceperday}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              {hotel.payment_type}
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              <button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={
                                  () => {
                                    toast.error(
                                      "This feature is not available yet"
                                    );
                                  } /*setEditBooking(restaurant.reservationid)*/
                                } //TODO: Add edit booking functionality
                              >
                                Edit
                              </button>
                            </td>
                            <td className='px-6 py-4 text-sm font-medium '>
                              <button
                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                  setConfirmationModalProps({
                                    title: "Unbook Room",
                                    message:
                                      "Are you sure you want to unbook this room?",
                                    onConfirm: () => {
                                      unbookHotelRoom(hotel);
                                      setConfirmationModalProps({
                                        isOpen: false,
                                      });
                                    },
                                    onCancel: () => {
                                      setConfirmationModalProps({
                                        isOpen: false,
                                      });
                                    },
                                    confirmText: "Yes",
                                    cancelText: "No",
                                    onClose: () => {
                                      setConfirmationModalProps({
                                        isOpen: false,
                                      });
                                    },
                                    isOpen: true,
                                  });
                                }}
                              >
                                Unbook
                              </button>
                            </td>
                            I
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className='text-4xl font-bold text-center'>
              Restaurant Reservations
            </h2>
            <div className='flex flex-col my-10 shadow-lg'>
              <div className='overflow-x-auto shadow-md sm:rounded-lg'>
                <table className='w-full text-sm text-left text-gray-500'>
                  <thead className='text-xs text-gray-300 uppercase bg-green-900'>
                    <tr>
                      <th scope='col' className='px-6 py-3'>
                        Customer Name
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Customer Phone
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Restaurant
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Guests
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Date
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Check In
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Check Out
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Edit Booking
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Unbook
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurantBooking.count === 0 ? (
                      <tr className='block p-5 text-center text-green-900'>
                        No Bookings
                      </tr>
                    ) : (
                      restaurantBooking.restaurantReservations?.map(
                        (restaurant) => {
                          return (
                            <tr
                              key={restaurant.resvid}
                              className='text-green-900'
                            >
                              <td className='px-6 py-4 text-sm font-medium '>
                                {restaurant.customer_name}
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                {restaurant.phone}
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                {restaurant.restaurant_name}
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                {restaurant.guests}
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                {new Date(
                                  restaurant.bookingtimestart
                                ).toLocaleDateString()}
                              </td>
                              <td className='px-6 py-3 text-sm font-medium '>
                                {new Date(
                                  restaurant.bookingtimestart
                                ).toLocaleTimeString()}
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                {new Date(
                                  restaurant.bookingtimeend
                                ).toLocaleTimeString()}
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                <button
                                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                  onClick={
                                    () => {
                                      toast.error(
                                        "This feature is not available yet"
                                      );
                                    } /*setEditBooking(restaurant.reservationid)*/
                                  } //TODO: Add edit booking functionality
                                >
                                  Edit
                                </button>
                              </td>
                              <td className='px-6 py-4 text-sm font-medium '>
                                <button
                                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                                  onClick={() => {
                                    setConfirmationModalProps({
                                      title: "Unbook Restaurant",
                                      message:
                                        "Are you sure you want to unbook this restaurant?",
                                      onConfirm: () => {
                                        unbookRestaurant(restaurant);
                                        setConfirmationModalProps({
                                          isOpen: false,
                                        });
                                      },
                                      onCancel: () => {
                                        setConfirmationModalProps({
                                          isOpen: false,
                                        });
                                      },
                                      confirmText: "Yes",
                                      cancelText: "No",
                                      onClose: () => {
                                        setConfirmationModalProps({
                                          isOpen: false,
                                        });
                                      },
                                      isOpen: true,
                                    });
                                  }}
                                >
                                  Unbook
                                </button>
                              </td>
                              I
                            </tr>
                          );
                        }
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModalProps.isOpen && (
        <ConfirmationModal {...confirmationModalProps} />
      )}
    </>
  );
}

export default VendorBookingDetails;
