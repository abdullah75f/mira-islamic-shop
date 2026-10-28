import { neon } from "@neondatabase/serverless";

let schemaReady: Promise<void> | null = null;

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is missing. Add your Neon connection string to .env.local",
    );
  }
  return neon(url);
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          price NUMERIC(12, 2) NOT NULL,
          colors TEXT[] NOT NULL,
          size TEXT,
          image TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })();
  }
  await schemaReady;
}
