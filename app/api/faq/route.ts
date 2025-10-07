import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/faq - Get all FAQs with categories
export async function GET() {
  try {
    const [faqs, categories] = await Promise.all([
      prisma.fAQ.findMany({
        include: {
          category: true
        },
        orderBy: [
          { category: { order: 'asc' } },
          { order: 'asc' },
          { createdAt: 'asc' }
        ]
      }),
      prisma.fAQCategory.findMany({
        include: {
          faqs: {
            orderBy: [
              { order: 'asc' },
              { createdAt: 'asc' }
            ]
          }
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'asc' }
        ]
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        faqs,
        categories
      }
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}

// POST /api/faq - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, categoryId, order = 0 } = body;

    if (!question || !answer || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Question, answer, and category are required' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.fAQCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        categoryId,
        order
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      data: faq,
      message: 'FAQ created successfully'
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}