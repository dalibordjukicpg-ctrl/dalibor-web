import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Jost } from "next/font/google";

import { AnalyticsInjector } from "@/components/site/analytics-injector";
import { GlobalBackdrop } from "@/components/site/global-backdrop";
import { getSiteBranding } from "@/lib/queries/site-globals";
import { getMetadataBase, getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const headerNav = Jost({
  variable: "--font-header-nav",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "Studio",
    template: "%s · Studio",
  },
  description:
    "Premium pejzažna arhitektura i dizajn eksterijera. 3D vizualizacija, portfolio projekata i besplatna konsultacija.",
  openGraph: {
    type: "website",
    locale: "sr_ME",
    siteName: "Studio",
    url: getSiteUrl(),
    title: "Pejzaž i arhitektura",
    description:
      "Premium pejzažna arhitektura i dizajn eksterijera. 3D vizualizacija i besplatna konsultacija.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pejzaž i arhitektura",
    description:
      "Premium pejzažna arhitektura i dizajn eksterijera. 3D vizualizacija i besplatna konsultacija.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Studio",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {},
};

/** iOS / Android: ispravan viewport, pun ekran, boja browser chrome-a */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let branding: Awaited<ReturnType<typeof getSiteBranding>>;
  try {
    branding = await getSiteBranding();
  } catch (e) {
    console.error("[RootLayout getSiteBranding]", e);
    branding = {
      logoUrl: null,
      faviconUrl: null,
      heroBgUrl: null,
      analyticsHeadHtml: "",
      analyticsBodyHtml: "",
    };
  }

  return (
    <html
      lang="me"
      className={`${display.variable} ${body.variable} ${headerNav.variable} h-full min-h-dvh`}
      suppressHydrationWarning
    >
      <body className="relative min-h-dvh font-body antialiased text-site-ink">
        {/* GlobalBackdrop: fiksirana iza svakog sadržaja na svim stranicama */}
        <GlobalBackdrop />
        <AnalyticsInjector
          headHtml={branding.analyticsHeadHtml}
          bodyHtml={branding.analyticsBodyHtml}
        />
        {children}
      </body>
    </html>
  );
}
