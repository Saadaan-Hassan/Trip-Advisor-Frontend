import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DetailsModal({
  bookid,
  bookingstarttime,
  bookingtimeend,
  customer_name,
  hotel_address,
  hotel_city,
  hotel_country,
  hotel_title,
  hotelroomid,
  noofperson,
  payment_type,
  phone,
  priceperday,
}) {
  return (
    <div
      className='modal fade'
      id={`detailsModal${bookid}`}
      tabIndex='-1'
      aria-labelledby='detailsModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
        <div className='modal-content'>
          <div className='modal-header bg-dark text-white'>
            <h5 className='modal-title' id='detailsModalLabel'>
              Booking Details
            </h5>
            <button
              type='button'
              className='btn-close bg-white'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body bg-dark text-white'>
            <div className='row'>
              <div className='col-6'>
                <h6>Booking ID</h6>
                <p>{bookid}</p>
              </div>
              <div className='col-6'>
                <h6>Hotel Title</h6>
                <p>{hotel_title}</p>
              </div>
              <div className='col-6'>
                <h6>Hotel Address</h6>
                <p>{hotel_address}</p>
              </div>
              <div className='col-6'>
                <h6>Hotel City</h6>
                <p>{hotel_city}</p>
              </div>
              <div className='col-6'>
                <h6>Hotel Country</h6>
                <p>{hotel_country}</p>
              </div>
              <div className='col-6'>
                <h6>Hotel Room ID</h6>
                <p>{hotelroomid}</p>
              </div>
              <div className='col-6'>
                <h6>Customer Name</h6>
                <p>{customer_name}</p>
              </div>
              <div className='col-6'>
                <h6>Phone</h6>
                <p>{phone}</p>
              </div>
              <div className='col-6'>
                <h6>Payment Type</h6>
                <p>{payment_type}</p>
              </div>
              <div className='col-6'>
                <h6>Price Per Day</h6>
                <p>{priceperday}</p>
              </div>
              <div className='col-6'>
                <h6>Number of Person</h6>
                <p>{noofperson}</p>
              </div>

              <div className='col-6'>
                <h6>Booking Start Time</h6>
                <p>{bookingstarttime}</p>
              </div>
              <div className='col-6'>
                <h6>Booking End Time</h6>
                <p>{bookingtimeend}</p>
              </div>
            </div>
          </div>
          <div className='modal-footer bg-dark text-white'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
