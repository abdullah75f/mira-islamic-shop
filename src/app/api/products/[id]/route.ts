import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { uploadProductImage } from "@/lib/blob";
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

  try {
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
      image = await uploadProductImage(imageFile);
    }

    const product = await updateProduct(id, {
      name,
      price,
      colors,
      size: size || undefined,
      image,
    });

    return NextResponse.json(product);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const ok = await deleteProduct(id);
    if (!ok) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
