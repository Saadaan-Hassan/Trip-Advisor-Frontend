import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import UserImage from "../components/UserImage";
import { signupFields } from "../constants/formFields";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useToken from "../hooks/useToken";
import DashboardNavigation from "../components/DashboardNavigation";

const fields = signupFields;

let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

function Profile() {
  const { user, setUser, logout } = useUserContext();
  const { token } = useToken();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(fieldsState);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (user === null || user === undefined) {
      return navigate("/login");
    }

    setUserData(user);
  }, [user]);

  const [updatePassword, setUpdatePassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle change in input fields
  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.id]: e.target.value });

  // Handle password change
  const handlePasswordChange = (e) =>
    setUpdatePassword({ ...updatePassword, [e.target.id]: e.target.value });

  // Handle update password
  const handleUpdatePassword = (e) => {
    e.preventDefault();

    // Check if the password is at least 8 characters long and have special characters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(updatePassword.newPassword)) {
      return toast.error(
        "Password must be at least 8 characters long and have special characters and numbers"
      );
    }

    if (updatePassword.newPassword !== updatePassword.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    axios
      .put(`users/${user.userid}/update-password`, updatePassword, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        logout();
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  // Handle update profile
  const handleUpdate = (e) => {
    e.preventDefault();

    const updateState = {
      fName: userData.fname,
      lName: userData.lname,
      phone: userData.phone,
      city: userData.city,
      stAdd: userData.stadd,
    };

    axios
      .put(`users/${user.userid}`, updateState, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        setUser(res.data.user);
        setUserData(res.data.user);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  // Handle deactivation
  const handelDeactivation = (e) => {
    axios
      .post(`users/${user.userid}/deactivate`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success(res.data.message);
        logout();
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  if (user === null || user === undefined) {
    return null;
  }

  return (
    <div className='container mx-auto mt-10 grid grid-cols-3 grid-rows-2 h-min'>
      <div className='col-span-1 row-span-2 justify-self-center space-y-20'>
        <UserImage />
        <DashboardNavigation />
      </div>

      <div className='col-span-2 row-span-1 w-3/4 justify-self-center border rounded-3xl shadow-xl bg-white p-10'>
        <div className='flex flex-col align-middle justify-center '>
          <h1 className='mt-3 text-xl font-bold text-center'>
            Profile Information
          </h1>
          <div className='flex flex-col mt-5'>
            {fields.map((field) => (
              <div className='flex flex-col' key={field.id}>
                {field.id === "password" ||
                field.id === "confirmPassword" ? null : (
                  <>
                    <label className='text-gray-700 text-sm font-bold mb-2'>
                      {field.label}
                    </label>
                    <input
                      onChange={handleChange}
                      value={userData[field.id]}
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      required={field.isRequired}
                      className='rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
                      placeholder={field.placeholder}
                      readOnly={field.id === "email" || field.id === "country"}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 rounded w-full'
          type='submit'
          onClick={handleUpdate}
        >
          Update Profile
        </button>
      </div>

      <div className='col-start-2 row-start-2 col-span-2 w-3/4 justify-self-center my-10'>
        <div className='flex flex-col align-middle justify-center border rounded-3xl shadow-xl bg-white p-10'>
          <h1 className='mt-3 text-xl font-bold text-center'>
            Update Password
          </h1>
          <div className='flex flex-col mt-5'>
            <label className='text-gray-700 text-sm font-bold mb-2'>
              Current Password
            </label>
            <input
              onChange={handlePasswordChange}
              value={userData.password}
              id='currentPassword'
              name='current-password'
              type='password'
              required={true}
              className='rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
              placeholder='Current Password'
            />

            <label className='text-gray-700 text-sm font-bold mb-2 mt-5'>
              New Password
            </label>
            <input
              onChange={handlePasswordChange}
              value={userData.password}
              id='newPassword'
              name='new-password'
              type='password'
              required={true}
              className='rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
              placeholder='New Password'
            />
            <label className='text-gray-700 text-sm font-bold mb-2 mt-5'>
              Confirm New Password
            </label>
            <input
              onChange={handlePasswordChange}
              value={userData.password}
              id='confirmPassword'
              name='confirm-password'
              type='password'
              required={true}
              className='rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm'
              placeholder='Confirm New Password'
            />
          </div>

          <button
            className='bg-yellow-400 hover:bg-yellow-600 text-white font-bold py-2 px-4 mt-5 rounded w-full'
            type='submit'
            onClick={handleUpdatePassword}
          >
            Update Password
          </button>
        </div>
      </div>

      <div className='col-start-2 row-start-3 col-span-2 w-3/4 justify-self-center border rounded-3xl shadow-xl bg-white p-10'>
        <h1 className='mb-3 text-xl font-bold py-2'>De-Activate Account</h1>
        <p className='py-2 mb-3'>
          De-activating your account will delete all your data and you will not
          be able to login again.
        </p>
        <button
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          typex='submit'
          onClick={handelDeactivation}
        >
          De-Activate Account
        </button>
      </div>
    </div>
  );
}

export default Profile;
