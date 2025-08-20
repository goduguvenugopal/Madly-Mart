import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ProductsContext } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { scrollToTop } from "./utilis/RouteHandler";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import InstallApp from "./components/InstallApp";
import RecentlyViewedProducts from "./components/RecentlyViewedProducts";

const AllProducts = () => {
  scrollToTop();
  const { category } = useParams();
  const { products } = useContext(ProductsContext);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryItems1, setCategoryItems1] = useState([]);
  const [pageNum, setPageNum] = useState(0);

  // changing title dynamically
  useEffect(() => {
    if (category) {
      document.title = `${category
        .replace("vegetables", "vegetable")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")} Products`;
    } else {
      document.title = "Welcome to Madly Mart";
    }
  }, [category]);

  let itemsLength = [];

  // rendering products according to the category
  useEffect(() => {
    const results = products.filter((item) =>
      item.itemCategory?.toLowerCase().includes(category.toLowerCase())
    );
    setCategoryItems1(results);
    setCategoryItems(results.reverse().slice(0, 10));
    setPageNum(1);
  }, [category, products]);

  // looping items for pagination to set dynamically pagination length
  for (
    let index = 1;
    index < Math.ceil(categoryItems1.length / 10) + 1;
    index++
  ) {
    itemsLength.push(index);
  }

  //  page increment function
  const pageIncrement = () => {
    setPageNum((prev) => prev + 1);
  };
  //  page decrement function
  const pageDecrement = () => {
    setPageNum((prev) => prev - 1);
  };

  useEffect(() => {
    setCategoryItems(categoryItems1.slice(pageNum * 10 - 10, pageNum * 10));
  }, [pageNum]);

  // pagination function
  const changePageFunction = (pageNumber) => {
    setPageNum(pageNumber);
  };

  return (
    <>
      <div className="p-3 mt-3 mb-5 pt-24 ">
        <h5 className="text-center text-2xl font-semibold capitalize">
          {category.replace("vegetables", "vegetable")} Products
        </h5>
        <hr className="my-2 border border-orange-500" />

        {categoryItems.length ? (
          <>
            <div className="mt-6  place-items-center w-full  pb-5 grid grid-cols-2 gap-y-6 gap-x-5 md:gap-y-7 lg:gap-y-6  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {categoryItems.map((item) => (
                <Link
                  to={`/product_over_view/${item._id}`}
                  key={item._id}
                  className="group w-[9rem] h-fit  md:w-52   lg:w-72  relative  hover:opacity-85"
                >
                  <div className="w-full">
                    <LazyLoadImage
                      src={item.itemImage[0]?.image}
                      alt={item.itemName}
                      effect="blur"
                      placeholderSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                      className="min-h-[9rem] w-full rounded-lg"
                    />
                  </div>

                  <div className="mt-2 text-center ">
                    <h3 className="text-[0.9rem] lg:text-[1rem] font-bold text-black capitalize">
                      {item?.itemName?.substring(0, 18)}..
                    </h3>
                    <span className="text-md text-gray-900">
                      Rs. {parseFloat(item?.itemCost || 0).toFixed(2)}
                    </span>
                  </div>
                  {item.itemStock === "0" && (
                    <div className="absolute top-2 h-7 flex items-center justify-center  text-sm left-2 rounded px-2 bg-black text-white">
                      <span>Sold out</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </>
        ) : (
           
            <section className="flex text-center flex-col font-medium justify-center items-center h-[45vh] ">
              <h2 className="text-xl font-semibold text-gray-700">
                No Products
              </h2>
              <p className="text-gray-500 mt-1">
                Please check back later or explore other categories.
              </p>
            </section>
        
        )}

        <hr className="my-4 border border-orange-500" />

        {/* pagination section  */}
        {categoryItems.length > 10 && (
          <div className="flex select-none justify-center items-center  w-full">
            <span
              onClick={pageDecrement}
              className={` text-white  hover:bg-orange-600 p-3 flex items-center justify-center rounded-full h-9 w-9 font-medium   cursor-pointer ${
                pageNum === 1
                  ? "pointer-events-none bg-gray-400"
                  : " bg-orange-500"
              }`}
            >
              <FaLessThan />
            </span>
            <div className="overflow-auto scrollbar-hide-card flex gap-2  px-3">
              {itemsLength.map((num, index) => (
                <span
                  key={index}
                  onClick={() => changePageFunction(num)}
                  className={`border-[0.09rem] hover:bg-blue-600 hover:text-white  hover:border-blue-600 p-3 flex items-center justify-center rounded-full h-9 w-9 font-medium  cursor-pointer ${
                    pageNum === num
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-500"
                  }`}
                >
                  {num}
                </span>
              ))}
            </div>
            <span
              onClick={pageIncrement}
              className={`  text-white    hover:bg-orange-600 p-3 flex items-center justify-center rounded-full h-9 w-9 font-medium   cursor-pointer ${
                pageNum === itemsLength.length
                  ? "pointer-events-none bg-gray-400"
                  : " bg-orange-500"
              }`}
            >
              <FaGreaterThan />
            </span>
          </div>
        )}
      </div>
      <RecentlyViewedProducts />
      <InstallApp />
    </>
  );
};

export default AllProducts;
