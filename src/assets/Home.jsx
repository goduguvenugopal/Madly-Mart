import React, { useContext, useState, useEffect } from "react";
import Carousel from "../assets/Carousel";
import Footer from "./components/Footer";
import { CartContext, ProductsContext } from "../App";
import { Link } from "react-router-dom";
import { FaDownload, FaShareSquare } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Faq from "./components/Faq";
import { MdClose } from "react-icons/md";
import InstallApp from "./components/InstallApp";
import RecentlyViewedProducts from "./components/RecentlyViewedProducts";
import OffersPopUp from "./utilis/OffersPopUp";
import Shimmer from "./components/Shimmer";

const Home = () => {
  const { categories } = useContext(ProductsContext);
  const { carousel } = useContext(CartContext);
  const [images, setImages] = useState([]);
  const [lastImg, setLastImg] = useState(images?.length);
  const [toggle, setToggle] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImages(carousel?.carouselImage?.reverse());
  }, [carousel]);

  useEffect(() => {
    const toggleValue = sessionStorage.getItem("offerpopup");
    const parsedValue = JSON.parse(toggleValue);
    if (parsedValue === false) {
      setToggle(false);
    } else {
      sessionStorage.setItem("offerpopup", JSON.stringify(true));
      setToggle(true);
    }
  }, []);

  const removePopUp = () => {
    sessionStorage.setItem("offerpopup", JSON.stringify(false));
    setToggle(false);
  };

  return (
    <>
      {/* offers pop up component  */}
      <OffersPopUp />
      {/* categories section  */}
      <Carousel />
      <div className="p-3 mt-5 pb-5 w-full">
        <h5 className="text-center text-2xl font-semibold">All Categories</h5>
        <hr className="my-2 border border-orange-500" />
        <div className="mt-4  place-items-center py-6 grid grid-cols-3 gap-y-5 gap-x-5 md:gap-y-7 lg:gap-y-9 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
          {categories?.length > 0 ? (
            <>
              {categories?.map((item) => (
                <Link
                  to={
                    item.available === "no"
                      ? "/"
                      : `/products_by_category/${item.productCategoryName}`
                  }
                  key={item._id}
                  className="group flex flex-col  w-[6.1rem]   h-fit  md:w-52   lg:w-[14rem]   transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 "
                >
                  <div className="relative w-full h-full  md:w-full   lg:w-full ">
                    {/* Shimmer until loaded */}
                    {!loaded && (
                      <div className="absolute inset-0">
                        <Shimmer height="h-[5rem]" width="w-full" rounded="lg" />
                      </div>
                    )}
                    <LazyLoadImage
                      src={item?.productImage?.image}
                      alt={item?.productCategoryName}
                      className="min-h-20 w-full rounded-lg object-cover"
                      effect="opacity"
                      onLoad={() => setLoaded(true)}
                    />

                    {item.available === "no" && (
                      <div className="absolute flex items-center justify-center text-center top-0 left-0 w-full h-full bg-black bg-opacity-0  text-white ">
                        <span className="bg-black text-white bg-opacity-55 text-[0.8rem] rounded p-1 md:text-lg lg:text-2xl">
                          Available Soon
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-center ">
                    <h3 className="text-base  md:text-lg capitalize font-medium text-gray-800">
                      {item?.productCategoryName}
                    </h3>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <div className="text-lg font-medium text-center w-screen">
              <h2 className="text-xl font-semibold text-gray-700">
                No Products
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* recently viewed products component  */}
      <RecentlyViewedProducts />
      {/* download share app section  */}
      <InstallApp />
      <Faq />
      <Footer />
    </>
  );
};

export default Home;
