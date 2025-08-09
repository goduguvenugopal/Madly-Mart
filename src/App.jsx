import React, { useState, createContext, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./assets/Navbar";
import PageNotFound from "./assets/components/PageNotFound";
import Home from "./assets/Home";
import Cart from "./assets/Cart";
import ContactUs from "./assets/ContactUs";
import { RouteHandler } from "./assets/RouteHandler";
import Search from "./assets/Search";
import axios from "axios";
import Profile from "./assets/components/Profile";
import { Loading } from "./assets/Loading";
import AllProducts from "./assets/AllProducts";
import ProductOverView from "./assets/ProductOverView";
import "react-lazy-load-image-component/src/effects/blur.css";
import Orders from "./assets/Orders";
import Login from "./assets/Login";
import OrderCheckOut from "./assets/OrderCheckOut";
import OrderOverView from "./assets/OrderOverView";
import ProdutReviewsForm from "./assets/ProdutReviewsForm";

export const dataContext = createContext();

function App() {
  const [token, setToken] = useState("");
  const api = import.meta.env.VITE_API;
  const reviews_api = import.meta.env.VITE_REVIEWS_API;
  const number = import.meta.env.VITE_NUMBER;
  const analytics_api = import.meta.env.VITE_ANALYTICS_API;
  const [carousel, setCarousel] = useState({});
  const [products, setProducts] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({});
  const [defaultAddress, setDefaultAddress] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState({});
  const [orderProducts, setOrderProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  RouteHandler(cartItems);
  const todayDate = new Date().toLocaleDateString("en-GB");

  //  Daily Unique Visitors Tracker
  useEffect(() => {
    const sendVisitorId = async (visitorId) => {
      try {
        const res = await axios.post(`${analytics_api}/analytics/api/visit`, {
          visitorId,
        });
        if (res) {
          localStorage.setItem("todayDate", JSON.stringify(todayDate));
        }
      } catch (error) {
        console.error("Error sending visitor ID:", error);
      }
    };

    const visitorId = localStorage.getItem("visitorId");
    const storedDate = localStorage.getItem("todayDate");

    if (!visitorId && !storedDate) {
      const randomVisitorId = crypto.randomUUID();
      localStorage.setItem("todayDate", JSON.stringify(todayDate));
      localStorage.setItem("visitorId", JSON.stringify(randomVisitorId));
      sendVisitorId(randomVisitorId);
    } else {
      const parsedDate = JSON.parse(storedDate);
      if (parsedDate !== todayDate) {
        const parsedId = JSON.parse(visitorId);
        sendVisitorId(parsedId);
      }
    }
  }, []);

  useEffect(() => {
    // retrieving token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setToken(JSON.parse(token));
    }
    // retrieving address from localStorage
    const address = localStorage.getItem("address");
    if (address) {
      setDefaultAddress(JSON.parse(address));
    }

    // retrieving user details
    const userDetails = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(userDetails));
    }

    // retrieving reviewed products from session storage
    const isViewdedProducts = localStorage.getItem("viewedProducts");
    if (isViewdedProducts) {
      setViewedProducts(JSON.parse(isViewdedProducts));
    }
  }, []);

  useEffect(() => {
    // fetching user details
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${api}/user/get-single-user`, {
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
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          localStorage.removeItem("token");
          localStorage.removeItem("address");
          localStorage.removeItem("user");
          setToken("");
          setDefaultAddress([]);
          setUser({});
        }
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  useEffect(() => {
    // fetching all products
    const fetchProducts = async () => {
      try {
        
        const res = await axios.get(`${api}/product/get-all-products`);
        if (res) {
          setProducts(res.data.retrievdProducts.reverse());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();

    // fetching carousel
    const getCarousel = async () => {
      try {
        const res = await axios.get(`${api}/carousel/get-carousel`);
        if (res) {
          setCarousel(res.data.retrievedCarousel[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getCarousel();

    // fetching all categories
    const fetchAllCategories = async () => {
      try {
        const res = await axios.get(`${api}/category/get-category-products`);
        if (res) {
          setCategories(res.data.retrievedProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllCategories();

    // fetching discount function
    const fetchDiscount = async () => {
      try {
        const res = await axios.get(`${api}/offer/get-offer`);
        if (res) {
          setDiscount(res.data.offers[0]);
          setSpinner(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDiscount();
  }, []);

  useEffect(() => {
    // fetching cart products
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`${api}/cart/get-user-cart-products`, {
          headers: {
            token: token,
          },
        });
        if (res) {
          setCartItems(res.data.retrievdProducts.reverse());
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [token]);

  if (spinner) {
    return <Loading />;
  }

  return (
    // useContext provider wrapped to child components for state management
    <dataContext.Provider
      value={{
        api,
        reviews_api,
        number,
        carousel,
        setCarousel,
        products,
        setProducts,
        categories,
        setCategories,
        token,
        setToken,
        user,
        setUser,
        defaultAddress,
        setDefaultAddress,
        cartItems,
        setCartItems,
        discount,
        setDiscount,
        orderProducts,
        setOrderProducts,
        orders,
        setOrders,
        viewedProducts,
        setViewedProducts,
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products_by_category/:category"
          element={<AllProducts />}
        />
        <Route
          path="/product_over_view/:itemId"
          element={<ProductOverView />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/reviewform" element={<ProdutReviewsForm />} />
        <Route path="/search" element={<Search />} />
        <Route path="/order_check_out" element={<OrderCheckOut />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/orders/order_over_view/:orderId"
          element={<OrderOverView />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </dataContext.Provider>
  );
}

export default App;
