import React, { useContext, useEffect } from "react";
import { OrderContext } from "../../App";

const useEmptyPaymentPayload = () => {
  const { setOrderedItems, setOrderedAddress, setPaymentDetails } =
    useContext(OrderContext);
  // initial state of all payment payload
  useEffect(() => {
    return () => {
      setOrderedAddress({});
      setOrderedItems([]);
      setPaymentDetails({});
    };
  }, []);
  return null;
};

export default useEmptyPaymentPayload;
