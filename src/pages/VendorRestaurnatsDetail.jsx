import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { PlusCircle, BookOpen, Eye } from "lucide-react";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VendorRestaurnatsDetail() {
  const { user, vendor, vendorToken } = useUserContext();
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (user === null || user === undefined) {
      return navigate("/login");
    }

    if (vendor === null || vendor === undefined) {
      return navigate("/vendor-welcome");
    }
  }, [user, vendor]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `/restaurants/vendor/${vendor.vendorid}`,
          {
            headers: {
              Authorization: `Bearer ${vendorToken}`,
            },
          }
        );
        setRestaurants(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || error);
      }
    };
    fetchRestaurants();
  }, []);

  if (
    user === null ||
    user === undefined ||
    vendor === null ||
    vendor === undefined
  ) {
    return null;
  }

  if (restaurants.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className='container mx-auto mt-10 grid grid-cols-3 grid-rows-2 h-min'>
        <div className='col-span-1 row-span-2 justify-self-center space-y-20'>
          <UserImage />
          <DashboardNavigation />
        </div>

        <div className='col-span-2 row-span-2'>
          <h1 className='text-4xl font-bold text-center mb-5 text-[#14532d]'>
            Restaurant Details
          </h1>

          <div className='flex justify-between items-center mt-5 mb-5 space-x-5 bg-green-100 p-5 rounded'>
            <p className='text-xl font-bold text-[#14532d]'>
              Restaurants: {restaurants.restaurants.length}
            </p>

            <div className='flex justify-end space-x-5 '>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                onClick={() => navigate("/dashboard/vendor/bookings")}
              >
                <BookOpen />
                View Bookings
              </button>

              <button
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                onClick={() => navigate("/dashboard/vendor/restaurants/new")}
              >
                <PlusCircle />
                Add Restaurants
              </button>
            </div>
          </div>
          {restaurants.restaurants.map((restaurant) => {
            return (
              <div
                key={restaurant.restaurantid}
                className='max-w-sm rounded overflow-hidden shadow-lg mx-auto'
              >
                <img
                  className='w-full'
                  src={restaurant.pictures[0]}
                  alt={restaurant.title}
                  style={{ height: "300px" }}
                />
                <div className='px-6 py-4'>
                  <div className='font-bold text-xl mb-2 text-[#14532d]'>
                    {restaurant.title}
                  </div>
                </div>

                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded flex justify-center items-center gap-2 text-sm w-full'
                  onClick={() =>
                    navigate(
                      `/dashboard/vendor/restaurants/${restaurant.restaurantid}`
                    )
                  }
                >
                  <Eye />
                  View
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default VendorRestaurnatsDetail;
