import React, { useContext, useEffect } from "react";
import { OrderContext } from "../../App";

const useEmptyPaymentPayload = () => {
  const { setOrderedItems, setOrderedAddress, setPaymentDetails } =
    useContext(OrderContext);
  // initial state of all payment payload
  useEffect(() => {
    console.log("component mounted");

    return () => {
      setOrderedAddress({});
      setOrderedItems([]);
      setPaymentDetails({});
      console.log("component unmounted");
    };
  }, []);
  return null;
};

export default useEmptyPaymentPayload;
