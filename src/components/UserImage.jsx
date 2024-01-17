import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Pencil } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import useToken from "../hooks/useToken";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";

export default function UserImage() {
  const { user, setUser } = useUserContext();
  const { token } = useToken();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (user === null || !user) {
      toast.error("You must be logged in to view this page");
      return navigate("/login");
    }

    setImage(
      user.profilepicurl === null
        ? "https://placehold.co/400"
        : user.profilepicurl
    );
  }, [user]);

  if (user === null || !user) return;

  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const capitalizeText = (text) => {
    const firstLetter = text.charAt(0).toUpperCase();
    const otherLetters = text.slice(1);
    return `${firstLetter}${otherLetters}`;
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      toast.error("File size cannot exceed more than 2MB");
      return;
    }

    setFile(file);
    setModalOpen(true);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("profilePic", file);

    axios
      .put(`users/${user.userid}/avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setImage(res.data.downloadURL);
        setUser({ ...user, profilepicurl: res.data.downloadURL });
        setFile(null);
        setModalOpen(false);
        toast.success("Profile picture updated");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <div
        className={`flex flex-col align-middle justify-center border rounded-3xl shadow-xl bg-white w-64 p-10`}
      >
        <label
          htmlFor='user-profile'
          className='justify-self-center self-center flex outline-8 rounded-full relative cursor-pointer w-[150px] h-[150px]'
        >
          <img
            src={image || "https://placehold.co/400"}
            alt=''
            className='w-full rounded-full object-cover'
          />
          <div className='absolute right-2 bottom-0 rounded-full flex p-1 bg-slate-900 outline outline-white'>
            <Pencil size='20' color='white' />
          </div>
          <input
            type='file'
            className='hidden'
            id='user-profile'
            onChange={handleChange}
          />
        </label>
        <h1 className='mt-3 text-xl font-bold text-center'>
          {" "}
          {capitalizeText(user.fname + " " + user.lname)}{" "}
        </h1>
        <h4 className='mt-1 text-sm font-extralight text-center'>
          {user.email}
        </h4>
      </div>

      {modalOpen && (
        <ConfirmationModal
          title='Are you sure you want to change your profile picture?'
          message='This action cannot be undone.'
          onConfirm={handleUpload}
          onCancel={() => {
            setFile(null);
            setModalOpen(false);
          }}
          confirmText='Confirm'
          cancelText='Cancel'
        />
      )}
    </>
  );
}
