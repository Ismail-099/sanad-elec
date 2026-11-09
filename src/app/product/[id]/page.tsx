import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/lib/data";
import type { Metadata } from "next";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getLiveProductById, getLiveProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getLiveProductById(id);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name} | Sanad Elec`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getLiveProductById(id);
  if (!product) notFound();

  const allProducts = await getLiveProducts();
  const category = categories.find((c) => c.id === product.categoryId);
  const related = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Navbar />
      <ProductDetailClient
        product={product}
        category={category}
        related={related}
      />
      <Footer />
    </>
  );
}
