import { ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-xl">
        <p className="text-xs tracking-[0.28em] text-[var(--mira-green)]/60 uppercase">
          Shop
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--mira-green)] sm:text-5xl">
          All gifts
        </h1>
        <p className="mt-3 text-sm text-[var(--mira-ink)]/70">
          Choose a color and quantity, then add items to your cart.
        </p>
      </div>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
