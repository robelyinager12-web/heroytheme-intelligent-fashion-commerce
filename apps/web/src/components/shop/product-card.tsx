"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice: number | null;
  thumbnailUrl: string | null;
  brandName: string | null;
  inStock: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  onWishlistToggle,
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.basePrice / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-xl hover:shadow-black/5",
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            -{discountPercent}%
          </span>
        )}

        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-semibold text-background">
            Sold Out
          </span>
        )}

        <button
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle?.(product.id);
          }}
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur transition hover:bg-background"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition",
              isWishlisted ? "fill-accent text-accent" : "text-foreground/70",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.brandName && (
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.brandName}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</h3>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.basePrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}