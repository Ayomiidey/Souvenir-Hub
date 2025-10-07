import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/faq/categories - Get all FAQ categories
export async function GET() {
  try {
    const categories = await prisma.fAQCategory.findMany({
      include: {
        faqs: {
          where: { isActive: true },
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
    });

    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch FAQ categories' },
      { status: 500 }
    );
  }
}

// POST /api/faq/categories - Create new FAQ category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, order = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category name already exists
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category name already exists' },
        { status: 409 }
      );
    }

    const category = await prisma.fAQCategory.create({
      data: {
        name,
        description,
        order
      },
      include: {
        faqs: true
      }
    });

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating FAQ category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create FAQ category' },
      { status: 500 }
    );
  }
}