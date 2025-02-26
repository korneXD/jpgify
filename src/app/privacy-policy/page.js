

import PrivacyPolicyLayout from "@/components/privacypolicy";

export const metadata = {
  title: "Privacy Policy",
  description:
    "We..."
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Page",
  name: "Privacy Policy",
  image: "/opengraph-image.png",
  description:
    "Read our privacy policy - JPGify",
};

export default function PrivacyPolicy() {

  return (
    <PrivacyPolicyLayout jsonLd={jsonLd} />
  );
}
