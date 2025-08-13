import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

const DefaultAddress = () => {
  const { defaultAddress } = useContext(UserContext);
  return (
    <>
      {/* add address section  */}
      {defaultAddress.length > 0 ? (
        <div className="mb-3 py-3 capitalize flex items-center flex-wrap gap-2 w-full ">
          <div className="w-[65%]">
            <h5 className="text-sm font-medium text-black">
              Delivery to :{" "}
              <span className="text-gray-600">
                {defaultAddress[0]?.name}, {defaultAddress[0]?.postalCode},{" "}
                {defaultAddress[0]?.village}, {defaultAddress[0]?.district},{" "}
                {defaultAddress[0]?.street.substring(0, 35)}...
              </span>
            </h5>
          </div>

          <div className="w-fit">
            {defaultAddress.length > 0 ? (
              <Link
                to="/profile"
                className="font-semibold text-sm block px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-fit text-center text-white"
              >
                Change
              </Link>
            ) : (
              <Link
                to="/profile"
                className="font-semibold  text-sm block text-nowrap px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-fit text-center text-white"
              >
                Add Address
              </Link>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DefaultAddress;
