import React from "react";
import { Helmet } from "react-helmet";

const HelmetComponent = ({ product }) => {
  return (
    <>
      {/* adding product details dynamically to meta tags for seo */}
      <Helmet>
        <title>{`${product?.itemName
          ?.split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")} | Madly Mart`}</title>

        <meta name="description" content={product?.itemDescription} />

        {/* Open Graph for Facebook and others */}
        <meta property="og:title" content={product?.itemName} />
        <meta property="og:description" content={product?.itemDescription} />
        <meta property="og:image" content={product?.itemImage[0]?.image} />
        <meta
          property="og:url"
          content={`https://madlymart.in/product_over_view/${product._id}`}
        />
        <meta property="og:type" content="product" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product?.itemName} />
        <meta name="twitter:description" content={product?.itemDescription} />
        <meta name="twitter:image" content={product?.itemImage[0]?.image} />
      </Helmet>
    </>
  );
};

export default  HelmetComponent;
