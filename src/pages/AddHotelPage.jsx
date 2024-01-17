import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, Hotel, PlusCircle, Utensils } from "lucide-react";
import AddHotelForm from "../components/AddForm";

function AddHotelPages() {
  const [hotel, setHotel] = useState({
    title: "",
    description: "",
    stadd: "",
    city: "",
    country: "",
    vendorId: "",
    openingtime: "",
    closingtime: "",
  });
  const { user, vendor, vendorToken } = useUserContext();
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

  const handleChange = (e) => {
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create the hotel record
      const response = await axios.post(
        "/hotels",
        { ...hotel, vendorId: vendor.vendorid },
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        }
      );

      // Redirect to the hotel detail page
      navigate(`/dashboard/vendor/hotels/${response.data.hotel.hotelid}`);

      // Show success message
      toast.success("Hotel added successfully!");

      // Reset the form
      setHotel({
        title: "",
        description: "",
        stadd: "",
        city: "",
        country: "",
        vendorId: "",
        openingtime: "",
        closingtime: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (
    user === null ||
    user === undefined ||
    vendor === null ||
    vendor === undefined
  ) {
    return null;
  }

  return (
    <>
      <div className='container mx-auto mt-10 grid grid-cols-3 grid-rows-2 h-min'>
        <div className='col-span-1 row-span-2 justify-self-center space-y-20'>
          <UserImage />
          <DashboardNavigation />
        </div>

        <div className='col-span-2 row-span-2 bg-white shadow-lg rounded-lg p-8'>
          <h1 className='text-5xl font-bold text-center mb-8 text-[#14532d]'>
            Add Hotel
          </h1>

          <div className='flex justify-end items-center mt-5 mb-5 space-x-5 bg-green-100 p-2 rounded-lg'>
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => navigate("/dashboard/vendor/hotels")}
            >
              <Eye />
              View Hotel
            </button>
          </div>

          <AddHotelForm
            hotel={hotel}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}

export default AddHotelPages;
