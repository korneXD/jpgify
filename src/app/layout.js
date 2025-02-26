import { description, title } from "@/utils/constants";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  keywords: [
    "JPG to PNG",
    "image converter",
    "free image converter",
    "unlimited free image converter",
    "png to webp",
    "image resize",
    "image optimize",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    title,
    description,
    siteName: title,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.png"],
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/favicon.ico",
    },
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="2pci2uZwLj8bLPTvBSMF9_CQZ8qn2LCEv9SJGXuEYTI" />
      </head>
      <body className={`antialiased bg-to`}>
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              success:
                "flex w-full font-semibold ring-1 ring-white/5 justify-start px-4 items-center text-lg text-gray-300 gap-2 bg-[#1e40af] rounded-xl py-4",
              warning:
                "flex w-full font-semibold ring-1 ring-white/5 justify-start px-4 items-center text-lg text-gray-300 gap-2 bg-[#1e40af] rounded-xl py-4",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
