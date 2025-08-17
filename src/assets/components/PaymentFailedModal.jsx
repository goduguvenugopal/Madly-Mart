import React from "react";

const PaymentFailedModal = ({
  paymentResponse,
  failedToggle,
  openRazorpay,
}) => {
  return (
    <>
      {/* payment failed modal  */}
      {failedToggle && (
        <div className="px-5 fixed flex justify-center h-screen w-screen items-center top-0 left-0 bg-white text-black z-50">
          <div className="text-center flex flex-col items-center justify-center">
            {/* Failed Lottie animation or an icon */}❌
            <h2 className="text-red-600 text-2xl font-semibold mt-2">
              Payment Failed
            </h2>
            <p className="text-black text-lg mt-2">
              Unfortunately, your payment could not be processed.
            </p>
            {/* Show payment failure reason(s) */}
            {paymentResponse?.error?.reason && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-3 w-full max-w-md text-left">
                <h4 className="font-semibold">Reason:</h4>
                <p>{paymentResponse.error.reason}</p>
                {paymentResponse.error.description && (
                  <p className="mt-1 text-sm">
                    {paymentResponse.error.description}
                  </p>
                )}
              </div>
            )}
            {/* Retry + Orders buttons */}
            <div className="flex gap-4 mt-5">
              <button
                onClick={openRazorpay}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded"
              >
                Retry Payment
              </button>

              <Link
                to="/orders"
                className="bg-gray-300 text-black font-semibold px-4 py-2 rounded"
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
