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
      {/* color section  */}
      {product?.variants?.some((item) => item?.color?.trim() !== "") && (
        <>
          <div className="flex gap-1 mb-3 items-center">
            <span className="font-semibold text-nowrap capitalize">
              color :{" "}
            </span>
            <span className="text-lg font-semibold text-black capitalize">
              {color}
            </span>
          </div>
          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card   scrollbar-hide-card scrollbar-hide-card overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.color)
              .map((item) => (
                <div
                  onClick={() => {
                    setColor(item?.color);
                    setItemCost(item?.sellingCost || itemCost);
                    setOriginalCost(item?.originalCost || originalCost);
                  }}
                  key={item._id}
                  className={`border-2 capitalize  py-1  px-4 rounded-full cursor-pointer font-semibold ${
                    item.color === color
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-green-700"
                  }`}
                >
                  <span className="text-nowrap ">{item.color}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {/* weight section  */}
      {product?.variants?.some((item) => item?.weight?.trim() !== "") && (
        <>
          <div className="flex gap-1 mb-3 items-center">
            <span className="font-semibold text-nowrap">Weight : </span>
            <span className="text-lg font-semibold text-black">{weight}</span>
          </div>
          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card  overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.weight)
              .map((item) => (
                <div
                  onClick={() => {
                    setWeight(item?.weight);
                    setItemCost(item?.sellingCost || itemCost);
                    setOriginalCost(item?.originalCost || originalCost);
                  }}
                  key={item._id}
                  className={`border-2  py-1  px-4 rounded-full cursor-pointer font-semibold ${
                    item.weight === weight
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-green-700"
                  }`}
                >
                  <span className="text-nowrap ">{item.weight}</span>
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

          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card   overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.size)
              .map((item) => (
                <div
                  onClick={() => {
                    setSize(item?.size);
                    setItemCost(item?.sellingCost || itemCost);
                    setOriginalCost(item?.originalCost || originalCost);
                  }}
                  key={item._id}
                  className={`border-2 flex items-center justify-center capitalize min-h-10 min-w-10 px-2 rounded-full cursor-pointer font-semibold ${
                    item.size === size
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-green-700"
                  }`}
                >
                  <span className="text-nowrap ">{item.size}</span>
                </div>
              ))}
          </div>
        </>
      )}

      {/* capacity section  */}
      {product?.variants?.some((item) => item?.capacity?.trim() !== "") && (
        <>
          <div className="flex gap-1 mb-3 items-center">
            <span className="font-semibold text-nowrap capitalize">
              {" "}
              capacity :{" "}
            </span>
            <span className="text-lg font-semibold text-black capitalize">
              {capacity}
            </span>
          </div>

          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card   overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.capacity)
              .map((item) => (
                <div
                  onClick={() => {
                    setCapacity(item?.capacity);
                    setItemCost(item?.sellingCost || itemCost);
                    setOriginalCost(item?.originalCost || originalCost);
                  }}
                  key={item._id}
                  className={`border-2 flex items-center flex-row justify-center capitalize min-h-10 min-w-fit px-2 rounded-full cursor-pointer font-semibold ${
                    item.capacity == capacity
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-green-700"
                  }`}
                >
                  <span className="text-nowrap ">{item.capacity}</span>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default ProductVariants;
