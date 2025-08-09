import React, { useContext, useEffect, useState } from 'react';
import { dataContext } from '../App';
import { Link, useParams } from 'react-router-dom';
import { FlipkartSpin, Loading } from './Loading';
import { FaCheck, FaInfo, FaSleigh } from 'react-icons/fa';
import axios from 'axios';
import { Slide, toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import warning from "./animations/warning.json"
import check from "./animations/check.json"


const OrderOverView = () => {
  const { orders, setOrders, api, number } = useContext(dataContext);
  const { orderId } = useParams();
  const [singleOrder, setSingleOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState("")
  const [cancelSpin, setCancelSpin] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)


  // changing title dynamically 
  useEffect(() => {
    if (singleOrder) {
      document.title = "Track & Manage Orders"
    } else {
      document.title = 'Welcome to Dora A to Z Fresh';
    }
  }, [singleOrder])


  // Finding single order based on order ID
  useEffect(() => {
    if (orders) {
      const order = orders.find((item) => item._id === orderId);
      setSingleOrder(order || null); // Fallback to null if not found
    }
  }, [orderId, orders]);


  useEffect(() => {
    // total amount caluculating function 
    const totalAmount = singleOrder?.orderedProdcuts.reduce((acc, item) => {
      const total = parseFloat(item.totalAmount || 0);
      const qty = item.itemQty;
      return acc + total * qty;
    }, 0);
    setTotalAmount(parseInt(totalAmount).toFixed(2))
  }, [singleOrder])


  // cancel order function 
  const cancelOrderFunc = async (updataStatus) => {
    setCancelModal(false)
    if (singleOrder.orderStatus === "shipped" || singleOrder.orderStatus === "outofdelivery") {
      toast.warning(`Orders cannot be canceled once ${singleOrder.orderStatus.replace("outofdelivery", "out of delivery")}. For any queries, please contact us`, {
        className: "custom-toast"
      })
    } else {
      try {
        setCancelSpin(true)
        const res = await axios.put(`${api}/order/update-order-status/${singleOrder._id}`, updataStatus)
        if (res) {
          const response = await axios.get(`${api}/order/get-all-orders`)
          if (response) {
            const allOrders = response.data.retrievedAllOrders.reverse()
            setOrders(allOrders);
            setCancelSpin(false)

          }
        }
      } catch (error) {
        console.error(error);
        setCancelSpin(false)

      }
    }
  }


  // Handle loading state
  if (!singleOrder) {
    return <Loading />
  }

  return (

    <>
      <ToastContainer position='bottom-center' draggable transition={Slide} theme='dark' />

      <div className="mt-20 px-3 lg:px-10 pt-4 pb-10 ">
        <h1 className="text-2xl font-semibold mb-2">Order Details</h1>
        <hr className="border my-2" />
        <span className='flex items-center text-gray-500 font-semibold'>Order ID : {singleOrder._id}</span>
        <hr className="border my-2" />

        <div className='flex flex-wrap gap-5 mt-6'>
          {/* Order details section */}
          <div className="flex flex-col w-full lg:w-[45%] items-start gap-2 pb-3 border-b border-gray-400 ">
            {/* Product Image */}
            <Link to={`/product_over_view/${singleOrder?.orderedProdcuts[0]?.productId}`} className="flex gap-5 capitalize">
              <div className="w-[6.8rem] h-fit lg:w-[9.5rem]">
                <img
                  src={singleOrder?.orderedProdcuts[0]?.products[0]?.itemImage[0]}
                  alt={singleOrder?.orderedProdcuts[0]?.products[0]?.itemName}
                  className="w-full h-fit object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div>
                <h3 className="text-[0.65rem] lg:text-[0.8rem] font-bold uppercase text-gray-500">
                  {singleOrder?.orderedProdcuts[0]?.orderType === "buyonce" ? null : singleOrder?.orderedProdcuts[0]?.orderType}
                </h3>
                <h2 className="text-sm lg:text-lg font-semibold text-black">
                  {singleOrder?.orderedProdcuts[0]?.products[0]?.itemName.substring(0, 30)}...
                </h2>
                <h2 className="text-sm lg:text-lg font-semibold text-black">
                  Rs. {singleOrder?.orderedProdcuts[0]?.totalAmount * singleOrder?.orderedProdcuts[0]?.itemQty}
                </h2>
                <h2 className="text-sm lg:text-lg font-semibold text-black  ">
                  {singleOrder?.orderedProdcuts[0]?.products[0]?.itemWeight}{singleOrder?.orderedProdcuts[0]?.products[0]?.itemWeight && "g ,"} qty : {singleOrder?.orderedProdcuts[0]?.itemQty}
                </h2>
              </div>

            </Link>

            <span className='text-[1.3rem] font-medium '>Total Amount : Rs. {singleOrder?.totalAmount}</span>
            <span className='text-gray-700 font-medium'>Order Date : {singleOrder.orderDate}</span>

            {singleOrder?.orderedProdcuts.length > 1 && (
              <>
                <h6 className="text-sm mt-2">
                  Check out the remaining products from your order by clicking below!
                </h6>
                {/* Remaining products ordered section */}
                <details className="flex flex-col gap-3 w-full">
                  <summary className="text-gray-600 cursor-pointer text-sm">See products ordered together</summary>
                  {singleOrder?.orderedProdcuts.slice(1).map((item) => (
                    <Link to={`/product_over_view/${item.productId}`} className="flex gap-5 pb-3 mt-3 border-b border-gray-500" key={item._id}>
                      <div className="w-[6.8rem] h-fit lg:w-[9.5rem]">
                        <img
                          src={item.products[0]?.itemImage[0]}
                          alt={item.products[0]?.itemName}
                          className="w-full h-fit object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div>
                        <h3 className="text-[0.65rem] lg:text-[0.8rem] font-bold uppercase text-gray-500">
                          {item.orderType === "buyonce" ? null : item.orderType}
                        </h3>
                        <h2 className="text-sm lg:text-lg font-semibold text-black capitalize">
                          {item.products[0]?.itemName.substring(0, 30)}...
                        </h2>
                        <h2 className="text-sm lg:text-lg font-semibold text-black">
                          Rs. {item.totalAmount * item.itemQty}
                        </h2>
                        <h2 className="text-sm lg:text-lg font-semibold text-black">
                          {item.products[0]?.itemWeight}{item.products[0]?.itemWeight && "g ,"} Qty : {item.itemQty}
                        </h2>

                      </div>

                    </Link>

                  ))}
                </details>
              </>
            )}
          </div>

          {/* order status section  */}

          <div className="w-full lg:w-[45%]">
            {/* Status Steps */}
            {singleOrder.orderStatus === "cancelled" ?
              <div className='bg-gray-100  rounded flex items-center gap-3 p-3'>
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white">
                  <FaCheck size={13} />
                </div>
                <div className=" rounded-md ">
                  <div className="font-bold text-red-500 text-[0.9rem] lg:text-lg">Order Cancelled</div>
                  <p className="text-sm text-red-500">Your Order has been cancelled on {singleOrder?.orderStatusDate}</p>
                </div>
              </div>

              :

              <div className="space-y-2 ">
                {/* Order Confirmed and pending */}
                {singleOrder.orderStatus === "pending" ?
                  <div className='bg-red-200 text-black rounded flex items-center gap-3 p-3'>

                    <Lottie className='w-14  lg:w-16  bg-red-200 rounded-full' animationData={warning} />

                    <div className="rounded-md w-full">
                      <div className="font-bold text-[0.9rem] lg:text-lg">Order In Pending {singleOrder.orderDate}</div>
                      <h5 className='text-sm'>
                        <span className='font-bold text-red-500'>Note:</span> Orders will be processed after full payment. Send the payment receipt to WhatsApp at <a href={`https://wa.me/91${number}`} className='text-green-700 font-bold'>{number}</a> on the same day.
                      </h5>
                      <a href={`upi://pay?pa=960366@ybl&pn=Dora A-Z Fresh&am=${singleOrder?.totalAmount}&cu=INR`} target='_blank' rel='noopener' className='hover:bg-blue-600  text-md font-semibold px-4 h-[2.5rem] mt-3 flex items-center justify-center gap-2 rounded-full text-white bg-blue-700' > PAY ₹{singleOrder?.totalAmount}</a>

                    </div>
                  </div>
                  :
                  <div className='bg-green-200 text-black rounded flex items-center gap-3 p-3'>
                    {singleOrder?.orderStatus === "confirmed" ?
                      <Lottie className='w-5 rounded-full bg-green-500' animationData={check} />
                      :
                      <div className="w-5 h-5 flex items-center  justify-center rounded-full bg-green-500 text-white">
                        <FaCheck size={13} className='' />
                      </div>
                    }
                    <div className=" rounded-md ">
                      <div className="font-bold  text-[0.9rem] lg:text-lg">Order Confirmed</div>
                      {singleOrder.orderStatus === "confirmed" &&
                        <p className="text-sm">Your Order has been confirmed on {singleOrder?.orderStatusDate}</p>
                      }
                    </div>
                  </div>
                }


                {singleOrder?.orderStatus === "pending" ? null
                  :
                  <>
                    {/* Shipped */}
                    {
                      singleOrder.orderStatus === "shipped" || singleOrder.orderStatus === "outofdelivery" || singleOrder.orderStatus === "delivered" ?
                        <div className='bg-green-200  rounded flex items-center gap-3 p-3'>
                          {singleOrder?.orderStatus === "shipped" ?
                            <Lottie className='w-5 rounded-full bg-green-500' animationData={check} />
                            :
                            <div className="w-5 h-5 flex items-center  justify-center rounded-full bg-green-500 text-white">
                              <FaCheck size={13} className='' />
                            </div>
                          }
                          <div className=" rounded-md ">
                            <div className="font-bold  text-[0.9rem] lg:text-lg">Order Shipped</div>
                            {singleOrder.orderStatus === "shipped" &&
                              <p className="text-sm">Your Order has been Shipped on {singleOrder?.orderStatusDate}</p>

                            }   </div>
                        </div>
                        :
                        <div className='bg-gray-100  rounded flex items-center gap-3 p-3'>
                          <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-500 text-white">

                          </div>
                          <div className=" rounded-md ">
                            <div className="font-bold  text-[0.9rem] lg:text-lg">Order Shipping</div>
                            <p className="text-sm">Your Order will be shipped after order confirmed</p>
                          </div>
                        </div>

                    }

                    {/* out of delivery  */}
                    {singleOrder.orderStatus === "outofdelivery" || singleOrder.orderStatus === "delivered" ?
                      <div className='bg-green-200  rounded flex items-center gap-3 p-3'>
                        {singleOrder?.orderStatus === "outofdelivery" ?
                          <Lottie className='w-5 rounded-full bg-green-500' animationData={check} />
                          :
                          <div className="w-5 h-5 flex items-center  justify-center rounded-full bg-green-500 text-white">
                            <FaCheck size={13} className='' />
                          </div>
                        }
                        <div className=" rounded-md ">
                          <div className="font-bold  text-[0.9rem] lg:text-lg">Order Out Of Delivery</div>
                          {singleOrder.orderStatus === "outofdelivery" &&
                            <p className="text-sm">Your Order has been out of delivery on {singleOrder?.orderStatusDate}</p>

                          }   </div>
                      </div>
                      :
                      <div className='bg-gray-100  rounded flex items-center gap-3 p-3'>
                        <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-500 text-white">

                        </div>
                        <div className=" rounded-md ">
                          <div className="font-bold text-[0.9rem] lg:text-lg">Order Out Of Delivery</div>
                          <p className="text-sm">Your Order will be out of delivery after order shipped</p>
                        </div>
                      </div>
                    }

                    {/* Delivery */}
                    {singleOrder?.orderStatus === "delivered" ?
                      <div className='bg-green-200  rounded flex items-center gap-3 p-3'>
                        {singleOrder?.orderStatus === "delivered" ?
                          <Lottie className='w-5 rounded-full bg-green-500' animationData={check} />
                          :
                          <div className="w-5 h-5 flex items-center  justify-center rounded-full bg-green-500 text-white">
                            <FaCheck size={13} className='' />
                          </div>
                        }
                        <div className=" rounded-md ">
                          <div className="font-bold  text-[0.9rem] lg:text-lg">Order Delivered</div>
                          {singleOrder?.orderStatus === "delivered" &&
                            <p className="text-sm">Your Order has been delivered on {singleOrder?.orderStatusDate}</p>
                          }   </div>
                      </div>
                      :
                      <div className='bg-gray-100  rounded flex items-center gap-3 p-3'>
                        <div className="w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-500 text-white">

                        </div>
                        <div className=" rounded-md w-full ">
                          <div className="font-bold  text-[0.9rem] lg:text-lg">Order Delivery</div>
                          <p className="text-sm">{singleOrder?.orderedProdcuts?.some((item) => item.orderType === "subscription") ? "Subscription orders are delivered daily at 6 AM to 8 AM and 6 PM to 8 AM after order confirmed" : "Your Order will be delivered in 45 minutes after order confirmed"} </p>
                        </div>
                      </div>

                    }

                  </>
                }

              </div>
            }


            {/* delay message section  */}
            {singleOrder.orderStatus === "pending" || singleOrder.orderStatus === "shipped" || singleOrder.orderStatus === "outofdelivery" || singleOrder.orderStatus === "confirmed" ? <>
              {singleOrder.delayMessage &&
                <p className="text-sm my-3 font-medium text-red-600"><strong>Note : </strong>{singleOrder?.delayMessage}</p>
              }
            </> : null
            }

            {cancelSpin && <FlipkartSpin />}

            {/* cancel and contact us section  */}
            <div className='mt-5 border-y border-black flex justify-around'>
              {singleOrder?.orderStatus === "delivered" || singleOrder?.orderStatus === "cancelled" ? false :

                <div className='text-center border-l active:bg-blue-300 border-black w-full py-1'>
                  <button onClick={() => setCancelModal(true)} className='text-black hover:text-blue-600'>Cancel</button>
                </div>
              }
              <div className='border-l active:bg-blue-300 border-black border-r w-full text-center py-1'>
                <Link to="/contact" className='hover:text-blue-600'>Contact Us</Link>

              </div>
            </div>

            {/* cancel confirmation modal */}
            {cancelModal && <div onClick={() => setCancelModal(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 z-50">
              <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-3 text-orange-600">Cancel Order</h2>
                <p className="mb-4">Your Order will be cancelled, are you sure ?</p>
                <div className='flex justify-end gap-2'>

                  <button
                    onClick={() => cancelOrderFunc({ orderStatus: "cancelled" })}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500"
                  >
                    Okay
                  </button>
                  <button
                    onClick={() => setCancelModal(false)}
                    className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>}

          </div>


        </div>

        <div className='mt-5 gap-2 flex flex-wrap items-start'>
          {/* shipped address section */}
          <div className='w-full lg:w-[45%]'>
            <h5 className='mb-2 text-gray-700'>Shipping Address</h5>
            <div className='flex border-t pt-2 flex-col text-black  bg-white relative  items-start gap-1 mb-3 '>
              <h5 className='mb-1 font-medium  capitalize text-lg' >{singleOrder?.shippingAddress[0].name}   </h5>
              <h6 className='capitalize'>{singleOrder?.shippingAddress[0].phone} </h6>
              <h6 className=''>{singleOrder?.shippingAddress[0].email} </h6>
              <h6 className='capitalize'>{singleOrder?.shippingAddress[0].village}, {singleOrder?.shippingAddress[0].district}</h6>
              <h6 className='capitalize'>{singleOrder?.shippingAddress[0].street} </h6>
              <h6 className=' capitalize'>{singleOrder?.shippingAddress[0].state}, {singleOrder?.shippingAddress[0].postalCode} </h6>
            </div>
          </div>
          <hr className="border  w-full lg:w-0  mb-2" />

          {/* price details  */}
          <div className='w-full  lg:w-[45%]'>
            <h5 className='mb-2 text-gray-700'>Price Details</h5>
            <div className="flex justify-between border-t py-2 pt-2 border-b w-full">
              <span className="text-gray-900">Price ({singleOrder?.orderedProdcuts?.length} items)</span>
              <span className="font-semibold text-gray-700">Rs. {totalAmount?.toLocaleString("en-In")}</span>
            </div>

            <div className="flex justify-between py-3 border-b w-full ">
              <span className="text-gray-900">Delivery Charges</span>
              <div className="flex items-center">
                {singleOrder?.totalAmount > totalAmount ?
                  <span className="font-semibold text-gray-700">Rs. {singleOrder?.totalAmount - totalAmount}</span>
                  :
                  <span className="fxont-semibold text-green-600">Rs. 00</span>

                }
              </div>
            </div>

            <h3 className="font-bold mt-3 text-xl  ">
              TOTAL COST :
              <span className="text-black pl-1">Rs. {singleOrder?.totalAmount}</span>
            </h3>
          </div>
        </div>

      </div >

    </>

  );
};

export default OrderOverView;
