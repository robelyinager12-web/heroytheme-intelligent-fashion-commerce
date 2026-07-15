import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log("Seeding database...");

  // --- Users ---
  const adminPasswordHash = await bcrypt.hash("Admin123!", SALT_ROUNDS);
  const sellerPasswordHash = await bcrypt.hash("Seller123!", SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: "admin@heroytheme.com" },
    update: {},
    create: {
      email: "admin@heroytheme.com",
      passwordHash: adminPasswordHash,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      isEmailVerified: true,
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@heroytheme.com" },
    update: {},
    create: {
      email: "seller@heroytheme.com",
      passwordHash: sellerPasswordHash,
      firstName: "Jordan",
      lastName: "Reyes",
      role: UserRole.SELLER,
      isEmailVerified: true,
    },
  });

  // --- Categories (with subcategories, matching mega-menu structure) ---
  const womens = await prisma.category.upsert({
    where: { slug: "womens" },
    update: {},
    create: {
      name: "Women's",
      slug: "womens",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/w_600/samples/ecommerce/leather-bag-gray.jpg",
    },
  });

  const mens = await prisma.category.upsert({
    where: { slug: "mens" },
    update: {},
    create: {
      name: "Men's",
      slug: "mens",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/w_600/samples/ecommerce/shoes.jpg",
    },
  });

  const jackets = await prisma.category.upsert({
    where: { slug: "womens-jackets" },
    update: {},
    create: { name: "Jackets", slug: "womens-jackets", parentId: womens.id },
  });

  const dresses = await prisma.category.upsert({
    where: { slug: "womens-dresses" },
    update: {},
    create: { name: "Dresses", slug: "womens-dresses", parentId: womens.id },
  });

  const mensShirts = await prisma.category.upsert({
    where: { slug: "mens-shirts" },
    update: {},
    create: { name: "Shirts", slug: "mens-shirts", parentId: mens.id },
  });

  // --- Brands ---
  const auroraBrand = await prisma.brand.upsert({
    where: { slug: "aurora" },
    update: {},
    create: { name: "Aurora", slug: "aurora" },
  });

  const nordicBrand = await prisma.brand.upsert({
    where: { slug: "nordic-co" },
    update: {},
    create: { name: "Nordic & Co", slug: "nordic-co" },
  });

  // --- Products with variants and images ---
  const productSeeds = [
    {
      name: "Oversized Wool Jacket",
      slug: "oversized-wool-jacket",
      description: "A relaxed-fit wool jacket with a soft brushed finish, built for layering through every season.",
      basePrice: 189.0,
      compareAtPrice: 229.0,
      sku: "JCK-001",
      categoryId: jackets.id,
      brandId: auroraBrand.id,
      isFeatured: true,
      image: "https://res.cloudinary.com/demo/image/upload/w_800/samples/ecommerce/leather-bag-gray.jpg",
      variants: [
        { size: "S", color: "Charcoal", stock: 12, sku: "JCK-001-S-CHR" },
        { size: "M", color: "Charcoal", stock: 8, sku: "JCK-001-M-CHR" },
        { size: "L", color: "Charcoal", stock: 5, sku: "JCK-001-L-CHR" },
      ],
    },
    {
      name: "Silk Slip Dress",
      slug: "silk-slip-dress",
      description: "A minimalist silk slip dress with an adjustable bias-cut hem — dresses up or down effortlessly.",
      basePrice: 129.0,
      compareAtPrice: null,
      sku: "DRS-001",
      categoryId: dresses.id,
      brandId: nordicBrand.id,
      isFeatured: true,
      image: "https://res.cloudinary.com/demo/image/upload/w_800/samples/ecommerce/shoes.jpg",
      variants: [
        { size: "XS", color: "Ivory", stock: 6, sku: "DRS-001-XS-IVR" },
        { size: "S", color: "Ivory", stock: 10, sku: "DRS-001-S-IVR" },
        { size: "M", color: "Black", stock: 9, sku: "DRS-001-M-BLK" },
      ],
    },
    {
      name: "Classic Oxford Shirt",
      slug: "classic-oxford-shirt",
      description: "A tailored oxford shirt in breathable cotton twill — a wardrobe staple that layers under anything.",
      basePrice: 79.0,
      compareAtPrice: 95.0,
      sku: "SHT-001",
      categoryId: mensShirts.id,
      brandId: auroraBrand.id,
      isFeatured: true,
      image: "https://res.cloudinary.com/demo/image/upload/w_800/samples/ecommerce/analog-classic.jpg",
      variants: [
        { size: "M", color: "White", stock: 15, sku: "SHT-001-M-WHT" },
        { size: "L", color: "White", stock: 11, sku: "SHT-001-L-WHT" },
        { size: "L", color: "Sky Blue", stock: 7, sku: "SHT-001-L-SKY" },
      ],
    },
    {
      name: "Tailored Wide-Leg Trousers",
      slug: "tailored-wide-leg-trousers",
      description: "High-waisted, wide-leg trousers with a fluid drape — cut for comfort without losing structure.",
      basePrice: 99.0,
      compareAtPrice: null,
      sku: "TRS-001",
      categoryId: womens.id,
      brandId: nordicBrand.id,
      isFeatured: true,
      image: "https://res.cloudinary.com/demo/image/upload/w_800/samples/ecommerce/car-interior-design.jpg",
      variants: [
        { size: "S", color: "Sand", stock: 10, sku: "TRS-001-S-SND" },
        { size: "M", color: "Sand", stock: 6, sku: "TRS-001-M-SND" },
      ],
    },
  ];

  for (const p of productSeeds) {
    const { image, variants, ...productData } = p;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        sellerId: seller.id,
        images: { create: [{ url: image, publicId: `seed/${p.slug}`, position: 0 }] },
        variants: { create: variants },
      },
    });

    console.log(`  ✓ ${product.name}`);
  }

  console.log("Seed complete.");
  console.log(`  Admin login:  admin@heroytheme.com / Admin123!`);
  console.log(`  Seller login: seller@heroytheme.com / Seller123!`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });