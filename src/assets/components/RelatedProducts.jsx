import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import Shimmer from "./Shimmer";

const RelatedProducts = ({ relatedProducts }) => {
    const [loaded, setLoaded] = useState(false);
  
  return (
    <>
      {relatedProducts.length > 1 && (
        <div className="mt-10">
          <h5 className="text-2xl font-medium text-black">Related Products</h5>
          <hr className="border border-gray-200 mb-5 mt-3 lg:mt-3" />

          <div className="w-full">
            <div className="mt-4 w-full overflow-x-auto scrollbar-hide-card">
              <div className="flex gap-5 md:gap-7 lg:gap-8">
                {relatedProducts.map((item) => (
                  <Link
                    to={`/product_over_view/${item._id}`}
                    key={item._id}
                    className="group shrink-0 w-[9rem] md:w-52 lg:w-72 h-fit relative hover:opacity-85"
                  >
                    <div className="relative w-full">
                      {/* Shimmer until loaded */}
                      {!loaded && (
                        <div className="absolute inset-0">
                          <Shimmer
                            height="h-[9rem]"
                            width="w-full"
                            rounded="lg"
                          />
                        </div>
                      )}
                      <LazyLoadImage
                        src={item.itemImage[0]?.image}
                        alt={item.itemName}
                        effect="opacity"
                        onLoad={() => setLoaded(true)}
                        className="min-h-[9rem] w-full rounded-lg"
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
                      <div className="absolute top-2 left-2 h-7 flex items-center justify-center px-2 rounded bg-black text-white text-sm">
                        <span>Sold out</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RelatedProducts;
