import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import { GoUpload } from "react-icons/go";
import { LuStar } from "react-icons/lu";
import { dataContext } from "../App";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Reviews from "./Reviews";

const ProdutReviewsForm = ({ itemId }) => {
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewToggle, setReviewToggle] = useState(false);
  const { user, reviews_api } = useContext(dataContext);
  const [productReviewImg, setProductReviewImg] = useState(null);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const handleRating = (value) => {
    setRating(value);
  };

  // image file handling
  const fileHandling = (e) => {
    const file = e.target.files[0];
    setProductReviewImg(file);
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  // submitting review
  const sendReview = async (e) => {
    e.preventDefault();

    // review form data converting to object
    const formData = new FormData();
    formData.append("productId", itemId);
    formData.append("userId", user?._id);
    formData.append("userName", user?.fullName);
    formData.append("rating", rating?.toString());
    formData.append("reviewText", reviewText);
    formData.append("productReviewImg", productReviewImg);

    try {
      if (!rating) {
        return toast.warning("Please give rating");
      }
      setLoader(true);
      const res = await axios.post(`${reviews_api}/api/add/reviews`, formData);
      if (res) {
        toast.success("Thank you for sharing your valuable review!", {
          className: "custom-toast",
        });
        setReviewToggle(false);
        setReviewText("");
        setRating(0);
        setImage(null);
        setProductReviewImg(null);
        
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again", {
        className: "custom-toast",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        transition={Slide}
        draggable
        theme="dark"
      />
      <div className="p-3 mt-8  lg:px-9 text-center">
        <h5 className="text-2xl font-medium text-black text-center">
          Customer Reviews
        </h5>
        <hr className="my-3 border-yellow-400 border" />
        {/* review toggle button section */}
        <div className="text-center flex items-center justify-center pt-2 pb-5">
          {reviewToggle ? (
            <button
              onClick={() => {
                setReviewText("");
                setRating(0);
                setLoader(false);
                setImage(null);
                setProductReviewImg(null);
                setReviewToggle(false);
              }}
              className="flex  justify-center  w-full md:w-40 lg:w-52  bg-yellow-500 px-3 py-1.5 text-[1rem] font-bold text-white shadow-xs hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cancel a Review
            </button>
          ) : (
            <button
              onClick={() => {
                if (user) {
                  setReviewToggle(true);
                } else {
                  navigate("/login");
                }
              }}
              className="flex  justify-center w-full md:w-40 lg:w-52  bg-yellow-500 px-3 py-1.5 text-[1rem] font-bold text-white shadow-xs hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* review form section  */}

        {reviewToggle && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex min-h-full  flex-1 flex-col justify-center "
          >
            <div className="flex justify-center w-full">
              <form
                onSubmit={sendReview}
                className="space-y-6 w-full lg:w-1/2 flex flex-col  gap-6 justify-center "
              >
                {/* rating section  */}
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-[1.3rem] font-medium text-center text-gray-900"
                  >
                    Rating
                  </label>
                  <div className="mt-6 flex items-center justify-center gap-5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <span
                        key={value}
                        onClick={() => handleRating(value)}
                        className="text-yellow-400 "
                      >
                        {value <= rating ? (
                          <FaStar size={26} />
                        ) : (
                          <LuStar size={26} />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                {/* review writing section  */}
                <div>
                  <label
                    htmlFor="reviewText"
                    className="block text-[1.3rem] font-medium text-center text-gray-900"
                  >
                    Review
                  </label>
                  <div className="mt-6">
                    <textarea
                      id="reviewText"
                      autoComplete="true"
                      autoFocus="true"
                      name="reviewText"
                      type="text"
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your comment here"
                      rows={5}
                      className="block w-full border-2 border-yellow-500 rounded-md bg-white px-3 py-1.5 text-base text-gray-900  placeholder:text-gray-400 placeholder:text-[1.1rem]   focus:outline-indigo-600  lg:text-[1.1rem]"
                    ></textarea>
                  </div>
                </div>

                {/* image upload section  */}
                <div className="flex justify-center mb-10 flex-col items-center gap-5">
                  <h5 className="block text-[1.3rem] font-medium text-center text-gray-900">
                    Product Image (Optional)
                  </h5>
                  <span className="text-gray-500 mt-2 text-[4rem] lg:text-[5rem]">
                    <GoUpload />
                  </span>

                  <label
                    className="cursor-pointer w-40 rounded-full lg:w-52 bg-green-600 hover:bg-green-500 px-3 py-1.5 text-[1rem] font-semibold text-white shadow-xs  "
                    htmlFor="productReviewImg"
                  >
                    Choose image
                  </label>

                  <input
                    type="file"
                    onChange={fileHandling}
                    className="hidden"
                    name="productReviewImg"
                    id="productReviewImg"
                  />
                  {image && (
                    <div className="relative ">
                      <img
                        src={image}
                        className="w-52 h-52"
                        alt="product-review-image"
                      />
                      <span
                        onClick={() => {
                          setImage(null);
                          setProductReviewImg(null);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black text-white cursor-pointer hover:text-red-500"
                      >
                        <MdDelete size={20} />
                      </span>
                    </div>
                  )}
                </div>

                {/* submit review buttons  */}
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => {
                      setReviewText("");
                      setLoader(false);
                      setRating(0);
                      setImage(null);
                      setProductReviewImg(null);
                      setReviewToggle(false);
                    }}
                    type="button"
                    className="flex w-full border-2 border-orange-600 justify-center rounded-md  px-3 py-1.5 text-[1rem] font-semibold  shadow-xs hover:bg-orange-600 hover:text-white"
                  >
                    Cancel Review
                  </button>
                  {loader ? (
                    <button className="flex w-full items-center gap-3 border-2 justify-center rounded-md bg-blue-500 border-blue-500 px-3 py-1.5 text-[1rem] font-semibold text-white shadow-xs hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      <div className="animate-spin rounded-full h-7 w-7 border-4 border-t-blue-500  border-t-4 border-r-4 border-white border-solid"></div>{" "}
                      Submitting...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex w-full border-2 justify-center rounded-md bg-blue-500 border-blue-500 px-3 py-1.5 text-[1rem] font-semibold text-white shadow-xs hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Submit Review
                    </button>
                  )}
                </div>
              </form>
            </div>
            <hr className="mt-5 border-yellow-400 border" />
          </motion.div>
        )}
      </div>

      <Reviews itemId={itemId} />
    </>
  );
};

export default ProdutReviewsForm;
