import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Home from "./pages/Home";
import HotelPage from "./pages/HotelPage";
import RestaurantPage from "./pages/RestaurantPage";
import PageNotFound from "./pages/PageNotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import VendorWelcome from "./pages/VendorWelcome";
import VendorDashboard from "./pages/VendorDashboard";
import TermsAndCondition from "./pages/TermsAndCondition";
import VendorHotelsDetail from "./pages/VendorHotelsDetail";
import VendorBookingDetails from "./pages/VendorBookingDetails";
import VendorRestaurnatsDetail from "./pages/VendorRestaurnatsDetail";
import AddHotelPage from "./pages/AddHotelPage";
import EditHotelPage from "./pages/EditHotelPage";
import EditRestaurantPage from "./pages/EditRestaurantPage";
import AddRestaurantPage from "./pages/AddRestaurantPage";
import ForgetPassword from "./pages/ForgetPassword";

// Setting the base URL for our API requests
axios.defaults.baseURL = "http://localhost:3000/api/v1/tripadvisor/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      {/* Setting the router */}
      <Router>
        <ToastContainer />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/hotels' element={<Home />} />
          <Route path='/hotels/:id' element={<HotelPage />} />
          <Route path='/restaurants/:id' element={<RestaurantPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/vendor-welcome' element={<VendorWelcome />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/vendor' element={<VendorDashboard />} />
          <Route
            path='/dashboard/vendor/hotels'
            element={<VendorHotelsDetail />}
          />
          <Route
            path='/dashboard/vendor/hotels/new'
            element={<AddHotelPage />}
          />
          <Route
            path='/dashboard/vendor/hotels/:id'
            element={<EditHotelPage />}
          />
          <Route
            path='/dashboard/vendor/restaurants'
            element={<VendorRestaurnatsDetail />}
          />
          <Route
            path='/dashboard/vendor/restaurants/new'
            element={<AddRestaurantPage />}
          />
          <Route
            path='/dashboard/vendor/restaurants/:id'
            element={<EditRestaurantPage />}
          />
          <Route
            path='/dashboard/vendor/bookings'
            element={<VendorBookingDetails />}
          />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/terms-and-condition' element={<TermsAndCondition />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
