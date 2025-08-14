import React, { useContext, useEffect, useState } from "react";
import { EnvContext, UserContext } from "../../App";
import { Loading, SmallLoading, FlipkartSpin } from "../../assets/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { Slide, toast, ToastContainer } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Profile = () => {
  const { token, setUser, user, defaultAddress, setDefaultAddress } =
    useContext(UserContext);
  const { api } = useContext(EnvContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [delSpin, setDelSpin] = useState("");
  const [delModal, setDelModal] = useState(false);
  const [addressToggle, setAddressToggle] = useState(false);
  const initialData = {
    name: "",
    phone: null,
    email: user?.email,
    district: "",
    village: "",
    street: "",
    state: "",
    postalCode: null,
  };
  const [addressForm, setAddressForm] = useState(initialData);
  const [addressSpin, setAddressSpin] = useState(false);

  useEffect(() => {
    // fetching user details
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${api}/api/user/get-single-user`, {
          headers: {
            token: token,
          },
        });
        if (response) {
          setUser(response.data.singleUser);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.singleUser)
          );
          setLoading(false);
        }
      } catch (error) {
        setLoading(true);
      }
    };

    if (token) {
      fetchUser();
    }

    // fetch addresses
    const fetchAddress = async () => {
      try {
        const res = await axios.get(`${api}/api/address/get-user-address`, {
          headers: {
            token: token,
          },
        });
        if (res) {
          setAddress(res.data.retrievedAddress.reverse());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAddress();
  }, [token]);

  // if token not navigate to login page
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  // form handle function
  const formHandleFunc = (e) => {
    const { name, value } = e.target;
    setAddressForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // address submit function
  const addressSubmit = async (e) => {
    e.preventDefault();
    if (
      !addressForm.district.trim() ||
      !addressForm.village.trim() ||
      !addressForm.postalCode
    ) {
      toast.error("Please select village and district", {
        className: "custom-toast",
      });
    } else {
      try {
        setAddressSpin(true);
        const res = await axios.post(
          `${api}/api/address/save-shipping-address`,
          addressForm,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res) {
          try {
            const res = await axios.get(`${api}/api/address/get-user-address`, {
              headers: {
                token: token,
              },
            });
            if (res) {
              const retrievedAddress = res.data.retrievedAddress.reverse();
              setAddress(retrievedAddress);
              toast.success("Address added successfully", {
                className: "custom-toast",
              });
              setDefaultAddress([retrievedAddress[0]]);
              localStorage.setItem(
                "address",
                JSON.stringify([retrievedAddress[0]])
              );
              setAddressForm(initialData);
              setAddressForm((prevData) => ({
                ...prevData,
                email: user.email,
              }));
              setAddressSpin(false);
              setAddressToggle(false);
            }
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
        setAddressSpin(false);
        toast.error("Failed to add address. Please try again.", {
          className: "custom-toast",
        });
      }
    }
  };

  // set as default address function
  const setDefaultAddressFunc = (itemId) => {
    const findAddress = address.find((item) => item._id === itemId);
    const selectedAddress = [findAddress];
    localStorage.setItem("address", JSON.stringify(selectedAddress));
    setDefaultAddress([findAddress]);
    toast.success("Default address has changed successfully", {
      className: "custom-toast",
    });
  };

  // delete address function
  const deleteAddress = async (delId) => {
    setDelModal(false);
    try {
      setDelSpin(delId);
      const res = await axios.delete(
        `${api}/api/address/delete-address/${delId}`
      );
      if (res) {
        toast.success("Address deleted successfully", {
          className: "custom-toast",
        });
        const remain = address.filter((item) => item._id !== delId);
        setAddress(remain);
        if (remain.length > 0) {
          localStorage.setItem("address", JSON.stringify([remain[0]]));
          setDefaultAddress([remain[0]]);
        } else if (remain.length <= 0) {
          setDefaultAddress([]);
          localStorage.removeItem("address");
        }
        setDelSpin("");
      }
    } catch (error) {
      console.error(error);
      setDelSpin("");
      toast.error("Failed to delete address. Please try again.", {
        className: "custom-toast",
      });
    }
  };

  // if there are no address added address form modal will be opened
  useEffect(() => {
    if (address.length <= 0) {
      setAddressToggle(true);
    } else {
      setAddressToggle(false);
    }
  }, [address]);

  // loading when fetching user detailes
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-gray-100  p-3 lg:px-16 select-none mt-3 mb-7 pt-24">
        <ToastContainer
          position="top-center"
          theme="dark"
          transition={Slide}
          closeOnClick
          autoClose={2000}
          hideProgressBar={false}
        />
        {/* Profile Container */}
        <div className="w-full bg-white shadow-md rounded-lg p-4 sm:p-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
                {user.fullName}
              </h1>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm text-gray-800 truncate">{user.email}</p>
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between lg:justify-start lg:gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Addresses</h2>
              <button
                onClick={() => {
                  setAddressToggle(true);
                  setAddressForm((prevData) => ({
                    ...prevData,
                    email: user.email,
                  }));
                }}
                className="text-blue-600 border-2 border-blue-500 hover:border-blue-600 rounded-full px-3 h-8 flex items-center justify-center gap-2 font-bold hover:text-blue-800 text-sm"
              >
                <FaPlus size={14} /> Add
              </button>
            </div>
            {/* No Address Placeholder */}
            <div className="mt-4 bg-gray-100  text-gray-600  rounded-lg">
              {address.length > 0 ? (
                <div>
                  {address.map((item) => (
                    <div
                      className="flex flex-col text-black border bg-white relative  items-start gap-1 mb-3 shadow-md rounded shadow-gray-300 p-2 "
                      key={item._id}
                    >
                      <h5 className="font-medium capitalize ">{item.name} </h5>
                      <h6 className="font-medium capitalize">{item.phone} </h6>
                      <h6 className=" text-gray-500">{item.email} </h6>
                      <h6 className="capitalize font-semibold">
                        {item.village}, {item.district}
                      </h6>
                      <h6 className="capitalize text-gray-500">
                        {item.street}{" "}
                      </h6>
                      <h6 className="font-medium capitalize">
                        {item.state}, {item.postalCode}{" "}
                      </h6>
                      <div
                        onClick={() => setDefaultAddressFunc(item._id)}
                        className={` cursor-pointer absolute border-2 top-4  rounded-full h-4 w-4 right-4 p-1 ${
                          defaultAddress[0]?._id === item._id
                            ? "bg-blue-500 outline-blue-500 outline-2 outline"
                            : "border-blue-500 outline-blue-500 outline-2 outline outline-offset-2"
                        }`}
                      ></div>
                      {delSpin === item._id ? (
                        <FlipkartSpin />
                      ) : (
                        <RiDeleteBin6Line
                          onClick={() => setDelModal(item._id)}
                          size={20}
                          className="hover:text-red-600 cursor-pointer absolute right-3 top-14 text-gray-600"
                        />
                      )}

                      {delModal && (
                        <div
                          onClick={() => setDelModal(false)}
                          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 z-50"
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full"
                          >
                            <h2 className="text-lg font-semibold mb-3 text-orange-600">
                              Delete Address
                            </h2>
                            <p className="mb-4">
                              Address will be deleted, are you sure ?
                            </p>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => deleteAddress(delModal)}
                                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-500"
                              >
                                Okay
                              </button>
                              <button
                                onClick={() => setDelModal(false)}
                                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 h-20 flex  justify-center items-center">
                  <p className="text-sm">No addresses added</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* add address section modal  */}
      {addressToggle && (
        <div
          onClick={() => setAddressToggle(false)}
          className="bg-gray-700 mt-3  pt-24 bg-opacity-50 fixed top-0 left-0 w-screen h-screen p-4 flex justify-center pb-8 lg:pb-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="py-5 scrollbar-hide-card bg-white rounded-lg h-full w-full sm:w-[60%] md:w-[50%] lg:w-[40%]   overflow-auto "
          >
            <div className="isolate relative bg-white px-3 rounded-lg">
              <div
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                aria-hidden="true"
              >
                <div
                  className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                />
              </div>
              <MdClose
                onClick={() => setAddressToggle(false)}
                size={22}
                className="absolute bg-black cursor-pointer rounded  hover:bg-blue-600 text-white right-4 top-0"
              />
              <form className="" onSubmit={addressSubmit}>
                <h4 className="mb-3 text-[1.2rem] text-blue-500 text-center font-semibold">
                  Add delivery Address
                </h4>
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block text-sm/6 font-semibold text-gray-900"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        id="name"
                        required
                        value={addressForm.name}
                        onChange={formHandleFunc}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-semibold text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={addressForm.email}
                        onChange={formHandleFunc}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                      />
                    </div>
                    <h5 className="mt-2 mb-0 text-sm text-gray-500">
                      Email will be used for order updates and delivery
                      communication.
                    </h5>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm/6 font-semibold text-gray-900"
                    >
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2.5">
                      <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                        <input
                          type="number"
                          name="phone"
                          required
                          id="phone"
                          value={addressForm.phone}
                          onChange={formHandleFunc}
                          className="block min-w-0 grow py-1.5 pl-3 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="state"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        required
                        placeholder="Enter state name"
                        value={addressForm.state}
                        onChange={formHandleFunc}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="district"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      District <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <input
                        id="district"
                        name="district"
                        type="text"
                        required
                        placeholder="Enter district name"
                        value={addressForm.district}
                        onChange={formHandleFunc}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="village"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Village <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <input
                        id="village"
                        name="village"
                        type="text"
                        required
                        placeholder="Enter village name"
                        value={addressForm.village}
                        onChange={formHandleFunc}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1  outline-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>

                    <div className="mt-3 text-red-500 flex justify-end">
                      <button
                        type="button"
                        className="p-1 rounded capitalize flex items-center gap-2 bg-blue-500 text-white"
                      >
                        <FaLocationDot /> use current location
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="street"
                      className="block text-sm/6 font-semibold text-gray-900"
                    >
                      Street Or Colony Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        name="street"
                        value={addressForm.street}
                        onChange={formHandleFunc}
                        id="street"
                        rows={2}
                        placeholder="Enter street or colony address"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postalCode"
                      className="block text-sm/6 font-semibold text-gray-900"
                    >
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2.5">
                      <div className="flex rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                        <input
                          type="number"
                          name="postalCode"
                          required
                          id="postalCode"
                          value={addressForm.postalCode}
                          onChange={formHandleFunc}
                          className="block min-w-0 grow py-1.5 pl-3 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                          placeholder="Enter postal code"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  {addressSpin ? (
                    <button className="w-full flex items-center justify-center gap-2 rounded-md bg-gray-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      <SmallLoading /> Adding Address..
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full  rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
