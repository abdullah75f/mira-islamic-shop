"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import type { Product } from "@/lib/types";
import { formatETB } from "@/lib/format";

type FormState = {
  name: string;
  price: string;
  colors: string;
  size: string;
};

const emptyForm: FormState = {
  name: "",
  price: "",
  colors: "",
  size: "",
};

export function AdminDashboard({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const editingProduct = useMemo(
    () => products.find((p) => p.id === editingId) ?? null,
    [products, editingId],
  );

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      colors: product.colors.join(", "),
      size: product.size || "",
    });
    setImage(null);
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setImage(null);
    setError("");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = new FormData();
    body.set("name", form.name.trim());
    body.set("price", form.price);
    body.set("colors", form.colors);
    body.set("size", form.size.trim());
    if (image) body.set("image", image);

    try {
      const url = editingId
        ? `/api/products/${editingId}`
        : "/api/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, body });
      const data = (await res.json()) as Product & { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not save product.");
        return;
      }

      setProducts((prev) => {
        if (editingId) {
          return prev.map((p) => (p.id === editingId ? data : p));
        }
        return [data, ...prev];
      });
      resetForm();
      router.refresh();
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Could not delete product.");
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) resetForm();
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-[var(--mira-green)]/60 uppercase">
            Admin
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--mira-green)]">
            Manage stock
          </h1>
          <p className="mt-2 text-sm text-[var(--mira-ink)]/70">
            Add product photo, name, price, colors, and optional size.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="border border-[var(--mira-green)]/30 px-4 py-2 text-sm text-[var(--mira-green)] transition hover:bg-[var(--mira-green)] hover:text-white"
        >
          Log out
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-4 border border-[var(--mira-green)]/10 bg-white p-5"
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mira-green)]">
            {editingId ? "Edit product" : "Add product"}
          </h2>

          <div>
            <label className="text-xs tracking-wide uppercase" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1.5 w-full border border-[var(--mira-green)]/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--mira-green)]"
            />
          </div>

          <div>
            <label className="text-xs tracking-wide uppercase" htmlFor="price">
              Price (ETB)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step="1"
              required
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="mt-1.5 w-full border border-[var(--mira-green)]/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--mira-green)]"
            />
          </div>

          <div>
            <label className="text-xs tracking-wide uppercase" htmlFor="colors">
              Colors (comma-separated)
            </label>
            <input
              id="colors"
              required
              placeholder="Green, Gold, Black"
              value={form.colors}
              onChange={(e) =>
                setForm((f) => ({ ...f, colors: e.target.value }))
              }
              className="mt-1.5 w-full border border-[var(--mira-green)]/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--mira-green)]"
            />
          </div>

          <div>
            <label className="text-xs tracking-wide uppercase" htmlFor="size">
              Size (optional)
            </label>
            <input
              id="size"
              placeholder="e.g. Large"
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              className="mt-1.5 w-full border border-[var(--mira-green)]/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--mira-green)]"
            />
          </div>

          <div>
            <label className="text-xs tracking-wide uppercase" htmlFor="image">
              Photo {editingId ? "(optional to replace)" : ""}
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              required={!editingId}
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1.5 w-full text-sm"
            />
            {editingProduct ? (
              <div className="relative mt-3 h-28 w-28 overflow-hidden bg-[var(--mira-mist)]">
                <Image
                  src={editingProduct.image}
                  alt={editingProduct.name}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[var(--mira-green)] px-4 py-3 text-sm text-white transition hover:bg-[var(--mira-green-deep)] disabled:opacity-60"
            >
              {saving
                ? "Saving…"
                : editingId
                  ? "Update product"
                  : "Add product"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="border border-[var(--mira-green)]/30 px-4 py-3 text-sm"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mira-green)]">
            Current stock ({products.length})
          </h2>

          {products.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--mira-ink)]/65">
              No products yet. Add your first item on the left.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-[var(--mira-green)]/10 border border-[var(--mira-green)]/10 bg-white">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[var(--mira-mist)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--mira-green)]">
                      {product.name}
                    </p>
                    <p className="text-sm text-[var(--mira-ink)]/70">
                      {formatETB(product.price)} · {product.colors.join(", ")}
                      {product.size ? ` · Size ${product.size}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="border border-[var(--mira-green)]/30 px-3 py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="border border-red-200 px-3 py-2 text-sm text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
