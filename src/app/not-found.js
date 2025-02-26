"use client";

import FuzzyText from "@/components/ui/fuzzy-text";
import Header from "@/components/ui/header";
import { backgroundStyle } from "@/utils/constants";
import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center flex-col px-14 py-2"
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <div className="bg-pattern"></div>
      <section className="flex justify-center items-center flex-col max-w-2xl p-4">
        <Header />
        <div className="flex-1 flex flex-col justify-center items-center text-center pt-12">
          <div className="flex justify-center items-center flex-col gap-4">
            <h2>
              <FuzzyText
                baseIntensity={0.07}
                hoverIntensity={0.1}
                fontSize="50px"
              >
                404
              </FuzzyText>
            </h2>
            <Link href="/">
              <FuzzyText
                baseIntensity={0.07}
                hoverIntensity={0.1}
                fontSize="30px"
              >
                Back to JPGify
              </FuzzyText>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
