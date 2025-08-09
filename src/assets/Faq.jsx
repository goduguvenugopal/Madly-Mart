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
                                How do I track my order?
                            </span>
                            <span>{activeIndex === 0 ? "-" : "+"}</span>
                        </button>
                        <div
                            className={`p-4 text-gray-700 ${activeIndex === 0 ? "" : "hidden"
                                }`}
                        >
                            Once your order has been Placed, you will receive a confirmation email. You can also check the order status in the <Link className='text-blue-600' to="/orders">My Orders</Link> section.
                        </div>
                    </div>

                    {/* Accordion Item 2 */}
                    <div className="border-2 rounded-lg">
                        <button
                            onClick={() => toggleAccordion(1)}
                            className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
                        >
                            <span className="text-lg font-medium">
                                What if my product arrives damaged?
                            </span>
                            <span>{activeIndex === 1 ? "-" : "+"}</span>
                        </button>
                        <div
                            className={`p-4 text-gray-700 ${activeIndex === 1 ? "" : "hidden"
                                }`}
                        >
                            If your product arrives in less-than-perfect condition, please
                            <Link className='text-blue-600' to="/contact"> contact us</Link> customer support team within 1 day of receiving your
                            order. We will be happy to assist you with a replacement or
                            refund.
                        </div>
                    </div>

                    {/* Accordion Item 3 */}
                    <div className="border-2 rounded-lg">
                        <button
                            onClick={() => toggleAccordion(2)}
                            className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
                        >
                            <span className="text-lg font-medium">
                                Can I change or cancel my order?
                            </span>
                            <span>{activeIndex === 2 ? "-" : "+"}</span>
                        </button>
                        <div
                            className={`p-4 text-gray-700 ${activeIndex === 2 ? "" : "hidden"
                                }`}
                        >
                            Once Shipped, we are unable to make changes. <Link className='text-blue-600' to="/contact">contact our </Link>
                            support team as soon as possible if you need assistance.
                        </div>
                    </div>

                    {/* Accordion Item 4 */}
                    <div className="border-2 rounded-lg">
                        <button
                            onClick={() => toggleAccordion(3)}
                            className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
                        >
                            <span className="text-lg font-medium">
                                Do you ship all over Telangana state?
                            </span>
                            <span>{activeIndex === 3 ? "-" : "+"}</span>
                        </button>
                        <div
                            className={`p-4 text-gray-700 ${activeIndex === 3 ? "" : "hidden"
                                }`}
                        >
                            Currently, we are providing our services only to selected villages in the Wanaparthy district.
                        </div>
                    </div>

                    {/* Accordion Item 5 */}
                    <div className="border-2 rounded-lg">
                        <button
                            onClick={() => toggleAccordion(4)}
                            className="w-full text-left p-4 bg-gray-100 focus:outline-none flex justify-between items-center"
                        >
                            <span className="text-lg font-medium">
                                What if my order is delayed?
                            </span>
                            <span>{activeIndex === 4 ? "-" : "+"}</span>
                        </button>
                        <div
                            className={`p-4 text-gray-700 ${activeIndex === 4 ? "" : "hidden"
                                }`}
                        >
                            While we work with trusted carriers, sometimes delays may occur
                            due to unforeseen circumstances. If your order is delayed beyond
                            the estimated delivery time, please <Link className='text-blue-600' to="/contact">contact us</Link> for further
                            assistance.
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Faq