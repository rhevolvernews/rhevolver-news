import type { Metadata, Viewport } from "next";
import Analytics from "@/components/Analytics";
import PWARegister from "@/components/PWARegister";
import {
  DEFAULT_DESCRIPTION,
  PUBLISHER_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Información que revoluciona`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  category: "news",
  keywords: [
    "noticias",
    "Iguala",
    "Guerrero",
    "México",
    "política",
    "información local",
    "última hora",
    "Rhevolver",
  ],
  authors: [{ name: PUBLISHER_NAME, url: SITE_URL }],
  creator: PUBLISHER_NAME,
  publisher: PUBLISHER_NAME,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Información que revoluciona`,
    description: DEFAULT_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Información que revoluciona`,
    description: DEFAULT_DESCRIPTION,
    creator: "@rhevolvercdmx",
    site: "@rhevolvercdmx",
  },
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
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "NewsMediaOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: PUBLISHER_NAME,
      alternateName: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.ico`,
      },
      sameAs: [
        "https://www.facebook.com/rhevolvermx",
        "https://www.instagram.com/rhevolvermx",
        "https://www.tiktok.com/@rhevolvercdmx",
        "https://x.com/rhevolvercdmx",
        "https://www.youtube.com/@RhevolverMx",
        "https://whatsapp.com/channel/0029Vb8o6fODzgTKUBkxkH2o",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "es-MX",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/buscar?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className="h-full antialiased">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} RSS`}
          href="/rss.xml"
        />
      </head>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <Analytics />
        <PWARegister />
      </body>
    </html>
  );
}
