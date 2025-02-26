"use client";

import Header from "@/components/ui/header";
import { backgroundStyle, featureItems } from "@/utils/constants";
import { motion } from "framer-motion";
import { Github } from "lucide-react";

export default function About() {
  const backgroundStyle = `
  .bg-pattern {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 2;
  }
`;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-2"
      style={{
        background: "radial-gradient(circle at center, #1E40AF, #000000)",
      }}
    >
      <style jsx global>
        {backgroundStyle}
      </style>
      <Header />
      <div className="bg-pattern"></div>
      <section className="flex max-w-4xl flex-col items-center justify-center p-4">
        <div className="flex flex-1 flex-col items-center justify-center pt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <h2 className="mb-4 bg-gradient-to-br from-gray-200 to-gray-600 bg-clip-text pb-1 text-3xl font-extrabold text-transparent">
              Introducing JPGify – The Ultimate Tool for Image Conversion,
              Resizing, and Optimization!
            </h2>
            {featureItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <FeatureItem
                  emoji={item.emoji}
                  title={item.title}
                  description={item.description}
                />
              </motion.div>
            ))}

            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-200">
                🚨 Found a bug or have a suggestion?
              </h3>
              <div className="flex flex-row items-center justify-center gap-2">
                <p className="text-lg text-gray-300">Let us know on GitHub!</p>
                <Github className="size-5 text-gray-300" />
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-bold text-gray-200">
                🌟 JPGify – Easy, Fast, Free
              </h3>
              <p className="text-lg text-gray-300">
                Whether you&apos;re working on a blog post, social media
                content, or a professional presentation, JPGify helps you make
                your images shine every time!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function FeatureItem({ emoji, title, description }) {
  return (
    <div className="flex max-w-2xl items-start justify-center text-left">
      <span className="mr-4 text-4xl">{emoji}</span>
      <div>
        <h3 className="mb-2 bg-gradient-to-br from-gray-300 to-gray-400 bg-clip-text text-xl font-extrabold text-transparent">
          {title}
        </h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}
