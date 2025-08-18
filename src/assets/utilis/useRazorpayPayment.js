import React, { useCallback, useContext, useEffect, useState } from "react";
import { EnvContext, OrderContext } from "../../App";
import axios from "axios";
import useEmailTemplate from "./useEmailTemplate";

const useRazorpayPayment = ({ setOrderSpin, setOrderOk }) => {
  const { paymentDetails, setPaymentDetails, orderedAddress } =
    useContext(OrderContext);
  const { api } = useContext(EnvContext);
  const [paymentResponse, setPaymentResponse] = useState({});
  const [failedToggle, setFailedToggle] = useState(false);
  const { emailData, failedEmailData, closedEmailData } = useEmailTemplate({
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
      modal: {
        ondismiss: async function () {
          // This triggers when user closes popup manually
          try {
            await axios.post(
              `${api}/api/updates-email/send-updates`,
              closedEmailData
            );
            setPaymentDetails({});
          } catch (error) {
            console.error(error);
          } finally {
            setPaymentDetails({});
          }
        },
      },
      // Success handler
      handler: async function (response) {
        // Send details to backend for verification
        setFailedToggle(false);
        setOrderSpin(true);


        const paymentSuccessData = {
          userEmail: orderedAddress?.email,
          mongoOrderId: paymentDetails?.mongoOrderId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          totalAmount: paymentDetails?.amount / 100,
        };

        setPaymentResponse(paymentSuccessData);
        try {
          

          const res = await axios.post(
            `${api}/api/payment/verify-payment`,
            paymentSuccessData
          );
          if (res) {
            setOrderOk(true);
            // if payment verifys successfully email confirmation wll be sent to user and seller
            await axios.post(
              `${api}/api/updates-email/send-updates`,
              emailData
            );
            setPaymentDetails({});
          }
        } catch (error) {
          console.error(error);
        } finally {
          setOrderSpin(false);
          setPaymentDetails({});
        }
      },

      // customer details
      prefill: {
        name: orderedAddress?.name,
        email: orderedAddress?.email,
        contact: orderedAddress?.phone,
      },
    };

    const rzp = new window.Razorpay(options);

    // Failure handler
    rzp.on("payment.failed", async function (response) {
      const failedPaymentData = {
        userEmail: orderedAddress?.email,
        mongoOrderId: paymentDetails?.mongoOrderId,
        razorpay_order_id: response.error.metadata.order_id,
        razorpay_payment_id: response.error.metadata.payment_id,
        totalAmount: paymentDetails?.amount / 100,
        error: {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          metadata: response.error.metadata,
        },
      };

      if (response) {
        setPaymentResponse(failedPaymentData);
        setFailedToggle(true);
      }

      try {
        const res = await axios.post(
          `${api}/api/payments/failed-payment`,
          failedPaymentData
        );
        if (res) {
          // if payment verification failed email will be sent to user and seller
          await axios.post(
            `${api}/api/updates-email/send-updates`,
            failedEmailData
          );
        }
      } catch (error) {
        console.error(error);
      }  
    });

    // Open Razorpay payment popup
    rzp.open();
  });

  return { openRazorpay, failedToggle, paymentResponse };
};

export default useRazorpayPayment;
