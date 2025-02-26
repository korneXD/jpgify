

import HomeLayout from "@/components/home";
import { description } from "@/utils/constants";

export const metadata = {
  title: "Home | JPGify",
  description: description,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Page",
  name: "Home",
  image: "/opengraph-image.png",
  description: description,
};

export default function Home() {
  return (
    <HomeLayout jsonLd={jsonLd} />
  );
}
