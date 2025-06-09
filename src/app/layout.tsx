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

export const metadata: Metadata = {
  title: "arcie.art - Personalised Art",
  description:
    "Your one stop shop for personalised and custom keychains, earrings, coasters, lithophanes, desk accessories and more. Create your own unique products with your own designs.",
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
              <ConditionalLayout>{children}</ConditionalLayout>
              <Toaster richColors position="top-right" />
            </ThemeProvider>
          </TanstackProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
