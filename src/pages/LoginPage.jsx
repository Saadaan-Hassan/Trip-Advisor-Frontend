import Header from "../components/Form/Header";
import Login from "../components/Login";
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null && user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className='max-w-lg mx-auto mt-20'>
      <Header
        heading='Login to your account'
        paragraph="Don't have an account yet? "
        linkName='Signup'
        linkUrl='/signup'
      />

      <Login />
    </div>
  );
}
