import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/lib/data";
import type { Metadata } from "next";
import CategoryDetailClient from "@/components/CategoryDetailClient";
import { getLiveProductsByCategory } from "@/lib/store";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cat = categories.find((c) => c.id === id);
  if (!cat) return { title: "Catégorie introuvable" };
  return {
    title: `${cat.name} | Sanad Elec`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const cat = categories.find((c) => c.id === id);
  if (!cat) notFound();

  const catProducts = await getLiveProductsByCategory(id);

  return (
    <>
      <Navbar />
      <CategoryDetailClient
        category={cat}
        catProducts={catProducts}
      />
      <Footer />
    </>
  );
}
