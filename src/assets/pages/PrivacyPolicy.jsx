import { scrollToTop } from "../utilis/RouteHandler";

export default function PrivacyPolicy() {
  scrollToTop();
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-20">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At <span className="font-semibold">MadlyMart</span>, your privacy is our
        top priority. This policy explains how we collect, use, and protect your
        personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Information We Collect
      </h2>
      <p className="mb-4">
        We may collect your name, email, phone number, address, and payment
        details when you shop with us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
      <p className="mb-4">
        Data is used to process orders, improve our services, and personalize
        your shopping experience. We may also send updates about offers and new
        products.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
      <p className="mb-4">
        We implement strict security measures to protect your personal data.
        However, no method of transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p>
        You can update or request deletion of your information anytime by
        contacting us at{" "}
        <span className="font-semibold">madlymart@gmail.com</span>.
      </p>
    </div>
  );
}
