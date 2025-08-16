import { scrollToTop } from "../utilis/RouteHandler";

export default function TermsAndConditions() {
  scrollToTop();

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-20">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4">
        Welcome to <span className="font-semibold">MadlyMart</span>. By
        accessing or using our website and services, you agree to the following
        terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Eligibility</h2>
      <p className="mb-4">
        You must be at least 18 years old to make purchases on MadlyMart. By
        using our services, you confirm that you meet this requirement.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Products & Services</h2>
      <p className="mb-4">
        All product prices are listed in INR and are subject to change. We
        strive to provide accurate product details but do not guarantee complete
        accuracy of descriptions or availability.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Payment</h2>
      <p className="mb-4">
        Payments are accepted through secure online gateways.{" "}
        <span className="font-semibold">
          Cash on Delivery (COD) is not available.
        </span>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        MadlyMart will not be held responsible for indirect, incidental, or
        consequential damages arising from the use of our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes shall be
        subject to the jurisdiction of the courts in Andhra Pradesh.
      </p>
    </div>
  );
}
