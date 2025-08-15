import React, { useContext } from "react";
import { EnvContext, ProductsContext, UserContext } from "../../App";

const useEmailTemplate = ({totalAmount}) => {
  const { defaultAddress } = useContext(UserContext);
  const { orderProducts } = useContext(ProductsContext);
  const { number } = useContext(EnvContext);

 const emailData = {
  email: `${defaultAddress[0]?.email}, madlymart@gmail.com`,
  subject: "Madly Mart - Order Placed Successfully",
  html: `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <!-- Header -->
    <div style="background-color: #ff6600; padding: 20px; color: white; text-align: center;">
      <h1 style="margin: 0;">Madly Mart</h1>
      <p style="margin: 0;">Order Confirmation</p>
    </div>

    <!-- Greeting -->
    <div style="padding: 20px;">
      <p>Dear <strong>${defaultAddress[0]?.name}</strong>,</p>
      <p>Thank you for your order! Below are your order and shipping details.</p>
    </div>

    <!-- Shipping Address -->
    <div style="padding: 0 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Shipping Address</h3>
      <p><strong>City:</strong> ${defaultAddress[0]?.district}</p>
      <p><strong>Phone:</strong> ${defaultAddress[0]?.phone}</p>
      <p><strong>Address:</strong> ${defaultAddress[0]?.street}, ${defaultAddress[0]?.village}, ${defaultAddress[0]?.postalCode}</p>
      <p><strong>State:</strong> ${defaultAddress[0]?.state}</p>
    </div>

    <!-- Product Details -->
    <div style="padding: 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Product Details</h3>
      ${orderProducts.map(item => `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #ddd;">
          <tr>
            <td style="width: 120px; padding: 10px;">
              <img src="${item?.products[0]?.itemImage[0]?.image}" alt="${item?.products[0]?.itemName}" style="width: 100px; height: auto; border-radius: 4px;" />
            </td>
            <td style="padding: 10px; vertical-align: top;">
              <p style="margin: 0; font-weight: bold;">${item?.products[0]?.itemName}</p>
              <p style="margin: 4px 0;"><strong>Price:</strong> Rs. ${item.products[0].price}</p>
              <p style="margin: 4px 0;"><strong>Quantity:</strong> ${item.itemQty}</p>
              <p style="margin: 4px 0;"><strong>Weight:</strong> ${item.products[0].weight}</p>
            </td>
          </tr>
        </table>
      `).join("")}
    </div>

    <!-- Payment Summary -->
    <div style="padding: 20px; background: #f9f9f9;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Payment Details</h3>
      <p><strong>Payment Status:</strong> Paid</p>
      <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
      <p><strong>Total Items:</strong> ${orderProducts.length}</p>
    </div>

    <!-- Company Info -->
    <div style="padding: 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Madly Mart Contact</h3>
      <p><strong>Mobile:</strong> <a href="tel:+91${number}">${number}</a></p>
      <p><strong>Address:</strong> Noori Majid Opposite, Pathabazar, Gopalpet Road, Wanaparthy 509103</p>
      <p><strong>Email:</strong> madlymart@gmail.com</p>
      <p><strong>Google Map Location:</strong> <a href="https://maps.app.goo.gl/YmA4dbsdDkvRfr6t5">View Location</a></p>
    </div>

    <!-- Footer -->
    <div style="background-color: #ff6600; padding: 15px; text-align: center; color: white;">
      <p style="margin: 0;">Thank you for shopping with Madly Mart!</p>
      <p style="margin: 5px 0;"><a href="https://madlymart.in" style="color: white; text-decoration: underline;">Continue Shopping</a></p>
    </div>
  </div>
  `
};


  return emailData;
};

export default useEmailTemplate;
