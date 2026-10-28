"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatETB } from "@/lib/format";
import { useCart } from "./CartProvider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!color) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        color,
        size: product.size,
        image: product.image,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="group flex flex-col overflow-hidden border border-[var(--mira-green)]/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[var(--mira-green)]/25 hover:shadow-[0_18px_40px_-24px_rgba(49,62,55,0.45)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--mira-mist)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--mira-green)]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-[var(--mira-ink)]">
            {formatETB(product.price)}
          </p>
          {product.size ? (
            <p className="mt-1 text-xs text-[var(--mira-ink)]/60">
              Size: {product.size}
            </p>
          ) : null}
        </div>

        <div>
          <label className="text-xs tracking-wide text-[var(--mira-ink)]/60 uppercase">
            Color
          </label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`border px-2.5 py-1 text-xs transition ${
                  color === c
                    ? "border-[var(--mira-green)] bg-[var(--mira-green)] text-white"
                    : "border-[var(--mira-green)]/20 text-[var(--mira-ink)] hover:border-[var(--mira-green)]/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-3 pt-1">
          <label className="sr-only" htmlFor={`qty-${product.id}`}>
            Quantity
          </label>
          <input
            id={`qty-${product.id}`}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            className="w-16 border border-[var(--mira-green)]/20 bg-[var(--mira-mist)] px-2 py-2 text-sm outline-none focus:border-[var(--mira-green)]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-[var(--mira-green)] px-3 py-2.5 text-sm tracking-wide text-white transition hover:bg-[var(--mira-green-deep)]"
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
