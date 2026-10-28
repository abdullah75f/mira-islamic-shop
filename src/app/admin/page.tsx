import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { isAuthenticated } from "@/lib/auth";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const products = await getProducts();
  return <AdminDashboard initialProducts={products} />;
}
