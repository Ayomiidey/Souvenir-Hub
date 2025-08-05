import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Administrator with full access",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Regular user",
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@souvenirs.com" },
    update: {},
    create: {
      email: "admin@souvenirs.com",
      name: "Admin User",
      password: hashedPassword,
      roles: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
  });

  // Create categories
  const categories = [
    {
      name: "T-Shirts & Apparel",
      slug: "t-shirts-apparel",
      description: "Custom printed t-shirts and clothing",
      children: [
        { name: "Men's T-Shirts", slug: "mens-t-shirts" },
        { name: "Women's T-Shirts", slug: "womens-t-shirts" },
        { name: "Kids T-Shirts", slug: "kids-t-shirts" },
      ],
    },
    {
      name: "Mugs & Drinkware",
      slug: "mugs-drinkware",
      description: "Custom mugs, cups, and drinkware",
      children: [
        { name: "Coffee Mugs", slug: "coffee-mugs" },
        { name: "Travel Mugs", slug: "travel-mugs" },
      ],
    },
    {
      name: "Home Decor",
      slug: "home-decor",
      description: "Decorative items for home",
      children: [
        { name: "Wall Art", slug: "wall-art" },
        { name: "Cushions", slug: "cushions" },
      ],
    },
    {
      name: "Keychains",
      slug: "keychains",
      description: "Custom keychains and accessories",
    },
    {
      name: "Phone Cases",
      slug: "phone-cases",
      description: "Custom phone cases and covers",
    },
    {
      name: "Stationery",
      slug: "stationery",
      description: "Custom notebooks, pens, and office supplies",
    },
  ];

  for (const categoryData of categories) {
    const { children, ...parentData } = categoryData;

    const parentCategory = await prisma.category.upsert({
      where: { slug: parentData.slug },
      update: {},
      create: {
        ...parentData,
        isActive: true,
      },
    });

    if (children) {
      for (const childData of children) {
        await prisma.category.create({
          data: {
            ...childData,
            parentId: parentCategory.id,
            isActive: true,
          },
        });
      }
    }
  }

  // Create sample products
  const tshirtCategory = await prisma.category.findFirst({
    where: { slug: "mens-t-shirts" },
  });

  const mugCategory = await prisma.category.findFirst({
    where: { slug: "coffee-mugs" },
  });

  if (tshirtCategory) {
    const tshirtProducts = [
      {
        name: "Custom Print T-Shirt",
        slug: "custom-print-t-shirt",
        description: "High-quality cotton t-shirt perfect for custom printing",
        shortDescription: "Comfortable cotton tee with custom print option",
        sku: "TSH-001",
        price: 19.99,
        comparePrice: 24.99,
        quantity: 100,
        allowCustomPrint: true,
        printPrice: 5.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
            altText: "Custom Print T-Shirt",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 10, discountType: "PERCENTAGE", discountValue: 10 },
          { minQuantity: 20, discountType: "PERCENTAGE", discountValue: 15 },
        ],
      },
      {
        name: "Graphic Logo Tee",
        slug: "graphic-logo-tee",
        description: "Stylish t-shirt with vibrant graphic logo prints",
        shortDescription: "Vibrant graphic tee for everyday wear",
        sku: "TSH-002",
        price: 22.99,
        comparePrice: 27.99,
        quantity: 80,
        allowCustomPrint: true,
        printPrice: 4.5,
        status: "ACTIVE",
        isActive: true,
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500",
            altText: "Graphic Logo Tee",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 15, discountType: "PERCENTAGE", discountValue: 12 },
        ],
      },
      {
        name: "V-Neck Custom Tee",
        slug: "v-neck-custom-tee",
        description: "Soft V-neck t-shirt ideal for personalized designs",
        shortDescription: "Comfortable V-neck with custom print",
        sku: "TSH-003",
        price: 18.99,
        comparePrice: 23.99,
        quantity: 120,
        allowCustomPrint: true,
        printPrice: 5.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500",
            altText: "V-Neck Custom Tee",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 10, discountType: "PERCENTAGE", discountValue: 10 },
          { minQuantity: 25, discountType: "PERCENTAGE", discountValue: 18 },
        ],
      },
      {
        name: "Sports Performance Tee",
        slug: "sports-performance-tee",
        description:
          "Breathable t-shirt for active lifestyles with custom prints",
        shortDescription: "Breathable sports tee with customization",
        sku: "TSH-004",
        price: 24.99,
        comparePrice: 29.99,
        quantity: 90,
        allowCustomPrint: true,
        printPrice: 6.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1551537482-eede9e79587c?w=500",
            altText: "Sports Performance Tee",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 12, discountType: "PERCENTAGE", discountValue: 10 },
        ],
      },
      {
        name: "Retro Style T-Shirt",
        slug: "retro-style-t-shirt",
        description: "Vintage-inspired t-shirt perfect for retro designs",
        shortDescription: "Retro t-shirt with custom print options",
        sku: "TSH-005",
        price: 21.99,
        comparePrice: 26.99,
        quantity: 70,
        allowCustomPrint: true,
        printPrice: 5.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=500",
            altText: "Retro Style T-Shirt",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 10, discountType: "PERCENTAGE", discountValue: 15 },
        ],
      },
      {
        name: "Eco-Friendly Cotton Tee",
        slug: "eco-friendly-cotton-tee",
        description:
          "Sustainable cotton t-shirt for eco-conscious customization",
        shortDescription: "Eco-friendly tee with custom prints",
        sku: "TSH-006",
        price: 23.99,
        comparePrice: 28.99,
        quantity: 85,
        allowCustomPrint: true,
        printPrice: 5.5,
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1522202176988-66273c2b6e3c?w=500",
            altText: "Eco-Friendly Cotton Tee",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 15, discountType: "PERCENTAGE", discountValue: 12 },
          { minQuantity: 30, discountType: "PERCENTAGE", discountValue: 20 },
        ],
      },
    ];

    for (const product of tshirtProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          sku: product.sku,
          price: product.price,
          comparePrice: product.comparePrice,
          quantity: product.quantity,
          allowCustomPrint: product.allowCustomPrint,
          printPrice: product.printPrice,
          status: "ACTIVE",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          categoryId: tshirtCategory.id,
          images: {
            create: product.images,
          },
          priceTiers: {
            create: product.priceTiers,
          },
        },
      });
    }
  }

  if (mugCategory) {
    const mugProducts = [
      {
        name: "Custom Photo Mug",
        slug: "custom-photo-mug",
        description: "Ceramic mug perfect for custom photos and designs",
        shortDescription: "Durable ceramic mug with photo printing",
        sku: "MUG-001",
        price: 12.99,
        comparePrice: 16.99,
        quantity: 50,
        allowCustomPrint: true,
        printPrice: 3.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500",
            altText: "Custom Photo Mug",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 10, discountType: "PERCENTAGE", discountValue: 12 },
        ],
      },
      {
        name: "Personalized Name Mug",
        slug: "personalized-name-mug",
        description: "Ceramic mug with personalized name printing",
        shortDescription: "Custom name mug for personal use",
        sku: "MUG-002",
        price: 13.99,
        comparePrice: 17.99,
        quantity: 60,
        allowCustomPrint: true,
        printPrice: 3.5,
        status: "ACTIVE",
        isActive: true,
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1514228742587-6b93b366f8c6?w=500",
            altText: "Personalized Name Mug",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 12, discountType: "PERCENTAGE", discountValue: 10 },
        ],
      },
      {
        name: "Quote Coffee Mug",
        slug: "quote-coffee-mug",
        description: "Inspirational quote mug for daily motivation",
        shortDescription: "Motivational quote mug",
        sku: "MUG-003",
        price: 11.99,
        comparePrice: 15.99,
        quantity: 70,
        allowCustomPrint: true,
        printPrice: 3.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1517412316723-8b2f74d28580?w=500",
            altText: "Quote Coffee Mug",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 10, discountType: "PERCENTAGE", discountValue: 15 },
        ],
      },
      {
        name: "Photo Collage Mug",
        slug: "photo-collage-mug",
        description: "Ceramic mug with space for multiple photo prints",
        shortDescription: "Mug with custom photo collage",
        sku: "MUG-004",
        price: 14.99,
        comparePrice: 18.99,
        quantity: 45,
        allowCustomPrint: true,
        printPrice: 4.0,
        status: "ACTIVE",
        isActive: true,
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500",
            altText: "Photo Collage Mug",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 15, discountType: "PERCENTAGE", discountValue: 12 },
          { minQuantity: 25, discountType: "PERCENTAGE", discountValue: 18 },
        ],
      },
      {
        name: "Minimalist Design Mug",
        slug: "minimalist-design-mug",
        description: "Sleek ceramic mug with minimalist custom designs",
        shortDescription: "Minimalist custom mug",
        sku: "MUG-005",
        price: 12.49,
        comparePrice: 16.49,
        quantity: 55,
        allowCustomPrint: true,
        printPrice: 3.5,
        status: "ACTIVE",
        isActive: true,
        isFeatured: false,
        images: [
          {
            url: "https://images.unsplash.com/photo-1544274411-3a3e06b4a6e9?w=500",
            altText: "Minimalist Design Mug",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 10, discountType: "PERCENTAGE", discountValue: 10 },
        ],
      },
      {
        name: "Vintage Style Mug",
        slug: "vintage-style-mug",
        description: "Retro-inspired ceramic mug for custom vintage prints",
        shortDescription: "Vintage mug with custom prints",
        sku: "MUG-006",
        price: 13.49,
        comparePrice: 17.49,
        quantity: 65,
        allowCustomPrint: true,
        printPrice: 3.5,
        status: "ACTIVE",
        isActive: true,
        isFeatured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1512438248242-9f8f1a3d8b0e?w=500",
            altText: "Vintage Style Mug",
            isMain: true,
            sortOrder: 0,
          },
        ],
        priceTiers: [
          { minQuantity: 12, discountType: "PERCENTAGE", discountValue: 12 },
        ],
      },
    ];

    for (const product of mugProducts) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          sku: product.sku,
          price: product.price,
          comparePrice: product.comparePrice,
          quantity: product.quantity,
          allowCustomPrint: product.allowCustomPrint,
          printPrice: product.printPrice,
          status: "ACTIVE",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          categoryId: mugCategory.id,
          images: {
            create: product.images,
          },
          priceTiers: {
            create: product.priceTiers,
          },
        },
      });
    }
  }

  // Create system settings
  const settings = [
    { key: "SITE_NAME", value: "Souvenir Shop", type: "STRING" },
    {
      key: "SITE_DESCRIPTION",
      value: "Your one-stop shop for custom souvenirs",
      type: "STRING",
    },
    { key: "CURRENCY", value: "USD", type: "STRING" },
    { key: "TAX_RATE", value: "0.08", type: "NUMBER" },
    { key: "SHIPPING_RATE", value: "5.99", type: "NUMBER" },
    { key: "FREE_SHIPPING_THRESHOLD", value: "50.00", type: "NUMBER" },
    {
      key: "BANK_ACCOUNT_INFO",
      value: JSON.stringify({
        accountNumber: "1234567890",
        bankName: "Example Bank",
        accountName: "Souvenir Shop LLC",
        routingNumber: "123456789",
      }),
      type: "JSON",
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
