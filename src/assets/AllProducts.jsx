import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { dataContext } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { scrollToTop } from "./RouteHandler";
import { FaGreaterThan, FaLessThan } from "react-icons/fa";
import InstallApp from "./components/InstallApp";
import RecentlyViewedProducts from "./RecentlyViewedProducts";

const AllProducts = () => {
  scrollToTop();
  const { category } = useParams();
  const { products } = useContext(dataContext);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categoryItems1, setCategoryItems1] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const title = useRef(document.title);

  // changing title dynamically
  useEffect(() => {
    if (category) {
      document.title = `${category
        .replace("vegetables", "vegetable")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")} Products`;
    } else {
      document.title = "Welcome to Dora A to Z Fresh";
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

  // filter function
  const filterFunc = (e) => {
    const inputText = e.target.value;
    if (inputText === "veg") {
      const results = products.filter((item) => item.itemCategory === category);
      setCategoryItems(results);
    } else if (inputText === "non-veg") {
      const results = products.filter(
        (item) => item.itemCategory === inputText
      );
      setCategoryItems(results);
    } else if (inputText === "all") {
      const results1 = products.filter((item) => item.itemCategory === "food");
      const results2 = products.filter(
        (item) => item.itemCategory === "non-veg"
      );
      const concatArray = results1.concat(results2);
      setCategoryItems(concatArray);
    }
  };

  return (
    <>
      <div className="p-3 mt-3 mb-5 pt-24">
        <h5 className="text-center text-2xl font-semibold capitalize">
          {category.replace("vegetables", "vegetable")} Products
        </h5>
        <hr className="my-2 border border-orange-500" />

        {/* filters  */}
        {category === "food" && (
          <div className="flex justify-end mt-6">
            <select
              name="options"
              onChange={filterFunc}
              id="options"
              className="border-2 outline-none border-blue-500 rounded p-1"
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400 ">
                Filters
              </option>
              <option value="all">All</option>
              <option value="non-veg">Non-Veg</option>
              <option value="veg">Veg</option>
            </select>
          </div>
        )}

        <div className="mt-6 w-full pb-5 grid grid-cols-2 gap-y-6 gap-x-5 md:gap-y-7 lg:gap-y-6  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {categoryItems.length ? (
            <>
              {categoryItems.map((item) => (
                <Link
                  to={`/product_over_view/${item._id}`}
                  key={item._id}
                  className="group  w-full h-full  md:w-52   lg:w-72  relative  hover:opacity-85"
                >
                  <div>
                    <LazyLoadImage
                      src={item.itemImage[0]?.image}
                      alt={item.itemName}
                      effect="blur"
                      className="h-fit w-full rounded-lg"
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
            </>
          ) : (
            <div className="text-lg font-medium flex justify-center items-center h-[70vh] w-[95vw]">
              No Products
            </div>
          )}
        </div>

        <hr className="my-4 border border-orange-500" />

        {/* pagination section  */}
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
      </div>
      <RecentlyViewedProducts />
      <InstallApp />
    </>
  );
};

export default AllProducts;
