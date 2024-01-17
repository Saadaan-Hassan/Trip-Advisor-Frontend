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
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/hotels/${id}`).then((response) => {
      setPlace({ ...response.data.hotel, id: response.data.hotel.hotelid });
    });

    axios.get(`/hotel-rooms/hotel/${id}`).then((response) => {
      setRooms(response.data.hotelRooms);
    });
  }, [id]);

  if (!place) return "";

  function formatTime(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);
    const formattedTime = time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formattedTime;
  }

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
              <BookingWidget
                hotelRooms={rooms} // Pass the hotel rooms data here
                place={place}
                isRestaurant={false} // or true depending on the context
              />
            </div>
          </div>
        </div>

        <Reviews placeId={id} />
      </div>
    </>
  );
}
