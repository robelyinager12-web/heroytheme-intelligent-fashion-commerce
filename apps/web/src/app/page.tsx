import { HeroSection } from "@/components/layout/hero-section";
import { ProductCard, type ProductCardData } from "@/components/shop/product-card";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

async function getFeaturedCategories(): Promise<CategoryNode[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories/tree`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).slice(0, 4);
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<ProductCardData[]> {
  try {
    const res = await fetch(`${API_URL}/api/products?featured=true&limit=8`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getFeaturedCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <HeroSection />

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-center text-3xl font-display font-bold sm:text-4xl">
              Shop by <span className="text-gradient">Category</span>
            </h2>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat, i) => (
              <FadeIn key={cat.id} delay={i * 0.08}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative flex aspect-square items-end overflow-hidden rounded-2xl bg-secondary p-4"
                >
                  {cat.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="relative text-sm font-semibold text-white">{cat.name}</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-display font-bold sm:text-4xl">
                Featured <span className="text-gradient">Products</span>
              </h2>
              <Link
                href="/shop"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>

          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </>
  );
}