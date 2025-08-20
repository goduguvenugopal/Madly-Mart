import React from "react";
import { Helmet } from "react-helmet-async";


const HelmetComponent = ({ product }) => {

  // product schema data  
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `https://madlymart.in/product_over_view/${product._id}`, 
    name: product.itemName,
    description: product.itemDescription,
    category: product.itemCategory,
    sku: product._id,
    keywords: product.productTags?.join(", "),
    image: product.itemImage?.map((img) => img.image),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.itemCost || product.variants?.[0]?.sellingCost || "0",
      availability:
        product.itemStock > 0 || product.variants?.some((v) => v.stock > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://madlymart.in/product_over_view/${product._id}`,  
      itemCondition: "https://schema.org/NewCondition",
    },
    additionalProperty: [
      ...(product.descriptionPoints?.map((point) => ({
        "@type": "PropertyValue",
        name: "Feature",
        value: point,
      })) || []),
    ],
    hasVariant: product.variants?.map((variant) => ({
      "@type": "Product",
      "@id": `https://madlymart.in/product_over_view/${product._id}#${variant._id}`,
      sku: variant._id,
      color: variant.color || undefined,
      size: variant.size || undefined,
      additionalProperty: [
        variant.capacity && {
          "@type": "PropertyValue",
          name: "Capacity",
          value: variant.capacity,
        },
        variant.weight && {
          "@type": "PropertyValue",
          name: "Weight",
          value: variant.weight,
        },
      ].filter(Boolean),
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: variant.sellingCost,
        availability:
          variant.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `https://madlymart.in/product_over_view/${product._id}`,
      },
    })),
  };

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

        {/* schema org product data for google seo results */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData, null, 2)}
        </script>
      </Helmet>
    </>
  );
};

export default HelmetComponent;
