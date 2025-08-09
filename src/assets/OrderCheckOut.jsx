import React, { useContext, useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaDownload,
  FaRegCopy,
  FaUpload,
  FaWhatsapp,
} from "react-icons/fa6";
import { dataContext } from "../App";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import success from "./animations/success.json";
import Lottie from "lottie-react";

const OrderCheckOut = () => {
  const {
    orderProducts,
    api,
    number,
    token,
    defaultAddress,
    cartItems,
    discount,
  } = useContext(dataContext);
  const [orderOk, setOrderOk] = useState(false);
  const [orderSpin, setOrderSpin] = useState(false);
  const [totalAmount, setTotalAmount] = useState(null);
  const navigate = useNavigate();
  const [originalAmount, setOriginalAmount] = useState(null);
  const [ChargesToggle, setChargesToggle] = useState(false);
  const [modal, setModal] = useState(false);
  const initialOrderData = {
    orderedProdcuts: [],
    shippingAddress: [],
    orderStatus: "pending", // Default status
    delayMessage: "",
    totalAmount: null,
  };
  const [orderForm, setOrderForm] = useState(initialOrderData);

  const emailData = {
    email: `${defaultAddress[0]?.email}, dora.a.to.z.fresh@gmail.com`,
    subject: "Dora A to Z Fresh Order Placed Successfully",
    html: `
      <h3>Dear ${defaultAddress[0]?.name},</h3>
      <p>Thank you for your order! Below are the details of your Shipping Address:</p>
      <h4>Shipping Address:</h4>
      <ul>
        <li><strong>City :</strong> ${defaultAddress[0]?.district}</li>
        <li><strong>Phone :</strong> ${defaultAddress[0]?.phone}</li>
        <li><strong>Address :</strong> ${defaultAddress[0]?.street}, ${
      defaultAddress[0]?.village
    }, ${defaultAddress[0]?.postalCode}</li>
        <li><strong>State :</strong> ${defaultAddress[0]?.state}</li>
      </ul>
      <h4 style="font-weight: bold; margin-bottom: 4px;">
        Product Details :
      </h4>
      <div style="width: 100%; border: 1px solid gray;">
        ${orderProducts
          .map(
            (item) => `
          <div key="${
            item._id
          }" style="display: flex; gap: 12px; border-bottom: 2px solid gray; padding: 12px;">
            <img
              src="${item?.products[0]?.itemImage[0]}"
              style="height: 10rem; width: 9rem; border-radius: 8px;"
              alt=${item?.products[0]?.itemName.substring(0, 20)}
            />
            <div style="padding-left:10px;">
              <p style="font-weight: 600; width: 100%; overflow-x: auto;">
                <span style="font-weight: 500; display: block; color: black;">
                  ${item?.products[0]?.itemName.substring(0, 20)}..
                </span>
              </p>
              <p style="font-weight: 600;">
                Price :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  Rs. ${item?.products[0]?.itemName.substring(0, 20)}
                </span>
              </p>
              <p style="font-weight: 600;">
                Quantity :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  ${item.itemQty}
                </span>
              </p>
               <p style="font-weight: 600;">
                Order Type :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  ${item.products[0].orderType.replace("buyonce", "buy once")}
                </span>
              </p>
               <p style="font-weight: 600;">
                Product weight Qty :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  ${item.products[0].itemWeight}${
              item.products[0].itemSubCategory === "Milk" ? "ml" : "g"
            }
                </span>
              </p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <h4>Payment Details</h4>
      <h4><span>Note : </span>Orders will be processed only after full payment. Please send the payment receipt to WhatsApp at <a href='https://wa.me/919603669236'>9603669236</a> on the same day of the order.
</h4>
      <h3><strong>Total Amount :</strong> Rs. ${totalAmount}</h3>
      <ul>
        <li><strong>Total Items:</strong> ${orderProducts.length}</li>
          
      </ul>

<h3>Dora A to Z Fresh Address:</h3>
      <ul>
      <li><strong>Mobile :</strong> <a href="tel:+91${number}"> ${number}</a></li>
      <li><strong>Address :</strong> Noori majid opposite,
                     Pathabazar, Gopalpet road,
                     Wanaparthy 509103</li>
        <li><strong>Email :</strong>dora.a.to.z.fresh@gmail.com</li>
        <li><strong>Google Map Location :</strong> <a href="https://maps.app.goo.gl/YmA4dbsdDkvRfr6t5">Location</a></li>
      </ul>

      <h3>Customer Information:</h3>
      <ul>
      <li><strong>Name :</strong> ${defaultAddress[0]?.name}</li>
      <li><strong>Email :</strong> ${defaultAddress[0]?.email}</li>
      </ul>
      <p>If you have any questions, feel free to contact us at dora.a.to.z.fresh@gmail.com.</p>
      <p>Thank you for shopping with Dora A to Z Fresh!</p>
      <a href="https://doraatozfresh.vercel.app">Continue Shopping</a>
    `,
  };

  useEffect(() => {
    // total amount caluculating function
    const totalAmount = orderProducts.reduce((acc, item) => {
      const total = parseFloat(item.totalAmount || 0);
      const qty = item.itemQty;
      return acc + total * qty;
    }, 0);

    const isOrderType = orderProducts?.some(
      (item) => item.orderType === "subscription"
    );
    // checking if any order has subscription deliveryCharges will be zero
    if (isOrderType === false) {
      const withDeliveryCharges = discount.deliveryCharges + totalAmount;
      setTotalAmount(withDeliveryCharges.toFixed(2));
      setOriginalAmount(totalAmount);
      setChargesToggle(true);
    } else {
      setChargesToggle(false);
      setOriginalAmount(totalAmount);
      setTotalAmount(totalAmount.toFixed(2));
    }
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
    }));
  }, [orderProducts, totalAmount]);

  // placing order function
  const placeOrder = async () => {
    if (defaultAddress.length <= 0) {
      toast.warning("Please add address next place the order", {
        className: "custom-toast",
      });
    } else if (totalAmount < 150) {
      setModal(true);
    } else {
      try {
        setOrderSpin(true);
        const res = await axios.post(`${api}/order/place-order`, orderForm, {
          headers: {
            token: token,
          },
        });
        if (res) {
          setOrderOk(true);
          setOrderSpin(false);
          // if order placed successfully email confirmation wll be sent to user and seller
          await axios.post(`${api}/updates-email/send-updates`, emailData);
        }
      } catch (error) {
        console.error(error);
        setOrderSpin(false);
      }
    }
  };

  // number copy function
  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      toast.success("Number Copied to clipboard", {
        className: "custom-toast",
      });
    } catch (error) {
      console.error(error);
      toast.error("Number not Copied", { className: "custom-toast" });
    }
  };

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

          {/* qr code payment section  */}
          {(totalAmount) >=
            150 ? (
              <div className="p-3 flex flex-col w-full lg:w-[34%]  items-center  shadow-md shadow-gray-300 rounded-lg">
                <h2 className="font-bold  text-orange-600">PAYMENT DETAILS</h2>
                <h4 className="font-medium">SCAN QR CODE</h4>
                <img
                  src="/qrcode.png"
                  alt="qr_code"
                  className="border-2 my-2 h-52 w-52 rounded "
                />

                <img
                  src="/allpayments.png"
                  className="w-[60%] mb-2 "
                  alt="all_upi_logo"
                />
                <h6 className="text-blue-600 font-bold">PAY TO THIS NUMBER</h6>
                <span
                  onClick={() => copyNumber(9603669236)}
                  className="font-bold my-2 cursor-pointer flex items-center gap-2 hover:text-blue-600"
                >
                  9603669236 <FaRegCopy />
                </span>
                <h4 className="text-center">
                  Banking Name :{" "}
                  <span className="font-bold ">BANUPRAKASH NAGARAM</span>
                </h4>
                <div className="hidden lg:block">
                  <a
                    href="/qrcode.png"
                    className=" animate-bounce text-md font-semibold px-3 h-[2.5rem] mt-6 flex items-center gap-2 rounded-full text-white  bg-orange-600"
                    download="/qrcode.png"
                  >
                    <FaDownload />
                    Download QR Code
                  </a>
                </div>
                <a
                  href={`upi://pay?pa=960366@ybl&pn=Dora A-Z Fresh&am=${totalAmount}&cu=INR`}
                  target="_blank"
                  rel="noopener"
                  className="hover:bg-blue-600 lg:hidden text-md font-semibold px-4 h-[2.5rem] my-4 flex justify-center items-center gap-2 rounded-full text-white bg-blue-700 min-w-[12rem]"
                >
                  {" "}
                  PAY ₹{totalAmount}
                </a>
                <h5 className=" lg:hidden">
                  <span className="font-bold text-red-500">Note : </span>After
                  making the payment, please place your order and send the
                  payment receipt via below WhatsApp number on the same day.
                </h5>
              </div>
            ) : (
              <div className="p-3 flex flex-col w-full lg:w-[34%]  items-center  shadow-md shadow-gray-300 rounded-lg">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full"
                >
                  <h2 className="text-lg font-semibold mb-3 text-orange-600">
                    Complete Your Order
                  </h2>
                  <p className="mb-4">
                    Orders below{" "}
                    <span className="text-[1rem] font-bold">Rs.150</span> are
                    not allowed. Please add more products, increase the quantity
                    of existing items, or place the order directly from your
                    cart if you already have products.
                  </p>
                  <div className="text-end">
                    {cartItems.length > 0 ? (
                      <Link
                        to="/cart"
                        onClick={() => setModal(false)}
                        className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Go to cart
                      </Link>
                    ) : (
                      <Link
                        to="/"
                        onClick={() => setModal(false)}
                        className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Add More Products
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          }

          {/* order product details section  */}
          <div className="p-3 pb-5 pt-0 w-full lg:w-[34%] lg:h-[90vh] lg:overflow-y-auto shadow-md shadow-gray-300 rounded-lg">
            <details>
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
                      src={item?.products[0]?.itemImage[0]}
                      className="h-fit w-[5rem] rounded-lg"
                      alt="Book 1"
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
                        {item.products[0].itemWeight && (
                          <span className="font-semibold text-sm text-gray-600 ">
                            {item.products[0].itemWeight}
                            {item.products[0].itemSubCategory === "Milk"
                              ? "ml ,"
                              : "g ,"}
                          </span>
                        )}{" "}
                        Qty :
                        <span className="font-medium text-sm   text-gray-700 pl-1">
                          {item.itemQty}
                        </span>
                      </p>
                      <p className="font-semibold capitalize text-sm text-blue-600">
                        {item.products[0].orderType === "buyonce"
                          ? null
                          : item.products[0].orderType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </details>

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
              <h5 className="mt-2 ">
                <span className="font-bold text-red-500">Note : </span>Orders
                will be processed only after full payment. Please send the
                payment receipt to given below WhatsApp number the same day of
                the order.
              </h5>
              <div className="flex justify-center pt-2">
                <a
                  href={`https://wa.me/91${number}`}
                  className="text-green-700 font-bold flex items-center gap-1 "
                >
                  {" "}
                  <FaWhatsapp size={21} />
                  {number}
                </a>
              </div>

              <button
                onClick={placeOrder}
                type="submit"
                className="mt-4  bg-yellow-500 hover:bg-yellow-700 text-white w-full font-bold h-12 rounded-full"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>

        {/* order  progress spinner  */}
        {orderSpin && (
          <div className="fixed flex justify-center h-screen w-screen items-center top-0 left-0 bg-gray-800 opacity-85">
            <div
              className="border-t-4 border-solid rounded-full w-12 h-12 animate-spin"
              style={{
                borderWidth: "7px",
                borderColor: "white",
                borderTopColor: "blue",
                borderStyle: "solid",
              }}
            ></div>
          </div>
        )}

        {/* order placed successfully modal  */}
        {orderOk && (
          <div className="px-5 fixed flex justify-center h-screen w-screen items-center top-0 left-0 bg-white text-black">
            <div className="text-center flex flex-col items-center justify-center">
              {/* <FaCircleCheck size={150} className='text-green-500' /> */}
              <Lottie animationData={success} className="w-[15rem]" />
              <h4 className=" text-2xl font-semibold"> </h4>
              <h2 className="text-black text-2xl mt-1">
                Order Placed Successfully!
              </h2>

              <h5 className="mt-2">
                <span className="font-bold text-red-500">Note : </span>Orders
                will be processed only after full payment. Please send the
                payment receipt to WhatsApp at{" "}
                <a
                  href={`https://wa.me/91${number}`}
                  className="text-green-700 font-bold"
                >
                  {number}
                </a>{" "}
                on the same day of the order.
              </h5>
              <p className="text-black text-lg mt-2">
                You will receive the order details in your email.
              </p>

              <Link
                to="/orders"
                className="text-white font-semibold bg-blue-600 mt-2 p-1 px-2 rounded"
              >
                Go to My Orders
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* modal section  */}
      {modal && (
        <div
          onClick={() => setModal(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full"
          >
            <h2 className="text-lg font-semibold mb-3 text-orange-600">
              Complete Your Order
            </h2>
            <p className="mb-4">
              Orders below <span className="text-[1rem] font-bold">Rs.150</span>{" "}
              are not allowed. Please add more products, increase the quantity
              of existing items, or place the order directly from your cart if
              you already have products.
            </p>
            <div className="text-end">
              {cartItems.length > 0 ? (
                <Link
                  to="/cart"
                  onClick={() => setModal(false)}
                  className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to cart
                </Link>
              ) : (
                <Link
                  to="/"
                  onClick={() => setModal(false)}
                  className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add More Products
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCheckOut;
