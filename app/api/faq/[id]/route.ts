import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT /api/faq/[id] - Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { question, answer, categoryId, order, isActive } = body;

    if (!question || !answer || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Question, answer, and category are required' },
        { status: 400 }
      );
    }

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFaq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
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

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        categoryId,
        order,
        isActive
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedFaq,
      message: 'FAQ updated successfully'
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE /api/faq/[id] - Delete FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if FAQ exists
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id }
    });

    if (!existingFaq) {
      return NextResponse.json(
        { success: false, message: 'FAQ not found' },
        { status: 404 }
      );
    }

    await prisma.fAQ.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}