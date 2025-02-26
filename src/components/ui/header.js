import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const nav = [
    { path: "/" },
    { name: "about", path: "/about" },
    { name: "privacy policy", path: "/privacy-policy" },
    { name: "author", path: "/" },
  ];
  return (
    <header className="absolute top-0 left-0 flex w-full items-center justify-center">
      <nav className="flex w-full items-center justify-around px-4 py-4">
        {nav.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 * i, duration: 1 }}
          >
            <Link
              href={e.path}
              className="flex tracking-wider text-gray-300 capitalize transition-all hover:scale-105 hover:text-white"
            >
              {e.name ? (
                e.name
              ) : (
                <Image
                  src="/icon.svg"
                  alt="JPGify"
                  height={200}
                  width={200}
                  className="z-2 max-h-10 max-w-fit"
                />
              )}
            </Link>
          </motion.div>
        ))}
      </nav>
    </header>
  );
}
