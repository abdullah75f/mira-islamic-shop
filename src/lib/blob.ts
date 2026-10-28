import { put } from "@vercel/blob";

export async function uploadProductImage(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. Create a Vercel Blob store and add the token.",
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob.url;
}
