import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadProductImage } from "@/lib/blob";
import { createProduct, getProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    const image = await uploadProductImage(imageFile);
    const product = await createProduct({
      name,
      price,
      colors,
      size: size || undefined,
      image,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
