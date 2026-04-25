import Link from "next/link";
import { ctfChallenges, ctfPlatforms } from "@/data/ctf";
import Footer from "@/components/layout/Footer";
import CTFClient from "./CTFClient";

export const metadata = {
  title: "CTF — Swastik Sharma",
  description: "Five flags. One root. A small puzzle if you're feeling curious.",
};

export default function CTFPage() {
  return (
    <>
      <main className="min-h-screen pt-24 pb-16 px-6 md:px-16">
        <div className="max-w-[1100px] mx-auto">
          <Link
            href="/"
            className="inline-block text-[0.62rem] text-text-dim tracking-[3px] hover:text-green transition-colors font-mono"
          >
            ← BACK TO PORTFOLIO
          </Link>
          <h1 className="font-sans text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold tracking-tight text-white mt-6">
            CAPTURE THE FLAG
          </h1>
          <p className="text-[0.78rem] text-text-muted mt-3 tracking-[1px] max-w-[560px]">
            Five flags. One root. Solve them in order — progress is saved locally.
          </p>
        </div>
        <div className="mt-12">
          <CTFClient challenges={ctfChallenges} platforms={ctfPlatforms} />
        </div>
      </main>
      <Footer />
    </>
  );
}
