import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const ForgetPassword = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user) {
      navigate("/");
    }
  }, [user, navigate]);
  const [email, setEmail] = useState("");

  const sendPasswordResetEmail = (e) => {
    e.preventDefault();

    // get reseted password from backend
    axios
      .post("users/forgot-password", { email })
      .then((res) => {
        // Send password reset email
        const templateParams = {
          user_email: email,
          reset_password: res.data.updatedPassword,
          to_name: res.data.username,
        };

        emailjs
          .send(
            "service_8niokan",
            "template_e91rdqg",
            templateParams,
            "UPZ0QhEtbpsSKXpHZ"
          )
          .then(
            (result) => {
              toast.success("Password reset link sent. Check your email.");
              setEmail("");
            },
            (error) => {
              console.error("Error sending password reset email:", error);
              toast.error("Failed to send password reset email.");
            }
          );
      })
      .catch((err) => {
        console.error("Error sending password reset email:", err);
        toast.error("Failed to send password reset email.");
      });
  };

  return (
    <form
      onSubmit={sendPasswordResetEmail}
      className='max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white'
    >
      <div className='mb-6'>
        <label
          htmlFor='email'
          className='block mb-2 text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full p-3 text-sm border-gray-300 rounded-lg'
          placeholder='Enter your email'
        />
      </div>
      <input
        type='submit'
        value='Send Password Reset Link'
        className='w-full p-3 text-white bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors'
      />
    </form>
  );
};

export default ForgetPassword;
