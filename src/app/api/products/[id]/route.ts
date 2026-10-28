import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const price = Number(formData.get("price"));
  const colorsRaw = String(formData.get("colors") || "").trim();
  const size = String(formData.get("size") || "").trim();
  const imageFile = formData.get("image");

  if (!name || Number.isNaN(price) || price < 0 || !colorsRaw) {
    return NextResponse.json(
      { error: "Name, price, and at least one color are required." },
      { status: 400 },
    );
  }

  const colors = colorsRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  let image = existing.image;
  if (imageFile instanceof File && imageFile.size > 0) {
    const bytes = Buffer.from(await imageFile.arrayBuffer());
    const ext = path.extname(imageFile.name) || ".jpg";
    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), bytes);
    image = `/uploads/${filename}`;
  }

  const product = await updateProduct(id, {
    name,
    price,
    colors,
    size: size || undefined,
    image,
  });

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const ok = await deleteProduct(id);
  if (!ok) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
