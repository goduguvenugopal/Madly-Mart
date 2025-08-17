import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Lottie from "lottie-react";
import success from "../animations/success.json";


const OrderSuccessModal = ({orderOk}) => {
 
    
  return (
    <>
      {/* order placed successfull modal  */}
            {orderOk && (
              <div className="px-5 fixed flex justify-center h-screen w-screen items-center top-0 left-0 bg-white text-black">
                <div className="text-center flex flex-col items-center justify-center">
                  <Lottie animationData={success} className="w-[15rem]" />
                  <h4 className=" text-2xl font-semibold"> </h4>
                  <h2 className="text-black text-2xl mt-1">
                    Order Placed Successfully!
                  </h2>
    
                  <h5 className="mt-2 text-green-700">
                    <span className="font-bold text-red-500">Note : </span>Once your order has shipped, the 'Track Order' button on order status page will be enabled, allowing you to view your shipment's live status.
                     
                  </h5>
                  <p className="text-black text-lg mt-2">
                    You will receive the order details in your email.
                  </p>
    
                  <Link
                    to="/orders"
                    className="text-white font-semibold bg-blue-600 mt-2 p-1 px-2 "
                  >
                    Go to My Orders
                  </Link>
                </div>
              </div>
            )}
    
    
    </>
  )
}

export default OrderSuccessModal