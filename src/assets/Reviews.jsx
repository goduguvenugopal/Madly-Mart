import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { dataContext } from "../App";
import { div } from "framer-motion/client";
import { CustomLoading } from "./Loading";
import { GoPerson } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { LuStar } from "react-icons/lu";


const Reviews = ({ itemId }) => {
  const [reviews, setReviews] = useState([]);
  const { reviews_api } = useContext(dataContext);
  const [spinner, setSpinner] = useState(false);

  // fetching product reviews
  async function getProducts() {
    try {
      setSpinner(true);
      const res = await axios.get(`${reviews_api}/api/get/reviews/${itemId}`);
      if (res) {
        setReviews(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSpinner(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, [itemId]);

  return (
    <>
      <div className="p-3 mb-5 lg:px-9">
        {spinner ? (
          <CustomLoading customHeight={"h-1/2"} />
        ) : (
          <div className="">
            {reviews.map((item) => (
              <div
                className="border-b-[0.09rem] border-yellow-400 mb-3 py-3"
                key={item._id}
              >
                <div className="flex items-center gap-2">
                  {[
                    ...Array(5)].map((_, index) => (
                      <span key={index}  className="text-yellow-400 ">
                        {index < item.rating ? (
                          <FaStar size={20} />
                        ) : (
                          <LuStar size={20} />
                        )}
                      </span>
                    ))
                  }
                </div>
                <div className="flex mt-3 items-center justify-between ">
                  <div className="flex items-center gap-3 text-yellow-500 ">
                    <span className="bg-gray-200">
                      <GoPerson size={22} />
                    </span>
                    <h5 className="text-[1rem] capitalize font-bold">
                      {item.userName}
                    </h5>
                  </div>
                  <h5 className="text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString("en-GB")}
                  </h5>
                </div>
                <p className="text-base md:text-[1.1rem] text-gray-700 mb-5 mt-3 font-semibold">
                  {item.reviewText}
                </p>
                {item?.productReviewImg?.image && (
                  <img
                    className="w-[8rem] h-[8rem] md:w-[10rem] md:h-[10rem] lg:w-[11.5rem] lg:h-[11.5rem]"
                    src={item.productReviewImg.image}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
