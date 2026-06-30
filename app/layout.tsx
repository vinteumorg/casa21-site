import type { Metadata } from "next";
import { Schibsted_Grotesk, DM_Sans } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import Footer from "@/components/layout/Footer";
import { getNewsletters } from "@/lib/ghost/admin";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://casa21.org";
const SITE_TITLE = "Casa21 – The hackerhouse for Bitcoin builders in Brazil";
const SITE_DESCRIPTION =
  "Casa21 is a community space in São Paulo dedicated to learning, hacking, and building on Bitcoin. Maintained by Vinteum.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Casa21",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    site: "@vinteum_org",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const newsletters = await getNewsletters().catch(() => []);

  return (
    <html
      lang="en"
      className={`${schibstedGrotesk.variable} ${dmSans.variable}`}
    >
      <body>
        <LanguageProvider>
          {children}
          <Footer newsletters={newsletters} />
        </LanguageProvider>
      </body>
    </html>
  );
}
