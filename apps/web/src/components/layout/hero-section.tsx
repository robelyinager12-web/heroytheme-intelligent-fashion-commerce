"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

const HeroScene = dynamic(() => import("@/components/three/hero-scene").then((m) => m.HeroScene), {
  ssr: false,
});

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-mesh">
      <div className="absolute inset-0 -z-10 opacity-70">
        <HeroScene />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8 lg:py-40">
        <FadeIn>
          <span className="glass-card inline-block rounded-full px-4 py-1.5 text-xs font-medium text-foreground/80">
            ✦ AI-powered styling, just for you
          </span>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-6 max-w-3xl text-4xl font-display font-bold leading-tight sm:text-5xl lg:text-6xl">
            Fashion that{" "}
            <span className="text-gradient-animated">understands you</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Smart recommendations, instant style search, and a shopping experience
            that adapts to your taste — powered by AI, styled by you.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="glass-card inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-foreground transition hover:bg-white/20"
            >
              Our Story
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}