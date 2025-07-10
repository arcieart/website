import "./globals.css";

import type { Metadata } from "next";
import { Poppins, Caveat } from "next/font/google";

import { PostHogProvider } from "@/providers/posthog";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme";
import { TanstackProvider } from "@/providers/tanstack";
import { ConditionalLayout } from "@/components/layout/conditional-layout";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const title = "Arcie Art - Personalized Products | 3D Printing Services";
const description =
  "Your one stop shop for desk decor, personalized items, and more. Create your own unique products with your own designs.";

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    "arcie.art",
    "personalized",
    "personalized art",
    "personalized gifts",
    "personalized art gifts",
    "personalized art gifts for her",
    "personalized art gifts for him",
    "personalized art gifts for kids",
    "personalized art gifts for family",
    "personalized art gifts for friends",
    "personalized art gifts for couples",
    "custom keychains",
    "earrings",
    "desk accessories",
    "desk decor",
    "desk decor gifts",
    "desk decor gifts for her",
    "desk decor gifts for him",
    "desk decor gifts for kids",
    "desk decor gifts for family",
    "desk decor gifts for friends",
    "custom designs",
    "3d printing",
    "3d printing services",
  ],

  authors: [
    { name: "Shamoil Arsiwala", url: "https://shamoil.com" },
    { name: "arcie.art", url: "https://arcie.art" },
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arcie.art",
    siteName: "Arcie Art",
    title: title,
    description: description,
    images: [
      {
        url: "https://www.arcie.art/og-image.jpg",
        width: 1200,
        height: 623,
        alt: "Arcie Art - Personalized Art Logo",
        type: "image/jpeg",
      },
    ],
  },

  // Icons configuration
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${caveat.variable} antialiased min-h-screen text-foreground bg-background flex flex-col`}
      >
        <PostHogProvider>
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="top-right" />
              <ConditionalLayout>{children}</ConditionalLayout>
            </ThemeProvider>
          </TanstackProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
