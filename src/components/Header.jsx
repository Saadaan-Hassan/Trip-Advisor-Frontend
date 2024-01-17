import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Menu, UserRound } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Header() {
  const { user } = useUserContext();

  return (
    <header className='flex justify-between mb-6'>
      <Link to={"/"} className='flex items-center gap-1'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-8 h-8 -rotate-90'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
          />
        </svg>
        <span className='font-bold text-xl'>Trip Advisor</span>
      </Link>
      {user ? (
        <UserProfileDropdown />
      ) : (
        <Link
          to={"/login"}
          className='flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 '
        >
          <Menu />
          <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
            <UserRound />
          </div>
          <div>Login</div>
        </Link>
      )}
    </header>
  );
}
