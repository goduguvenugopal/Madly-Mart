import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { dataContext } from "../App";


const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { carousel } = useContext(dataContext);
  const [offerTitle, setOfferTitle] = useState("");
  const [images, setImages] = useState([]);


  useEffect(() => {
    setImages(carousel?.carouselImage)
    setOfferTitle(carousel?.offerTitle)
  }, [carousel])


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
            <div className="min-w-full" key={index}>
              <div className=" flex items-center justify-center">
                <img
                  src={src.image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-contain lg:max-w-screen-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Optional Indicator dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images?.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 cursor-pointer rounded-full ${index === currentIndex ? "bg-white opacity-75" : "bg-gray-500 opacity-50"
                }`}
              onClick={() => setCurrentIndex(index)}
            />
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
