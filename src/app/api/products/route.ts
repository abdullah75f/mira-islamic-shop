import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";
import { createProduct, getProducts } from "@/lib/products";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return NextResponse.json(
      { error: "Product photo is required." },
      { status: 400 },
    );
  }

  const colors = colorsRaw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  if (colors.length === 0) {
    return NextResponse.json(
      { error: "Add at least one color." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await imageFile.arrayBuffer());
  const ext = path.extname(imageFile.name) || ".jpg";
  const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);

  const product = await createProduct({
    name,
    price,
    colors,
    size: size || undefined,
    image: `/uploads/${filename}`,
  });

  return NextResponse.json(product, { status: 201 });
}
