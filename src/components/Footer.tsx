"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--mira-green)]/15 bg-[var(--mira-cream)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.08em] text-[var(--mira-green)]">
            MIRA
          </p>
          <p className="mt-1 text-xs tracking-[0.28em] text-[var(--mira-green)]/70 uppercase">
            Islamic Gifts
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--mira-ink)]/75">
            Give gifts, and you will love one another.
          </p>
          <p className="mt-2 font-[family-name:var(--font-ethiopic)] text-sm text-[var(--mira-ink)]/80">
            ስጦታ ተሰጣጡ፤ ትዋደዳላችሁ።
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[var(--mira-green)]">
            Visit & Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--mira-ink)]/75">
            <li>Bole Infront of Dembel</li>
            <li>
              <a href="tel:+251956265832" className="hover:text-[var(--mira-green)]">
                +251 956 265 832
              </a>
            </li>
            <li>
              <a
                href="https://t.me/mirsassop1"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--mira-green)]"
              >
                Telegram @mirsassop1
              </a>
            </li>
            <li>Instagram & TikTok — Mira islamic gift</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[var(--mira-green)]">
            Quick links
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--mira-ink)]/75">
            <li>
              <Link href="/shop" className="hover:text-[var(--mira-green)]">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-[var(--mira-green)]">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-[var(--mira-green)]">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--mira-green)]/10 py-4 text-center text-xs text-[var(--mira-ink)]/50">
        © {new Date().getFullYear()} Mira Islamic Shop
      </div>
    </footer>
  );
}
