"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ComingSoonModal } from "@/components/ComingSoonModal";
import { useCart } from "@/components/CartProvider";
import { formatETB } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [comingSoon, setComingSoon] = useState<"Telegram" | "WhatsApp" | null>(
    null,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-xl">
        <p className="text-xs tracking-[0.28em] text-[var(--mira-green)]/60 uppercase">
          Cart
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--mira-green)] sm:text-5xl">
          Your order
        </h1>
        <p className="mt-3 text-sm text-[var(--mira-ink)]/70">
          Review quantities and totals in ETB, then place your order.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mt-12 border border-dashed border-[var(--mira-green)]/25 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-3 h-2 w-2 rotate-45 bg-[var(--mira-gold)]" />
          <p className="text-sm text-[var(--mira-ink)]/70">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-[var(--mira-green)] px-6 py-3 text-sm text-white transition hover:bg-[var(--mira-green-deep)]"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-[var(--mira-green)]/10 border border-[var(--mira-green)]/10 bg-white">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.color}`}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-[var(--mira-mist)]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--mira-green)]">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--mira-ink)]/70">
                    Color: {item.color}
                    {item.size ? ` · Size: ${item.size}` : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatETB(item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.productId,
                        item.color,
                        Math.max(1, Number(e.target.value) || 1),
                      )
                    }
                    className="w-16 border border-[var(--mira-green)]/20 px-2 py-2 text-sm outline-none focus:border-[var(--mira-green)]"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <p className="min-w-24 text-right text-sm font-semibold">
                    {formatETB(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.color)}
                    className="text-sm text-red-700/80 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-6 border border-[var(--mira-green)]/10 bg-[var(--mira-mist)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-semibold text-[var(--mira-green)]">
              Total: {formatETB(total)}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setComingSoon("Telegram")}
                className="bg-[var(--mira-green)] px-5 py-3 text-sm tracking-wide text-white transition hover:bg-[var(--mira-green-deep)]"
              >
                Order via Telegram
              </button>
              <button
                type="button"
                onClick={() => setComingSoon("WhatsApp")}
                className="border border-[var(--mira-green)] px-5 py-3 text-sm tracking-wide text-[var(--mira-green)] transition hover:bg-[var(--mira-green)] hover:text-white"
              >
                Order via WhatsApp
              </button>
            </div>
          </div>
        </>
      )}

      <ComingSoonModal
        open={comingSoon !== null}
        channel={comingSoon}
        onClose={() => setComingSoon(null)}
      />
    </div>
  );
}
