import { scrollToTop } from "../utilis/RouteHandler";

export default function RefundAndCancellation() {
  scrollToTop();
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Refund and Cancellation Policy
      </h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Order Cancellation</h2>
      <p className="mb-4">
        Orders can be cancelled within{" "}
        <span className="font-semibold">2 hours</span> of placement. Once
        shipped, cancellation is not possible.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Eligibility</h2>
      <p className="mb-4">
        Refunds are applicable only for damaged, defective, or wrong products.
        Items must be returned in their original packaging.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Non-Refundable Items</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Personal care items</li>
        <li>Opened or used electronics</li>
        <li>Perishable goods</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Refund Process</h2>
      <p>
        Refunds will be initiated within{" "}
        <span className="font-semibold">5-7 working days</span> to your original
        payment method.
      </p>
    </div>
  );
}
