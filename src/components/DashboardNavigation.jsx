import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Store, UserRound } from "lucide-react";

export default function DashboardNavigation() {
  return (
    <div
      className={`flex flex-col align-middle justify-center border rounded-3xl shadow-xl bg-white w-64 p-10`}
    >
      <Link
        to='/dashboard'
        className={`flex flex-row align-middle justify-center w-full p-2 rounded-xl hover:bg-gray-100`}
      >
        <div className='w-1/4'>
          <LayoutDashboard />
        </div>
        <div className='w-3/4'>
          <p className='text-xl font-semibold'>Dashboard</p>
        </div>
      </Link>

      <Link
        to='/dashboard/vendor'
        className={`flex flex-row align-middle justify-center w-full p-2 rounded-xl hover:bg-gray-100`}
      >
        <div className='w-1/4'>
          <Store />
        </div>
        <div className='w-3/4'>
          <p className='text-xl font-semibold'>Vendor</p>
        </div>
      </Link>

      <Link
        to='/profile'
        className={`flex flex-row align-middle justify-center w-full p-2 rounded-xl hover:bg-gray-100`}
      >
        <div className='w-1/4'>
          <UserRound />
        </div>
        <div className='w-3/4'>
          <p className='text-xl font-semibold'>Profile</p>
        </div>
      </Link>
    </div>
  );
}
