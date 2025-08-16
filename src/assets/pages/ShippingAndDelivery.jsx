import { scrollToTop } from "../utilis/RouteHandler";

export default function ShippingAndDelivery() {
  scrollToTop();
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-20">
      <h1 className="text-3xl font-bold mb-6">Shipping and Delivery Policy</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Service Availability</h2>
      <p className="mb-4">
        We deliver across <span className="font-semibold">India</span>. Shipping
        is available to most pincodes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Delivery Timelines</h2>
      <p className="mb-4">
        Orders are usually delivered within{" "}
        <span className="font-semibold">3-7 business days</span>, depending on
        your location.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Tracking Orders</h2>
      <p className="mb-4">
        Once shipped, you will receive an email or SMS with a tracking link.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Undeliverable Packages
      </h2>
      <p>
        If delivery fails due to incorrect address or repeated missed attempts,
        the order will be cancelled and refund initiated (if applicable).
      </p>
    </div>
  );
}
