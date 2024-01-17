import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { BookOpen, Hotel, PlusCircle, Utensils } from "lucide-react";

export default function VendorDashboard() {
  const { user, token, vendor, vendorToken, vendorLogin } = useUserContext();
  const [hotelBookings, setHotelBookings] = useState([]);
  const [restaurantBookings, setRestaurantBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (user === null || user === undefined) {
      return navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    const authenticateVendor = async () => {
      try {
        const response = await axios.post(
          "/vendors/login/",
          { userId: user.userid },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        vendorLogin(response.data.vendor, response.data.token);

        toast.success("Vendor authenticated successfully");
      } catch (error) {
        // If vendor is not found, redirect to vendor welcome page
        if (error.response.data.message === "Vendor not found") {
          navigate("/vendor-welcome");
          return;
        }
        toast.error(error.response.data.message);
      }
    };

    authenticateVendor();

    if (vendorToken === null) {
      return;
    }
    axios
      .get(`/hotel-room-bookings/vendor/${vendor.vendorid}`, {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      })
      .then((response) => {
        const { count, hotelRoomBookings } = response.data;

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
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });

    axios
      .get(`/restaurant-reservations/vendor/${vendor.vendorid}`, {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      })
      .then((response) => {
        const { count, restaurantReservations } = response.data;

        setRestaurantBookings(
          restaurantReservations.map((booking) => ({
            ...booking,
            bookingtimestart: new Date(
              booking.bookingtimestart
            ).toLocaleDateString(),
            bookingtimeend: new Date(
              booking.bookingtimeend
            ).toLocaleDateString(),
          }))
        );
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []); // Depend on both user and token

  if (vendorToken === null) {
    return <></>;
  }
  return (
    <>
      <div className='container mx-auto mt-10 grid grid-cols-3 grid-rows-2 h-min'>
        <div className='col-span-1 row-span-2 justify-self-center space-y-20'>
          <UserImage />
          <DashboardNavigation />
        </div>

        <div className='col-span-2 row-span-2'>
          <div className='grid grid-cols-2 grid-rows-1 gap-4'>
            <div className='col-span-2 row-span-1 bg-white shadow-lg border rounded-md p-5 w-full'>
              <div className='flex justify-between items-center '>
                <p className='text-2xl font-bold text-center'>
                  Bookings:{" "}
                  <span className='font-bold'>
                    {hotelBookings.length + restaurantBookings.length}
                  </span>{" "}
                </p>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-between items-center gap-2'
                  onClick={() => {
                    navigate("/dashboard/vendor/bookings");
                  }}
                >
                  <BookOpen /> Details
                </button>
              </div>
            </div>

            <div className='col-span-1 row-span-1 bg-white shadow-lg border rounded-md p-5 w-full'>
              <div className='flex flex-col justify-between items-center '>
                <div className='bg-green-200 p-3 rounded-full mb-3'>
                  <Hotel />
                </div>
                <p className='text-3xl font-bold text-center mb-4 '>Hotels</p>
                <div className='flex justify-between items-center gap-4'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-between items-center gap-2'
                    onClick={() => {
                      navigate("/dashboard/vendor/hotels");
                    }}
                  >
                    <BookOpen /> Details
                  </button>
                  <button
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-between items-center gap-2'
                    onClick={() => {
                      navigate("/dashboard/vendor/hotels/new");
                    }}
                  >
                    Add <PlusCircle />
                  </button>
                </div>
              </div>
            </div>

            <div className='col-span-1 row-span-1 bg-white shadow-lg border rounded-md p-5 w-full'>
              <div className='flex flex-col justify-between items-center '>
                <div className='bg-green-200 p-3 rounded-full mb-3'>
                  <Utensils />
                </div>
                <p className='text-3xl font-bold text-center mb-4 '>
                  Restaurants
                </p>
                <div className='flex justify-between items-center gap-4'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-between items-center gap-2'
                    onClick={() => {
                      navigate("/dashboard/vendor/restaurants");
                    }}
                  >
                    <BookOpen /> Details
                  </button>
                  <button
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-between items-center gap-2'
                    onClick={() => {
                      navigate("/dashboard/vendor/restaurants/new");
                    }}
                  >
                    Add <PlusCircle />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
