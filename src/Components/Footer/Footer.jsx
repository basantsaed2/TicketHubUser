import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPhoneAlt,FaMapMarkerAlt,FaFacebookF, FaInstagram, FaApple, FaGooglePlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MainIcon from '../../Assets/Icons/MainIcon';

const Footer = () => {
  return (
      <div className="footer bg-mainColor w-full text-white py-8">
    <div className="w-full max-w-6xl mx-auto px-5">
      {/* Logo Section */}
      <div className="flex items-center gap-x-3 mb-6">
        <MainIcon/>
      <span className="text-3xl font-semibold">Ticket Hub</span>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Connect Us Section */}
        <div className="content">
          <h2 className="text-white font-bold text-lg mb-4">Connect With Us</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
                <FaPhoneAlt className="text-3xl text-mainColor bg-white rounded-full p-2"  />
                 <span>Phone: </span>
               </li>
               {/* <li className="flex items-center space-x-2">
                 <FaWhatsapp className="text-3xl text-mainColor bg-white rounded-full p-2"  />
                 <span>WhatsApp: +201069470088</span>
              </li> */}
               <li className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-3xl text-mainColor bg-white rounded-full p-2" />
                <span>Address: </span>
              </li>
          </ul>
          {/* Social Media Links */}
          <div className="flex space-x-4 mt-4">
            <Link
              to=""
              target="_blank"
              className="p-3 bg-white text-mainColor rounded-full hover:bg-gray-300 transition duration-300"
            >
              <FaFacebookF className="text-xl" />
            </Link>
            <Link
              to=""
              target="_blank"
              className="p-3 bg-white text-mainColor rounded-full hover:bg-gray-300 transition duration-300"
            >
              <FaInstagram className="text-xl" />
            </Link>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="content">
          <h2 className="text-white font-bold text-lg mb-4">Pages</h2>
        <ul className="gap-4 mt-4 flex flex-row md:flex-col">
        {["", "Points", "Wallet"].map((page, index) => (  
          <li key={index}>
            <NavLink
              to={page.toLowerCase().replace(" ", "_")}
              className={({ isActive }) =>
                `text-white hover:text-gray-300 transition duration-300 
                ${isActive ? "text-white font-semibold underline" : ""}`
              }
            >
              {page}
            </NavLink>
          </li>
        ))}
          </ul>
        </div>

        {/* Mobile Section */}
        <div className="content">
          <h2 className="text-white font-bold text-lg mb-4">Download Our App</h2>
          <div className="space-y-3">
          <Link className="opacity-50 cursor-not-allowed flex items-center border border-white rounded-lg px-4 py-2 space-x-4 hover:bg-white hover:text-mainColor transition duration-300">
              <FaApple className="text-2xl" />
              <span className="text-sm">App Store</span>
            </Link>
            <Link className="opacity-50 cursor-not-allowed flex items-center border border-white rounded-lg px-4 py-2 space-x-4 hover:bg-white hover:text-mainColor transition duration-300">
            <FaGooglePlay className="text-2xl" />
              <span className="text-sm">Google Play</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <Link to="" target="_blank" className="flex items-center justify-center gap-2 text-sm mt-2 border-t border-white pt-4">
        <p>©2025 . All rights reserved</p>
        <h1 className="text-white font-semibold text-lg">Ticket Hub</h1>
        </Link>
    </div>
  </div>
  );
};

export default Footer;
