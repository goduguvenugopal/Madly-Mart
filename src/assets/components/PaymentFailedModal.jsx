import React from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const PaymentFailedModal = ({
  paymentResponse,
  failedToggle,
  openRazorpay,
}) => {
  return (
    <>
      {/* Payment Failed Modal */}
      {failedToggle && (
        <div className="fixed inset-0 z-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center animate-scaleIn">
            {/* Failed Icon */}
            <div className="bg-red-500 w-20 h-20 rounded-full flex justify-center items-center mx-auto shadow-lg">
              <IoMdClose className="text-white text-4xl" />
            </div>

            {/* Heading */}
            <h2 className="text-red-600 text-2xl font-bold mt-4">
              Payment Failed
            </h2>
            <p className="text-gray-600 mt-2">
              Unfortunately, your payment could not be processed.
            </p>

            {/* Error Message */}
            {paymentResponse?.error?.reason && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mt-4 text-left">
                <h4 className="font-semibold">Reason:</h4>
                {paymentResponse.error.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {paymentResponse.error.description}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap justify-center mt-6">
              <button
                onClick={openRazorpay}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
              >
                Retry Payment
              </button>

              <Link
                to="/orders"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-lg shadow-md transition"
              >
                Go to My Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentFailedModal;
