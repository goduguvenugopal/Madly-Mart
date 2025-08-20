import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const RelatedProducts = ({ relatedProducts }) => {
  return (
    <>
      {relatedProducts.length > 1 && (
        <div className="mt-10 lg:px-9">
          <h5 className="text-2xl font-medium text-black">Related Products</h5>
          <hr className="border border-gray-200 mb-5 mt-3 lg:mt-3" />

          <div className="mt-4 grid grid-cols-2 gap-y-6 gap-x-5 md:gap-y-7 lg:gap-y-6  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((item) => (
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
                    placeholderSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                    className="min-h-[180px] w-full rounded-lg"
                  />
                </div>

                <div className="mt-2 text-center">
                  <h3 className="text-[0.9rem] capitalize lg:text-[1rem] font-bold text-black">
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
        </div>
      )}
    </>
  );
};

export default RelatedProducts;
