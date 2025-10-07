import prisma from '../lib/prisma';

async function seedFAQData() {
  try {
    console.log('Seeding FAQ data...');

    // Create FAQ categories
    const categories = await Promise.all([
      prisma.fAQCategory.upsert({
        where: { name: 'Orders & Shipping' },
        update: {},
        create: {
          name: 'Orders & Shipping',
          description: 'Questions about ordering and delivery',
          order: 1
        }
      }),
      prisma.fAQCategory.upsert({
        where: { name: 'Returns & Exchanges' },
        update: {},
        create: {
          name: 'Returns & Exchanges',
          description: 'Information about returns and exchanges', 
          order: 2
        }
      }),
      prisma.fAQCategory.upsert({
        where: { name: 'Products' },
        update: {},
        create: {
          name: 'Products',
          description: 'Questions about our souvenir products',
          order: 3
        }
      }),
      prisma.fAQCategory.upsert({
        where: { name: 'Account & Support' },
        update: {},
        create: {
          name: 'Account & Support', 
          description: 'Account management and customer support',
          order: 4
        }
      })
    ]);

    console.log('Created categories:', categories.length);

    // Create FAQs
    const faqs = [
      {
        categoryName: 'Orders & Shipping',
        question: 'How long does shipping take?',
        answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available for faster delivery.',
        order: 1
      },
      {
        categoryName: 'Orders & Shipping',
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship internationally to most countries. International shipping times vary by destination, typically 7-14 business days.',
        order: 2
      },
      {
        categoryName: 'Returns & Exchanges',
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase. Items must be in original condition with tags attached.',
        order: 1
      },
      {
        categoryName: 'Products',
        question: 'Are your products customizable?',
        answer: 'Yes, many of our souvenir products can be customized with names, dates, or special messages. Look for the "Customize" option on product pages.',
        order: 1
      }
    ];

    for (const faqData of faqs) {
      const category = categories.find(cat => cat.name === faqData.categoryName);
      if (category) {
        await prisma.fAQ.upsert({
          where: { 
            id: `seed-${faqData.categoryName.toLowerCase().replace(/\s+/g, '-')}-${faqData.order}`
          },
          update: {},
          create: {
            id: `seed-${faqData.categoryName.toLowerCase().replace(/\s+/g, '-')}-${faqData.order}`,
            question: faqData.question,
            answer: faqData.answer,
            order: faqData.order,
            categoryId: category.id
          }
        });
      }
    }

    console.log('Seeded FAQs successfully!');
  } catch (error) {
    console.error('Error seeding FAQ data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedFAQData();