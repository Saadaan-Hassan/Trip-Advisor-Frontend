import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { countries } from "countries-list";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddForm({ restaurant, hotel, handleChange, handleSubmit, edit }) {
  const [description, setDescription] = useState();

  const handleDescriptionChange = (value) => {
    setDescription(value);
    handleChange({ target: { name: "description", value: value } });
  };

  useEffect(() => {
    if (hotel !== null) {
      setDescription(hotel.description);
    } else {
      setDescription(restaurant.description);
    }
  }, [hotel, restaurant]);

  if (hotel !== null) {
    return (
      <form
        onSubmit={handleSubmit}
        className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Hotel Name
          </label>
          <input
            type='text'
            name='title'
            value={hotel.title}
            onChange={handleChange}
            placeholder='Hotel Name'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300 col-span-2'
          />

          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <ReactQuill
              theme='snow'
              value={description}
              onChange={handleDescriptionChange}
              className='bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
            />
          </div>

          <input
            type='text'
            name='stadd'
            value={hotel.stadd}
            onChange={handleChange}
            placeholder='Hotel Address'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          <input
            type='text'
            name='city'
            value={hotel.city}
            onChange={handleChange}
            placeholder='Hotel City'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />
          {edit ? null : (
            <select
              name='country'
              value={hotel.country}
              onChange={handleChange}
              required
              className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
            >
              <option value=''>Select Country</option>
              {Object.keys(countries).map((country) => {
                return (
                  <option key={country} value={country}>
                    {countries[country].name}
                  </option>
                );
              })}
            </select>
          )}

          <input
            type='time'
            name='openingtime'
            value={hotel.openingtime}
            onChange={handleChange}
            placeholder='Hotel Opening Time'
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          <input
            type='time'
            name='closingtime'
            value={hotel.closingtime}
            onChange={handleChange}
            placeholder='Hotel Closing Time'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          <button
            type='submit'
            className='col-span-2 bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2'
          >
            <Pencil />
            {edit ? "Update Hotel" : "Add Hotel"}
          </button>
        </div>
      </form>
    );
  } else {
    return (
      <form
        onSubmit={handleSubmit}
        className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <input
            type='text'
            name='title'
            value={restaurant.title}
            onChange={handleChange}
            placeholder='Restaurant Name'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300 col-span-2'
          />

          <div className='col-span-2'>
            <ReactQuill
              theme='snow'
              value={description}
              onChange={handleDescriptionChange}
              className='bg-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
            />
          </div>

          <input
            type='text'
            name='stadd'
            value={restaurant.stadd}
            onChange={handleChange}
            placeholder='Restaurant Address'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          <input
            type='text'
            name='city'
            value={restaurant.city}
            onChange={handleChange}
            placeholder='Restaurant City'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          {edit ? null : (
            <select
              name='country'
              value={restaurant.country}
              onChange={handleChange}
              required
              className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
            >
              <option value=''>Select Country</option>
              {Object.keys(countries).map((country) => {
                return (
                  <option key={country} value={country}>
                    {countries[country].name}
                  </option>
                );
              })}
            </select>
          )}

          <input
            type='time'
            name='openingtime'
            value={restaurant.openingtime}
            onChange={handleChange}
            placeholder='Restaurant Opening Time'
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          <input
            type='time'
            name='closingtime'
            value={restaurant.closingtime}
            onChange={handleChange}
            placeholder='Restaurant Closing Time'
            required
            className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
          />

          <button
            type='submit'
            className='col-span-2 bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2'
          >
            <Pencil />
            {edit ? "Update Restaurant" : "Add Restaurant"}
          </button>
        </div>
      </form>
    );
  }
}

export default AddForm;
