

import AboutLayout from "@/components/about";

export const metadata = {
  title: "About",
  description:
    "We..."
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Page",
  name: "About",
  image: "/opengraph-image.png",
  description:
    "Your go-to image conversion hub! Convert images effortlessly across 9+ formats.Fast, free, and user- friendly.Perfect for pros and beginners alike.",
};

export default function About() {

  return (
    <AboutLayout jsonLd={jsonLd} />
  );
}
