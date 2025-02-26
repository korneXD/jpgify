import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

export default function Header() {
  const nav = [
    { name: "about", path: "/about" },
    { name: "privacy policy", path: "/privacy-policy" },
    { name: "buy me a coffee", path: "/" },
  ];
  return (
    <header className="absolute top-0 left-0 flex w-full items-center justify-center">
      <nav className="flex items-center justify-around w-full py-2 px-8">
        <div className="flex justify-start items-center flex-1 gap-2">
          <Link href="/" className="flex justify-start items-center gap-2">
            <Image src="/icon.svg" alt="JPGify Logo" height={100} width={100} className="z-10 max-h-8 w-fit" />
            <p className="text-gray-300 text-lg font-semibold">JPGify</p>
          </Link>
        </div>
        <div className="flex justify-around items-center px-2 py-4 flex-1">
          {nav.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 * i, duration: 1 }}
              className=" w-full justify-center items-center"
            >
              <Link
                href={e.path}
                className="flex text-center justify-center items-center tracking-wider text-gray-300 capitalize transition-all hover:scale-105 hover:text-white"
              >
                {e.name}
              </Link>
            </motion.div>
          ))}
        </div>
        <Link href="/" className="flex justify-end items-center flex-1">
          <div className="flex justify-center items-center bg-gradient-to-tr gap-2 from-blue via-via to-to z-10 px-2 py-2 rounded-xl">
            <p className="text-gray-300 font-semibold">Github Repo</p>
            <FaGithub className="size-5 text-gray-300" />
          </div>
        </Link>
      </nav>
    </header>
  );
}
