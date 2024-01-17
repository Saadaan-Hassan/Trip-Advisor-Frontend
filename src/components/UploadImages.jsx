import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";

function UploadImages({
  restaurant,
  hotel,
  handleChange,
  handlePicturesUpload,
  vendorToken,
}) {
  if (hotel !== null) {
    // Handle image drop
    const onDrop = useCallback(
      (acceptedFiles) => {
        // Update the hotel.images state with new images, limit total to 5 if it is not null
        const updatedImages = hotel.pictures
          ? [...hotel.pictures, ...acceptedFiles].slice(0, 5)
          : acceptedFiles;

        handleChange({ target: { name: "pictures", value: updatedImages } });
      },
      [hotel.pictures, handleChange]
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Remove an image from the list
    const removeImage = async (file) => {
      // Check if the file is a Blob or a URL
      const isBlob = typeof file === "object" && file instanceof Blob;

      // If the file is from a URL, confirm before removing
      if (!isBlob) {
        const confirmed = window.confirm(
          "Are you sure you want to remove this image?"
        );

        if (confirmed) {
          // Make the API call to delete the image from the server
          try {
            await axios.delete(`/hotels/${hotel.hotelid}/picture`, {
              headers: {
                Authorization: `Bearer ${vendorToken}`,
              },
              data: { imageUrl: file },
            });

            // Update the state only after successful deletion
            const updatedImages = hotel.pictures.filter(
              (image) => image !== file
            );
            handleChange({
              target: { name: "pictures", value: updatedImages },
            });
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
      } else {
        // Directly remove the image if it's a Blob
        const updatedImages = hotel.pictures.filter((image) => image !== file);
        handleChange({ target: { name: "pictures", value: updatedImages } });
      }
    };

    return (
      <>
        <div className='flex flex-col space-y-2 my-5 shadow-xl rounded-3xl p-5'>
          {/* Image upload section */}
          <div
            {...getRootProps()}
            className='border-dashed border-2 border-gray-300 rounded p-4 text-center cursor-pointer col-span-2'
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>

          {/* Image preview section */}
          <div className='grid grid-cols-5 gap-4'>
            {hotel?.pictures?.map((file, index) => {
              // Determine if the file is a Blob (newly uploaded file) or a URL string (existing file)
              const isBlob = typeof file === "object" && file instanceof Blob;
              const imageUrl = isBlob ? URL.createObjectURL(file) : file;

              return (
                <div key={index} className='relative'>
                  <img
                    src={imageUrl}
                    alt={`preview-${index}`}
                    className='h-50 w-50 object-cover rounded'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(file)}
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                  >
                    &#10005;
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload button */}
          <button
            type='button'
            disabled={hotel.pictures?.length === 0}
            className='bg-green-500 hover:bg-green-700 text-white font-bold my-5 py-2 px-4 rounded w-full flex justify-center items-center gap-2'
            onClick={handlePicturesUpload}
          >
            <Upload /> Upload Images
          </button>
        </div>
      </>
    );
  } else {
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

    // Handle image drop
    const onDrop = useCallback(
      (acceptedFiles) => {
        // Update the restaurant.images state with new images, limit total to 5 if it is not null
        const updatedImages = restaurant.pictures
          ? [...restaurant.pictures, ...acceptedFiles].slice(0, 5)
          : acceptedFiles;

        handleChange({ target: { name: "pictures", value: updatedImages } });
      },
      [restaurant.pictures, handleChange]
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Remove an image from the list
    const removeImage = async (file) => {
      // Check if the file is a Blob or a URL
      const isBlob = typeof file === "object" && file instanceof Blob;

      // If the file is from a URL, confirm before removing
      if (!isBlob) {
        // Set the state to open the ConfirmationModal
        setConfirmationModalProps({
          title: "Delete Image",
          message: "Are you sure you want to remove this image?",
          onConfirm: () => handleConfirmDelete(file),
          onCancel: handleCancelDelete,
          confirmText: "Delete",
          cancelText: "Cancel",
          onClose: handleCancelDelete,
          isOpen: true,
        });
      } else {
        // Directly remove the image if it's a Blob
        const updatedImages = restaurant.pictures.filter(
          (image) => image !== file
        );
        handleChange({ target: { name: "pictures", value: updatedImages } });
      }
    };

    const handleConfirmDelete = async (file) => {
      try {
        await axios.delete(`/restaurants/${restaurant.restaurantid}/picture`, {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
          data: { imageUrl: file },
        });

        const updatedImages = restaurant.pictures.filter(
          (image) => image !== file
        );
        handleChange({ target: { name: "pictures", value: updatedImages } });

        toast.success("Image removed successfully");
      } catch (error) {
        toast.error(error.response.data.message);
      }

      setConfirmationModalProps((prev) => ({ ...prev, isOpen: false }));
    };

    const handleCancelDelete = () => {
      setConfirmationModalProps((prev) => ({ ...prev, isOpen: false }));
    };

    return (
      <>
        <div className='flex flex-col space-y-2 my-5 shadow-xl rounded-3xl p-5'>
          {/* Image upload section */}
          <div
            {...getRootProps()}
            className='border-dashed border-2 border-gray-300 rounded p-4 text-center cursor-pointer col-span-2'
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>

          {/* Image preview section */}
          <div className='grid grid-cols-5 gap-4'>
            {restaurant?.pictures?.map((file, index) => {
              // Determine if the file is a Blob (newly uploaded file) or a URL string (existing file)
              const isBlob = typeof file === "object" && file instanceof Blob;
              const imageUrl = isBlob ? URL.createObjectURL(file) : file;

              return (
                <div key={index} className='relative'>
                  <img
                    src={imageUrl}
                    alt={`preview-${index}`}
                    className='h-50 w-50 object-cover rounded'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(file)}
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                  >
                    &#10005;
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload button */}
          <button
            type='button'
            disabled={restaurant.pictures?.length === 0}
            className='bg-green-500 hover:bg-green-700 text-white font-bold my-5 py-2 px-4 rounded w-full flex justify-center items-center gap-2'
            onClick={handlePicturesUpload}
          >
            <Upload /> Upload Images
          </button>
        </div>

        {confirmationModalProps.isOpen && (
          <ConfirmationModal
            title={confirmationModalProps.title}
            message={confirmationModalProps.message}
            onConfirm={confirmationModalProps.onConfirm}
            onCancel={confirmationModalProps.onCancel}
            confirmText={confirmationModalProps.confirmText}
            cancelText={confirmationModalProps.cancelText}
            onClose={confirmationModalProps.onClose}
          />
        )}
      </>
    );
  }
}

export default UploadImages;
