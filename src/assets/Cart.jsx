import React, { useContext, useEffect, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";
import { dataContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FlipkartSpin } from "./Loading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Lottie from "lottie-react";
import cart from "./animations/cart.json";

const Cart = () => {
  const {
    cartItems,
    setCartItems,
    api,
    token,
    defaultAddress,
    orderProducts,
    setOrderProducts,
  } = useContext(dataContext);
  const [cartSpin, setCartSpin] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const [qtySpin, setQtySpin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // total amount caluculating function
    const totalAmount = cartItems.reduce((acc, item) => {
      const total = parseFloat(item.totalAmount || 0);
      const qty = item.itemQty;
      return acc + total * qty;
    }, 0);

    setTotalAmount(totalAmount.toFixed(2));
  }, [cartItems]);

  // remove cart items function
  const removeCartItem = async (cartItemId, itemName) => {
    try {
      setCartSpin(true);
      const res = await axios.delete(
        `${api}/cart/delete-user-cart-product/${cartItemId}`
      );
      if (res) {
        const remain = cartItems.filter((item) => item._id !== cartItemId);
        setCartItems(remain);
        toast.success(`${itemName.substring(0, 20)} item removed from cart`, {
          className: "custom-toast",
        });
        setCartSpin(false);
      }
    } catch (error) {
      console.error(error);
      setCartSpin(false);
      toast.success("Please try again", {
        className: "custom-toast",
      });
    }
  };

  // qty select and update function
  const selectHandle = async (
    itemId,
    e,
    itemWeight,
    minOrderQty,
    orderType
  ) => {
    const selectedQty = e.target.value;
    if (
      selectedQty < parseInt(minOrderQty) &&
      orderType === "buyonce" &&
      itemWeight === "250"
    ) {
      toast.warning(`Minimum order qty is ${minOrderQty}`, {
        className: "custom-toast",
      });
    } else {
      try {
        setQtySpin(true);
        await axios.put(`${api}/cart/update-cart/${itemId}`, {
          itemQty: selectedQty,
        });
        const response = await axios.get(`${api}/cart/get-user-cart-products`, {
          headers: { token: token },
        });
        if (response.data?.retrievdProducts) {
          setCartItems(response.data.retrievdProducts.reverse());
        }
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setQtySpin(false);
      }
    }
  };

  // order check out function
  const orderCheckOutFunc = (orderItem) => {
    if (defaultAddress.length <= 0) {
      // toast.warning(`Please Add address`, { className: "custom-toast" })
      navigate("/profile");
    } else if (defaultAddress.length > 0) {
      if (orderItem.length > 0) {
        setOrderProducts(orderItem);
        navigate("/order_check_out");
      } else {
        setOrderProducts([orderItem]);
        navigate("/order_check_out");
      }
    }
  };

  // if token not navigate to home
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        draggable
        transition={Slide}
        theme="dark"
      />

      <section className="text-gray-600 body-font overflow-hidden p-3">
        {cartItems?.length ? (
          <>
            <div className="container py-24 mx-auto ">
              <div className="-my-7 divide-y-2 divide-gray-100">
                {/* add address section  */}
                {defaultAddress.length > 0 ? (
                  <div className="py-6 flex items-center justify-between w-full lg:w-[60%] capitalize">
                    <div className="w-[60%]">
                      <h5 className="text-sm font-medium text-black">
                        Delivery to :{" "}
                        <span className="text-gray-600">
                          {defaultAddress[0]?.name},{" "}
                          {defaultAddress[0]?.postalCode},{" "}
                          {defaultAddress[0]?.village},{" "}
                          {defaultAddress[0]?.district},{" "}
                          {defaultAddress[0]?.street.substring(0, 35)}...
                        </span>
                      </h5>
                    </div>

                    {defaultAddress.length > 0 ? (
                      <Link
                        to="/profile"
                        className="font-semibold text-sm  p-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-[6rem] text-center text-white"
                      >
                        Change
                      </Link>
                    ) : (
                      <Link
                        to="/profile"
                        className="font-semibold text-sm  p-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-28 text-center text-white"
                      >
                        Add Address
                      </Link>
                    )}
                  </div>
                ) : (
                  ""
                )}

                {cartItems?.map((item) => (
                  <div
                    key={item._id}
                    className="py-8 flex gap-x-[1.1rem] lg:gap-x-6 flex-nowrap"
                  >
                    {/* image section  */}
                    <div className="flex flex-col gap-1 w-[30%] h-fit lg:h-auto  lg:w-[12rem] ">
                      <Link to={`/product_over_view/${item.productId}`}>
                        <LazyLoadImage
                          effect="blur"
                          src={item?.products[0].itemImage[0]}
                          alt={item.itemName}
                          className="w-full h-full
                    rounded-lg"
                        />
                      </Link>
                      <div className="flex justify-center gap-[0.4rem]">
                        <h6 className="text-sm font-semibold capitalize ">
                          qty
                        </h6>
                        <div className="relative">
                          {qtySpin && <FlipkartSpin />}
                          <select
                            onChange={(e) =>
                              selectHandle(
                                item._id,
                                e,
                                item.products[0].itemWeight,
                                item.products[0].minOrderQty,
                                item.products[0].orderType
                              )
                            }
                            name="itemQty"
                            id="itemQty"
                            className=" p-[0.6rem]  rounded border-2 border-gray-500 w-12 h-6 "
                          >
                            <option
                              className="font-semibold text-[0.9rem]"
                              disabled
                              value=""
                            >
                              Select Quantity
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="1"
                            >
                              1
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="2"
                            >
                              2
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="3"
                            >
                              3
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="4"
                            >
                              4
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="5"
                            >
                              5
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="6"
                            >
                              6
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="7"
                            >
                              7
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="8"
                            >
                              8
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="9"
                            >
                              9
                            </option>
                            <option
                              className="font-semibold text-[0.9rem]"
                              value="10"
                            >
                              10
                            </option>
                          </select>
                          <span className="absolute top-0 right-6">
                            {item.itemQty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* details section */}
                    <div className="flex flex-col items-start w-[60%]  lg:w-[17rem]  capitalize">
                      <Link
                        to={`/product_over_view/${item.productId}`}
                        className="flex gap-1 mb-1 justify-start  items-start "
                      >
                        <span className="text-sm lg:text-xl text-black lg:text-gray-600 font-semibold">
                          {item.products[0].itemName.substring(0, 25)}...
                        </span>
                      </Link>
                      <h6 className="text-lg lg:text-2xl  text-gray-700 font-medium">
                        Rs.{" "}
                        {parseFloat(
                          item.totalAmount * item.itemQty || 0
                        ).toFixed(2)}
                      </h6>
                      <h6 className="text-sm mb-1 text-gray-700 font-medium capitalize">
                        {item.orderType === "buyonce" ? null : item.orderType}
                      </h6>
                      <div className="mb-3">
                        {item.products[0].itemWeight && (
                          <div className="flex items-center justify-center">
                            <h5 className="font-semibold text-[0.9rem]">
                              {item.products[0].itemWeight}
                              {item.products[0].itemSubCategory === "Milk"
                                ? "ml"
                                : "g"}
                            </h5>
                          </div>
                        )}
                      </div>

                      {/* buy button and remove btn section  */}
                      <div className="flex items-center gap-2  flex-wrap w-full">
                        {cartSpin ? (
                          <>
                            <FlipkartSpin />
                            <button className="font-semibold text-sm  p-1 bg-red-500 hover:bg-red-700 rounded-full  hover:text-white border-none w-24 text-center text-white ">
                              Remove
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              removeCartItem(
                                item._id,
                                item.products[0].itemName
                              )
                            }
                            className="font-semibold text-sm  p-1 bg-red-500 hover:bg-red-700 rounded-full  hover:text-white border-none w-24 text-center text-white "
                          >
                            Remove
                          </button>
                        )}
                        <button
                          onClick={() => orderCheckOutFunc(item)}
                          className="font-semibold text-sm  p-1 bg-yellow-400 hover:bg-yellow-500 rounded-full   border-none w-24 text-center text-black "
                        >
                          Buy now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* place order side card  */}
              <div className="pt-10 lg:pt-0 lg:fixed  lg:top-0 lg:right-0 bg-white ">
                <div className="lg:w-[24rem] lg:h-[100vh] lg:mx-auto bg-white lg:shadow-md  lg:p-6 lg:border lg:pt-24">
                  <h2 className="text-gray-700 font-bold text-lg mb-4">
                    PRICE DETAILS
                  </h2>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-900">
                      Price ({cartItems?.length} items)
                    </span>
                    <span className="font-semibold text-gray-700">
                      Rs. {totalAmount}
                    </span>
                  </div>

                  <div className="flex justify-between py-4 border-t mt-4">
                    <span className="font-semibold text-lg text-gray-700">
                      Total Amount
                    </span>
                    <span className="font-bold text-lg text-gray-700">
                      Rs. {totalAmount}
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => orderCheckOutFunc(cartItems)}
                      className="w-full bg-orange-500 text-white h-[3rem] rounded text-lg font-semibold hover:bg-orange-700"
                    >
                      PLACE ORDER
                    </button>
                  </div>
                  <h5 className="text-md text-center mt-3 font-semibold">
                    or{" "}
                    <Link to="/" className="text-blue-700 font-medium">
                      Continue Shopping
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="h-[95vh] lg:mt-8 w-full flex justify-center flex-col gap-2 items-center font-semibold text-xl">
              <Lottie animationData={cart} className=" w-[13rem]" />
              <Link
                to="/"
                className="text-white px-3 py-[0.1rem] rounded-full text-[0.8rem]  font-medium bg-blue-700 hover:bg-blue-500"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Cart;
