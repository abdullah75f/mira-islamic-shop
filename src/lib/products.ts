import { ensureSchema, getSql } from "./db";
import type { Product } from "./types";

type ProductRow = {
  id: string;
  name: string;
  price: string | number;
  colors: string[];
  size: string | null;
  image: string;
  created_at: string | Date;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    colors: row.colors,
    size: row.size || undefined,
    image: row.image,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : new Date(row.created_at).toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, price, colors, size, image, created_at
    FROM products
    ORDER BY created_at DESC
  `) as ProductRow[];
  return rows.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, price, colors, size, image, created_at
    FROM products
    WHERE id = ${id}
    LIMIT 1
  `) as ProductRow[];
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function createProduct(
  input: Omit<Product, "id" | "createdAt">,
): Promise<Product> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO products (name, price, colors, size, image)
    VALUES (
      ${input.name},
      ${input.price},
      ${input.colors},
      ${input.size || null},
      ${input.image}
    )
    RETURNING id, name, price, colors, size, image, created_at
  `) as ProductRow[];
  return mapProduct(rows[0]);
}

export async function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "createdAt">>,
): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  const next = {
    name: input.name ?? existing.name,
    price: input.price ?? existing.price,
    colors: input.colors ?? existing.colors,
    size: input.size === undefined ? existing.size : input.size,
    image: input.image ?? existing.image,
  };

  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    UPDATE products
    SET
      name = ${next.name},
      price = ${next.price},
      colors = ${next.colors},
      size = ${next.size || null},
      image = ${next.image}
    WHERE id = ${id}
    RETURNING id, name, price, colors, size, image, created_at
  `) as ProductRow[];

  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM products
    WHERE id = ${id}
    RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}
