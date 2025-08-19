import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CartContext, EnvContext, ProductsContext, UserContext } from "../App";
import { PiShareNetwork } from "react-icons/pi";
import { FlipkartSpin, Loading } from "./Loading";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Slide, toast, ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Footer from "./components/Footer";
import { scrollToTop } from "./utilis/RouteHandler";
import axios from "axios";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import ProductReviewsForm from "./ProdutReviewsForm";
import { RiDiscountPercentFill } from "react-icons/ri";
import RecentlyViewedProducts from "./components/RecentlyViewedProducts";
import HelmetComponent from "./components/HelmetComponent";
import DefaultAddress from "./components/DefaultAddress";
import RelatedProducts from "./components/RelatedProducts";
import ProductVariants from "./utilis/ProductVariants";
import useEmptyPaymentPayload from "./utilis/useEmptyPaymentPayload";

const ProductOverView = () => {
  scrollToTop();
  const { products, viewedProducts, setViewedProducts, setOrderProducts } =
    useContext(ProductsContext);
  const { number, api } = useContext(EnvContext);
  const { cartItems, setCartItems, discount } = useContext(CartContext);
  const { defaultAddress, token } = useContext(UserContext);
  const { itemId } = useParams();
  const [product, setProduct] = useState({});
  const [itemImg, setItemImg] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [size, setSize] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [stock, setStock] = useState(0);
  const [itemQty, setItemQty] = useState(1);
  const [originalCost, setOriginalCost] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [zoomImg, setZoomImg] = useState("");
  const navigate = useNavigate();
  const [cartSpin, setCartSpin] = useState(false);
  const initialData = {
    itemCategory: product?.itemCategory,
    itemCost: product?.itemCost,
    itemImage: product?.itemImage,
    itemName: product?.itemName,
    minOrderQty: product?.minOrderQty,
    itemQty: itemQty,
    itemSubCategory: product?.itemSubCategory,
    _id: product?._id,
  };

  const [cart, setCart] = useState({
    productId: "",
    itemQty: "",
    totalAmount: "",
    color: "",
    capacity: "",
    weight: "",
    size: "",
    stock: 0,
    products: [],
  });

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

  // item weight,cost and qty etc.. initial values
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setWeight(product?.variants[0]?.weight);
      setItemCost(product?.variants[0]?.sellingCost || product?.itemCost);
      setCapacity(product?.variants[0]?.capacity);
      setSize(product?.variants[0]?.size);
      setItemQty(1);
      setColor(product?.variants[0]?.color);
      setStock(product?.variants[0]?.stock);
      setOriginalCost(product?.variants[0]?.originalCost || product?.offerCost);
    } else {
      setItemCost(product?.itemCost);
      setItemQty(1);
      setOriginalCost(product?.offerCost);
      setStock(products?.itemStock);
    }
  }, [product]);

  // item image initial value function
  useEffect(() => {
    if (product?.itemImage?.length > 0) {
      setItemImg(product?.itemImage[0]?.image);
    }
  }, [product]);

  // share function
  const shareFunc = async () => {
    try {
      await navigator.share({
        title: `Check out ${product.itemName} on Madly Mart!`,
        text: `Hello! Welcome to Madly Mart! ⚡ Take a look at this product: "${product.itemName}"\n\nDescription: ${product.itemDescription}\nPrice: ₹${product.itemCost}\n\nDiscover more by clicking the link below:`,
        url: `https://www.madlymart.in/product_over_view/${itemId}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // updating cart object values when changes occured in dependencies
  useEffect(() => {
    setCart((prevCaart) => ({
      ...prevCaart,
      productId: product?._id,
      itemQty: itemQty,
      totalAmount: itemCost,
      color: color,
      capacity: capacity,
      weight: weight,
      stock: stock,
      size: size,
      products: [initialData],
    }));
  }, [
    product,
    itemId,
    products,
    itemCost,
    itemQty,
    color,
    weight,
    stock,
    size,
    capacity,
  ]);

 

  // add to cart function
  const addToCartFunc = async () => {
    if (itemQty < parseInt(product.minOrderQty)) {
      toast.info(`Minimum order qty is ${product.minOrderQty}`, {
        className: "custom-toast",
        autoClose: 2000,
      });
    } else {
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
          autoClose: 2000,
        });
      }
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
          autoClose: 2000,
        });
        setCartSpin(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // order check out function
  const orderCheckOutFunc = () => {
    if (itemQty < parseInt(product.minOrderQty)) {
      toast.info(`Minimum order qty is ${product.minOrderQty}`, {
        className: "custom-toast",
        autoClose: 2000,
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
        closeOnClick
        autoClose={2000}
        hideProgressBar={false}
        transition={Slide}
        theme="dark"
      />

      {/* helmet tag for seo  */}
      <HelmetComponent product={product} />
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
            {/* mapping list of product images  */}
            <div className="w-full overflow-x-auto scrollbar-hide-card">
              <div className="flex flex-row gap-3 w-fit flex-nowrap ">
                {product?.itemImage?.map((item) => (
                  <div
                    onClick={() => setItemImg(item.image)}
                    key={item._id}
                    className="w-[5rem] h-fit lg:w-32 "
                  >
                    <LazyLoadImage
                      effect="blur"
                      src={item.image}
                      alt={product.itemName}
                      className={`w-full rounded-lg cursor-pointer hover:border-2 hover:border-blue-600 ${
                        itemImg === item.image ? "border-2 border-blue-600" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* FullScreen product image section  */}
          {zoomImg && (
            <div
              onClick={() => setZoomImg("")}
              className="w-screen h-screen py-2 flex flex-col items-center justify-center fixed top-0 left-0 bg-white z-50"
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

          {/* product name section  */}
          <div className="w-full sm:w-[40%] ">
            <div className="flex flex-col gap-3 mb-3 ">
              <span className="text-2xl lg:text-3xl capitalize font-medium ">
                {product.itemName}
              </span>

              {/* cost section  */}
              <div className="flex gap-3 mb-1 items-center">
                <>
                  <span className="text-2xl text-gray-700 font-medium">
                    Rs. {parseFloat(itemCost * itemQty || 0).toFixed(2)}
                  </span>
                  {originalCost && (
                    <span className="text-md line-through text-red-700 font-medium">
                      Rs. {parseFloat(originalCost * itemQty || 0).toFixed(2)}
                    </span>
                  )}
                </>
              </div>

              {/* minimum order card section render based on condition  */}
              {product.minOrderQty > 1 && (
                <div className="bg-orange-900 mb-2 text-sm text-white w-fit p-1 px-2 rounded ">
                  Minimum order qty {product.minOrderQty}
                </div>
              )}

              {/* stock status button  */}
              {product.itemStock === "0" || stock === 0 ? (
                <div className="bg-red-500 animate-pulse rounded-full px-2 p-1 text-white font-medium w-fit">
                  Sold out
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <div className="bg-green-500 animate-pulse rounded-full px-2 p-1 text-white font-medium w-fit">
                    In Stock
                  </div>
                  {product?.itemStock < 6 && (
                    <button className=" bg-red-400 rounded text-[14px] text-white px-[3px] w-fit border ">
                      Left {product?.itemStock}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* discount and offer text and button section*/}
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
            {/* variants section component */}
            <ProductVariants
              product={product}
              color={color}
              setColor={setColor}
              weight={weight}
              setWeight={setWeight}
              capacity={capacity}
              setCapacity={setCapacity}
              size={size}
              setSize={setSize}
              stock={stock}
              setStock={setStock}
              itemCost={itemCost}
              setItemCost={setItemCost}
              originalCost={originalCost}
              setOriginalCost={setOriginalCost}
            />

            {/* product qty increment and decrement section  */}
            <div className="flex gap-1 mb-3 items-center">
              <span className="font-semibold text-nowrap">Quantity : </span>
              <span className="text-lg font-semibold text-black">
                {itemQty}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap mb-5">
              <div className="border-2 border-gray-500 py-2 hover:border-gray-800 px-4 rounded-full  font-semibold flex items-center gap-5">
                <FaMinus
                  className={` text-lg hover:text-blue-600 ${
                    itemQty === 1 ? "pointer-events-none " : "cursor-pointer"
                  }`}
                  onClick={() => setItemQty(itemQty - 1)}
                />
                <span>{itemQty}</span>
                <FaPlus
                  className="cursor-pointer  text-lg hover:text-blue-600"
                  onClick={() => {
                    if (itemQty < stock) {
                      setItemQty(itemQty + 1);
                    } else if (itemQty < parseInt(product.itemStock)) {
                      setItemQty(itemQty + 1);
                    } else {
                      toast.warning(`Contact us for larger quantity orders.`, {
                        className: "custom-toast",
                        autoClose: 2000,
                      });
                    }
                  }}
                />
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
                          className={`w-full bg-blue-800  font-semibold text-white border-0 py-3 px-6 focus:outline-none hover:bg-indigo-600 rounded-full ${
                            product.itemStock === "" ||
                            product.itemStock === "0" ||
                            stock <= 0
                              ? "bg-gray-400 pointer-events-none"
                              : ""
                          }`}
                        >
                          Add to cart
                        </button>
                      )}
                    </>
                  )}

                  {/* buy now button  */}
                  <div
                    onClick={orderCheckOutFunc}
                    className={`w-full text-center cursor-pointer font-semibold text-white border-0 py-3 px-6 focus:outline-none hover:bg-yellow-500 rounded-full ${
                      product.itemStock === "" ||
                      product.itemStock === "0" ||
                      stock <= 0
                        ? "bg-gray-400 pointer-events-none"
                        : "bg-yellow-400  "
                    }`}
                  >
                    {product.itemStock === "" ||
                    product.itemStock === "0" ||
                    stock <= 0
                      ? "Sold Out"
                      : "Buy now"}
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

            {/* add address component*/}
            <DefaultAddress />
          </div>
        </div>

        {/* Description section  */}

        {product?.itemDescription && (
          <div className="lg:px-9">
            <hr className="border  border-gray-200 mb-2 lg:mt-5" />
            <h5 className="font-bold text-lg mb-2">Description</h5>
            <p className="font-serif ">{product.itemDescription}</p>

            {/* decription points  */}
            <ul className="mt-4 pl-4">
              {product?.descriptionPoints?.map((points, index) => (
                <li className="list-disc mt-2" key={index}>
                  {points}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* related products section  */}
        <RelatedProducts relatedProducts={relatedProducts} />
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
