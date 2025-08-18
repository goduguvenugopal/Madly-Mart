import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import {
  FaDownload,
  FaFacebook,
  FaInstagram,
  FaShareSquare,
  FaYoutube,
} from "react-icons/fa";
import { EnvContext } from "../../App";

const Footer = () => {
  const { number } = useContext(EnvContext);

  // share app function
  const shareApp = async () => {
    try {
      await navigator.share({
        url: "https://madlymartuser.vercel.app",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <footer className="text-white-600 body-font text-white bg-blue-900">
      <div className="container px-5 pt-10 mx-auto flex items-center md:flex-row flex-col">
        <div className="flex flex-col md:pr-10 md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
          <h2 className="text-xs text-orange-600 tracking-widest font-medium title-font mb-1">
            Madly Mart
          </h2>
          <h1 className=" text-md font-medium title-font text-white">
            Download our app for a better experience! Get faster access,
            exclusive features, and more.
          </h1>
        </div>
        <div className="flex items-center flex-wrap justify-center gap-3 w-full">
          <a
            href="/Madly Mart.apk"
            download="Madly Mart.apk"
            className="bg-gray-100 text-center h-10 inline-flex gap-2 text-black py-2 px-5 rounded-full items-center hover:bg-gray-200 focus:outline-none w-[11rem]"
          >
            <FaDownload className="w-4 h-4" />
            <span className="title-font font-medium">Download App</span>
          </a>
          <button
            onClick={shareApp}
            className="bg-blue-600 text-white flex items-center justify-center gap-2 font-semibold h-10 rounded-full w-[11rem]"
          >
            <FaShareSquare className=" text-white" />
            Share App
          </button>
        </div>
      </div>
      <div className="container px-5 py-24 pt-10 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <Link
            to="/"
            className="flex title-font font-medium items-center md:justify-start justify-center text-white"
          >
            <img
              src="/MadlyMart.jpg"
              className="w-fit h-24 lg:h-32 text-white rounded-full"
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-orange-600 tracking-widest text-sm mb-3">
              Follow Us
            </h2>
            <nav className="list-none mb-10 flex  items-center lg:items-start flex-col w-full">
              <div>
                <li className="flex ">
                  <a
                    className="text-white-600 hover:text-white-800 flex items-center gap-2"
                    href=""
                  >
                    <FaYoutube className="bg-white text-red-600   w-8 h-8 p-1 rounded-full " />{" "}
                    YouTube
                  </a>
                </li>
                <li className="flex mt-3">
                  <a
                    className="text-white-600 hover:text-white-800 flex items-center gap-2"
                    href=""
                  >
                    <FaInstagram className="bg-white text-red-600 w-8 h-8 p-1 rounded-full " />{" "}
                    Instagram
                  </a>
                </li>
                <li className="flex mt-3">
                  <a
                    className="text-white-600 hover:text-white-800 flex items-center gap-2"
                    href=" "
                  >
                    <FaFacebook className="bg-white text-blue-600   w-8 h-8 p-1 rounded-full " />{" "}
                    Facebook
                  </a>
                </li>
              </div>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-orange-600 tracking-widest text-sm mb-3">
              Address
            </h2>
            <nav className="list-none mb-10">
              <li>Hyderabad , Telangana , India.</li>
              <li className="flex items-center lg:items-start flex-col">
                <a
                  href={`tel:+91${number}`}
                  className="flex items-center gap-3"
                >
                  Customer Care : {number}
                </a>
                <a
                  href="mailto:madlymart@gmail.com"
                  className="flex items-center gap-3"
                >
                  Email us
                </a>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-orange-600 tracking-widest text-sm mb-3">
              HELP
            </h2>
            <nav className="list-none mb-10">
              <li>
                <Link
                  to="/terms_and_conditions"
                  className="text-white-600 hover:text-white-800"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacypolicy"
                  className="text-white-600 hover:text-white-800"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund_and_cancellation"
                  className="text-white-600 hover:text-white-800"
                >
                  Refund and Cancellation
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping_and_delivery"
                  className="text-white-600 hover:text-white-800"
                >
                  Shipping and Delivery Policy{" "}
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className=" py-4 px-5 ">
          <a href="https://www.goduguvenugopal.in/" target="_self">
            <p className=" text-black text-center ">
              © 2025 Built with ❤️ by{" "}
              <span className="text-blue-500 font-medium">Venugopal.</span> All
              rights reserved.
            </p>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
