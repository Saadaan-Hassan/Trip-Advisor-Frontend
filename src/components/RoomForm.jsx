import React from "react";
import { Pencil } from "lucide-react";
import { roomCategories } from "../constants/categories";

function RoomForm({ room, handleChange, handleSubmit, edit }) {
  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <input
          type='number'
          name='noofperson'
          value={room.noofperson}
          onChange={handleChange}
          placeholder='Maximun Number of Persons'
          required
          className='border border-gray-300 bg-gray-50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300 col-span-2'
        />

        <input
          type='number'
          name='priceperday'
          value={room.priceperday}
          onChange={handleChange}
          placeholder='Price'
          required
          className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
        />

        <select
          name='category'
          value={room.category}
          onChange={handleChange}
          required
          className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
        >
          {!edit && <option value=''>Select Category</option>}
          {Array.from(roomCategories).map((category) => {
            return (
              <option key={category.id} value={category.value}>
                {category.name}
              </option>
            );
          })}
        </select>

        <button
          type='submit'
          className='col-span-2 bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2'
        >
          <Pencil />
          {edit ? "Update Room" : "Add Room"}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;
