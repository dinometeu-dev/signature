import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all experience blocks
export async function GET() {
  try {
    const blocks = await prisma.experienceBlock.findMany({
      include: { periods: true },
    });
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch experience blocks: ${error}` },
      { status: 500 }
    );
  }
}

// POST create a new experience block
export async function POST(req: Request) {
  try {
    const { companyName, iconPath, alt, location } = await req.json();

    if (!companyName || !iconPath || !alt || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const block = await prisma.experienceBlock.create({
      data: { companyName, iconPath, alt, location },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create experience block: ${error}` },
      { status: 500 }
    );
  }
}

// PATCH update an existing experience block
export async function PATCH(req: Request) {
  try {
    const { id, companyName, iconPath, alt, location } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = await prisma.experienceBlock.update({
      where: { id },
      data: { companyName, iconPath, alt, location },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update experience block: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE an experience block by query parameter ?id=1
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    await prisma.experienceBlock.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Experience block deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete experience block: ${error}` },
      { status: 500 }
    );
  }
}
