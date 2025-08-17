import React, { useCallback, useContext, useEffect, useState } from "react";
import { EnvContext, UserContext } from "../../App";
import axios from "axios";
import useEmailTemplate from "./useEmailTemplate";

const useRazorpayPayment = ({ setOrderSpin, setOrderOk, totalAmount }) => {
  const { paymentDetails, defaultAddress, setPaymentDetails } =
    useContext(UserContext);
  const { api } = useContext(EnvContext);
  const [paymentResponse, setPaymentResponse] = useState({});
  const [failedToggle, setFailedToggle] = useState(false);
  const { emailData, failedEmailData } = useEmailTemplate({
    totalAmount,
    paymentResponse,
  });

  // integrating razorpay script link dynamically
  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "https://checkout.razorpay.com/v1/checkout.js";
    scriptElement.async = true;
    document.body.appendChild(scriptElement);

    // remove the script link when component unmount
    return () => {
      document.body.removeChild(scriptElement);
    };
  }, []);

  // Function to start Razorpay payment
  const openRazorpay = useCallback(() => {
    const options = {
      key: paymentDetails.razorpay_key_id,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      name: "Madly Mart",
      description: "Purchase from Madly Mart",
      image: "https://madlymartuser.vercel.app/MadlyMart.jpg",
      order_id: paymentDetails.razorpay_order_id, // from backend Razorpay order creation order id

      // Success handler
      handler: async function (response) {
        // Send details to backend for verification
        const paymentSuccessData = {
          userEmail: defaultAddress[0]?.email,
          mongoOrderId: paymentDetails?.mongoOrderId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          totalAmount: totalAmount,
        };

        setPaymentResponse(paymentSuccessData);
        try {
          setOrderSpin(true);

          const res = await axios.post(
            `${api}/api/payment/verify-payment`,
            paymentSuccessData
          );
          if (res) {
            setOrderOk(true);
            localStorage.removeItem("paymentDetails");
            setPaymentDetails({});
            // if payment verifys successfully email confirmation wll be sent to user and seller
            await axios.post(
              `${api}/api/updates-email/send-updates`,
              emailData
            );
          }
        } catch (error) {
          console.error(error);
        } finally {
          setOrderSpin(false);
        }
      },

      // customer details
      prefill: {
        name: defaultAddress[0]?.name,
        email: defaultAddress[0]?.email,
        contact: defaultAddress[0]?.phone,
      },
    };

    const rzp = new window.Razorpay(options);

    // Failure handler
    rzp.on("payment.failed", async function (response) {
      const failedPaymentData = {
        userEmail: defaultAddress[0]?.email,
        mongoOrderId: paymentDetails?.mongoOrderId,
        orderId: response.error.metadata.order_id,
        paymentId: response.error.metadata.payment_id,
        totalAmount: totalAmount,
        error: {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          metadata: response.error.metadata,
        },
      };

      setPaymentResponse(failedEmailData);

      try {
        setOrderSpin(true);

        const res = await axios.post(
          `${api}/api/payments/failed-payment`,
          failedPaymentData
        );
        if (res) {
          setFailedToggle(true);
          // if payment verification failed email will be sent to user and seller
          await axios.post(`${api}/api/updates-email/send-updates`, emailData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setOrderSpin(false);
      }
    });

    // Open Razorpay payment popup
    rzp.open();
  });

  return { openRazorpay, failedToggle, paymentResponse };
};

export default useRazorpayPayment;
