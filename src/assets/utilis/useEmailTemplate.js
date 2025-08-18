import React, { useContext } from "react";
import { EnvContext, OrderContext } from "../../App";

const useEmailTemplate = ({ paymentResponse }) => {
  const { number } = useContext(EnvContext);
  const { orderedItems, orderedAddress, paymentDetails } =
    useContext(OrderContext);

  // success payment email confirmation

  const emailData = {
    email: `${orderedAddress?.email}, madlymart@gmail.com`,
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
      <p>Dear <strong>${orderedAddress?.name}</strong>,</p>
       <p>Your payment has been received successfully for <b>Order ID: ${
         paymentDetails?.mongoOrderId
       }</b>.</p>
      <p>Thank you for your order! Below are your order and shipping details.</p>
    </div>

    <!-- Shipping Address -->
    <div style="padding: 0 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Shipping Address</h3>
      <p><strong>City:</strong> ${orderedAddress?.district}</p>
      <p><strong>Phone:</strong> ${orderedAddress?.phone}</p>
      <p><strong>Address:</strong> ${orderedAddress?.street}, ${
      orderedAddress?.village
    }, ${orderedAddress?.postalCode}</p>
      <p><strong>State:</strong> ${orderedAddress?.state}</p>
    </div>

    <!-- Product Details -->
    <div style="padding: 20px;">
      <h3 style="color: #ff6600; border-bottom: 2px solid #eee; padding-bottom: 5px;">Product Details</h3>
      ${orderedItems
        ?.map(
          (item) => `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 1px solid #ddd;">
          <tr>
            <td style="width: 120px; padding: 10px;">
              <img src="${item?.products[0]?.itemImage[0]?.image}" alt="${
            item?.products[0]?.itemName
          }" style="width: 100px; height: auto; border-radius: 4px;" />
            </td>
            <td style="padding: 10px; vertical-align: top;">
              <p style="margin: 0; font-weight: bold;">${
                item?.products[0]?.itemName
              }</p>
              <p style="margin: 4px 0;"><strong>Price:</strong> Rs. ${
                item.products[0]?.itemCost
              }</p>
              ${
                item.weight &&
                `<p style="margin: 4px 0;"><strong>Weight:</strong> ${item.weight}</p>`
              }
             ${
               item.size &&
               `<p style="margin: 4px 0;"><strong>Size:</strong> ${item.size}</p>`
             }
              ${
                item.capacity &&
                `<p style="margin: 4px 0;"><strong>Capacity:</strong> ${item.capacity}</p>`
              }
              ${
                item.color &&
                `<p style="margin: 4px 0;"><strong>Color:</strong> ${item.color}</p>`
              }
              <p style="margin: 4px 0;"><strong>Quantity:</strong> ${
                item.itemQty
              }</p>

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
      <p><strong>Total Amount:</strong> Rs. ${paymentDetails?.amount / 100}</p>
      <p><strong>Total Items:</strong> ${orderedItems?.length}</p>
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
  <div style="font-family:Arial, Helvetica, sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #e0e0e0; border-radius:10px; background:#ffffff; color:#333;">
    
    <!-- Header -->
    <div style="text-align:center; border-bottom:2px solid #007bff; padding-bottom:10px; margin-bottom:20px;">
      <h2 style="color:#d9534f; margin:0;">❌ Payment Failed</h2>
    </div>

    <!-- Greeting -->
    <p style="font-size:15px; line-height:1.6; color:#555;">
      Dear Customer,
    </p>

    <!-- Order Info -->
    <p style="font-size:15px; line-height:1.6; color:#555;">
      Unfortunately, your payment for <b>Order ID: ${
        paymentDetails?.mongoOrderId
      }</b> could not be completed.
    </p>

    <p style="font-size:15px; line-height:1.6; color:#555;">
      <strong>Total Amount:</strong> Rs. ${paymentDetails?.amount / 100}
    </p>

    <!-- Details Section -->
    <h3 style="color:#007bff; margin-top:20px;">Payment Details</h3>
    <ul style="font-size:14px; line-height:1.6; color:#555; padding-left:20px;">
      <li><b>Payment ID:</b> ${
        paymentResponse?.razorpay_payment_id || "N/A"
      }</li>
      <li><b>Reason:</b> ${
        paymentResponse?.error?.description || "Transaction was declined"
      }</li>
    </ul>

    <!-- Instructions -->
    <p style="font-size:15px; color:#555555; line-height:1.6; margin-top:20px;">
      To complete your purchase, please go to the 
      <b>Orders</b> section of your account and click 
      <b>"Retry Payment"</b> for this order.
    </p>

    <!-- CTA Button -->
    <div style="text-align:center; margin:30px 0;">
      <a href="https://madlymart.in/orders" 
        style="background-color:#007bff; 
               color:#ffffff; 
               padding:14px 28px; 
               font-size:16px; 
               text-decoration:none; 
               border-radius:6px; 
               display:inline-block; 
               font-weight:bold;">
        Go to My Orders
      </a>
    </div>

    <!-- Refund Info -->
    <p style="font-size:14px; color:#555555; line-height:1.6;">
      If the amount was deducted, it will be refunded to your account within <b>5–7 business days</b>.
    </p>
    <p style="font-size:14px; color:#555555; line-height:1.6;">
      You may try again using another payment method.
    </p>

    <!-- Footer -->
    <br/>
    <p style="font-size:14px; color:#333; line-height:1.6;">
      Thank you,<br/>
      <b>Team MadlyMart</b>
    </p>
  </div>
  `,
  };

  // Payment attempt closed by user (no completion)
  const closedEmailData = {
    email: `${orderedAddress?.email},madlymart@gmail.com`,
    subject: `Payment Not Completed - Order ${paymentDetails?.mongoOrderId}`,
    html: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; padding:30px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <h2 style="color:#333333; text-align:center; margin-bottom:20px;">Payment Not Completed</h2>
      
      <!-- Body -->
      <p style="font-size:15px; color:#555555;">Dear Customer,</p>
      <p style="font-size:15px; color:#555555; line-height:1.6;">
        We noticed that you initiated a payment for 
        <b>Order ID: ${paymentDetails?.mongoOrderId}</b>, 
        but the payment process was not completed.
      </p>

      <p style="font-size:15px; color:#555555; margin:10px 0;">
        <strong>Total Amount:</strong> <span style="color:#000;">Rs. ${
          paymentDetails?.amount / 100
        }</span>
      </p>

      <p style="font-size:15px; color:#555555; line-height:1.6;">
        To complete your purchase, please go to the 
        <b>Orders</b> section of your account and click 
        <b>"Retry Payment"</b> for this order.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center; margin:30px 0;">
        <a href="https://madlymart.in/orders" 
          style="background-color:#007bff; 
                 color:#ffffff; 
                 padding:12px 24px; 
                 font-size:16px; 
                 text-decoration:none; 
                 border-radius:6px; 
                 display:inline-block; 
                 font-weight:bold;">
          Go to My Orders
        </a>
      </div>

      <!-- Footer -->
      <p style="font-size:14px; color:#777777; line-height:1.6;">
        If you faced any issues during checkout, feel free to reach out to us — we’ll be happy to assist you.
      </p>

      <p style="font-size:14px; color:#555555; margin-top:25px;">
        Thank you for choosing <b>MadlyMart</b>.<br/>
        <span style="color:#007bff; font-weight:bold;">Team MadlyMart</span>
      </p>
    </div>
  </div>
  `,
  };

  return { emailData, failedEmailData, closedEmailData };
};

export default useEmailTemplate;
