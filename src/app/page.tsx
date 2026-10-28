import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-[var(--mira-green)] text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,165,116,0.18),transparent_55%)]" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <div className="animate-[softReveal_1.1s_ease]">
            <Image
              src="/logo.jpg"
              alt="Mira Islamic Gifts"
              width={220}
              height={220}
              priority
              className="mx-auto h-44 w-44 object-cover shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] sm:h-52 sm:w-52"
            />
          </div>

          <div className="mt-8 h-2.5 w-2.5 animate-[diamondPulse_2.4s_ease-in-out_infinite] bg-[var(--mira-gold)]" />

          <h1 className="mt-6 animate-[fadeUp_0.8s_ease_0.15s_both] font-[family-name:var(--font-display)] text-5xl tracking-[0.18em] sm:text-7xl">
            MIRA
          </h1>
          <p className="mt-2 animate-[fadeUp_0.8s_ease_0.25s_both] text-xs tracking-[0.42em] text-white/70 uppercase sm:text-sm">
            Islamic Shop
          </p>
          <p className="mt-6 max-w-lg animate-[fadeUp_0.8s_ease_0.35s_both] text-base text-white/80 sm:text-lg">
            Give gifts, and you will love one another.
          </p>
          <p className="mt-2 animate-[fadeUp_0.8s_ease_0.4s_both] font-[family-name:var(--font-ethiopic)] text-sm text-white/65 sm:text-base">
            ስጦታ ተሰጣጡ፤ ትዋደዳላችሁ።
          </p>

          <div className="mt-10 flex animate-[fadeUp_0.8s_ease_0.5s_both] flex-wrap items-center justify-center gap-3">
            <Link
              href="/shop"
              className="bg-white px-7 py-3 text-sm font-medium tracking-wide text-[var(--mira-green)] transition hover:bg-[var(--mira-mist)]"
            >
              Browse gifts
            </Link>
            <a
              href="https://t.me/mirsassop1"
              target="_blank"
              rel="noreferrer"
              className="border border-white/35 px-7 py-3 text-sm tracking-wide text-white transition hover:bg-white/10"
            >
              Message us
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 h-2 w-2 rotate-45 bg-[var(--mira-gold)]" />
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mira-green)] sm:text-4xl">
            Featured gifts
          </h2>
          <p className="mt-3 text-sm text-[var(--mira-ink)]/70 sm:text-base">
            Browse available items, colors, and prices — then add your favorites
            to the cart.
          </p>
        </div>

        <div className="mt-12">
          <ProductGrid
            products={featured}
            emptyMessage="Products will appear here once the shop owner adds stock."
          />
        </div>

        {products.length > 3 ? (
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-block border border-[var(--mira-green)] px-6 py-3 text-sm tracking-wide text-[var(--mira-green)] transition hover:bg-[var(--mira-green)] hover:text-white"
            >
              View all products
            </Link>
          </div>
        ) : null}
      </section>

      <section className="border-y border-[var(--mira-green)]/10 bg-[var(--mira-mist)]">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--mira-green)]">
            Find us in Bole
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--mira-ink)]/70">
            Bole Infront of Dembel · +251 956 265 832 · Telegram @mirsassop1 ·
            Instagram & TikTok — Mira islamic gift
          </p>
        </div>
      </section>
    </>
  );
}
