import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { EnvContext, ProductsContext, UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "./Loading";

const Orders = () => {
  const { api } = useContext(EnvContext);
  const { orders, setOrders } = useContext(ProductsContext);
  const { token, user } = useContext(UserContext);

  const navigate = useNavigate();
  const [orderSpin, setOrderSpin] = useState(false);
  const [filterOrders, setFilterOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${api}/api/order/get-all-orders`);
        if (response) {
          const allOrders = response.data.retrievedAllOrders.reverse();
          const userOrders = allOrders.filter(
            (item) => item.userId === user._id
          );
          setOrders(userOrders);
          setFilterOrders(userOrders);
          setOrderSpin(true);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  // filter orders function based on order status
  const inputSelectHandleFunc = (e) => {
    const selectInput = e.target.value;
    if (selectInput === "all") {
      setOrders(filterOrders);
    } else {
      const results = filterOrders.filter(
        (item) => item.orderStatus === selectInput
      );
      setOrders(results);
    }
  };

  // navigate order status page
  const openOrderStatusPage = (orderId) => {
    localStorage.setItem("orderId", JSON.stringify(orderId));
    navigate(`/orders/order_over_view/${orderId}`);
  };

  //  if token not navigate to home
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  if (!orderSpin) {
    return <Loading />;
  }

  return (
    <div className="mt-20 px-3 lg:px-10 pt-4 pb-10 capitalize">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        <select
          name="options"
          id="options"
          onChange={inputSelectHandleFunc}
          className="border-2 outline-none border-blue-500 rounded h-8"
          defaultValue=""
        >
          <option value="" disabled className="text-gray-400 ">
            Filters
          </option>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="outofdelivery">Out of Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <hr className="border  mb-5" />
      {orders.length > 0 ? (
        orders.map((product) => (
          <div
            key={product._id}
            className="flex flex-col items-start gap-2 border-b border-gray-400 pb-4 mb-4"
          >
            {/* Product Image */}
            <Link
              to={`/orders/order_over_view/${product._id}`}
              className="flex active:bg-blue-300 gap-3 w-full"
            >
              <div className="w-[6.8rem] h-fit lg:w-[9.5rem] ">
                <img
                  src={
                    product?.orderedProdcuts[0]?.products[0]?.itemImage[0]
                      ?.image
                  }
                  alt={product?.orderedProdcuts[0]?.products[0]?.itemName}
                  className="w-full h-fit object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="">
                <h2 className=" text-sm lg:text-lg font-semibold text-black">
                  {product?.orderedProdcuts[0]?.products[0]?.itemName.substring(
                    0,
                    25
                  )}
                  ..
                </h2>
                <p
                  className={` text-sm lg:text-lg  ${
                    product?.orderStatus === "pending" ? "text-orange-700" : ""
                  }
                     ${
                       product?.orderStatus === "cancelled"
                         ? " text-red-600  "
                         : ""
                     } 
                     ${
                       product?.orderStatus === "confirmed"
                         ? " text-green-600  "
                         : ""
                     }
                      ${
                        product?.orderStatus === "delivered"
                          ? " text-green-600  "
                          : ""
                      } 
                      ${
                        product?.orderStatus === "shipped"
                          ? " text-green-600  "
                          : ""
                      }
                       ${
                         product?.orderStatus === "outofdelivery"
                           ? " text-green-600  "
                           : ""
                       }`}
                >
                  Order{" "}
                  {product.orderStatus.replace(
                    "outofdelivery",
                    "out of delivery"
                  )}{" "}
                  on {product.orderStatusDate}
                </p>
                <p className="font-semibold text-sm ">
                  {product?.orderedProdcuts[0]?.weight && (
                    <span className="font-semibold text-sm text-gray-600 ">
                      {product?.orderedProdcuts[0]?.weight}
                    </span>
                  )}
                </p>

                <p className="font-semibold text-sm ">
                  {product?.orderedProdcuts[0]?.capacity && (
                    <span className="font-semibold text-sm text-gray-600 ">
                      {product?.orderedProdcuts[0]?.capacity}
                    </span>
                  )}
                </p>

                <p className="font-semibold text-sm ">
                  {product?.orderedProdcuts[0]?.size && (
                    <span className="font-semibold text-sm text-gray-600 ">
                      Size: {product?.orderedProdcuts[0]?.size}
                    </span>
                  )}
                </p>

                <p className="font-semibold text-sm ">
                  {product?.orderedProdcuts[0]?.color && (
                    <span className="font-semibold text-sm text-gray-600 ">
                      {product?.orderedProdcuts[0]?.color}
                    </span>
                  )}
                </p>
                <h2 className=" text-sm lg:text-lg font-semibold text-gray-500">
                  qty : {product?.orderedProdcuts[0]?.itemQty}
                </h2>
              </div>
            </Link>

            {product?.orderedProdcuts.length > 1 && (
              <h6 className="text-sm mt-[0.35rem]">
                Check out the remaining products from your order by clicking
                below!
              </h6>
            )}
            {/* remain products ordered section  */}
            {product?.orderedProdcuts.length > 1 && (
              <details className="flex flex-col gap-3 ">
                <summary className="text-gray-600 cursor-pointer">
                  See products ordered together
                </summary>
                {product?.orderedProdcuts
                  .map((item) => (
                    <Link
                      to={`/orders/order_over_view/${product._id}`}
                      className="flex gap-3 mb-3 mt-3"
                      key={item._id}
                    >
                      <div className="w-[5.3rem] h-fit lg:w-[6.8rem] ">
                        <img
                          src={item.products[0]?.itemImage[0]?.image}
                          alt={item.products[0]?.itemName}
                          className="w-full h-fit object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div>
                        <h3 className="text-[0.65rem] lg:text-[0.8rem] font-bold uppercase  text-gray-500">
                          {item.orderType === "buyonce" ? null : item.orderType}
                        </h3>
                        <h2 className=" text-sm lg:text-lg font-semibold text-black">
                          {item.products[0]?.itemName.substring(0, 25)}..
                        </h2>
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
                        <h2 className=" text-sm lg:text-lg font-semibold text-gray-500">
                          qty : {item.itemQty}
                        </h2>
                      </div>
                    </Link>
                  ))
                  .slice(1)}
              </details>
            )}
          </div>
        ))
      ) : (
        <div className="text-lg flex flex-col gap-2 text-center font-medium  items-center justify-center h-[70vh]">
          No orders found
          <Link
            to="/"
            className="text-white px-3 py-[0.1rem] text-[1rem]  font-medium bg-blue-700 hover:bg-blue-500"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
