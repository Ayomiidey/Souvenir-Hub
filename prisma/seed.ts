import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

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
        await prisma.category.upsert({
          where: { slug: childData.slug },
          update: {},
          create: {
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
    const tshirtProduct = await prisma.product.create({
      data: {
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
        categoryId: tshirtCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
              altText: "Custom Print T-Shirt",
              isMain: true,
              sortOrder: 0,
            },
          ],
        },
        priceTiers: {
          create: [
            {
              minQuantity: 10,
              discountType: "PERCENTAGE",
              discountValue: 10,
            },
            {
              minQuantity: 20,
              discountType: "PERCENTAGE",
              discountValue: 15,
            },
          ],
        },
      },
    });
  }

  if (mugCategory) {
    await prisma.product.create({
      data: {
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
        categoryId: mugCategory.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500",
              altText: "Custom Photo Mug",
              isMain: true,
              sortOrder: 0,
            },
          ],
        },
        priceTiers: {
          create: [
            {
              minQuantity: 10,
              discountType: "PERCENTAGE",
              discountValue: 12,
            },
          ],
        },
      },
    });
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
