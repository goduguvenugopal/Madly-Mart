import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dataContext } from "../App";
import { PiShareNetwork } from "react-icons/pi";
import { FlipkartSpin, Loading, SmallLoading } from "./Loading";
import { FaMinus, FaPhone, FaPlus, FaTruck } from "react-icons/fa";
import { Slide, toast, ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Footer from "./Footer";
import { scrollToTop } from "./RouteHandler";
import { locations } from "./hardCodeData";
import axios from "axios";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import { Helmet } from "react-helmet";
import ProductReviewsForm from "./ProdutReviewsForm";
import { RiDiscountPercentFill } from "react-icons/ri";
import RecentlyViewedProducts from "./RecentlyViewedProducts";

const ProductOverView = () => {
  scrollToTop();
  const {
    products,
    token,
    api,
    cartItems,
    orderProducts,
    number,
    viewedProducts,
    setViewedProducts,
    setOrderProducts,
    setCartItems,
    defaultAddress,
    discount,
  } = useContext(dataContext);
  const { itemId } = useParams();
  const [product, setProduct] = useState({});
  const [itemImg, setItemImg] = useState("");
  const [itemWeight, setItemWeight] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [noServiceText, setNoServiceText] = useState("");
  const [areaName, setAreaName] = useState();
  const [zoomImg, setZoomImg] = useState("");
  const [dis, setDis] = useState(null);
  const navigate = useNavigate();
  const [cartSpin, setCartSpin] = useState(false);
  const initialData = {
    itemCategory: product?.itemCategory,
    itemCost: product?.itemCost,
    itemImage: product?.itemImage,
    itemName: product?.itemName,
    itemHalfKgCost: product?.itemHalfKgCost,
    itemKgCost: product?.itemKgCost,
    minOrderQty: product?.minOrderQty,
    itemQty: itemQty,
    itemSubCategory: product?.itemSubCategory,
    itemWeight: product?.itemWeight?.length > 0 ? itemWeight : null,
    _id: product?._id,
    orderType: orderType,
    days: days,
  };

  const [cart, setCart] = useState({
    productId: "",
    itemQty: "",
    totalAmount: "",
    products: [],
  });

  // when order type changes set to default value to all
  useEffect(() => {
    setDays(30);
    setItemQty(1);
    setItemWeight("250");
  }, [orderType]);

  // retrieving area name from localStorage
  useEffect(() => {
    const areaName = localStorage.getItem("areaName");
    if (areaName) {
      setAreaName(JSON.parse(areaName));
    }
  }, []);

  // related products filter function
  useEffect(() => {
    const results = products?.filter(
      (item) => item?.itemSubCategory === product?.itemSubCategory
    );
    if (results.length > 1) {
      setRelatedProducts(results);
    }
  }, [product, itemId]);

  // finding single product by id
  useEffect(() => {
    const results = products.find((item) => item._id === itemId);
    setProduct(results);
    if (results) {
      let updated = viewedProducts.filter((item) => item._id !== itemId);
      updated.unshift(results);
      updated = updated.slice(0, 8);
      localStorage.setItem("viewedProducts", JSON.stringify(updated));
      setViewedProducts(updated);
    }
  }, [products, itemId]);

  // item weight,cost and qty initial value function
  useEffect(() => {
    if (product && product?.itemWeight && product?.itemWeight.length > 0) {
      setItemWeight(product?.itemWeight[0]);
      setItemCost(product?.itemCost);
      setItemQty(1);
    } else {
      setItemCost(product?.itemCost);
      setItemQty(1);
    }
  }, [product]);

  // item weight and cost radio input handle function
  const weightSelectFunc = (weightParam) => {
    if (weightParam === "250") {
      setDis("");
      setItemWeight(weightParam);
      setItemCost(product?.itemCost);
    } else if (weightParam === "500") {
      setItemWeight(weightParam);
      setItemCost(product?.itemHalfKgCost);
    } else if (weightParam === "1000") {
      setItemWeight(weightParam);
      setItemCost(product?.itemKgCost);
    }
  };

  // item image initial value function
  useEffect(() => {
    if (product?.itemImage?.length > 0) {
      setItemImg(product?.itemImage[0]);
    }
  }, [product]);

  // share function
  const shareFunc = async () => {
    try {
      await navigator.share({
        title: `Check out ${product.itemName} on Madly Mart!`,
        text: `Hello! Welcome to Madly Mart! 🌸 Take a look at this product: "${product.itemName}"\n\nDescription: ${product.itemDescription}\nPrice: ₹${product.itemCost}\n\nDiscover more by clicking the link below:`,
        url: `https://www.madlymart.in/product_over_view/${itemId}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // searcing for area input handle function
  const areaInputHandleFunc = (e) => {
    const areaName = e.target.value;
    const results = locations.filter((item) =>
      item.toLowerCase().includes(areaName.toLowerCase())
    );
    setAreas(results);
    if (results.length > !0) {
      setAreaName("");
      setNoServiceText(
        "Door delivery service is currently not available at your location. We apologize for the inconvenience."
      );
      setAreas([]);
    }
  };

  const areaSelectFunc = (param) => {
    setNoServiceText("Door delivery service is available at your location.");
    setAreaName(param);
    localStorage.setItem("areaName", JSON.stringify(param));
    setAreas([]);
  };

  // order type select drop down handle func
  const orderTypeFunc = (event) => {
    const inputText = event.target.value;
    if (inputText === "subscription") {
      setOrderType(inputText);
    } else {
      setOrderType("buyonce");
    }
  };

  // updating cart object values when changes occured in dependencies
  useEffect(() => {
    setCart((prevCaart) => ({
      ...prevCaart,
      productId: product?._id,
      itemQty: itemQty,
      totalAmount:
        orderType === "subscription"
          ? parseFloat(days * itemCost - dis || 0).toFixed(2)
          : parseFloat(itemCost || 0).toFixed(2),
      products: [initialData],
    }));
  }, [
    product,
    itemId,
    products,
    itemCost,
    itemWeight,
    days,
    orderType,
    itemQty,
    dis,
  ]);

  // add to cart function
  const addToCartFunc = async () => {
    if (itemQty < parseInt(product.minOrderQty)) {
      toast.info(`Minimum order qty is ${product.minOrderQty}`, {
        className: "custom-toast",
      });
    } else if (defaultAddress.length > 0) {
      try {
        setCartSpin(true);
        const res = await axios.post(`${api}/api/cart/add-to-cart`, cart, {
          headers: {
            token: token,
          },
        });
        if (res) {
          fetchCartItems();
        }
      } catch (error) {
        console.error(error);
        setCartSpin(false);
        toast.error("Please try again", {
          className: "custom-toast",
        });
      }
    } else {
      toast.warning("Check door delivery service for your location.", {
        className: "custom-toast",
      });
    }
  };

  // fetching cart products
  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${api}/api/cart/get-user-cart-products`, {
        headers: {
          token: token,
        },
      });
      if (res) {
        setCartItems(res.data.retrievdProducts.reverse());
        toast.success("Item added to Cart", {
          className: "custom-toast",
        });
        setCartSpin(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // discount adding function based on weight and days
  useEffect(() => {
    if (days === 7) {
      if (itemWeight === "500" || itemWeight === "1000") {
        if (itemWeight === "500") {
          const halfDiscount = discount.sevenDays / 2;

          setDis(halfDiscount);
        } else {
          setDis(discount.sevenDays);
        }
      }
    } else if (days === 10) {
      if (itemWeight === "500" || itemWeight === "1000") {
        if (itemWeight === "500") {
          const halfDiscount = discount.tenDays / 2;

          setDis(halfDiscount);
        } else {
          setDis(discount.tenDays);
        }
      }
    } else if (days === 20) {
      if (itemWeight === "500" || itemWeight === "1000") {
        if (itemWeight === "500") {
          const halfDiscount = discount.twentyDays;

          setDis(halfDiscount);
        } else {
          setDis(discount.twentyDays);
        }
      }
    } else if (days === 30) {
      if (itemWeight === "500" || itemWeight === "1000") {
        if (itemWeight === "500") {
          const halfDiscount = discount.twentyDays;
          setDis(halfDiscount);
        } else {
          setDis(discount.thirtyDays);
        }
      }
    }
  }, [
    product,
    itemId,
    products,
    itemCost,
    itemWeight,
    days,
    orderType,
    itemQty,
    discount,
  ]);

  // order check out function
  const orderCheckOutFunc = () => {
    if (
      itemQty < parseInt(product.minOrderQty) 
     
    ) {
      toast.info(`Minimum order qty is ${product.minOrderQty}`, {
        className: "custom-toast",
      });
    } else if (defaultAddress.length > 0) {
      setOrderProducts([cart]);
      navigate("/order_check_out");
    } else {
      navigate("/profile");
    }
  };
  // Check if the product is still being retrieved or is empty
  if (!product || Object.keys(product).length === 0) {
    return <Loading />;
  }

  return (
    <>
      <ToastContainer
        position="bottom-center"
        draggable
        transition={Slide}
        theme="dark"
      />

      {/* adding product details dynamically to meta tags for seo */}
      <Helmet>
        <title>{`${product?.itemName
          ?.split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")} | Dora A to Z Fresh`}</title>

        <meta name="description" content={product?.itemDescription} />

        {/* Open Graph for Facebook and others */}
        <meta property="og:title" content={product?.itemName} />
        <meta property="og:description" content={product?.itemDescription} />
        <meta property="og:image" content={product?.itemImage[0]} />
        <meta
          property="og:url"
          content={`https://madlymart.in/product_over_view/${product._id}`}
        />
        <meta property="og:type" content="product" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product?.itemName} />
        <meta name="twitter:description" content={product?.itemDescription} />
        <meta name="twitter:image" content={product?.itemImage[0]} />
      </Helmet>

      <section className="text-gray-600 p-3 select-none mt-3 mb-7 pt-24">
        <div className="flex flex-row lg:pb-2 gap-2 lg:gap-0 gap-x-[3rem] lg:gap-x-0 lg:justify-around flex-wrap">
          {/* image section  */}
          <div className="relative flex flex-col gap-3 w-full sm:w-[48%]">
            <LazyLoadImage
              onClick={() => setZoomImg(itemImg)}
              alt="ecommerce"
              className=" w-full h-auto rounded-lg "
              src={itemImg}
              effect="blur"
            />
            <PiShareNetwork
              title="Share"
              onClick={shareFunc}
              className="absolute top-2 bg-black p-1 h-7 w-9 cursor-pointer  text-white rounded-full  right-2  "
            />
            <BiFullscreen
              onClick={() => setZoomImg(itemImg)}
              title="FullScreen"
              className="absolute top-[3rem] bg-black p-1 h-7 w-9 cursor-pointer  text-white rounded-full  right-2  "
            />
            <div className="flex gap-3 flex-wrap">
              {product?.itemImage?.map((item, index) => (
                <LazyLoadImage
                  effect="blur"
                  key={index}
                  src={item}
                  alt={product.itemName}
                  onClick={() => setItemImg(item)}
                  className="w-[5rem] h-[4rem] lg:w-32 lg:h-24 rounded-lg cursor-pointer hover:border-2 hover:border-blue-600"
                />
              ))}
            </div>
          </div>

          {/* FullScreen product image section  */}
          {zoomImg && (
            <div
              onClick={() => setZoomImg("")}
              className="w-screen h-screen py-2 flex flex-col items-center justify-center fixed top-0 left-0 bg-gray-600 z-50"
            >
              <div className="w-full lg:h-[100%] lg:w-[50%]  overflow-auto flex items-center justify-center scrollbar-hide-card">
                <img
                  onClick={(e) => e.stopPropagation()}
                  src={zoomImg}
                  alt="zoom-in-img"
                  className="w-full h-fit rounded-lg"
                />
              </div>
              <BiExitFullscreen
                onClick={() => setZoomImg("")}
                title="ExitFullScreen"
                className="fixed bottom-[2rem] lg:top-[2rem] bg-black p-1 h-9 w-9 cursor-pointer  text-white rounded-full right-[1rem] lg:right-[2rem]  "
              />
            </div>
          )}

          <hr className="border w-full sm:hidden border-gray-200 mt-3" />
          {/* item name and cost section  */}
          <div className="w-full sm:w-[40%] ">
            <div className="flex flex-col gap-3 mb-3 ">
              <span className="text-2xl lg:text-3xl capitalize font-medium ">
                {product.itemName}
              </span>
              <div className="flex gap-3 mb-1 items-center">
                {orderType === "subscription" ? (
                  <>
                    <span className="text-2xl text-gray-700 font-medium">
                      Rs.{" "}
                      {parseFloat(
                        (days * itemCost - dis) * itemQty || 0
                      ).toFixed(2)}
                    </span>

                    {dis ? (
                      <span className="text-md line-through text-red-700 font-medium">
                        Rs.{" "}
                        {parseFloat(days * itemCost * itemQty || 0).toFixed(2)}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-gray-700 font-medium">
                      Rs. {parseFloat(itemCost * itemQty || 0).toFixed(2)}
                    </span>
                    {itemWeight === "500" || itemWeight === "1000" ? null : (
                      <span
                        className={` text-md line-through text-red-700 font-medium ${
                          product.offerCost ? "block" : "hidden"
                        }`}
                      >
                        Rs.{" "}
                        {parseFloat(product.offerCost * itemQty || 0).toFixed(
                          2
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>
              {product.minOrderQty > 1 &&
                orderType === "buyonce" &&
                itemWeight === "250" && (
                  <div className="bg-orange-900 mb-2 text-sm text-white w-fit p-1 px-2 rounded ">
                    Minimum order qty {product.minOrderQty}
                  </div>
                )}

              {product.itemStock === "0" ? (
                <div className="bg-red-500 rounded px-2 p-1 text-white font-medium w-fit">
                  Sold out
                </div>
              ) : (
                <div className="bg-green-500 rounded px-2 p-1 text-white font-medium w-fit">
                  In Stock
                </div>
              )}
            </div>

            {/* discount section  */}
            {product.offerMessage && (
              <section className="py-3 flex items-center gap-2 flex-wrap">
                <button className="bg-gradient-to-r flex justify-between gap-2 items-center from-pink-500 via-red-500 to-yellow-500 text-white px-5 py-2 rounded-full font-semibold shadow-lg animate-bounce hover:scale-105 transition-transform duration-300">
                  <RiDiscountPercentFill size={21} /> Discount
                </button>

                <p className="text-green-600 font-bold">
                  {product.offerMessage}
                </p>
              </section>
            )}

            <hr className="border border-gray-200 mb-2 mt-2" />

            {/* rendering elements based on stock availability  */}
            {product.itemStock === "0" ? (
              <>
                {product.itemWeight.length > 0 && (
                  <div className="flex gap-1 mb-3 items-center pointer-events-none">
                    <span className="font-semibold text-nowrap">
                      Quantity :{" "}
                    </span>
                    <span className="text-lg font-semibold text-black">
                      {" "}
                      {itemWeight}
                      {product.itemSubCategory === "Milk" ? "ml" : "g"}
                    </span>
                  </div>
                )}
                <div className="flex gap-3 flex-wrap mb-3 pointer-events-none">
                  {product.itemWeight.map((item, index) => (
                    <div
                      onClick={() => weightSelectFunc(item)}
                      key={index}
                      className="border-2 border-green-700 py-1 hover:border-blue-600 px-4 rounded-full cursor-pointer font-semibold"
                    >
                      {item}
                      {product.itemSubCategory === "Milk" ? "ml" : "g"}
                    </div>
                  ))}
                </div>
                {/* item qty increment and decrement section when stock zero */}
                <div className="flex gap-1 mb-3 items-center pointer-events-none">
                  <span className="font-semibold text-nowrap">Quantity : </span>
                  <span className="text-lg font-semibold text-black">
                    {" "}
                    {itemQty}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap mb-3 pointer-events-none">
                  <div className="border-2 border-gray-500 py-2 hover:border-gray-800 px-4 rounded-full  font-semibold flex items-center gap-5">
                    <FaMinus
                      className={` text-lg hover:text-blue-600 ${
                        itemQty === 1
                          ? "pointer-events-none "
                          : "cursor-pointer"
                      }`}
                      onClick={() => setItemQty(itemQty - 1)}
                    />
                    <span>{itemQty}</span>
                    <FaPlus
                      className="cursor-pointer  text-lg hover:text-blue-600"
                      onClick={() => {
                        if (itemQty < parseInt(product.itemStock)) {
                          setItemQty(itemQty + 1);
                        } else {
                          toast.warning(`Maximum quantity limit ${itemQty}`, {
                            className: "custom-toast",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-start my-5 w-full">
                  <button className="w-full bg-gray-400 font-semibold text-white border-0 py-3 px-6 focus:outline-none pointer-events-none rounded-full">
                    Sold out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* from here the section will be render if stock is availble   */}
                {/* item weight quantity selection section  */}
                {product.itemWeight.length > 0 ? (
                  <>
                    {product.itemWeight.length > 0 && (
                      <div className="flex gap-1 mb-3 items-center">
                        <span className="font-semibold text-nowrap">
                          Quantity :{" "}
                        </span>
                        <span className="text-lg font-semibold text-black">
                          {" "}
                          {itemWeight}
                          {product.itemSubCategory === "Milk" ? "ml" : "g"}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-3 flex-wrap mb-5">
                      {product.itemWeight.map((item, index) => (
                        <div
                          onClick={() => weightSelectFunc(item)}
                          key={index}
                          className={`border-2  py-1  px-4 rounded-full cursor-pointer font-semibold ${
                            item == itemWeight
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-green-700"
                          }`}
                        >
                          {item}
                          {product.itemSubCategory === "Milk" ? "ml" : "g"}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  ""
                )}

                {/* item quantity increment and decrement section  */}
                <div className="flex gap-1 mb-3 items-center">
                  <span className="font-semibold text-nowrap">Quantity : </span>
                  <span className="text-lg font-semibold text-black">
                    {" "}
                    {itemQty}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap mb-5">
                  <div className="border-2 border-gray-500 py-2 hover:border-gray-800 px-4 rounded-full  font-semibold flex items-center gap-5">
                    <FaMinus
                      className={` text-lg hover:text-blue-600 ${
                        itemQty === 1
                          ? "pointer-events-none "
                          : "cursor-pointer"
                      }`}
                      onClick={() => setItemQty(itemQty - 1)}
                    />
                    <span>{itemQty}</span>
                    <FaPlus
                      className="cursor-pointer  text-lg hover:text-blue-600"
                      onClick={() => {
                        if (itemQty < parseInt(product.itemStock)) {
                          setItemQty(itemQty + 1);
                        } else {
                          toast.warning(
                            `Contact us for larger quantity orders.`,
                            {
                              className: "custom-toast",
                            }
                          );
                        }
                      }}
                    />
                  </div>
                </div>
                {itemQty === parseInt(product.itemStock) && (
                  <div className="mb-5 text-blue-600 flex items-center flex-wrap gap-2">
                    <span className="text-gray-500">
                      Contact us for larger quantity orders
                    </span>{" "}
                    <a
                      href={`tel:+91${number}`}
                      className="underline flex items-center gap-2 "
                    >
                      <FaPhone />
                      {number}
                    </a>
                  </div>
                )}

                {/* order type and suscription section */}

                {product.itemSubCategory === "Milk" ||
                product.itemSubCategory === "Curd" ? (
                  <>
                    <div className="flex gap-1 mb-3 items-center">
                      <span className="font-semibold text-nowrap">
                        Order Type :{" "}
                      </span>
                      <select
                        onChange={orderTypeFunc}
                        className="py-1 outline-none border-2 rounded  border-orange-600 focus:border-blue-500"
                      >
                        <option value="" disabled>
                          Select Order Type
                        </option>
                        <option value="buyonce">Buy Once</option>
                        <option value="subscription">Subscription</option>
                      </select>
                    </div>
                    {orderType === "buyonce" &&
                    discount.deliveryCharges === 0 ? (
                      <h5 className="font-semibold my-4 flex items-center gap-2 text-green-600">
                        <FaTruck className="text-blue-500" /> Delivery charges
                        free
                      </h5>
                    ) : (
                      <>
                        {orderType === "buyonce" && (
                          <h5 className="font-semibold my-4 flex items-center gap-2">
                            <FaTruck className="text-blue-500" /> Delivery
                            charges apply at checkout
                          </h5>
                        )}
                      </>
                    )}

                    {orderType === "buyonce" && (
                      <h5 className="font-semibold my-4 flex items-center gap-2">
                        <FaTruck className="text-black" />
                        Delivery in 45 minutes.
                      </h5>
                    )}

                    {orderType === "subscription" && (
                      <>
                        <div className="flex gap-1 mb-3 items-center">
                          <span className="font-semibold text-nowrap">
                            Days :{" "}
                          </span>
                          <span className="text-lg font-semibold text-black">
                            {days} days
                          </span>
                        </div>
                        <div className="flex gap-3 flex-wrap mb-5">
                          <div className="text-center">
                            <div
                              onClick={() => setDays(30)}
                              className="border-2 flex items-center justify-center border-green-700  h-9 hover:border-blue-600 px-4 rounded-full cursor-pointer font-semibold"
                            >
                              30 days
                            </div>
                          </div>
                        </div>
                        <h5 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                          <FaTruck className="text-blue-500" /> free delivery on
                          all subscription orders.
                        </h5>
                        <p className="text-gray-500 mb-3 ">
                          Subscription orders are delivered daily at 6 AM to 8
                          AM and 6 PM to 8 AM{" "}
                        </p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {discount?.deliveryCharges === 0 ? (
                      <h5 className="font-semibold my-4 flex items-center gap-2 text-green-600">
                        <FaTruck className="text-blue-500" /> Delivery charges
                        free
                      </h5>
                    ) : (
                      <h5 className="font-semibold my-4 flex items-center gap-2">
                        <FaTruck className="text-blue-500" /> Delivery charges
                        apply at checkout
                      </h5>
                    )}
                    <h5 className="font-semibold my-4 flex items-center gap-2">
                      <FaTruck className="text-black" />
                      Delivery in 45 minutes.
                    </h5>
                  </>
                )}

                {/* checking delivery service to address  */}

                <div>
                  <h6 className="font-bold">
                    Note :{" "}
                    <span className="font-normal">
                      Check door delivery service for your location.
                    </span>
                  </h6>
                  <div className="mt-4 relative">
                    <input
                      onChange={areaInputHandleFunc}
                      type="text"
                      className="rounded w-full border-2 border-blue-500 py-[0.4rem] outline-none focus:border-orange-600 pl-3 "
                      placeholder="Enter your location check delivery availability."
                    />
                    {areas.length > 0 ? (
                      <div className="border-2 absolute top-10 left-0 bg-white z-10 mt-[0.2rem] flex flex-col outline-none border-blue-500 rounded-lg p-2 px-1 w-full">
                        {areas.map((item, index) => (
                          <span
                            onClick={() => areaSelectFunc(item)}
                            className="hover:bg-blue-600 hover:text-white cursor-pointer rounded p-1 px-2"
                            key={index}
                            value={item}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p
                          className={`${
                            areaName ? "text-green-600" : "text-red-700"
                          }`}
                        >
                          {noServiceText}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* add to cart button  */}
                <div className="flex gap-3 justify-start flex-wrap lg:flex-nowrap my-5 w-full">
                  {token ? (
                    <>
                      {cartSpin ? (
                        <FlipkartSpin />
                      ) : (
                        <>
                          {cartItems?.some(
                            (item) => item.productId === product?._id
                          ) ? (
                            <Link
                              to="/cart"
                              className="w-full text-center bg-orange-900 font-semibold text-white border-0 py-3 px-6 focus:outline-none hover:bg-orange-700 rounded-full"
                            >
                              Go to cart
                            </Link>
                          ) : (
                            <button
                              onClick={addToCartFunc}
                              className="w-full bg-blue-800  font-semibold text-white border-0 py-3 px-6 focus:outline-none hover:bg-indigo-600 rounded-full"
                            >
                              Add to cart
                            </button>
                          )}
                        </>
                      )}

                      <div
                        onClick={orderCheckOutFunc}
                        className="w-full text-center cursor-pointer bg-yellow-300 font-semibold text-black border-0 py-3 px-6 focus:outline-none hover:bg-yellow-400 rounded-full"
                      >
                        Buy now
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="w-full text-center bg-blue-800 font-semibold text-white border-0 py-3 px-6 focus:outline-none hover:bg-indigo-600 rounded-full"
                      >
                        Add to cart
                      </Link>
                      <Link
                        to="/login"
                        className="w-full text-center bg-yellow-300 font-semibold text-black border-0 py-3 px-6 focus:outline-none hover:bg-yellow-400 rounded-full"
                      >
                        Buy now
                      </Link>
                    </>
                  )}
                </div>

                {/* add address section  */}
                {defaultAddress.length > 0 ? (
                  <div className="mb-3 py-3 capitalize flex items-center gap-2 justify-between w-full ">
                    <div className="w-[60%]  ">
                      <h5 className="text-sm font-medium text-black">
                        Delivery to :{" "}
                        <span className="text-gray-600">
                          {defaultAddress[0]?.name},{" "}
                          {defaultAddress[0]?.postalCode},{" "}
                          {defaultAddress[0]?.village},{" "}
                          {defaultAddress[0]?.district},{" "}
                          {defaultAddress[0]?.street.substring(0, 35)}...
                        </span>
                      </h5>
                    </div>

                    <div className="w-[30%]  ">
                      {defaultAddress.length > 0 ? (
                        <Link
                          to="/profile"
                          className="font-semibold text-sm block p-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-[7rem] text-center text-white"
                        >
                          Change
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          className="font-semibold text-sm block  p-1 bg-blue-600 hover:bg-blue-500 rounded-full   border-none w-full text-center text-white"
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
            )}
          </div>

          {/* Description section  */}
        </div>
        {product.itemDescription && (
          <div className="lg:px-9">
            <hr className="border  border-gray-200 mb-2 lg:mt-5" />
            <h5 className="font-bold text-lg mb-2">Description</h5>
            <p className="font-serif">{product.itemDescription}</p>
          </div>
        )}

        {/* review component  */}

        {/* related products section  */}
        {relatedProducts.length > 1 && (
          <div className="mt-10 lg:px-9">
            <h5 className="text-2xl font-medium text-black">
              Related Products
            </h5>
            <hr className="border border-gray-200 mb-5 mt-3 lg:mt-3" />

            <div className="mt-4 grid grid-cols-2 gap-y-6 gap-x-5 md:gap-y-7 lg:gap-y-6  md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {relatedProducts.map((item) => (
                <Link
                  to={`/product_over_view/${item._id}`}
                  key={item._id}
                  className="group  w-full h-full  md:w-52   lg:w-72  relative  hover:opacity-85"
                >
                  <div>
                    <LazyLoadImage
                      src={item.itemImage[0]}
                      alt={item.itemName}
                      effect="blur"
                      className="h-fit w-full rounded-lg"
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <h3 className="text-[0.9rem] capitalize lg:text-[1rem] font-bold text-black">
                      {item?.itemName?.substring(0, 18)}..
                    </h3>
                    <span className="text-md text-gray-900">
                      Rs. {parseFloat(item?.itemCost || 0).toFixed(2)}
                    </span>
                  </div>
                  {item.itemStock === "0" && (
                    <div className="absolute top-2 h-7 flex items-center justify-center  text-sm left-2 rounded px-2 bg-black text-white">
                      <span>Sold out</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      {/* recently viewed products component  */}
      <RecentlyViewedProducts />
      {/* product review form component  */}
      <ProductReviewsForm itemId={itemId} />

      <Footer />
    </>
  );
};

export default ProductOverView;
