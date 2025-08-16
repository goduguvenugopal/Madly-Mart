 import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Frequently Asked Questions (FAQ)
        </h2>
        <div className="space-y-4">
          {/* Accordion Item 1 */}
          <div className="border-2 rounded-lg">
            <button
              onClick={() => toggleAccordion(0)}
              className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
            >
              <span className="text-lg font-medium">
                How can I track my order?
              </span>
              <span>{activeIndex === 0 ? "-" : "+"}</span>
            </button>
            <div
              className={`p-4 text-gray-700 ${activeIndex === 0 ? "" : "hidden"}`}
            >
              Once your order has been placed, you will receive a confirmation email and SMS with tracking details. 
              You can also check the order status in the <Link className='text-blue-600' to="/orders">My Orders</Link> section.
            </div>
          </div>

          {/* Accordion Item 2 */}
          <div className="border-2 rounded-lg">
            <button
              onClick={() => toggleAccordion(1)}
              className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
            >
              <span className="text-lg font-medium">
                What if my product arrives damaged or defective?
              </span>
              <span>{activeIndex === 1 ? "-" : "+"}</span>
            </button>
            <div
              className={`p-4 text-gray-700 ${activeIndex === 1 ? "" : "hidden"}`}
            >
              If you receive a damaged or defective product (electronics, kitchen items, groceries, etc.), please 
              <Link className='text-blue-600' to="/contact"> contact our support team</Link> within 1 day of delivery. 
              We’ll arrange a replacement or refund as per our return policy.
            </div>
          </div>

          {/* Accordion Item 3 */}
          <div className="border-2 rounded-lg">
            <button
              onClick={() => toggleAccordion(2)}
              className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
            >
              <span className="text-lg font-medium">
                Can I cancel or change my order after placing it?
              </span>
              <span>{activeIndex === 2 ? "-" : "+"}</span>
            </button>
            <div
              className={`p-4 text-gray-700 ${activeIndex === 2 ? "" : "hidden"}`}
            >
              Orders can only be changed or cancelled before they are shipped. Once shipped, cancellation is not possible. 
              Please <Link className='text-blue-600' to="/contact">reach out to us</Link> immediately for assistance.
            </div>
          </div>

          {/* Accordion Item 4 */}
          <div className="border-2 rounded-lg">
            <button
              onClick={() => toggleAccordion(3)}
              className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
            >
              <span className="text-lg font-medium">
                Do you deliver across India?
              </span>
              <span>{activeIndex === 3 ? "-" : "+"}</span>
            </button>
            <div
              className={`p-4 text-gray-700 ${activeIndex === 3 ? "" : "hidden"}`}
            >
              Yes! Madly Mart delivers to all major cities, towns, and villages across India. 
              Wherever you are, we’ll make sure your order reaches you.
            </div>
          </div>

          {/* Accordion Item 5 */}
          <div className="border-2 rounded-lg">
            <button
              onClick={() => toggleAccordion(4)}
              className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
            >
              <span className="text-lg font-medium">
                What payment methods do you accept?
              </span>
              <span>{activeIndex === 4 ? "-" : "+"}</span>
            </button>
            <div
              className={`p-4 text-gray-700 ${activeIndex === 4 ? "" : "hidden"}`}
            >
              We accept UPI, Debit/Credit Cards, Net Banking, and Wallets. 
              <b>Cash on Delivery (COD) is not available.</b> 
              All payments are processed securely via Razorpay.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Faq
