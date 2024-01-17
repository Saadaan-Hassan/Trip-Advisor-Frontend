import React, { useCallback } from "react";
import { Pencil } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

function DishForm({
  dish,
  handleChange,
  handleSubmit,
  edit,
  handleDishImageUpload,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Update the dish.image state with the first new image only
      const updatedImage = acceptedFiles[0];

      handleChange({ target: { name: "dishimageurl", value: updatedImage } });
    },
    [handleChange]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col space-y-2 my-5 col-span-2'>
          {/* Image upload and preview section */}
          <div
            {...getRootProps()}
            className='border-dashed border-2 border-gray-300 rounded p-4 text-center cursor-pointer'
          >
            <input {...getInputProps()} />
            <p>Drag & drop a file here, or click to select a file</p>
          </div>

          {dish?.dishimageurl && (
            <img
              src={
                typeof dish.dishimageurl === "string"
                  ? dish.dishimageurl
                  : URL.createObjectURL(dish.dishimageurl)
              }
              alt='Preview'
              className='h-48 w-48 object-cover rounded mx-auto'
            />
          )}

          {/* Upload button */}
          <button
            type='button'
            disabled={dish.dishimageurl?.length === 0}
            className='bg-green-500 hover:bg-green-700 text-white font-bold my-5 py-2 px-4 rounded w-full flex justify-center items-center gap-2'
            onClick={handleDishImageUpload}
          >
            <Upload /> Upload Images
          </button>
        </div>

        <input
          type='text'
          name='dishname'
          value={dish.dishname}
          onChange={handleChange}
          placeholder='Dish Name'
          required
          className='border border-gray-300 bg-gray-50 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-300 col-span-2'
        />

        <input
          type='number'
          name='price'
          value={dish.price}
          onChange={handleChange}
          placeholder='Price'
          required
          className='border border-gray-300 bg-gray-50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
        />

        <button
          type='submit'
          className='col-span-2 bg-green-500 hover:bg-green-700 text-white text-lg font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2'
        >
          <Pencil />
          {edit ? "Update Dish" : "Add Dish"}
        </button>
      </div>
    </form>
  );
}

export default DishForm;
