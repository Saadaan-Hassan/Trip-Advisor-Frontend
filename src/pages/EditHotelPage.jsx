import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate, useParams } from "react-router-dom";
import { BookmarkX, Eye, Pencil, PlusCircle, Trash } from "lucide-react";
import AddHotelForm from "../components/AddForm";
import UploadImages from "../components/UploadImages";
import Modal from "../components/Modal";
import RoomForm from "../components/RoomForm";
import { roomCategories } from "../constants/categories";
import ConfirmationModal from "../components/ConfirmationModal";

function EditHotelPage() {
  const [hotel, setHotel] = useState({
    title: "",
    description: "",
    stadd: "",
    city: "",
    country: "",
    openingtime: "",
    closingtime: "",
  });
  const [rooms, setRooms] = useState({});
  const [room, setRoom] = useState({
    noofperson: 0,
    priceperday: 0,
    category: "",
  });

  const { user, vendor, vendorToken } = useUserContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [roomModal, setRoomModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
    // If user is not logged in, redirect to login page
    if (user === null || user === undefined) {
      return navigate("/login");
    }

    if (vendor === null || vendor === undefined) {
      return navigate("/vendor-welcome");
    }
  }, [user, vendor]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`/hotels/${id}`, {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        });
        setHotel(response.data.hotel);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchHotel();

    const fetchHotelRooms = async () => {
      try {
        const response = await axios.get(`/hotel-rooms/hotel/${id}/`, {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        });

        setRooms(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchHotelRooms();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "openingtime" || e.target.name === "closingtime") {
      return setHotel({
        ...hotel,
        [e.target.name]: e.target.value + ":00",
      });
    }
    setHotel({ ...hotel, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create the hotel record
      const response = await axios.put(
        `/hotels/${id}`,
        { ...hotel, vendorid: vendor.vendorid },
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePicturesUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("hotelId", hotel.hotelid);
    formData.append("vendorId", vendor.vendorid);

    for (let i = 0; i < hotel.pictures.length; i++) {
      formData.append("pictures", hotel.pictures[i]);
    }

    try {
      const response = await axios.put(
        `/hotels/pictures/${hotel.hotelid}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Reset the room form
  const resetRoomForm = () => {
    setRoom({ noofperson: 0, priceperday: 0, category: "" });
  };

  const handleRoomChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    if (!room.category) {
      return toast.error("Please select a category");
    }

    if (room.noofperson === 0) {
      return toast.error("Please enter the number of persons");
    }

    if (room.priceperday === 0) {
      return toast.error("Please enter the price per day");
    }

    try {
      let response;

      if (isEdit) {
        // Update the room record
        response = await axios.put(
          `/hotel-rooms/${room.roomid}`,
          { ...room },
          { headers: { Authorization: `Bearer ${vendorToken}` } }
        );

        // Update the rooms state
        setRooms((prevRooms) => ({
          ...prevRooms,
          hotelRooms: prevRooms.hotelRooms.map((r) =>
            r.roomid === response.data.updatedRoom.roomid
              ? response.data.updatedRoom
              : r
          ),
        }));
      } else {
        // Create the room record
        response = await axios.post(
          `/hotel-rooms/`,
          { ...room, hotelId: hotel.hotelid },
          { headers: { Authorization: `Bearer ${vendorToken}` } }
        );

        // Update the rooms state
        setRooms((prevRooms) => ({
          ...prevRooms,
          hotelRooms: [...prevRooms.hotelRooms, response.data.room],
        }));
      }

      toast.success(response.data.message);
      setIsEdit(false);
      setRoomModal(false);
      resetRoomForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRoomDelete = async (roomid) => {
    try {
      await axios.delete(`/hotel-rooms/${roomid}`, {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });
      setRooms((prevRooms) => ({
        ...prevRooms,
        hotelRooms: prevRooms.hotelRooms.filter((r) => r.roomid !== roomid),
      }));
      toast.success("Room deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Filter the rooms
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [noOfPersonsFilter, setNoOfPersonsFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const recordsPerPage = 10;

  // Assuming 'rooms.hotelRooms' is your data array
  const filteredRooms = rooms?.hotelRooms?.filter((room) => {
    const categoryMatch = categoryFilter
      ? room.category.includes(categoryFilter)
      : true;
    const noOfPersonsMatch = noOfPersonsFilter
      ? room.noofperson === Number.parseInt(noOfPersonsFilter)
      : true;
    const priceMatch = priceFilter
      ? Number.parseInt(room.priceperday) === Number.parseInt(priceFilter)
      : true;
    return categoryMatch && noOfPersonsMatch && priceMatch;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRooms?.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Helper function to create an array of page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRooms?.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (
    user === null ||
    user === undefined ||
    vendor === null ||
    vendor === undefined
  ) {
    return null;
  }

  if (hotel.length === 0) {
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
            Edit Hotel
          </h1>

          <div className='flex justify-end items-center mt-5 mb-5 space-x-5 bg-green-100 p-5 rounded'>
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => navigate(`/hotels/${id}`)}
            >
              <Eye />
              Public View
            </button>
          </div>

          <AddHotelForm
            hotel={hotel}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            edit={true}
          />

          <UploadImages
            hotel={hotel}
            handleChange={handleChange}
            handlePicturesUpload={handlePicturesUpload}
            vendorToken={vendorToken}
          />
        </div>

        {/* show hotel rooms in the form of table */}
        <div className='col-start-2 col-span-2 row-span-1 mt-10 space-y-5 py-5 rounded-3xl shadow-xl'>
          <div className='flex justify-between items-center p-5'>
            <h1 className='text-2xl font-bold text-center mb-5 text-[#14532d]'>
              Hotel Rooms: {rooms?.hotelRooms?.length}
            </h1>
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => setRoomModal(true)}
            >
              <PlusCircle />
              Add Room
            </button>
          </div>

          <div className='px-5 py-2 bg-gray-200 rounded shadow-sm mx-5 grid grid-cols-4 gap-5'>
            {/* Filter by Category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='border border-gray-300 bg-gray-50 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300'
            >
              <option value=''>Select Category</option>
              {Array.from(roomCategories).map((category) => {
                return (
                  <option key={category.id} value={category.value}>
                    {category.name}
                  </option>
                );
              })}
            </select>

            {/* Filter by Number of Persons */}
            <input
              type='text'
              value={noOfPersonsFilter}
              onChange={(e) => setNoOfPersonsFilter(e.target.value)}
              className='border border-gray-300 bg-gray-50 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300'
              placeholder='Filter by No. of Persons'
            />

            {/* Filter by Price */}
            <input
              type='number'
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className='border border-gray-300 bg-gray-50 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300'
              placeholder='Filter by Price'
            />

            {/* Clear Filters */}
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => {
                setCategoryFilter("");
                setNoOfPersonsFilter("");
                setPriceFilter("");
              }}
            >
              <BookmarkX />
              Clear Filters
            </button>
          </div>

          <table className='w-full text-sm text-left text-green-900 whitespace-no-wrap mt-5'>
            <thead className=' text-gray-300 uppercase bg-green-900'>
              <tr>
                <th className='px-4 py-2'>Room No.</th>
                <th className='px-4 py-2'>Room Type</th>
                <th className='px-4 py-2'>Price</th>
                <th className='px-4 py-2'>Capacity</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords
                ?.sort((a, b) => {
                  const numberA = parseInt(a.roomid.split("_")[1]);
                  const numberB = parseInt(b.roomid.split("_")[1]);

                  return numberA - numberB;
                })
                .map((room) => (
                  <tr key={room.roomid}>
                    <td className='border px-4 py-2'>{room.roomid}</td>
                    <td className='border px-4 py-2'>{room.category}</td>
                    <td className='border px-4 py-2'>{room.priceperday}</td>
                    <td className='border px-4 py-2'>{room.noofperson}</td>
                    <td className='border px-4 py-2 flex items-center gap-2'>
                      <button
                        className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                        onClick={() => {
                          setIsEdit(true);
                          setRoom(room);
                          setRoomModal(true);
                        }}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                        onClick={() =>
                          setConfirmationModalProps({
                            title: "Delete Room",
                            message:
                              "Are you sure you want to delete this room?",
                            onConfirm: () => {
                              handleRoomDelete(room.roomid);
                              setConfirmationModalProps({ isOpen: false });
                            },
                            onCancel: () => {
                              setConfirmationModalProps({ isOpen: false });
                            },
                            confirmText: "Delete",
                            cancelText: "Cancel",
                            onClose: () =>
                              setConfirmationModalProps({ isOpen: false }),
                            isOpen: true,
                          })
                        }
                      >
                        <Trash size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className='flex justify-center items-center space-x-2'>
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(1)}
                className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded'
              >
                First
              </button>
            )}

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded ${
                  currentPage === number ? "bg-gray-300" : ""
                }`}
              >
                {number}
              </button>
            ))}

            {currentPage < pageNumbers.length && (
              <button
                onClick={() => setCurrentPage(pageNumbers.length)}
                className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded'
              >
                Last
              </button>
            )}
          </div>

          {/* Delete Hotel */}
          <div className='flex justify-end items-center mt-5 mb-5 space-x-5 bg-red-100 p-5 rounded'>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => {
                setConfirmationModalProps({
                  title: "Delete Hotel",
                  message: "Are you sure you want to delete this hotel?",
                  onConfirm: async () => {
                    try {
                      await axios.delete(`/hotels/${hotel.hotelid}`, {
                        headers: {
                          Authorization: `Bearer ${vendorToken}`,
                        },
                      });
                      toast.success("Hotel deleted successfully");
                      navigate("/dashboard/vendor/hotels");
                    } catch (error) {
                      toast.error(error.response.data.message);
                    }
                  },
                  onCancel: () => {
                    setConfirmationModalProps({ isOpen: false });
                  },
                  confirmText: "Delete",
                  cancelText: "Cancel",
                  onClose: () => setConfirmationModalProps({ isOpen: false }),
                  isOpen: true,
                });
              }}
            >
              <Trash />
              Delete Hotel
            </button>
          </div>
        </div>
      </div>

      {roomModal && (
        <Modal
          children={
            <RoomForm
              room={room}
              handleChange={handleRoomChange}
              handleSubmit={handleRoomSubmit}
              edit={isEdit}
            />
          }
          onClose={() => {
            setIsEdit(false);
            setRoomModal(false);
            resetRoomForm();
          }}
          shouldClose={() => true}
        />
      )}

      {confirmationModalProps.isOpen && (
        <ConfirmationModal {...confirmationModalProps} />
      )}
    </>
  );
}

export default EditHotelPage;
