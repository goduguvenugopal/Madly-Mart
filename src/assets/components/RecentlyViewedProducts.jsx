import React, { useContext, useState } from "react";
import { ProductsContext } from "../../App";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Shimmer from "./Shimmer";

const RecentlyViewedProducts = () => {
  const { viewedProducts } = useContext(ProductsContext);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {viewedProducts?.length > 0 && (
        <div className="p-3">
          <h5 className=" text-2xl font-semibold capitalize">
            Recently Viewed
          </h5>

          <div className="mt-5 w-full   place-items-center grid grid-cols-2 gap-y-6 gap-x-5 md:gap-y-7 lg:gap-y-6  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {viewedProducts?.map((item) => (
              <Link
                to={`/product_over_view/${item?._id}`}
                key={item?._id}
                className="group  w-[9rem] h-fit  md:w-52   lg:w-72  relative  hover:opacity-85"
              >
                <div className="relative w-full">
                  {/* Shimmer until loaded */}
                  {!loaded && (
                    <div className="absolute inset-0">
                      <Shimmer height="h-[9rem]" width="w-full" rounded="lg" />
                    </div>
                  )}
                  <LazyLoadImage
                    src={item?.itemImage[0]?.image}
                    alt={item?.itemName}
                    effect="opacity"
                    onLoad={() => setLoaded(true)}
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
                {item?.itemStock === "0" && (
                  <div className="absolute top-2 h-7 flex items-center justify-center  text-sm left-2 rounded px-2 bg-black text-white">
                    <span>Sold out</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RecentlyViewedProducts;
