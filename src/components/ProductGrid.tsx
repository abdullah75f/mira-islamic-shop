import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  emptyMessage = "No products available yet. Check back soon.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-[var(--mira-green)]/25 bg-white/60 px-6 py-16 text-center">
        <div className="mx-auto mb-3 h-2 w-2 rotate-45 bg-[var(--mira-gold)]" />
        <p className="text-sm text-[var(--mira-ink)]/70">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
