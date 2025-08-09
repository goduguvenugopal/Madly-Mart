import React, { Component, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


export const RouteHandler = (cartItems) => {
  const location = useLocation();


  useEffect(() => {

    // Set document title based on the current route
    switch (location.pathname) {
      case '/':
        document.title = 'Madly Mart';
        break;
      case '/search':
        document.title = 'Search for products';
        break;
      case '/login':
        document.title = 'Secure Email Login & Continue Shopping';
        break;
      case '/contact':
        document.title = 'Contact Us for Any Delivery Queries';
        break;
      case '/cart':
        document.title = `My Cart (${cartItems.length} items)`;
        break;
      case '/profile':
        document.title = 'My Profile';
        break;
      case '/order_check_out':
        document.title = 'Order Summary & Payment';
        break;
      case '/orders':
        document.title = 'My Orders';
        break;
      case '/contact':
        document.title = 'Contact Us for Any Delivery Queries';
        break;
      case '*':
        document.title = '404 - Page Not Found ';
        break;

    }
  }, [location]);

  return null;
};

// scroll to top custom Component 
export const scrollToTop = () => {
  const location = useLocation()
  // Scroll to the top when the route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  return null
}
