"use client";

import Header from "@/components/ui/header";
import { github, sections } from "@/utils/constants";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function PrivacyPolicy() {
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
        <div className="flex flex-1 flex-col items-center justify-center pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center space-y-8"
          >
            <h2 className="mb-4 bg-gradient-to-br from-gray-200 to-gray-600 bg-clip-text pb-1 text-3xl font-extrabold text-transparent">
              Privacy Policy
            </h2>
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="w-full text-left"
              >
                <h3 className="mb-2 bg-gradient-to-br from-gray-300 to-gray-400 bg-clip-text text-xl font-extrabold text-transparent">
                  {section.title}
                </h3>
                <p className="text-gray-300">{section.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>{" "}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-8"
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-200">
            🚨 Found a bug or have a suggestion?
          </h3>
          <Link href={github} className="flex flex-row items-center justify-center gap-2">
            <p className="text-lg text-gray-300">Let us know on GitHub!</p>
            <FaGithub className="size-5 text-gray-300" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
