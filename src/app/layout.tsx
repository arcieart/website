import "./globals.css";

import type { Metadata } from "next";
import { Poppins, Caveat } from "next/font/google";

import { PostHogProvider } from "@/providers/posthog";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme";
import { TanstackProvider } from "@/providers/tanstack";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Protected } from "@/components/misc/Protected";

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

export const metadata: Metadata = {
  title: "Arcie Art - Personalized Art",
  description:
    "Your one stop shop for personalized and custom keychains, earrings, coasters, lithophanes, desk accessories and more. Create your own unique products with your own designs.",
  // keywords: [
  //   "arcie.art",
  //   "personalized",
  //   "personalized art",
  //   "personalized gifts",
  //   "personalized art gifts",
  //   "personalized art gifts for her",
  //   "personalized art gifts for him",
  //   "personalized art gifts for kids",
  //   "personalized art gifts for family",
  //   "personalized art gifts for friends",
  //   "personalized art gifts for couples",
  //   "custom keychains",
  //   "earrings",
  //   "coasters",
  //   "lithophanes",
  //   "desk accessories",
  //   "custom designs",
  //   "3d printing",
  //   "3d printing services",
  // ],
  // authors: [
  //   { name: "Shamoil Arsiwala", url: "https://shamoil.com" },
  //   { name: "arcie.art", url: "https://arcie.art" },
  // ],

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arcie.art",
    siteName: "Arcie Art",
    title: "Arcie Art - Personalized Art",
    description:
      "Your one stop shop for personalized and custom keychains, earrings, coasters, lithophanes, desk accessories and more. Create your own unique products with your own designs.",
    images: [
      {
        url: "https://www.arcie.art/icon.jpg",
        width: 1024,
        height: 1024,
        alt: "Arcie Art - Personalized Art Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Arcie Art - Personalized Art",
    description:
      "Your one stop shop for personalized and custom keychains, earrings, coasters, lithophanes, desk accessories and more.",
    images: ["https://www.arcie.art/og-image.jpg"],
  },
  // Icons configuration
  icons: {
    icon: [{ url: "https://www.arcie.art/icon.jpg", type: "image/jpeg" }],
    apple: [{ url: "https://www.arcie.art/icon.jpg", type: "image/jpeg" }],
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
              <ConditionalLayout>
                <Protected>{children}</Protected>
              </ConditionalLayout>
            </ThemeProvider>
          </TanstackProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
