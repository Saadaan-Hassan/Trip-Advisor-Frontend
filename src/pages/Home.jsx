import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    try {
      const hotelResponse = axios.get("/hotels");
      const restaurantResponse = axios.get("/restaurants");

      Promise.all([hotelResponse, restaurantResponse]).then((responses) => {
        setHotels(responses[0].data.hotels);
        setRestaurants(responses[1].data.restaurants);

        // Randomize destinations from hotels and restaurants
        const destinations = responses[0].data.hotels
          .concat(responses[1].data.restaurants)
          .sort(() => Math.random() - 0.5);
        setDestinations(destinations);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Settings for the slider
  const sliderSettings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 2,
    autoplay: true,
  };

  const testimonialsSliderSettings = {
    dots: true,
    lazyLoad: true,
    infinite: true,
    speed: 700,
    slidesToScroll: 1,
    autoplay: true,
  };

  const testimonials = [
    {
      id: 1,
      text: "Our stay at the beachfront villa was nothing short of magical. The stunning views and luxurious amenities made it a dream vacation.",
      name: "John Smith",
      title: "Travel Blogger",
    },
    {
      id: 2,
      text: "Our family vacation to the mountains was unforgettable, thanks to the amazing accommodations and services we found through this site. Highly recommended!",
      name: "Jane Doe",
      title: "Adventurer",
    },
    {
      id: 3,
      text: "I had the most delicious dining experience at Flavorful Fusion Bistro. The flavors were out of this world, and the ambiance was perfect for a romantic dinner.",
      name: "Emily Johnson",
      title: "Food Critic",
    },
    {
      id: 4,
      text: "Booking through this platform was so easy, and the customer service was exceptional. Our vacation was stress-free from start to finish.",
      name: "David Williams",
      title: "Entrepreneur",
    },
    {
      id: 5,
      text: "I can't recommend this hotel enough! The staff went above and beyond to make our stay memorable. We'll definitely be back.",
      name: "Sarah Adams",
      title: "Frequent Traveler",
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Slider for Top Places */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>Top Places</h2>
        <Slider {...sliderSettings}>
          {destinations.map((destination) => (
            <div key={destination.id} className='relative group'>
              <Link
                to={
                  destination.hotelid
                    ? `/hotels/${destination.hotelid}`
                    : `/restaurants/${destination.restaurantid}`
                }
                className='block overflow-hidden'
              >
                <img
                  className='w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out'
                  src={
                    destination.pictures?.[0] ??
                    "https://placehold.co/600x400/png"
                  }
                  alt={destination.title}
                  loading='lazy'
                />
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-[#04421638] p-4'>
                  <h3 className='font-semibold text-lg md:text-xl text-white mb-2'>
                    {destination.title}
                  </h3>
                  <div
                    className='text-gray-300 text-sm line-clamp-3 w-1/2'
                    dangerouslySetInnerHTML={{
                      __html: destination.description,
                    }}
                  ></div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </section>

      {/* Hotels Section */}
      <section className='mb-12'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>
          Explore Hotels
        </h2>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 '>
          {hotels.map((hotel, index) => (
            <Link
              key={`${hotel.hotelid}-${index}`}
              to={`/hotels/${hotel.hotelid}`}
              className='rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 ease-in-out'
            >
              <div className='rounded-lg overflow-hidden shadow-md'>
                <img
                  className='w-full h-48 object-cover'
                  src={
                    hotel?.pictures?.[0] ?? "https://placehold.co/600x400/png"
                  }
                  alt={hotel.title}
                  loading='lazy'
                />
                <div className='p-4 bg-white'>
                  <h3 className='font-semibold text-lg text-gray-700 mb-2'>
                    {hotel.title}
                  </h3>
                  <div className='flex items-center justify-between'>
                    <span className='bg-green-200 text-green-700 text-sm font-semibold rounded-full px-3 py-1'>
                      {hotel.city}
                    </span>
                    <span className='bg-green-200 text-green-700 text-sm font-semibold rounded-full px-3 py-1'>
                      {hotel.country}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Restaurants Section */}
      <section>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>
          Discover Restaurants
        </h2>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
          {restaurants.map((restaurant, index) => (
            <Link
              key={`${restaurant.restaurantid}-${index}`}
              to={`/restaurants/${restaurant.restaurantid}`}
              className='rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 ease-in-out'
            >
              <div className='rounded-lg overflow-hidden shadow-md'>
                <img
                  className='w-full h-48 object-cover'
                  src={
                    restaurant.pictures[0] ?? "https://placehold.co/600x400/png"
                  }
                  alt={restaurant.title}
                  loading='lazy'
                />
                <div className='p-4 bg-white'>
                  <h3 className='font-semibold text-lg text-gray-700 mb-2'>
                    {restaurant.title}
                  </h3>
                  <div className='flex items-center justify-between'>
                    <span className='bg-green-200 text-green-700 text-sm font-semibold rounded-full px-3 py-1'>
                      {restaurant.city}
                    </span>
                    <span className='bg-green-200 text-green-700 text-sm font-semibold rounded-full px-3 py-1'>
                      {restaurant.country}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Destinations Section */}
      <section className='my-12'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>
          Explore Destinations
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {destinations.map((destination, index) => (
            <Link
              key={`${destination.hotelid}-${index}`}
              to={
                destination.hotelid
                  ? `/hotels/${destination.hotelid}`
                  : `/restaurants/${destination.restaurantid}`
              }
              className='rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 ease-in-out'
            >
              <img
                className='w-full h-48 object-cover'
                src={
                  destination.pictures?.[0] ??
                  "https://placehold.co/600x400/png"
                }
                alt={destination.title}
                loading='lazy'
              />
              <div className='p-4'>
                <h3 className='font-semibold text-lg mb-2'>
                  {destination.title}
                </h3>
                <p
                  className='text-gray-600 line-clamp-3'
                  dangerouslySetInnerHTML={{ __html: destination.description }}
                ></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className='my-12 mx-auto max-w-4xl'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-8'>
          Customer Testimonials
        </h2>

        <Slider {...testimonialsSliderSettings} className='relative'>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className='flex flex-col justify-between bg-green-100 rounded-lg shadow-2xl p-6 mx-auto'
            >
              <blockquote className='text-gray-700 italic flex-grow'>
                "{testimonial.text}"
              </blockquote>
              <div className='mt-4 text-right'>
                <p className='font-semibold'>{testimonial.name}</p>
                <p className='text-sm text-gray-500'>{testimonial.title}</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Call to Action Section */}
      <section className='bg-green-600 text-white p-6 text-center rounded-lg'>
        <h2 className='text-2xl font-bold mb-2'>
          Ready for Your Next Adventure?
        </h2>
        <p className='mb-4'>
          Discover the best deals and start planning your journey!
        </p>
        <button className='bg-white text-green-600 font-semibold py-2 px-4 rounded'>
          Browse Deals
        </button>
      </section>
    </div>
  );
}
