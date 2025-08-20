import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../App";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { carousel } = useContext(CartContext);
  const [offerTitle, setOfferTitle] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(carousel?.carouselImage);
    setOfferTitle(carousel?.offerTitle);
  }, [carousel]);

  const totalItems = images?.length;

  const nextSlide = () => {
    if (totalItems > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    }
  };

  // Autoplay functionality
  useEffect(() => {
    if (totalItems > 0) {
      const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [totalItems]);

  return (
    <>
      <div className="relative w-full overflow-hidden mt-[4.7rem]">
        {/* Carousel items */}
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images?.map((src, index) => (
            <div className="min-w-full min-h-full" key={index}>
              <div className=" flex items-center justify-center">
                <img
                  placeholderSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                  src={src.image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-contain lg:max-w-screen-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Scrolling Offer Title */}
      {offerTitle && (
        <div className="w-full bg-gray-800 text-white py-2 overflow-hidden">
          <div className="animate-scroll text-lg font-semibold whitespace-nowrap">
            <span className="px-4">{offerTitle}</span>
            {/* Duplicate the text for seamless scrolling */}
            <span className="px-4">{offerTitle}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Carousel;
