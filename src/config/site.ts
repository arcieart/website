export const SITE_URL = "https://arcie.art";
export const SITE_NAME = "Arcie Art";
export const SITE_HANDLE = "arcie.art";

export const SITE_TITLE =
  "Arcie Art | Fidget Clickers & 3D Printing in Mumbai";

export const SITE_DESCRIPTION =
  "Buy 3D printed fidget clickers and clicker switches, plus custom 3D printing in Mumbai. Clicky, tactile PLA+ desk toys. 3-5 day turnaround, ships across India.";

export const CLICKER_KEYWORDS = [
  "clickers",
  "fidget",
  "switches",
  "fidget clicker",
  "clicker switches",
  "fidget switch",
  "fidget toy",
  "desk fidget",
  "clicky fidget",
  "tactile clicker",
  "mechanical clicker",
  "sensory fidget",
  "stress relief clicker",
  "pocket fidget",
  "desk toy",
  "3d printed fidget",
  "3d printed clickers",
  "buy fidget clicker india",
];

export const SITE_KEYWORDS = [
  ...CLICKER_KEYWORDS,
  "3d printing services mumbai",
  "custom 3d printing india",
  "3d printing byculla",
  "PLA 3d print",
  "PETG 3d print",
  "arcie art",
  "arcie.art",
];

export const SITE_CONTACT = {
  email: "myarcieart@gmail.com",
  phoneDisplay: "+91 97699 10657",
  phoneTel: "+919769910657",
  whatsapp: "919769910657",
  instagram: "https://www.instagram.com/arcie.art",
  instagramHandle: "@arcie.art",
};

export const SITE_ADDRESS = {
  locality: "Byculla",
  city: "Mumbai",
  region: "Maharashtra",
  country: "India",
  countryCode: "IN",
  line: "Byculla, Mumbai, Maharashtra, India",
};

export const SITE_HOURS = {
  days: "Monday - Friday",
  time: "10:00 AM - 6:00 PM",
  schema: "Mo-Fr 10:00-18:00",
};

export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 623,
  alt: "Arcie Art fidget clickers, clicker switches, and custom 3D printing in Mumbai",
};

export type FaqItem = { q: string; a: string };

export const PRINT_SERVICE_FAQS: FaqItem[] = [
  {
    q: "Do you offer 3D printing services in Mumbai?",
    a: "Yes. Arcie Art is a 3D printing studio in Byculla, Mumbai. We print our own products and take custom jobs, then ship across India.",
  },
  {
    q: "Can I send my own STL or 3MF file?",
    a: "Yes. WhatsApp or email the file with the size you want, the material (PLA+ or PETG), and how many pieces. We reply with a quote before printing.",
  },
  {
    q: "What materials do you print with?",
    a: "PLA+ for most products and gifts. PETG when the part needs more heat or chemical resistance. Say which you want on the quote, or ask us to pick.",
  },
  {
    q: "How long does a custom 3D print take?",
    a: "Most jobs are printed and finished in 3-5 business days before dispatch. Large or intricate parts take longer. The quote will say so.",
  },
  {
    q: "Do you ship outside Mumbai?",
    a: "Yes, across India. Free shipping on orders over ₹999. Mumbai customers can also reach us on WhatsApp about local delivery.",
  },
];

export const CLICKER_FAQS: FaqItem[] = [
  {
    q: "What is a clicker?",
    a: "A small mechanical fidget. You press it, it clicks, you press it again. Ours are 3D printed in PLA+ as finished objects, not kits you have to assemble.",
  },
  {
    q: "Are your clickers 3D printed?",
    a: "Yes. Every clicker is printed in our Byculla studio, checked, and shipped from Mumbai.",
  },
  {
    q: "Do clickers ship across India?",
    a: "Yes. We ship nationwide. Free shipping on orders over ₹999.",
  },
  {
    q: "Can I get a custom clicker?",
    a: "Often. Send a sketch, reference, or 3D file on WhatsApp. If we can print it, we will quote it.",
  },
];

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
