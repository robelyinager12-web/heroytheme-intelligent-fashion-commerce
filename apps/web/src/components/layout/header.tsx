"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Search, Heart, ShoppingBag, Sun, Moon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/config/nav.config";
import { siteConfig } from "@/config/site.config";

interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  children: CategoryTreeNode[];
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    fetch(`${apiUrl}/api/categories/tree`)
      .then((res) => res.json())
      .then((json) => setCategories(json.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  // Placeholder counts — wired to real cart/wishlist store once those are built
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <header className="glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-display font-bold text-gradient">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) =>
            item.hasMegaMenu ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>

                {megaMenuOpen && categories.length > 0 && (
                  <div className="glass-card absolute left-1/2 top-full mt-2 w-[640px] -translate-x-1/2 p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {categories.map((cat) => (
                        <div key={cat.id}>
                          <Link
                            href={`/categories/${cat.slug}`}
                            className="text-sm font-semibold text-foreground hover:text-primary"
                          >
                            {cat.name}
                          </Link>
                          {cat.children.length > 0 && (
                            <ul className="mt-2 space-y-1.5">
                              {cat.children.map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={`/categories/${child.slug}`}
                                    className="text-sm text-muted-foreground hover:text-primary"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            className="rounded-lg p-2 text-foreground/70 transition hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-foreground/70 transition hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative rounded-lg p-2 text-foreground/70 transition hover:bg-secondary hover:text-foreground"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-lg p-2 text-foreground/70 transition hover:bg-secondary hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-foreground/70 hover:bg-secondary md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="glass flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}