import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/faq/categories/[id] - Update FAQ category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, order, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if name is taken by another category
    const nameConflict = await prisma.fAQCategory.findFirst({
      where: {
        name,
        id: { not: id }
      }
    });

    if (nameConflict) {
      return NextResponse.json(
        { success: false, message: 'Category name already exists' },
        { status: 409 }
      );
    }

    const updatedCategory = await prisma.fAQCategory.update({
      where: { id },
      data: {
        name,
        description,
        order,
        isActive
      },
      include: {
        faqs: {
          orderBy: [
            { order: 'asc' },
            { createdAt: 'asc' }
          ]
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating FAQ category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update FAQ category' },
      { status: 500 }
    );
  }
}

// DELETE /api/faq/categories/[id] - Delete FAQ category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category exists
    const existingCategory = await prisma.fAQCategory.findUnique({
      where: { id },
      include: {
        faqs: true
      }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has FAQs
    if (existingCategory.faqs.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot delete category with existing FAQs. Please move or delete the ${existingCategory.faqs.length} FAQ(s) first.` 
        },
        { status: 400 }
      );
    }

    await prisma.fAQCategory.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete FAQ category' },
      { status: 500 }
    );
  }
}