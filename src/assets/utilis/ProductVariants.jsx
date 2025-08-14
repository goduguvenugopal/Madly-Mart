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
  stock,
  setStock,
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
            <span className="text-lg font-semibold text-blue-600 capitalize">
              {color}
            </span>
          </div>
          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card   scrollbar-hide-card scrollbar-hide-card overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.color)
              .map((item) => (
                <div key={item._id} className="text-center">
                  <div
                    onClick={() => {
                      setColor(item?.color);
                      setStock(item?.stock)
                      setItemCost(item?.sellingCost || itemCost);
                      setOriginalCost(item?.originalCost || originalCost);
                    }}
                    className={`border   border-black capitalize    py-1  px-4 rounded-full cursor-pointer font-semibold ${
                      item.stock <= 0
                        ? "cursor-not-allowed text-white border-none bg-gray-400"
                        : ""
                    } ${
                      item.color === color ? "bg-blue-600  border-none  text-white" : ""
                    } `}
                  >
                    <span className="text-nowrap ">{item.color}</span>
                  </div>
                  {item.stock < 6 && (
                    <button className="mt-2 bg-red-400 rounded text-[14px] text-white px-[3px] w-fit border ">
                      Left {item.stock}
                    </button>
                  )}
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
            <span className="text-lg font-semibold text-blue-600">
              {weight}
            </span>
          </div>
          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card  overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.weight)
              .map((item) => (
                <div key={item._id} className="text-center">
                  <div
                    onClick={() => {
                      setWeight(item?.weight);
                      setStock(item?.stock)
                      setItemCost(item?.sellingCost || itemCost);
                      setOriginalCost(item?.originalCost || originalCost);
                    }}
                    key={item._id}
                    className={`border  border-black  py-1  px-4 rounded-full cursor-pointer font-semibold ${
                      item.stock <= 0
                        ? "cursor-not-allowed text-white border-none bg-gray-400"
                        : ""
                    } ${
                      item.weight === weight ? "bg-blue-600    border-none text-white " : " "
                    }    `}
                  >
                    <span className="text-nowrap ">{item.weight}</span>
                  </div>

                  {item.stock < 6 && (
                    <button className="mt-2 bg-red-400 rounded text-[14px] text-white px-[3px] w-fit border ">
                      Left {item.stock}
                    </button>
                  )}
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
            <span className="text-lg font-semibold text-blue-600 capitalize">
              {size}
            </span>
          </div>

          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card   overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.size)
              .map((item) => (
                <div key={item._id} className="text-center">
                  <div
                    onClick={() => {
                      setSize(item?.size);
                      setItemCost(item?.sellingCost || itemCost);
                      setStock(item?.stock)
                      setOriginalCost(item?.originalCost || originalCost);
                    }}
                    key={item._id}
                    className={`borderborder-black flex items-center justify-center capitalize min-h-10 min-w-10 px-2 rounded-full cursor-pointer font-semibold ${
                      item.stock <= 0
                        ? "cursor-not-allowed text-white border-none bg-gray-400"
                        : ""
                    } ${item.size === size ? "bg-blue-600    border-none text-white " : " "}`}
                  >
                    <span className="text-nowrap ">{item.size}</span>
                  </div>

                  {item.stock < 6 && (
                    <button className="mt-2 bg-red-400 rounded text-[14px] text-white px-[3px] w-fit border ">
                      Left {item.stock}
                    </button>
                  )}
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
            <span className="text-lg font-semibold text-blue-600 capitalize">
              {capacity}
            </span>
          </div>

          <div className="flex gap-3 flex-nowrap   scrollbar-hide-card   overflow-x-auto mb-5">
            {product?.variants
              ?.filter((variant) => variant.capacity)
              .map((item) => (
                <div key={item._id} className="text-center">
                  <div
                    onClick={() => {
                      setCapacity(item?.capacity);
                      setStock(item?.stock)
                      setItemCost(item?.sellingCost || itemCost);
                      setOriginalCost(item?.originalCost || originalCost);
                    }}
                    key={item._id}
                    className={`border  border-black flex items-center flex-row justify-center capitalize min-h-10 min-w-fit px-2 rounded-full cursor-pointer font-semibold ${
                      item.stock <= 0
                        ? "cursor-not-allowed text-white border-none bg-gray-400"
                        : ""
                    } ${
                      item.capacity == capacity
                        ? "bg-blue-600    border-none text-white "
                        : " "
                    }`}
                  >
                    <span className="text-nowrap ">{item.capacity}</span>
                  </div>

                  {item.stock < 6 && (
                    <button className="mt-2 bg-red-400 rounded text-[14px] text-white px-[3px] w-fit border ">
                      Left {item.stock}
                    </button>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default ProductVariants;
