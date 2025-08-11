import React from "react";

const ProductVariants = ({
  product,
  color,
  setColor,
  weight,
  setWeight,
  capacity,
  setCapacity,
  size,
  setSize,
  itemCost,
  setItemCost,
  originalCost,
  setOriginalCost,
}) => {
  return (
    <>
      {/* weight section  */}
      {product?.variants?.some((item) => item?.weight?.trim() !== "") && (
        <>
          <div className="flex gap-1 mb-3 items-center">
            <span className="font-semibold text-nowrap">Weight : </span>
            <span className="text-lg font-semibold text-black">{weight}</span>
          </div>
          <div className="flex gap-3 flex-wrap mb-5">
            {product?.variants?.map((item) => (
              <div
                onClick={() => {
                  setWeight(item?.weight);
                  setItemCost(item?.sellingCost);
                  setOriginalCost(item?.originalCost);
                }}
                key={item._id}
                className={`border-2  py-1  px-4 rounded-full cursor-pointer font-semibold ${
                  item.weight === weight
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-green-700"
                }`}
              >
                {item.weight}
              </div>
            ))}
          </div>
        </>
      )}

      {/*size section  */}
      {product?.variants?.some((item) => item?.size?.trim() !== "") && (
        <>
          <div className="flex gap-1 mb-3 items-center">
            <span className="font-semibold text-nowrap"> Size : </span>
            <span className="text-lg font-semibold text-black capitalize">
              {size}
            </span>
          </div>

          <div className="flex gap-3 flex-wrap mb-5">
            {product?.variants?.map((item) => (
              <div
                onClick={() => {
                  setSize(item?.size);
                  setItemCost(item?.sellingCost);
                  setOriginalCost(item?.originalCost);
                }}
                key={item._id}
                className={`border-2 flex items-center justify-center capitalize min-h-10 min-w-10 px-2 rounded-full cursor-pointer font-semibold ${
                  item.size === size
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-green-700"
                }`}
              >
                {item.size}
              </div>
            ))}
          </div>
        </>
      )}

      {/* capacity section  */}
      {product?.variants?.some((item) => item?.capacity?.trim() !== "") && (
        <>
          <div className="flex gap-1 mb-3 items-center">
            <span className="font-semibold text-nowrap"> capacity : </span>
            <span className="text-lg font-semibold text-black capitalize">
              {capacity}
            </span>
          </div>

          <div className="flex gap-3 flex-wrap mb-5">
            {product?.variants?.map((item) => (
              <div
                onClick={() => {
                  setCapacity(item?.capacity);
                  setItemCost(item?.sellingCost);
                  setOriginalCost(item?.originalCost);
                }}
                key={item._id}
                className={`border-2 flex items-center justify-center capitalize min-h-10 min-w-10 px-2 rounded-full cursor-pointer font-semibold ${
                  item.capacity === capacity
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-green-700"
                }`}
              >
                {item.capacity}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ProductVariants;
