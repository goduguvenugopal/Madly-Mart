import React, { useContext } from "react";
import { EnvContext, OrderContext } from "../../App";

const useEmailTemplate = ({ totalAmount, paymentResponse }) => {
  const { number } = useContext(EnvContext);
  const {orderedItems , orderedAddress, paymentDetails} = useContext(OrderContext)

  // success payment email confirmation

  const emailData = {
    email: `${orderedAddress[0]?.email}, madlymart@gmail.com`,
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
        <h2>Payment Successful ✅</h2>
      <p>Dear <strong>${orderedAddress[0]?.name}</strong>,</p>
       <p>Your payment has been received successfully for <b>Order ID: ${
         paymentDetails?.mongoOrderId
       }</b>.</p>
      <p>Thank you for your order! Below are your order and shipping details.</p>
    </div>

    <!-- Shipping Address -->
    <div style="padding: 0 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Shipping Address</h3>
      <p><strong>City:</strong> ${orderedAddress[0]?.district}</p>
      <p><strong>Phone:</strong> ${orderedAddress[0]?.phone}</p>
      <p><strong>Address:</strong> ${orderedAddress[0]?.street}, ${
      orderedAddress[0]?.village
    }, ${orderedAddress[0]?.postalCode}</p>
      <p><strong>State:</strong> ${orderedAddress[0]?.state}</p>
    </div>

    <!-- Product Details -->
    <div style="padding: 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Product Details</h3>
      ${orderedItems
        .map(
          (item) => `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #ddd;">
          <tr>
            <td style="width: 120px; padding: 10px;">
              <img src="${item?.products[0]?.itemImage[0]?.image}" alt="${item?.products[0]?.itemName}" style="width: 100px; height: auto; border-radius: 4px;" />
            </td>
            <td style="padding: 10px; vertical-align: top;">
              <p style="margin: 0; font-weight: bold;">${item?.products[0]?.itemName}</p>
              <p style="margin: 4px 0;"><strong>Price:</strong> Rs. ${item.products[0]?.itemCost}</p>
              ${item.weight && `<p style="margin: 4px 0;"><strong>Weight:</strong> ${item.weight}</p>`}
             ${item.size && `<p style="margin: 4px 0;"><strong>Size:</strong> ${item.size}</p>`}
              ${item.capacity && `<p style="margin: 4px 0;"><strong>Capacity:</strong> ${item.capacity}</p>`}
              ${item.color && `<p style="margin: 4px 0;"><strong>Color:</strong> ${item.color}</p>`}
              <p style="margin: 4px 0;"><strong>Quantity:</strong> ${item.itemQty}</p>

            </td>
          </tr>
        </table>
      `
        )
        .join("")}
    </div>

    <!-- Payment Summary -->
    <div style="padding: 20px; background: #f9f9f9;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Payment Details</h3>
      <p><strong>Payment Status:</strong> Paid</p>
      <p><strong>Total Amount:</strong> Rs. ${totalAmount}</p>
      <p><strong>Total Items:</strong> ${orderedItems.length}</p>
    </div>

    <!-- Company Info -->
    <div style="padding: 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Madly Mart Contact</h3>
      <p><strong>Mobile:</strong> <a href="tel:+91${number}">${number}</a></p>
      <p><strong>Address: </strong>Hyderabad , Telangana , India.</p>
      <p><strong>Email:</strong> madlymart@gmail.com</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #ff6600; padding: 15px; text-align: center; color: white;">
      <p style="margin: 0;">Thank you for shopping with Madly Mart!</p>
      <p style="margin: 5px 0;"><a href="https://madlymart.in" style="color: white; text-decoration: underline;">Continue Shopping</a></p>
    </div>
  </div>
  `,
  };

  // failed payment email confirmation
  const failedEmailData = {
    email: `${orderedAddress?.email},madlymart@gmail.com`,
    subject: `Payment Failed - Order ${paymentDetails?.mongoOrderId}`,
    html: `
    <h2>Payment Failed</h2>
    <p>Dear Customer,</p>
    <p>Unfortunately, your payment for <b>Order ID: ${paymentDetails?.mongoOrderId}</b> could not be completed.</p>
    <p><strong>Total Amount:</strong> Rs. ${paymentResponse?.totalAmount}</p>
    <h3>Details:</h3>
    <ul>
      <li><b>Payment ID:</b> ${paymentResponse?.paymentId}</li>
      <li><b>Reason:</b> ${paymentResponse?.error?.reason}</li>
    </ul>

    <p>If the amount was deducted, it will be refunded to your account within 5–7 business days.</p>
    <p>You may try again using another payment method.</p>
    
    <br/>
    <p>Thank you,<br/>Team MadlyMart</p>
  `,
  };

  return { emailData, failedEmailData };
};

export default useEmailTemplate;
