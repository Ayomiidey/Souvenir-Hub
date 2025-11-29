import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch About Us content
export async function GET() {
  try {
    const about = await prisma.aboutUs.findFirst({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(about || null);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch About Us content.' }, { status: 500 });
  }
}

// POST: Create About Us content (admin only)
export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    const about = await prisma.aboutUs.create({ data: { content } });
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: 'Failed to create About Us content.' }, { status: 500 });
  }
}

// PATCH: Update About Us content (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const { id, content } = await req.json();
    const about = await prisma.aboutUs.update({ where: { id }, data: { content } });
    return NextResponse.json(about);
  } catch {
    return NextResponse.json({ error: 'Failed to update About Us content.' }, { status: 500 });
  }
}

// DELETE: Delete About Us content (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await prisma.aboutUs.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete About Us content.' }, { status: 500 });
  }
}
