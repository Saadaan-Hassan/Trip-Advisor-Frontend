import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import { Pencil, Trash } from "lucide-react";

function Reviews({ placeId, isRestaurant = false }) {
  const { user, token } = useUserContext();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState("");

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
    if (!placeId) {
      return;
    }

    if (isRestaurant) {
      axios.get(`/restaurant-reviews/${placeId}`).then((response) => {
        setReviews(response.data.restaurantReviews);
      });
    } else {
      axios.get(`/hotel-reviews/${placeId}`).then((response) => {
        setReviews(response.data.hotelReviews);
      });
    }
  }, [placeId]);

  const handleEditReviewChange = (e) => {
    setEditedReview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to post a review");
      return;
    }

    if (!review) {
      toast.error("Please enter a review");
      return;
    }

    if (isRestaurant) {
      const response = await axios.post(
        `/restaurant-reviews/`,
        {
          reviews: review,
          userid: user.userid,
          restaurantid: placeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      setReviews([...reviews, response.data.restaurantReview]);
      setReview("");
      toast.success("Review posted successfully");
    } else {
      const response = await axios.post(
        `/hotel-reviews/`,
        {
          reviews: review,
          userid: user.userid,
          hotelid: placeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      setReviews([...reviews, response.data.hotelReview]);
      setReview("");
      toast.success("Review posted successfully");
    }
  };

  const handleEdit = (review) => {
    if (isRestaurant) {
      setEditingReviewId(review.rstrewid);
    } else {
      setEditingReviewId(review.htlrewid);
    }
    setEditedReview(review.reviews);
  };

  const handleDelete = async (reviewId) => {
    if (isRestaurant) {
      const response = await axios.delete(`/restaurant-reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      const updatedReviews = reviews.filter((r) => r.rstrewid !== reviewId);
      setReviews(updatedReviews);
      toast.success("Review deleted successfully");
      return;
    }

    const response = await axios.delete(`/hotel-reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.error) {
      toast.error(response.data.error);
      return;
    }

    const updatedReviews = reviews.filter((r) => r.htlrewid !== reviewId);
    setReviews(updatedReviews);
    toast.success("Review deleted successfully");
  };

  const handleUpdate = async (e, reviewId) => {
    e.preventDefault();

    try {
      if (!editedReview) {
        toast.error("Please enter a review");
        return;
      }

      if (isRestaurant) {
        const response = await axios.put(
          `/restaurant-reviews/${reviewId}`,
          { reviews: editedReview },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.error) {
          toast.error(response.data.error);
          return;
        }

        setReviews(
          reviews.map((r) =>
            r.rstrewid === reviewId ? { ...r, reviews: editedReview } : r
          )
        );
        setEditingReviewId(null);
        setEditedReview("");
        toast.success("Review updated successfully");
        return;
      }

      const response = await axios.put(
        `/hotel-reviews/${reviewId}`,
        { reviews: editedReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      setReviews(
        reviews.map((r) =>
          r.htlrewid === reviewId ? { ...r, reviews: editedReview } : r
        )
      );
      setEditingReviewId(null);
      setEditedReview("");
      toast.success("Review updated successfully");
    } catch (error) {
      toast.error("Error updating review");
    }
  };

  return (
    <>
      <div className='mt-8 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='bg-white shadow-lg rounded-lg p-6 col-span-2'>
          <h2 className='font-semibold text-2xl mb-4'>Reviews</h2>
          <div>
            {user && (
              <form onSubmit={handleSubmit} className='bg-white p-4 mb-4'>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder='Write a review...'
                  className='border border-gray-300 rounded-md w-full p-2'
                  rows='2'
                />
                <button
                  type='submit'
                  className='mt-2 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded'
                >
                  Post Review
                </button>
              </form>
            )}
            {reviews?.map((review) => (
              <div
                key={isRestaurant ? review.rstrewid : review.htlrewid}
                className='bg-white p-4 mb-4'
              >
                <div className='flex items-center space-x-4 mb-2'>
                  <img
                    src={review?.profilepicurl}
                    alt={review?.username}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                  <div className='flex flex-col'>
                    <span className='font-semibold'>{review?.username}</span>
                    <span className='text-sm text-gray-600'>
                      {new Date(review?.createdat).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {editingReviewId === review?.rstrewid ||
                editingReviewId === review?.htlrewid ? (
                  <form
                    onSubmit={(e) =>
                      handleUpdate(e, review?.htlrewid || review?.rstrewid)
                    }
                  >
                    <textarea
                      value={editedReview}
                      onChange={handleEditReviewChange}
                      className='border border-gray-300 rounded-md w-full p-2'
                      rows='2'
                    />
                    <button
                      type='submit'
                      className='mt-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingReviewId(null)}
                      className='ml-2 bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded'
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <p className='text-gray-600'>
                    {review.reviews.split("\n").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                )}

                {/* Edit and Delete Buttons */}
                {user && review?.userid === user?.userid && (
                  <div className='flex justify-end space-x-2'>
                    <button
                      onClick={() => handleEdit(review)}
                      className='text-blue-500 hover:text-blue-600 flex items-center gap-1'
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setConfirmationModalProps({
                          title: "Delete Review",
                          message:
                            "Are you sure you want to delete this review?",
                          onConfirm: () => {
                            handleDelete(review?.htlrewid || review?.rstrewid);
                            setConfirmationModalProps({ isOpen: false });
                          },
                          onCancel: () => {
                            setConfirmationModalProps({ isOpen: false });
                          },
                          confirmText: "Delete",
                          cancelText: "Cancel",
                          onClose: () => {
                            setConfirmationModalProps({ isOpen: false });
                          },
                          isOpen: true,
                        });
                      }}
                      className='text-red-500 hover:text-red-600 flex items-center gap-1 border-l-2 pl-2'
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModalProps.isOpen && (
        <ConfirmationModal {...confirmationModalProps} />
      )}
    </>
  );
}

export default Reviews;
