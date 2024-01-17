import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import { LayoutDashboard, UserRound, LogOut } from "lucide-react";

const UserProfileDropdown = () => {
  const { user, logout } = useUserContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicked outside
  const ref = useRef();

  useEffect(
    () => {
      const checkIfClickedOutside = (e) => {
        if (isDropdownOpen && ref.current && !ref.current.contains(e.target)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", checkIfClickedOutside);

      return () => {
        // Cleanup the event listener
        document.removeEventListener("mousedown", checkIfClickedOutside);
      };
    },
    // eslint-disable-next-line
    [isDropdownOpen]
  );

  if (!user) {
    return <div>Not Logged In</div>;
  }

  return (
    <div className='relative inline-block' ref={ref}>
      <div
        className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 cursor-pointer'
        onClick={handleToggleDropdown}
      >
        {/* Display user profile image or icon */}
        <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
          <UserRound />
        </div>
        <div>{user.fname}</div>
      </div>

      {isDropdownOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg'>
          {/* Dashboard */}
          <Link
            to={"/dashboard"}
            className='py-1 px-4 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
            onClick={handleToggleDropdown}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>

          {/* User profile information */}
          <Link
            to={"/profile"}
            className='py-1 px-4 text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2'
            onClick={handleToggleDropdown}
          >
            <UserRound size={20} /> Profile
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className='py-1 px-4 text-gray-700 hover:bg-gray-100 hover:text-red-600 cursor-pointer flex items-center gap-2'
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
