"use client"
import Header from "@/components/ui/header";
import { backgroundStyle } from "@/utils/constants";

export default function BuyMeACoffee() {
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

            </section>
        </main>
    );
}