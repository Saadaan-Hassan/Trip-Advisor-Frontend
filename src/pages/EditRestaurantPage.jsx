import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import UserImage from "../components/UserImage";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Pencil, PlusCircle, Trash } from "lucide-react";
import AddForm from "../components/AddForm";
import UploadImages from "../components/UploadImages";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/ConfirmationModal";
import DishForm from "../components/DishForm";

function EditRestaurantPage() {
  const { user, vendor, vendorToken } = useUserContext();
  const navigate = useNavigate();

  if (!vendor) {
    navigate("/login");
  }

  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({
    title: "",
    description: "",
    stadd: "",
    city: "",
    country: "",
    openingtime: "",
    closingtime: "",
  });
  const [dishes, setDishes] = useState([]);
  const [dish, setDish] = useState({
    dishid: "",
    dishname: "",
    price: "",
    dishimageurl: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [dishModal, setDishModal] = useState(false);

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
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`/restaurants/${id}`);
        setRestaurant(...response.data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchRestaurant();

    const fetchRestaurantDishes = async () => {
      try {
        const response = await axios.get(`/restaurants/${id}/dishes`);
        setDishes(response.data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchRestaurantDishes();

    return () => {
      setRestaurant({});
      setDishes([]);
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "openingtime" || e.target.name === "closingtime") {
      return setRestaurant({
        ...restaurant,
        [e.target.name]: e.target.value + ":00",
      });
    }
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/restaurants/${id}`,
        { ...restaurant, vendorid: vendor.vendorid },
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        }
      );
      toast.success("Restaurant updated successfully");
      setEdit(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });
      toast.success("Restaurant deleted successfully");
      navigate("/dashboard/vendor/restaurants");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePicturesUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurantId", restaurant.restaurantid);
    formData.append("vendorId", vendor.vendorid);

    for (let i = 0; i < restaurant.pictures.length; i++) {
      formData.append("pictures", restaurant.pictures[i]);
    }
    try {
      const response = await axios.put(
        `/restaurants/pictures/${restaurant.restaurantid}`,
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
      toast.error(error.response.data.message);
    }
  };

  const handleDishChange = (e) => {
    setDish({ ...dish, [e.target.name]: e.target.value });
  };

  const handleDishImageUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("dishImage", dish.dishimageurl);

    try {
      const response = await axios.put(
        `/dishes/${dish.dishid}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      setDishModal(false);
      setIsEdit(false);
      setDish({
        dishname: "",
        price: "",
      });

      // Update the dishes state
      setDishes((prevDishes) => ({
        ...prevDishes,
        dishes: prevDishes.dishes.map((d) =>
          d.dishid === response.data.updatedDish.dishid
            ? response.data.updatedDish
            : d
        ),
      }));
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault();

    if (dish.dishname === "" || dish.price === "") {
      return toast.error("Please fill all the fields");
    }

    try {
      let response;
      if (isEdit) {
        response = await axios.put(`/dishes/${dish.dishid}`, dish, {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        });

        // Update the rooms state
        setDishes((prevDishes) => ({
          ...prevDishes,
          dishes: prevDishes.dishes.map((d) =>
            d.dishid === response.data.updatedDish.dishid
              ? response.data.updatedDish
              : d
          ),
        }));
      } else {
        response = await axios.post(
          `/dishes`,
          {
            ...dish,
            restaurantId: restaurant.restaurantid,
          },
          {
            headers: {
              Authorization: `Bearer ${vendorToken}`,
            },
          }
        );

        // Update the rooms state
        setDishes((prevDishes) => ({
          ...prevDishes,
          dishes: [...prevDishes.dishes, response.data.dish],
        }));
      }

      toast.success(response.data.message);
      setDishModal(false);
      setIsEdit(false);
      setDish({
        dishname: "",
        price: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDishDelete = async (dishId) => {
    try {
      await axios.delete(`/dishes/${dishId}`, {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });
      toast.success("Dish deleted successfully");
      setDishes(dishes.filter((dish) => dish.dishid !== dishId));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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

  if (!restaurant) {
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
            Edit Restaurant
          </h1>

          <div className='flex justify-end items-center mt-5 mb-5 space-x-5 bg-green-100 p-5 rounded'>
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => navigate(`/restaurants/${id}`)}
            >
              <Eye />
              Public View
            </button>
          </div>

          <AddForm
            restaurant={restaurant}
            hotel={null}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            edit={true}
          />

          <UploadImages
            restaurant={restaurant}
            hotel={null}
            handleChange={handleChange}
            handlePicturesUpload={handlePicturesUpload}
            vendorToken={vendorToken}
          />
        </div>

        {/* show restaurant dishes in the form of table */}
        <div className='col-start-2 col-span-2 row-span-1 mt-10 space-y-5 py-5 rounded-3xl shadow-xl'>
          <div className='flex justify-between items-center'>
            <h1 className='text-4xl font-bold text-center mb-5 text-[#14532d]'>
              Dishes: {dishes?.dishes?.length}
            </h1>
            <button
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => {
                setDishModal(true);
                setIsEdit(false);
              }}
            >
              <PlusCircle />
              Add Dish
            </button>
          </div>

          <table className='table-auto w-full'>
            <thead>
              <tr>
                <th className='px-4 py-2'>Dish Image</th>
                <th className='px-4 py-2'>Dish Name</th>
                <th className='px-4 py-2'>Dish Price</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dishes?.dishes?.map((dish) => (
                <tr key={dish.dishid}>
                  <td className='border px-4 py-2 w-1/6'>
                    {console.log(dish)}
                    <img
                      src={dish?.dishimageurl}
                      alt={dish.dishname}
                      className='h-32 w-32 object-cover rounded'
                      loading='lazy'
                    />
                  </td>
                  <td className='border px-4 py-2'>{dish.dishname}</td>
                  <td className='border px-4 py-2'>{dish.price}</td>
                  <td className='border px-4 py-2 flex items-center gap-2 justify-center'>
                    <button
                      className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                      onClick={() => {
                        setIsEdit(true);
                        setDishModal(true);
                        setDish(dish);
                      }}
                    >
                      <Pencil />
                      Edit
                    </button>
                    <button
                      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
                      onClick={() =>
                        setConfirmationModalProps({
                          title: "Delete Dish",
                          message: "Are you sure you want to delete this Dish?",
                          onConfirm: () => {
                            handleDishDelete(dish.dishid);
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
                      <Trash />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Delete Hotel */}
          <div className='flex justify-end items-center mt-5 mb-5 space-x-5 bg-red-100 p-5 rounded'>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 text-sm'
              onClick={() => {
                setConfirmationModalProps({
                  title: "Delete Restaurant",
                  message: "Are you sure you want to delete this restaurant?",
                  onConfirm: async () => {
                    try {
                      await axios.delete(`/restaurants/${id}`, {
                        headers: {
                          Authorization: `Bearer ${vendorToken}`,
                        },
                      });
                      toast.success("Restaurant deleted successfully");
                      navigate("/dashboard/vendor/restaurants");
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
              Delete Restaurant
            </button>
          </div>
        </div>
      </div>

      {dishModal && (
        <Modal
          children={
            <DishForm
              dish={dish}
              handleChange={handleDishChange}
              handleSubmit={handleDishSubmit}
              handleDishImageUpload={handleDishImageUpload}
              edit={isEdit}
              vendorToken={vendorToken}
            />
          }
          onClose={() => {
            setIsEdit(false);
            setDishModal(false);
            setDish({
              dishname: "",
              price: "",
            });
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

export default EditRestaurantPage;
