"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[var(--mira-mist)] px-4 py-16">
      <div className="w-full max-w-md border border-[var(--mira-green)]/10 bg-white p-8 shadow-[0_24px_60px_-36px_rgba(49,62,55,0.5)]">
        <div className="text-center">
          <Image
            src="/logo.jpg"
            alt="Mira Islamic Gifts"
            width={72}
            height={72}
            className="mx-auto h-16 w-16 object-cover"
          />
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--mira-green)]">
            Admin login
          </h1>
          <p className="mt-2 text-sm text-[var(--mira-ink)]/65">
            Owner access to manage shop stock
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-xs tracking-wide uppercase">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full border border-[var(--mira-green)]/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--mira-green)]"
              placeholder="semiramohammed988@gmail.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs tracking-wide uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full border border-[var(--mira-green)]/20 px-3 py-2.5 text-sm outline-none focus:border-[var(--mira-green)]"
            />
          </div>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--mira-green)] px-4 py-3 text-sm tracking-wide text-white transition hover:bg-[var(--mira-green-deep)] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
