import React, { useContext, useEffect, useState } from "react";
import {
  CartContext,
  EnvContext,
  OrderContext,
  ProductsContext,
  UserContext,
} from "../App";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import {
  OrderSuccessModal,
  OrderSpinner,
} from "./components/OrderSuccessModal";
import PaymentFailedModal from "./components/PaymentFailedModal";
import useRazorpayPayment from "./utilis/useRazorpayPayment";
import useEmptyPaymentPayload from "./utilis/useEmptyPaymentPayload";
import { filter } from "framer-motion/client";

const OrderCheckOut = () => {
  const { api, number } = useContext(EnvContext);
  const { token, defaultAddress } = useContext(UserContext);
  const {
    paymentDetails,
    setPaymentDetails,
    setOrderedItems,
    setOrderedAddress,
  } = useContext(OrderContext);
  const { setCartItems, discount } = useContext(CartContext);
  const { orderProducts } = useContext(ProductsContext);
  const [orderOk, setOrderOk] = useState(false);
  const [orderSpin, setOrderSpin] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const navigate = useNavigate();
  const [originalAmount, setOriginalAmount] = useState(null);
  const [ChargesToggle, setChargesToggle] = useState(false);
  useEmptyPaymentPayload();

  const initialOrderData = {
    orderedProdcuts: [],
    shippingAddress: [],
    orderStatus: "pending", // Default status
    delayMessage: "",
    deliveryCharges: 0,
    totalAmount: null,
  };
  const [orderForm, setOrderForm] = useState(initialOrderData);
  const { openRazorpay, paymentResponse, failedToggle } = useRazorpayPayment({
    setOrderSpin,
    setOrderOk,
  });

  useEffect(() => {
    // total amount caluculating function
    const totalAmount = orderProducts.reduce((acc, item) => {
      const total = parseFloat(item.totalAmount || 0);
      const qty = item.itemQty;
      return acc + total * qty;
    }, 0);
    // adding delivery charges
    const withDeliveryCharges = discount.deliveryCharges + totalAmount;
    setTotalAmount(withDeliveryCharges.toFixed(2));
    setOriginalAmount(totalAmount);
    setChargesToggle(true);
  }, [orderProducts]);

  // initializing order form with data
  useEffect(() => {
    setOrderForm((prevData) => ({
      ...prevData,
      orderedProdcuts: orderProducts,
      shippingAddress: defaultAddress,
      orderStatus: "pending",
      delayMessage: "",
      totalAmount: totalAmount,
      deliveryCharges: discount?.deliveryCharges,
    }));
    setPaymentDetails({});
    setOrderedItems(orderProducts);
    setOrderedAddress(defaultAddress[0]);
  }, [orderProducts, totalAmount, discount]);
  console.log(orderProducts);

  // create order
  const placeOrder = async () => {
    if (defaultAddress.length <= 0) {
      toast.warning("Please add address next place the order", {
        className: "custom-toast",
      });
    } else {
      try {
        setOrderSpin(true);
        const res = await axios.post(
          `${api}/api/order/place-order`,
          orderForm,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          // if order created successfully next razorpay modal opens
          const orderRes = res.data;
          setPaymentDetails(orderRes);

          // extract productIds from ordered products
          const orderedIds = orderProducts.map((item) => item.productId);

          // remove the cart products which are ordered
          setCartItems((prev) =>
            prev.filter((item) => !orderedIds?.includes(item.productId))
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOrderSpin(false);
      }
    }
  };

  useEffect(() => {
    // if order id available then opens the razorpay pop up modal
    if (paymentDetails?.razorpay_order_id) {
      openRazorpay();
    }
  }, [paymentDetails]);

  // if not token available or orderProducts length empty page navigate to home
  useEffect(() => {
    if (!token || orderProducts.length <= 0) {
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
        closeOnClick
        autoClose={2000}
        hideProgressBar={false}
      />
      <div className="mt-20 py-5 px-3 pb-10 ">
        <div className=" flex flex-wrap gap-5 lg:gap-0 justify-around ">
          {/* shpping address details section  */}
          <details
            open
            className=" p-3 lg:order-3 w-full lg:w-[29%] text-black  shadow-md shadow-gray-300 rounded-lg bg-white relative   "
          >
            <summary className="font-bold cursor-pointer  text-orange-600">
              SHIPPING ADDRESS
            </summary>
            {defaultAddress.length > 0 ? (
              <>
                <h5 className="font-medium capitalize mt-2">
                  {defaultAddress[0]?.name}{" "}
                </h5>
                <h6 className="font-medium capitalize  mt-1">
                  {defaultAddress[0]?.phone}{" "}
                </h6>
                <h6 className="font-medium capitalize  mt-1">
                  {defaultAddress[0]?.email}{" "}
                </h6>
                <h6 className="capitalize font-semibold mt-1">
                  {defaultAddress[0]?.village}, {defaultAddress[0]?.district}
                </h6>
                <h6 className="font-medium capitalize mt-1">
                  {defaultAddress[0]?.street}{" "}
                </h6>
                <h6 className="font-medium capitalize mt-1">
                  {defaultAddress[0]?.state}, {defaultAddress[0]?.postalCode}{" "}
                </h6>
              </>
            ) : (
              ""
            )}

            <div className="w-full mt-2 pt-2">
              {defaultAddress.length > 0 ? (
                <Link
                  to="/profile"
                  className="font-semibold block text-sm  p-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-32 text-center text-white"
                >
                  Change Address
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="font-semibold block text-sm  p-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-28 text-center text-white"
                >
                  Add Address
                </Link>
              )}
            </div>
          </details>

          {/* order product details section  */}
          <div className="p-3 flex flex-col w-full lg:w-[34%]  items-start  shadow-md shadow-gray-300 rounded-lg">
            <h2 className="font-bold  text-orange-600">PRODUCT DETAILS</h2>
            <details open>
              <summary className="font-bold py-3 lg:bg-white lg:sticky lg:top-0 cursor-pointer text-orange-600">
                ORDER SUMMARY
              </summary>
              <div className=" rounded w-full flex flex-col gap-2 mt-2">
                {orderProducts?.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 overflow-hidden pb-3 border-b border-gray-400"
                  >
                    <img
                      src={item?.products[0]?.itemImage[0]?.image}
                      className="h-fit w-[5rem] rounded-lg"
                      alt="Book 1"
                      placeholderSrc="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PC9zdmc+"
                    />
                    <div>
                      <p className="font-semibold w-full md:w-[13rem] text-sm overflow-x-auto">
                        <span className="font-medium hidden capitalize text-sm lg:block  text-black  ">
                          {item?.products[0]?.itemName.substring(0, 20)}..
                        </span>
                        <span className="font-medium block capitalize lg:hidden text-sm  text-black  ">
                          {item?.products[0]?.itemName.substring(0, 30)}..
                        </span>
                      </p>

                      <p className="font-semibold text-sm">
                        Price :
                        <span className="font-medium text-black pl-1 text-sm  ">
                          ₹{item.totalAmount}
                        </span>
                      </p>

                      <p className="font-semibold text-sm ">
                        {item.weight && (
                          <span className="font-semibold text-sm text-gray-600 ">
                            {item.weight}
                          </span>
                        )}
                      </p>

                      <p className="font-semibold text-sm ">
                        {item.capacity && (
                          <span className="font-semibold text-sm text-gray-600 ">
                            {item.capacity}
                          </span>
                        )}
                      </p>

                      <p className="font-semibold text-sm ">
                        {item.size && (
                          <span className="font-semibold text-sm text-gray-600 ">
                            Size: {item.size}
                          </span>
                        )}
                      </p>

                      <p className="font-semibold text-sm ">
                        {item.color && (
                          <span className="font-semibold text-sm text-gray-600 ">
                            {item.color}
                          </span>
                        )}
                      </p>

                      <p className="font-semibold text-sm">
                        Qty :
                        <span className="font-medium text-sm   text-gray-700 pl-1">
                          {item.itemQty}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>

          <div className="p-3 pb-5 pt-0 w-full lg:w-[34%] lg:h-[90vh] lg:overflow-y-auto shadow-md shadow-gray-300 rounded-lg">
            {/* order summary total amount section   */}
            <div>
              <div className="flex justify-between py-2 pt-2 border-b w-full">
                <span className="text-gray-900">
                  Price ({orderProducts.length} items)
                </span>
                <span className="font-semibold text-gray-700">
                  Rs. {originalAmount?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-3 border-b w-full ">
                <span className="text-gray-900">Delivery Charges</span>
                <div className="flex items-center">
                  {ChargesToggle ? (
                    <span className="font-semibold text-gray-700">
                      Rs. {discount?.deliveryCharges}
                    </span>
                  ) : (
                    <span className="fxont-semibold text-green-600">
                      Rs. 00
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold mt-3 text-xl">
                TOTAL COST :
                <span className="text-black pl-1">Rs. {totalAmount}</span>
              </h3>

              {/* place order button  */}
              {paymentDetails?.razorpay_order_id ? (
                <button
                  onClick={openRazorpay}
                  type="button"
                  className="mt-4 transition text-lg bg-blue-600 hover:bg-blue-700 text-white w-full font-bold h-12 rounded-full"
                >
                  Place Order ₹{totalAmount}
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  type="submit"
                  className="mt-4 transition text-lg bg-blue-600 hover:bg-blue-700 text-white w-full font-bold h-12 rounded-full"
                >
                  Place Order ₹{totalAmount}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* order  progress spinner  */}
        {orderSpin && <OrderSpinner />}

        {/* order and payment success modal  */}
        <OrderSuccessModal orderOk={orderOk} />

        {/* payment failed modal  */}
        <PaymentFailedModal
          paymentResponse={paymentResponse}
          failedToggle={failedToggle}
          openRazorpay={openRazorpay}
        />
      </div>
    </>
  );
};

export default OrderCheckOut;
