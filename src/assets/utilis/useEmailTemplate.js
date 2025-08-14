import React, { useContext } from "react";
import { EnvContext, ProductsContext, UserContext } from "../../App";

const useEmailTemplate = ({totalAmount}) => {
  const { defaultAddress } = useContext(UserContext);
  const { orderProducts } = useContext(ProductsContext);
  const { number } = useContext(EnvContext);

  const emailData = {
    email: `${defaultAddress[0]?.email}, dora.a.to.z.fresh@gmail.com`,
    subject: "Madly Mart Order Placed Successfully",
    html: `
      <h3>Dear ${defaultAddress[0]?.name},</h3>
      <p>Thank you for your order! Below are the details of your Shipping Address:</p>
      <h4>Shipping Address:</h4>
      <ul>
        <li><strong>City :</strong> ${defaultAddress[0]?.district}</li>
        <li><strong>Phone :</strong> ${defaultAddress[0]?.phone}</li>
        <li><strong>Address :</strong> ${defaultAddress[0]?.street}, ${
      defaultAddress[0]?.village
    }, ${defaultAddress[0]?.postalCode}</li>
        <li><strong>State :</strong> ${defaultAddress[0]?.state}</li>
      </ul>
      <h4 style="font-weight: bold; margin-bottom: 4px;">
        Product Details :
      </h4>
      <div style="width: 100%; border: 1px solid gray;">
        ${orderProducts
          .map(
            (item) => `
          <div key="${
            item._id
          }" style="display: flex; gap: 12px; border-bottom: 2px solid gray; padding: 12px;">
            <img
              src="${item?.products[0]?.itemImage[0]}"
              style="height: 10rem; width: 9rem; border-radius: 8px;"
              alt=${item?.products[0]?.itemName.substring(0, 20)}
            />
            <div style="padding-left:10px;">
              <p style="font-weight: 600; width: 100%; overflow-x: auto;">
                <span style="font-weight: 500; display: block; color: black;">
                  ${item?.products[0]?.itemName.substring(0, 20)}..
                </span>
              </p>
              <p style="font-weight: 600;">
                Price :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  Rs. ${item?.products[0]?.itemName.substring(0, 20)}
                </span>
              </p>
              <p style="font-weight: 600;">
                Quantity :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  ${item.itemQty}
                </span>
              </p>
              
               <p style="font-weight: 600;">
                Product weight :
                <span style="font-weight: 500; color: black; padding-left: 4px;">
                  ${item.products[0].weight} 
                </span>
              </p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <h4>Payment Details</h4>
      <h4><span>Note : </span>Orders will be processed only after full payment. Please send the payment receipt to WhatsApp at <a href='https://wa.me/919603669236'>9603669236</a> on the same day of the order.
</h4>
      <h3><strong>Total Amount :</strong> Rs. ${totalAmount}</h3>
      <ul>
        <li><strong>Total Items:</strong> ${orderProducts.length}</li>
          
      </ul>

<h3>Madly Mart Address:</h3>
      <ul>
      <li><strong>Mobile :</strong> <a href="tel:+91${number}"> ${number}</a></li>
      <li><strong>Address :</strong> Noori majid opposite,
                     Pathabazar, Gopalpet road,
                     Wanaparthy 509103</li>
        <li><strong>Email :</strong>dora.a.to.z.fresh@gmail.com</li>
        <li><strong>Google Map Location :</strong> <a href="https://maps.app.goo.gl/YmA4dbsdDkvRfr6t5">Location</a></li>
      </ul>

      <h3>Customer Information:</h3>
      <ul>
      <li><strong>Name :</strong> ${defaultAddress[0]?.name}</li>
      <li><strong>Email :</strong> ${defaultAddress[0]?.email}</li>
      </ul>
      <p>If you have any questions, feel free to contact us at dora.a.to.z.fresh@gmail.com.</p>
      <p>Thank you for shopping with Madly Mart!</p>
      <a href="https://doraatozfresh.vercel.app">Continue Shopping</a>
    `,
  };

  return emailData;
};

export default useEmailTemplate;
