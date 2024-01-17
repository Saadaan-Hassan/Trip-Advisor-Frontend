import { useState } from "react";
import { signupFields } from "../constants/formFields";
import FormAction from "../components/Form/FormAction";
import Input from "../components/Form/Input";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const { login } = useUserContext();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    //handle validation here
    if (!signupState.email || !signupState.password) {
      return toast.error("Please fill in all fields");
    }

    // check if the password is at least 8 characters long and have special characters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(signupState.password)) {
      return toast.error(
        "Password must be at least 8 characters long and have special characters and numbers"
      );
    }

    // check if the email is valid
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(signupState.email)) {
      return toast.error("Please enter a valid email");
    }

    // check if the password and confirm password match
    if (signupState.password !== signupState.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    createAccount();
  };

  //handle Signup API Integration here
  const createAccount = async () => {
    try {
      const response = await axios.post("/users/signup", signupState);
      login(response.data.user, response.data.token);
      toast.success("Signup Successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
      <div className=''>
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <FormAction handleSubmit={handleSubmit} text='Signup' />
      </div>
    </form>
  );
}
