import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../components/BookingWidget";
import PlaceGallery from "../components/PlaceGallery";
import AddressLink from "../components/AddressLink";
import Reviews from "../components/Reviews";

export default function HotelPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  function formatTime(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);
    const formattedTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedTime;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(`/restaurants/${id}`);
        setPlace({ ...response1.data[0], id: response1.data[0].restaurantid });

        const response2 = await axios.get(`/restaurants/${id}/dishes`);
        setPlace((prev) => ({ ...prev, dishes: response2.data.dishes }));
      } catch (error) {
        if (error.response.status === 404) {
          setPlace(null);
        }
      }
    };

    fetchData();
  }, []);

  if (!place) return "";

  return (
    <>
      <div className='mt-4 bg-gray-100 -mx-8 px-40 py-10'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>{place.title}</h1>

        {/* Address Link and Gallery */}
        <AddressLink>
          {place.stadd}, {place.city}, {place.country}
        </AddressLink>

        <PlaceGallery place={place} />

        <div className='mt-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white shadow-lg rounded-lg p-6 col-span-2'>
            <h2 className='font-semibold text-2xl mb-4'>Description</h2>
            <div
              className='text-gray-700'
              dangerouslySetInnerHTML={{ __html: place.description }}
            ></div>
          </div>

          <div className='space-y-3'>
            <div className='bg-white shadow-lg rounded-lg p-6'>
              <h3 className='font-semibold text-xl'>Details</h3>
              <p className='font-medium'>
                Opening Time:{" "}
                <span className='font-light italic'>
                  {formatTime(place.openingtime)}
                </span>
              </p>
              <p className='font-medium'>
                Closing Time:{" "}
                <span className='font-light italic'>
                  {formatTime(place.closingtime)}
                </span>
              </p>
            </div>

            {/* Booking */}
            <div className='bg-white shadow-lg rounded-lg p-6 col-span-2'>
              <h2 className='font-semibold text-2xl mb-4'>Booking</h2>
              <BookingWidget place={place} isRestaurant={true} />
            </div>
          </div>

          <div className='bg-white px-8 py-8 border-t rounded-lg shadow-lg col-span-2'>
            <h2 className='font-semibold text-2xl mb-6'>Top Dishes</h2>

            <div className='grid gap-6 md:grid-cols-2'>
              {place.dishes?.map((dish) => (
                <div
                  className='bg-white rounded-xl shadow hover:shadow-lg transition duration-300 ease-in-out p-4 hover:bg-gray-100'
                  key={dish.dishid}
                >
                  {dish.dishimageurl && (
                    <img
                      className='h-40 w-full rounded-xl object-cover mb-3'
                      src={dish.dishimageurl}
                      alt={dish.dishname}
                    />
                  )}

                  <h3 className='font-bold text-lg text-gray-700 mb-1'>
                    {dish.dishname}
                  </h3>

                  <div className='text-gray-600'>
                    <span className='font-semibold'>Rs. {dish.price}</span> per
                    meal
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Reviews placeId={id} isRestaurant={true} />
      </div>
    </>
  );
}
