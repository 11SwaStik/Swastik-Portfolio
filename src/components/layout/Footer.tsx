import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-16 py-6 flex flex-col md:flex-row justify-between gap-2">
      <div className="text-[0.56rem] text-text-dim tracking-[2px]">
        &copy; 2025 <span className="text-green">SWASTIK KIRMADA</span>
      </div>
      <div className="flex gap-4 items-center text-[0.56rem] tracking-[2px] text-text-dim">
        <Link
          href="/ctf"
          className="hover:text-green transition-colors"
          aria-label="CTF easter egg"
        >
          {"// /CTF"}
        </Link>
        <span>BUILT WITH <span className="text-green">INTENT</span></span>
      </div>
    </footer>
  );
}
