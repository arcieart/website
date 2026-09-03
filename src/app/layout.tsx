import "./globals.css";

import { Poppins, Caveat } from "next/font/google";

import { PostHogProvider } from "@/providers/posthog";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme";
import { TanstackProvider } from "@/providers/tanstack";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { NavBarBanner } from "@/components/banners/TopLayoutBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, rootMetadata } from "@/lib/seo";

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

export const metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${caveat.variable} antialiased min-h-screen text-foreground bg-background flex flex-col`}
      >
        <JsonLd data={organizationJsonLd()} />
        <PostHogProvider>
          <TanstackProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="top-right" />
              <ConditionalLayout banner={<NavBarBanner />}>
                {children}
              </ConditionalLayout>
            </ThemeProvider>
          </TanstackProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
