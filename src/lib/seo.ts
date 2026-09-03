import type { Metadata } from "next";
import {
  OG_IMAGE,
  ORGANIZATION_ID,
  SITE_ADDRESS,
  SITE_CONTACT,
  SITE_DESCRIPTION,
  SITE_HANDLE,
  SITE_HOURS,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  WEBSITE_ID,
  type FaqItem,
} from "@/config/site";
import type { UIProduct } from "@/types/product";
import { BaseCategoriesObj } from "@/data/categories";

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return SITE_URL;
  return `${SITE_URL}${normalized}`;
}

export function truncateMetaDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sliced = clean.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trimEnd();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  images,
  noIndex,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImages = images?.length
    ? images.map((image) => ({
        url: image.url,
        width: image.width,
        height: image.height,
        alt: image.alt ?? title,
      }))
    : [OG_IMAGE];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "Store"],
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        alternateName: ["arcie.art", "Arcie"],
        url: SITE_URL,
        image: OG_IMAGE.url,
        logo: `${SITE_URL}/icon.svg`,
        email: SITE_CONTACT.email,
        telephone: SITE_CONTACT.phoneTel,
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE_ADDRESS.city,
          addressRegion: SITE_ADDRESS.region,
          addressCountry: SITE_ADDRESS.countryCode,
          streetAddress: SITE_ADDRESS.locality,
        },
        areaServed: [
          { "@type": "City", name: "Mumbai" },
          { "@type": "Country", name: "India" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
          opens: "10:00",
          closes: "18:00",
        },
        sameAs: [SITE_CONTACT.instagram],
        knowsAbout: [
          "3D printing",
          "clickers",
          "fidget clickers",
          "clicker switches",
          "fidget toys",
          "desk fidgets",
          "custom 3D printing",
          "PLA 3D printing",
          "PETG 3D printing",
        ],
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom 3D printing",
              url: absoluteUrl("/3d-printing"),
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "3D printed fidget clickers and switches",
              url: absoluteUrl("/clicker-switches"),
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "en-IN",
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom 3D printing in Mumbai",
    serviceType: "3D printing",
    url: absoluteUrl("/3d-printing"),
    description:
      "Custom FDM 3D printing in Byculla, Mumbai. PLA+ and PETG from your STL or 3MF files. Small batches, prototypes, and replacement parts. Ships across India.",
    provider: { "@id": ORGANIZATION_ID },
    areaServed: [
      { "@type": "City", name: "Mumbai" },
      { "@type": "Country", name: "India" },
    ],
    hoursAvailable: SITE_HOURS.schema,
    brand: { "@type": "Brand", name: SITE_NAME },
  };
}

export function productJsonLd(product: UIProduct) {
  const category = BaseCategoriesObj[product.categoryId];
  const url = absoluteUrl(
    `/products/${product.categoryId}/${product.slug}`
  );
  const images = product.imageMapping.map((image) => image.url).filter(Boolean);
  const description = truncateMetaDescription(
    (product.description ?? category?.baseDescription ?? product.name).replace(
      /[#*_]/g,
      ""
    ),
    300
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    sku: product.id,
    url,
    image: images,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: category?.name ?? product.categoryId,
    material: product.material?.toUpperCase(),
    countryOfOrigin: "IN",
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": ORGANIZATION_ID },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
      },
    },
  };
}

export function itemListJsonLd({
  name,
  path,
  products,
}: {
  name: string;
  path: string;
  products: UIProduct[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.categoryId}/${product.slug}`),
      name: product.name,
    })),
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [
    { name: "Shamoil Arsiwala", url: "https://shamoilarsi.com" },
    { name: SITE_HANDLE, url: SITE_URL },
  ],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};
