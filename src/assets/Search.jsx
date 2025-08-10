import React, { useContext, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ProductsContext } from "../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { scrollToTop } from "./utilis/RouteHandler";
import InstallApp from "./components/InstallApp";

const Search = () => {
  scrollToTop();
  const { products } = useContext(ProductsContext);
  const [searchProducts, setsearchProducts] = useState(products);
  const [text, setText] = useState("");
  const searchRef = useRef();
  const changeHandling = (e) => {
    setText(e.target.value);
  };

  // search function
  useEffect(() => {
    const searchresults = products.filter((item) =>
      item.productTags.some((tag) =>
        tag.toLowerCase().includes(text.toLowerCase())
      )
    );
    setsearchProducts(searchresults);
  }, [text, products]);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <>
      <div className="mt-20 px-3 pb-10">
        <div className="flex justify-center pt-9 mb-7">
          <div className="relative w-full sm:w-auto">
            <input
              ref={searchRef}
              value={text}
              onChange={changeHandling}
              placeholder="Search for products"
              type="text"
              name="text"
              id="text"
              className=' w-full h-[3rem] lg:w-96 border-2  py-1.5 pl-12 pr-20 text-gray-900 outline-none border-blue-700 placeholder:text-gray-800   sm:text-md sm:leading-6 placeholder="0.00'
            />
            <span className="left-4 top-[0.9rem] absolute text-blue-700">
              <FaSearch size={20} />
            </span>
          </div>
        </div>

        <h5 className="text-xl font-semibold mt-4">
          Search Results : {searchProducts.length}
        </h5>

        {searchProducts.length ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-5 md:gap-y-7 lg:gap-y-6  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {searchProducts.map((item) => (
                <Link
                  to={`/product_over_view/${item._id}`}
                  key={item._id}
                  className="group  w-full h-full  md:w-52   lg:w-72   relative  hover:opacity-85"
                >
                  <div>
                    <LazyLoadImage
                      src={item.itemImage[0]?.image}
                      alt={item.itemName}
                      effect="blur"
                      className="h-fit w-full rounded-lg"
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <h3 className="text-[0.9rem] capitalize lg:text-[1rem] font-bold text-black">
                      {item?.itemName?.substring(0, 25)}..
                    </h3>
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
          <div className="text-lg flex items-center justify-center font-medium h-[45vh]">
            No results found
          </div>
        )}
      </div>
      <InstallApp />
    </>
  );
};

export default Search;
