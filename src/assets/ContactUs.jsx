import React, { useContext, useEffect, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { FaLocationDot, } from "react-icons/fa6";
import Footer from "./Footer";
import { dataContext } from "../App";
import { scrollToTop } from "./RouteHandler";
import Faq from "./Faq";


const ContactUs = () => {
  scrollToTop()
  const { api ,number} = useContext(dataContext)
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitSpin, setSubmitSpin] = useState(false);

 

  const formData = {
    email: "dora.a.to.z.fresh@gmail.com",
    subject: "Dora A to Z Fresh Customer product query",
    html: `<h3>Customer Name : ${name}</h3>
    <h3>Customer email : ${email}</h3>
    <h3>Customer message : ${message}</h3>`,
  };
  // sending mail function
  const submitFunc = async () => {
    if (!name || !email || !message) {
      toast.error("Please Enter the Name, Email and Message", {
        className: "custom-toast",
      })
    } else {
      setSubmitSpin(true);
      try {
        const res = await axios.post(`${api}/updates-email/send-updates`, formData);
        if (res) {
          toast.success(
            "Thank you for reaching out. Our customer service team will be in touch with you shortly."
            , {
              className: "custom-toast",
            });
          setSubmitSpin(false);
          setName("");
          setEmail("");
          setMessage("");
        }
      } catch (error) {
        console.log(error);
        toast.error("Please try again", {
          className: "custom-toast",
        });
        setSubmitSpin(false);
      }
    }
  };


  return (
    <>
      <ToastContainer position="top-center" draggable transition={Slide} theme="dark" />

      <section className="text-gray-600 body-font relative flex justify-center pb-10 px-5 pt-24">
        <div className="container flex flex-wrap justify-between ">

          <div className="bg-white p-8 w-full lg:w-[30%] mx-auto rounded shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>

            <div className="space-y-4">

              <a href="mailto:dora.a.to.z.fresh@gmail.com" className="flex items-center active:bg-blue-300 gap-3">
                <MdMail className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-lg font-medium">Email Us</p>
                  <p className="text-sm text-gray-600">dora.a.to.z.fresh@gmail.com</p>
                </div>
              </a>


              <a href={`tel:+91${number}`} className="flex items-center active:bg-blue-300 gap-3">
                <FaPhoneAlt className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-lg font-medium">Phone Number</p>
                  <p className="text-sm text-gray-600">{number}</p>
                </div>
              </a>
              <a href={`https://wa.me/91${number}`} className="flex items-center active:bg-blue-300 gap-3">
                <FaWhatsapp className="h-6 w-6 font-bold text-green-500" />
                <div>
                  <p className="text-lg font-medium">WhatsApp Number</p>
                  <p className="text-sm text-gray-600">{number}</p>
                </div>
              </a>
              <a href="https://maps.app.goo.gl/YmA4dbsdDkvRfr6t5" className="flex active:bg-blue-300 items-center gap-3">
                <FaLocationDot className="h-6 w-6 text-blue-500" />
                <div className="w-full">
                  <p className="text-lg font-medium">Address</p>
                  <p className="text-sm text-gray-600">
                    Noori majid opposite Pathabazar, Gopalpet road Wanaparthy 509103</p>
                </div>
              </a>
            </div>
          </div>


          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-col text-center mt-8 w-full mb-12">

              <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                For any Product Delivery & Queries, feel free to reach out to us
                here. We’re here to help!
              </p>
            </div>
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Name
                  </label>
                  <input
                    placeholder="Enter your full name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border-2 border-2-gray-300 focus:border-2-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Email
                  </label>
                  <input
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border-2 border-2-gray-300 focus:border-2-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Message
                  </label>
                  <textarea
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    value={message}
                    id="message"
                    name="message"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border-2 border-2-gray-300 focus:border-2-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    placeholder="Enter your query"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                {submitSpin ? (
                  <button className="flex mx-auto text-white bg-indigo-500 border-2-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    Submitting...
                  </button>
                ) : (
                  <button
                    onClick={submitFunc}
                    className="flex mx-auto text-white bg-indigo-500 border-2-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      <hr className="my-3" />

      <Faq />

      <Footer />
    </>
  );
};

export default ContactUs;
