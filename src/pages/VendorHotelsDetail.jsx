import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { PlusCircle, BookOpen, Eye } from "lucide-react";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";

function VendorHotelsDetail() {
  const { user, vendor, vendorToken } = useUserContext();
  const [hotels, setHotels] = useState([]);
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
    const fetchHotels = async () => {
      try {
        const response = await axios.get(`/hotels/vendor/${vendor.vendorid}`, {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        });
        setHotels(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchHotels();
  }, []);

  if (
    user === null ||
    user === undefined ||
    vendor === null ||
    vendor === undefined
  ) {
    return null;
  }

  if (hotels.length === 0) {
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
            Hotel Details
          </h1>

          <div className='flex justify-between items-center mt-5 mb-5 space-x-5 bg-green-100 p-5 rounded'>
            <p className='text-xl font-bold text-[#14532d]'>
              Hotels: {hotels.hotels.length}
            </p>

            <div className='flex justify-end space-x-5 '>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2'
                onClick={() => navigate("/dashboard/vendor/bookings")}
              >
                <BookOpen />
                View Bookings
              </button>

              <button
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                onClick={() => navigate("/dashboard/vendor/hotels/new")}
              >
                <PlusCircle />
                Add Hotel
              </button>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {hotels.hotels.map((hotel, index) => {
              return (
                <div
                  key={index}
                  className='max-w-fit rounded overflow-hidden shadow-xl mx-auto'
                >
                  <img
                    className='w-full'
                    src={
                      hotel?.pictures?.length > 0
                        ? hotel.pictures[0]
                        : "https://placehold.co/600x400/png"
                    }
                    alt={hotel.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className='px-6 py-4'>
                    <div className='font-bold text-xl mb-2 text-[#14532d]'>
                      {hotel.title}
                    </div>
                  </div>

                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded flex justify-center items-center gap-2 text-sm w-full'
                    onClick={() =>
                      navigate(`/dashboard/vendor/hotels/${hotel.hotelid}`)
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
      </div>
    </>
  );
}

export default VendorHotelsDetail;
