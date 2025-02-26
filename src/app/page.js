"use client";

import ImageConverter from "@/components/ImageConverter";
import Header from "@/components/ui/header";
import { backgroundStyle } from "@/utils/constants";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-14 py-2"
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <Header />
      <div className="bg-pattern"></div>
      <section className="flex max-w-2xl flex-col items-center justify-center p-4">
        <div className="flex flex-1 flex-col items-center justify-center pt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="mb-4 bg-gradient-to-br from-gray-200 to-gray-600 bg-clip-text pb-1 text-4xl font-extrabold text-transparent sm:text-5xl">
              JPGify
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <p className="mb-8 text-lg text-gray-300 sm:text-xl">
              Your go-to image conversion hub! Convert
              images effortlessly across 9+ formats. Fast, free, and
              user-friendly. Perfect for pros and beginners alike.
            </p>
          </motion.div>
        </div>
      </section>
      <ImageConverter />
    </main>
  );
}
